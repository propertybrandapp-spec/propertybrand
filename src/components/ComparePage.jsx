import { useCompare } from "../lib/CompareContext";
import { useSavedItems } from "../lib/SavedItemsContext";

const ROWS = [
  { label: "Price", get: (p) => p.price },
  { label: "Transaction", get: (p) => p.transactionType },
  { label: "Location", get: (p) => p.location },
  { label: "Property Type", get: (p) => p.type },
  { label: "Configuration", get: (p) => p.bhkLabel || "—" },
  { label: "Area", get: (p) => p.area || "—" },
  { label: "Floor", get: (p) => p.floor || "—" },
  { label: "Facing", get: (p) => p.facing || "—" },
  { label: "Age", get: (p) => p.age || "—" },
  { label: "Possession", get: (p) => p.status || "—" },
  { label: "Posted By", get: (p) => p.postedBy || "—" },
];

function Check({ on }) {
  return on ? (
    <span className="inline-flex w-5 h-5 rounded-full items-center justify-center" style={{ background: "#F0FDF4" }}>
      <svg className="w-3 h-3" fill="none" stroke="#16A34A" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    </span>
  ) : (
    <span className="inline-flex w-5 h-5 rounded-full items-center justify-center" style={{ background: "#F1F5F9" }}>
      <svg className="w-3 h-3" fill="none" stroke="#6B7280" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </span>
  );
}

export default function ComparePage({ onNavigate }) {
  const { items, removeFromCompare, clearCompare } = useCompare();
  const { isPropertySaved, toggleSaveProperty } = useSavedItems();

  // Union of every amenity across the compared properties, so each row can
  // show a check/cross per property instead of just a dumped list per card.
  const allAmenities = Array.from(new Set(items.flatMap((p) => p.amenities || []))).sort();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <span className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ background: "#EFF6FF" }}>
          <svg className="w-7 h-7" fill="none" stroke="#1E88E5" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </span>
        <h1 className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>Nothing to compare yet</h1>
        <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
          Browse properties and tap "Compare" on any two or more listings — they'll show up here side by side.
        </p>
        <button onClick={() => onNavigate && onNavigate("search")} className="text-sm font-bold px-5 py-2.5 rounded-xl" style={{ background: "#1E88E5", color: "#FFFFFF" }}>
          Browse Properties
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1F2937" }}>Compare Properties</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{items.length} of 4 properties selected</p>
        </div>
        <button onClick={clearCompare} className="text-xs font-bold hover:underline" style={{ color: "#DC2626" }}>Clear All</button>
      </div>

      <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #E2E8F0" }}>
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 text-left p-3 text-xs font-bold uppercase tracking-wide w-36" style={{ background: "#F8FAFC", color: "#6B7280" }}>
                &nbsp;
              </th>
              {items.map((p) => (
                <th key={p.dbId || p.id} className="p-3 text-left align-top" style={{ background: "#F8FAFC", minWidth: 220 }}>
                  <div className="relative rounded-xl overflow-hidden mb-2">
                    <img src={p.images?.[0]} alt={p.title} className="w-full h-32 object-cover" />
                    <button
                      onClick={() => removeFromCompare(p.dbId || p.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "rgba(15,45,82,0.85)", color: "#FFFFFF" }}
                      aria-label={`Remove ${p.title}`}
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm font-bold leading-tight mb-2" style={{ color: "#1F2937" }}>{p.title}</p>
                  <button
                    onClick={() => onNavigate && onNavigate("property-detail", { property: p, pool: items })}
                    className="w-full text-xs font-bold py-2 rounded-lg mb-1.5"
                    style={{ background: "#1E88E5", color: "#FFFFFF" }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => toggleSaveProperty(p)}
                    className="w-full text-xs font-bold py-2 rounded-lg"
                    style={{ background: "#FFFFFF", color: isPropertySaved(p.dbId || p.id) ? "#1E88E5" : "#6B7280", border: "1px solid #E2E8F0" }}
                  >
                    {isPropertySaved(p.dbId || p.id) ? "Saved ♥" : "Save"}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.label} style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}>
                <td className="sticky left-0 z-10 p-3 text-xs font-bold" style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F8FAFC", color: "#6B7280" }}>
                  {row.label}
                </td>
                {items.map((p) => (
                  <td key={p.dbId || p.id} className="p-3 text-sm font-semibold" style={{ color: "#1F2937" }}>
                    {row.get(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ background: "#FFFFFF" }}>
              <td className="sticky left-0 z-10 p-3 text-xs font-bold" style={{ background: "#FFFFFF", color: "#6B7280" }}>Verified</td>
              {items.map((p) => (
                <td key={p.dbId || p.id} className="p-3"><Check on={p.verified} /></td>
              ))}
            </tr>
            {allAmenities.map((a, i) => (
              <tr key={a} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF" }}>
                <td className="sticky left-0 z-10 p-3 text-xs font-bold" style={{ background: i % 2 === 0 ? "#F8FAFC" : "#FFFFFF", color: "#6B7280" }}>{a}</td>
                {items.map((p) => (
                  <td key={p.dbId || p.id} className="p-3"><Check on={p.amenities?.includes(a)} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
