import { useState, useEffect } from "react";
import { submitLead } from "../lib/leads";
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
  const intent = isRichPayload ? initialSubject.intent : null; // "contact" | "site-visit"

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
    return `I'm interested in "${property.title}"${property.location ? ` in ${property.location}` : ""}${specs ? ` (${specs})` : ""} and would like more details.`;
  }

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: subjectValue || "", message: defaultMessage() });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  async function handleSubmit() {
    if (!(form.name && form.phone && form.message)) return;
    setSubmitting(true);
    setError("");

    // When this came from a specific property, weave its details into the
    // interest text and link the lead to it directly (listingId) so it
    // shows up with full specs/photos wherever leads are reviewed.
    const interest = property
      ? `${intent === "site-visit" ? "Site Visit Request" : SUBJECT_LABELS[form.subject] || "Property Inquiry"} — ${property.title}, ${property.location}, ${property.price}${property.bhkLabel ? `, ${property.bhkLabel}` : ""}${property.area ? `, ${property.area}` : ""} — ${form.message}`
      : `${SUBJECT_LABELS[form.subject] || "General Inquiry"} — ${form.message}`;

    const { error } = await submitLead({
      name: form.name,
      phone: form.phone,
      email: form.email,
      interest,
      budget: property?.price,
      listingId: property?.dbId,
      stage: intent === "site-visit" ? "Site Visit" : undefined,
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
          style={{ background: "#FFFFFF", color: "#1E88E5", border: "1px solid #1E88E5" }}
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
                style={{ background: "#EFF6FF", color: "#1E88E5" }}
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
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: "#EFF6FF", border: "1px solid #1E88E5" }}>
                {property.images?.[0] && (
                  <img src={property.images[0]} alt={property.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#1E88E5" }}>
                    {intent === "site-visit" ? "Scheduling a visit for" : "Inquiring about"}
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
                <button onClick={() => setSubmitted(false)} className="mt-5 text-xs font-semibold underline" style={{ color: "#1E88E5" }}>
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
                    onFocus={(e) => e.target.style.borderColor = "#1E88E5"}
                    onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                  />
                  <input
                    type="tel" placeholder="Phone Number *" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                    style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                    onFocus={(e) => e.target.style.borderColor = "#1E88E5"}
                    onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                  />
                </div>
                <input
                  type="email" placeholder="Email Address" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
                  style={{ background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#1F2937" }}
                  onFocus={(e) => e.target.style.borderColor = "#1E88E5"}
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
                  onFocus={(e) => e.target.style.borderColor = "#1E88E5"}
                  onBlur={(e) => e.target.style.borderColor = "#E2E8F0"}
                />
                {error && (
                  <p className="text-xs font-semibold" style={{ color: "#1E88E5" }}>{error}</p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60"
                  style={{ background: "#1E88E5", color: "#FFFFFF" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#1565C0"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#1E88E5"}
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#EFF6FF", color: "#1E88E5" }}>
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
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#1E88E5" }} />
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
                    style={{ color: "#1E88E5", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
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
