// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "15,000+", label: "Happy Clients" },
  { value: "12,400+", label: "Properties Listed" },
  { value: "28", label: "Cities Covered" },
  { value: "18", label: "Years of Trust" },
];

const VALUES = [
  {
    icon: "🎯",
    title: "Transparency First",
    desc: "Every listing is verified, every price is real, and every commitment is documented. No hidden charges, no surprises.",
  },
  {
    icon: "🤝",
    title: "Client-Centric Approach",
    desc: "We don't sell properties — we solve housing and investment problems. Your goals shape every recommendation we make.",
  },
  {
    icon: "💡",
    title: "Technology-Driven",
    desc: "AI-powered property discovery, data-backed investment advisory, and digital-first transaction support at every step.",
  },
  {
    icon: "🛡️",
    title: "RERA Compliant",
    desc: "Every project we list and every transaction we facilitate fully complies with RERA regulations across all states we operate in.",
  },
];

const TIMELINE = [
  { year: "2008", title: "Founded in Ranchi", desc: "Started as a small brokerage helping families find their first homes." },
  { year: "2014", title: "Expanded to Commercial", desc: "Added office spaces, retail, and industrial properties to our portfolio." },
  { year: "2018", title: "Launched Investment Advisory", desc: "Began offering data-driven investment guidance for high-growth corridors." },
  { year: "2021", title: "Digital Transformation", desc: "Built our PropTech platform with AI-powered search and virtual tours." },
  { year: "2024", title: "PAN-India Network", desc: "Grew our channel partner program to 1,200+ verified agents across 28 cities." },
  { year: "2026", title: "Today", desc: "A full-stack real estate platform serving buyers, investors, NRIs, and developers nationwide." },
];

const LEADERSHIP = [
  { name: "Arjun Verma", role: "Founder & CEO", avatar: "AV", bg: "linear-gradient(135deg, #2C9DD5, #1a5f85)" },
  { name: "Meera Kapoor", role: "Chief Operating Officer", avatar: "MK", bg: "linear-gradient(135deg, #E87C02, #b85f00)" },
  { name: "Rohan Bose", role: "Head of Investment Advisory", avatar: "RB", bg: "linear-gradient(135deg, #16a34a, #0f7a32)" },
  { name: "Ananya Iyer", role: "Head of Technology", avatar: "AI", bg: "linear-gradient(135deg, #a78bfa, #7c5cd6)" },
];

// ── Main Export ───────────────────────────────────────────────────────────────
export default function AboutUs({ onNavigate }) {
  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* ── Hero ── */}
      <section className="px-4 py-16 lg:py-20" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #EAF4FB 100%)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ background: "#FFFFFF", color: "#2C9DD5", border: "1px solid #2C9DD5" }}
          >
            About PropertyBrands
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5" style={{ color: "#15191C" }}>
            Building Trust, One Property<br />at a Time
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#495057" }}>
            PropertyBrands Realty Services is a next-generation PropTech company connecting homebuyers, investors, developers, and service providers through a seamless digital ecosystem.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-4 py-12 -mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl p-6 lg:p-8" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB", boxShadow: "0 20px 40px rgba(21,25,28,0.08)" }}>
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#2C9DD5" }}>{s.value}</p>
                <p className="text-sm mt-1" style={{ color: "#495057" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="px-4 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl lg:text-3xl font-extrabold mb-4" style={{ color: "#15191C" }}>Who We Are</h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: "#495057" }}>
              We combine technology, market intelligence, and an extensive network of developers and channel partners to help customers make informed real estate decisions.
            </p>
            <p className="text-base leading-relaxed mb-6" style={{ color: "#495057" }}>
              From residential apartments to commercial spaces, plotted developments to investment advisory — we offer end-to-end real estate solutions under one roof, backed by a dedicated relationship manager for every client.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate && onNavigate("home")}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: "#BA0D0B", color: "#FFFFFF" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#5C0B03"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#BA0D0B"}
              >
                Explore Properties
              </button>
              <button
                onClick={() => onNavigate && onNavigate("contact")}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: "#FFFFFF", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
              >
                Talk to Us
              </button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-72 lg:h-96" style={{ border: "1px solid #E5E8EB" }}>
            <img
              src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&h=500&fit=crop"
              alt="Our office"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="px-4 py-12 lg:py-16" style={{ background: "#F7F8FA" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>What Drives Us</h2>
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#2C9DD5" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
                style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
              >
                <span className="text-3xl block mb-3">{v.icon}</span>
                <h3 className="text-sm font-bold mb-2" style={{ color: "#15191C" }}>{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#495057" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="px-4 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>Our Journey</h2>
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#2C9DD5" }} />
          </div>
          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className="flex gap-5">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: i === TIMELINE.length - 1 ? "#BA0D0B" : "#2C9DD5" }}
                  />
                  {i < TIMELINE.length - 1 && (
                    <div className="w-px flex-1" style={{ background: "#E5E8EB", minHeight: "40px" }} />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-sm font-extrabold" style={{ color: "#2C9DD5" }}>{item.year}</span>
                  <h3 className="text-base font-bold mt-1" style={{ color: "#15191C" }}>{item.title}</h3>
                  <p className="text-sm mt-1" style={{ color: "#495057" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="px-4 py-12 lg:py-16" style={{ background: "#F7F8FA" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "#15191C" }}>Leadership Team</h2>
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#2C9DD5" }} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {LEADERSHIP.map((p) => (
              <div key={p.name} className="rounded-2xl p-6 text-center" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-lg"
                  style={{ background: p.bg, color: "#FFFFFF" }}
                >
                  {p.avatar}
                </div>
                <p className="text-sm font-bold" style={{ color: "#15191C" }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#495057" }}>{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-14">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-10 lg:p-14 text-center"
          style={{ background: "linear-gradient(135deg, #BA0D0B 0%, #5C0B03 100%)" }}
        >
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3">Ready to Get Started?</h2>
          <p className="text-sm lg:text-base text-white/85 mb-7 max-w-lg mx-auto">
            Whether you're buying, selling, renting, or investing — our team is ready to help.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate("home")}
              className="px-7 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#FFFFFF", color: "#BA0D0B" }}
            >
              Explore Properties
            </button>
            <button
              onClick={() => onNavigate && onNavigate("contact")}
              className="px-7 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF", border: "1.5px solid rgba(255,255,255,0.4)" }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
