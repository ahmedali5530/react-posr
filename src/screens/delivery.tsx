import { Layout } from "@/screens/partials/layout.tsx";
import { MapContainer, Marker, Popup, Rectangle, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";

export const Delivery = () => {
  const position = { lat: 31.512196, lng: 74.322242 };

  const deliveryArea: LatLngTuple[] = [
    [31.596725, 74.234419],
    [31.405349, 74.370240],
  ]

  const colorSettings = { color: 'black' }

  return (
    <Layout gap={false}>
      <MapContainer center={position} zoom={12} scrollWheelZoom={true} className="h-screen">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Rectangle pathOptions={colorSettings} bounds={deliveryArea}/>
        <Marker position={{ lat: 31.553091, lng: 74.301335 }}>
          <Popup>
            Kashif Ali<br/>
            03454527361
          </Popup>
        </Marker>
        <Marker position={{ lat: 31.502154, lng: 74.297890 }}>
          <Popup>
            Waseem sajid<br/>
            03336264140
          </Popup>
        </Marker>
        <Marker position={{ lat: 31.423671, lng: 74.297876 }}>
          <Popup>
            MiaTech<br/>
            03156264140
          </Popup>
        </Marker>
      </MapContainer>
    </Layout>
  )
}
