import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Home,
  Building2,
  TrendingUp,
  KeyRound,
  Paintbrush2,
  Compass,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  BarChart3,
  Award,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: Home,
    title: "Residential Real Estate",
    sub: "Apartments, villas, plots & gated communities across India's top cities.",
    accent: false,
  },
  {
    icon: Building2,
    title: "Commercial Real Estate",
    sub: "Premium offices, retail spaces & SEZ developments for growing businesses.",
    accent: true,
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    sub: "Data-driven guidance to maximise returns on short and long-term portfolios.",
    accent: false,
  },
  {
    icon: KeyRound,
    title: "Rental Services",
    sub: "End-to-end rental management for landlords and verified tenants.",
    accent: false,
  },
  {
    icon: Paintbrush2,
    title: "Interior Design",
    sub: "Turnkey interior solutions designed around how you actually live.",
    accent: true,
  },
  {
    icon: Compass,
    title: "Architecture",
    sub: "Master planning and architectural services for residential & commercial projects.",
    accent: false,
  },
  {
    icon: ClipboardList,
    title: "Property Management",
    sub: "Comprehensive facility, tenant and revenue management under one roof.",
    accent: false,
  },
];

const STATS = [
  { icon: Home,      value: "5,000+",  label: "Properties Listed"  },
  { icon: Users,     value: "1,000+",  label: "Happy Clients"      },
  { icon: Building2, value: "200+",    label: "Developer Partners" },
  { icon: Globe,     value: "25+",     label: "Cities Covered"     },
];

