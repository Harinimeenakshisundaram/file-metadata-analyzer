import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export  default function ForensicMap({ lat, lon }) {

    if (lat == null || lon == null) return null;


  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Geolocation Map</h3>

      <MapContainer
        center={[lat, lon]}
        zoom={13}
        style={{ height: window.innerWidth < 600 ? "250px" : "400px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            GPS Location <br /> {lat}, {lon}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
