import { useState, useRef } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const AGENTS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    agency: "Kumar Properties",
    avatar: "RK",
    avatarBg: "bg-blue-600",
    badge: "PB Preferred",
    operatingSince: 2008,
    buyerServed: "8500+",
    propertiesForSale: 42,
    propertiesForRent: 31,
    rating: 4.8,
    reviews: 214,
    specialization: ["Residential", "Plots"],
    phone: "+91 94301 12345",
    verified: true,
  },
  {
    id: 2,
    name: "Priya Sharma",
    agency: "Sharma Realty",
    avatar: "PS",
    avatarBg: "bg-rose-600",
    badge: "PB Preferred",
    operatingSince: 2012,
    buyerServed: "5200+",
    propertiesForSale: 28,
    propertiesForRent: 19,
    rating: 4.7,
    reviews: 178,
    specialization: ["Luxury", "Villas"],
    phone: "+91 98765 54321",
    verified: true,
  },
  {
    id: 3,
    name: "Anil Mehta",
    agency: "Mehta Associates",
    avatar: "AM",
    avatarBg: "bg-emerald-600",
    badge: "PB Preferred",
    operatingSince: 2005,
    buyerServed: "12000+",
    propertiesForSale: 67,
    propertiesForRent: 44,
    rating: 4.9,
    reviews: 390,
    specialization: ["Commercial", "Office"],
    phone: "+91 90123 67890",
    verified: true,
  },
  {
    id: 4,
    name: "Sunita Verma",
    agency: "Verma Homes",
    avatar: "SV",
    avatarBg: "bg-violet-600",
    badge: "PB Preferred",
    operatingSince: 2015,
    buyerServed: "3100+",
    propertiesForSale: 21,
    propertiesForRent: 14,
    rating: 4.6,
    reviews: 92,
    specialization: ["Affordable", "Apartments"],
    phone: "+91 91234 78901",
    verified: true,
  },
  {
    id: 5,
    name: "Deepak Singh",
    agency: "Singh & Sons Realty",
    avatar: "DS",
    avatarBg: "bg-amber-600",
    badge: "PB Preferred",
    operatingSince: 2010,
    buyerServed: "6700+",
    propertiesForSale: 35,
    propertiesForRent: 22,
    rating: 4.7,
    reviews: 261,
    specialization: ["Residential", "NRI"],
    phone: "+91 88001 23456",
    verified: true,
  },
  {
    id: 6,
    name: "Kavitha Nair",
    agency: "Nair Properties",
    avatar: "KN",
    avatarBg: "bg-pink-600",
    badge: "PB Preferred",
    operatingSince: 2018,
    buyerServed: "1800+",
    propertiesForSale: 16,
    propertiesForRent: 11,
    rating: 4.5,
    reviews: 73,
    specialization: ["Interior", "Apartments"],
    phone: "+91 99887 65432",
    verified: true,
  },
];

const NEW_PROJECT_FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    label: "Directory for All New Projects",
    bg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    label: "All Reports from RERA",
    bg: "bg-red-50",
    iconColor: "text-[#E03A3C]",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    label: "Expert Reviews & Advice",
    bg: "bg-yellow-50",
    iconColor: "text-yellow-500",
  },
];

const SITE_VISIT_STEPS = [
  { num: "01", label: "Browse Projects", desc: "Explore verified listings with floor plans & virtual tours" },
  { num: "02", label: "Schedule Visit", desc: "Pick a date and time that works for you" },
  { num: "03", label: "Get Free Cab", desc: "We arrange transport to the site — no cost to you" },
  { num: "04", label: "Evaluate & Decide", desc: "Our expert joins you to help assess the property" },
];

