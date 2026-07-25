// ── Data ──────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: "General Disclaimer",
    body: "The information provided on the PropertyBrands platform is for general informational purposes only. While we strive to keep property listings, prices, and project details accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, or availability of any listing at any given time.",
  },
  {
    title: "Not Investment or Financial Advice",
    body: "Content published under our Investment Advisory section, including corridor appreciation trends, rental yield estimates, and EMI calculations, is for general guidance only and does not constitute financial, investment, tax, or legal advice. Property values and market conditions can change, and past performance of any investment corridor is not indicative of future returns. Please consult a qualified financial advisor before making investment decisions.",
  },
  {
    title: "Third-Party Listings & Agents",
    body: "Property listings on our platform are submitted by individual owners, developers, and channel partner agents. PropertyBrands does not own, manage, or guarantee any property listed on the platform unless explicitly stated. We recommend independently verifying ownership documents, RERA registration, and legal clearances before proceeding with any transaction.",
  },
  {
    title: "Pricing & Availability",
    body: "Prices, EMI estimates, bank loan offers, and availability shown on the platform are indicative and subject to change without notice by the respective owner, developer, or lending institution. Final terms are determined at the time of transaction directly between you and the relevant party.",
  },
  {
    title: "RERA Compliance",
    body: "We display RERA registration information where provided by the listing party. Buyers should independently verify a project's RERA status on the official state RERA portal before booking, as registration details can be updated or revoked by the authority.",
  },
  {
    title: "External Links",
    body: "Our platform may contain links to third-party websites, including partner banks and service providers. We are not responsible for the content, accuracy, or privacy practices of these external sites.",
  },
  {
    title: "Limitation of Liability",
    body: "PropertyBrands Realty Services shall not be held liable for any direct, indirect, incidental, or consequential loss arising from reliance on information provided on this platform, including but not limited to property valuations, investment projections, or third-party conduct.",
  },
];

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Disclaimer({ onNavigate }) {
  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* ── Hero ── */}
      <section className="px-4 py-14 lg:py-16 text-center" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #FEF3C7 100%)" }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#FFFFFF", color: "#F59E0B", border: "1px solid #F59E0B" }}
        >
          Legal
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#1F2937" }}>Disclaimer</h1>
        <p className="text-sm mt-3" style={{ color: "#6B7280" }}>Last updated: June 1, 2026</p>
      </section>

      {/* ── Sections ── */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-2xl p-6" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <h2 className="text-lg font-extrabold mb-2" style={{ color: "#1F2937" }}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto rounded-2xl p-8 text-center" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <p className="text-lg font-bold" style={{ color: "#1F2937" }}>Need clarification on something?</p>
          <p className="text-sm mt-1 mb-5" style={{ color: "#6B7280" }}>Our team is happy to explain anything in detail.</p>
          <button
            onClick={() => onNavigate && onNavigate("contact")}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#1E88E5", color: "#FFFFFF" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#1565C0"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#1E88E5"}
          >
            Contact Us
          </button>
        </div>
      </section>

    </div>
  );
}
