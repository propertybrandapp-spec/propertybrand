import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  MapPin,
  Search,
  SlidersHorizontal,
  RotateCcw,
  IndianRupee,
  Home,
  Building2,
  Users,
  BadgeCheck,
  Waves,
  Dumbbell,
  Car,
  Shield,
  Leaf,
  PartyPopper,
  TrendingUp,
  ArrowRight,
  Bed,
  Maximize2,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Sparkles,
} from "lucide-react";

// ─── Static data ──────────────────────────────────────────────────────────────

const SEARCH_TABS = ["Buy", "Rent", "Commercial", "New Projects"];

const PROPERTY_TYPES = [
  "Apartment", "Villa", "Row House", "Studio", "Plot",
  "Commercial Office", "Retail Space", "Warehouse",
];

const BUILDERS = [
  "DLF", "Lodha", "Prestige Group", "Sobha Realty",
  "Godrej Properties", "Tata Housing", "Shapoorji Pallonji",
  "Brigade Group", "Mahindra Lifespaces",
];

const MIN_BUDGETS = [
  "₹20 Lakhs", "₹30 Lakhs", "₹50 Lakhs", "₹75 Lakhs",
  "₹1 Cr", "₹1.5 Cr", "₹2 Cr", "₹3 Cr",
];

const MAX_BUDGETS = [
  "₹50 Lakhs", "₹75 Lakhs", "₹1 Cr", "₹1.5 Cr",
  "₹2 Cr", "₹3 Cr", "₹5 Cr", "₹5 Cr+",
];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

const POSSESSION_OPTIONS = [
  { label: "Ready to Move", value: "ready" },
  { label: "Under Construction", value: "under_construction" },
  { label: "New Launch", value: "new_launch" },
];

const AMENITY_OPTIONS = [
  { label: "Swimming Pool", icon: Waves },
  { label: "Gym",           icon: Dumbbell },
  { label: "Clubhouse",     icon: PartyPopper },
  { label: "Parking",       icon: Car },
  { label: "Security",      icon: Shield },
  { label: "Garden",        icon: Leaf },
];

const INVESTMENT_OPTIONS = [
  { label: "Low",    color: "emerald" },
  { label: "Medium", color: "amber"   },
  { label: "High",   color: "rose"    },
];

const TRUST_ITEMS = [
  "Verified Listings",
  "Trusted Developers",
  "Expert Advisory",
  "End-to-End Support",
];

const QUICK_STATS = [
  { icon: Home,      value: "5,000+", label: "Active Listings"   },
  { icon: Building2, value: "200+",   label: "Top Developers"    },
  { icon: Users,     value: "1,000+", label: "Clients Served"    },
  { icon: BarChart3, value: "25+",    label: "Cities Covered"    },
];

const POPULAR_SEARCHES = [
  "2 BHK Apartments in Whitefield",
  "Luxury Villas in Jubilee Hills",
  "Commercial Offices in BKC",
  "Gated Communities in Sarjapur",
  "Investment Plots in Pune",
];

