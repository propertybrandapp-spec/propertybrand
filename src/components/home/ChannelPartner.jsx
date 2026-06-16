import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Access Premium Inventory",
    desc: "Get first access to exclusive project launches, pre-launch deals, and off-market listings before anyone else.",
    highlight: "500+ Active Projects",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    title: "Marketing Support",
    desc: "Co-branded creatives, digital ad campaigns, property videos, and listing promotion handled by our in-house team.",
    highlight: "Full Marketing Stack",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Sales Training",
    desc: "Monthly workshops, negotiation masterclasses, legal & RERA compliance training, and product knowledge sessions.",
    highlight: "Monthly Workshops",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Lead Sharing",
    desc: "Qualified buyer and tenant leads shared directly from our platform to your dashboard based on your specialization.",
    highlight: "Verified Leads Daily",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Higher Earnings",
    desc: "Industry-leading commission slabs, timely payouts, performance bonuses, and annual rewards for top partners.",
    highlight: "Up to 3% Commission",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "PB Preferred Badge",
    desc: "Earn the trusted PB Preferred Agent badge displayed on your profile, increasing credibility and buyer trust.",
    highlight: "Verified Partner Status",
  },
];

const TIERS = [
  {
    name: "Associate",
    color: "#A5AEB5",
    borderColor: "#2a2a2a",
    deals: "0–5 deals/yr",
    commission: "1.5%",
    perks: ["Basic Lead Access", "Marketing Templates", "Online Training", "PB Listing Portal"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Silver",
    color: "#2C9DD5",
    borderColor: "#2C9DD5",
    deals: "6–15 deals/yr",
    commission: "2%",
    perks: ["Priority Lead Sharing", "Co-branded Campaigns", "Monthly Workshops", "Dedicated RM", "PB Preferred Badge"],
    cta: "Apply Now",
    popular: true,
  },
  {
    name: "Gold",
    color: "#E87C02",
    borderColor: "#E87C02",
    deals: "16+ deals/yr",
    commission: "2.5–3%",
    perks: ["Exclusive Inventory Access", "Personal Marketing Budget", "Priority Support", "Annual Retreat", "Performance Bonuses", "Gold Badge"],
    cta: "Apply Now",
    popular: false,
  },
];

const STATS = [
  { value: "1,200+", label: "Active Channel Partners" },
  { value: "₹480 Cr+", label: "Partner Earnings Paid" },
  { value: "28", label: "Cities Network" },
  { value: "4.8★", label: "Partner Satisfaction" },
];

const STEPS = [
  { num: "01", title: "Register Online", desc: "Fill the partner registration form with your details and specialization." },
  { num: "02", title: "Document Verification", desc: "Submit RERA registration & ID documents for quick verification." },
  { num: "03", title: "Onboarding Call", desc: "Attend a 30-min onboarding session with your dedicated RM." },
  { num: "04", title: "Start Earning", desc: "Access inventory, leads, and tools — and close your first deal." },
];

// ── Tier Card ─────────────────────────────────────────────────────────────────
function TierCard({ tier }) {
  return (
    <div
      className="relative rounded-2xl p-6 flex flex-col transition-transform duration-200 hover:-translate-y-1"
      style={{
        background: tier.popular ? "#161616" : "#0B0B0B",
        border: `1.5px solid ${tier.borderColor}`,
        boxShadow: tier.popular ? `0 0 32px ${tier.color}22` : "none",
      }}
    >
      {tier.popular && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-bold px-4 py-1 rounded-full"
          style={{ background: "#2C9DD5", color: "#F2F4F5" }}
        >
          Most Popular
        </div>
      )}

      {/* Tier name */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold" style={{ color: tier.color }}>
          {tier.name}
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${tier.color}18`, color: tier.color }}>
          {tier.deals}
        </span>
      </div>

      {/* Commission */}
      <div className="mb-5 pb-5" style={{ borderBottom: `1px solid #2a2a2a` }}>
        <span className="text-3xl font-black" style={{ color: "#F2F4F5" }}>{tier.commission}</span>
        <span className="text-sm ml-1" style={{ color: "#A5AEB5" }}>commission</span>
      </div>

      {/* Perks */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5 text-sm" style={{ color: "#EDEFF2" }}>
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: tier.color }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {perk}
          </li>
        ))}
      </ul>

      <button
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{
          background: tier.popular ? "#BA0D0B" : "transparent",
          color: tier.popular ? "#F2F4F5" : tier.color,
          border: tier.popular ? "none" : `1.5px solid ${tier.color}`,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#BA0D0B"; e.currentTarget.style.color = "#F2F4F5"; e.currentTarget.style.border = "none"; }}
        onMouseLeave={e => { e.currentTarget.style.background = tier.popular ? "#BA0D0B" : "transparent"; e.currentTarget.style.color = tier.popular ? "#F2F4F5" : tier.color; e.currentTarget.style.border = tier.popular ? "none" : `1.5px solid ${tier.color}`; }}
      >
        {tier.cta}
      </button>
    </div>
  );
}

