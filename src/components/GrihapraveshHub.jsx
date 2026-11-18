import React, { useState, useEffect } from "react";
import { fetchGrihapraveshServices } from "../lib/siteContent";
import { submitLead } from "../lib/leads";

const CATEGORIES = [
  "All",
  "Puja & Rituals",
  "Decor & Ambience",
  "Catering & Prasad",
  "Deep Cleaning & Moving",
];

export default function GrihapraveshHub({ onNavigate }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedService, setSelectedService] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Quick multi-select planner state
  const [plannerSelected, setPlannerSelected] = useState([]);
  const [plannerCity, setPlannerCity] = useState("Bhubaneswar");
  const [plannerDate, setPlannerDate] = useState("");
  const [plannerName, setPlannerName] = useState("");
  const [plannerPhone, setPlannerPhone] = useState("");
  const [plannerEmail, setPlannerEmail] = useState("");
  const [plannerNotes, setPlannerNotes] = useState("");
  const [plannerSubmitting, setPlannerSubmitting] = useState(false);
  const [plannerSuccess, setPlannerSuccess] = useState(false);
  const [plannerError, setPlannerError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchGrihapraveshServices().then(({ data }) => {
      if (!cancelled) {
        setServices(data || []);
        setLoading(false);
        // Pre-select popular ones in planner
        const popularIds = (data || []).filter((s) => s.popular).map((s) => s.id);
        setPlannerSelected(popularIds.length ? popularIds : [(data || [])[0]?.id].filter(Boolean));
      }
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = activeCategory === "All"
    ? services
    : services.filter((s) => s.category === activeCategory);

  function togglePlannerService(id) {
    setPlannerSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handlePlannerSubmit(e) {
    e.preventDefault();
    if (!plannerName.trim() || !plannerPhone.trim()) {
      setPlannerError("Please provide your name and mobile phone number.");
      return;
    }
    setPlannerSubmitting(true);
    setPlannerError("");

    const chosenServices = services
      .filter((s) => plannerSelected.includes(s.id))
      .map((s) => s.title);

    try {
      await submitLead({
        name: plannerName.trim(),
        phone: plannerPhone.trim(),
        email: plannerEmail.trim() || null,
        city: plannerCity,
        source: "build-move",
        interest: `[GRIHAPRAVESH BOOKING] Services: ${chosenServices.join(" + ") || "Custom Package"} | Preferred Muhurat Date: ${plannerDate || "To be discussed"} | Notes: ${plannerNotes.trim()}`,
      });
      setPlannerSuccess(true);
    } catch (err) {
      setPlannerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setPlannerSubmitting(false);
    }
  }

  return (
    <div className="bg-white min-h-screen text-slate-900 pb-20">
      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-br from-amber-950 via-orange-950 to-slate-950 text-white py-16 sm:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B20_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-4 border border-amber-400/30">
            <span>🪔</span> Sacred Home Blessings & Grihapravesh Services
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-white">
            Vedic Grihapravesh, Puja Samagri & Housewarming Coordination
          </h1>
          <p className="mt-4 text-base sm:text-lg text-amber-100/90 max-w-2xl mx-auto leading-relaxed">
            From certified Vedic Pandits, Vastu Shanti Havan kits, and traditional marigold doorway torans, to sattvic feast catering and pre-muhurat deep cleaning — enter your new home with divinity and peace.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#services-grid"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg transition-all"
            >
              Explore Sub-Services
            </a>
            <a
              href="#package-planner"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all"
            >
              Custom Package Planner
            </a>
            <button
              onClick={() => onNavigate && onNavigate("contact", "Grihapravesh Consultation")}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition-all"
            >
              Auspicious Muhurat Inquiry
            </button>
          </div>
        </div>
      </section>

      {/* ── Sub-Services Grid Section ── */}
      <section id="services-grid" className="max-w-7xl mx-auto px-4 py-16 -mt-8 relative z-20">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat
                  ? "bg-amber-500 text-slate-950 shadow-md font-black"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image / Header */}
                  <div className="relative h-44 overflow-hidden bg-amber-50">
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {s.icon || "🪔"}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-slate-800 shadow-sm">
                        {s.category}
                      </span>
                      {s.popular && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 shadow-sm">
                          ★ Most Popular
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="text-2xl p-1.5 rounded-xl bg-white/20 backdrop-blur-md">
                        {s.icon || "🪔"}
                      </span>
                      <span className="text-white font-extrabold text-sm drop-shadow">
                        {s.price}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {s.description}
                    </p>

                    {/* Deliverables / Checklist columns */}
                    {s.inclusions && s.inclusions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Inclusions & Scope:
                        </p>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {s.inclusions.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(s);
                      setBookingModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-amber-600 transition shadow-sm cursor-pointer"
                  >
                    Book This Sub-Service →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── All-In-One Custom Grihapravesh Package Planner ── */}
      <section id="package-planner" className="max-w-6xl mx-auto px-4 py-12">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-white border-2 border-amber-300 p-6 sm:p-10 shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Smart Package Planner
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Bundle Your Grihapravesh Services & Save Up to 20%
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Select the sub-services you need for your housewarming ceremony and our dedicated ceremony coordinator will assemble a transparent bundle quote.
            </p>
          </div>

          <form onSubmit={handlePlannerSubmit} className="space-y-8">
            {/* Step 1: Sub-services checklist */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Step 1: Choose Your Services
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((s) => {
                  const checked = plannerSelected.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => togglePlannerService(s.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        checked
                          ? "bg-amber-50 border-amber-500 shadow-sm text-amber-950 font-bold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{s.icon || "🪔"}</span>
                        <div className="min-w-0">
                          <p className="text-xs truncate">{s.title}</p>
                          <p className="text-[10px] text-amber-700 font-bold">{s.price}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {}}
                        className="rounded text-amber-600 shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Details & Muhurat Date */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Step 2: Enter Contact & Muhurat Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={plannerName}
                    onChange={(e) => setPlannerName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={plannerPhone}
                    onChange={(e) => setPlannerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Auspicious Muhurat Date</label>
                  <input
                    type="date"
                    value={plannerDate}
                    onChange={(e) => setPlannerDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={plannerEmail}
                    onChange={(e) => setPlannerEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Special Preferences / Deity Pujan</label>
                  <input
                    type="text"
                    value={plannerNotes}
                    onChange={(e) => setPlannerNotes(e.target.value)}
                    placeholder="e.g. Satyanarayan Katha, Satvik food for 40 guests, Toran for 2 doors"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {plannerError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {plannerError}
              </p>
            )}

            {plannerSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-2xl">🙏</span>
                <h4 className="text-sm font-bold text-emerald-900 mt-1">
                  Grihapravesh Request Received!
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Our Vedic ceremony coordinator will connect with you within 2 hours to confirm priest availability and finalize samagri delivery.
                </p>
              </div>
            ) : (
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={plannerSubmitting}
                  className="px-8 py-3.5 rounded-xl text-sm font-black text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {plannerSubmitting ? "Submitting Request…" : "Get Complete Bundle Quote →"}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ── Single Service Booking Modal ── */}
      {bookingModalOpen && selectedService && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setBookingModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedService.icon || "🪔"}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedService.title}</h3>
                  <span className="text-xs font-bold text-amber-700">{selectedService.price}</span>
                </div>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const name = fd.get("name")?.toString().trim();
                const phone = fd.get("phone")?.toString().trim();
                const date = fd.get("date")?.toString();
                const notes = fd.get("notes")?.toString().trim();
                if (!name || !phone) return;
                try {
                  await submitLead({
                    name,
                    phone,
                    city: "Bhubaneswar",
                    source: "build-move",
                    interest: `[GRIHAPRAVESH SUB-SERVICE] ${selectedService.title} (${selectedService.price}) | Muhurat Date: ${date || "TBD"} | Notes: ${notes || "None"}`,
                  });
                  alert("Thank you! Our Grihapravesh coordinator will contact you shortly.");
                  setBookingModalOpen(false);
                } catch (err) {
                  alert("Submission error. Please try again.");
                }
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+91 Mobile number"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Ceremony Date</label>
                <input
                  name="date"
                  type="date"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Notes / Address</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Apartment name, address or specific puja requirements"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow transition cursor-pointer mt-2"
              >
                Confirm & Request Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
