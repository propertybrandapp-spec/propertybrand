import React, { useState } from "react";
import { submitLead } from "../lib/leads";

const SERVICE_VERTICALS = [
  {
    id: "materials",
    title: "Building Materials Marketplace Connect",
    icon: "🧱",
    tagline: "Direct mill & distributor pricing for verified bulk construction materials.",
    features: [
      "TMT Steel Bars (Fe 550D / 500D) from certified primary producers",
      "Cement (OPC 53 / PPC) with batch test certificates",
      "Vitrified Tiles, Granite, Italian Marble & Sanitaryware",
      "Electrical Wiring (FR/FRLS) & Plumbing Conduit pipe bundles",
      "Zero middleman markups with verified gate-pass delivery tracking",
    ],
    badge: "Wholesale Quotes",
  },
  {
    id: "shifting",
    title: "Packers & Movers Logistics",
    icon: "🚚",
    tagline: "Safe, insured home and commercial relocation with zero transit breakage guarantee.",
    features: [
      "Pre-move video survey & guaranteed transparent quotation",
      "Multi-layer bubble wrap & heavy wooden crating for fragile items",
      "Dedicated closed container trucks with GPS tracking",
      "Dismantling & reassembly of beds, wardrobes & modular furniture",
      "Transit transit insurance coverage up to ₹50 Lakh",
    ],
    badge: "100% Insured",
  },
  {
    id: "inspection",
    title: "Pre-Possession Snagging & Inspection",
    icon: "🔍",
    tagline: "Independent civil engineer site audit before you take key handover from builders.",
    features: [
      "Thermal imaging scan for hidden wall seepage & plumbing leaks",
      "Laser level measurement for floor slope & tile hollow-sounding test",
      "Electrical voltage drop, earthing & phase balance check",
      "Doors, window gaskets & hardware alignment inspection",
      "Detailed 40+ page photographic snag list report for builder rectification",
    ],
    badge: "Certified Engineers",
  },
  {
    id: "architecture",
    title: "House Planning & Turnkey Interiors",
    icon: "🏛️",
    tagline: "Custom floor plans, structural vetting, modular kitchens & execution packages.",
    features: [
      "Vaastu-compliant architectural floor plans & 3D elevations",
      "Structural engineer vetting & municipal sanction drawings",
      "Factory-finish modular kitchens with 10-year warranty",
      "Milestone-linked payment escrow with weekly photo updates",
    ],
    badge: "Turnkey Design",
  },
];

