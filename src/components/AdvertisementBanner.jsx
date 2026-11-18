import React, { useState, useEffect } from "react";
import { fetchBanners } from "../lib/siteContent";

export default function AdvertisementBanner({ placement = "home", onNavigate }) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchBanners(placement).then(({ data }) => {
      if (!cancelled && data && data.length > 0) {
        setBanners(data);
        setCurrentIndex(0);
      }
    });
    return () => { cancelled = true; };
  }, [placement]);

  // Auto rotate if multiple banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const b = banners[currentIndex] || banners[0];

  function handleCtaClick() {
    if (!onNavigate) return;
    if (b.linkType === "url" && b.linkValue) {
      window.open(b.linkValue, "_blank", "noopener,noreferrer");
    } else {
      onNavigate(b.linkValue || "search");
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 my-8">
      <div
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl bg-slate-950 text-white transition-all duration-500"
        style={{ minHeight: "220px" }}
      >
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          {b.image && (
            <img
              key={b.id || currentIndex}
              src={b.image}
              alt={b.title}
              className="w-full h-full object-cover opacity-35 transform hover:scale-105 transition-all duration-1000 ease-out"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {b.badge || "Sponsored"}
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
              {b.title}
            </h2>
            {b.subtitle && (
              <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {b.subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={handleCtaClick}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#1565C0] hover:bg-[#0D47A1] text-white shadow-lg transition-all duration-300 text-center cursor-pointer"
            >
              {b.cta || "Explore Now"}
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("contact", "Ad Inquiry")}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 text-center cursor-pointer"
            >
              Advertise Here
            </button>
          </div>
        </div>

        {/* Slide navigation dots if multiple banners */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
            {banners.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? "w-6 bg-amber-400" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
