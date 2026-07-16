import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    title: "House Planning",
    desc: "Vaastu-compliant floor plans, structural layouts, and 3D elevation designs tailored to your plot size and family needs.",
    tag: "Starts at ₹8/sqft",
    tagColor: "#2C9DD5",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=500&h=320&fit=crop",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Residential Design",
    desc: "Complete interior design for homes and apartments — space planning, material selection, lighting, and furniture layout.",
    tag: "Starts at ₹150/sqft",
    tagColor: "#E87C02",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&h=320&fit=crop",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3zm0 6h18M9 9v12" />
      </svg>
    ),
    title: "Modular Kitchen Design",
    desc: "Custom modular kitchens with optimized storage, premium finishes, and appliance integration — designed around how you cook.",
    tag: "Starts at ₹1,20,000",
    tagColor: "#4ade80",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&h=320&fit=crop",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 4h16v16H4V4z" />
      </svg>
    ),
    title: "Interior Packages",
    desc: "Bundled turnkey packages covering false ceiling, wardrobes, painting, and furnishing — one team, one timeline, one bill.",
    tag: "Starts at ₹4,99,000",
    tagColor: "#a78bfa",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&h=320&fit=crop",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Free Consultation", desc: "Share your space, budget, and style preferences with our design team." },
  { step: "02", title: "Design & Quote", desc: "Get detailed 3D layouts, material options, and a transparent itemized quote." },
  { step: "03", title: "Execution", desc: "Vetted contractors execute the plan with weekly progress updates and site visits." },
  { step: "04", title: "Handover", desc: "Final walkthrough, snag-list resolution, and handover with warranty on workmanship." },
];

const PACKAGES = [
  {
    name: "Essential",
    price: "₹1.5L – ₹3L",
    desc: "Modular kitchen or 1-2 room makeover",
    features: ["Space planning", "Modular kitchen or wardrobe", "Basic false ceiling", "2 design revisions"],
    highlighted: false,
  },
  {
    name: "Complete Home",
    price: "₹4.5L – ₹9L",
    desc: "Full 2-3 BHK interior design",
    features: ["Full home space planning", "Modular kitchen + all wardrobes", "False ceiling & lighting design", "Premium material options", "Unlimited design revisions", "Dedicated project manager"],
    highlighted: true,
  },
  {
    name: "Luxury",
    price: "Custom Quote",
    desc: "Villas, duplexes & premium residences",
    features: ["Everything in Complete Home", "Custom furniture design", "Smart home integration", "Imported material sourcing", "Landscape & facade design"],
    highlighted: false,
  },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=400&h=300&fit=crop",
];

// ── Main Export ───────────────────────────────────────────────────────────────
export default function ArchitectsDesign({ onNavigate }) {
  const [activePackage, setActivePackage] = useState("Complete Home");

  return (
    <div style={{ background: "#FFFFFF" }}>

      {/* ── Hero ── */}
      <section className="px-4 py-16 lg:py-20 text-center" style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #EAF4FB 100%)" }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
          style={{ background: "#FFFFFF", color: "#2C9DD5", border: "1px solid #2C9DD5" }}
        >
          Architects &amp; Interior Design
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#15191C" }}>
          Design Your <span style={{ color: "#2C9DD5" }}>Dream Space</span>
        </h1>
        <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: "#495057" }}>
          From house planning to move-in-ready interiors — work with vetted architects and designers, all coordinated through one team.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <button
            onClick={() => onNavigate && onNavigate("contact", "other")}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#5C0B03"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#BA0D0B"}
          >
            Get a Free Consultation
          </button>
          <a
            href="#packages"
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#FFFFFF", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
          >
            View Packages
          </a>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-14 space-y-16">

        {/* ── Services ── */}
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold" style={{ color: "#15191C" }}>What We Offer</h2>
            <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "#2C9DD5"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E5E8EB"}>
                <div className="h-40 overflow-hidden">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2" style={{ color: s.tagColor }}>
                    {s.icon}
                    <h3 className="text-base font-bold" style={{ color: "#15191C" }}>{s.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: "#495057" }}>{s.desc}</p>
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${s.tagColor}15`, color: s.tagColor, border: `1px solid ${s.tagColor}30` }}>
                    {s.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Process ── */}
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold" style={{ color: "#15191C" }}>How It Works</h2>
            <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS_STEPS.map((p) => (
              <div key={p.step} className="rounded-2xl p-6" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
                <span className="text-3xl font-black" style={{ color: "#2C9DD5", opacity: 0.3 }}>{p.step}</span>
                <h3 className="text-sm font-bold mt-2 mb-1.5" style={{ color: "#15191C" }}>{p.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#495057" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Gallery ── */}
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold" style={{ color: "#15191C" }}>Recent Work</h2>
            <div className="w-10 h-0.5 rounded-full mt-2" style={{ background: "#2C9DD5" }} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {GALLERY.map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden h-40">
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Packages ── */}
        <div id="packages">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold" style={{ color: "#15191C" }}>Interior Packages</h2>
            <div className="w-10 h-0.5 rounded-full mt-2 mx-auto" style={{ background: "#2C9DD5" }} />
            <p className="text-sm mt-3" style={{ color: "#495057" }}>Transparent, all-inclusive pricing — no hidden costs.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                onClick={() => setActivePackage(pkg.name)}
                className="rounded-2xl p-7 cursor-pointer transition-all duration-200"
                style={{
                  background: pkg.highlighted ? "#15191C" : "#FFFFFF",
                  border: pkg.highlighted ? "1px solid #15191C" : activePackage === pkg.name ? "1.5px solid #2C9DD5" : "1px solid #E5E8EB",
                  transform: pkg.highlighted ? "scale(1.03)" : "scale(1)",
                }}
              >
                {pkg.highlighted && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ background: "#2C9DD5", color: "#FFFFFF" }}>
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold mb-1" style={{ color: pkg.highlighted ? "#FFFFFF" : "#15191C" }}>{pkg.name}</h3>
                <p className="text-xs mb-4" style={{ color: pkg.highlighted ? "#D6DADD" : "#495057" }}>{pkg.desc}</p>
                <p className="text-2xl font-extrabold mb-5" style={{ color: pkg.highlighted ? "#FFFFFF" : "#2C9DD5" }}>{pkg.price}</p>
                <div className="space-y-2.5 mb-6">
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm" style={{ color: pkg.highlighted ? "#EAF4FB" : "#495057" }}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke={pkg.highlighted ? "#2C9DD5" : "#2C9DD5"} strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate && onNavigate("contact", "other"); }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: pkg.highlighted ? "#2C9DD5" : "#EAF4FB", color: pkg.highlighted ? "#FFFFFF" : "#2C9DD5" }}
                >
                  Get a Quote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
          <p className="text-lg font-bold" style={{ color: "#15191C" }}>Not sure where to start?</p>
          <p className="text-sm mt-1 mb-5" style={{ color: "#495057" }}>Talk to a design consultant — it's free, and there's no obligation.</p>
          <button
            onClick={() => onNavigate && onNavigate("contact", "other")}
            className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#5C0B03"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#BA0D0B"}
          >
            Talk to a Design Consultant
          </button>
        </div>

      </div>
    </div>
  );
}
