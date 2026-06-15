import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  IndianRupee,
  Home,
  Search,
  ChevronDown,
  Phone,
  Calculator,
  Calendar,
  ArrowRight,
  Building2,
  Users,
  Globe,
  CheckCircle2,
  TrendingUp,
  BadgeCheck,
} from "lucide-react";

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const numericTarget = parseInt(target.replace(/\D/g, ""), 10);
    let start = 0;
    const step = numericTarget / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const stats = [
  { icon: Home,      label: "Properties Listed",  value: "5000", suffix: "+" },
  { icon: Users,     label: "Happy Clients",       value: "1000", suffix: "+" },
  { icon: Building2, label: "Developer Partners",  value: "200",  suffix: "+" },
  { icon: Globe,     label: "Cities Covered",      value: "25",   suffix: "+" },
];

const propertyHighlights = [
  {
    tag: "New Launch",
    title: "Luxury Apartments",
    price: "Starting ₹75 Lakhs",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=85",
    location: "Whitefield, Bengaluru",
  },
  {
    tag: "Featured",
    title: "Premium Villas",
    price: "Starting ₹1.5 Cr",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=85",
    location: "Jubilee Hills, Hyderabad",
  },
  {
    tag: "High ROI",
    title: "Commercial Spaces",
    price: "High ROI Investments",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=85",
    location: "BKC, Mumbai",
  },
];

const trustItems = [
  "Verified Listings",
  "Expert Advisory",
  "Home Loan Support",
  "Investment Assistance",
];

const propertyTypes = ["Apartment", "Villa", "Plot", "Commercial", "Studio", "Penthouse"];
const budgetRanges  = ["Under ₹50L", "₹50L – ₹1Cr", "₹1Cr – ₹2Cr", "₹2Cr – ₹5Cr", "₹5Cr+"];
const searchTabs    = ["Buy", "Rent", "Commercial", "New Projects"];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50"
      aria-label="Primary navigation"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] rounded" aria-label="PropertyBrands home">
          <div className="w-9 h-9 rounded-sm bg-[#0F4C81] flex items-center justify-center flex-shrink-0">
            <Building2 className="w-[18px] h-[18px] text-white" aria-hidden="true" />
          </div>
          <div className="leading-none">
            <span className="block text-[#0F172A] font-bold text-[15px] tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              PropertyBrands
            </span>
            <span className="block text-[#0F4C81] text-[10px] font-semibold tracking-[0.18em] uppercase mt-px">
              Realty Services
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7" role="list">
          {["Properties", "Projects", "Developers", "Services", "About"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="text-slate-600 hover:text-[#0F4C81] text-[13.5px] font-medium transition-colors duration-150 focus:outline-none focus-visible:underline"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Contact CTA */}
        <a
          href="tel:+910000000000"
          className="hidden lg:flex items-center gap-2 border border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white px-4 py-2 rounded-sm text-[13px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81]"
          aria-label="Call us at +91 98765 43210"
        >
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          +91 98765 43210
        </a>

        {/* Mobile hamburger placeholder */}
        <button
          className="lg:hidden p-2 text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] rounded"
          aria-label="Open menu"
        >
          <div className="w-5 h-[1.5px] bg-current mb-1" />
          <div className="w-5 h-[1.5px] bg-current mb-1" />
          <div className="w-3.5 h-[1.5px] bg-current" />
        </button>
      </div>
    </motion.nav>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar() {
  const [location, setLocation]         = useState("");
  const [budget, setBudget]             = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [activeTab, setActiveTab]       = useState("Buy");

  return (
    <div className="w-full bg-white border border-slate-200 shadow-[0_4px_24px_rgba(15,76,129,0.09)] rounded-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-100" role="tablist" aria-label="Property search type">
        {searchTabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-3 text-[13px] font-semibold tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[#0F4C81] ${
              activeTab === tab
                ? "text-[#0F4C81]"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.span
                layoutId="searchTabLine"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0F4C81]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Fields row */}
      <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {/* Location */}
        <div className="flex-1 relative">
          <label htmlFor="search-location" className="sr-only">Location</label>
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F4C81]" aria-hidden="true" />
          <input
            id="search-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, locality or landmark"
            className="w-full h-[54px] pl-10 pr-4 text-[13.5px] text-slate-700 placeholder-slate-400 bg-transparent focus:outline-none focus:bg-slate-50 transition-colors"
          />
        </div>

        {/* Budget */}
        <div className="flex-1 relative">
          <label htmlFor="search-budget" className="sr-only">Budget</label>
          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F4C81]" aria-hidden="true" />
          <select
            id="search-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full h-[54px] pl-10 pr-8 text-[13.5px] appearance-none bg-transparent text-slate-700 focus:outline-none focus:bg-slate-50 transition-colors [&>option]:bg-white [&>option]:text-slate-800"
          >
            <option value="" disabled>Budget range</option>
            {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Property Type */}
        <div className="flex-1 relative">
          <label htmlFor="search-type" className="sr-only">Property Type</label>
          <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0F4C81]" aria-hidden="true" />
          <select
            id="search-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full h-[54px] pl-10 pr-8 text-[13.5px] appearance-none bg-transparent text-slate-700 focus:outline-none focus:bg-slate-50 transition-colors [&>option]:bg-white [&>option]:text-slate-800"
          >
            <option value="" disabled>Property type</option>
            {propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Search button */}
        <motion.button
          whileHover={{ backgroundColor: "#0d3f6e" }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 bg-[#0F4C81] text-white px-8 h-[54px] text-[13.5px] font-bold tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F4C81] whitespace-nowrap"
          aria-label="Search Properties"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Search Properties
        </motion.button>
      </div>
    </div>
  );
}

