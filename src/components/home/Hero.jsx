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
  Sparkles,
  TrendingUp,
  Handshake,
} from "lucide-react";

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

const featureChips = [
  { icon: Sparkles,   label: "AI-Powered Discovery"          },
  { icon: TrendingUp, label: "Expert Investment Advisory"    },
  { icon: Handshake,  label: "End-to-End Transaction Support" },
];

// ─── Animated counter (unchanged) ─────────────────────────────────────────────
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

// ─── Navbar — white, scroll-aware (MagicBricks style) ────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.1)]" : "shadow-none border-b border-[#E5E5E5]"
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
            <Building2 className="absolute inset-0 m-auto w-[18px] h-[18px] text-white" aria-hidden="true" />
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#8B0000] rounded-tl-sm" aria-hidden="true" />
          </div>
          <div className="leading-none">
            <span
              className="block text-[#1A1A1A] font-bold text-[15.5px] tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              PROPERTYBRANDS
            </span>
            <span className="block text-[#C8102E] text-[9.5px] font-semibold tracking-[0.22em] uppercase mt-[2px]">
              Realty Services
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6" role="list">
          {["Home", "Properties", "Projects", "Developers", "Services", "About"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="relative group text-[13.5px] font-medium text-[#444] hover:text-[#C8102E] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-sm"
              >
                {item}
                <span
                  className="absolute -bottom-px left-0 right-0 h-[1.5px] bg-[#C8102E] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Right CTA */}
        <a
          href="tel:+919876543210"
          className="hidden lg:flex items-center gap-2 border border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white font-semibold text-[13px] px-4 py-2 rounded-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
          aria-label="Call us"
        >
          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
          +91 98765 43210
        </a>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col items-end gap-[5px] p-2 text-[#444] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-sm"
          aria-label="Open menu"
        >
          <span className="w-5 h-[1.5px] bg-current" />
          <span className="w-4 h-[1.5px] bg-current" />
          <span className="w-5 h-[1.5px] bg-current" />
        </button>
      </div>
    </nav>
  );
}

// ─── Search card — white, MagicBricks style ───────────────────────────────────
function SearchCard() {
  const [activeTab,    setActiveTab]    = useState("Buy");
  const [location,     setLocation]     = useState("");
  const [budget,       setBudget]       = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bhk,          setBhk]          = useState("");

  return (
    <div className="w-full bg-white shadow-[0_8px_40px_rgba(0,0,0,0.22)] overflow-hidden">
      {/* ── Intent tabs ── */}
      <div className="flex border-b border-[#E5E5E5]" role="tablist" aria-label="Search intent">
        {searchTabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 py-3.5 text-[13.5px] font-semibold tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[#C8102E] ${
              activeTab === tab ? "text-[#C8102E]" : "text-[#888] hover:text-[#444]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.span
                layoutId="heroTab"
                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#C8102E]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Fields row ── */}
      <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E5]">

        {/* Location — wider */}
        <div className="flex-[1.5] flex flex-col justify-center px-4 py-2.5 gap-0.5">
          <label htmlFor="hero-location" className="text-[10.5px] font-semibold text-[#888] uppercase tracking-[0.12em]">
            Location
          </label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-0 w-4 h-4 text-[#C8102E] flex-shrink-0" aria-hidden="true" />
            <input
              id="hero-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, locality or landmark"
              className="w-full pl-6 pr-2 h-9 bg-transparent text-[#1A1A1A] placeholder-[#BBB] text-[13.5px] font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex-1 flex flex-col justify-center px-4 py-2.5 gap-0.5">
          <label htmlFor="hero-budget" className="text-[10.5px] font-semibold text-[#888] uppercase tracking-[0.12em]">
            Budget
          </label>
          <div className="relative flex items-center">
            <IndianRupee className="absolute left-0 w-4 h-4 text-[#C8102E] flex-shrink-0 pointer-events-none" aria-hidden="true" />
            <select
              id="hero-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full pl-6 pr-5 h-9 appearance-none bg-transparent text-[13.5px] font-medium text-[#1A1A1A] focus:outline-none [&>option]:bg-white [&>option]:text-[#1A1A1A]"
            >
              <option value="" disabled>Select budget</option>
              {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="absolute right-0 w-3.5 h-3.5 text-[#AAA] pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Property Type */}
        <div className="flex-1 flex flex-col justify-center px-4 py-2.5 gap-0.5">
          <label htmlFor="hero-type" className="text-[10.5px] font-semibold text-[#888] uppercase tracking-[0.12em]">
            Property Type
          </label>
          <div className="relative flex items-center">
            <Home className="absolute left-0 w-4 h-4 text-[#C8102E] flex-shrink-0 pointer-events-none" aria-hidden="true" />
            <select
              id="hero-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full pl-6 pr-5 h-9 appearance-none bg-transparent text-[13.5px] font-medium text-[#1A1A1A] focus:outline-none [&>option]:bg-white [&>option]:text-[#1A1A1A]"
            >
              <option value="" disabled>Select type</option>
              {propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown className="absolute right-0 w-3.5 h-3.5 text-[#AAA] pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* BHK */}
        <div className="flex-1 flex flex-col justify-center px-4 py-2.5 gap-0.5">
          <label htmlFor="hero-bhk" className="text-[10.5px] font-semibold text-[#888] uppercase tracking-[0.12em]">
            BHK Type
          </label>
          <div className="relative flex items-center">
            <Bed className="absolute left-0 w-4 h-4 text-[#C8102E] flex-shrink-0 pointer-events-none" aria-hidden="true" />
            <select
              id="hero-bhk"
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
              className="w-full pl-6 pr-5 h-9 appearance-none bg-transparent text-[13.5px] font-medium text-[#1A1A1A] focus:outline-none [&>option]:bg-white [&>option]:text-[#1A1A1A]"
            >
              <option value="" disabled>Select BHK</option>
              {bhkOptions.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown className="absolute right-0 w-3.5 h-3.5 text-[#AAA] pointer-events-none" aria-hidden="true" />
          </div>
        </div>

        {/* Search button */}
        <motion.button
          type="button"
          whileHover={{ backgroundColor: "#a50d26" }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 bg-[#C8102E] text-white font-bold px-10 text-[14px] tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2 whitespace-nowrap min-h-[72px] sm:min-h-0"
          aria-label="Search Properties"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Search Properties
        </motion.button>
      </div>
    </div>
  );
}

// ─── Property showcase carousel (unchanged logic) ─────────────────────────────
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
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/85 via-[#1A1A1A]/20 to-transparent" />
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white px-3 py-1.5 shadow">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
        <span className="text-[11px] font-semibold text-[#222] tracking-wide">248 listings today</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {propertyHighlights.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setActive(i)}
                className={`text-[11px] font-semibold px-3 py-1 border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  i === active ? "bg-[#C8102E] text-white border-[#C8102E]" : "bg-white/10 text-white/60 border-white/20 hover:bg-white/20 hover:text-white"
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

// ─── Stats row (unchanged) ────────────────────────────────────────────────────
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
            <div className="w-9 h-9 border border-[#C8102E]/15 bg-[#C8102E]/5 flex items-center justify-center flex-shrink-0">
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

// ─── Trust bar (unchanged) ────────────────────────────────────────────────────
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
      <Navbar />

      {/* Spacer behind fixed navbar */}
      <div className="h-[62px]" aria-hidden="true" />

      <main style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ════════════════════════════════════════════════════════════
            HERO — Full-bleed AVIF background, MagicBricks layout
        ════════════════════════════════════════════════════════════ */}
        <section className="relative" aria-label="Hero section">

          {/* ── Background image ──────────────────────────────────── */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1460317442991-0ec209397118?fm=avif&w=1920&q=85"
              alt="Luxury residential cityscape"
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
            {/* Dark overlay — flat, not gradient-heavy */}
            <div className="absolute inset-0 bg-[#1A1A1A]/68" />
            {/* Very subtle warm bleed at the very bottom edge only */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#8B0000]/18 to-transparent" />
          </div>

          {/* ── Hero body ─────────────────────────────────────────── */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-5 lg:px-8">

              {/* ── Upper text block — large, centred ─────────────── */}
              <div className="pt-16 pb-10 lg:pt-24 lg:pb-12 text-center max-w-4xl mx-auto">

                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="inline-flex items-center gap-2 mb-6"
                >
                  <span className="w-5 h-px bg-[#C8102E]" aria-hidden="true" />
                  <span className="text-[11.5px] font-bold tracking-[0.22em] uppercase text-white/65">
                    Trusted PropTech Platform
                  </span>
                  <span className="w-5 h-px bg-[#C8102E]" aria-hidden="true" />
                </motion.div>

                {/* Main heading — larger, bolder, MagicBricks scale */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                  className="text-white tracking-tight leading-[1.06] mb-5"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "clamp(2.6rem, 6vw, 4.4rem)",
                    fontWeight: 800,
                  }}
                >
                  Your Trusted{" "}
                  <span className="text-[#C8102E]">Search Partner</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.48, delay: 0.15 }}
                  className="text-white/60 text-base lg:text-[16px] leading-[1.75] mx-auto max-w-2xl"
                >
                  PropertyBrands Realty Services is a technology-driven real estate platform connecting homebuyers,
                  investors, developers, landlords, tenants, architects, interior designers, and service providers
                  through a seamless digital ecosystem.
                </motion.p>

                {/* Taglines */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.44, delay: 0.22 }}
                  className="flex flex-col items-center gap-1 mt-4"
                >
                  <p
                    className="text-[#C8102E] font-bold text-[14px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Discover. Invest. Build. Grow.
                  </p>
                  <p className="text-white/35 text-[12px] tracking-[0.14em] font-medium">
                    Compare · Discuss · Decide
                  </p>
                </motion.div>
              </div>

              {/* ── White search card ──────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.28 }}
              >
                <SearchCard />
              </motion.div>

              {/* ── Feature chips (MagicBricks "Why us" micro-strip) ─ */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.44, delay: 0.38 }}
                className="flex flex-wrap items-center justify-center gap-3 pt-6 pb-10 lg:pb-14"
              >
                {featureChips.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#C8102E]" aria-hidden="true" />
                    <span className="text-white/80 text-[12.5px] font-medium">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── CTA buttons — below search, full-width band ────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.44, delay: 0.44 }}
              className="border-t border-white/10 bg-[#1A1A1A]/55 backdrop-blur-sm"
            >
              <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-wrap items-center justify-between gap-3 py-4">
                {/* Left — CTA buttons */}
                <div className="flex flex-wrap gap-2.5">
                  <motion.button
                    whileHover={{ backgroundColor: "#a50d26" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-[#C8102E] text-white font-bold px-5 py-2.5 text-[13px] tracking-wide shadow-[0_2px_12px_rgba(200,16,46,0.4)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    aria-label="Explore Properties"
                  >
                    <Home className="w-3.5 h-3.5" aria-hidden="true" />
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
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 border border-white/20 text-white/80 hover:text-white font-semibold px-4 py-2.5 text-[13px] tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      aria-label={label}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      {label}
                    </motion.button>
                  ))}
                </div>

                {/* Right — trust items */}
                <div
                  className="hidden lg:flex items-center gap-5"
                  role="list"
                  aria-label="Trust indicators"
                >
                  {trustItems.slice(0, 3).map((item) => (
                    <div key={item} role="listitem" className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C8102E] flex-shrink-0" aria-hidden="true" />
                      <span className="text-white/55 text-[12px] font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Stats row ──────────────────────────────────────────────── */}
        <StatsRow />

        {/* ── Trust bar ──────────────────────────────────────────────── */}
        <TrustBar />
      </main>
    </>
  );
}