export default function BuildMoveHub({ onNavigate }) {
  const [selectedService, setSelectedService] = useState("materials");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Bhubaneswar",
    propertyAddress: "",
    materialCategory: "TMT Steel & Cement",
    approxQuantity: "Commercial / Full Home (1000+ sq ft)",
    shiftingFrom: "",
    shiftingTo: "",
    shiftingDate: "",
    inspectionUnitType: "3 BHK Apartment",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function updateField(key, val) {
    setFormData((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg("Please provide your name and contact phone number.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    let details = "";
    if (selectedService === "materials") {
      details = `Material: ${formData.materialCategory} | Qty: ${formData.approxQuantity} | Delivery City: ${formData.city}`;
    } else if (selectedService === "shifting") {
      details = `From: ${formData.shiftingFrom} -> To: ${formData.shiftingTo} | Est Date: ${formData.shiftingDate}`;
    } else if (selectedService === "inspection") {
      details = `Unit Type: ${formData.inspectionUnitType} | Address: ${formData.propertyAddress}, ${formData.city}`;
    } else {
      details = `Design & Architecture | City: ${formData.city} | Notes: ${formData.notes}`;
    }

    try {
      await submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        city: formData.city,
        source: "build-move",
        interest: `[BUILD & MOVE] Service: ${selectedService.toUpperCase()} | ${details} | Notes: ${formData.notes.trim()}`,
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white py-14 sm:py-18 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <span>🏗️</span> Pillar 5: Build & Move Coordination Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-white" style={{ color: "#FFFFFF" }}>
            Complete Post-Purchase Services & Home-Building Journey
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-200 max-w-2xl mx-auto leading-relaxed" style={{ color: "#BFDBFE" }}>
            Property Brands coordinates the entire lifecycle after acquisition: wholesale building materials, pre-possession snagging inspections, insured movers, and turnkey architecture.
          </p>

          {/* Service Selector Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {SERVICE_VERTICALS.map((v) => {
              const isSelected = selectedService === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedService(v.id);
                    setSubmitted(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-white text-gray-950 border-white shadow-lg ring-2 ring-amber-400 scale-105"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  }`}
                >
                  <span className="text-lg">{v.icon}</span>
                  <span>{v.title.split(" ")[0]} {v.title.split(" ")[1]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Grid: Service Details + Request Form */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Service Features & Trust */}
          <div className="lg:col-span-7 space-y-6">
            {SERVICE_VERTICALS.filter((v) => v.id === selectedService).map((service) => (
              <div key={service.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 rounded-2xl bg-blue-50 text-blue-700">{service.icon}</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {service.badge}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{service.tagline}</p>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Service Standards & Guarantees</h4>
                  <ul className="space-y-3">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">✓</span>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-950">Looking for Turnkey Interior Design Packages?</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">Explore our modular kitchen designs and 3D architectural portfolios.</p>
                  </div>
                  <button
                    onClick={() => onNavigate && onNavigate("architects-design")}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition whitespace-nowrap ml-3"
                  >
                    View Packages →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Instant Quote Request Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl sticky top-24">
              <div className="border-b border-gray-100 pb-3 mb-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">PropertyBrands Verified Network</span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">Request Service Quotation</h3>
                <p className="text-xs text-gray-500">Receive vetted vendor quotes within 2 business hours</p>
              </div>

              {submitted ? (
                <div className="py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Quotation Request Submitted!</h4>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    Our service coordinator will connect you with verified local partners and provide your transparent cost breakdown.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  {/* Dynamic Fields based on active service */}
                  {selectedService === "materials" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Material Required</label>
                        <select
                          value={formData.materialCategory}
                          onChange={(e) => updateField("materialCategory", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="TMT Steel (Fe 550D / 500D)">TMT Steel (Fe 550D / 500D)</option>
                          <option value="Cement (OPC 53 / PPC)">Cement (OPC 53 / PPC)</option>
                          <option value="Vitrified Floor & Wall Tiles">Vitrified Floor & Wall Tiles</option>
                          <option value="Granite & Italian Marble">Granite & Italian Marble</option>
                          <option value="Plumbing Pipes & Fittings">Plumbing Pipes & Fittings</option>
                          <option value="Electrical Wires & Switchgear">Electrical Wires & Switchgear</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Quantity / Requirement</label>
                        <input
                          type="text"
                          placeholder="e.g. 10 Metric Tons Steel, 500 Bags Cement"
                          value={formData.approxQuantity}
                          onChange={(e) => updateField("approxQuantity", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </>
                  )}

                  {selectedService === "shifting" && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Shifting From</label>
                          <input
                            type="text"
                            placeholder="Current City / Area"
                            value={formData.shiftingFrom}
                            onChange={(e) => updateField("shiftingFrom", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Shifting To</label>
                          <input
                            type="text"
                            placeholder="Destination City"
                            value={formData.shiftingTo}
                            onChange={(e) => updateField("shiftingTo", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tentative Move Date</label>
                        <input
                          type="date"
                          value={formData.shiftingDate}
                          onChange={(e) => updateField("shiftingDate", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </>
                  )}

                  {selectedService === "inspection" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Unit Configuration</label>
                        <select
                          value={formData.inspectionUnitType}
                          onChange={(e) => updateField("inspectionUnitType", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="1 or 2 BHK Apartment">1 or 2 BHK Apartment</option>
                          <option value="3 BHK Apartment">3 BHK Apartment</option>
                          <option value="4+ BHK / Penthouse">4+ BHK / Penthouse</option>
                          <option value="Independent Villa / Row House">Independent Villa / Row House</option>
                          <option value="Commercial Office / Retail Space">Commercial Office / Retail Space</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Project / Property Address</label>
                        <input
                          type="text"
                          placeholder="e.g. Tower 3, Flat 502, Green Enclave"
                          value={formData.propertyAddress}
                          onChange={(e) => updateField("propertyAddress", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </>
                  )}

                  {/* Contact Fields */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Special Requirements (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Floor number, delivery constraints, specific brands..."
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition hover:shadow-lg disabled:opacity-50"
                    style={{ background: "#1565C0" }}
                  >
                    {submitting ? "Sending..." : "Get Guaranteed Vendor Quotes"}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center">
                    🔒 Zero spam · Verified distributor partners only
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
