import { Layout } from "@/screens/partials/layout.tsx";
import { MapContainer, Marker, Popup, Rectangle, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { useDB } from "@/api/db/db.ts";
import { Tables } from "@/api/db/tables.ts";
import type { FeatureGroup as LeafletFeatureGroup } from "leaflet";
import L from "leaflet";
import { getInvoiceNumber } from "@/lib/order.ts";
import { DateTime } from "luxon";
import {useDeliveryOrders} from "@/hooks/useDeliveryOrders.ts";
import { useFetchDeliveryOrders } from "@/hooks/useFetchDeliveryOrders.ts";
import { DeliveryOrderPopup } from "@/components/delivery/delivery-order-popup.tsx";
import {OrderStatus} from "@/api/model/order.ts";

interface MapArea {
  type: string;
  geometry: {
    type: string;
    coordinates: any;
  };
}

export const Delivery = () => {
  const db = useDB();
  const { selectedOrder, openOrderPopup, closeOrderPopup, isPopupOpen } = useDeliveryOrders();
  const { deliveryOrders, refetch: fetchDeliveryOrders } = useFetchDeliveryOrders();
  const [mapAreas, setMapAreas] = useState<MapArea[]>([]);
  const [loading, setLoading] = useState(true);
  const featureGroupRef = useRef<LeafletFeatureGroup>(null);
  const [center, setCenter] = useState({lat: 0, lng: 0});

  // Create custom icon for delivery markers
  const deliveryIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const acceptedDeliveryIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const colorSettings = { color: 'black' }

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
      } finally {
        setLoading(false);
      }
    };

    loadMapAreas();
  }, []);

  // Draw existing areas on the map (readonly)
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
        L.geoJSON(geoJsonFeature, {
          style: {
            color: '#3388ff',
            weight: 4,
            opacity: 0.5,
            fillOpacity: 0.2
          }
        }).eachLayer((layer: any) => {
          featureGroup.addLayer(layer);
        });
      } catch (error) {
        console.error("Error adding area to map:", error, area);
      }
    });
  }, [mapAreas, loading]);

  useEffect(() => {
    fetchDeliveryOrders();
  }, []);

  if(loading){
    return;
  }

  return (
    <>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={true}
        className="h-[calc(100vh_-_70px_-_25px)] relative z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Delivery areas from settings (readonly) */}
        <FeatureGroup ref={featureGroupRef} />
        {/* Delivery order markers */}
        {deliveryOrders.filter(item => item.delivery?.onTheWay !== true)
          .map((order) => {
          const customer = order.customer;
          const delivery = order.delivery as any;
          
          // Check for location in delivery object first, then customer
          const lat = delivery?.lat || customer?.lat;
          const lng = delivery?.lng || customer?.lng;
          const address = delivery?.address || customer?.address;
          const name = customer?.name || "Unknown Customer";
          
          if (lat && lng) {
            return (
              <Marker
                key={order.id.toString()}
                position={[lat, lng] as LatLngTuple}
                icon={order.status === OrderStatus.Pending ? deliveryIcon : acceptedDeliveryIcon}
                eventHandlers={{
                  click: () => {
                    openOrderPopup(order);
                  }
                }}
              >
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
      {selectedOrder && (
        <DeliveryOrderPopup
          order={selectedOrder}
          open={isPopupOpen}
          onClose={() => {
            closeOrderPopup();
            fetchDeliveryOrders();
          }}
        />
      )}
    </>
  )
}
