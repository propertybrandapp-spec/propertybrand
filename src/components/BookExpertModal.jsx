import React, { useState, useEffect } from "react";
import { submitLead } from "../lib/leads";

const CONSULTATION_TOPICS = [
  { id: "investment", label: "Investment Planning & ROI Analysis", icon: "📈", desc: "Rental yields, high-growth corridors & portfolio allocation" },
  { id: "legal", label: "Legal Due Diligence & Title Verification", icon: "⚖️", desc: "RERA checks, encumbrance verification & draft review" },
  { id: "land", label: "Land Feasibility & Joint Development (JDA)", icon: "🗺️", desc: "Zoning review, conversion approvals & builder matching" },
  { id: "architecture", label: "Architecture, Planning & Interior Design", icon: "🏛️", desc: "Turnkey planning, floor plans & structural vetting" },
  { id: "loans", label: "Home Loans & Financial Structuring", icon: "💰", desc: "Bank rate comparison, eligibility checks & balance transfers" },
  { id: "nri", label: "NRI Property Management & Repatriation", icon: "🌐", desc: "Remote management, tax advisory (TDS/195) & power of attorney" },
];

const CONSULTATION_MODES = [
  { id: "video", label: "Video Consultation", desc: "30-min Google Meet / Zoom with screen sharing", badge: "Recommended" },
  { id: "phone", label: "Phone Call", desc: "Direct call with senior property specialist", badge: "Fastest" },
  { id: "in-person", label: "In-Person Meeting", desc: "At PropertyBrands local office or project site", badge: "By Appointment" },
];

const BUDGET_RANGES = [
  "Under ₹25 Lakh",
  "₹25 Lakh – ₹50 Lakh",
  "₹50 Lakh – ₹1 Crore",
  "₹1 Crore – ₹3 Crore",
  "₹3 Crore – ₹10 Crore",
  "₹10 Crore+ / Institutional",
];

const CITIES = [
  "Bhubaneswar", "Delhi NCR", "Mumbai", "Bangalore", "Hyderabad",
  "Pune", "Kolkata", "Chennai", "Ahmedabad", "Jaipur", "Other City",
];

export default function BookExpertModal({ isOpen, onClose, initialTopic = null }) {
  const [topic, setTopic] = useState(initialTopic || "investment");
  const [mode, setMode] = useState("video");
  const [budget, setBudget] = useState("₹50 Lakh – ₹1 Crore");
  const [city, setCity] = useState("Bhubaneswar");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (10 AM - 1 PM)");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Please enter your name and contact phone number.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    const topicObj = CONSULTATION_TOPICS.find((t) => t.id === topic);

    try {
      await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        city,
        source: "book-expert",
        property_id: null,
        interest: `[CONSULTATION BOOKING] Topic: ${topicObj?.label || topic} | Mode: ${mode} | Budget: ${budget} | City: ${city} | Preferred Time: ${preferredDate} ${preferredTime} | Notes: ${notes.trim()}`,
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || "Failed to book consultation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-start sm:items-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-200 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent High-Contrast Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-50 w-10 h-10 rounded-full bg-white text-gray-900 shadow-2xl border-2 border-gray-100 flex items-center justify-center text-lg font-black hover:bg-gray-100 hover:scale-110 active:scale-95 transition cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="relative px-6 py-6 sm:px-8 bg-gradient-to-r from-blue-950 to-indigo-950 text-white shrink-0 pr-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2 border border-blue-400/30">
            <span>🛡️</span> Verified Real Estate Specialists
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Book a Personalized Consultation</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Connect directly with verified investment advisors, land specialists, or legal advocates.
          </p>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 sm:p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Consultation Scheduled!</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
              Our lead consultant has received your request for <strong>{CONSULTATION_TOPICS.find((t) => t.id === topic)?.label}</strong>. You will receive a confirmation WhatsApp & meeting calendar invite shortly.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-md"
                style={{ background: "#1565C0" }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* 1. What do you need help with? */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                1. What do you need help with?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CONSULTATION_TOPICS.map((item) => {
                  const isSelected = topic === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setTopic(item.id)}
                      className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-600 ring-1 ring-blue-600"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <p className={`text-xs font-bold leading-tight ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                          {item.label}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Preferred Consultation Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                2. Preferred Consultation Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {CONSULTATION_MODES.map((m) => {
                  const isSelected = mode === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? "bg-blue-50/70 border-blue-600 ring-1 ring-blue-600"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-gray-100 text-gray-700">
                        {m.badge}
                      </span>
                      <p className="text-xs font-bold text-gray-900 mt-2">{m.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{m.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Budget & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Asset Value / Budget (Approx)
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Target City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Contact Details */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                4. Your Contact Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile / WhatsApp Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Morning (10 AM - 1 PM)">Morning slot (10 AM – 1 PM)</option>
                  <option value="Afternoon (1 PM - 5 PM)">Afternoon slot (1 PM – 5 PM)</option>
                  <option value="Evening (5 PM - 8 PM)">Evening slot (5 PM – 8 PM)</option>
                  <option value="Immediate Call Back">Immediate Call Back</option>
                </select>
              </div>

              <textarea
                rows={2}
                placeholder="Specific property address or questions (optional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-3 px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            {/* Footer submit */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-4">
              <span className="text-[11px] text-gray-500">
                🔒 Confidential & non-binding advisory
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
                style={{ background: "#1565C0" }}
              >
                {submitting ? "Booking..." : "Confirm Consultation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
