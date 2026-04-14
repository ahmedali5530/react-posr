import {useCallback, useEffect, useRef, useState} from "react";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {toast} from "sonner";
import {APIProvider, Map, useMap} from "@vis.gl/react-google-maps";

interface MapArea {
  type: string;
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

type EditableOverlay = google.maps.Polygon | google.maps.Rectangle | google.maps.Circle;

type GeoPolygonCoordinates = number[][][];
type GeoMultiPolygonCoordinates = number[][][][];

interface NormalizedGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: GeoPolygonCoordinates | GeoMultiPolygonCoordinates;
}

const DEFAULT_STYLE: google.maps.PolygonOptions = {
  strokeColor: "#3388ff",
  strokeOpacity: 0.9,
  strokeWeight: 2,
  fillColor: "#3388ff",
  fillOpacity: 0.2,
  clickable: true,
  editable: true,
  draggable: false
};

const DRAWING_POLYGON_STYLE: google.maps.PolygonOptions = {
  strokeColor: "#3388ff",
  strokeOpacity: 0.9,
  strokeWeight: 2,
  fillColor: "#3388ff",
  fillOpacity: 0.2
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const ringToPath = (ring: unknown): google.maps.LatLngLiteral[] | null => {
  if (!Array.isArray(ring)) return null;
  const path: google.maps.LatLngLiteral[] = [];

  for (const point of ring) {
    if (!Array.isArray(point) || point.length < 2) return null;
    const lng = toNumber(point[0]);
    const lat = toNumber(point[1]);
    if (lat === null || lng === null) return null;
    path.push({lat, lng});
  }

  return path.length > 2 ? path : null;
};

const normalizeAreaGeometry = (area: MapArea): NormalizedGeometry | null => {
  const candidate = area.type === "Feature" && (area as any).geometry ? (area as any).geometry : area.geometry ?? area;

  if (!candidate || typeof candidate !== "object") return null;
  const geometryType = (candidate as any).type;
  const coordinates = (candidate as any).coordinates;

  if ((geometryType === "Polygon" || geometryType === "MultiPolygon") && Array.isArray(coordinates)) {
    return {type: geometryType, coordinates};
  }

  if (area.type === "Polygon" && Array.isArray((area as any).coordinates)) {
    return {type: "Polygon", coordinates: (area as any).coordinates};
  }

  if (area.type === "MultiPolygon" && Array.isArray((area as any).coordinates)) {
    return {type: "MultiPolygon", coordinates: (area as any).coordinates};
  }

  return null;
};

const closeRing = (ring: number[][]): number[][] => {
  if (ring.length < 3) return ring;
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (firstLng === lastLng && firstLat === lastLat) return ring;
  return [...ring, [firstLng, firstLat]];
};

const circleToPolygonGeometry = (circle: google.maps.Circle): MapArea["geometry"] | null => {
  const center = circle.getCenter();
  const radius = circle.getRadius();
  if (!center || !Number.isFinite(radius)) return null;

  const points = 64;
  const coordinates: number[][] = [];

  for (let i = 0; i <= points; i++) {
    const angle = (i * 360) / points;
    const rad = (angle * Math.PI) / 180;
    const lat = center.lat() + (radius / 111320) * Math.cos(rad);
    const lng = center.lng() + (radius / (111320 * Math.cos((center.lat() * Math.PI) / 180))) * Math.sin(rad);
    coordinates.push([lng, lat]);
  }

  return {
    type: "Polygon",
    coordinates: [coordinates]
  };
};

const overlayToArea = (overlay: EditableOverlay): MapArea | null => {
  if (overlay instanceof google.maps.Polygon) {
    const rings: number[][][] = [];
    const paths = overlay.getPaths();
    for (let i = 0; i < paths.getLength(); i++) {
      const path = paths.getAt(i);
      const ring: number[][] = [];
      for (let j = 0; j < path.getLength(); j++) {
        const point = path.getAt(j);
        ring.push([point.lng(), point.lat()]);
      }
      if (ring.length >= 3) rings.push(closeRing(ring));
    }

    if (!rings.length) return null;
    return {type: "Polygon", geometry: {type: "Polygon", coordinates: rings}};
  }

  if (overlay instanceof google.maps.Rectangle) {
    const bounds = overlay.getBounds();
    if (!bounds) return null;

    const north = bounds.getNorthEast().lat();
    const east = bounds.getNorthEast().lng();
    const south = bounds.getSouthWest().lat();
    const west = bounds.getSouthWest().lng();

    return {
      type: "Polygon",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south]
        ]]
      }
    };
  }

  if (overlay instanceof google.maps.Circle) {
    const geometry = circleToPolygonGeometry(overlay);
    if (!geometry) return null;
    return {type: "Polygon", geometry};
  }

  return null;
};

