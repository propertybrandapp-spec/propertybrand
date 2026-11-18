import React from "react";
import { cleanTrend, trendChange, handoverText, formatPrice } from "../lib/unitSizes";

// "Project overview" block for the property page: handover timeline, every size
// the project offers, and the price-per-sqft trend of the location.

function TrendChart({ points }) {
  const W = 360, H = 130, padL = 44, padR = 12, padT = 14, padB = 26;
  const vals = points.map((p) => p.pricePerSqft);
  const min = Math.min(...vals), max = Math.max(...vals);
  const lo = min === max ? min * 0.9 : min - (max - min) * 0.15;
  const hi = min === max ? max * 1.1 : max + (max - min) * 0.15;
  const x = (i) => padL + (points.length === 1 ? (W - padL - padR) / 2 : (i * (W - padL - padR)) / (points.length - 1));
  const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.pricePerSqft).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md" role="img" aria-label="Price per square foot over time">
      {[lo, (lo + hi) / 2, hi].map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="#E2E8F0" strokeWidth="1" />
          <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#6B7280">₹{Math.round(v).toLocaleString("en-IN")}</text>
        </g>
      ))}
      <path d={path} fill="none" stroke="#1565C0" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.pricePerSqft)} r="3.5" fill="#1565C0" />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#6B7280">{p.period}</text>
        </g>
      ))}
    </svg>
  );
}

export default function ProjectHighlights({ property, comparable, onEnquire }) {
  let units = property.unitConfigs || [];
  // Fallback: If no multi-unit configs exist yet, synthesize one from the property's own BHK, CA, BUA, SA, and price
  if (units.length === 0 && (property.carpetArea || property.builtUpArea || property.superBuiltUpArea || property.area || property.price)) {
    units = [{
      label: property.bhkLabel || property.type || "Unit",
      carpetArea: property.carpetArea,
      builtUpArea: property.builtUpArea,
      superArea: property.superBuiltUpArea || (property.area ? parseInt(property.area, 10) || null : null),
      areaSqft: property.superBuiltUpArea || property.builtUpArea || property.carpetArea,
      price: null,
      priceRange: property.price || "Price on Request",
    }];
  }

  const handover = handoverText(property.handoverDate, property.handoverTimeline);
  const trend = cleanTrend(property.priceTrend);
  const change = trendChange(trend);
  if (!units.length && !handover.length && trend.length < 2) return null;

  return (
    <div className="mb-8 space-y-6" data-testid="project-highlights">
      {handover.length > 0 && (
        <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "#F0F9FF", border: "1px solid #BAE6FD" }} data-testid="handover">
          <span className="text-lg" aria-hidden>🗓️</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#0369A1" }}>Handover timeline</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: "#1F2937" }}>{handover[0]}</p>
            {handover[1] && <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{handover[1]}</p>}
          </div>
        </div>
      )}

      {units.length > 0 && (
        <div data-testid="unit-sizes" className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="text-base font-bold" style={{ color: "#1F2937" }}>Available Configurations &amp; Sizes</h3>
            <span className="text-xs font-medium text-slate-500">CA: Carpet · BUA: Built-up · SA: Sale / Super Area</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#475569" }} className="text-[11px] uppercase tracking-wide border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-bold">Size / Config</th>
                  <th className="text-left px-4 py-3 font-bold">Carpet Area (CA)</th>
                  <th className="text-left px-4 py-3 font-bold">Built-up (BUA)</th>
                  <th className="text-left px-4 py-3 font-bold">Sale Area (SA)</th>
                  <th className="text-left px-4 py-3 font-bold">Price / Range</th>
                  <th className="px-4 py-3 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {units.map((u, i) => {
                  const ca = u.carpetArea ? `${Number(u.carpetArea).toLocaleString("en-IN")} sqft` : "—";
                  const bua = u.builtUpArea ? `${Number(u.builtUpArea).toLocaleString("en-IN")} sqft` : "—";
                  const sa = (u.superArea || u.areaSqft) ? `${Number(u.superArea || u.areaSqft).toLocaleString("en-IN")} sqft` : "—";
                  const priceDisplay = u.priceRange || (u.price ? formatPrice(u.price) : "Price on Request");

                  return (
                    <tr key={i} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mr-1.5 border border-blue-100 inline-block">
                          {u.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">{ca}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">{bua}</td>
                      <td className="px-4 py-3 text-slate-900 font-semibold whitespace-nowrap">{sa}</td>
                      <td className="px-4 py-3 font-bold text-[#1565C0] whitespace-nowrap">{priceDisplay}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {onEnquire && (
                          <button
                            type="button"
                            onClick={() => onEnquire(u)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1565C0] hover:bg-[#0D47A1] text-white transition shadow-xs cursor-pointer"
                          >
                            Enquire
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
            <span><strong>CA</strong> (Carpet Area): Net usable floor area</span>
            <span><strong>BUA</strong> (Built-up Area): Carpet area + wall thickness</span>
            <span><strong>SA</strong> (Sale Area): Super built-up area including common amenities</span>
          </div>
        </div>
      )}

      {trend.length >= 2 && (
        <div data-testid="price-trend">
          <h3 className="text-sm font-bold mb-1" style={{ color: "#1F2937" }}>Price trend in {property.locality || property.city || "this location"}</h3>
          <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
            Average price per sq ft, {trend[0].period} → {trend[trend.length - 1].period}
            {change && (
              <span className="font-bold ml-1.5" style={{ color: change.changePct >= 0 ? "#16A34A" : "#DC2626" }}>
                {change.changePct >= 0 ? "▲" : "▼"} {Math.abs(change.changePct)}%
              </span>
            )}
          </p>
          <TrendChart points={trend} />
          <p className="text-[11px] mt-2" style={{ color: "#6B7280" }}>
            Figures are provided by the lister / PropertyBrands team and are indicative, not a valuation.
            {comparable ? ` Other listings nearby currently average ₹${comparable.avg.toLocaleString("en-IN")}/sq ft.` : ""}
          </p>
        </div>
      )}
    </div>
  );
}
