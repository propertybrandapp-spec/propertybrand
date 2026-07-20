import { useState } from "react";
import { useScrollToAnchor, ANCHOR_HIGHLIGHT_STYLE } from "../lib/useScrollToAnchor";

// ── Data ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Tenant Management",
    desc: "End-to-end tenant sourcing, background verification, agreement drafting, and move-in coordination.",
    tag: "Most Requested",
    tagColor: "#2C9DD5",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Rent Collection",
    desc: "Automated rent collection, digital payment tracking, rent receipts, and timely transfer to owner accounts.",
    tag: "Automated",
    tagColor: "#E87C02",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Maintenance Coordination",
    desc: "24/7 maintenance request handling, vetted vendor network, repair scheduling, and quality checks.",
    tag: "24/7 Support",
    tagColor: "#4ade80",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Property Inspection",
    desc: "Scheduled physical inspections with photo & video reports, condition assessments, and maintenance logs.",
    tag: "Photo Reports",
    tagColor: "#a78bfa",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Legal & Documentation",
    desc: "Lease agreement drafting, renewal management, NOC handling, and legal dispute resolution support.",
    tag: "RERA Compliant",
    tagColor: "#2C9DD5",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    title: "Resale Assistance",
    desc: "When you're ready to sell, we handle valuation, listing, buyer sourcing, negotiations, and registration.",
    tag: "Full Service",
    tagColor: "#E87C02",
  },
];

