import { useState, useRef } from "react";

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

const PROPERTIES = [
  {
    id: 1,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&h=320&fit=crop",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=320&fit=crop",
    ],
    badge: "Owner",
    badgeColor: "bg-[#16a34a]",
    type: "Apartments",
    title: "3 BHK Flat",
    price: "₹2.40 Cr",
    area: "1865 sqft",
    location: "Harmu Housing Colony, Ranchi",
    amenities: ["Lift", "Power Backup", "Security", "Parking"],
    postedBy: "Owner",
    postedDays: 2,
    imgCount: 20,
    verified: true,
    featured: false,
  },
  {
    id: 2,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=320&fit=crop",
    ],
    badge: "New",
    badgeColor: "bg-[#BA0D0B]",
    type: "Villas",
    title: "4 BHK Villa",
    price: "₹3.80 Cr",
    area: "3200 sqft",
    location: "Kanke Road, Ranchi",
    amenities: ["Swimming Pool", "Garden", "Security", "Club House"],
    postedBy: "Builder",
    postedDays: 1,
    imgCount: 15,
    verified: true,
    featured: true,
  },
  {
    id: 3,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=320&fit=crop",
    ],
    badge: "Budget",
    badgeColor: "bg-blue-600",
    type: "Budget Homes",
    title: "1 BHK Flat",
    price: "₹42 Lac",
    area: "605 sqft",
    location: "Lalpur, Ranchi",
    amenities: ["Lift", "Parking", "Power Backup"],
    postedBy: "Agent",
    postedDays: 5,
    imgCount: 8,
    verified: false,
    featured: false,
  },
  {
    id: 4,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=320&fit=crop",
    ],
    badge: "Owner",
    badgeColor: "bg-[#16a34a]",
    type: "Apartments",
    title: "3 BHK Flat",
    price: "₹1.10 Cr",
    area: "1400 sqft",
    location: "Ashok Nagar, Ranchi",
    amenities: ["Gym", "Lift", "Security", "Parking"],
    postedBy: "Owner",
    postedDays: 3,
    imgCount: 11,
    verified: true,
    featured: false,
  },
  {
    id: 5,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=320&fit=crop",
    ],
    badge: "New",
    badgeColor: "bg-[#BA0D0B]",
    type: "New Projects",
    title: "2 BHK Apartment",
    price: "₹68 Lac",
    area: "1050 sqft",
    location: "Morabadi, Ranchi",
    amenities: ["Lift", "Power Backup", "CCTV", "Parking"],
    postedBy: "Builder",
    postedDays: 0,
    imgCount: 22,
    verified: true,
    featured: true,
  },
  {
    id: 6,
    images: [
      "https://images.unsplash.com/photo-1448630360428-65456885c650?w=500&h=320&fit=crop",
    ],
    badge: "Plot",
    badgeColor: "bg-[#E87C02]",
    type: "Plots",
    title: "Residential Plot",
    price: "₹85 Lac",
    area: "2400 sqft",
    location: "Argora, Ranchi",
    amenities: ["Corner Plot", "Main Road", "Gated"],
    postedBy: "Owner",
    postedDays: 7,
    imgCount: 6,
    verified: false,
    featured: false,
  },
  {
    id: 7,
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=320&fit=crop",
    ],
    badge: "Commercial",
    badgeColor: "bg-purple-600",
    type: "Commercial",
    title: "Office Space",
    price: "₹1.50 Cr",
    area: "2200 sqft",
    location: "Main Road, Ranchi",
    amenities: ["Lift", "Parking", "24x7 Security", "Power Backup"],
    postedBy: "Builder",
    postedDays: 4,
    imgCount: 14,
    verified: true,
    featured: false,
  },
  {
    id: 8,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=320&fit=crop",
    ],
    badge: "Luxury",
    badgeColor: "bg-yellow-600",
    type: "Luxury",
    title: "5 BHK Luxury Villa",
    price: "₹7.20 Cr",
    area: "6500 sqft",
    location: "Golf Course Road, Ranchi",
    amenities: ["Private Pool", "Home Theatre", "Smart Home", "Spa"],
    postedBy: "Builder",
    postedDays: 2,
    imgCount: 34,
    verified: true,
    featured: true,
  },
];

