import { useState, useEffect } from "react";
import { submitLead } from "../lib/leads";
import { fetchSiteSettings } from "../lib/siteContent";

// ── Data ──────────────────────────────────────────────────────────────────────

// ── URL MAP ───────────────────────────────────────────────────────────────────
// Paste real URLs here. Internal links use onNavigate(page) automatically;
// external links (legal pages, social) use the href values below directly.
// To point a link elsewhere, just change the value on the right.


const SERVICES = [
  { label: "Buy Property", page: "search" },
  { label: "Rent Property", page: "search" },
  { label: "Sell Property", page: "search" },
  { label: "Home Loans", page: "investment-advisory" },
  { label: "Property Management", page: "property-management" },
];

const COMPANY = [
  { label: "About Us", page: "about" },
  { label: "Careers", page: "careers" },
  { label: "Blogs", page: "blog" },
  { label: "Contact", page: "contact" },
];

const SUPPORT = [
  { label: "FAQ", page: "faq" },
  { label: "Privacy Policy", page: "privacy-policy" },
  { label: "Terms & Conditions", page: "terms-conditions" },
  { label: "Disclaimer", page: "disclaimer" },
];


const URL_MAP = {
  // Internal pages (must match a page id wired in App.jsx)
  about: "about",
  buyProperty: "search",
  sellProperty: "search",
  rentProperty: "search",
  blogs: "blog",
  emiCalculator: "investment-advisory",
  careers: "careers",
  contact: "contact",

  // Legal pages (internal — wired to real pages in App.jsx)
  privacyPolicy: "privacy-policy",
  termsConditions: "terms-conditions",
  disclaimer: "disclaimer",
  sitemap: "sitemap",

  // Social media — paste real profile URLs here when ready
  facebook: "#",
  instagram: "#",
  linkedin: "#",
  youtube: "#",
};

// ── Quick Links (per spec: About Us, Buy/Sell/Rent Property, Blogs, EMI Calculator, Careers, Contact) ──
const QUICK_LINKS = [
  { label: "About Us", page: URL_MAP.about },
  { label: "Buy Property", page: URL_MAP.buyProperty },
  { label: "Sell Property", page: URL_MAP.sellProperty },
  { label: "Rent Property", page: URL_MAP.rentProperty },
  { label: "Blogs", page: URL_MAP.blogs },
  { label: "EMI Calculator", page: URL_MAP.emiCalculator },
  { label: "Careers", page: URL_MAP.careers },
  { label: "Contact", page: URL_MAP.contact },
];

// ── Legal (per spec: Privacy Policy, Terms & Conditions, Disclaimer, Sitemap) ─
const LEGAL_LINKS = [
  { label: "Privacy Policy", page: URL_MAP.privacyPolicy },
  { label: "Terms & Conditions", page: URL_MAP.termsConditions },
  { label: "Disclaimer", page: URL_MAP.disclaimer },
  { label: "Sitemap", page: URL_MAP.sitemap },
];

const SOCIAL_ICON_DEFS = [
  {
    key: "facebook",
    name: "Facebook",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    bg: "hover:bg-blue-600",
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    bg: "hover:bg-pink-600",
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    bg: "hover:bg-[#0F2D52]",
  },
  {
    key: "youtube",
    name: "YouTube",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
    bg: "hover:bg-sky-600",
  },
];

