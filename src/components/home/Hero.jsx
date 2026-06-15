import { useState } from "react";
import {
  Search,
  MapPin,
  Home,
  Bed,
  Building2,
  Calendar,
  Star,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Users,
  Phone,
  Calculator,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  Award,
  Filter,
  SlidersHorizontal,
  IndianRupee,
} from "lucide-react";

/* ─── tiny utility: join class strings ─── */
const cx = (...cls) => cls.filter(Boolean).join(" ");

/* ─── Sub-components ─── */

function TabBar({ active, onChange }) {
  const tabs = ["Buy", "Rent", "Commercial", "New Projects", "Plot"];
  return (
    <div className="flex items-center overflow-x-auto scrollbar-none border-b border-gray-100 bg-gray-50/60">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cx(
            "flex-shrink-0 px-5 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8232a] focus-visible:ring-inset",
            active === t
              ? "text-[#d8232a] border-[#d8232a] bg-white"
              : "text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-100/80"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function SelectField({ label, icon: Icon, options, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d8232a] pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="w-full pl-9 pr-8 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-gray-50 hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d8232a]/25 focus:border-[#d8232a] transition-all duration-150 appearance-none cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

function TextField({ label, icon: Icon, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d8232a] pointer-events-none" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d8232a]/25 focus:border-[#d8232a] transition-all duration-150"
        />
      </div>
    </div>
  );
}

/* ─── Floating stat card for the hero image ─── */
function StatCard({ icon: Icon, title, subtitle, positionClass }) {
  return (
    <div
      className={cx(
        "absolute bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 p-3.5 flex items-center gap-3 min-w-[170px] hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300",
        positionClass
      )}
    >
      <div className="w-9 h-9 bg-[#fef2f2] rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-[#d8232a]" />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm leading-tight">{title}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

/* ─── Skyline illustration ─── */
function SkylineIllustration() {
  const buildings = [
    { h: "h-24", w: "w-8", delay: "" },
    { h: "h-36", w: "w-12", delay: "" },
    { h: "h-20", w: "w-7", delay: "" },
    { h: "h-44", w: "w-14", delay: "" },
    { h: "h-28", w: "w-10", delay: "" },
    { h: "h-40", w: "w-12", delay: "" },
    { h: "h-16", w: "w-8", delay: "" },
    { h: "h-32", w: "w-10", delay: "" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Sky */}
      <div className="flex-1 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]">
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/60 rounded-full"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${(i * 5.3) % 95}%`,
              opacity: 0.4 + (i % 4) * 0.15,
            }}
          />
        ))}
        {/* Glow / moon */}
        <div className="absolute top-8 right-10 w-14 h-14 bg-amber-300/80 rounded-full blur-sm shadow-[0_0_30px_rgba(252,211,77,0.6)]" />
        <div className="absolute top-10 right-12 w-10 h-10 bg-amber-200 rounded-full" />
      </div>
      {/* Building silhouettes */}
      <div className="flex items-end justify-around px-2 gap-1 h-36">
        {buildings.map((b, i) => (
          <div
            key={i}
            className={cx(
              b.h,
              b.w,
              "bg-[#1e293b] rounded-t-sm flex-shrink-0 relative overflow-hidden"
            )}
          >
            {/* Window grid */}
            <div className="absolute inset-1 grid grid-cols-2 gap-0.5">
              {[...Array(8)].map((_, j) => (
                <div
                  key={j}
                  className={cx(
                    "rounded-[1px]",
                    (i + j) % 3 === 0
                      ? "bg-amber-300/70"
                      : (i + j) % 5 === 0
                      ? "bg-blue-300/50"
                      : "bg-slate-700"
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN HERO COMPONENT
════════════════════════════════════════ */
export default function Hero() {
  const [activeTab, setActiveTab] = useState("Buy");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [builder, setBuilder] = useState("");
  const [possession, setPossession] = useState("");
  const [amenity, setAmenity] = useState("");
  const [loanEligibility, setLoanEligibility] = useState("");
  const [investmentPotential, setInvestmentPotential] = useState("");
  const [showAllFilters, setShowAllFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(
      `Searching: ${activeTab} | Location: ${location || "Any"} | Budget: ${
        budget || "Any"
      } | Type: ${propertyType || "Any"}`
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* ══════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════ */}
      <section className="relative bg-white overflow-hidden">
        {/* Decorative soft red blobs */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[520px] h-[520px] bg-[#d8232a]/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-72 h-72 bg-[#d8232a]/4 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 lg:pt-20 lg:pb-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">
            {/* ── LEFT: Text + CTAs ── */}
            <div className="space-y-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#fef2f2] border border-[#d8232a]/25 text-[#d8232a] px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase">
                <Sparkles size={13} />
                PropertyBrands Realty Services
              </div>

              {/* Main heading */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                  Your Trusted{" "}
                  <span className="relative inline-block text-[#d8232a]">
                    Search Partner
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      viewBox="0 0 300 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 6 C60 2, 180 2, 298 5"
                        stroke="#d8232a"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.35"
                      />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
                PropertyBrands Realty Services is a technology-driven real
                estate platform connecting homebuyers, investors, developers,
                landlords, tenants, architects, interior designers, and service
                providers through a seamless digital ecosystem.
              </p>

              {/* Taglines */}
              <div className="space-y-2.5">
                {["Discover. Invest. Build. Grow.", "Compare. Discuss. Decide."].map(
                  (line) => (
                    <div key={line} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 bg-[#d8232a] rounded-full flex-shrink-0" />
                      <span className="text-gray-800 font-semibold text-sm sm:text-base">
                        {line}
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-[#d8232a] text-white px-5 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#b81e22] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#d8232a]/25 hover:-translate-y-0.5 col-span-2 sm:col-span-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8232a] focus-visible:ring-offset-2"
                >
                  <Home size={15} />
                  Explore Properties
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-white text-[#d8232a] border-2 border-[#d8232a] px-5 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#fef2f2] active:scale-[0.98] transition-all duration-200 col-span-2 sm:col-span-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8232a] focus-visible:ring-offset-2"
                >
                  <Calendar size={15} />
                  Schedule Site Visit
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 col-span-2 sm:col-span-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                >
                  <Calculator size={15} />
                  Calculate EMI
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-200 px-5 py-3.5 rounded-xl font-semibold text-sm hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 col-span-2 sm:col-span-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                >
                  <Phone size={15} />
                  Talk to an Expert
                </button>
              </div>

              {/* Trust bar */}
              <div className="flex flex-wrap gap-5 pt-5 border-t border-gray-100">
                {[
                  { icon: Shield, stat: "50K+", label: "Verified Listings" },
                  { icon: Users, stat: "1L+", label: "Active Users" },
                  { icon: Award, stat: "500+", label: "Expert Advisors" },
                ].map(({ icon: Icon, stat, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon size={15} className="text-[#d8232a] flex-shrink-0" />
                    <span>
                      <strong className="text-gray-900 font-bold">{stat}</strong>{" "}
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Property image placeholder + floating cards ── */}
            <div className="relative hidden lg:block select-none">
              {/* Decorative ring behind card */}
              <div
                aria-hidden="true"
                className="absolute -top-6 -left-6 w-40 h-40 border-2 border-[#d8232a]/10 rounded-full"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 -right-6 w-56 h-56 border-2 border-[#d8232a]/6 rounded-full"
              />

              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                <SkylineIllustration />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                {/* RERA badge — top left */}
                <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#d8232a] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  RERA Approved
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-medium text-white/65 mb-1 uppercase tracking-wider">
                    Premium Residential Properties
                  </p>
                  <p className="text-xl font-extrabold tracking-tight">
                    Starting from ₹45 Lakhs
                  </p>
                </div>
              </div>

              {/* Floating stat cards */}
              <StatCard
                icon={CheckCircle2}
                title="Verified Listings"
                subtitle="50,000+ properties"
                positionClass="-top-4 -right-5"
              />
              <StatCard
                icon={Zap}
                title="AI Discovery"
                subtitle="Smart recommendations"
                positionClass="top-1/2 -left-7 -translate-y-1/2"
              />
              <StatCard
                icon={Users}
                title="Expert Advisory"
                subtitle="500+ consultants"
                positionClass="-bottom-4 -right-5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 2 — ADVANCED SEARCH
      ══════════════════════════════ */}
      <section className="relative z-20 pb-20">
        {/* Negative margin pulls card up to overlap hero on large screens */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:-mt-6">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
            {/* Tab bar */}
            <TabBar active={activeTab} onChange={setActiveTab} />

            {/* Card body */}
            <form onSubmit={handleSearch} noValidate>
              <div className="p-5 sm:p-7 lg:p-8">
                {/* Header row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#fef2f2] rounded-lg flex items-center justify-center">
                      <Filter size={14} className="text-[#d8232a]" />
                    </div>
                    <h2 className="text-base font-bold text-gray-900">
                      Find Your Perfect Property
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllFilters((s) => !s)}
                    className="flex items-center gap-1.5 text-xs text-[#d8232a] font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8232a] rounded"
                    aria-expanded={showAllFilters}
                  >
                    <SlidersHorizontal size={13} />
                    {showAllFilters ? "Fewer Filters" : "More Filters"}
                  </button>
                </div>

                {/* ── Primary filters: always visible ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <TextField
                    label="Location"
                    icon={MapPin}
                    placeholder="City, locality, society…"
                    value={location}
                    onChange={setLocation}
                  />
                  <SelectField
                    label="Budget"
                    icon={IndianRupee}
                    placeholder="Select Budget"
                    value={budget}
                    onChange={setBudget}
                    options={[
                      "Below ₹25 Lakhs",
                      "₹25 – 50 Lakhs",
                      "₹50 – 75 Lakhs",
                      "₹75 Lakhs – 1 Cr",
                      "₹1 Cr – 2 Cr",
                      "Above ₹2 Cr",
                    ]}
                  />
                  <SelectField
                    label="Property Type"
                    icon={Home}
                    placeholder="All Types"
                    value={propertyType}
                    onChange={setPropertyType}
                    options={[
                      "Apartment",
                      "Villa",
                      "Plot / Land",
                      "Builder Floor",
                      "Penthouse",
                      "Studio",
                      "Commercial Space",
                      "Warehouse",
                    ]}
                  />
                  <SelectField
                    label="Bedrooms"
                    icon={Bed}
                    placeholder="Any BHK"
                    value={bedrooms}
                    onChange={setBedrooms}
                    options={["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"]}
                  />
                </div>

                {/* ── Advanced filters: togglable ── */}
                <div
                  className={cx(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    showAllFilters
                      ? "max-h-[600px] opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                  )}
                  aria-hidden={!showAllFilters}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pt-1 border-t border-dashed border-gray-200 pt-4">
                    <TextField
                      label="Builder / Developer"
                      icon={Building2}
                      placeholder="e.g. DLF, Godrej…"
                      value={builder}
                      onChange={setBuilder}
                    />
                    <SelectField
                      label="Possession Status"
                      icon={Calendar}
                      placeholder="Any Status"
                      value={possession}
                      onChange={setPossession}
                      options={[
                        "Ready to Move",
                        "Under Construction",
                        "New Launch",
                        "In 6 Months",
                        "In 1 Year",
                        "In 2 Years",
                      ]}
                    />
                    <SelectField
                      label="Amenities"
                      icon={Star}
                      placeholder="Select Amenities"
                      value={amenity}
                      onChange={setAmenity}
                      options={[
                        "Swimming Pool",
                        "Gym / Fitness Centre",
                        "Covered Parking",
                        "24×7 Security",
                        "Clubhouse",
                        "Landscaped Garden",
                        "Power Backup",
                        "Elevator / Lift",
                      ]}
                    />
                    <SelectField
                      label="Loan Eligibility"
                      icon={CreditCard}
                      placeholder="Check Eligibility"
                      value={loanEligibility}
                      onChange={setLoanEligibility}
                      options={[
                        "Salaried",
                        "Self Employed",
                        "Business Owner",
                        "NRI / OCI",
                        "Freelancer",
                      ]}
                    />
                    <SelectField
                      label="Investment Potential"
                      icon={TrendingUp}
                      placeholder="Any Growth"
                      value={investmentPotential}
                      onChange={setInvestmentPotential}
                      options={[
                        "High Growth Corridor",
                        "Emerging Location",
                        "Rental Yield Focus",
                        "Capital Appreciation",
                        "Commercial Returns",
                      ]}
                    />
                  </div>
                </div>

                {/* ── Footer: trust note + CTA ── */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                      All listings RERA compliant
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield size={12} className="text-[#d8232a] flex-shrink-0" />
                      Verified by our team
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Zap size={12} className="text-amber-500 flex-shrink-0" />
                      AI-powered results
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#d8232a] hover:bg-[#b81e22] active:bg-[#9a191f] text-white font-bold text-base px-10 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#d8232a]/30 hover:-translate-y-0.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8232a] focus-visible:ring-offset-2"
                  >
                    <Search size={17} />
                    Search Properties
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* ── Popular searches row ── */}
          <div className="mt-5 flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mr-1">
              Popular:
            </span>
            {[
              "2 BHK in Pune",
              "Villa in Hyderabad",
              "Plots near Bengaluru",
              "Ready to Move Flats",
              "NRI Investment",
              "Luxury Apartments",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                className="text-xs text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-[#d8232a] hover:text-[#d8232a] hover:bg-[#fef2f2] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d8232a]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