// ── Heart / Wishlist Button ────────────────────────────────────────────────────
function HeartBtn({ id }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setLiked(!liked);
      }}
      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#FFFFFF]/90 backdrop-blur flex items-center justify-center shadow hover:scale-110 transition z-10"
    >
      <svg
        className={`w-3.5 h-3.5 transition-colors ${liked ? "fill-red-500 text-red-500" : "fill-none text-[#5B6670]"}`}
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
function PropertyCard({ property }) {
  const {
    id, images, imgCount, badge, badgeColor,
    title, price, area, location,
    amenities, postedBy, postedDays,
    verified, featured,
  } = property;

  return (
    <div className="relative bg-[#FFFFFF] rounded-xl border border-[#E5E8EB] hover:shadow-xl transition-shadow duration-200 cursor-pointer group flex-shrink-0 w-64">
      {featured && (
        <div className="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-[#2C9DD5] to-yellow-400 rounded-t-xl z-10" />
      )}

      <ImageCarousel
        images={images}
        imgCount={imgCount}
        badge={badge}
        badgeColor={badgeColor}
      />
      <HeartBtn id={id} />

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
          <span className="text-xs text-[#5B6670] font-medium">|</span>
          <span className="text-xs text-[#5B6670] font-medium">{area}</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-1 mb-2.5">
          <svg className="w-3 h-3 text-[#2C9DD5] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] text-[#5B6670] leading-tight">{location}</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-[10px] bg-[#F2F4F6] text-[#5B6670] px-1.5 py-0.5 rounded font-medium">
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
          <div className="text-[11px] text-[#5B6670]">
            By <span className="font-semibold text-[#5B6670]">{postedBy}</span>
            {" · "}
            {postedDays === 0 ? "Today" : `${postedDays}d ago`}
          </div>
          <button className="flex items-center gap-1 text-[11px] font-bold text-[#2C9DD5] hover:underline">
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
function SectionHeader({ title, seeAllLabel = "See all Properties" }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-bold text-[#15191C]">{title}</h2>
        <div className="w-10 h-0.5 bg-[#2C9DD5] rounded-full mt-1" />
      </div>
      <a href="#" className="flex items-center gap-1 text-sm font-semibold text-[#2C9DD5] hover:underline">
        {seeAllLabel}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

// ── Scroll Row ────────────────────────────────────────────────────────────────
function ScrollRow({ properties }) {
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
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E8EB] shadow-lg flex items-center justify-center text-[#5B6670] hover:text-[#2C9DD5] hover:border-[#2C9DD5] opacity-0 group-hover/row:opacity-100 transition"
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
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E5E8EB] shadow-lg flex items-center justify-center text-[#5B6670] hover:text-[#2C9DD5] hover:border-[#2C9DD5] opacity-0 group-hover/row:opacity-100 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PopularProperties() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? PROPERTIES
      : PROPERTIES.filter((p) => p.type === activeFilter);

  const ownerProperties = filtered.filter((p) => p.postedBy === "Owner");
  const builderProperties = filtered.filter((p) => p.postedBy === "Builder");

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
                  : "bg-[#FFFFFF] text-[#5B6670] border-[#D6DADD] hover:border-[#2C9DD5] hover:text-[#2C9DD5]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Owner Properties Row ── */}
        {ownerProperties.length > 0 && (
          <div className="mb-10">
            <SectionHeader title="Popular Owner Properties" />
            <ScrollRow properties={ownerProperties} />
          </div>
        )}

        {/* ── Builder / Featured Projects Row ── */}
        {builderProperties.length > 0 && (
          <div className="mb-10">
            <SectionHeader title="Featured Projects" seeAllLabel="See all Projects" />
            <ScrollRow properties={builderProperties} />
          </div>
        )}

        {/* ── All Properties (fallback when filter shows mixed) ── */}
        {ownerProperties.length === 0 && builderProperties.length === 0 && (
          <div className="mb-10">
            <SectionHeader title={`${activeFilter} Properties`} />
            <div className="text-center py-16 text-[#5B6670]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="text-sm font-medium">No properties found for this filter.</p>
            </div>
          </div>
        )}

        {/* ── Bottom CTA Banner ── */}
        <div className="rounded-2xl bg-gradient-to-r from-[#2C9DD5] to-[#5C0B03] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg leading-tight">
              Not finding what you're looking for?
            </p>
            <p className="text-[#5B6670] text-sm mt-0.5">
              Talk to our property experts for personalized recommendations.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="bg-[#FFFFFF] text-[#2C9DD5] text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#F2F4F6] transition shadow">
              Schedule Site Visit
            </button>
            <button className="bg-[#FFFFFF]/20 text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#FFFFFF]/30 transition border border-white/40">
              Talk to Expert
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
