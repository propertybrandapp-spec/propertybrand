import { useState } from "react";
import MagicLoansSection from "./MagicLoansSection";

// ── Data ──────────────────────────────────────────────────────────────────────

const PARTNER_BANKS = [
  { name: "SBI", abbr: "SBI", rate: "8.50%", color: "bg-[#1a5f85]", textColor: "text-white" },
  { name: "HDFC Bank", abbr: "HDFC", rate: "8.70%", color: "bg-red-600", textColor: "text-white" },
  { name: "ICICI Bank", abbr: "ICICI", rate: "8.75%", color: "bg-[#E87C02]", textColor: "text-white" },
  { name: "Axis Bank", abbr: "AXIS", rate: "8.90%", color: "bg-rose-800", textColor: "text-white" },
  { name: "LIC Housing", abbr: "LIC", rate: "8.65%", color: "bg-green-700", textColor: "text-white" },
  { name: "Kotak Bank", abbr: "KMB", rate: "8.85%", color: "bg-[#E87C02]", textColor: "text-white" },
];

const LOAN_SERVICES = [
  { icon: "✅", label: "Eligibility Check", desc: "Know your loan amount instantly" },
  { icon: "📄", label: "Documentation", desc: "We handle all your paperwork" },
  { icon: "⚖️", label: "Loan Comparison", desc: "Compare 40+ banks & NBFCs" },
  { icon: "⚡", label: "Fast Approval", desc: "Get approval within 48 hours" },
];

const INVESTMENT_CORRIDORS = [
  {
    id: 1,
    city: "Ranchi",
    area: "Kanke Road",
    tag: "High Growth",
    tagColor: "bg-green-100 text-[#4ade80]",
    appreciation: "+18%",
    rentalYield: "4.2%",
    priceRange: "₹45 – 80 Lac",
    type: "Residential",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=240&fit=crop",
  },
  {
    id: 2,
    city: "Ranchi",
    area: "Harmu Colony",
    tag: "Rental Hotspot",
    tagColor: "bg-blue-100 text-[#BA0D0B]",
    appreciation: "+12%",
    rentalYield: "5.8%",
    priceRange: "₹30 – 60 Lac",
    type: "Apartments",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop",
  },
  {
    id: 3,
    city: "Ranchi",
    area: "Main Road",
    tag: "Commercial",
    tagColor: "bg-purple-100 text-purple-700",
    appreciation: "+22%",
    rentalYield: "6.5%",
    priceRange: "₹1.2 – 3 Cr",
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=240&fit=crop",
  },
  {
    id: 4,
    city: "Ranchi",
    area: "Argora",
    tag: "Land Banking",
    tagColor: "bg-amber-100 text-amber-700",
    appreciation: "+30%",
    rentalYield: "—",
    priceRange: "₹20 – 50 Lac",
    type: "Plots",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=240&fit=crop",
  },
];

const INVESTMENT_TOOLS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "EMI Calculator",
    desc: "Plan your monthly payments",
    color: "text-[#BA0D0B] bg-[#EAF4FB]",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    label: "ROI Calculator",
    desc: "Estimate your returns",
    color: "text-[#4ade80] bg-[#EAF8EC]",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    label: "Rental Yield",
    desc: "Check yield potential",
    color: "text-[#a78bfa] bg-[#F0EAFB]",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    label: "Compare Investments",
    desc: "Side-by-side analysis",
    color: "text-[#E87C02] bg-[#FDF1E5]",
  },
];

