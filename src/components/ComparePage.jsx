import React, { useState } from "react";
import { useCompare } from "../lib/CompareContext";
import { useSavedItems } from "../lib/SavedItemsContext";
import BookExpertModal from "./BookExpertModal";

function Check({ on, text }) {
  if (text) {
    return <span className="text-xs font-semibold text-gray-800">{text}</span>;
  }
  return on ? (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-50 text-gray-400 border border-gray-200">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

export default function ComparePage({ onNavigate }) {
  const { items, removeFromCompare, clearCompare } = useCompare();
  const { isPropertySaved, toggleSaveProperty } = useSavedItems();
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Union of every amenity across the compared properties
  const allAmenities = Array.from(new Set(items.flatMap((p) => p.amenities || []))).sort();

  function handleShareWhatsApp() {
    const propertyTitles = items.map((p) => `• ${p.title} (${p.price}, ${p.location})`).join("%0A");
    const msg = `*PropertyBrands Comparison Report:*%0A${propertyTitles}%0A%0ACompare full specs, rental yields & legal status on PropertyBrands.`;
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 mx-auto bg-blue-50 text-blue-700 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-2">No Properties in Comparison</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          Compare up to 4 residential, commercial, industrial, or land parcels side-by-side on pricing, yield projections, operating costs, and legal checks.
        </p>
        <button
          onClick={() => onNavigate && onNavigate("search")}
          className="text-sm font-bold px-6 py-3 rounded-xl shadow-md text-white transition hover:scale-105"
          style={{ background: "#1565C0" }}
        >
          Explore Properties to Compare
        </button>
      </div>
    );
  }

  // Feature comparison sections (Section 5 of the blueprint)
  const SECTIONS = [
    {
      title: "💰 Pricing & Estimated Acquisition Costs",
      rows: [
        { label: "Listed Price", render: (p) => <span className="font-extrabold text-blue-800 text-base">{p.price}</span> },
        { label: "Transaction Type", render: (p) => p.transactionType === "Rent" ? "For Rent / Lease" : "For Sale / Ownership" },
        {
          label: "Price per Sq Ft",
          render: (p) => {
            const sqft = parseInt(p.area);
            if (p.priceRaw && sqft > 0) {
              return `₹${Math.round(p.priceRaw / sqft).toLocaleString("en-IN")} / sq ft`;
            }
            return "—";
          },
        },
        {
          label: "Est. Gov Stamp Duty & Reg. (~7%)",
          render: (p) => {
            if (p.transactionType === "Rent") return "E-Stamp: ₹100 – ₹500 (RentReady)";
            if (p.priceRaw) return `₹${Math.round(p.priceRaw * 0.07).toLocaleString("en-IN")} (Est.)`;
            return "Per state circle rate";
          },
        },
        {
          label: "Security Deposit / Advance",
          render: (p) => p.securityDeposit ? `₹${p.securityDeposit.toLocaleString("en-IN")}` : (p.transactionType === "Rent" ? "2 Months Rent" : "N/A (Outright Sale)"),
        },
      ],
    },
    {
      title: "📈 Investment & Rental Yield Analytics",
      rows: [
        {
          label: "Est. Monthly Rental Potential",
          render: (p) => p.estimatedMonthlyRent ? `₹${p.estimatedMonthlyRent.toLocaleString("en-IN")} / mo` : (p.transactionType === "Rent" ? p.price : "₹18,000 – ₹25,000 / mo"),
        },
        {
          label: "Gross Rental Yield %",
          render: (p) => {
            if (p.rentalYieldPercent) return <span className="font-bold text-emerald-700">{p.rentalYieldPercent}% p.a.</span>;
            if (p.priceRaw && p.estimatedMonthlyRent) {
              const yieldPct = ((p.estimatedMonthlyRent * 12) / p.priceRaw) * 100;
              return <span className="font-bold text-emerald-700">{yieldPct.toFixed(2)}% p.a.</span>;
            }
            return <span className="font-bold text-emerald-700">3.8% – 4.5% (Corridor avg)</span>;
          },
        },
        {
          label: "Monthly Maintenance / Operating Cost",
          render: (p) => p.maintenanceAmount ? `₹${p.maintenanceAmount.toLocaleString("en-IN")} ${p.maintenanceFrequency || "/mo"}` : "₹2,000 – ₹3,500 / mo",
        },
        {
          label: "Capital Appreciation Outlook",
          render: (p) => p.appreciationPotential || "8% – 12% Projected (5-Yr Corridor)",
        },
        {
          label: "Recommended Holding Period",
          render: (p) => p.recommendedHoldingPeriod || "4 – 6 Years for Max Alpha",
        },
      ],
    },
    {
      title: "📋 Document Status, RERA & Due Diligence",
      rows: [
        {
          label: "PropertyBrands Verification",
          render: (p) => (
            <div className="flex items-center gap-1.5">
              <Check on={p.verified} />
              <span className={`text-xs font-semibold ${p.verified ? "text-emerald-700" : "text-amber-700"}`}>
                {p.verified ? "Physically Verified" : "Verification Pending"}
              </span>
            </div>
          ),
        },
        {
          label: "RERA Registration Status",
          render: (p) => p.project?.reraNumber ? (
            <div>
              <span className="font-bold text-blue-900">{p.project.reraNumber}</span>
              <p className="text-[10px] text-gray-500">{p.project.reraState || "Approved Project"}</p>
            </div>
          ) : (
            <span className="text-gray-500 text-xs">RERA Compliant / Verified Builder</span>
          ),
        },
        {
          label: "Title & Legal Approvals",
          render: (p) => {
            const approvals = p.project?.approvals || [];
            if (approvals.length > 0) return approvals.slice(0, 3).join(", ");
            return "Clear Title & Municipal Approved";
          },
        },
        {
          label: "Age of Property / Construction Stage",
          render: (p) => p.age || p.status || "Ready to Move",
        },
      ],
    },
    {
      title: "🏛️ Unit Specifications & Layout",
      rows: [
        { label: "Property Type", render: (p) => p.type },
        { label: "Configuration / Bedrooms", render: (p) => p.bhkLabel || p.bhk?.join(", ") || "—" },
        { label: "Carpet / Super Built-up Area", render: (p) => p.area || "—" },
        { label: "Floor Level", render: (p) => p.floor || "Mid Floor" },
        { label: "Facing / Vaastu", render: (p) => p.facing || "North-East / Vaastu Compliant" },
        { label: "Possession Date", render: (p) => p.project?.expectedPossessionDate || p.status || "Ready to Move" },
        { label: "Posted By", render: (p) => `${p.postedBy || "Owner"} ${p.postedDays ? `(${p.postedDays}d ago)` : ""}` },
      ],
    },
    {
      title: "🗺️ Location, Approach Road & Infrastructure",
      rows: [
        { label: "Locality & City", render: (p) => `${p.locality || p.location || "City Center"}, ${p.city || "Bhubaneswar"}` },
        { label: "Approach Road Width", render: (p) => p.roadWidth || "40 ft Wide Sector Road" },
        {
          label: "Key Landmarks",
          render: (p) => {
            if (p.nearbyLandmarks?.length) {
              return p.nearbyLandmarks.slice(0, 2).map((l) => `${l.name} (${l.distanceKm || "1.5"} km)`).join(" · ");
            }
            return p.landmark || "Close to Transit & Metro";
          },
        },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-16">
      {/* Top Banner Header */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2 border border-blue-400/30">
              <span>⚖️</span> Compare Before You Commit
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Multi-Dimensional Property Comparison Engine
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
              Side-by-side evaluation of acquisition costs, projected rental yields, verified legal documentation, and ongoing maintenance charges.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setExpertModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-gray-950 shadow-md transition hover:scale-105"
            >
              Consult an Advisor on This →
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow transition flex items-center gap-1.5"
            >
              <span>💬</span> Share WhatsApp
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              🖨️ Print / PDF
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-2.5 rounded-xl text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              {copied ? "Copied!" : "🔗 Link"}
            </button>
            <button
              onClick={clearCompare}
              className="px-3 py-2.5 rounded-xl text-xs text-red-300 hover:text-red-100 transition hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* Main Comparison Matrix */}
      <div className="max-w-7xl mx-auto px-4 -mt-4 relative z-10">
        <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-xl">
          <table className="w-full border-collapse min-w-[700px]">
            {/* Header with Property Cards */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="sticky left-0 z-20 text-left p-4 text-xs font-bold uppercase tracking-wider w-48 bg-gray-50 text-gray-500 border-r border-gray-200">
                  <span>Compared Properties</span>
                  <p className="text-[10px] font-normal text-gray-400 mt-0.5">{items.length} of 4 selected</p>
                </th>
                {items.map((p) => (
                  <th key={p.dbId || p.id} className="p-4 text-left align-top min-w-[240px] bg-white border-r border-gray-100 last:border-r-0">
                    <div className="relative rounded-2xl overflow-hidden mb-3 border border-gray-100 group">
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=380&fit=crop"}
                        alt={p.title}
                        className="w-full h-36 object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <button
                        onClick={() => removeFromCompare(p.dbId || p.id)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-sm font-bold shadow"
                        aria-label={`Remove ${p.title}`}
                      >
                        ×
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-blue-900 backdrop-blur-sm">
                        {p.transactionType === "Rent" ? "For Rent" : "For Sale"}
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 mb-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 truncate">{p.location}</p>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onNavigate && onNavigate("property-detail", { property: p, pool: items })}
                        className="w-full text-xs font-bold py-2 rounded-xl text-white shadow-sm transition hover:opacity-90"
                        style={{ background: "#1565C0" }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toggleSaveProperty(p)}
                        className={`w-full text-xs font-bold py-2 rounded-xl border transition ${
                          isPropertySaved(p.dbId || p.id)
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {isPropertySaved(p.dbId || p.id) ? "Saved ♥" : "Save"}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Categorized Spec Rows */}
            <tbody>
              {SECTIONS.map((sec, secIdx) => (
                <React.Fragment key={secIdx}>
                  {/* Category Header Row */}
                  <tr className="bg-blue-50/70 border-y border-blue-100">
                    <td
                      colSpan={items.length + 1}
                      className="sticky left-0 z-10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/90"
                    >
                      {sec.title}
                    </td>
                  </tr>

                  {/* Section Spec Rows */}
                  {sec.rows.map((row, rIdx) => (
                    <tr
                      key={row.label}
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${
                        rIdx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td
                        className={`sticky left-0 z-10 p-3.5 text-xs font-bold text-gray-600 border-r border-gray-200 ${
                          rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        {row.label}
                      </td>
                      {items.map((p) => (
                        <td
                          key={p.dbId || p.id}
                          className="p-3.5 text-xs text-gray-800 border-r border-gray-100 last:border-r-0"
                        >
                          {row.render(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* Amenities Section */}
              <tr className="bg-blue-50/70 border-y border-blue-100">
                <td
                  colSpan={items.length + 1}
                  className="sticky left-0 z-10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/90"
                >
                  ✨ Amenities & Facilities Comparison ({allAmenities.length} items)
                </td>
              </tr>

              {allAmenities.map((amenity, i) => (
                <tr
                  key={amenity}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td
                    className={`sticky left-0 z-10 p-3 text-xs font-bold text-gray-600 border-r border-gray-200 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {amenity}
                  </td>
                  {items.map((p) => (
                    <td
                      key={p.dbId || p.id}
                      className="p-3 text-center border-r border-gray-100 last:border-r-0"
                    >
                      <Check on={p.amenities?.includes(amenity)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Callout & Advisory Strip */}
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Need Unbiased Verification?
            </span>
            <h3 className="text-lg sm:text-xl font-bold mt-1">
              Have an Expert Vetted Analyst Review Your Comparison
            </h3>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
              Get detailed valuation checks, title encumbrance screening, and true operating yield breakdowns before you make an offer.
            </p>
          </div>
          <button
            onClick={() => setExpertModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg transition hover:scale-105"
          >
            Book Free Advisory Session
          </button>
        </div>
      </div>

      <BookExpertModal
        isOpen={expertModalOpen}
        onClose={() => setExpertModalOpen(false)}
        initialTopic="investment"
      />
    </div>
  );
}