const PREVIEW_PROPERTIES = [
  {
    id: 1,
    name: "Prestige Lakeside Habitat",
    location: "Whitefield, Bengaluru",
    price: "₹85 Lakhs",
    area: "1,250 sq.ft",
    beds: "2 BHK",
    tag: "Ready to Move",
    tagColor: "bg-emerald-500",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=82",
    rera: true,
  },
  {
    id: 2,
    name: "Sobha City Towers",
    location: "Thanisandra, Bengaluru",
    price: "₹1.2 Cr",
    area: "1,680 sq.ft",
    beds: "3 BHK",
    tag: "New Launch",
    tagColor: "bg-[#0F4C81]",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=82",
    rera: true,
  },
  {
    id: 3,
    name: "DLF The Crest",
    location: "Sector 54, Gurugram",
    price: "₹3.5 Cr",
    area: "2,800 sq.ft",
    beds: "4+ BHK",
    tag: "Under Construction",
    tagColor: "bg-amber-500",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=82",
    rera: true,
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Select field ─────────────────────────────────────────────────────────────

function SelectField({ id, label, options, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-slate-200 bg-white text-[13.5px] text-slate-700 rounded-sm px-3.5 py-2.5 pr-9 focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/20 transition-all duration-150 [&>option]:bg-white [&>option]:text-slate-800"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}

// ─── Chip toggle ─────────────────────────────────────────────────────────────

function Chip({ label, selected, onToggle, small = false }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`rounded-sm border text-[12.5px] font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-1 ${
        small ? "px-3 py-1.5" : "px-3.5 py-2"
      } ${
        selected
          ? "bg-[#0F4C81] border-[#0F4C81] text-white shadow-[0_2px_8px_rgba(15,76,129,0.22)]"
          : "bg-white border-slate-200 text-slate-600 hover:border-[#0F4C81]/40 hover:text-[#0F4C81]"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Amenity chip with icon ───────────────────────────────────────────────────

function AmenityChip({ label, icon: Icon, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`flex items-center gap-1.5 rounded-sm border text-[12px] font-semibold px-3 py-1.5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-1 ${
        selected
          ? "bg-[#0F4C81] border-[#0F4C81] text-white"
          : "bg-white border-slate-200 text-slate-600 hover:border-[#0F4C81]/40 hover:text-[#0F4C81]"
      }`}
    >
      <Icon style={{ width: 12, height: 12 }} aria-hidden="true" />
      {label}
    </button>
  );
}

// ─── Preview property card ────────────────────────────────────────────────────

function PreviewCard({ property, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.48, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group flex flex-col bg-white border border-slate-200 hover:border-[#0F4C81]/25 rounded-sm overflow-hidden hover:shadow-[0_8px_28px_rgba(15,76,129,0.11)] transition-all duration-250 cursor-pointer"
      aria-label={`${property.name}, ${property.location}`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={property.img}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/55 to-transparent" />

        {/* Tag */}
        <span className={`absolute top-3 left-3 ${property.tagColor} text-white text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-sm`}>
          {property.tag}
        </span>

        {/* RERA badge */}
        {property.rera && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm">
            <BadgeCheck className="w-3 h-3 text-[#0F4C81]" aria-hidden="true" />
            <span className="text-[9.5px] font-bold text-[#0F4C81] tracking-wide">RERA</span>
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <span
            className="text-white font-extrabold text-lg leading-none"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {property.price}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-4">
        <div>
          <h3
            className="text-[#0F172A] font-bold text-[14px] leading-snug group-hover:text-[#0F4C81] transition-colors duration-150"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {property.name}
          </h3>
          <p className="flex items-center gap-1 text-slate-500 text-[12px] mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {property.location}
          </p>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-slate-600 text-[11.5px] font-medium">
            <Bed className="w-3 h-3 text-[#0F4C81]" aria-hidden="true" />
            {property.beds}
          </div>
          <div className="w-px h-3 bg-slate-200" aria-hidden="true" />
          <div className="flex items-center gap-1 text-slate-600 text-[11.5px] font-medium">
            <Maximize2 className="w-3 h-3 text-[#0F4C81]" aria-hidden="true" />
            {property.area}
          </div>
          <div className="ml-auto">
            <ArrowRight className="w-3.5 h-3.5 text-[#0F4C81] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" aria-hidden="true" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── SearchFilters (main export) ──────────────────────────────────────────────

export default function SearchFilters() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab,      setActiveTab]      = useState("Buy");
  const [location,       setLocation]       = useState("");
  const [minBudget,      setMinBudget]      = useState("");
  const [maxBudget,      setMaxBudget]      = useState("");
  const [propertyType,   setPropertyType]   = useState("");
  const [selectedBhk,    setSelectedBhk]    = useState([]);
  const [builder,        setBuilder]        = useState("");
  const [possession,     setPossession]     = useState("");
  const [amenities,      setAmenities]      = useState([]);
  const [loanEligible,   setLoanEligible]   = useState("");
  const [investment,     setInvestment]     = useState("");

  // Active filter count for the badge
  const activeCount = [
    location, minBudget, maxBudget, propertyType,
    builder, possession, loanEligible, investment,
  ].filter(Boolean).length + selectedBhk.length + amenities.length;

  function toggleBhk(val) {
    setSelectedBhk((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  function toggleAmenity(val) {
    setAmenities((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  function resetAll() {
    setLocation(""); setMinBudget(""); setMaxBudget(""); setPropertyType("");
    setSelectedBhk([]); setBuilder(""); setPossession(""); setAmenities([]);
    setLoanEligible(""); setInvestment("");
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="search"
      className="bg-[#F8FAFC] py-20 lg:py-28"
      aria-labelledby="search-heading"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col gap-12">

        {/* ── Section header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <Reveal delay={0}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1.5px] bg-amber-400" aria-hidden="true" />
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#0F4C81]">
                Property Search Filters
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.07}>
            <h2
              id="search-heading"
              className="text-[#0F172A] leading-[1.1] tracking-tight"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(1.85rem, 3.8vw, 2.65rem)",
                fontWeight: 800,
              }}
            >
              Find Your{" "}
              <span className="text-[#0F4C81]">Perfect Property</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-slate-500 text-[15px] leading-[1.78]">
              Discover properties tailored to your lifestyle, budget, and investment
              goals using advanced search filters.
            </p>
          </Reveal>
        </div>

        {/* ── Main two-column layout ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ── LEFT — Search card ────────────────────────────────────────────── */}
          <Reveal delay={0.1} className="h-full">
            <form
              className="bg-white border border-slate-200 rounded-sm shadow-[0_4px_24px_rgba(15,76,129,0.08)] overflow-hidden"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Property search form"
              noValidate
            >
              {/* Intent tabs */}
              <div className="flex border-b border-slate-100" role="tablist" aria-label="Search intent">
                {SEARCH_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative flex-1 py-3.5 text-[13px] font-semibold tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[#0F4C81] ${
                      activeTab === tab ? "text-[#0F4C81]" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.span
                        layoutId="searchTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0F4C81]"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Filter body */}
              <div className="p-6 flex flex-col gap-6">

                {/* ── Row 1: Location ────────────────────────────────────────── */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="filter-location" className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.12em]">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F4C81]" aria-hidden="true" />
                    <input
                      id="filter-location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, locality or landmark"
                      className="w-full border border-slate-200 bg-white text-[13.5px] text-slate-700 rounded-sm pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/20 transition-all duration-150 placeholder-slate-400"
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Thin rule */}
                <div className="border-t border-slate-100" aria-hidden="true" />

                {/* ── Row 2: Budget + Property Type ──────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectField
                    id="filter-min-budget"
                    label="Min Budget"
                    options={MIN_BUDGETS}
                    value={minBudget}
                    onChange={setMinBudget}
                    placeholder="No minimum"
                  />
                  <SelectField
                    id="filter-max-budget"
                    label="Max Budget"
                    options={MAX_BUDGETS}
                    value={maxBudget}
                    onChange={setMaxBudget}
                    placeholder="No maximum"
                  />
                  <SelectField
                    id="filter-type"
                    label="Property Type"
                    options={PROPERTY_TYPES}
                    value={propertyType}
                    onChange={setPropertyType}
                    placeholder="All types"
                  />
                </div>

                {/* Thin rule */}
                <div className="border-t border-slate-100" aria-hidden="true" />

                {/* ── Row 3: BHK chips ───────────────────────────────────────── */}
                <fieldset>
                  <legend className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-3">
                    Bedrooms
                  </legend>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Number of bedrooms">
                    {BHK_OPTIONS.map((bhk) => (
                      <Chip
                        key={bhk}
                        label={bhk}
                        selected={selectedBhk.includes(bhk)}
                        onToggle={() => toggleBhk(bhk)}
                      />
                    ))}
                  </div>
                </fieldset>

                {/* Thin rule */}
                <div className="border-t border-slate-100" aria-hidden="true" />

                {/* ── Row 4: Builder + Possession Status ─────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    id="filter-builder"
                    label="Builder"
                    options={BUILDERS}
                    value={builder}
                    onChange={setBuilder}
                    placeholder="Any builder"
                  />

                  {/* Possession — chips inside select wrapper style */}
                  <fieldset>
                    <legend className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-3">
                      Possession Status
                    </legend>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Possession status">
                      {POSSESSION_OPTIONS.map((opt) => (
                        <Chip
                          key={opt.value}
                          label={opt.label}
                          selected={possession === opt.value}
                          onToggle={() => setPossession(possession === opt.value ? "" : opt.value)}
                          small
                        />
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* Thin rule */}
                <div className="border-t border-slate-100" aria-hidden="true" />

                {/* ── Row 5: Amenities ───────────────────────────────────────── */}
                <fieldset>
                  <legend className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-3">
                    Amenities
                  </legend>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Amenities">
                    {AMENITY_OPTIONS.map((a) => (
                      <AmenityChip
                        key={a.label}
                        label={a.label}
                        icon={a.icon}
                        selected={amenities.includes(a.label)}
                        onToggle={() => toggleAmenity(a.label)}
                      />
                    ))}
                  </div>
                </fieldset>

                {/* Thin rule */}
                <div className="border-t border-slate-100" aria-hidden="true" />

                {/* ── Row 6: Loan Eligibility + Investment Potential ─────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <fieldset>
                    <legend className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-3">
                      Loan Eligibility
                    </legend>
                    <div className="flex gap-2" role="group" aria-label="Loan eligibility">
                      {["Yes", "No"].map((val) => (
                        <Chip
                          key={val}
                          label={val}
                          selected={loanEligible === val}
                          onToggle={() => setLoanEligible(loanEligible === val ? "" : val)}
                          small
                        />
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-3">
                      Investment Potential
                    </legend>
                    <div className="flex gap-2" role="group" aria-label="Investment potential">
                      {INVESTMENT_OPTIONS.map((opt) => (
                        <Chip
                          key={opt.label}
                          label={opt.label}
                          selected={investment === opt.label}
                          onToggle={() => setInvestment(investment === opt.label ? "" : opt.label)}
                          small
                        />
                      ))}
                    </div>
                  </fieldset>
                </div>

                {/* ── Action buttons ─────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  {/* Primary search */}
                  <motion.button
                    type="submit"
                    whileHover={{ backgroundColor: "#0d3f6e" }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0F4C81] text-white font-bold py-3.5 rounded-sm text-[14px] tracking-wide shadow-[0_2px_14px_rgba(15,76,129,0.28)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                    aria-label="Search properties"
                  >
                    <Search className="w-4 h-4" aria-hidden="true" />
                    Search Properties
                    {activeCount > 0 && (
                      <span className="ml-1 bg-amber-400 text-[#0F172A] text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {activeCount}
                      </span>
                    )}
                  </motion.button>

                  {/* Reset */}
                  <motion.button
                    type="button"
                    onClick={resetAll}
                    whileHover={{ borderColor: "#0F4C81", color: "#0F4C81" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 border border-slate-300 text-slate-500 font-semibold px-6 py-3.5 rounded-sm text-[13.5px] tracking-wide hover:bg-slate-50 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                    aria-label="Reset all filters"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    Reset Filters
                  </motion.button>
                </div>

              </div>

              {/* Trust banner — inside card, bottom strip */}
              <div
                className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex flex-wrap gap-x-5 gap-y-1.5"
                role="list"
                aria-label="Trust indicators"
              >
                {TRUST_ITEMS.map((item) => (
                  <div key={item} role="listitem" className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                    <span className="text-[12px] text-slate-500 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </form>
          </Reveal>

          {/* ── RIGHT — Quick insights sidebar ─────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Market stats card */}
            <Reveal delay={0.18}>
              <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-[0_2px_12px_rgba(15,76,129,0.06)]">
                <div className="border-b border-slate-100 px-5 py-3.5 flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-[#0F4C81]" aria-hidden="true" />
                  <span className="text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#0F4C81]">
                    Market Snapshot
                  </span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-100">
                  {QUICK_STATS.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="flex flex-col gap-0.5 px-4 py-4">
                      <Icon className="w-3.5 h-3.5 text-amber-500 mb-1" aria-hidden="true" />
                      <span
                        className="text-[#0F172A] font-extrabold text-lg leading-none tabular-nums"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {value}
                      </span>
                      <span className="text-slate-500 text-[11px] font-medium leading-snug">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Popular searches card */}
            <Reveal delay={0.24}>
              <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-[0_2px_12px_rgba(15,76,129,0.06)]">
                <div className="border-b border-slate-100 px-5 py-3.5 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#0F4C81]" aria-hidden="true" />
                  <span className="text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#0F4C81]">
                    Trending Searches
                  </span>
                </div>
                <ul className="flex flex-col divide-y divide-slate-100" role="list">
                  {POPULAR_SEARCHES.map((search) => (
                    <li key={search}>
                      <button
                        type="button"
                        onClick={() => setLocation(search.split(" in ")[1] ?? search)}
                        className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left text-[12.5px] text-slate-600 hover:text-[#0F4C81] hover:bg-slate-50 transition-all duration-150 group focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[#0F4C81]"
                        aria-label={`Search for ${search}`}
                      >
                        <span className="line-clamp-1">{search}</span>
                        <ArrowRight className="w-3 h-3 flex-shrink-0 text-slate-300 group-hover:text-[#0F4C81] group-hover:translate-x-0.5 transition-all duration-150" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Active filter badge */}
            <AnimatePresence>
              {activeCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 bg-[#0F4C81]/6 border border-[#0F4C81]/20 rounded-sm px-4 py-3"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F4C81] flex-shrink-0" aria-hidden="true" />
                  <span className="text-[12.5px] text-[#0F4C81] font-semibold">
                    {activeCount} filter{activeCount > 1 ? "s" : ""} applied
                  </span>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="ml-auto text-[11.5px] text-slate-500 hover:text-[#0F4C81] font-medium transition-colors focus:outline-none focus-visible:underline"
                    aria-label="Clear all filters"
                  >
                    Clear all
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Thin rule ─────────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-slate-200" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 flex-shrink-0">
              Search Results Preview
            </span>
            <div className="flex-1 border-t border-slate-200" aria-hidden="true" />
          </div>
        </Reveal>

        {/* ── Preview property cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PREVIEW_PROPERTIES.map((property, i) => (
            <PreviewCard key={property.id} property={property} delay={0.08 + i * 0.08} />
          ))}
        </div>

        {/* View all link */}
        <Reveal delay={0.1} className="flex justify-center">
          <motion.a
            href="#"
            whileHover={{ gap: "12px" }}
            className="inline-flex items-center gap-2 border border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white font-bold px-8 py-3 rounded-sm text-[13.5px] tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
            aria-label="View all property listings"
          >
            View All Listings
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </motion.a>
        </Reveal>

      </div>
    </section>
  );
}
