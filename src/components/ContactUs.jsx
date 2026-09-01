import { useState, useEffect } from "react";
import { submitLead } from "../lib/leads";
import { useAuth } from "../lib/AuthContext";
import { fetchSiteSettings, fetchOfficeLocations } from "../lib/siteContent";

// ── Contact Info ──────────────────────────────────────────────────────────────

// Icon + label only — the actual values come from live settings (see the
// component below), with these as sensible defaults until migration_009 has
// been run / settings have been saved in the admin console.
const CONTACT_ICON_DEFS = [
  {
    key: "address",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Corporate Office",
  },
  {
    key: "phone",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
      </svg>
    ),
    label: "Phone & WhatsApp",
  },
  {
    key: "email",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
  },
  {
    key: "businessHours",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Business Hours",
  },
];

const DEFAULT_SETTINGS = {
  address: "PropertyBrands Realty Services, Bhubaneswar, Odisha — 751001",
  phone: "+91 94301 00000",
  whatsapp: "+91 98765 00000",
  email: "info@propertybrands.in",
  businessHours: "Mon – Sat, 9:00 AM – 7:00 PM",
};

// Shown until real offices are added in the admin console ("Site Content" → Office Locations)
const DEMO_OFFICES = [
  { city: "Bhubaneswar", address: "Main Road, Bhubaneswar, Odisha 751001", phone: "+91 94301 00000" },
  { city: "Delhi", address: "Connaught Place, New Delhi 110001", phone: "+91 98765 00001" },
  { city: "Bangalore", address: "MG Road, Bangalore, Karnataka 560001", phone: "+91 98765 00002" },
];

const FAQ = [
  { q: "How do I schedule a site visit?", a: "Use the 'Schedule Site Visit' button on any listing, or contact our team directly via phone or the form below. We also provide a free cab for every scheduled visit." },
  { q: "Do you charge brokerage fees?", a: "Brokerage varies by service and listing type. Our relationship managers will share full transparency on charges before you commit to anything." },
  { q: "Can NRIs invest through PropertyBrands?", a: "Yes — we have a dedicated NRI desk that handles property visits, legal checks, loan paperwork, and registration remotely." },
];

// ── Section 3A: Quick Questions for Buyers (optional "Tell us more" step) ──
const PURPOSE_OPTIONS = ["Self-Use", "Investment", "Rental Income", "Second Home", "Retirement"];
const TIMELINE_OPTIONS = ["Immediately", "1-3 Months", "3-6 Months", "6-12 Months", "Just Exploring"];
const PRIORITY_OPTIONS = ["Price", "Location", "Size", "Amenities", "Connectivity", "Possession Timeline", "Investment Return"];
const LOAN_ASSISTANCE_OPTIONS = ["Need a Home Loan", "Need Eligibility Help", "Self-Funded / No Loan Needed", "Not Sure Yet"];
const UNDER_CONSTRUCTION_OPTIONS = ["Yes", "No", "Maybe"];
const MUST_HAVE_OPTIONS = ["Parking", "Lift", "Power Backup", "Pet-Friendly", "Senior-Friendly Design"];
const EMPTY_BUYER_PREFS = {
  purpose: "", budgetMax: "", comfortableEmi: "", preferredLocations: [], acceptableLocations: [], excludedLocations: [],
  purchaseTimeline: "", priorityFactors: [], loanAssistance: "", openToUnderConstruction: "", mustHaveFeatures: [], wantsComparison: false,
};
// ── Section 3B: Questions for Renters (shown instead of buyer questions when
// the property being asked about is for Rent) ──
const PROFILE_TYPE_OPTIONS = ["Family", "Bachelor", "Student", "Corporate"];
const FURNISHING_REQ_OPTIONS = ["Unfurnished", "Semi-furnished", "Fully furnished", "No Preference"];
const LEASE_DURATION_OPTIONS = ["11 Months", "1 Year", "2 Years", "3+ Years", "Flexible"];
const PET_REQ_OPTIONS = ["Have Pets - Need Pet-Friendly", "No Pets", "Planning to Get a Pet"];
const PARKING_REQ_OPTIONS = ["Not Needed", "1 Two-Wheeler", "1 Car", "Multiple Vehicles", "EV Charging Needed"];
const EMPTY_RENTER_PREFS = {
  moveInDate: "", monthlyRentBudget: "", upfrontBudget: "", profileType: "", furnishingRequirement: "",
  leaseDuration: "", petRequirement: "", parkingRequirement: "", preferredLocalities: [], commuteDestination: "",
  wantsBrokerageFree: false, wantsManagedRental: false,
};

