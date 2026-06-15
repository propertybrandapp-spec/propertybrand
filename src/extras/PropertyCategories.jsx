import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Home,
  Building2,
  Trees,
  Briefcase,
  ShoppingBag,
  Factory,
  ArrowRight,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const RESIDENTIAL = [
  {
    id: "apartments",
    icon: Home,
    title: "Apartments",
    subtitle: "Residential",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85",
    items: [
      "Ready-to-Move Apartments",
      "Under Construction Projects",
      "Luxury Apartments",
      "Affordable Housing",
      "Low-Rise Communities",
      "Gated Communities",
    ],
    featured: true, // large hero card
  },
  {
    id: "villas",
    icon: Home,
    title: "Villas & Row Houses",
    subtitle: "Residential",
    img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=85",
    items: [
      "Premium Villas",
      "Duplex Homes",
      "Independent Houses",
    ],
    featured: false,
  },
  {
    id: "plots",
    icon: Trees,
    title: "Plotted Developments",
    subtitle: "Residential",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=85",
    items: [
      "Residential Plots",
      "Farmhouses",
      "Township Plots",
      "Investment Plots",
    ],
    featured: false,
  },
];

const COMMERCIAL = [
  {
    id: "offices",
    icon: Briefcase,
    title: "Office Spaces",
    subtitle: "Commercial",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=85",
    items: [
      "Corporate Offices",
      "Managed Workspaces",
      "Business Centers",
    ],
  },
  {
    id: "retail",
    icon: ShoppingBag,
    title: "Retail Spaces",
    subtitle: "Commercial",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85",
    items: [
      "Shops",
      "Showrooms",
      "High Street Retail",
    ],
  },
  {
    id: "industrial",
    icon: Factory,
    title: "Industrial Properties",
    subtitle: "Commercial",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=85",
    items: [
      "Warehouses",
      "Industrial Sheds",
      "Logistics Parks",
    ],
  },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero residential card (large, left-spanning) ─────────────────────────────

function FeaturedCard({ card, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = card.icon;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-slate-200 hover:border-[#0F4C81]/30 bg-white hover:shadow-[0_12px_40px_rgba(15,76,129,0.13)] transition-all duration-300 h-full cursor-default"
      aria-label={`${card.title} — ${card.subtitle}`}
    >
      {/* Signature amber left-edge bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[4px] bg-amber-400 z-10"
        aria-hidden="true"
      />

      {/* Image */}
      <div className="relative h-64 lg:h-72 overflow-hidden flex-shrink-0">
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-[#0F172A]/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm">
          <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#0F4C81]">
            {card.subtitle}
          </span>
        </div>

        {/* Title overlay on image */}
        <div className="absolute bottom-4 left-6 right-4 flex items-end gap-3">
          <div className="w-9 h-9 rounded-sm bg-amber-400 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Icon className="text-white" style={{ width: 17, height: 17 }} aria-hidden="true" />
          </div>
          <div>
            <h3
              className="text-white font-bold text-xl leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {card.title}
            </h3>
            <p className="text-white/65 text-[11px] font-medium mt-0.5">
              {card.items.length} property types
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 p-6 pl-8 flex-1">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4" role="list">
          {card.items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-slate-600 text-[13px] leading-snug">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2">
          <motion.a
            href="#"
            whileHover={{ gap: "10px" }}
            className="inline-flex items-center gap-2 text-[#0F4C81] font-bold text-[13px] tracking-wide group/link focus:outline-none focus-visible:underline"
            aria-label={`Explore ${card.title}`}
          >
            Explore {card.title}
            <ArrowRight
              className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-150"
              aria-hidden="true"
            />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Compact residential card (stacked right) ─────────────────────────────────

function CompactCard({ card, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = card.icon;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group relative flex overflow-hidden rounded-sm border border-slate-200 hover:border-[#0F4C81]/30 bg-white hover:shadow-[0_8px_28px_rgba(15,76,129,0.1)] transition-all duration-300 cursor-default h-full"
      aria-label={`${card.title} — ${card.subtitle}`}
    >
      {/* Image panel */}
      <div className="relative w-36 flex-shrink-0 overflow-hidden">
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#0F4C81]/8 group-hover:bg-[#0F4C81]/14 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
            <Icon className="text-[#0F4C81]" style={{ width: 15, height: 15 }} aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-amber-500 block">
              {card.subtitle}
            </span>
            <h3
              className="text-[#0F172A] font-bold text-[14.5px] leading-tight group-hover:text-[#0F4C81] transition-colors duration-200"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {card.title}
            </h3>
          </div>
        </div>

        <ul className="flex flex-col gap-1.5" role="list">
          {card.items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-[#0F4C81]/50 flex-shrink-0" aria-hidden="true" />
              <span className="text-slate-500 text-[12px] leading-snug truncate">{item}</span>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="mt-auto inline-flex items-center gap-1 text-[#0F4C81] font-semibold text-[12px] hover:gap-2 transition-all duration-150 focus:outline-none focus-visible:underline"
          aria-label={`Explore ${card.title}`}
        >
          Explore
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

// ─── Commercial card (dark theme) ─────────────────────────────────────────────

function CommercialCard({ card, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = card.icon;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-[#0F172A] hover:border-amber-400/60 bg-[#0F172A] hover:shadow-[0_10px_36px_rgba(15,23,42,0.35)] transition-all duration-300 cursor-default"
      aria-label={`${card.title} — ${card.subtitle}`}
    >
      {/* Image with dark overlay */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-[1.04] transition-all duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 right-3 border border-amber-400/40 px-2.5 py-1 rounded-sm">
          <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-amber-400">
            {card.subtitle}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm border border-white/10 bg-white/6 flex items-center justify-center flex-shrink-0 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 transition-all duration-200">
            <Icon className="text-amber-400" style={{ width: 17, height: 17 }} aria-hidden="true" />
          </div>
          <h3
            className="text-white font-bold text-[15px] leading-snug"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {card.title}
          </h3>
        </div>

        <ul className="flex flex-col gap-2" role="list">
          {card.items.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-white/60 text-[12.5px] leading-snug">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-1 border-t border-white/8">
          <a
            href="#"
            className="mt-3 inline-flex items-center gap-1.5 text-amber-400 font-semibold text-[12.5px] hover:gap-3 transition-all duration-150 focus:outline-none focus-visible:underline"
            aria-label={`Explore ${card.title}`}
          >
            Explore {card.title}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

// ─── CTA strip ────────────────────────────────────────────────────────────────

function CtaStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative bg-white border border-slate-200 rounded-sm overflow-hidden"
      aria-label="Property discovery call to action"
    >
      {/* Top amber accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-400" aria-hidden="true" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-7 px-8 py-10">
        {/* Text */}
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-500">
              Property Discovery
            </span>
          </div>
          <h3
            className="text-[#0F172A] font-bold leading-tight"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(1.2rem, 2.5vw, 1.55rem)",
            }}
          >
            Looking for the Right Property?
          </h3>
          <p className="text-slate-500 text-[14px] leading-relaxed">
            Connect with our experts to discover properties aligned with your goals and budget.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <motion.a
            href="#"
            whileHover={{ backgroundColor: "#0d3f6e" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 bg-[#0F4C81] text-white font-bold px-7 py-3 rounded-sm text-[13.5px] tracking-wide shadow-[0_2px_12px_rgba(15,76,129,0.22)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
            aria-label="Explore all properties"
          >
            <Building2 className="w-4 h-4" aria-hidden="true" />
            Explore Properties
          </motion.a>

          <motion.a
            href="#"
            whileHover={{ borderColor: "#0F4C81", color: "#0F4C81" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-600 font-semibold px-6 py-3 rounded-sm text-[13.5px] tracking-wide hover:bg-slate-50 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
            aria-label="Talk to a property expert"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Talk to an Expert
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PropertyCategories (main export) ────────────────────────────────────────

export default function PropertyCategories() {
  return (
    <section
      id="properties"
      className="bg-[#F8FAFC] py-20 lg:py-28"
      aria-labelledby="properties-heading"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col gap-12">

        {/* ── Section header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex flex-col gap-4 max-w-2xl">
            <Reveal delay={0}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-[1.5px] bg-amber-400" aria-hidden="true" />
                <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#0F4C81]">
                  Property Listings
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <h2
                id="properties-heading"
                className="text-[#0F172A] leading-[1.1] tracking-tight"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(1.85rem, 3.8vw, 2.65rem)",
                  fontWeight: 800,
                }}
              >
                Discover Properties{" "}
                <span className="text-[#0F4C81]">for Every Need</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-slate-500 text-[15px] leading-[1.78]">
                Explore residential, commercial, plotted developments, and investment
                opportunities tailored to your goals.
              </p>
            </Reveal>
          </div>

          {/* View all link — desktop */}
          <Reveal delay={0.14} className="hidden lg:block flex-shrink-0">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-[#0F4C81] font-semibold text-[13.5px] hover:gap-3 transition-all duration-150 focus:outline-none focus-visible:underline"
              aria-label="View all property listings"
            >
              View All Listings
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        {/* ── Residential block ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {/* Block label */}
          <Reveal delay={0.05}>
            <div className="flex items-center gap-3">
              <span
                className="text-[12px] font-bold tracking-[0.16em] uppercase text-slate-400"
              >
                A — Residential Properties
              </span>
              <div className="flex-1 h-px bg-slate-200" aria-hidden="true" />
            </div>
          </Reveal>

          {/*
            Asymmetric editorial grid:
            Desktop: [Featured hero card (col 1)] | [Villas + Plots stacked (col 2)]
            Tablet/Mobile: stacked single column
          */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 items-stretch">
            {/* Featured hero card */}
            <FeaturedCard card={RESIDENTIAL[0]} delay={0.1} />

            {/* Compact cards stacked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <CompactCard card={RESIDENTIAL[1]} delay={0.16} />
              <CompactCard card={RESIDENTIAL[2]} delay={0.22} />
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────────── */}
        <Reveal delay={0.04}>
          <div className="border-t border-slate-200" aria-hidden="true" />
        </Reveal>

        {/* ── Commercial block ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {/* Block label */}
          <Reveal delay={0.05}>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-slate-400">
                B — Commercial Properties
              </span>
              <div className="flex-1 h-px bg-slate-200" aria-hidden="true" />
            </div>
          </Reveal>

          {/* Three equal dark cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMERCIAL.map((card, i) => (
              <CommercialCard key={card.id} card={card} delay={0.08 + i * 0.08} />
            ))}
          </div>
        </div>

        {/* ── CTA strip ─────────────────────────────────────────────────────── */}
        <CtaStrip />
      </div>
    </section>
  );
}