// ── Star Rating ───────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Agent Card ────────────────────────────────────────────────────────────────
function AgentCard({ agent }) {
  const [contacted, setContacted] = useState(false);

  return (
    <div className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer group">
      {/* Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#E03A3C] bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
          <svg className="w-3 h-3 fill-[#E03A3C]" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {agent.badge}
        </span>
        {/* Agency logo placeholder */}
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400 border border-gray-200">
          LOGO
        </div>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full ${agent.avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-white shadow`}>
          {agent.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{agent.name}</p>
          <p className="text-[11px] text-gray-500 truncate">{agent.agency}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Stars rating={agent.rating} />
            <span className="text-[10px] text-gray-400">({agent.reviews})</span>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="text-[11px] text-gray-500 mb-3 flex items-center gap-1">
        <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Operating Since <span className="font-semibold text-gray-700 ml-0.5">{agent.operatingSince}</span>
        <span className="mx-1 text-gray-300">|</span>
        <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Buyers <span className="font-semibold text-gray-700 ml-0.5">{agent.buyerServed}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-base font-extrabold text-gray-900">{agent.propertiesForSale}</p>
          <p className="text-[10px] text-gray-400 font-medium leading-tight">Properties<br />for Sale</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-base font-extrabold text-gray-900">{agent.propertiesForRent}</p>
          <p className="text-[10px] text-gray-400 font-medium leading-tight">Properties<br />for Rent</p>
        </div>
      </div>

      {/* Specialization tags */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {agent.specialization.map((s) => (
          <span key={s} className="text-[10px] bg-red-50 text-[#E03A3C] border border-red-100 px-2 py-0.5 rounded-full font-semibold">
            {s}
          </span>
        ))}
      </div>

      {/* Contact Button */}
      <button
        onClick={() => setContacted(!contacted)}
        className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
          contacted
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-[#E03A3C] text-white hover:bg-red-700"
        }`}
      >
        {contacted ? "✓ Request Sent" : "Contact Agent"}
      </button>
    </div>
  );
}

// ── New Projects Encyclopedia ─────────────────────────────────────────────────
function NewProjectsSection() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-6 border-b border-gray-100">
        <span className="inline-block bg-[#E03A3C] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
          New Launch
        </span>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          property<span className="text-[#E03A3C]">Homes</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1 font-medium">
          Encyclopedia For All New Projects
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {NEW_PROJECT_FEATURES.map((feat) => (
          <button
            key={feat.label}
            className={`${feat.bg} flex flex-col items-center justify-center gap-3 p-8 hover:brightness-95 transition-all group cursor-pointer`}
          >
            <div className={`${feat.iconColor} group-hover:scale-110 transition-transform`}>
              {feat.icon}
            </div>
            <span className="text-sm font-semibold text-gray-700 text-center leading-tight">
              {feat.label}
            </span>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center py-6 border-t border-gray-100">
        <button className="bg-[#E03A3C] text-white text-sm font-bold px-8 py-3 rounded-lg hover:bg-red-700 transition shadow-sm">
          View All New Projects
        </button>
      </div>
    </div>
  );
}

// ── Site Visit Banner ─────────────────────────────────────────────────────────
function SiteVisitBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left */}
        <div className="flex-1">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
            Plan hassle-free
          </p>
          <h3 className="text-white text-xl font-extrabold leading-tight mb-1">
            Site Visits & Evaluate Projects
          </h3>
          <p className="text-slate-300 text-sm mb-1">
            with <span className="text-[#E03A3C] font-bold">PropertyDiary</span>
          </p>
          <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5 mt-2">
            <span className="text-yellow-400 text-base">🚕</span>
            Get <strong className="text-white">Free Cab</strong> for every site visit!
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {SITE_VISIT_STEPS.map((step, i) => (
            <div key={step.num} className="flex items-start gap-2 flex-1">
              <span className="text-[#E03A3C] text-xs font-extrabold shrink-0 mt-0.5">{step.num}</span>
              <div>
                <p className="text-white text-xs font-bold leading-tight">{step.label}</p>
                <p className="text-slate-500 text-[10px] mt-0.5 leading-tight">{step.desc}</p>
              </div>
              {i < SITE_VISIT_STEPS.length - 1 && (
                <svg className="w-3 h-3 text-slate-600 shrink-0 mt-0.5 hidden sm:block" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="bg-[#E03A3C] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 transition shrink-0">
          Find out how
        </button>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function PreferredAgents() {
  const rowRef = useRef(null);

  function scroll(dir) {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Preferred Agents ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">PB Preferred Agents in Ranchi</h2>
              <div className="w-10 h-0.5 bg-[#E03A3C] rounded-full mt-1" />
            </div>
            <a href="#" className="flex items-center gap-1 text-sm font-semibold text-[#E03A3C] hover:underline">
              See all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Scrollable agent row */}
          <div className="relative group/agents">
            <button
              onClick={() => scroll(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-500 hover:text-[#E03A3C] hover:border-[#E03A3C] opacity-0 group-hover/agents:opacity-100 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              ref={rowRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {AGENTS.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>

            <button
              onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-500 hover:text-[#E03A3C] hover:border-[#E03A3C] opacity-0 group-hover/agents:opacity-100 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── New Projects Encyclopedia ── */}
        <NewProjectsSection />

        {/* ── Site Visit Banner ── */}
        <SiteVisitBanner />

      </div>
    </section>
  );
}
