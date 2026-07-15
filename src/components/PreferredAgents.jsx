import { useState, useRef, useEffect } from "react";
import { fetchPublicAgents } from "../lib/agents";

// ── Data ──────────────────────────────────────────────────────────────────────

const NEW_PROJECT_FEATURES = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    label: "Directory for All New Projects",
    bg: "bg-[#EAF4FB]",
    iconColor: "text-blue-500",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    label: "All Reports from RERA",
    bg: "bg-[#FCEAEA]",
    iconColor: "text-[#2C9DD5]",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    label: "Expert Reviews & Advice",
    bg: "bg-[#F2F4F6]",
    iconColor: "text-yellow-500",
  },
];

const SITE_VISIT_STEPS = [
  { num: "01", label: "Browse Projects", desc: "Explore verified listings with floor plans & virtual tours" },
  { num: "02", label: "Schedule Visit", desc: "Pick a date and time that works for you" },
  { num: "03", label: "Get Free Cab", desc: "We arrange transport to the site — no cost to you" },
  { num: "04", label: "Evaluate & Decide", desc: "Our expert joins you to help assess the property" },
];

const AVATAR_COLORS = ["bg-blue-600", "bg-rose-600", "bg-emerald-600", "bg-violet-600", "bg-[#E87C02]", "bg-pink-600"];
function avatarColorFor(name) {
  const hash = [...(name || "")].reduce((h, c) => h + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
function initialsFor(name) {
  return (name || "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? "text-[#E87C02] fill-[#E87C02]" : "text-gray-200 fill-gray-200"}`}
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
    <div className="flex-shrink-0 w-64 bg-[#FFFFFF] border border-[#E5E8EB] rounded-xl p-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer group">
      {/* Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#2C9DD5] bg-[#EAF4FB] px-2 py-0.5 rounded-full border border-[#2C9DD5]/30">
          <svg className="w-3 h-3 fill-[#2C9DD5]" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {agent.tier} Partner
        </span>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-full ${avatarColorFor(agent.name)} flex items-center justify-center text-white font-bold text-sm shrink-0 ring-2 ring-white shadow`}>
          {initialsFor(agent.name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#15191C] truncate">{agent.name}</p>
          <p className="text-[11px] text-[#495057] truncate">{agent.agency || agent.city || "Independent Agent"}</p>
          {agent.rating > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <Stars rating={agent.rating} />
            </div>
          )}
        </div>
      </div>

      {/* Meta row */}
      <div className="text-[11px] text-[#495057] mb-3 flex items-center gap-1 flex-wrap">
        {agent.since && agent.since !== "—" && (
          <>
            <svg className="w-3 h-3 text-[#495057] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Since <span className="font-semibold text-[#1F242A] ml-0.5">{agent.since}</span>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-2 mb-3">
        <div className="bg-[#F7F8FA] rounded-lg p-2 text-center">
          <p className="text-base font-extrabold text-[#15191C]">{agent.deals}</p>
          <p className="text-[10px] text-[#495057] font-medium leading-tight">Deals Closed</p>
        </div>
      </div>

      {/* Contact Button */}
      <button
        onClick={() => setContacted(!contacted)}
        className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${
          contacted
            ? "bg-[#EAF8EC] text-[#4ade80] border border-[#1a3a1a]"
            : "bg-[#2C9DD5] text-white hover:bg-[#5C0B03]"
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
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5E8EB] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-6 border-b border-[#E5E8EB]">
        <span className="inline-block bg-[#2C9DD5] text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
          New Launch
        </span>
        <h2 className="text-2xl font-extrabold text-[#15191C] tracking-tight">
          property<span className="text-[#2C9DD5]">Homes</span>
        </h2>
        <p className="text-[#495057] text-sm mt-1 font-medium">
          Encyclopedia For All New Projects
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E8EB]">
        {NEW_PROJECT_FEATURES.map((feat) => (
          <button
            key={feat.label}
            className={`${feat.bg} flex flex-col items-center justify-center gap-3 p-8 hover:brightness-95 transition-all group cursor-pointer`}
          >
            <div className={`${feat.iconColor} group-hover:scale-110 transition-transform`}>
              {feat.icon}
            </div>
            <span className="text-sm font-semibold text-[#1F242A] text-center leading-tight">
              {feat.label}
            </span>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center py-6 border-t border-[#E5E8EB]">
        <button className="bg-[#BA0D0B] text-white text-sm font-bold px-8 py-3 rounded-lg hover:bg-[#5C0B03] transition shadow-sm">
          View All New Projects
        </button>
      </div>
    </div>
  );
}

// ── Site Visit Banner ─────────────────────────────────────────────────────────
function SiteVisitBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(186,13,11,0.08),_transparent_35%),linear-gradient(to_bottom_right,#ffffff,#f8fafc)] shadow-lg p-6 md:p-8">
      
      {/* Decorative Glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left */}
        <div className="flex-1 max-w-md">
          <p className="text-[#BA0D0B] text-xs font-bold uppercase tracking-widest mb-2">
            Plan hassle-free
          </p>

          <h3 className="text-[#15191C] text-2xl font-extrabold leading-tight mb-2">
            Site Visits & Evaluate Projects
          </h3>

          <p className="text-slate-600 text-sm mb-2">
            with{" "}
            <span className="text-[#BA0D0B] font-bold">
              PropertyDiary
            </span>
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-2">
            <span className="text-lg">🚕</span>

            <p className="text-sm text-slate-700">
              Get{" "}
              <span className="font-bold text-[#15191C]">
                Free Cab
              </span>{" "}
              for every site visit
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col sm:flex-row gap-6 flex-1">
          {SITE_VISIT_STEPS.map((step, i) => (
            <div
              key={step.num}
              className="flex items-start gap-3 flex-1"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <span className="text-[#BA0D0B] text-xs font-extrabold">
                  {step.num}
                </span>
              </div>

              <div>
                <p className="text-[#15191C] text-sm font-bold leading-tight">
                  {step.label}
                </p>

                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {i < SITE_VISIT_STEPS.length - 1 && (
                <svg
                  className="w-4 h-4 text-slate-300 shrink-0 mt-2 hidden sm:block"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="bg-[#BA0D0B] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#990A09] transition-all duration-300 shadow-md hover:shadow-lg shrink-0">
          Find out how
        </button>

      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function PreferredAgents({ onNavigate }) {
  const rowRef = useRef(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPublicAgents().then(({ data }) => {
      if (!cancelled) { setAgents(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  function scroll(dir) {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  return (
    <section className="bg-[#FFFFFF] py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Preferred Agents ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#15191C]">PB Preferred Agents</h2>
              <div className="w-10 h-0.5 bg-[#2C9DD5] rounded-full mt-1" />
            </div>
            <button onClick={() => onNavigate && onNavigate("agents")} className="flex items-center gap-1 text-sm font-semibold text-[#2C9DD5] hover:underline">
              See all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => <div key={i} className="w-64 h-64 rounded-xl shrink-0 animate-pulse" style={{ background: "#F2F4F6" }} />)}
            </div>
          ) : agents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
              <span className="text-4xl mb-3">🧑‍💼</span>
              <p className="text-sm font-bold" style={{ color: "#15191C" }}>No preferred agents yet</p>
              <p className="text-xs mt-1" style={{ color: "#495057" }}>Verified partner agents will appear here as they join.</p>
            </div>
          ) : (
            /* Scrollable agent row */
            <div className="relative group/agents">
              <button
                onClick={() => scroll(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E8EB] shadow-lg flex items-center justify-center text-[#495057] hover:text-[#2C9DD5] hover:border-[#2C9DD5] opacity-0 group-hover/agents:opacity-100 transition"
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
                {agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>

              <button
                onClick={() => scroll(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E8EB] shadow-lg flex items-center justify-center text-[#495057] hover:text-[#2C9DD5] hover:border-[#2C9DD5] opacity-0 group-hover/agents:opacity-100 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* ── New Projects Encyclopedia ── */}
        <NewProjectsSection />

        {/* ── Site Visit Banner ── */}
        <SiteVisitBanner />

      </div>
    </section>
  );
}
