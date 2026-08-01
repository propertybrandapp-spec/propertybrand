import { useState } from "react";
import { useSavedItems } from "../lib/SavedItemsContext";
import { useCompare } from "../lib/CompareContext";

export default function QuickViewModal({ property, onClose, onViewDetails }) {
  const [activeImage, setActiveImage] = useState(0);
  const { isPropertySaved, toggleSaveProperty } = useSavedItems();
  const { isComparing, toggleCompare, items, maxCompare } = useCompare();

  if (!property) return null;
  const id = property.dbId || property.id;
  const images = property.images?.length ? property.images : [];
  const compareFull = items.length >= maxCompare && !isComparing(id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(15,23,42,0.6)" }} onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {images.length > 0 ? (
            <img src={images[activeImage]} alt={property.title} className="w-full h-56 sm:h-72 object-cover sm:rounded-t-2xl" />
          ) : (
            <div className="w-full h-56 sm:h-72 flex items-center justify-center text-sm sm:rounded-t-2xl" style={{ background: "#F1F5F9", color: "#6B7280" }}>
              No photos available yet
            </div>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(15,23,42,0.6)", color: "#FFFFFF" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {property.badge && (
            <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: property.badgeColor || "#1E88E5", color: "#FFFFFF" }}>
              {property.badge}
            </span>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.slice(0, 6).map((_, i) => (
                <button key={i} onClick={() => setActiveImage(i)} aria-label={`Photo ${i + 1}`}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: i === activeImage ? "#FFFFFF" : "rgba(255,255,255,0.5)" }} />
              ))}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-lg font-extrabold leading-tight" style={{ color: "#1F2937" }}>{property.title}</h2>
            {property.verified && (
              <span className="flex items-center gap-1 text-[10px] font-bold shrink-0 mt-1" style={{ color: "#1E88E5" }}>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified
              </span>
            )}
          </div>
          <p className="text-sm mb-3" style={{ color: "#6B7280" }}>{property.location}</p>
          <p className="text-2xl font-extrabold mb-4" style={{ color: "#1E88E5" }}>{property.price}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {[
              property.bhkLabel && { label: "Config", value: property.bhkLabel },
              property.area && { label: "Area", value: property.area },
              property.type && { label: "Type", value: property.type },
              property.status && { label: "Possession", value: property.status },
            ].filter(Boolean).map((f) => (
              <div key={f.label} className="rounded-lg p-2.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>{f.label}</p>
                <p className="text-xs font-bold mt-0.5 truncate" style={{ color: "#1F2937" }}>{f.value}</p>
              </div>
            ))}
          </div>

          {property.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {property.amenities.slice(0, 6).map((a) => (
                <span key={a} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#EFF6FF", color: "#1E88E5" }}>{a}</span>
              ))}
              {property.amenities.length > 6 && (
                <span className="text-[10px] font-semibold px-2.5 py-1" style={{ color: "#6B7280" }}>+{property.amenities.length - 6} more</span>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => onViewDetails(property)}
              className="flex-1 py-3 rounded-xl text-sm font-bold"
              style={{ background: "#1E88E5", color: "#FFFFFF" }}
            >
              View Full Details
            </button>
            <button
              onClick={() => toggleSaveProperty(property)}
              className="py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5"
              style={{ background: "#FFFFFF", color: isPropertySaved(id) ? "#1E88E5" : "#1F2937", border: "1px solid #E2E8F0" }}
            >
              {isPropertySaved(id) ? "♥ Saved" : "♡ Save"}
            </button>
            <button
              onClick={() => toggleCompare(property)}
              disabled={compareFull}
              className="py-3 px-4 rounded-xl text-sm font-bold disabled:opacity-50"
              style={{ background: isComparing(id) ? "#0F2D52" : "#FFFFFF", color: isComparing(id) ? "#FFFFFF" : "#1F2937", border: "1px solid #E2E8F0" }}
            >
              {isComparing(id) ? "✓ Comparing" : "+ Compare"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
