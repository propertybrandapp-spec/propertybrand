// ── Data ──────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using the PropertyBrands platform, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please discontinue use of the platform.",
    ],
  },
  {
    title: "2. Use of the Platform",
    body: [
      "PropertyBrands provides a platform to discover, list, and inquire about residential and commercial properties, and to access investment advisory and home loan facilitation services.",
      "You agree to use the platform only for lawful purposes and not to post false, misleading, or duplicate listings, or to misuse contact details obtained through the platform for unsolicited communication.",
    ],
  },
  {
    title: "3. Listings & Accuracy",
    body: [
      "While we verify listings to the best of our ability, property details are ultimately provided by owners, developers, or channel partners, and we cannot guarantee absolute accuracy of every listing at all times.",
      "We recommend independently verifying property documents, RERA registration, and title details before making any payment or entering into an agreement.",
    ],
  },
  {
    title: "4. User Accounts",
    body: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
      "We reserve the right to suspend or terminate accounts that violate these terms, post fraudulent listings, or engage in abusive behavior toward other users, agents, or our staff.",
    ],
  },
  {
    title: "5. Channel Partner Program Terms",
    body: [
      "Channel Partners registering through our program agree to represent listings and leads honestly, disclose any conflicts of interest, and comply with applicable RERA agent-registration requirements in their state of operation.",
      "Brokerage payouts to Channel Partners are governed by the commission structure communicated at the time of onboarding and are payable only upon successful, verified closure of a transaction.",
      "PropertyBrands reserves the right to remove any Channel Partner from the program for misrepresentation, lead poaching outside assigned territories, or violation of these Terms.",
    ],
  },
  {
    title: "6. Fees & Brokerage",
    body: [
      "Brokerage and service fees, where applicable, will be communicated transparently before you commit to a transaction. Property Management service fees follow the tiered pricing published on our Property Management page.",
    ],
  },
  {
    title: "7. Intellectual Property",
    body: [
      "All content on the platform, including text, graphics, logos, and software, is the property of PropertyBrands Realty Services or its licensors and may not be reproduced without permission.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    body: [
      "PropertyBrands acts as a facilitator connecting buyers, sellers, tenants, agents, and lenders. We are not a party to transactions concluded between users and are not liable for disputes, financial loss, or damages arising from third-party listings, agents, or lending decisions.",
    ],
  },
  {
    title: "9. Governing Law",
    body: [
      "These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Ranchi, Jharkhand.",
    ],
  },
  {
    title: "10. Changes to These Terms",
    body: [
      "We may revise these Terms from time to time. Continued use of the platform after changes are posted constitutes your acceptance of the revised Terms.",
    ],
  },
];

// ── Main Export ───────────────────────────────────────────────────────────────
export default function TermsConditions({ onNavigate }) {
  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* ── Hero ── */}
      <section className="px-4 py-14 lg:py-16 text-center" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #EAF4FB 100%)" }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#FFFFFF", color: "#2C9DD5", border: "1px solid #2C9DD5" }}
        >
          Legal
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#15191C" }}>Terms & Conditions</h1>
        <p className="text-sm mt-3" style={{ color: "#495057" }}>Last updated: June 1, 2026 · Includes Channel Partner Program Terms</p>
      </section>

      {/* ── Intro ── */}
      <section className="px-4 pt-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-base leading-relaxed" style={{ color: "#495057" }}>
            These Terms & Conditions govern your use of the PropertyBrands platform, including our website,
            mobile app, property listings, investment advisory tools, and Channel Partner Program. Please read
            them carefully before using our services.
          </p>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title} id={s.title.toLowerCase().includes("channel partner") ? "channel-partner-terms" : undefined}>
              <h2 className="text-xl font-extrabold mb-3" style={{ color: "#15191C" }}>{s.title}</h2>
              <div className="space-y-3">
                {s.body.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed" style={{ color: "#495057" }}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto rounded-2xl p-8 text-center" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
          <p className="text-lg font-bold" style={{ color: "#15191C" }}>Have a question about these terms?</p>
          <p className="text-sm mt-1 mb-5" style={{ color: "#495057" }}>
            We're happy to clarify anything before you sign up or list a property.
          </p>
          <button
            onClick={() => onNavigate && onNavigate("contact")}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#5C0B03"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#BA0D0B"}
          >
            Contact Us
          </button>
        </div>
      </section>

    </div>
  );
}
