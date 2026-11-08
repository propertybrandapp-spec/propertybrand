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
  const units = property.unitConfigs || [];
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
        <div data-testid="unit-sizes">
          <h3 className="text-sm font-bold mb-3" style={{ color: "#1F2937" }}>Sizes available in this project</h3>
          <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #E2E8F0" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#6B7280" }} className="text-[11px] uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-bold">Size</th>
                  <th className="text-left px-4 py-2.5 font-bold">Area</th>
                  <th className="text-left px-4 py-2.5 font-bold">Price</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {units.map((u, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td className="px-4 py-3 font-bold" style={{ color: "#1F2937" }}>{u.label}</td>
                    <td className="px-4 py-3" style={{ color: "#1F2937" }}>{u.areaSqft ? `${u.areaSqft.toLocaleString("en-IN")} sq ft` : "—"}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "#1565C0" }}>{u.price ? formatPrice(u.price) : "On request"}</td>
                    <td className="px-4 py-3 text-right">
                      {onEnquire && <button type="button" onClick={() => onEnquire(u)} className="text-xs font-bold hover:underline" style={{ color: "#1565C0" }}>Enquire</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