const PILLARS = [
  { icon: BarChart3, text: "Market Intelligence" },
  { icon: Award,     text: "RERA Compliant"      },
  { icon: Users,     text: "Expert Network"      },
  { icon: Globe,     text: "Pan-India Reach"     },
];

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = service.icon;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`group relative flex flex-col gap-3 p-5 border rounded-sm cursor-default transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(15,76,129,0.1)] ${
        service.accent
          ? "bg-[#0F4C81] border-[#0F4C81]"
          : "bg-white border-slate-200 hover:border-[#0F4C81]/30"
      }`}
      aria-label={service.title}
    >
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${
          service.accent
            ? "bg-white/15"
            : "bg-[#0F4C81]/8 group-hover:bg-[#0F4C81]/12 transition-colors duration-200"
        }`}
      >
        <Icon
          className={`w-4.5 h-4.5 ${service.accent ? "text-white" : "text-[#0F4C81]"}`}
          style={{ width: "18px", height: "18px" }}
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div>
        <h3
          className={`font-bold text-[14px] leading-snug mb-1 ${
            service.accent ? "text-white" : "text-[#0F172A]"
          }`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {service.title}
        </h3>
        <p
          className={`text-[12.5px] leading-relaxed ${
            service.accent ? "text-white/75" : "text-slate-500"
          }`}
        >
          {service.sub}
        </p>
      </div>

      {/* Hover arrow — only on light cards */}
      {!service.accent && (
        <ArrowRight
          className="absolute bottom-4 right-4 w-3.5 h-3.5 text-[#0F4C81] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}
    </motion.article>
  );
}

// ─── Stats strip ──────────────────────────────────────────────────────────────

function StatsStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 border border-slate-200 rounded-sm bg-white overflow-hidden"
      aria-label="Company statistics"
    >
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.07, ease: "easeOut" }}
            className="flex flex-col items-start gap-1 px-5 py-5 group"
          >
            <Icon
              className="w-4 h-4 text-amber-500 mb-1"
              aria-hidden="true"
            />
            <span
              className="text-[#0F172A] font-extrabold text-2xl leading-none tabular-nums"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              aria-label={`${stat.value} ${stat.label}`}
            >
              {stat.value}
            </span>
            <span className="text-slate-500 text-[11.5px] font-medium leading-tight">
              {stat.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── AboutUs (main export) ────────────────────────────────────────────────────

export default function AboutUs() {
  return (
    <section
      id="about"
      className="bg-[#F8FAFC] py-20 lg:py-28"
      aria-labelledby="about-heading"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">

        {/* ── Two-column layout ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 lg:gap-20 items-start">

          {/* ── LEFT — Content ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">

            {/* Eyebrow */}
            <Reveal delay={0}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-[1.5px] bg-amber-400" aria-hidden="true" />
                <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#0F4C81]">
                  About Us
                </span>
              </div>
            </Reveal>

            {/* Heading block — editorial left-rule treatment */}
            <Reveal delay={0.07}>
              <div className="flex gap-5">
                {/* Vertical rule — the signature device */}
                <div className="w-[3px] flex-shrink-0 bg-[#0F4C81] self-stretch rounded-full" aria-hidden="true" />

                <div className="flex flex-col gap-5">
                  <h2
                    id="about-heading"
                    className="text-[#0F172A] leading-[1.1] tracking-tight"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "clamp(1.9rem, 4vw, 2.75rem)",
                      fontWeight: 800,
                    }}
                  >
                    Who We Are
                  </h2>

                  <p className="text-slate-600 text-[15px] leading-[1.8]">
                    PropertyBrands Realty Services is a next-generation PropTech company
                    offering end-to-end real estate solutions across residential, commercial,
                    plotted developments, investment advisory, project marketing, sales
                    management, rental services, interior design, architecture, and property
                    management.
                  </p>

                  <p className="text-slate-500 text-[14.5px] leading-[1.8]">
                    We combine technology, market intelligence, and an extensive network of
                    developers and channel partners to help customers make informed real
                    estate decisions.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Pillars — what we stand on */}
            <Reveal delay={0.14}>
              <ul
                className="grid grid-cols-2 gap-x-6 gap-y-3"
                role="list"
                aria-label="Our strengths"
              >
                {PILLARS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-sm bg-[#0F4C81]/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#0F4C81]" aria-hidden="true" />
                    </div>
                    <span className="text-[13px] font-medium text-slate-600">{text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Trust line */}
            <Reveal delay={0.18}>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {[
                  "RERA Registered",
                  "ISO Certified Processes",
                  "Serving clients since 2015",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" aria-hidden="true" />
                    <span className="text-[12.5px] text-slate-500 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Stats strip */}
            <Reveal delay={0.22}>
              <StatsStrip />
            </Reveal>

            {/* CTA */}
            <Reveal delay={0.27}>
              <div>
                <motion.a
                  href="#contact"
                  whileHover={{ backgroundColor: "#0d3f6e", x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-[#0F4C81] text-white font-bold px-7 py-3 rounded-sm text-[13.5px] tracking-wide shadow-[0_2px_12px_rgba(15,76,129,0.28)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                  aria-label="Contact us"
                >
                  Contact Us
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.a>
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT — Service matrix ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            {/* Section label */}
            <Reveal delay={0.1}>
              <p
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-1"
              >
                What We Do
              </p>
            </Reveal>

            {/*
              Staggered matrix — not a plain equal grid.
              Row 1: 2 equal cards
              Row 2: 1 wide accent card
              Row 3: 2 equal cards
              Row 4: 1 wide card + 1 remaining
              This variation breaks the template grid pattern.
            */}

            {/* Row 1 — 2 cards */}
            <div className="grid grid-cols-2 gap-4">
              <ServiceCard service={SERVICES[0]} delay={0.12} />
              <ServiceCard service={SERVICES[1]} delay={0.18} />
            </div>

            {/* Row 2 — full-width accent card */}
            <div className="grid grid-cols-1">
              <ServiceCard service={SERVICES[2]} delay={0.22} />
            </div>

            {/* Row 3 — 2 cards */}
            <div className="grid grid-cols-2 gap-4">
              <ServiceCard service={SERVICES[3]} delay={0.26} />
              <ServiceCard service={SERVICES[4]} delay={0.30} />
            </div>

            {/* Row 4 — 2 cards */}
            <div className="grid grid-cols-2 gap-4">
              <ServiceCard service={SERVICES[5]} delay={0.34} />
              <ServiceCard service={SERVICES[6]} delay={0.38} />
            </div>

            {/* Bottom trust badge */}
            <Reveal delay={0.42}>
              <div className="flex items-center gap-3 border border-slate-200 rounded-sm bg-white px-5 py-3.5 mt-1">
                <Award className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                <p className="text-[12.5px] text-slate-500 leading-relaxed">
                  Every listing is verified. Every partner is vetted.{" "}
                  <span className="font-semibold text-[#0F172A]">
                    Your trust is our only business.
                  </span>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