// ── EMI Calculator Widget ─────────────────────────────────────────────────────
function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const monthlyRate = interestRate / 100 / 12;
  const months = tenure * 12;
  const emi =
    loanAmount > 0 && interestRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : 0;
  const totalPayment = emi * months;
  const totalInterest = totalPayment - loanAmount;
  const principalPct = Math.round((loanAmount / totalPayment) * 100);
  const interestPct = 100 - principalPct;

  function fmt(n) {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lac`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
  }

  return (
<div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">      
    {/* Header */}
<div className="bg-[radial-gradient(circle_at_top_right,_rgba(186,13,11,0.12),_transparent_35%),linear-gradient(to_right,#ffffff,#f8fafc)] border-b border-slate-200 px-6 py-6">
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
      <svg
        className="w-5 h-5 text-[#BA0D0B]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </div>

    <div>
      <h3 className="text-[#15191C] font-bold text-lg">
        Home Loan EMI Calculator
      </h3>

      <p className="text-slate-500 text-xs">
        Simplified Home Financing with PropertyBrands
      </p>
    </div>
  </div>
</div>

      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-5">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500">Loan Amount</label>
              <span className="text-xs font-bold text-[#BA0D0B]">{fmt(loanAmount)}</span>
            </div>
            <input
              type="range" min={500000} max={50000000} step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#BA0D0B] bg-gray-200"
            />
            <div className="flex justify-between mt-0.5 text-[10px] text-slate-500">
              <span>₹5 Lac</span><span>₹5 Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500">Interest Rate (p.a.)</label>
              <span className="text-xs font-bold text-[#BA0D0B]">{interestRate}%</span>
            </div>
            <input
              type="range" min={6} max={16} step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#BA0D0B] bg-gray-200"
            />
            <div className="flex justify-between mt-0.5 text-[10px] text-slate-500">
              <span>6%</span><span>16%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-500">Loan Tenure</label>
              <span className="text-xs font-bold text-[#BA0D0B]">{tenure} Years</span>
            </div>
            <input
              type="range" min={1} max={30} step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#BA0D0B] bg-gray-200"
            />
            <div className="flex justify-between mt-0.5 text-[10px] text-slate-500">
              <span>1 Yr</span><span>30 Yrs</span>
            </div>
          </div>

          {/* Partner Banks */}
          
        </div>

        {/* Results */}
        <div className="flex flex-col justify-between gap-4">
          {/* Donut chart (CSS) */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-3">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#BA0D0B" strokeWidth="3.5"
                  strokeDasharray={`${interestPct} ${principalPct}`}
                  strokeLinecap="round"
                />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="#E87C02" strokeWidth="3.5"
                  strokeDasharray={`${principalPct} ${interestPct}`}
                  strokeDashoffset={`-${interestPct}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[9px] text-slate-500 font-medium">Monthly</p>
                <p className="text-sm font-extrabold text-[#15191C]">{fmt(emi)}</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E87C02] inline-block" />
                <span className="text-slate-500">Principal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#BA0D0B] inline-block" />
                <span className="text-slate-500">Interest</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            {[
              { label: "Monthly EMI", value: fmt(emi), bold: true },
              { label: "Total Interest", value: fmt(totalInterest), bold: false },
              { label: "Total Repayment", value: fmt(totalPayment), bold: false },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-[#E5E8EB] last:border-0">
                <span className="text-xs text-slate-500">{row.label}</span>
                <span className={`text-sm ${row.bold ? "font-extrabold text-[#BA0D0B]" : "font-semibold text-[#15191C]"}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full bg-[#BA0D0B] text-white text-sm font-bold py-2.5 rounded-lg hover:bg-[#5C0B03] transition">
            Check Loan Eligibility
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Investment Corridor Card ──────────────────────────────────────────────────
function CorridorCard({ corridor }) {
  return (
    <div className="flex-shrink-0 w-64 bg-[#FFFFFF] rounded-xl border border-[#E5E8EB] overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      <div className="relative h-36 overflow-hidden">
        <img
          src={corridor.image}
          alt={corridor.area}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${corridor.tagColor}`}>
          {corridor.tag}
        </span>
        <div className="absolute bottom-2.5 left-3">
          <p className="text-white font-bold text-sm leading-tight">{corridor.area}</p>
          <p className="text-slate-500 text-[11px]">{corridor.city}</p>
        </div>
      </div>
      <div className="p-3.5 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-sm font-extrabold text-[#4ade80]">{corridor.appreciation}</p>
          <p className="text-[10px] text-slate-500 leading-tight">Appreciation</p>
        </div>
        <div className="text-center border-x border-[#E5E8EB]">
          <p className="text-sm font-extrabold text-[#BA0D0B]">{corridor.rentalYield}</p>
          <p className="text-[10px] text-slate-500 leading-tight">Rental Yield</p>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-bold text-[#15191C] leading-tight">{corridor.priceRange}</p>
          <p className="text-[10px] text-slate-500 leading-tight">Price Range</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function InvestmentAdvisory() {
  const [activeTab, setActiveTab] = useState("Home Loan");

  return (
    <section className="bg-[#FFFFFF] py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* ── Home Loans Section ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-extrabold text-[#15191C] tracking-tight">
                  property<span className="text-[#BA0D0B]">Loans</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm">Compare Home Loan Offers from 40+ Banks</p>
              <div className="w-10 h-0.5 bg-[#BA0D0B] rounded-full mt-2" />
            </div>
            <a href="#" className="text-sm font-semibold text-[#BA0D0B] hover:underline flex items-center gap-1">
              View all offers
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Loan Services Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {LOAN_SERVICES.map((s) => (
              <div key={s.label} className="flex items-start gap-3 bg-[#FFFFFF] rounded-xl p-4 hover:bg-[#FCEAEA] hover:border-[#5C0B03] border border-transparent transition cursor-pointer group">
                <span className="text-xl shrink-0 mt-0.5">{s.icon}</span>
                <div>
                  <p className="text-sm font-bold text-[#15191C] group-hover:text-[#BA0D0B] transition">{s.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* EMI Calculator */}
          <EMICalculator />
          <MagicLoansSection />
        </div>

        {/* ── Investment Advisory Section ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold text-[#15191C]">Smart Real Estate Investment</h2>
              <div className="w-10 h-0.5 bg-[#BA0D0B] rounded-full mt-1" />
            </div>
            <a href="#" className="text-sm font-semibold text-[#BA0D0B] hover:underline flex items-center gap-1">
              View all corridors
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <p className="text-slate-500 text-sm mb-5">Our experts help investors identify high-growth opportunities</p>

          {/* Investment Tools */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {INVESTMENT_TOOLS.map((tool) => (
              <button
                key={tool.label}
                className="flex items-center gap-3 rounded-xl border border-[#E5E8EB] p-4 hover:border-[#2C9DD5] hover:shadow-md transition group text-left"
              >
                <div className={`${tool.color} p-2 rounded-lg shrink-0 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#15191C]">{tool.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* High Growth Corridors scroll row */}
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {INVESTMENT_CORRIDORS.map((c) => (
              <CorridorCard key={c.id} corridor={c} />
            ))}
          </div>

          {/* NRI Investment CTA */}
          <div className="mt-6 bg-gradient-to-r from-[#15191C] to-[#1a1a2e] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#BA0D0B]/20 border border-[#2C9DD5]/40 flex items-center justify-center text-2xl shrink-0">
                🌍
              </div>
              <div>
                <p className="text-white font-bold text-base">NRI Investment Services</p>
                <p className="text-[#C7CCD1] text-sm mt-0.5">
                  Invest in Indian real estate from anywhere in the world. Dedicated NRI desk available.
                </p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <button className="bg-[#BA0D0B] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#5C0B03] transition">
                NRI Advisory
              </button>
              <button className="bg-white/10 text-white text-sm font-bold px-5 py-2.5 rounded-lg border border-white/20 hover:bg-white/20 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
