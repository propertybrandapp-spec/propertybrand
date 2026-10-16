import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { submitLead } from "../lib/leads";

const MEMBERSHIP_TIERS = [
  {
    id: "buyer",
    name: "Select for Buyers & Owners",
    tagline: "For property seekers, home buyers & individual landlords",
    badge: "Most Popular",
    badgeColor: "#1565C0",
    price: "₹999",
    period: "/ 3 months",
    freeNote: "Basic search & listing is always 100% Free",
    features: [
      "Priority alerts for below-market & high-growth listings",
      "Unlimited side-by-side Property Comparison reports",
      "1 Free verified RentReady Rental Agreement draft",
      "Dedicated relationship manager for site visits",
      "Discounted home shifting, cleaning & snagging inspections",
      "Direct owner contact with verified phone numbers",
    ],
    cta: "Join Buyer Select",
    accent: "#1565C0",
  },
  {
    id: "invest",
    name: "Select Invest",
    tagline: "For HNIs, NRIs & serious real estate investors",
    badge: "High Yield",
    badgeColor: "#059669",
    price: "₹4,999",
    period: "/ quarter",
    freeNote: "Includes quarterly market intelligence dossier",
    features: [
      "Access to off-market & distressed high-yield deals",
      "Institutional-grade ROI, cash flow & cap rate models",
      "Complete legal title search & encumbrance summary",
      "Pre-leased commercial & warehouse investment alerts",
      "1-on-1 Quarterly Advisory Call with Principal Consultant",
      "Cross-city portfolio tracking and yield optimization",
    ],
    cta: "Activate Invest Select",
    accent: "#059669",
  },
  {
    id: "developer",
    name: "Select Developer",
    tagline: "For builders, land developers & project promoters",
    badge: "Scale Growth",
    badgeColor: "#7C3AED",
    price: "₹14,999",
    period: "/ month",
    freeNote: "Zero brokerage · Direct homebuyer inquiries",
    features: [
      "Featured project banners across top search corridors",
      "Developer brand microsite with 3D walk-through hosting",
      "Real-time lead CRM with buyer intent score & verification",
      "Joint Development (JDA) landowner matching alerts",
      "Monthly performance analytics and competitor heatmaps",
      "Digital brochure downloads & WhatsApp automated follow-ups",
    ],
    cta: "Partner as Developer",
    accent: "#7C3AED",
  },
  {
    id: "professional",
    name: "Select Professional",
    tagline: "For certified agents, architects, lawyers & contractors",
    badge: "Verified Partner",
    badgeColor: "#D97706",
    price: "₹2,499",
    period: "/ month",
    freeNote: "Verified partner badge & directory placement",
    features: [
      "Verified 'PropertyBrands Certified' badge on all listings",
      "Exclusive lead distribution for your specific micro-market",
      "Listing boost: 5x higher visibility in search results",
      "Client inquiry management console & CRM integrations",
      "Direct consultation booking inquiries routed to you",
      "Discounted banner advertising across category pages",
    ],
    cta: "Get Certified",
    accent: "#D97706",
  },
];

