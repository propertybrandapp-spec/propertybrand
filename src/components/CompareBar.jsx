import { useCompare } from "../lib/CompareContext";

export default function CompareBar({ onNavigate }) {
  const { items, removeFromCompare, clearCompare } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
      <div
        className="max-w-3xl mx-auto rounded-2xl shadow-2xl pointer-events-auto flex items-center gap-3 px-4 py-3 flex-wrap"
        style={{ background: "#0F2D52", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {items.map((p) => (
            <div key={p.dbId || p.id} className="relative shrink-0">
              <img src={p.images?.[0]} alt={p.title} className="w-11 h-11 rounded-lg object-cover" />
              <button
                onClick={() => removeFromCompare(p.dbId || p.id)}
                aria-label={`Remove ${p.title} from compare`}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: "#DC2626", color: "#FFFFFF" }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold text-white/80 shrink-0 hidden sm:block">
          {items.length} propert{items.length === 1 ? "y" : "ies"} selected
        </p>

        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-white/70 hover:text-white shrink-0 hidden sm:block"
        >
          Clear
        </button>

        <button
          onClick={() => onNavigate && onNavigate("compare")}
          disabled={items.length < 2}
          className="text-sm font-bold px-4 py-2 rounded-xl shrink-0 disabled:opacity-50"
          style={{ background: "#1E88E5", color: "#FFFFFF" }}
        >
          Compare {items.length >= 2 ? `(${items.length})` : ""}
        </button>
      </div>
    </div>
  );
}
