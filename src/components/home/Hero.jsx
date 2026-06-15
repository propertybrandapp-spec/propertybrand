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
  BadgeCheck,
  Bed,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const RED    = "#C8102E";
const DARK   = "#1A1A1A";
const BORDER = "#E5E5E5";

// ─── Static data ──────────────────────────────────────────────────────────────
const stats = [
  { icon: Home,      label: "Properties Listed", value: "5000", suffix: "+" },
  { icon: Users,     label: "Happy Clients",      value: "1000", suffix: "+" },
  { icon: Building2, label: "Developer Partners", value: "200",  suffix: "+" },
  { icon: Globe,     label: "Cities Covered",     value: "25",   suffix: "+" },
];

const propertyHighlights = [
  {
    tag: "New Launch",
    title: "Luxury Apartments",
    price: "Starting ₹75 Lakhs",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?fm=avif&w=900&q=85",
    location: "Whitefield, Bengaluru",
  },
  {
    tag: "Featured",
    title: "Premium Villas",
    price: "Starting ₹1.5 Cr",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?fm=avif&w=900&q=85",
    location: "Jubilee Hills, Hyderabad",
  },
  {
    tag: "High ROI",
    title: "Commercial Spaces",
    price: "High ROI Investments",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?fm=avif&w=900&q=85",
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
const bhkOptions    = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"];
const searchTabs    = ["Buy", "Rent", "Projects", "Commercial"];

// ─── Animated counter ─────────────────────────────────────────────────────────
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

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ overlaid }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`w-full z-50 transition-all duration-300 ${
        overlaid
          ? "absolute top-0 left-0 right-0 border-b border-white/10"
          : "sticky top-0 bg-white border-b border-[#E5E5E5] shadow-sm"
      }`}
      aria-label="Primary navigation"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-[62px]">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-sm"
          aria-label="PropertyBrands home"
        >
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 bg-[#C8102E] rounded-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-[18px] h-[18px] text-white" aria-hidden="true" />
            </div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#8B0000] rounded-tl-sm" aria-hidden="true" />
          </div>
          <div className="leading-none">
            <span
              className={`block font-bold text-[15.5px] tracking-tight ${overlaid ? "text-white" : "text-[#1A1A1A]"}`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              PROPERTYBRANDS
            </span>
            <span className={`block text-[9.5px] font-semibold tracking-[0.22em] uppercase mt-[2px] ${overlaid ? "text-white/60" : "text-[#C8102E]"}`}>
              Realty Services
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7" role="list">
          {["Home", "Properties", "Projects", "Developers", "Services", "About"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className={`relative group text-[13.5px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-sm ${
                  overlaid ? "text-white/80 hover:text-white" : "text-[#444] hover:text-[#C8102E]"
                }`}
              >
                {item}
                <span className="absolute -bottom-px left-0 right-0 h-[1.5px] bg-[#C8102E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTA */}
        <a
          href="tel:+919876543210"
          className={`hidden lg:flex items-center gap-2 font-semibold text-[13px] px-4 py-2 rounded-sm border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] ${
            overlaid
              ? "border-white/30 text-white hover:bg-white hover:text-[#C8102E]"
              : "border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white"
          }`}
          aria-label="Call us"
        >
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          +91 98765 43210
        </a>

        {/* Mobile hamburger */}
        <button
          className={`lg:hidden flex flex-col items-end gap-[5px] p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-sm ${overlaid ? "text-white" : "text-[#444]"}`}
          aria-label="Open menu"
        >
          <span className="w-5 h-[1.5px] bg-current" />
          <span className="w-4 h-[1.5px] bg-current" />
          <span className="w-5 h-[1.5px] bg-current" />
        </button>
      </div>
    </motion.nav>
  );
}

// ─── Hero search card (dark, overlaid on image) ───────────────────────────────
function HeroSearchCard() {
  const [activeTab,    setActiveTab]    = useState("Buy");
  const [location,     setLocation]     = useState("");
  const [budget,       setBudget]       = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bhk,          setBhk]          = useState("");

  return (
    <div className="w-full bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 rounded-sm overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
      {/* Tabs */}
      <div className="flex border-b border-white/10" role="tablist" aria-label="Search intent">
        {searchTabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-3.5 text-[13px] font-semibold tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[#C8102E] ${
              activeTab === tab ? "text-white" : "text-white/45 hover:text-white/75"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.span
                layoutId="heroTab"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C8102E]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10">
        {/* Location */}
        <div className="flex-[1.4] relative">
          <label htmlFor="hero-location" className="sr-only">Location</label>
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8102E]" aria-hidden="true" />
          <input
            id="hero-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, locality or landmark"
            className="w-full h-[52px] pl-10 pr-4 bg-transparent text-white placeholder-white/40 text-[13.5px] focus:outline-none focus:bg-white/5 transition-colors"
          />
        </div>

        {/* Budget */}
        <div className="flex-1 relative">
          <label htmlFor="hero-budget" className="sr-only">Budget</label>
          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8102E]" aria-hidden="true" />
          <select
            id="hero-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full h-[52px] pl-10 pr-7 appearance-none bg-transparent text-[13.5px] text-white focus:outline-none focus:bg-white/5 transition-colors [&>option]:bg-[#1A1A1A] [&>option]:text-white"
          >
            <option value="" disabled>Budget</option>
            {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Property Type */}
        <div className="flex-1 relative">
          <label htmlFor="hero-type" className="sr-only">Property Type</label>
          <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8102E]" aria-hidden="true" />
          <select
            id="hero-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full h-[52px] pl-10 pr-7 appearance-none bg-transparent text-[13.5px] text-white focus:outline-none focus:bg-white/5 transition-colors [&>option]:bg-[#1A1A1A] [&>option]:text-white"
          >
            <option value="" disabled>Property Type</option>
            {propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35 pointer-events-none" aria-hidden="true" />
        </div>

        {/* BHK */}
        <div className="flex-1 relative">
          <label htmlFor="hero-bhk" className="sr-only">BHK Type</label>
          <Bed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8102E]" aria-hidden="true" />
          <select
            id="hero-bhk"
            value={bhk}
            onChange={(e) => setBhk(e.target.value)}
            className="w-full h-[52px] pl-10 pr-7 appearance-none bg-transparent text-[13.5px] text-white focus:outline-none focus:bg-white/5 transition-colors [&>option]:bg-[#1A1A1A] [&>option]:text-white"
          >
            <option value="" disabled>BHK Type</option>
            {bhkOptions.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Search button */}
        <motion.button
          type="button"
          whileHover={{ backgroundColor: "#a50d26" }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 bg-[#C8102E] text-white font-bold px-8 h-[52px] text-[13.5px] tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] whitespace-nowrap"
          aria-label="Search Properties"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Search Properties
        </motion.button>
      </div>
    </div>
  );
}

// ─── Property showcase carousel ───────────────────────────────────────────────
function PropertyShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % propertyHighlights.length), 4500);
    return () => clearInterval(t);
  }, []);

  const card = propertyHighlights[active];

  return (
    <div className="relative w-full h-full min-h-[420px] overflow-hidden">
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

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/85 via-[#1A1A1A]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/30 to-transparent" />

      {/* Live badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-sm shadow">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-[#222] tracking-wide">248 listings today</span>
      </div>

      {/* Bottom card */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="inline-block text-[10px] font-extrabold tracking-[0.16em] uppercase text-[#C8102E] bg-white px-2 py-0.5 mb-2">
            {card.tag}
          </span>
          <h3 className="text-white font-bold text-xl leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {card.title}
          </h3>
          <p className="text-white/80 text-sm mt-1 font-semibold">{card.price}</p>
          <p className="text-white/50 text-[11px] mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {card.location}
          </p>
        </motion.div>

        {/* Type pills + dots */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {propertyHighlights.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setActive(i)}
                className={`text-[11px] font-semibold px-3 py-1 border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  i === active
                    ? "bg-[#C8102E] text-white border-[#C8102E]"
                    : "bg-white/10 text-white/60 border-white/20 hover:bg-white/20 hover:text-white"
                }`}
                aria-label={`View ${p.title}`}
              >
                {p.title}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {propertyHighlights.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  i === active ? "w-5 h-1.5 bg-[#C8102E]" : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats row ────────────────────────────────────────────────────────────────
function StatsRow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border-t border-[#E5E5E5] bg-white"
      aria-label="Company statistics"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E5E5]">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.08 + i * 0.07 }}
            whileHover={{ backgroundColor: "#FFF5F5" }}
            className="flex items-center gap-4 py-6 px-5 lg:px-8 transition-colors duration-150 cursor-default"
          >
            <div className="w-9 h-9 rounded-sm border border-[#C8102E]/15 bg-[#C8102E]/5 flex items-center justify-center flex-shrink-0">
              <stat.icon className="w-4 h-4 text-[#C8102E]" aria-hidden="true" />
            </div>
            <div>
              <p
                className="text-[#1A1A1A] font-extrabold text-2xl leading-none tabular-nums"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1800} />
              </p>
              <p className="text-[#888] text-[12px] mt-1 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Trust bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div className="bg-[#1A1A1A]" role="list" aria-label="Trust indicators">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-2 py-3">
        {trustItems.map((item) => (
          <div key={item} role="listitem" className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C8102E] flex-shrink-0" aria-hidden="true" />
            <span className="text-white/75 text-[12px] font-medium tracking-wide">{item}</span>
          </div>
        ))}
        <div className="flex items-center gap-2" role="listitem">
          <BadgeCheck className="w-3.5 h-3.5 text-[#C8102E] flex-shrink-0" aria-hidden="true" />
          <span className="text-white/75 text-[12px] font-medium tracking-wide">RERA Compliant</span>
        </div>
      </div>
    </div>
  );
}

// ─── Hero (main export) ───────────────────────────────────────────────────────
export default function Hero() {
  return (
    <>
      {/* ── Navbar overlaid on hero image ──────────────────────────────────────── */}
      <Navbar overlaid />

      <main style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ══════════════════════════════════════════════════════════════════════
            HERO — full-bleed dark background with search card (MagicBricks style)
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex flex-col"
          aria-label="Hero section"
        >
          {/* Background — AVIF luxury cityscape */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1460317442991-0ec209397118?fm=avif&w=1920&q=85"
              alt="Luxury residential cityscape"
              className="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
            />
            {/* Primary dark overlay */}
            <div className="absolute inset-0 bg-[#1A1A1A]/72" />
            {/* Subtle red warmth at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/25 via-transparent to-transparent" />
          </div>

          {/* Navbar space (navbar is absolute) */}
          <div className="h-[62px] flex-shrink-0" aria-hidden="true" />

          {/* ── Hero content ─────────────────────────────────────────────────── */}
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            <div className="max-w-7xl mx-auto px-5 lg:px-8 w-full py-16 lg:py-24">

              {/* Text block — centred, large, editorial */}
              <div className="max-w-3xl mx-auto text-center mb-12">
                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 mb-5"
                >
                  <span className="w-5 h-[1.5px] bg-[#C8102E]" aria-hidden="true" />
                  <span className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/70">
                    Trusted PropTech Platform
                  </span>
                  <span className="w-5 h-[1.5px] bg-[#C8102E]" aria-hidden="true" />
                </motion.div>

                {/* Main heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="text-white leading-[1.08] tracking-tight mb-5"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                    fontWeight: 800,
                  }}
                >
                  Your Trusted{" "}
                  <span className="text-[#C8102E]">Search Partner</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.52, delay: 0.18 }}
                  className="text-white/65 text-[15.5px] leading-[1.75] mx-auto max-w-2xl"
                >
                  PropertyBrands Realty Services is a technology-driven real estate platform connecting homebuyers,
                  investors, developers, landlords, tenants, architects, interior designers, and service providers
                  through a seamless digital ecosystem.
                </motion.p>

                {/* Taglines */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.48, delay: 0.25 }}
                  className="flex flex-col items-center gap-1 mt-5"
                >
                  <p
                    className="text-[#C8102E] font-bold text-[14.5px] tracking-[0.18em] uppercase"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Discover. Invest. Build. Grow.
                  </p>
                  <p className="text-white/40 text-[12.5px] tracking-[0.14em] font-medium">
                    Compare · Discuss · Decide
                  </p>
                </motion.div>
              </div>

              {/* Search card — dark, overlaid */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
                className="max-w-5xl mx-auto"
              >
                <HeroSearchCard />
              </motion.div>

              {/* CTA buttons row */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.42 }}
                className="flex flex-wrap items-center justify-center gap-3 mt-7"
              >
                <motion.button
                  whileHover={{ backgroundColor: "#a50d26" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-[#C8102E] text-white font-bold px-6 py-3 text-[13.5px] tracking-wide shadow-[0_2px_14px_rgba(200,16,46,0.45)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Explore Properties"
                >
                  <Home className="w-4 h-4" aria-hidden="true" />
                  Explore Properties
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </motion.button>

                {[
                  { icon: Calendar,   label: "Schedule Site Visit" },
                  { icon: Calculator, label: "Calculate EMI"       },
                  { icon: Phone,      label: "Talk to an Expert"   },
                ].map(({ icon: Icon, label }) => (
                  <motion.button
                    key={label}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 border border-white/25 text-white/85 font-semibold px-5 py-3 text-[13.5px] tracking-wide transition-all duration-150 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </motion.button>
                ))}
              </motion.div>

              {/* Trust indicators row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.52 }}
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8"
                role="list"
                aria-label="Trust indicators"
              >
                {trustItems.map((item) => (
                  <div key={item} role="listitem" className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8102E] flex-shrink-0" aria-hidden="true" />
                    <span className="text-white/60 text-[12.5px] font-medium">{item}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── Bottom strip: right-side showcase teaser ────────────────────── */}
          <div className="relative z-10 border-t border-white/8 bg-[#1A1A1A]/60 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-5 lg:px-8 py-3">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-white/40 text-[11px] font-semibold tracking-[0.16em] uppercase flex-shrink-0">
                  Featured Projects
                </span>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {propertyHighlights.map((p) => (
                    <div key={p.title} className="flex items-center gap-2.5 bg-white/8 border border-white/10 px-3.5 py-2 flex-shrink-0 hover:bg-white/12 transition-colors cursor-pointer group">
                      <img src={p.img} alt={p.title} className="w-8 h-8 object-cover flex-shrink-0" />
                      <div>
                        <p className="text-white text-[12px] font-semibold leading-tight group-hover:text-[#C8102E] transition-colors">{p.title}</p>
                        <p className="text-white/45 text-[10.5px]">{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────────────────────────────────── */}
        <StatsRow />

        {/* ── Trust bar ──────────────────────────────────────────────────────── */}
        <TrustBar />
      </main>
    </>
  );
}