interface DeliveryAreasEditorProps {
  mapAreas: MapArea[];
  onSaveAreas: (areas: MapArea[]) => Promise<void>;
}

const DeliveryAreasEditor = ({mapAreas, onSaveAreas}: DeliveryAreasEditorProps) => {
  const map = useMap();
  const overlaysRef = useRef<Set<EditableOverlay>>(new Set());
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const selectedOverlayRef = useRef<EditableOverlay | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedVersion, setSelectedVersion] = useState(0);

  const clearListeners = useCallback(() => {
    listenersRef.current.forEach((listener) => listener.remove());
    listenersRef.current = [];
  }, []);

  const resetOverlaySelectionStyle = useCallback((overlay: EditableOverlay) => {
    if (overlay instanceof google.maps.Polygon) {
      overlay.setOptions({...DEFAULT_STYLE});
    }
  }, []);

  const applyOverlaySelectionStyle = useCallback((overlay: EditableOverlay) => {
    if (overlay instanceof google.maps.Polygon) {
      overlay.setOptions({
        ...DEFAULT_STYLE,
        strokeColor: "#1d4ed8",
        fillColor: "#60a5fa"
      });
    }
  }, []);

  const setSelectedOverlay = useCallback(
    (overlay: EditableOverlay | null) => {
      if (selectedOverlayRef.current && selectedOverlayRef.current !== overlay) {
        resetOverlaySelectionStyle(selectedOverlayRef.current);
      }

      selectedOverlayRef.current = overlay;
      if (overlay) applyOverlaySelectionStyle(overlay);
      setSelectedVersion((v) => v + 1);
    },
    [applyOverlaySelectionStyle, resetOverlaySelectionStyle]
  );

  const serializeAndSave = useCallback(async () => {
    const areas: MapArea[] = [];
    overlaysRef.current.forEach((overlay) => {
      const area = overlayToArea(overlay);
      if (area) areas.push(area);
    });

    await onSaveAreas(areas);
  }, [onSaveAreas]);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      serializeAndSave().catch((error) => {
        console.error("Error saving delivery areas:", error);
        toast.error("Failed to save map areas");
      });
    }, 300);
  }, [serializeAndSave]);

  const addOverlay = useCallback(
    (overlay: EditableOverlay) => {
      overlaysRef.current.add(overlay);

      if (overlay instanceof google.maps.Polygon) {
        overlay.setOptions({...DEFAULT_STYLE});
      } else if (overlay instanceof google.maps.Rectangle || overlay instanceof google.maps.Circle) {
        overlay.setOptions({...DEFAULT_STYLE});
      }

      listenersRef.current.push(
        overlay.addListener("click", () => {
          setSelectedOverlay(overlay);
        })
      );

      if (overlay instanceof google.maps.Polygon) {
        const paths = overlay.getPaths();
        for (let i = 0; i < paths.getLength(); i++) {
          const path = paths.getAt(i);
          listenersRef.current.push(path.addListener("set_at", scheduleSave));
          listenersRef.current.push(path.addListener("insert_at", scheduleSave));
          listenersRef.current.push(path.addListener("remove_at", scheduleSave));
        }
      }

      if (overlay instanceof google.maps.Rectangle) {
        listenersRef.current.push(overlay.addListener("bounds_changed", scheduleSave));
      }

      if (overlay instanceof google.maps.Circle) {
        listenersRef.current.push(overlay.addListener("center_changed", scheduleSave));
        listenersRef.current.push(overlay.addListener("radius_changed", scheduleSave));
      }
    },
    [scheduleSave, setSelectedOverlay]
  );

  useEffect(() => {
    if (!map || !globalThis.google?.maps) return;
    const drawing = google.maps.drawing;
    if (!drawing?.DrawingManager) return;

    const drawingManager = new drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
        drawingModes: [
          drawing.OverlayType.POLYGON,
          drawing.OverlayType.RECTANGLE,
          drawing.OverlayType.CIRCLE
        ]
      },
      polygonOptions: {
        ...DEFAULT_STYLE,
        ...DRAWING_POLYGON_STYLE
      },
      rectangleOptions: {
        ...DEFAULT_STYLE,
        ...DRAWING_POLYGON_STYLE,
        editable: true
      },
      circleOptions: {
        ...DEFAULT_STYLE,
        ...DRAWING_POLYGON_STYLE,
        editable: true
      }
    });

    drawingManager.setMap(map);
    listenersRef.current.push(
      drawingManager.addListener("overlaycomplete", (event: google.maps.drawing.OverlayCompleteEvent) => {
        addOverlay(event.overlay as EditableOverlay);
        drawingManager.setDrawingMode(null);
        scheduleSave();
      })
    );

    listenersRef.current.push(
      map.addListener("click", () => {
        setSelectedOverlay(null);
      })
    );

    return () => {
      drawingManager.setMap(null);
    };
  }, [addOverlay, map, scheduleSave, setSelectedOverlay]);

  useEffect(() => {
    if (!map || !globalThis.google?.maps) return;

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current.clear();
    setSelectedOverlay(null);

    for (const area of mapAreas) {
      const normalized = normalizeAreaGeometry(area);
      if (!normalized) continue;

      if (normalized.type === "Polygon") {
        const paths = (normalized.coordinates as GeoPolygonCoordinates)
          .map(ringToPath)
          .filter((path): path is google.maps.LatLngLiteral[] => path !== null);
        if (!paths.length) continue;

        const polygon = new google.maps.Polygon({
          ...DEFAULT_STYLE,
          paths,
          map
        });
        addOverlay(polygon);
        continue;
      }

      for (const polygonCoordinates of normalized.coordinates as GeoMultiPolygonCoordinates) {
        const paths = polygonCoordinates
          .map(ringToPath)
          .filter((path): path is google.maps.LatLngLiteral[] => path !== null);
        if (!paths.length) continue;

        const polygon = new google.maps.Polygon({
          ...DEFAULT_STYLE,
          paths,
          map
        });
        addOverlay(polygon);
      }
    }
  }, [addOverlay, map, mapAreas, setSelectedOverlay]);

  useEffect(() => {
    return () => {
      clearListeners();
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current.clear();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [clearListeners]);

  const deleteSelectedOverlay = useCallback(() => {
    const selectedOverlay = selectedOverlayRef.current;
    if (!selectedOverlay) return;
    selectedOverlay.setMap(null);
    overlaysRef.current.delete(selectedOverlay);
    setSelectedOverlay(null);
    scheduleSave();
  }, [scheduleSave, setSelectedOverlay]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      if (!selectedOverlayRef.current) return;
      event.preventDefault();
      deleteSelectedOverlay();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteSelectedOverlay]);

  return (
    <button
      type="button"
      className={`absolute top-3 right-3 z-10 px-3 py-2 rounded-md text-sm font-medium border ${
        selectedOverlayRef.current
          ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
          : "bg-white text-neutral-400 border-neutral-300 cursor-not-allowed"
      }`}
      disabled={!selectedOverlayRef.current}
      onClick={deleteSelectedOverlay}
      key={selectedVersion}
    >
      Delete selected shape
    </button>
  );
};

