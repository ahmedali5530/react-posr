import {Layout} from "@/screens/partials/layout.tsx";
import {MapContainer, TileLayer, FeatureGroup} from "react-leaflet";
import {EditControl} from "react-leaflet-draw";
import {useEffect, useRef, useState} from "react";
import {useDB} from "@/api/db/db.ts";
import {Tables} from "@/api/db/tables.ts";
import {toast} from "sonner";
import type {FeatureGroup as LeafletFeatureGroup} from "leaflet";
import {GeoJSON as GeoJSONType, GeoJsonObject, GeoJsonTypes} from "geojson";
import L from "leaflet";
import "leaflet-draw";
import "@/lib/leaflet-draw-patch";
import {StringRecordId} from "surrealdb";

interface MapArea {
  type: string;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export const DeliveryAreas = () => {
  const db = useDB();
  const [mapAreas, setMapAreas] = useState<MapArea[]>([]);
  const [loading, setLoading] = useState(true);
  const featureGroupRef = useRef<LeafletFeatureGroup>(null);
  const [center, setCenter] = useState({lat: 0, lng: 0});

  // Load existing map areas from database
  useEffect(() => {
    const loadMapAreas = async () => {
      try {
        setLoading(true);
        const [r] = await db.query(
          `SELECT * FROM ${Tables.settings} WHERE key = 'map_center' LIMIT 1`
        );
        if(r.length > 0){
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

  // Save map areas to database
  const saveMapAreas = async (areas: MapArea[]) => {
    try {
      // Check if setting already exists
      const [result] = await db.query(
        `SELECT * FROM ${Tables.settings} WHERE key = 'map_areas' LIMIT 1`
      );

      if (result.length > 0) {
        // Update existing setting
        const setting = result[0];
        await db.merge(setting.id, {
          values: areas
        });
      } else {
        // Create new setting
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
  };

  // Convert circle to polygon (circular polygon)
  const circleToPolygon = (layer: any) => {
    if (!(layer instanceof L.Circle)) {
      return null;
    }

    const center = layer.getLatLng();
    const radius = layer.getRadius();
    const points = 64; // Number of points to approximate circle

    const coordinates: number[][] = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i * 360) / points;
      const rad = (angle * Math.PI) / 180;
      const lat = center.lat + (radius / 111320) * Math.cos(rad); // 111320 meters per degree latitude
      const lng = center.lng + (radius / (111320 * Math.cos(center.lat * Math.PI / 180))) * Math.sin(rad);
      coordinates.push([lng, lat]);
    }

    return {
      type: "Polygon",
      coordinates: [coordinates]
    };
  };

  // Handle when a feature is created
  const onCreated = (e: any) => {
    const {layer} = e;
    
    let geometry: any;

    // Check if it's a circle and convert to polygon
    if (layer instanceof L.Circle) {
      geometry = circleToPolygon(layer);
      if (!geometry) {
        toast.error("Failed to process circle");
        return;
      }
    } else {
      const geoJson = layer.toGeoJSON();
      geometry = geoJson.geometry;
    }

    // Store the geometry, not the Feature wrapper
    const newArea: MapArea = {
      type: geometry.type,
      geometry: geometry
    };

    const updatedAreas = [...mapAreas, newArea];
    saveMapAreas(updatedAreas);
  };

  // Handle when a feature is edited
  const onEdited = () => {
    // Get all current layers from feature group
    const featureGroup = featureGroupRef.current;
    if (!featureGroup) return;

    const updatedAreas: MapArea[] = [];
    featureGroup.eachLayer((layer: any) => {
      let geometry: any;

      // Check if it's a circle and convert to polygon
      if (layer instanceof L.Circle) {
        geometry = circleToPolygon(layer);
        if (!geometry) return;
      } else {
        const geoJson = layer.toGeoJSON();
        geometry = geoJson.geometry;
      }

      // Store the geometry, not the Feature wrapper
      updatedAreas.push({
        type: geometry.type,
        geometry: geometry
      });
    });

    saveMapAreas(updatedAreas);
  };

  // Handle when a feature is deleted
  const onDeleted = () => {
    // Get all remaining layers from feature group
    const featureGroup = featureGroupRef.current;
    if (!featureGroup) return;

    const updatedAreas: MapArea[] = [];
    featureGroup.eachLayer((layer: any) => {
      let geometry: any;

      // Check if it's a circle and convert to polygon
      if (layer instanceof L.Circle) {
        geometry = circleToPolygon(layer);
        if (!geometry) return;
      } else {
        const geoJson = layer.toGeoJSON();
        geometry = geoJson.geometry;
      }

      // Store the geometry, not the Feature wrapper
      updatedAreas.push({
        type: geometry.type,
        geometry: geometry
      });
    });

    saveMapAreas(updatedAreas);
  };

  // Draw existing areas on the map
  useEffect(() => {
    if (!featureGroupRef.current || loading) return;

    const featureGroup = featureGroupRef.current;
    
    // Clear existing layers
    featureGroup.clearLayers();

    // Add existing areas to the map
    mapAreas.forEach((area) => {
      try {
        let geoJsonFeature: any;

        // Handle different data formats
        if (area.type === 'Feature') {
          // Already a Feature object - check if it has geometry
          if ((area as any).geometry) {
            geoJsonFeature = area;
          } else if ((area as any).coordinates) {
            // Feature without geometry but has coordinates directly (invalid but we'll fix it)
            geoJsonFeature = {
              type: "Feature",
              geometry: {
                type: 'Polygon', // default, might need to detect from coordinates
                coordinates: (area as any).coordinates
              },
              properties: {}
            };
          } else {
            console.warn("Feature object missing geometry and coordinates:", area);
            return;
          }
        } else if (area.geometry) {
          // New format with geometry object
          geoJsonFeature = {
            type: "Feature",
            geometry: area.geometry,
            properties: {}
          };
        } else if ((area as any).coordinates) {
          // Old format - try to reconstruct
          const geometryType = area.type || 'Polygon';
          geoJsonFeature = {
            type: "Feature",
            geometry: {
              type: geometryType,
              coordinates: (area as any).coordinates
            },
            properties: {}
          };
        } else {
          console.warn("Unknown area format:", area);
          return;
        }

        // Validate the GeoJSON structure
        if (!geoJsonFeature.geometry || !geoJsonFeature.geometry.type || !geoJsonFeature.geometry.coordinates) {
          console.error("Invalid GeoJSON structure:", geoJsonFeature);
          return;
        }

        // Use Leaflet's geoJSON method to add the feature
        L.geoJSON(geoJsonFeature).eachLayer((layer: any) => {
          featureGroup.addLayer(layer);
        });
      } catch (error) {
        console.error("Error adding area to map:", error, area);
      }
    });
  }, [mapAreas, loading]);

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
          <MapContainer
            center={center}
            zoom={11}
            scrollWheelZoom={true}
            className="h-[calc(100vh_-_170px)] w-full rounded-lg border border-neutral-300"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="topleft"
                onCreated={onCreated}
                onEdited={onEdited}
                onDeleted={onDeleted}
                draw={{
                  rectangle: {
                    showArea: false,
                    metric: false,
                    shapeOptions: {
                      color: '#3388ff',
                      weight: 4,
                      opacity: 0.5,
                      fillOpacity: 0.2
                    }
                  },
                  polygon: {
                    allowIntersection: false,
                    showArea: false,
                    metric: false,
                    shapeOptions: {
                      color: '#3388ff',
                      weight: 4,
                      opacity: 0.5,
                      fillOpacity: 0.2
                    }
                  },
                  circle: {
                    metric: false,
                    shapeOptions: {
                      color: '#3388ff',
                      weight: 4,
                      opacity: 0.5,
                      fillOpacity: 0.2
                    }
                  },
                  marker: false,
                  circlemarker: false,
                  polyline: false
                }}
                edit={{
                  remove: true
                }}
              />
            </FeatureGroup>
          </MapContainer>
        )}
      </div>
    </>
  );
};
