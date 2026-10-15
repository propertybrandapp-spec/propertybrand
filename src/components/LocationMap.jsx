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
export default function LocationMap({
  latitude,
  longitude,
  label,
  locationQuery = "",
  className = "",
  addressVisibility = "Exact Address",
  listingId = ""
}) {
  if (addressVisibility === "Locality Only") return null;

  const hasCoords = latitude != null && longitude != null;
  const isApproximate = addressVisibility === "Approximate Location";

  // Compute position or query for Google Maps embed
  let embedUrl = "";
  let externalMapUrl = "";

  if (hasCoords) {
    const position = isApproximate ? approximateOffset(latitude, longitude, listingId) : [latitude, longitude];
    embedUrl = `https://maps.google.com/maps?q=${position[0]},${position[1]}&hl=en&z=${isApproximate ? 14 : 16}&output=embed`;
    externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`;
  } else {
    const query = locationQuery || label;
    if (query) {
      embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=15&output=embed`;
      externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }
  }

  if (!embedUrl) return null;

  return (
    <div className={`rounded-2xl overflow-hidden relative group ${className}`} style={{ border: "1px solid #E2E8F0", height: 280 }}>
      <iframe
        title="Google Map Location"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
      />
      {externalMapUrl && (
        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition hover:opacity-95"
          style={{ background: "#FFFFFF", color: "#1565C0", border: "1px solid #E2E8F0" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in Google Maps
        </a>
      )}
      {isApproximate && (
        <div className="absolute top-3 left-3 z-10 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm" style={{ background: "rgba(255,255,255,0.95)", color: "#475569" }}>
          Approximate Area
        </div>
      )}
    </div>
  );
}
