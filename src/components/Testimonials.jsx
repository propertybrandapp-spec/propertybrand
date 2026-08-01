import { useState, useEffect, useRef } from "react";
import { fetchClientReviews } from "../lib/siteContent";
import { Smile, Home, MapPin, Briefcase } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Happy Clients", value: 15000, suffix: "+", icon: Smile },
  { label: "Properties Listed", value: 12400, suffix: "+", icon: Home },
  { label: "Cities Covered", value: 28, suffix: "+", icon: MapPin },
  { label: "Expert Advisors", value: 320, suffix: "+", icon: Briefcase },
];

// Shown until real reviews are added in the admin console ("Site Content" → Client Reviews)
const DEMO_TESTIMONIALS = [
  {
    id: 1,
    name: "Rakesh Gupta",
    role: "Home Buyer",
    location: "Bhubaneswar",
    avatar: "RG",
    avatarBg: "from-blue-500 to-blue-700",
    rating: 5,
    category: "Home Buyers",
    text: "PropertyBrands made my dream of owning a home in Bhubaneswar a reality. Their team guided me through every step — from shortlisting to loan approval and registration. The relationship manager was always available and incredibly patient. Couldn't have done it without them!",
    property: "3 BHK Flat, Patia",
    date: "March 2025",
    verified: true,
  },
  {
    id: 2,
    name: "Neha Singhania",
    role: "NRI Investor",
    location: "Dubai → Bhubaneswar",
    avatar: "NS",
    avatarBg: "from-[#1E88E5] to-[#1565C0]",
    rating: 5,
    category: "NRIs",
    text: "As an NRI, I was skeptical about investing in Indian real estate remotely. PropertyBrands' NRI desk handled everything — property visits, legal checks, loan paperwork, and registration — while I stayed in Dubai. The transparency and communication were exceptional.",
    property: "Commercial Space, Main Road",
    date: "April 2025",
    verified: true,
  },
  {
    id: 3,
    name: "Suresh Mahato",
    role: "First-Time Buyer",
    location: "Jamshedpur",
    avatar: "SM",
    avatarBg: "from-emerald-500 to-emerald-700",
    rating: 5,
    category: "Home Buyers",
    text: "I had no idea how to begin buying a home. The team at PropertyBrands sat with me for hours, explained RERA, home loans, and legal processes. They found me the perfect 2 BHK within my budget. The free site visit cab was a wonderful touch!",
    property: "2 BHK Apartment, Old Town",
    date: "February 2025",
    verified: true,
  },
  {
    id: 4,
    name: "Anita Poddar",
    role: "Interior Design Client",
    location: "Bhubaneswar",
    avatar: "AP",
    avatarBg: "from-violet-500 to-violet-700",
    rating: 5,
    category: "Home Buyers",
    text: "After buying my apartment through PropertyBrands, I also used their interior design service. The 3D visualization was spot on and the execution was flawless. Everything was delivered on time and within the Premium Package budget. Absolutely love my new home!",
    property: "Interior Design, Ashok Nagar",
    date: "May 2025",
    verified: true,
  },
  {
    id: 5,
    name: "Vikram Agarwal",
    role: "Real Estate Investor",
    location: "Kolkata → Bhubaneswar",
    avatar: "VA",
    avatarBg: "from-amber-500 to-amber-700",
    rating: 5,
    category: "Investors",
    text: "I've invested in 4 properties through PropertyBrands over the past 2 years. Their investment advisory team identified micro-markets that have given me over 22% appreciation. The ROI calculator and corridor analysis reports are genuinely useful tools.",
    property: "4 Residential Plots, Rasulgarh",
    date: "January 2025",
    verified: true,
  },
  {
    id: 6,
    name: "Manish Tiwari",
    role: "Developer Partner",
    location: "Bhubaneswar",
    avatar: "MT",
    avatarBg: "from-slate-500 to-slate-700",
    rating: 5,
    category: "Developers",
    text: "We partnered with PropertyBrands for the marketing and sales management of our Nayapalli project. Their channel partner network and digital marketing team sold 68% of units within 3 months of launch. Professional, results-driven, and highly recommended.",
    property: "Project: Emerald Heights",
    date: "March 2025",
    verified: true,
  },
  {
    id: 7,
    name: "Priya Das",
    role: "Corporate Client",
    location: "Bhubaneswar",
    avatar: "PD",
    avatarBg: "from-teal-500 to-teal-700",
    rating: 5,
    category: "Corporate Clients",
    text: "Our company needed 5 office spaces across Bhubaneswar for our expansion. PropertyBrands' commercial team presented tailored options within our budget and timelines. They also handled lease agreements and tenant verification seamlessly.",
    property: "Office Spaces, Bhubaneswar CBD",
    date: "April 2025",
    verified: true,
  },
  {
    id: 8,
    name: "Arvind Sharma",
    role: "Property Seller",
    location: "Bhubaneswar",
    avatar: "AS",
    avatarBg: "from-indigo-500 to-indigo-700",
    rating: 4,
    category: "Investors",
    text: "Sold my old apartment through PropertyBrands in just 3 weeks at a great price. Their property valuation was accurate and the buyer pool they had access to was impressive. The documentation support saved me a lot of time.",
    property: "2 BHK, Saheed Nagar",
    date: "May 2025",
    verified: true,
  },
];