// ─── Right-panel image carousel (auto-advances) ───────────────────────────────
function PropertyShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % propertyHighlights.length), 4500);
    return () => clearInterval(t);
  }, []);

  const card = propertyHighlights[active];

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-0 overflow-hidden rounded-sm">
      {/* Background image transitions */}
      {propertyHighlights.map((p, i) => (
        <motion.img
          key={p.img}
          src={p.img}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}

      {/* Gradient overlay — bottom only, subtle */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-[#0F172A]/20 to-transparent" />

      {/* Top right — live badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-sm shadow-md"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-slate-700 tracking-wide">248 listings added today</span>
      </motion.div>

      {/* Bottom info card */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-end justify-between gap-4">
          {/* Property detail */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className="inline-block text-[10px] font-bold tracking-[0.14em] uppercase text-amber-400 mb-1.5">
              {card.tag}
            </span>
            <h3 className="text-white text-xl font-bold leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {card.title}
            </h3>
            <p className="text-white/80 text-sm mt-1 font-medium">{card.price}</p>
            <p className="text-white/50 text-[11px] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {card.location}
            </p>
          </motion.div>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {propertyHighlights.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View ${propertyHighlights[i].title}`}
                className={`transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  i === active ? "w-5 h-1.5 bg-amber-400" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Property type pills */}
        <div className="flex gap-2 mt-4">
          {propertyHighlights.map((p, i) => (
            <button
              key={p.title}
              onClick={() => setActive(i)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-sm border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                i === active
                  ? "bg-white text-[#0F4C81] border-white"
                  : "bg-white/10 text-white/60 border-white/20 hover:bg-white/20 hover:text-white"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85, duration: 0.55, ease: "easeOut" }}
      className="border-t border-slate-200"
      aria-label="Company statistics"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ backgroundColor: "rgba(15,76,129,0.03)" }}
            className="flex items-center gap-4 py-6 px-4 lg:px-8 transition-colors duration-150 cursor-default"
          >
            <div className="w-9 h-9 rounded-sm border border-[#0F4C81]/20 bg-[#0F4C81]/5 flex items-center justify-center flex-shrink-0">
              <stat.icon className="w-4 h-4 text-[#0F4C81]" aria-hidden="true" />
            </div>
            <div>
              <p
                className="text-[#0F172A] font-extrabold text-2xl leading-none tabular-nums"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1800} />
              </p>
              <p className="text-slate-500 text-[12px] mt-1 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div
      className="bg-[#0F4C81] px-6 lg:px-12"
      role="list"
      aria-label="Trust indicators"
    >
      <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-2 py-3">
        {trustItems.map((item) => (
          <div key={item} role="listitem" className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-white/85 text-[12px] font-medium tracking-wide">{item}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <BadgeCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" aria-hidden="true" />
          <span className="text-white/85 text-[12px] font-medium tracking-wide">RERA Compliant</span>
        </div>
      </div>
    </div>
  );
}

// ─── Hero (main export) ───────────────────────────────────────────────────────
export default function Hero() {
  const fadeUp = {
    hidden:  { opacity: 0, y: 18 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
    }),
  };

  return (
    <>
      <Navbar />

      <main>
        {/* ── Hero panel ─────────────────────────────────────────────────────── */}
        <section
          className="bg-[#F8FAFC]"
          aria-label="Hero section"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-0 lg:gap-12 xl:gap-16 py-14 lg:py-20">

              {/* ── LEFT ─────────────────────────────────────────────────────── */}
              <div className="flex flex-col gap-7 justify-center">

                {/* Badge */}
                <motion.div
                  custom={0}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="inline-flex items-center gap-2 w-fit"
                >
                  <span className="w-5 h-[1.5px] bg-[#0F4C81]" aria-hidden="true" />
                  <span className="text-[#0F4C81] text-[11.5px] font-bold tracking-[0.2em] uppercase">
                    Trusted PropTech Platform
                  </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                  custom={1}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="text-[#0F172A] leading-[1.08] tracking-tight"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)",
                    fontWeight: 800,
                  }}
                >
                  Your Trusted{" "}
                  <span className="text-[#0F4C81]">Search Partner</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="text-slate-500 text-[15.5px] leading-[1.75] max-w-[540px]"
                >
                  PropertyBrands Realty Services is a technology-driven real estate platform connecting homebuyers,
                  investors, developers, landlords, tenants, architects, interior designers, and service providers
                  through a seamless digital ecosystem.
                </motion.p>

                {/* Taglines */}
                <motion.div
                  custom={3}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-0.5"
                >
                  <p
                    className="text-[#0F4C81] font-bold text-[15px] tracking-[0.18em] uppercase"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Discover. Invest. Build. Grow.
                  </p>
                  <p className="text-slate-400 text-[13px] tracking-[0.14em] font-medium">
                    Compare · Discuss · Decide
                  </p>
                </motion.div>

                {/* Divider */}
                <motion.div
                  custom={3.5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="w-16 h-[2px] bg-amber-400"
                  aria-hidden="true"
                />

                {/* CTA Buttons */}
                <motion.div
                  custom={4}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-3"
                >
                  {/* Primary */}
                  <motion.button
                    whileHover={{ backgroundColor: "#0d3f6e", x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-[#0F4C81] text-white font-bold px-6 py-3 rounded-sm text-[13.5px] tracking-wide transition-colors duration-150 shadow-[0_2px_12px_rgba(15,76,129,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                    aria-label="Explore Properties"
                  >
                    <Home className="w-4 h-4" aria-hidden="true" />
                    Explore Properties
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </motion.button>

                  {/* Secondary group */}
                  {[
                    { icon: Calendar,   label: "Schedule Site Visit" },
                    { icon: Calculator, label: "Calculate EMI" },
                    { icon: Phone,      label: "Talk to an Expert" },
                  ].map(({ icon: Icon, label }) => (
                    <motion.button
                      key={label}
                      whileHover={{ borderColor: "#0F4C81", color: "#0F4C81" }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 border border-slate-300 text-slate-600 font-semibold px-5 py-3 rounded-sm text-[13.5px] tracking-wide transition-all duration-150 bg-white hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {label}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Trust row */}
                <motion.div
                  custom={5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-x-5 gap-y-2 pt-1"
                  role="list"
                  aria-label="Trust indicators"
                >
                  {trustItems.map((item) => (
                    <div key={item} role="listitem" className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                      <span className="text-slate-500 text-[12.5px] font-medium">{item}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* ── RIGHT ────────────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                className="relative mt-8 lg:mt-0 rounded-sm overflow-hidden"
                style={{ minHeight: "480px" }}
              >
                <PropertyShowcase />

                {/* Accent frame */}
                <div
                  className="absolute -bottom-1.5 -right-1.5 w-[calc(100%-24px)] h-[calc(100%-24px)] border-2 border-[#F59E0B]/30 rounded-sm pointer-events-none"
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </div>

          {/* ── Search bar — full width below hero columns ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
            className="border-t border-slate-200 bg-white"
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6">
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-3">
                Find your property
              </p>
              <SearchBar />
            </div>
          </motion.div>
        </section>

        {/* ── Stats ──────────────────────────────────────────────────────────── */}
        <StatsRow />

        {/* ── Trust Bar ──────────────────────────────────────────────────────── */}
        <TrustBar />
      </main>
    </>
  );
}