// ── Registration Form ─────────────────────────────────────────────────────────
function PartnerForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", rera: "", experience: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (form.name && form.phone && form.email) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#0a1520" }}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ color: "#2C9DD5" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-bold text-lg mb-1" style={{ color: "#F2F4F5" }}>Application Submitted!</p>
        <p className="text-sm" style={{ color: "#A5AEB5" }}>Our partner team will contact you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="mt-5 text-xs underline" style={{ color: "#2C9DD5" }}>Submit another</button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "name", placeholder: "Full Name *", type: "text" },
          { key: "phone", placeholder: "Phone Number *", type: "tel" },
        ].map((f) => (
          <input key={f.key} type={f.type} placeholder={f.placeholder}
            value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
            style={{ background: "#0B0B0B", border: "1.5px solid #2a2a2a", color: "#F2F4F5" }}
            onFocus={e => e.target.style.borderColor = "#2C9DD5"}
            onBlur={e => e.target.style.borderColor = "#2a2a2a"}
          />
        ))}
      </div>
      <input type="email" placeholder="Email Address *"
        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
        style={{ background: "#0B0B0B", border: "1.5px solid #2a2a2a", color: "#F2F4F5" }}
        onFocus={e => e.target.style.borderColor = "#2C9DD5"}
        onBlur={e => e.target.style.borderColor = "#2a2a2a"}
      />
      <div className="grid grid-cols-2 gap-3">
        <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
          style={{ background: "#0B0B0B", border: "1.5px solid #2a2a2a", color: form.city ? "#F2F4F5" : "#A5AEB5" }}>
          <option value="">Select City</option>
          {["Ranchi", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Kolkata"].map(c => (
            <option key={c} value={c} style={{ background: "#161616", color: "#F2F4F5" }}>{c}</option>
          ))}
        </select>
        <select value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}
          className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
          style={{ background: "#0B0B0B", border: "1.5px solid #2a2a2a", color: form.experience ? "#F2F4F5" : "#A5AEB5" }}>
          <option value="">Experience</option>
          {["0–1 years", "1–3 years", "3–5 years", "5–10 years", "10+ years"].map(e => (
            <option key={e} value={e} style={{ background: "#161616", color: "#F2F4F5" }}>{e}</option>
          ))}
        </select>
      </div>
      <input type="text" placeholder="RERA Registration No. (if any)"
        value={form.rera} onChange={(e) => setForm({ ...form, rera: e.target.value })}
        className="w-full text-sm rounded-xl px-4 py-3 focus:outline-none transition"
        style={{ background: "#0B0B0B", border: "1.5px solid #2a2a2a", color: "#F2F4F5" }}
        onFocus={e => e.target.style.borderColor = "#2C9DD5"}
        onBlur={e => e.target.style.borderColor = "#2a2a2a"}
      />
      <button onClick={handleSubmit}
        className="w-full py-3 rounded-xl text-sm font-bold transition-all"
        style={{ background: "#BA0D0B", color: "#F2F4F5" }}
        onMouseEnter={e => e.currentTarget.style.background = "#5C0B03"}
        onMouseLeave={e => e.currentTarget.style.background = "#BA0D0B"}
      >
        Submit Partner Application
      </button>
      <p className="text-center text-xs" style={{ color: "#A5AEB5" }}>
        By submitting you agree to our{" "}
        <a href="#" style={{ color: "#2C9DD5" }} className="hover:underline">Partner Terms & Conditions</a>
      </p>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function ChannelPartner() {
  return (
    <section style={{ background: "#0B0B0B" }} className="py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl overflow-hidden px-8 py-14 text-center"
          style={{ background: "linear-gradient(135deg, #161616 0%, #0B0B0B 50%, #0a1520 100%)", border: "1px solid #2C9DD5" }}>
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, #2C9DD522 0%, transparent 70%)" }} />
          <div className="relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ background: "#2C9DD518", color: "#2C9DD5", border: "1px solid #2C9DD540" }}>
              Partner Program
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight" style={{ color: "#F2F4F5" }}>
              Join the{" "}
              <span style={{ color: "#2C9DD5" }}>PropertyBrands</span>{" "}
              Partner Network
            </h2>
            <p className="text-base max-w-2xl mx-auto mb-8" style={{ color: "#A5AEB5" }}>
              Connect with India's fastest-growing PropTech platform. Access premium inventory, qualified leads, marketing support, and industry-leading commissions.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl px-4 py-4"
                  style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
                  <p className="text-2xl font-extrabold" style={{ color: "#2C9DD5" }}>{s.value}</p>
                  <p className="text-xs mt-0.5 font-medium" style={{ color: "#A5AEB5" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button className="px-7 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: "#BA0D0B", color: "#F2F4F5" }}
                onMouseEnter={e => e.currentTarget.style.background = "#5C0B03"}
                onMouseLeave={e => e.currentTarget.style.background = "#BA0D0B"}>
                Become a Partner
              </button>
              <button className="px-7 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: "transparent", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#2C9DD5"; e.currentTarget.style.color = "#F2F4F5"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2C9DD5"; }}>
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* ── Benefits Grid ── */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "#F2F4F5" }}>Why Partner With Us?</h2>
            <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
            <p className="text-sm mt-2" style={{ color: "#A5AEB5" }}>Everything you need to grow your real estate business</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title}
                className="rounded-2xl p-6 group cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "#161616", border: "1px solid #2a2a2a" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#2C9DD5"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ background: "#0a1520", color: "#2C9DD5" }}>
                  {b.icon}
                </div>
                <h3 className="text-sm font-bold mb-1.5" style={{ color: "#F2F4F5" }}>{b.title}</h3>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#A5AEB5" }}>{b.desc}</p>
                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#E87C0215", color: "#E87C02", border: "1px solid #E87C0230" }}>
                  {b.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tier Cards ── */}
        <div>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold" style={{ color: "#F2F4F5" }}>Partner Tiers</h2>
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#2C9DD5" }} />
            <p className="text-sm mt-2" style={{ color: "#A5AEB5" }}>Progress through tiers as you close more deals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => <TierCard key={tier.name} tier={tier} />)}
          </div>
        </div>

        {/* ── How It Works ── */}
        <div className="rounded-2xl p-8" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
          <div className="mb-8">
            <h2 className="text-xl font-bold" style={{ color: "#F2F4F5" }}>How to Get Started</h2>
            <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-black" style={{ color: "#2C9DD5" }}>{step.num}</span>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px hidden lg:block" style={{ background: "#2a2a2a" }} />
                  )}
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: "#F2F4F5" }}>{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#A5AEB5" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Registration Form + CTA ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left – form */}
          <div className="rounded-2xl p-8" style={{ background: "#161616", border: "1px solid #2C9DD5" }}>
            <span className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: "#2C9DD5" }}>
              Join Now
            </span>
            <h3 className="text-xl font-bold mb-1" style={{ color: "#F2F4F5" }}>Partner Registration</h3>
            <p className="text-sm mb-6" style={{ color: "#A5AEB5" }}>
              Fill in your details and our team will onboard you within 24 hours.
            </p>
            <PartnerForm />
          </div>

          {/* Right – testimonial + perks highlight */}
          <div className="flex flex-col gap-5">
            {/* Quote */}
            <div className="rounded-2xl p-6 flex-1" style={{ background: "#161616", border: "1px solid #2a2a2a" }}>
              <svg className="w-8 h-8 mb-3" fill="currentColor" viewBox="0 0 32 32" style={{ color: "#2C9DD520" }}>
                <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.8C7.8 11.9 9.5 10.2 11.6 10.2L10 8zm14 0c-3.314 0-6 2.686-6 6v10h10V14h-6.2c0-2.1 1.7-3.8 3.8-3.8L24 8z" />
              </svg>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#EDEFF2" }}>
                "Partnering with PropertyBrands was the single best decision for my real estate career. Within 6 months I had access to 200+ projects, qualified leads every week, and my earnings doubled. The PB Preferred badge alone increased my client trust overnight."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: "linear-gradient(135deg, #2C9DD5, #1a5f85)", color: "#F2F4F5" }}>
                  RK
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#F2F4F5" }}>Rajesh Kumar</p>
                  <p className="text-xs" style={{ color: "#A5AEB5" }}>Gold Partner · Kumar Properties, Ranchi</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#E87C02" }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick perks */}
            <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #0a1520, #161616)", border: "1px solid #2C9DD540" }}>
              <p className="text-sm font-bold mb-4" style={{ color: "#2C9DD5" }}>What you get from Day 1</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "📦", text: "Inventory Access" },
                  { icon: "📊", text: "Partner Dashboard" },
                  { icon: "📱", text: "PB Mobile App" },
                  { icon: "🎓", text: "Training Resources" },
                  { icon: "💬", text: "Dedicated RM" },
                  { icon: "💰", text: "Timely Payouts" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs font-medium" style={{ color: "#EDEFF2" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