// Fallback category list shown while reviews are still loading; once loaded,
// the categories shown are derived from the actual review data (see below),
// so any category an admin types in "Site Content" → Client Reviews works.
const DEFAULT_CATEGORY_FILTERS = ["All", "Home Buyers", "Investors", "NRIs", "Developers", "Corporate Clients"];

const PARTNER_LOGOS = [
  { name: "SBI", image: "/partners/sbi.svg" },
  { name: "HDFC Bank", image: "/partners/hdfc.svg" },
  { name: "ICICI Bank", image: "/partners/icici.svg" },
  { name: "Axis Bank", image: "/banks/axis.webp" },
  { name: "LIC Housing Finance", image: "/banks/lic.svg" },
  { name: "RERA", image: "/partners/rera.png" },
  { name: "National Housing Bank", image: "/partners/nhb.webp"},
  { name: "CREDAI", image: "/partners/credai.png" },
];
// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function Stars({ rating, size = "sm" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`${sz} ${s <= rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-gray-200 fill-gray-200"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Testimonial Card ──────────────────────────────────────────────────────────
function TestimonialCard({ t, featured = false }) {
  return (
    <div
      className={`bg-[#FFFFFF] rounded-2xl border transition-shadow duration-200 flex flex-col h-full ${
        featured
          ? "border-[#1E88E5]/30 shadow-lg ring-1 ring-[#1E88E5]/10"
          : "border-[#E2E8F0] hover:shadow-lg hover:border-[#E2E8F0]"
      }`}
    >
      {/* Quote mark */}
      <div className="px-5 pt-5 pb-0">
        <svg className="w-8 h-8 text-[#1E88E5]/20 fill-current mb-2" viewBox="0 0 32 32">
          <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.8C7.8 11.9 9.5 10.2 11.6 10.2L10 8zm14 0c-3.314 0-6 2.686-6 6v10h10V14h-6.2c0-2.1 1.7-3.8 3.8-3.8L24 8z" />
        </svg>
        <p className={`text-sm text-[#6B7280] leading-relaxed ${featured ? "text-[#1F2937]" : ""}`}>
          "{t.text}"
        </p>
      </div>

      {/* Property tag */}
      <div className="px-5 pt-3">
        <span className="inline-flex items-center gap-1 text-[10px] bg-[#F1F5F9] text-[#6B7280] px-2.5 py-1 rounded-full font-medium">
          <svg className="w-3 h-3 text-[#1E88E5]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {t.property}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 py-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
            {t.avatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-[#1F2937]">{t.name}</p>
              {t.verified && (
                <svg className="w-3.5 h-3.5 text-blue-500 fill-blue-500" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-[11px] text-[#6B7280]">{t.role} · {t.location}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <Stars rating={t.rating} />
          <p className="text-[10px] text-[#6B7280] mt-0.5">{t.date}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Testimonials({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [current, setCurrent] = useState(0);
  const [reviews, setReviews] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    fetchClientReviews().then(({ data }) => {
      if (!cancelled) setReviews(data && data.length > 0 ? data : DEMO_TESTIMONIALS);
    });
    return () => { cancelled = true; };
  }, []);

  const TESTIMONIALS = reviews || DEMO_TESTIMONIALS;
  const CATEGORY_FILTERS = reviews
    ? ["All", ...new Set(TESTIMONIALS.map((t) => t.category).filter(Boolean))]
    : DEFAULT_CATEGORY_FILTERS;

  const filtered =
    activeFilter === "All"
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.category === activeFilter);

  // Auto-rotate featured testimonial
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % filtered.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [filtered.length]);

  useEffect(() => {
    setCurrent(0);
  }, [activeFilter]);

  return (
    <section className="bg-[#FFFFFF] py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* ── Stats Counter ── */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top_right,_rgba(30,136,229,0.08),_transparent_35%),linear-gradient(to_bottom_right,#ffffff,#f8fafc)] p-8 md:p-10 shadow-lg">

  {/* Decorative Glow */}
  <div className="absolute -top-20 -right-20 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

  <div className="relative">
    
    {/* Heading */}
    <div className="text-center mb-10">
      <span className="text-[#1E88E5] text-xs font-bold uppercase tracking-widest">
        Our Impact
      </span>

      <h2 className="mt-2 text-3xl font-extrabold text-[#1F2937]">
        Trusted by Thousands Across India
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        Numbers that reflect our commitment to excellence and customer satisfaction
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-3 flex justify-center">
            <span className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#EFF6FF" }}>
              <stat.icon className="w-6 h-6" style={{ color: "#1E88E5" }} strokeWidth={2} />
            </span>
          </div>

          <div className="text-3xl font-extrabold text-[#1E88E5] tracking-tight">
            <AnimatedCounter
              target={stat.value}
              suffix={stat.suffix}
            />
          </div>

          <div className="mt-2 text-sm font-medium text-slate-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>

  </div>
</div>

        {/* ── Testimonials ── */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">What Our Clients Say</h2>
              <div className="w-10 h-0.5 bg-[#1E88E5] rounded-full mt-1" />
              <p className="text-[#6B7280] text-sm mt-1">Real stories from real people</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F1F5F9] border border-[#E2E8F0] px-3 py-1.5 rounded-full shrink-0">
              <svg className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-[#1F2937]">4.9</span>
              <span className="text-xs text-[#6B7280]">/ 5 · 1200+ reviews</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: "none" }}>
            {CATEGORY_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  activeFilter === f
                    ? "bg-[#1E88E5] text-white border-[#1E88E5] shadow-sm"
                    : "bg-[#FFFFFF] text-[#6B7280] border-[#E2E8F0] hover:border-[#1E88E5] hover:text-[#1E88E5]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Featured testimonial */}
          {filtered[current] && (
            <div className="mb-6">
              <TestimonialCard t={filtered[current]} featured />
              {/* Dot nav */}
              <div className="flex justify-center gap-2 mt-4">
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all ${
                      i === current
                        ? "w-6 h-2 bg-[#1E88E5]"
                        : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Grid of remaining */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered
              .filter((_, i) => i !== current)
              .slice(0, 6)
              .map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
          </div>
        </div>

        {/* ── Partner Logos ── */}
        <div className="border-t border-[#E2E8F0] pt-10">
          <p className="text-center text-sm font-semibold text-[#6B7280] uppercase tracking-widest mb-6">
            Our Trusted Partners & Accreditations
          </p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {PARTNER_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center justify-center bg-white rounded-xl border border-[#E2E8F0] h-24 p-4 hover:shadow-lg transition-all duration-300"
>
  <img
    src={logo.image}
    alt={logo.name}
    className="max-h-12 max-w-full object-contain"
    loading="lazy"
  />
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="text-center py-6">
          <p className="text-[#6B7280] text-sm mb-4">
            Join thousands of happy clients who found their dream property with us
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => onNavigate && onNavigate("search")} className="bg-[#1E88E5] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#1565C0] transition shadow-sm">
              Explore Properties
            </button>
            <button onClick={() => onNavigate && onNavigate("contact")} className="bg-[#FFFFFF] text-[#1E88E5] font-bold px-6 py-3 rounded-lg border-2 border-[#1E88E5] hover:bg-[#EFF6FF] transition">
              Talk to an Expert
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
