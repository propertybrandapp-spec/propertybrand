import { useState, useRef, useEffect } from "react";
import { useSavedItems } from "../lib/SavedItemsContext";
import { fetchPublicListings } from "../lib/listings";

// ── Data ──────────────────────────────────────────────────────────────────────

const FILTER_TABS = [
  "All",
  "Apartments",
  "Villas",
  "Plots",
  "Commercial",
  "Budget Homes",
  "Luxury",
  "New Projects",
];

// ── Heart / Wishlist Button ────────────────────────────────────────────────────
function HeartBtn({ property }) {
  const { isPropertySaved, toggleSaveProperty } = useSavedItems();
  const liked = isPropertySaved(property.dbId || property.id);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSaveProperty(property);
      }}
      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#FFFFFF]/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition z-10"
    >
      <svg
        className={`w-3.5 h-3.5 transition-colors ${liked ? "fill-red-500 text-red-500" : "fill-none text-[#495057]"}`}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

// ── Image Carousel ────────────────────────────────────────────────────────────
function ImageCarousel({ images, imgCount, badge, badgeColor }) {
  const [current, setCurrent] = useState(0);

  function prev(e) {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }
  function next(e) {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  }

  return (
    <div className="relative w-full h-44 overflow-hidden rounded-t-xl group/img bg-[#F2F4F6]">
      <img
        src={images[current]}
        alt="property"
        className="w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Prev / Next - only if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFFFFF]/50 text-white text-xs flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFFFFF]/50 text-white text-xs flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition"
          >
            ›
          </button>
        </>
      )}

      {/* Image count pill */}
      <div className="absolute bottom-2 left-2.5 flex items-center gap-1 bg-[#FFFFFF]/60 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        {imgCount}
      </div>

      {/* Badge */}
      <span className={`absolute top-2.5 left-2.5 ${badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
        {badge}
      </span>
    </div>
  );
}

// ── Property Card ─────────────────────────────────────────────────────────────
function PropertyCard({ property, onOpen, onNavigate }) {
  const {
    id, images, imgCount, badge, badgeColor,
    title, price, area, location,
    amenities, postedBy, postedDays,
    verified, featured,
  } = property;

  return (
    <div
      onClick={() => onOpen && onOpen(property)}
      className="relative bg-[#FFFFFF] rounded-xl border border-[#E5E8EB] hover:shadow-xl transition-shadow duration-200 cursor-pointer group flex-shrink-0 w-64"
    >
      {featured && (
        <div className="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-[#2C9DD5] to-yellow-400 rounded-t-xl z-10" />
      )}

      <ImageCarousel
        images={images}
        imgCount={imgCount}
        badge={badge}
        badgeColor={badgeColor}
      />
      <HeartBtn property={property} />

      <div className="p-3.5">
        {/* Title + Price */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-[#15191C] leading-tight">{title}</h3>
          {verified && (
            <span className="shrink-0 flex items-center gap-0.5 text-[10px] text-[#4ade80] font-bold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Price + Area */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-extrabold text-[#15191C]">{price}</span>
          <span className="text-xs text-[#495057] font-medium">|</span>
          <span className="text-xs text-[#495057] font-medium">{area}</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-1 mb-2.5">
          <svg className="w-3 h-3 text-[#2C9DD5] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-[#495057] leading-tight">{location}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-[10px] bg-[#F2F4F6] text-[#495057] px-1.5 py-0.5 rounded font-medium">
              {a}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="text-[10px] text-[#2C9DD5] font-semibold px-1">
              +{amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#E5E8EB]">
          <div className="text-[11px] text-[#495057]">
            By <span className="font-semibold text-[#495057]">{postedBy}</span>
            {" · "}
            {postedDays === 0 ? "Today" : `${postedDays}d ago`}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate && onNavigate("contact", "buy"); }}
            className="flex items-center gap-1 text-[11px] font-bold text-[#2C9DD5] hover:underline"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
            </svg>
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ title, seeAllLabel = "See all Properties", onNavigate }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-bold text-[#15191C]">{title}</h2>
        <div className="w-10 h-0.5 bg-[#2C9DD5] rounded-full mt-1" />
      </div>
      <button onClick={() => onNavigate && onNavigate("search")} className="flex items-center gap-1 text-sm font-semibold text-[#2C9DD5] hover:underline">
        {seeAllLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ── Scroll Row ────────────────────────────────────────────────────────────────
function ScrollRow({ properties, onOpen, onNavigate }) {
  const rowRef = useRef(null);

  function scroll(dir) {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  return (
    <div className="relative group/row">
      {/* Left arrow */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E8EB] shadow-lg flex items-center justify-center text-[#495057] hover:text-[#2C9DD5] hover:border-[#2C9DD5] opacity-0 group-hover/row:opacity-100 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable list */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} onOpen={onOpen} onNavigate={onNavigate} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E8EB] shadow-lg flex items-center justify-center text-[#495057] hover:text-[#2C9DD5] hover:border-[#2C9DD5] opacity-0 group-hover/row:opacity-100 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PopularProperties({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [listings, setListings] = useState(null); // null = loading, [] = loaded but empty

  useEffect(() => {
    let cancelled = false;
    fetchPublicListings().then(({ data }) => {
      if (!cancelled) setListings(data);
    });
    return () => { cancelled = true; };
  }, []);

  const ALL_PROPERTIES = listings || [];
  const isLoading = listings === null;

  function matchesFilter(p, tab) {
    if (tab === "All") return true;
    if (tab === "Apartments") return p.type === "Apartment";
    if (tab === "Villas") return p.type === "Villa";
    if (tab === "Plots") return p.type === "Plot";
    if (tab === "Commercial") return p.type === "Commercial";
    if (tab === "Budget Homes") return p.tags?.includes("Affordable");
    if (tab === "Luxury") return p.tags?.includes("Luxury");
    if (tab === "New Projects") return p.postedBy === "Builder";
    return true;
  }

  const filtered = ALL_PROPERTIES.filter((p) => matchesFilter(p, activeFilter));

  const ownerProperties = filtered.filter((p) => p.postedBy === "Owner");
  const builderProperties = filtered.filter((p) => p.postedBy === "Builder" || p.postedBy === "Agent");

  function openProperty(property) {
    onNavigate && onNavigate("property-detail", { property, pool: ALL_PROPERTIES });
  }

  return (
    <section className="bg-[#FFFFFF] py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-8 pb-1"
          style={{ scrollbarWidth: "none" }}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeFilter === tab
                  ? "bg-[#2C9DD5] text-white border-[#2C9DD5] shadow"
                  : "bg-[#FFFFFF] text-[#495057] border-[#D6DADD] hover:border-[#2C9DD5] hover:text-[#2C9DD5]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-hidden mb-10">
            {[1, 2, 3, 4].map((i) => <div key={i} className="w-64 h-72 rounded-xl shrink-0 animate-pulse" style={{ background: "#F2F4F6" }} />)}
          </div>
        ) : ALL_PROPERTIES.length === 0 ? (
          <div className="mb-10 rounded-2xl flex flex-col items-center justify-center py-16 text-center" style={{ background: "#F7F8FA", border: "1px solid #E5E8EB" }}>
            <span className="text-4xl mb-3">🏠</span>
            <p className="text-sm font-bold" style={{ color: "#15191C" }}>No properties listed yet</p>
            <p className="text-xs mt-1 mb-4" style={{ color: "#495057" }}>Be the first to list a property on PropertyBrands.</p>
            <button onClick={() => onNavigate && onNavigate("post-property")} className="text-xs font-bold px-4 py-2 rounded-lg" style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
              Post a Property
            </button>
          </div>
        ) : (
          <>
            {/* ── Owner Properties Row ── */}
            {ownerProperties.length > 0 && (
              <div className="mb-10">
                <SectionHeader title="Popular Owner Properties" onNavigate={onNavigate} />
                <ScrollRow properties={ownerProperties} onOpen={openProperty} onNavigate={onNavigate} />
              </div>
            )}

            {/* ── Builder / Featured Projects Row ── */}
            {builderProperties.length > 0 && (
              <div className="mb-10">
                <SectionHeader title="Featured Projects" seeAllLabel="See all Projects" onNavigate={onNavigate} />
                <ScrollRow properties={builderProperties} onOpen={openProperty} onNavigate={onNavigate} />
              </div>
            )}

            {/* ── No results for this specific filter ── */}
            {ownerProperties.length === 0 && builderProperties.length === 0 && (
              <div className="mb-10">
                <SectionHeader title={`${activeFilter} Properties`} onNavigate={onNavigate} />
                <div className="text-center py-16 text-[#495057]">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <p className="text-sm font-medium">No properties found for this filter.</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Bottom CTA Banner ── */}
        <div className="rounded-3xl bg-[radial-gradient(circle_at_top_right,_rgba(186,13,11,0.08),_transparent_35%),linear-gradient(to_bottom_right,#ffffff,#f8fafc)] border border-slate-200 shadow-lg p-8 flex flex-col sm:flex-row items-center justify-between gap-6">

    <div>
      <p className="text-[#15191C] font-bold text-2xl leading-tight">
        Not finding what you're looking for?
      </p>

      <p className="text-slate-600 text-sm mt-2 max-w-xl">
        Connect with our property experts and get personalized recommendations
        based on your budget, preferred location, and investment goals.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
      
      <button className="bg-[#BA0D0B] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#990A09] transition-all duration-300 shadow-md hover:shadow-lg">
        Schedule Site Visit
      </button>

      <button className="bg-white border border-slate-300 text-[#15191C] text-sm font-semibold px-6 py-3 rounded-xl hover:border-[#BA0D0B] hover:text-[#BA0D0B] transition-all duration-300">
        Talk to Expert
      </button>

    </div>

        </div>

      </div>
    </section>
  );
}
