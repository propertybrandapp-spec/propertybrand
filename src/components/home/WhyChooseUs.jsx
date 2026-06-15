import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BadgeCheck,
  Sparkles,
  TrendingUp,
  Handshake,
  Network,
  UserCircle2,
  HeartHandshake,
  Landmark,
  ArrowRight,
  Phone,
  CheckCircle2,
  Shield,
  Star,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Verified Property Listings",
    desc: "Access carefully verified listings with complete documentation checks for greater transparency and buyer confidence.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Property Discovery",
    desc: "Our intelligent recommendation engine surfaces properties matched to your budget, lifestyle, and investment goals.",
  },
  {
    icon: TrendingUp,
    title: "Expert Investment Advisory",
    desc: "Seasoned advisors provide data-backed guidance to help you identify high-yield opportunities across markets.",
  },
  {
    icon: Handshake,
    title: "End-to-End Transaction Support",
    desc: "From shortlisting to registration, our team manages every stage so nothing falls through the cracks.",
  },
  {
    icon: Network,
    title: "Trusted Developer Network",
    desc: "We partner exclusively with RERA-registered developers who meet our quality and delivery track record standards.",
  },
  {
    icon: UserCircle2,
    title: "Dedicated Relationship Managers",
    desc: "A single point of contact who understands your brief and stays with you from enquiry through possession.",
  },
  {
    icon: HeartHandshake,
    title: "Post-Sales Assistance",
    desc: "Ongoing support with registration, interiors, and society onboarding well after the agreement is signed.",
  },
  {
    icon: Landmark,
    title: "Home Loan Support",
    desc: "Receive expert assistance in choosing the right financing solution, with connections to 15+ leading lenders.",
  },
];

const TRUST_ITEMS = [
  { icon: BadgeCheck, text: "Verified Listings" },
  { icon: Shield,     text: "Expert Advisory"   },
  { icon: Landmark,   text: "Home Loan Support" },
  { icon: TrendingUp, text: "Investment Assistance" },
];

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────

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

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ feature, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const Icon = feature.icon;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.48, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group relative bg-white border border-slate-200 hover:border-[#0F4C81]/25 rounded-sm overflow-hidden hover:shadow-[0_8px_28px_rgba(15,76,129,0.1)] transition-all duration-250 cursor-default focus-within:ring-2 focus-within:ring-[#0F4C81] focus-within:ring-offset-2"
      aria-label={feature.title}
    >
      {/* Signature element — amber left-edge stripe */}
      {/* Renders at 38% height at rest, animates to full on hover via CSS group */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-400 origin-top transition-transform duration-300 ease-out scale-y-[0.38] group-hover:scale-y-100"
        aria-hidden="true"
      />

      <div className="px-5 pt-5 pb-6 flex flex-col gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-sm bg-[#0F4C81]/7 group-hover:bg-[#0F4C81]/12 flex items-center justify-center flex-shrink-0 transition-colors duration-200">
          <Icon
            style={{ width: "18px", height: "18px" }}
            className="text-[#0F4C81]"
            aria-hidden="true"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5">
          <h3
            className="text-[#0F172A] font-bold text-[14px] leading-snug group-hover:text-[#0F4C81] transition-colors duration-200"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {feature.title}
          </h3>
          <p className="text-slate-500 text-[12.5px] leading-relaxed">
            {feature.desc}
          </p>
        </div>

        {/* Arrow — appears on hover */}
        <div className="flex items-center gap-1 mt-auto pt-1">
          <span className="text-[11px] font-semibold text-[#0F4C81] opacity-0 group-hover:opacity-100 transition-opacity duration-200 tracking-wide">
            Learn more
          </span>
          <ArrowRight
            className="w-3 h-3 text-[#0F4C81] opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200"
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.article>
  );
}

// ─── Trust Banner ─────────────────────────────────────────────────────────────

function TrustBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#0F172A] rounded-sm overflow-hidden"
      aria-label="Trust indicators"
      role="list"
    >
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
        {TRUST_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.text}
              role="listitem"
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              className="group flex items-center gap-3 px-8 py-5 flex-1 min-w-[180px] justify-center sm:justify-start hover:bg-white/4 transition-colors duration-150 cursor-default"
            >
              <CheckCircle2
                className="w-4 h-4 text-amber-400 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-white/85 text-[13px] font-semibold tracking-wide">
                {item.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── CTA Card ────────────────────────────────────────────────────────────────

function CtaCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.52, delay: 0.1 }}
      className="relative bg-[#0F4C81] rounded-sm overflow-hidden"
      aria-label="Call to action"
    >
      {/* Amber top-edge accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-400" aria-hidden="true" />

      {/* Subtle texture — diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <div className="relative px-8 py-10 sm:py-11 flex flex-col sm:flex-row sm:items-center justify-between gap-7">
        {/* Text */}
        <div className="flex flex-col gap-2 max-w-xl">
          {/* Star rating — social proof */}
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
            ))}
            <span className="text-white/60 text-[11px] ml-1.5 font-medium">
              Trusted by 1,000+ clients across India
            </span>
          </div>

          <h3
            className="text-white font-bold leading-tight"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(1.2rem, 2.5vw, 1.55rem)",
            }}
          >
            Ready to Make Smarter Real Estate Decisions?
          </h3>
          <p className="text-white/70 text-[14px] leading-relaxed">
            Connect with our experts for personalised property solutions and investment guidance.
          </p>
        </div>

        {/* Button group */}
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <motion.a
            href="#contact"
            whileHover={{ backgroundColor: "#fff", color: "#0F4C81" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#0F172A] font-bold px-7 py-3 rounded-sm text-[13.5px] tracking-wide shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F4C81]"
            aria-label="Talk to an expert"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Talk to an Expert
          </motion.a>

          <motion.a
            href="#properties"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-semibold px-6 py-3 rounded-sm text-[13.5px] tracking-wide transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F4C81]"
            aria-label="Browse properties"
          >
            Browse Properties
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── WhyChooseUs (main export) ────────────────────────────────────────────────

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="bg-[#F8FAFC] py-20 lg:py-28"
      aria-labelledby="why-heading"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex flex-col gap-12">

        {/* ── Section header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="flex flex-col gap-4 max-w-2xl">
            {/* Eyebrow */}
            <Reveal delay={0}>
              <div className="flex items-center gap-2">
                <span className="w-6 h-[1.5px] bg-amber-400" aria-hidden="true" />
                <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#0F4C81]">
                  Why Choose Propertybrands?
                </span>
              </div>
            </Reveal>

            {/* Heading */}
            <Reveal delay={0.07}>
              <h2
                id="why-heading"
                className="text-[#0F172A] leading-[1.1] tracking-tight"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "clamp(1.85rem, 3.8vw, 2.65rem)",
                  fontWeight: 800,
                }}
              >
                Why Choose{" "}
                <span className="text-[#0F4C81]">PropertyBrands?</span>
              </h2>
            </Reveal>

            {/* Sub-copy */}
            <Reveal delay={0.12}>
              <p className="text-slate-500 text-[15px] leading-[1.78]">
                Eight reasons India's most discerning homebuyers, investors, and
                developers choose to work with us — and keep coming back.
              </p>
            </Reveal>
          </div>

          {/* Right-aligned rating pill — desktop only */}
          <Reveal delay={0.15} className="hidden lg:block flex-shrink-0">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-[12px] text-slate-500 font-medium">
                4.9 / 5 from 1,000+ verified clients
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Feature grid ───────────────────────────────────────────────────── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          role="list"
          aria-label="Our key advantages"
        >
          {FEATURES.map((feature, i) => (
            <div role="listitem" key={feature.title}>
              <FeatureCard
                feature={feature}
                delay={0.05 + Math.floor(i / 4) * 0.08 + (i % 4) * 0.06}
              />
            </div>
          ))}
        </div>

        {/* ── Thin rule ──────────────────────────────────────────────────────── */}
        <Reveal delay={0.05}>
          <div className="border-t border-slate-200" aria-hidden="true" />
        </Reveal>

        {/* ── Trust banner ───────────────────────────────────────────────────── */}
        <Reveal delay={0.08}>
          <TrustBanner />
        </Reveal>

        {/* ── CTA card ───────────────────────────────────────────────────────── */}
        <CtaCard />
      </div>
    </section>
  );
}