// ── Contact Form ──────────────────────────────────────────────────────────────
function QuickInquiry() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", requirement: "", location: "", budget: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const REQUIREMENT_LABELS = { buy: "Buy", rent: "Rent", invest: "Investment", sell: "Sell" };

  async function handleSubmit() {
    if (!(form.name && form.phone)) return;
    setSubmitting(true);
    setError("");
    const interestParts = [REQUIREMENT_LABELS[form.requirement] || "General Inquiry"];
    if (form.location) interestParts.push(`in ${form.location}`);
    const { error } = await submitLead({
      name: form.name,
      phone: form.phone,
      email: form.email,
      interest: interestParts.join(" "),
      budget: form.budget,
      source: "Website",
    });
    setSubmitting(false);
    if (error) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
          <svg className="w-7 h-7 text-[#4ade80]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-bold text-base mb-1">Inquiry Submitted!</p>
        <p className="text-[#6B7280] text-sm">Our expert will call you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-[#6B7280] hover:text-white underline">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[
        { key: "name", placeholder: "Your Name *", type: "text" },
        { key: "phone", placeholder: "Phone Number *", type: "tel" },
        { key: "email", placeholder: "Email Address", type: "email" },
      ].map((field) => (
        <input
          key={field.key}
          type={field.type}
          placeholder={field.placeholder}
          value={form[field.key]}
          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
          className="w-full bg-[#FFFFFF]/15 border border-white/25 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-white/60 transition"
        />
      ))}
      <select
        value={form.requirement}
        onChange={(e) => setForm({ ...form, requirement: e.target.value })}
        className="w-full bg-[#FFFFFF]/15 border border-white/25 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/60 transition"
      >
        <option value="" className="text-[#1F2937]">Property Requirement</option>
        <option value="buy" className="text-[#1F2937]">Buy</option>
        <option value="rent" className="text-[#1F2937]">Rent</option>
        <option value="invest" className="text-[#1F2937]">Investment</option>
        <option value="sell" className="text-[#1F2937]">Sell</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Preferred Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="bg-[#FFFFFF]/15 border border-white/25 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-white/60 transition"
        />
        <input
          type="text"
          placeholder="Budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className="bg-[#FFFFFF]/15 border border-white/25 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#6B7280] focus:outline-none focus:border-white/60 transition"
        />
      </div>
      {error && <p className="text-xs font-semibold text-sky-200">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-[#FFFFFF] text-[#1565C0] font-bold py-2.5 rounded-lg hover:bg-[#F1F5F9] transition text-sm shadow disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send Inquiry"}
      </button>
    </div>
  );
}

// ── Main Footer ───────────────────────────────────────────────────────────────
export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then(({ data }) => { if (!cancelled) setSettings(data); });
    return () => { cancelled = true; };
  }, []);

  // Defaults match what the site showed before this became admin-editable —
  // used until migration_009 has been run / settings have been saved.
  const info = {
    phone: settings?.phone || "+91 94301 00000",
    whatsapp: settings?.whatsapp || "+91 98765 00000",
    email: settings?.email || "info@propertybrands.in",
    website: settings?.website || "www.propertybrands.in",
    address: settings?.address || "PropertyBrands Realty Services, Bhubaneswar, Odisha — 751001",
  };

  // Only show a social icon once a real URL has been set in the admin
  // console — no more icons quietly linking to "#".
  const activeSocials = SOCIAL_ICON_DEFS
    .map((s) => ({ ...s, href: settings?.[s.key] }))
    .filter((s) => s.href && s.href !== "#");

  return (
    <footer>
      {/* ── Get in Touch Band ── */}
      <div className="bg-[radial-gradient(circle_at_top_right,_rgba(21,101,192,0.08),_transparent_35%),linear-gradient(to_bottom_right,#ffffff,#f8fafc)] px-4 py-16">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      {/* Left – Contact Info */}
        <div>
          <span className="text-[#1565C0] text-xs font-bold uppercase tracking-widest mb-2 block">
          Get in Touch
          </span>

          <h2 className="text-[#1F2937] text-3xl font-extrabold leading-tight mb-8">
          property<span className="text-[#F59E0B]">Brands</span> Realty Services
          </h2>

        <div className="space-y-5">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              label: "Corporate Office",
              value: info.address,
              href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`,
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                </svg>
              ),
              label: "Phone",
              value: info.phone,
              href: `tel:${info.phone.replace(/[^\d+]/g, "")}`,
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12a4 4 0 108 0 4 4 0 00-8 0z" />
                </svg>
              ),
              label: "WhatsApp",
              value: info.whatsapp,
              href: `https://wa.me/${info.whatsapp.replace(/[^\d]/g, "")}`,
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              label: "Email",
              value: info.email,
              href: `mailto:${info.email}`,
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              ),
              label: "Website",
              value: info.website,
              href: `https://${info.website.replace(/^https?:\/\//, "")}`,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#1565C0] shrink-0">
                {item.icon}
              </div>

              <div>
                <p className="text-[#1565C0] text-[11px] font-bold uppercase tracking-wider">
                  {item.label}
                </p>

                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-[#1F2937] text-sm font-medium mt-1 block hover:text-[#1565C0] hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-[#1F2937] text-sm font-medium mt-1">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social Icons — only shown once real URLs are set in the admin console */}
        {activeSocials.length > 0 && (
          <div className="mt-8">
            <p className="text-[#1565C0] text-xs font-bold uppercase tracking-widest mb-3">
              Follow Us
            </p>

            <div className="flex items-center gap-3">
              {activeSocials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1565C0] text-slate-600 transition-all duration-300 flex items-center justify-center"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right – Inquiry Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        <p className="text-[#1565C0] text-xs font-bold uppercase tracking-widest mb-2">
          Quick Inquiry
        </p>

        <h3 className="text-[#1F2937] font-bold text-2xl mb-6">
          Tell us what you're looking for
        </h3>

        <QuickInquiry />
      </div>

    </div>
  </div>
</div>

      {/* ── Main Footer Links ── */}
    <div className="bg-gradient-to-b from-white to-slate-50 px-4 py-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10">

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/cropped_logo.png" alt="PropertyBrands" className="h-12 w-auto object-cover" />
              
            </div>

            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              A next-generation PropTech company offering end-to-end real estate solutions across residential, commercial, investment advisory, and property management.
            </p>

            <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 rounded-xl px-3 py-2 w-fit">
              <svg
                className="w-4 h-4 text-sky-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>

              <span className="text-sky-700 text-[10px] font-bold">
                RERA Registered
              </span>
            </div>
          </div>

          {/* Services */}
<div>
  <h4 className="font-bold text-[#1F2937] mb-4">Services</h4>

  <div className="space-y-3">
    {[
      { label: "Buy Property", page: "search" },
      { label: "Rent Property", page: "search" },
      { label: "Sell Property", page: "search" },
      { label: "Home Loans", page: "investment-advisory" },
      { label: "Property Management", page: "property-management" },
    ].map((item) => (
      <button
        key={item.label}
        onClick={() => onNavigate?.(item.page)}
        className="block text-sm text-slate-600 hover:text-[#1565C0]"
      >
        {item.label}
      </button>
    ))}
  </div>
</div>

{/* Company */}
<div>
  <h4 className="font-bold text-[#1F2937] mb-4">Company</h4>

  <div className="space-y-3">
    {[
      { label: "About Us", page: "about" },
      { label: "Careers", page: "careers" },
      { label: "Blogs", page: "blog" },
      { label: "Contact", page: "contact" },
    ].map((item) => (
      <button
        key={item.label}
        onClick={() => onNavigate?.(item.page)}
        className="block text-sm text-slate-600 hover:text-[#1565C0]"
      >
        {item.label}
      </button>
    ))}
  </div>
</div>

{/* Support */}
<div>
  <h4 className="font-bold text-[#1F2937] mb-4">Support</h4>

  <div className="space-y-3">
    {[
      { label: "Privacy Policy", page: "privacy-policy" },
      { label: "Terms & Conditions", page: "terms-conditions" },
      { label: "Disclaimer", page: "disclaimer" },
      { label: "Sitemap", page: "sitemap" },
    ].map((item) => (
      <button
        key={item.label}
        onClick={() => onNavigate?.(item.page)}
        className="block text-sm text-slate-600 hover:text-[#1565C0]"
      >
        {item.label}
      </button>
    ))}
  </div>
</div>

{/* Contact */}
<div>
  <h4 className="font-bold text-[#1F2937] mb-4">Contact</h4>

  <div className="space-y-3 text-sm text-slate-600">
    <p>{info.phone}</p>
    <p>{info.email}</p>
    <p>{info.website}</p>
    <p>{info.address}</p>
  </div>
</div>
          
        </div>

        {/* Quick Links Strip */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-slate-700 text-xs font-semibold mr-1">
              Quick Links:
            </span>

            {QUICK_LINKS.map((l, i) => (
              <span key={l.label} className="flex items-center gap-1">
                <button
                  onClick={() => onNavigate && onNavigate(l.page)}
                  className="text-slate-600 text-xs hover:text-[#1565C0] transition"
                >
                  {l.label}
                </button>

                {i < QUICK_LINKS.length - 1 && (
                  <span className="text-slate-300 text-xs">•</span>
                )}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
      {/* ── Bottom Bar ── */}
      <div className="bg-[#FFFFFF] px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#6B7280] text-xs text-center sm:text-left">
            © {currentYear} PropertyBrands Realty Services. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((l, i, arr) => (
              <span key={l.label} className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate && onNavigate(l.page)}
                  className="text-slate-600 text-xs font-medium hover:text-[#1565C0] hover:translate-x-0.5 transition-all duration-300 inline-flex items-center"
                >
                  {l.label}
                </button>
                {i < arr.length - 1 && <span className="text-[#1F2937] text-xs">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