const PLANS = [
  {
    name: "Basic",
    price: "₹2,999",
    period: "/month",
    idealFor: "Self-managed owners",
    color: "#495057",
    borderColor: "#E5E8EB",
    features: [
      { text: "Tenant Sourcing", included: true },
      { text: "Rent Collection", included: true },
      { text: "Digital Receipts", included: true },
      { text: "Quarterly Inspection", included: true },
      { text: "Maintenance Support", included: false },
      { text: "Legal Documentation", included: false },
      { text: "Dedicated RM", included: false },
      { text: "Resale Assistance", included: false },
    ],
    popular: false,
  },
  {
    name: "Standard",
    price: "₹5,499",
    period: "/month",
    idealFor: "NRIs & busy professionals",
    color: "#2C9DD5",
    borderColor: "#2C9DD5",
    features: [
      { text: "Tenant Sourcing", included: true },
      { text: "Rent Collection", included: true },
      { text: "Digital Receipts", included: true },
      { text: "Monthly Inspection", included: true },
      { text: "Maintenance Support", included: true },
      { text: "Legal Documentation", included: true },
      { text: "Dedicated RM", included: false },
      { text: "Resale Assistance", included: false },
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹9,999",
    period: "/month",
    idealFor: "Multi-property investors",
    color: "#E87C02",
    borderColor: "#E87C02",
    features: [
      { text: "Tenant Sourcing", included: true },
      { text: "Rent Collection", included: true },
      { text: "Digital Receipts", included: true },
      { text: "Weekly Inspection", included: true },
      { text: "Priority Maintenance", included: true },
      { text: "Full Legal Support", included: true },
      { text: "Dedicated RM", included: true },
      { text: "Resale Assistance", included: true },
    ],
    popular: false,
  },
];

const IDEAL_FOR = [
  {
    icon: "🌍",
    title: "NRIs",
    desc: "Living abroad but own property in India? We manage everything so you don't have to worry from thousands of miles away.",
    highlight: "Remote Dashboard Access",
  },
  {
    icon: "📈",
    title: "Investors",
    desc: "Own multiple rental properties? Our portfolio management service maximizes your yield with minimal involvement.",
    highlight: "Portfolio Analytics",
  },
  {
    icon: "💼",
    title: "Busy Professionals",
    desc: "No time to chase tenants or coordinate repairs? Let us handle it all while you focus on your career.",
    highlight: "Zero Hassle Management",
  },
];

const DASHBOARD_FEATURES = [
  { icon: "📊", label: "Real-time rent tracking" },
  { icon: "📸", label: "Inspection photo reports" },
  { icon: "🔧", label: "Maintenance request log" },
  { icon: "📄", label: "Document vault" },
  { icon: "💳", label: "Payment history" },
  { icon: "📞", label: "RM direct chat" },
];

// ── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan }) {
  return (
    <div
      className="relative rounded-2xl p-6 flex flex-col transition-transform duration-200 hover:-translate-y-1"
      style={{
        background: plan.popular ? "#FFFFFF" : "#FFFFFF",
        border: `1.5px solid ${plan.borderColor}`,
        boxShadow: plan.popular ? `0 0 40px ${plan.color}18` : "none",
      }}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap"
          style={{ background: "#2C9DD5", color: "#FFFFFF" }}>
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-extrabold mb-0.5" style={{ color: plan.color }}>{plan.name}</h3>
        <p className="text-xs" style={{ color: "#495057" }}>{plan.idealFor}</p>
      </div>

      {/* Price */}
      <div className="mb-5 pb-5" style={{ borderBottom: "1px solid #E5E8EB" }}>
        <span className="text-3xl font-black" style={{ color: "#15191C" }}>{plan.price}</span>
        <span className="text-sm ml-1" style={{ color: "#495057" }}>{plan.period}</span>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-7 flex-1">
        {plan.features.map((f) => (
          <li key={f.text} className="flex items-center gap-2.5 text-sm"
            style={{ color: f.included ? "#1F242A" : "#D6DADD" }}>
            {f.included ? (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: plan.color }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#D6DADD" }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {f.text}
          </li>
        ))}
      </ul>

      <button
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{
          background: plan.popular ? "#BA0D0B" : "transparent",
          color: plan.popular ? "#FFFFFF" : plan.color,
          border: plan.popular ? "none" : `1.5px solid ${plan.color}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#BA0D0B"; e.currentTarget.style.color = "#FFFFFF"; e.currentTarget.style.border = "none"; }}
        onMouseLeave={e => { e.currentTarget.style.background = plan.popular ? "#BA0D0B" : "transparent"; e.currentTarget.style.color = plan.popular ? "#FFFFFF" : plan.color; e.currentTarget.style.border = plan.popular ? "none" : `1.5px solid ${plan.color}`; }}
      >
        Get Started
      </button>
    </div>
  );
}

// Maps each service card's title to the anchor id its navbar link points at
const SERVICE_ANCHORS = {
  "Tenant Management": "tenant-management",
  "Rent Collection": "rent-collection",
  "Maintenance Coordination": "maintenance-coordination",
};

// ── Main Export ───────────────────────────────────────────────────────────────
export default function PropertyManagement({ onNavigate, scrollTo, navKey }) {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Tenant", "Financial", "Maintenance", "Legal"];
  const highlighted = useScrollToAnchor(scrollTo, [navKey]);

  const filtered = activeTab === "All" ? SERVICES : SERVICES.filter((s) => {
    const map = { Tenant: "Tenant Management", Financial: "Rent Collection", Maintenance: "Maintenance Coordination", Legal: "Legal & Documentation" };
    return s.title === map[activeTab] || activeTab === "All";
  });

  return (
    <section style={{ background: "#FFFFFF" }} className="py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: "#2C9DD5" }}>
              Property Management
            </span>
            <h2 className="text-3xl font-extrabold leading-tight" style={{ color: "#15191C" }}>
              Complete Property<br />
              <span style={{ color: "#2C9DD5" }}>Care Solutions</span>
            </h2>
            <div className="w-10 h-0.5 rounded-full mt-3" style={{ background: "#2C9DD5" }} />
            <p className="text-sm mt-3 max-w-lg" style={{ color: "#495057" }}>
              Own property, not problems. Our end-to-end management service takes care of everything — from tenant sourcing to resale — so you can earn passively without the stress.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#BA0D0B", color: "#FFFFFF" }}
              onMouseEnter={e => e.currentTarget.style.background = "#5C0B03"}
              onMouseLeave={e => e.currentTarget.style.background = "#BA0D0B"}>
              Enquire Now
            </button>
            <button className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: "transparent", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2C9DD5"; e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2C9DD5"; }}>
              View Plans
            </button>
          </div>
        </div>

        {/* ── Ideal For ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {IDEAL_FOR.map((item) => (
            <div key={item.title}
              className="rounded-2xl p-6 flex gap-5 items-start transition-all duration-200"
              style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#2C9DD5"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E8EB"}>
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div>
                <h3 className="text-sm font-bold mb-1" style={{ color: "#15191C" }}>{item.title}</h3>
                <p className="text-xs leading-relaxed mb-2.5" style={{ color: "#495057" }}>{item.desc}</p>
                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#E87C0215", color: "#E87C02", border: "1px solid #E87C0230" }}>
                  {item.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Services Grid ── */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#15191C" }}>What We Handle</h2>
              <div className="w-10 h-0.5 rounded-full mt-1.5" style={{ background: "#2C9DD5" }} />
            </div>
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: activeTab === tab ? "#2C9DD5" : "transparent",
                    color: activeTab === tab ? "#FFFFFF" : "#495057",
                    border: `1px solid ${activeTab === tab ? "#2C9DD5" : "#E5E8EB"}`,
                  }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service) => {
              const anchorId = SERVICE_ANCHORS[service.title];
              const isHighlighted = anchorId && highlighted === anchorId;
              return (
              <div key={service.title}
                id={anchorId}
                className="rounded-2xl p-6 group transition-all duration-200 cursor-pointer"
                style={{
                  background: isHighlighted ? ANCHOR_HIGHLIGHT_STYLE.background : "#FFFFFF",
                  border: "1px solid #E5E8EB",
                  boxShadow: isHighlighted ? ANCHOR_HIGHLIGHT_STYLE.boxShadow : "none",
                  transition: ANCHOR_HIGHLIGHT_STYLE.transition,
                  scrollMarginTop: "100px",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#2C9DD5"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E8EB"}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "#EAF4FB", color: "#2C9DD5" }}>
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${service.tagColor}15`, color: service.tagColor, border: `1px solid ${service.tagColor}30` }}>
                    {service.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: "#15191C" }}>{service.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#495057" }}>{service.desc}</p>
              </div>
              );
            })}
          </div>
        </div>

        {/* ── Owner Dashboard Preview ── */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #2C9DD5" }}>
          <div className="px-6 py-4 flex items-center justify-between"
            style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E8EB" }}>
            <div>
              <h3 className="text-base font-bold" style={{ color: "#15191C" }}>Owner Dashboard</h3>
              <p className="text-xs mt-0.5" style={{ color: "#495057" }}>Track everything from one place — web & mobile</p>
            </div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full"
              style={{ background: "#2C9DD518", color: "#2C9DD5", border: "1px solid #2C9DD540" }}>
              Live Demo Available
            </span>
          </div>

          <div className="p-6" style={{ background: "#FFFFFF" }}>
            {/* Mock dashboard UI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Monthly Rent", value: "₹28,500", sub: "Received on time", color: "#4ade80" },
                { label: "Properties", value: "3", sub: "Under management", color: "#2C9DD5" },
                { label: "Active Tenants", value: "3", sub: "All verified", color: "#E87C02" },
                { label: "Open Requests", value: "1", sub: "In progress", color: "#a78bfa" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl p-4"
                  style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
                  <p className="text-xs mb-1" style={{ color: "#495057" }}>{stat.label}</p>
                  <p className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#495057" }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="rounded-xl p-4 mb-5" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
              <p className="text-xs font-bold mb-3" style={{ color: "#495057" }}>Recent Activity</p>
              <div className="space-y-3">
                {[
                  { dot: "#4ade80", text: "Rent received — Flat 2B, Harmu Colony", time: "2 hours ago" },
                  { dot: "#2C9DD5", text: "Inspection report uploaded — Villa, Kanke Road", time: "Yesterday" },
                  { dot: "#E87C02", text: "Maintenance request raised — Plumbing, Flat 1A", time: "2 days ago" },
                  { dot: "#a78bfa", text: "Lease renewed — Tenant: Ramesh Kumar", time: "3 days ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.dot }} />
                    <p className="text-xs flex-1" style={{ color: "#1F242A" }}>{item.text}</p>
                    <p className="text-[10px] shrink-0" style={{ color: "#495057" }}>{item.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard features */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {DASHBOARD_FEATURES.map((f) => (
                <div key={f.label} className="rounded-xl p-3 text-center"
                  style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
                  <span className="text-xl block mb-1">{f.icon}</span>
                  <p className="text-[9px] font-medium leading-tight" style={{ color: "#495057" }}>{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Pricing Plans ── */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "#15191C" }}>Simple, Transparent Pricing</h2>
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#2C9DD5" }} />
            <p className="text-sm mt-2" style={{ color: "#495057" }}>No hidden charges. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => <PlanCard key={plan.name} plan={plan} />)}
          </div>
          <p className="text-center text-xs mt-5" style={{ color: "#495057" }}>
            All plans include GST. Custom pricing available for{" "}
            <span style={{ color: "#2C9DD5" }}>5+ properties</span>.{" "}
            <button onClick={() => onNavigate && onNavigate("contact")} className="hover:underline" style={{ color: "#E87C02" }}>Contact us</button> for bulk rates.
          </p>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="relative rounded-3xl overflow-hidden px-8 py-12 text-center"
          style={{ background: "linear-gradient(135deg, #EAF4FB 0%, #FFFFFF 50%, #FFFFFF 100%)", border: "1px solid #2C9DD540" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 100%, #2C9DD515 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <h3 className="text-2xl font-extrabold mb-3" style={{ color: "#15191C" }}>
              Ready to Stress-Free Property Ownership?
            </h3>
            <p className="text-sm mb-6 max-w-xl mx-auto" style={{ color: "#495057" }}>
              Talk to our property management experts today. First consultation is free.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="px-7 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: "#BA0D0B", color: "#FFFFFF" }}
                onMouseEnter={e => e.currentTarget.style.background = "#5C0B03"}
                onMouseLeave={e => e.currentTarget.style.background = "#BA0D0B"}>
                Book Free Consultation
              </button>
              <button className="px-7 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: "transparent", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#2C9DD5"; e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2C9DD5"; }}>
                View All Plans
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