export default function SelectMembershipModal({ isOpen, onClose, onNavigate }) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("buyer");
  const [selectedTier, setSelectedTier] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "Bhubaneswar",
  });

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: profile.full_name || prev.name,
        phone: profile.phone || prev.phone,
        email: profile.email || prev.email,
        city: profile.city || prev.city,
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSelectTier(tier) {
    setSelectedTier(tier);
    setShowCheckout(true);
    setErrorMsg("");
  }

  async function handleConfirmMembership(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setErrorMsg("Please provide your name and phone number.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      await submitLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        city: form.city.trim() || "Bhubaneswar",
        source: "select-membership",
        interest: `[SELECT MEMBERSHIP] Tier: ${selectedTier.name} (${selectedTier.price} ${selectedTier.period}) | City: ${form.city} | Priority tier activation requested`,
      });
      setSubmitted(true);
      setShowCheckout(false);
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit activation request. Please retry.");
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
        className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-200 my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent High-Contrast Close Button - Always visible */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-50 w-10 h-10 rounded-full bg-white text-gray-900 shadow-2xl border-2 border-gray-100 flex items-center justify-center text-lg font-black hover:bg-gray-100 hover:scale-110 active:scale-95 transition cursor-pointer"
        >
          ✕
        </button>

        {/* Header Banner */}
        <div className="relative px-6 py-6 sm:px-10 text-white bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 shrink-0 pr-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2.5 border border-amber-400/30">
            <span>✨</span> PropertyBrands Select Memberships
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white" style={{ color: "#FFFFFF" }}>
            Tailored Memberships for Every Real Estate Need
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed" style={{ color: "#E0E7FF" }}>
            Basic searching and essential property browsing is always 100% free. Upgrade to <strong>Select</strong> for specialized analytics, verified agreements, dedicated advisors, and high-yield deal flow.
          </p>

          {/* Quick Tab Selector (only visible in comparison grid) */}
          {!showCheckout && !submitted && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
              {MEMBERSHIP_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setActiveTab(tier.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tier.id
                      ? "bg-white text-blue-950 shadow-md font-bold"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                  style={{ color: activeTab === tier.id ? "#0F172A" : "#FFFFFF" }}
                >
                  {tier.id === "buyer" ? "Buyer & Owner" : tier.name.replace("Select ", "")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 bg-gray-50/60 overflow-y-auto">
          {/* VIEW 1: COMPARISON GRID */}
          {!showCheckout && !submitted && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {MEMBERSHIP_TIERS.map((tier) => {
                  const isSelected = activeTab === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setActiveTab(tier.id)}
                      className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-white shadow-xl ring-2 scale-[1.02]"
                          : "bg-white/70 hover:bg-white border border-gray-200 hover:shadow-md"
                      }`}
                      style={{
                        borderColor: isSelected ? tier.accent : "#E5E7EB",
                        ringColor: isSelected ? tier.accent : "transparent",
                      }}
                    >
                      {/* Top Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
                          style={{ background: tier.badgeColor }}
                        >
                          {tier.badge}
                        </span>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ background: tier.accent }} />
                        )}
                      </div>

                      {/* Title & Price */}
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-snug">
                          {tier.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 min-h-[32px] line-clamp-2">
                          {tier.tagline}
                        </p>

                        <div className="mt-4 pb-4 border-b border-gray-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900">{tier.price}</span>
                            <span className="text-xs text-gray-500">{tier.period}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{tier.freeNote}</p>
                        </div>

                        {/* Features list */}
                        <ul className="space-y-2 mt-4 text-xs text-gray-600">
                          {tier.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <svg
                                className="w-4 h-4 shrink-0 mt-0.5"
                                fill="none"
                                stroke={tier.accent}
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="leading-tight">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action CTA */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTier(tier);
                          }}
                          className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-sm hover:shadow-md hover:opacity-90"
                          style={{ background: tier.accent }}
                        >
                          {tier.cta} →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Trust Strip */}
              <div className="mt-6 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Zero brokerage · Transparent terms · Direct relationship with owners & developers</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate && onNavigate("contact", { subject: "membership" });
                  }}
                  className="font-bold text-blue-700 hover:underline"
                >
                  Enterprise / Custom Plans? Contact Us →
                </button>
              </div>
            </>
          )}

          {/* VIEW 2: ACTIVATION CHECKOUT FORM */}
          {showCheckout && selectedTier && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white"
                    style={{ background: selectedTier.badgeColor }}
                  >
                    {selectedTier.badge}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    Activate {selectedTier.name}
                  </h3>
                  <p className="text-xs text-gray-500">{selectedTier.tagline}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-gray-900">{selectedTier.price}</div>
                  <div className="text-xs text-gray-500">{selectedTier.period}</div>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleConfirmMembership} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City / Preferred Market
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Bhubaneswar, Cuttack, Puri"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">ℹ️</span>
                  <span>
                    Our dedicated Relationship Manager will reach out within 2 hours to confirm your membership privileges and facilitate instant onboarding.
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-100 transition"
                  >
                    ← Back to Tiers
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-2/3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-95 transition disabled:opacity-50"
                    style={{ background: selectedTier.accent }}
                  >
                    {submitting ? "Submitting..." : `Confirm & Activate (${selectedTier.price})`}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW 3: SUCCESS CONFIRMATION */}
          {submitted && selectedTier && (
            <div className="max-w-md mx-auto py-8 text-center animate-fade-in">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"
                style={{ background: `${selectedTier.accent}15`, color: selectedTier.accent }}
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                Application Received for {selectedTier.name}!
              </h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Thank you, <strong>{form.name}</strong>. Your Select membership activation request has been logged. Our priority desk will contact you at <strong>{form.phone}</strong> to activate your verified privileges.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setShowCheckout(false);
                    onClose();
                  }}
                  className="px-8 py-3 rounded-xl text-sm font-bold text-white shadow-lg hover:scale-105 active:scale-95 transition"
                  style={{ background: selectedTier.accent }}
                >
                  Done & Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
