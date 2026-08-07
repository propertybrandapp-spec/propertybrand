import { useState, useEffect } from "react";
import { useScrollToAnchor, ANCHOR_HIGHLIGHT_STYLE } from "../lib/useScrollToAnchor";
import { ClipboardList, Home, Landmark, DollarSign, Search, PenLine } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = ["All", "Buying", "Renting", "Loans & Finance", "Legal & RERA"];

const GUIDES = [
  {
    category: "Buying",
    icon: ClipboardList,
    slug: "how-to-buy",
    q: "How to Buy a Property",
    a: "Start by finalizing your budget and getting a home loan pre-approval so you know your exact spending power. Shortlist localities and projects, verify RERA registration and title documents, negotiate the price, and pay a token amount to block the unit. Complete due diligence (encumbrance certificate, approved building plan), sign the sale agreement, arrange your loan disbursement, and finally register the sale deed at the sub-registrar's office. Our relationship managers can walk you through every step and coordinate with the seller on your behalf.",
  },
  {
    category: "Renting",
    icon: Home,
    slug: "how-to-rent",
    q: "How to Rent a Property",
    a: "Filter listings by budget, locality, and move-in date, then shortlist 3–4 homes to visit in person. Once you've chosen one, verify the owner's ID and property ownership documents, agree on rent, security deposit, and lock-in period, and get everything in writing. Draft a rental agreement (11-month agreements are common and don't require registration in most states), complete a joint inspection with a fixtures checklist, and hand over the deposit only after signing. We can also connect you with a verified agent to handle paperwork.",
  },
  {
    category: "Loans & Finance",
    icon: Landmark,
    slug: "how-to-apply-loan",
    q: "How to Apply for a Home Loan",
    a: "Check your eligibility using our EMI calculator, which factors in your income, existing obligations, and tenure. Compare interest rates and processing fees across our 40+ partner banks, then submit your application with income proof, KYC documents, bank statements, and the property's title papers. The lender will conduct a technical and legal valuation of the property before sanctioning the loan. Once approved, the loan amount is disbursed directly to the seller or builder as per the agreed payment schedule.",
  },
  {
    category: "Loans & Finance",
    icon: DollarSign,
    slug: "how-to-calculate-emi",
    q: "How to Calculate EMI",
    a: "Your Equated Monthly Installment depends on three inputs: loan amount (principal), interest rate, and tenure. The standard formula is EMI = [P × R × (1+R)^N] / [(1+R)^N − 1], where P is principal, R is the monthly interest rate, and N is the number of monthly installments. Longer tenures lower your EMI but increase total interest paid, while a larger down payment reduces both. Use the EMI Calculator on our Investment Advisory page to instantly see your monthly outgo across different loan amounts and tenures.",
  },
  {
    category: "Legal & RERA",
    icon: Search,
    slug: "what-is-rera",
    q: "What is RERA?",
    a: "The Real Estate (Regulation and Development) Act, 2013 (RERA) is a central law that regulates the real estate sector to protect homebuyers and boost transparency. It mandates that developers register projects with the state RERA authority, publish accurate project details and timelines, deposit 70% of buyer funds in an escrow account reserved for construction, and compensate buyers for delayed possession. Always check a project's RERA registration number on the state RERA portal before booking — every project we list is RERA compliant.",
  },
  {
    category: "Legal & RERA",
    icon: PenLine,
    slug: "property-registration",
    q: "Property Registration Process",
    a: "Once the sale agreement is finalized, the property must be registered at the local sub-registrar's office to legally transfer ownership. This involves paying stamp duty and registration charges (which vary by state, typically 5–7% of the property value), submitting the sale deed along with identity and property documents, and having both parties (or their representatives) present for biometric verification and signing. The registered sale deed is your legal proof of ownership — our documentation team can prepare and file this on your behalf.",
  },
];

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Faq({ onNavigate, scrollTo, navKey }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openSlug, setOpenSlug] = useState(GUIDES[0].slug);
  const highlighted = useScrollToAnchor(scrollTo, [navKey]);

  // When arriving via a specific Help > FAQ navbar link, jump straight to
  // that question — open it and make sure its category filter isn't hiding it.
  useEffect(() => {
    if (!scrollTo) return;
    const target = GUIDES.find((g) => g.slug === scrollTo);
    if (!target) return;
    setActiveCategory("All");
    setOpenSlug(target.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTo, navKey]);

  const filtered =
    activeCategory === "All" ? GUIDES : GUIDES.filter((g) => g.category === activeCategory);

  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* ── Hero ── */}
      <section className="px-4 py-16 lg:py-20 text-center" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%)" }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#FFFFFF", color: "#1565C0", border: "1px solid #1565C0" }}
        >
          Help Center
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#1F2937" }}>
          Everything You Need to Know
        </h1>
        <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: "#6B7280" }}>
          Guides on buying, renting, home loans, EMIs, and RERA — written by our real estate experts to help you move forward with confidence.
        </p>
      </section>

      {/* ── Category Filter ── */}
      <section className="px-4 pt-10">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenSlug(null); }}
              className="px-4 py-1.5 rounded-full text-sm font-semibold border transition-all"
              style={{
                background: activeCategory === cat ? "#1565C0" : "#FFFFFF",
                color: activeCategory === cat ? "#FFFFFF" : "#6B7280",
                borderColor: activeCategory === cat ? "#1565C0" : "#E2E8F0",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── Guides Accordion ── */}
      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.map((item) => {
            const isOpen = openSlug === item.slug;
            const isHighlighted = highlighted === item.slug;
            return (
            <div key={item.q} id={item.slug} className="rounded-2xl overflow-hidden"
              style={{
                border: isHighlighted ? "none" : "1px solid #E2E8F0",
                boxShadow: isHighlighted ? ANCHOR_HIGHLIGHT_STYLE.boxShadow : "none",
                transition: ANCHOR_HIGHLIGHT_STYLE.transition,
                scrollMarginTop: "100px",
              }}>
              <button
                onClick={() => setOpenSlug(isOpen ? null : item.slug)}
                className="w-full flex items-center gap-3 justify-between px-5 py-4 text-left"
                style={{ background: isHighlighted ? ANCHOR_HIGHLIGHT_STYLE.background : "#FFFFFF" }}
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 shrink-0" style={{ color: "#1565C0" }} strokeWidth={2} />
                  <span className="text-sm md:text-base font-bold" style={{ color: "#1F2937" }}>{item.q}</span>
                </span>
                <svg
                  className="w-4 h-4 shrink-0 transition-transform"
                  style={{ color: "#1565C0", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  fill="currentColor" viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "#6B7280", background: isHighlighted ? ANCHOR_HIGHLIGHT_STYLE.background : "#FFFFFF" }}>
                  {item.a}
                </div>
              )}
            </div>
            );
          })}
        </div>
      </section>

      {/* ── Still need help CTA ── */}
      <section className="px-4 pb-16">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-8 text-center"
          style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
        >
          <p className="text-lg font-bold" style={{ color: "#1F2937" }}>Still have questions?</p>
          <p className="text-sm mt-1 mb-5" style={{ color: "#6B7280" }}>
            Our team is happy to walk you through any part of the process.
          </p>
          <button
            onClick={() => onNavigate && onNavigate("contact")}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#1565C0", color: "#FFFFFF" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#0D47A1"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#1565C0"}
          >
            Talk to Our Team
          </button>
        </div>
      </section>

    </div>
  );
}
