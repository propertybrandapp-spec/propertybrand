// ── Data ──────────────────────────────────────────────────────────────────────

const SITEMAP = [
  {
    heading: "Explore",
    links: [
      { icon: "🏠", label: "Home", page: "home" },
      { icon: "🔍", label: "Search Properties", page: "search" },
      { icon: "📰", label: "Blog & Market Insights", page: "blog" },
    ],
  },
  {
    heading: "Services",
    links: [
      { icon: "📈", label: "Investment Advisory & Home Loans", page: "investment-advisory" },
      { icon: "🏢", label: "Property Management", page: "property-management" },
      { icon: "🤝", label: "Channel Partner Program", page: "channel-partner" },
      { icon: "🧑‍💼", label: "Preferred Agents", page: "agents" },
    ],
  },
  {
    heading: "Company",
    links: [
      { icon: "📖", label: "About Us", page: "about" },
      { icon: "💼", label: "Careers", page: "careers" },
      { icon: "✉️", label: "Contact Us", page: "contact" },
      { icon: "❓", label: "Help Center / FAQ", page: "faq" },
    ],
  },
  {
    heading: "My Account",
    links: [
      { icon: "👤", label: "My Profile", page: "profile" },
      { icon: "❤️", label: "Saved Properties", page: "saved" },
      { icon: "📋", label: "My Inquiries", page: "inquiries" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { icon: "🔒", label: "Privacy Policy", page: "privacy-policy" },
      { icon: "📄", label: "Terms & Conditions", page: "terms-conditions" },
      { icon: "⚠️", label: "Disclaimer", page: "disclaimer" },
    ],
  },
];

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Sitemap({ onNavigate }) {
  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* ── Hero ── */}
      <section className="px-4 py-14 lg:py-16 text-center" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #EAF4FB 100%)" }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#FFFFFF", color: "#2C9DD5", border: "1px solid #2C9DD5" }}
        >
          Sitemap
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#15191C" }}>Find Your Way Around</h1>
        <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: "#495057" }}>
          A complete overview of every page on PropertyBrands.
        </p>
      </section>

      {/* ── Sitemap Grid ── */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SITEMAP.map((group) => (
            <div key={group.heading} className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2C9DD5" }}>
                {group.heading}
              </h2>
              <div className="space-y-1">
                {group.links.map((l) => (
                  <button
                    key={l.label}
                    onClick={() => onNavigate && onNavigate(l.page)}
                    className="w-full flex items-center gap-2.5 text-left px-2 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={{ color: "#15191C" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#F2F4F6"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <span>{l.icon}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