const SUBJECT_LABELS = {
  buy: "Buying a Property",
  rent: "Renting a Property",
  sell: "Selling a Property",
  invest: "Investment Advisory",
  partner: "Channel Partner Program",
  prime: "PB Prime Membership",
  other: "Something Else",
};

// ── Main Export ───────────────────────────────────────────────────────────────
// `initialSubject` is either a bare subject string (most callers — "buy",
// "invest", "prime", etc.) or a richer object from a specific property's
// Contact/Schedule Visit buttons: { subject, property, intent }. The latter
// links the resulting lead back to that exact listing (see submitLead call
// below) so the admin can see exactly which property this inquiry is about,
// with full specs/photos, instead of a generic message.
export default function ContactUs({ onNavigate, initialSubject }) {
  const isRichPayload = initialSubject && typeof initialSubject === "object";
  const subjectValue = isRichPayload ? initialSubject.subject : initialSubject;
  const property = isRichPayload ? initialSubject.property : null;
  const intent = isRichPayload ? initialSubject.intent : null; // "contact" | "site-visit" | "callback"

  const [settings, setSettings] = useState(null);
  const [offices, setOffices] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then(({ data }) => { if (!cancelled) setSettings(data); });
    fetchOfficeLocations().then(({ data }) => {
      if (!cancelled) setOffices(data && data.length > 0 ? data : DEMO_OFFICES);
    });
    return () => { cancelled = true; };
  }, []);

  const info = { ...DEFAULT_SETTINGS, ...(settings || {}) };
  const OFFICES = offices || DEMO_OFFICES;
  const CONTACT_HREFS = {
    address: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`,
    phone: `tel:${(info.phone || "").replace(/[^\d+]/g, "")}`,
    email: `mailto:${info.email}`,
    businessHours: null,
  };
  const CONTACT_INFO = CONTACT_ICON_DEFS.map((def) => ({ ...def, value: info[def.key], href: CONTACT_HREFS[def.key] }));

  function defaultMessage() {
    if (!property) return "";
    const specs = [property.bhkLabel, property.area, property.type].filter(Boolean).join(", ");
    if (intent === "site-visit") {
      return `I'd like to schedule a site visit for "${property.title}"${property.location ? ` in ${property.location}` : ""}${specs ? ` (${specs})` : ""}. Please share available slots.`;
    }
    if (intent === "callback") {
      return `Could someone call me back about "${property.title}"${property.location ? ` in ${property.location}` : ""}${specs ? ` (${specs})` : ""}? I have a few quick questions.`;
    }
    return `I'm interested in "${property.title}"${property.location ? ` in ${property.location}` : ""}${specs ? ` (${specs})` : ""} and would like more details.`;
  }

  const { profile, isLoggedIn } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: subjectValue || "", message: defaultMessage() });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [showBuyerQuestions, setShowBuyerQuestions] = useState(false);
  const [buyerPrefs, setBuyerPrefs] = useState(EMPTY_BUYER_PREFS);
  const [renterPrefs, setRenterPrefs] = useState(EMPTY_RENTER_PREFS);
  // The property being asked about tells us which question set is relevant —
  // Rent listings get the renter questions, everything else (Buy, or a
  // general inquiry with no property context) gets the buyer questions.
  const isRentInquiry = property?.transactionType === "Rent";

  // Pre-fill from the buyer's saved preferences if they're logged in and
  // already answered these once — they can still tweak them per-inquiry.
  useEffect(() => {
    if (!isLoggedIn || !profile) return;
    setBuyerPrefs({
      purpose: profile.buyer_purpose || "",
      budgetMax: profile.buyer_budget_max ?? "",
      comfortableEmi: profile.buyer_comfortable_emi ?? "",
      preferredLocations: profile.buyer_preferred_locations || [],
      acceptableLocations: profile.buyer_acceptable_locations || [],
      excludedLocations: profile.buyer_excluded_locations || [],
      purchaseTimeline: profile.buyer_purchase_timeline || "",
      priorityFactors: profile.buyer_priority_factors || [],
      loanAssistance: profile.buyer_loan_assistance || "",
      openToUnderConstruction: profile.buyer_open_to_under_construction || "",
      mustHaveFeatures: profile.buyer_must_have_features || [],
      wantsComparison: !!profile.buyer_wants_comparison,
    });
    setRenterPrefs({
      moveInDate: profile.renter_move_in_date || "",
      monthlyRentBudget: profile.renter_monthly_rent_budget ?? "",
      upfrontBudget: profile.renter_upfront_budget ?? "",
      profileType: profile.renter_profile_type || "",
      furnishingRequirement: profile.renter_furnishing_requirement || "",
      leaseDuration: profile.renter_lease_duration || "",
      petRequirement: profile.renter_pet_requirement || "",
      parkingRequirement: profile.renter_parking_requirement || "",
      preferredLocalities: profile.renter_preferred_localities || [],
      commuteDestination: profile.renter_commute_destination || "",
      wantsBrokerageFree: !!profile.renter_wants_brokerage_free,
      wantsManagedRental: !!profile.renter_wants_managed_rental,
    });
  }, [isLoggedIn, profile]);

  function toggleBuyerArray(key, value) {
    setBuyerPrefs((p) => ({ ...p, [key]: p[key].includes(value) ? p[key].filter((v) => v !== value) : [...p[key], value] }));
  }

  function locationsFromInput(value) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }

  async function handleSubmit() {
    if (!(form.name && form.phone && form.message)) return;
    setSubmitting(true);
    setError("");

    // When this came from a specific property, weave its details into the
    // interest text and link the lead to it directly (listingId) so it
    // shows up with full specs/photos wherever leads are reviewed.
    const interest = property
      ? `${intent === "site-visit" ? "Site Visit Request" : intent === "callback" ? "Callback Request" : SUBJECT_LABELS[form.subject] || "Property Inquiry"} — ${property.title}, ${property.location}, ${property.price}${property.bhkLabel ? `, ${property.bhkLabel}` : ""}${property.area ? `, ${property.area}` : ""} — ${form.message}`
      : `${SUBJECT_LABELS[form.subject] || "General Inquiry"} — ${form.message}`;

    const { error } = await submitLead({
      name: form.name,
      phone: form.phone,
      email: form.email,
      interest,
      budget: property?.price,
      listingId: property?.dbId,
      stage: intent === "site-visit" ? "Site Visit" : undefined,
      buyerPreferences: isRentInquiry ? undefined : buyerPrefs,
      renterPreferences: isRentInquiry ? renterPrefs : undefined,
    });
    setSubmitting(false);
    if (error) {
      setError("Something went wrong sending your message. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* ── Hero ── */}
      <section className="px-4 py-14 lg:py-16 text-center" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%)" }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#FFFFFF", color: "#1565C0", border: "1px solid #1565C0" }}
        >
          Get in Touch
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#1F2937" }}>We're Here to Help</h1>
        <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: "#6B7280" }}>
          Questions about buying, renting, investing, or our services? Reach out — our team typically responds within a few hours.
        </p>
      </section>

      {/* ── Contact Info Row ── */}
      <section className="px-4 -mt-8 mb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_INFO.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl p-5"
              style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 12px 28px rgba(31,41,55,0.06)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "#EFF6FF", color: "#1565C0" }}
              >
                {item.icon}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-sm font-semibold mt-1 block hover:underline"
                  style={{ color: "#1F2937" }}
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-sm font-semibold mt-1" style={{ color: "#1F2937" }}>{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Form + Map ── */}
      <section className="px-4 pb-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form */}
          <div className="rounded-2xl p-6 lg:p-8" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: "#1F2937" }}>Send Us a Message</h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>Fill out the form and we'll get back to you shortly.</p>

            {property && !submitted && (
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: "#EFF6FF", border: "1px solid #1565C0" }}>
                {property.images?.[0] && (
                  <img src={property.images[0]} alt={property.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#1565C0" }}>
                    {intent === "site-visit" ? "Scheduling a visit for" : intent === "callback" ? "Requesting a callback about" : "Inquiring about"}
                  </p>
                  <p className="text-sm font-bold truncate" style={{ color: "#1F2937" }}>{property.title}</p>
                  <p className="text-xs truncate" style={{ color: "#6B7280" }}>{property.location} · {property.price}</p>
                </div>
              </div>
            )}

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#F0FDF4" }}>
                  <svg className="w-8 h-8" fill="none" stroke="#16A34A" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold text-lg" style={{ color: "#1F2937" }}>Message Sent!</p>
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>We'll respond within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-5 text-xs font-semibold underline" style={{ color: "#1565C0" }}>
                  Send another message
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" placeholder="Full Name *" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                    style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                    onFocus={(e) => e.target.style.borderColor = "#1565C0"}
                    onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                  />
                  <input
                    type="tel" placeholder="Phone Number *" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                    style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                    onFocus={(e) => e.target.style.borderColor = "#1565C0"}
                    onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                  />
                </div>
                <input
                  type="email" placeholder="Email Address" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                  onFocus={(e) => e.target.style.borderColor = "#1565C0"}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                />
                <select
                  value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: form.subject ? "#1F2937" : "#6B7280" }}
                >
                  <option value="">What can we help with?</option>
                  <option value="buy">Buying a Property</option>
                  <option value="rent">Renting a Property</option>
                  <option value="sell">Selling a Property</option>
                  <option value="invest">Investment Advisory</option>
                  <option value="partner">Channel Partner Program</option>
                  <option value="prime">PB Prime Membership</option>
                  <option value="other">Something Else</option>
                </select>
                <textarea
                  placeholder="Your Message *" rows={4} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition resize-none"
                  style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                  onFocus={(e) => e.target.style.borderColor = "#1565C0"}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                />

                {/* ── Optional buyer/renter questions (Section 3A/3B) ── */}
                <button type="button" onClick={() => setShowBuyerQuestions((v) => !v)}
                  className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "#1565C0" }}>
                  {showBuyerQuestions ? "Hide" : "Tell us more about what you're looking for"} (optional)
                  <svg className={`w-4 h-4 transition-transform ${showBuyerQuestions ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showBuyerQuestions && !isRentInquiry && (
                  <div className="space-y-4 rounded-xl p-4" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Purpose</label>
                      <div className="flex flex-wrap gap-2">
                        {PURPOSE_OPTIONS.map((p) => (
                          <button key={p} type="button" onClick={() => setBuyerPrefs({ ...buyerPrefs, purpose: p })}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: buyerPrefs.purpose === p ? "#1565C0" : "#FFFFFF", color: buyerPrefs.purpose === p ? "#FFFFFF" : "#6B7280", border: `1px solid ${buyerPrefs.purpose === p ? "#1565C0" : "#E2E8F0"}` }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" min="0" placeholder="Total budget (₹, incl. charges)" value={buyerPrefs.budgetMax}
                        onChange={(e) => setBuyerPrefs({ ...buyerPrefs, budgetMax: e.target.value })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                      <input type="number" min="0" placeholder="Comfortable EMI (₹/mo)" value={buyerPrefs.comfortableEmi}
                        onChange={(e) => setBuyerPrefs({ ...buyerPrefs, comfortableEmi: e.target.value })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input placeholder="Preferred locations" value={buyerPrefs.preferredLocations.join(", ")}
                        onChange={(e) => setBuyerPrefs({ ...buyerPrefs, preferredLocations: locationsFromInput(e.target.value) })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                      <input placeholder="Acceptable locations" value={buyerPrefs.acceptableLocations.join(", ")}
                        onChange={(e) => setBuyerPrefs({ ...buyerPrefs, acceptableLocations: locationsFromInput(e.target.value) })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                      <input placeholder="Excluded locations" value={buyerPrefs.excludedLocations.join(", ")}
                        onChange={(e) => setBuyerPrefs({ ...buyerPrefs, excludedLocations: locationsFromInput(e.target.value) })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>How soon do you plan to buy?</label>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINE_OPTIONS.map((t) => (
                          <button key={t} type="button" onClick={() => setBuyerPrefs({ ...buyerPrefs, purchaseTimeline: t })}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: buyerPrefs.purchaseTimeline === t ? "#1565C0" : "#FFFFFF", color: buyerPrefs.purchaseTimeline === t ? "#FFFFFF" : "#6B7280", border: `1px solid ${buyerPrefs.purchaseTimeline === t ? "#1565C0" : "#E2E8F0"}` }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>What matters most?</label>
                      <div className="flex flex-wrap gap-2">
                        {PRIORITY_OPTIONS.map((p) => (
                          <button key={p} type="button" onClick={() => toggleBuyerArray("priorityFactors", p)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: buyerPrefs.priorityFactors.includes(p) ? "#1565C0" : "#FFFFFF", color: buyerPrefs.priorityFactors.includes(p) ? "#FFFFFF" : "#6B7280", border: `1px solid ${buyerPrefs.priorityFactors.includes(p) ? "#1565C0" : "#E2E8F0"}` }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Home loan or eligibility help?</label>
                      <div className="flex flex-wrap gap-2">
                        {LOAN_ASSISTANCE_OPTIONS.map((l) => (
                          <button key={l} type="button" onClick={() => setBuyerPrefs({ ...buyerPrefs, loanAssistance: l })}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: buyerPrefs.loanAssistance === l ? "#1565C0" : "#FFFFFF", color: buyerPrefs.loanAssistance === l ? "#FFFFFF" : "#6B7280", border: `1px solid ${buyerPrefs.loanAssistance === l ? "#1565C0" : "#E2E8F0"}` }}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Open to under-construction?</label>
                      <div className="flex flex-wrap gap-2">
                        {UNDER_CONSTRUCTION_OPTIONS.map((u) => (
                          <button key={u} type="button" onClick={() => setBuyerPrefs({ ...buyerPrefs, openToUnderConstruction: u })}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: buyerPrefs.openToUnderConstruction === u ? "#1565C0" : "#FFFFFF", color: buyerPrefs.openToUnderConstruction === u ? "#FFFFFF" : "#6B7280", border: `1px solid ${buyerPrefs.openToUnderConstruction === u ? "#1565C0" : "#E2E8F0"}` }}>
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Must-haves</label>
                      <div className="flex flex-wrap gap-2">
                        {MUST_HAVE_OPTIONS.map((m) => (
                          <button key={m} type="button" onClick={() => toggleBuyerArray("mustHaveFeatures", m)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: buyerPrefs.mustHaveFeatures.includes(m) ? "#1565C0" : "#FFFFFF", color: buyerPrefs.mustHaveFeatures.includes(m) ? "#FFFFFF" : "#6B7280", border: `1px solid ${buyerPrefs.mustHaveFeatures.includes(m) ? "#1565C0" : "#E2E8F0"}` }}>
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                      <input type="checkbox" checked={buyerPrefs.wantsComparison} onChange={(e) => setBuyerPrefs({ ...buyerPrefs, wantsComparison: e.target.checked })} className="w-4 h-4 rounded accent-[#1565C0]" />
                      I'd like to compare this with similar options
                    </label>
                  </div>
                )}

                {showBuyerQuestions && isRentInquiry && (
                  <div className="space-y-4 rounded-xl p-4" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Move-in Date</label>
                        <input type="date" value={renterPrefs.moveInDate} onChange={(e) => setRenterPrefs({ ...renterPrefs, moveInDate: e.target.value })}
                          className="w-full text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Profile</label>
                        <div className="flex flex-wrap gap-2">
                          {PROFILE_TYPE_OPTIONS.map((p) => (
                            <button key={p} type="button" onClick={() => setRenterPrefs({ ...renterPrefs, profileType: p })}
                              className="px-3 py-1.5 rounded-full text-xs font-semibold"
                              style={{ background: renterPrefs.profileType === p ? "#1565C0" : "#FFFFFF", color: renterPrefs.profileType === p ? "#FFFFFF" : "#6B7280", border: `1px solid ${renterPrefs.profileType === p ? "#1565C0" : "#E2E8F0"}` }}>
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input type="number" min="0" placeholder="Expected monthly rent (₹)" value={renterPrefs.monthlyRentBudget}
                        onChange={(e) => setRenterPrefs({ ...renterPrefs, monthlyRentBudget: e.target.value })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                      <input type="number" min="0" placeholder="Total upfront budget (₹)" value={renterPrefs.upfrontBudget}
                        onChange={(e) => setRenterPrefs({ ...renterPrefs, upfrontBudget: e.target.value })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Furnishing Requirement</label>
                      <div className="flex flex-wrap gap-2">
                        {FURNISHING_REQ_OPTIONS.map((f) => (
                          <button key={f} type="button" onClick={() => setRenterPrefs({ ...renterPrefs, furnishingRequirement: f })}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: renterPrefs.furnishingRequirement === f ? "#1565C0" : "#FFFFFF", color: renterPrefs.furnishingRequirement === f ? "#FFFFFF" : "#6B7280", border: `1px solid ${renterPrefs.furnishingRequirement === f ? "#1565C0" : "#E2E8F0"}` }}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Lease Duration</label>
                      <div className="flex flex-wrap gap-2">
                        {LEASE_DURATION_OPTIONS.map((l) => (
                          <button key={l} type="button" onClick={() => setRenterPrefs({ ...renterPrefs, leaseDuration: l })}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: renterPrefs.leaseDuration === l ? "#1565C0" : "#FFFFFF", color: renterPrefs.leaseDuration === l ? "#FFFFFF" : "#6B7280", border: `1px solid ${renterPrefs.leaseDuration === l ? "#1565C0" : "#E2E8F0"}` }}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Pet Requirement</label>
                      <div className="flex flex-wrap gap-2">
                        {PET_REQ_OPTIONS.map((p) => (
                          <button key={p} type="button" onClick={() => setRenterPrefs({ ...renterPrefs, petRequirement: p })}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: renterPrefs.petRequirement === p ? "#1565C0" : "#FFFFFF", color: renterPrefs.petRequirement === p ? "#FFFFFF" : "#6B7280", border: `1px solid ${renterPrefs.petRequirement === p ? "#1565C0" : "#E2E8F0"}` }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "#1F2937" }}>Parking Requirement</label>
                      <div className="flex flex-wrap gap-2">
                        {PARKING_REQ_OPTIONS.map((p) => (
                          <button key={p} type="button" onClick={() => setRenterPrefs({ ...renterPrefs, parkingRequirement: p })}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold"
                            style={{ background: renterPrefs.parkingRequirement === p ? "#1565C0" : "#FFFFFF", color: renterPrefs.parkingRequirement === p ? "#FFFFFF" : "#6B7280", border: `1px solid ${renterPrefs.parkingRequirement === p ? "#1565C0" : "#E2E8F0"}` }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input placeholder="Preferred localities" value={renterPrefs.preferredLocalities.join(", ")}
                        onChange={(e) => setRenterPrefs({ ...renterPrefs, preferredLocalities: locationsFromInput(e.target.value) })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                      <input placeholder="Commute destination" value={renterPrefs.commuteDestination}
                        onChange={(e) => setRenterPrefs({ ...renterPrefs, commuteDestination: e.target.value })}
                        className="text-sm rounded-lg px-3 py-2.5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" }} />
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                      <input type="checkbox" checked={renterPrefs.wantsBrokerageFree} onChange={(e) => setRenterPrefs({ ...renterPrefs, wantsBrokerageFree: e.target.checked })} className="w-4 h-4 rounded accent-[#1565C0]" />
                      Looking for brokerage-free options
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                      <input type="checkbox" checked={renterPrefs.wantsManagedRental} onChange={(e) => setRenterPrefs({ ...renterPrefs, wantsManagedRental: e.target.checked })} className="w-4 h-4 rounded accent-[#1565C0]" />
                      Interested in managed rental options
                    </label>
                  </div>
                )}

                {error && (
                  <p className="text-xs font-semibold" style={{ color: "#1565C0" }}>{error}</p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                  style={{ background: "#1565C0", color: "#FFFFFF" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#0D47A1"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#1565C0"}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            )}
          </div>

          {/* Map + Offices */}
          <div className="space-y-5">
            <div className="rounded-2xl overflow-hidden h-56" style={{ border: "1px solid #E2E8F0" }}>
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&h=400&fit=crop"
                alt="Office location map"
                className="w-full h-full object-cover"
              />
            </div>
            {OFFICES.map((office) => (
              <div key={office.id || office.city} className="rounded-2xl p-5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold" style={{ color: "#1F2937" }}>{office.city} Office</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#EFF6FF", color: "#1565C0" }}>
                    Open
                  </span>
                </div>
                <p className="text-xs" style={{ color: "#6B7280" }}>{office.address}</p>
                {office.phone && (
                  <a href={`tel:${office.phone.replace(/[^\d+]/g, "")}`} className="text-xs mt-1 font-semibold block hover:underline" style={{ color: "#1F2937" }}>
                    {office.phone}
                  </a>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold" style={{ color: "#1F2937" }}>Frequently Asked Questions</h2>
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#1565C0" }} />
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  style={{ background: "#FFFFFF" }}
                >
                  <span className="text-sm font-semibold" style={{ color: "#1F2937" }}>{item.q}</span>
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform"
                    style={{ color: "#1565C0", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                    fill="currentColor" viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm" style={{ color: "#6B7280", background: "#FFFFFF" }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