export const DeliveryAreas = () => {
  const db = useDB();
  const [mapAreas, setMapAreas] = useState<MapArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState({lat: 0, lng: 0});

  // Load existing map areas from database
  useEffect(() => {
    const loadMapAreas = async () => {
      try {
        setLoading(true);
        const [r] = await db.query(
          `SELECT * FROM ${Tables.settings} WHERE key = 'map_center' LIMIT 1`
        );
        if (r.length > 0) {
          setCenter({
            lat: r[0].values.lat,
            lng: r[0].values.lng
          });
        }

        const [result] = await db.query(
          `SELECT * FROM ${Tables.settings} WHERE key = 'map_areas' LIMIT 1`
        );

        if (result.length > 0) {
          const setting = result[0];
          if (setting.values && Array.isArray(setting.values)) {
            setMapAreas(setting.values);
          }
        }
      } catch (error) {
        console.error("Error loading map areas:", error);
        toast.error("Failed to load map areas");
      } finally {
        setLoading(false);
      }
    };

    loadMapAreas();
  }, []);

  const saveMapAreas = useCallback(async (areas: MapArea[]) => {
    try {
      const [result] = await db.query(
        `SELECT * FROM ${Tables.settings} WHERE key = 'map_areas' LIMIT 1`
      );

      if (result.length > 0) {
        const setting = result[0];
        await db.merge(setting.id, {
          values: areas
        });
      } else {
        await db.create(Tables.settings, {
          key: "map_areas",
          values: areas,
          is_global: true
        });
      }

      setMapAreas(areas);
      toast.success("Map areas saved successfully");
    } catch (error) {
      console.error("Error saving map areas:", error);
      toast.error("Failed to save map areas");
    }
  }, [db]);

  return (
    <>
      <div className="p-4">
        <p className="text-xl text-neutral-600 mb-4">
          Draw areas on the map to define delivery zones. Use the drawing tools on the left to create polygons, rectangles, or circles.
        </p>
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh_-_70px)]">
            <div className="text-lg">Loading map areas...</div>
          </div>
        ) : (
          <div className="relative">
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["drawing"]}>
              <Map
                className="h-[calc(100vh_-_170px)] w-full rounded-lg border border-neutral-300"
                defaultCenter={center}
                defaultZoom={11}
                gestureHandling="greedy"
                disableDefaultUI
              >
                <DeliveryAreasEditor mapAreas={mapAreas} onSaveAreas={saveMapAreas}/>
              </Map>
            </APIProvider>
          </div>
        )}
      </div>
    </>
  );
};
