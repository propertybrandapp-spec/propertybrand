import { useState, useEffect } from "react";
import { fetchHeroContent } from "../lib/siteContent";

export default function AdvertisementBanner({ onNavigate }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchHeroContent().then(({ data }) => {
      if (!cancelled && data) setContent(data);
    });
    return () => { cancelled = true; };
  }, []);

  const bannerData = {
    badge: content?.promoBadge || "Exclusive Launch Offer",
    title: content?.promoHeading || "Premium Luxury Residences & High-Yield Commercial Spaces",
    subtitle: content?.promoEyebrow || "Discover vetted RERA-approved developments with flexible payment plans and guaranteed appreciation.",
    image: content?.promoImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    ctaLabel: content?.promoCtaLabel || "Explore Featured Deals",
    ctaLink: content?.promoCtaLinkValue || "search",
  };

  return (
    <section className="max-w-7xl mx-auto px-4 my-10">
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-900 text-white"
        style={{ minHeight: "220px" }}
      >
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={bannerData.image}
            alt="Advertisement Banner"
            className="w-full h-full object-cover opacity-30 transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {bannerData.badge}
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
              {bannerData.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {bannerData.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => onNavigate && onNavigate(bannerData.ctaLink || "search")}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#1565C0] hover:bg-[#0D47A1] text-white shadow-lg transition-all duration-300 text-center cursor-pointer"
            >
              {bannerData.ctaLabel}
            </button>
            <button
              onClick={() => onNavigate && onNavigate("contact", "expert")}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 text-center cursor-pointer"
            >
              Contact Advisory
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
