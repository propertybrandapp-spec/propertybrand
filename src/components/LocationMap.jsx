import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
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

// For "Approximate Location" visibility — nudges the pin a deterministic
// 150-350m in a listing-specific direction, so it never lands on the exact
// building but always lands in the same spot for the same listing (doesn't
// jump around between page loads/re-renders).
function approximateOffset(lat, lng, seed) {
  let hash = 0;
  const s = String(seed || "listing");
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  const angle = (hash % 360) * (Math.PI / 180);
  const distanceMeters = 150 + (hash % 200);
  const dLat = (distanceMeters * Math.cos(angle)) / 111320;
  const dLng = (distanceMeters * Math.sin(angle)) / (111320 * Math.cos((lat * Math.PI) / 180));
  return [lat + dLat, lng + dLng];
}

// Renders nothing if the listing has no pin set yet (older listings that
// only ever had a plain Google Maps link, or ones nobody's set a pin for),
// or if the listing's address visibility is set to "Locality Only" — callers
// should show a text-only locality/city note in that case instead of a map.
export default function LocationMap({ latitude, longitude, label, className = "", addressVisibility = "Exact Address", listingId = "" }) {
  if (latitude == null || longitude == null) return null;
  if (addressVisibility === "Locality Only") return null;

  const isApproximate = addressVisibility === "Approximate Location";
  const position = isApproximate ? approximateOffset(latitude, longitude, listingId) : [latitude, longitude];

  return (
    <div className={`rounded-2xl overflow-hidden ${className}`} style={{ border: "1px solid #E2E8F0", height: 280 }}>
      <MapContainer center={position} zoom={isApproximate ? 14 : 15} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isApproximate ? (
          <Circle center={position} radius={350} pathOptions={{ color: "#1E88E5", fillColor: "#1E88E5", fillOpacity: 0.15 }}>
            <Popup>Approximate area — exact address shared after inquiry</Popup>
          </Circle>
        ) : (
          <Marker position={position} icon={pinIcon("#1E88E5")}>
            {label && <Popup>{label}</Popup>}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
