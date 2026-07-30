import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Custom pin — a plain inline SVG via divIcon instead of Leaflet's default
// marker image, which needs asset-path patching to survive Vite's bundling.
// Matches the site's existing inline-SVG icon style everywhere else too.
function pinIcon(color) {
  return L.divIcon({
    className: "",
    html: `<svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="6.5" fill="#FFFFFF"/>
    </svg>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -36],
  });
}

// Renders nothing if the listing has no pin set yet (older listings that
// only ever had a plain Google Maps link, or ones nobody's set a pin for).
export default function LocationMap({ latitude, longitude, label, className = "" }) {
  if (latitude == null || longitude == null) return null;
  const position = [latitude, longitude];

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`} style={{ border: "1px solid #E2E8F0", height: 280 }}>
      <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={pinIcon("#1E88E5")}>
          {label && <Popup>{label}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
