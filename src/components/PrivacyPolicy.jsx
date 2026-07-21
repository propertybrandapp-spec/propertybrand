// ── Data ──────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: [
      "We collect information you provide directly to us, such as your name, phone number, email address, and property preferences when you register an account, search for properties, schedule a site visit, or submit an inquiry.",
      "We also automatically collect certain information when you use our platform, including your IP address, device type, browser, pages viewed, and search filters, to help us improve our services and personalize your experience.",
      "If you apply for a home loan or investment advisory through our platform, we may collect financial information such as income details and bank statements, which is shared only with the lending partner you choose.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "We use your information to show you relevant property listings, connect you with agents and channel partners, process loan and inquiry applications, and send updates about properties, offers, or your account activity.",
      "We may use aggregated, de-identified data for market research, analytics, and to improve our matching algorithms and investment advisory recommendations.",
      "With your consent, we may send promotional communications about new projects, price drops on saved properties, or investment opportunities. You can opt out of these at any time.",
    ],
  },
  {
    title: "3. Information Sharing",
    body: [
      "We share your contact details with property owners, developers, or channel partners only when you express interest in a specific listing, so they can respond to your inquiry.",
      "We share loan application data with our partner banks and NBFCs solely for the purpose of loan processing, and only after you initiate an application.",
      "We do not sell your personal information to third parties for their independent marketing purposes.",
    ],
  },
  {
    title: "4. Cookies & Tracking",
    body: [
      "We use cookies and similar technologies to keep you signed in, remember your search filters, and understand how you interact with our platform so we can improve it.",
      "You can control or disable cookies through your browser settings, though some features of the platform may not function properly without them.",
    ],
  },
  {
    title: "5. Data Security",
    body: [
      "We use industry-standard encryption and access controls to protect your personal and financial information, both in transit and at rest.",
      "While we take reasonable measures to safeguard your data, no method of transmission over the internet is completely secure, and we encourage you to use strong, unique passwords for your account.",
    ],
  },
  {
    title: "6. Data Retention",
    body: [
      "We retain your personal information for as long as your account is active or as needed to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.",
      "You may request deletion of your account and associated data at any time, subject to any records we are legally required to retain.",
    ],
  },
  {
    title: "7. Your Rights",
    body: [
      "You have the right to access, correct, or update the personal information we hold about you through your account profile at any time.",
      "You may request a copy of your data, ask us to delete your account, or withdraw consent for marketing communications by contacting our support team.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of material changes via email or a notice on our platform.",
    ],
  },
];

// ── Main Export ───────────────────────────────────────────────────────────────
export default function PrivacyPolicy({ onNavigate }) {
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
        <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#15191C" }}>Privacy Policy</h1>
        <p className="text-sm mt-3" style={{ color: "#495057" }}>Last updated: June 1, 2026</p>
      </section>

      {/* ── Intro ── */}
      <section className="px-4 pt-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-base leading-relaxed" style={{ color: "#495057" }}>
            PropertyBrands Realty Services ("we", "us", "our") is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, share, and safeguard your information when you use
            our website, mobile app, and related services (collectively, the "Platform"). By using the
            Platform, you agree to the practices described in this policy.
          </p>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
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
          <p className="text-lg font-bold" style={{ color: "#15191C" }}>Questions about your data?</p>
          <p className="text-sm mt-1 mb-5" style={{ color: "#495057" }}>
            Reach out to our support team and we'll be happy to help.
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
