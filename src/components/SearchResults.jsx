import { useState, useRef } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const PROPERTIES = [
  {
    id: 1,
    title: "3 BHK Apartment",
    price: "₹2.40 Cr",
    priceRaw: 24000000,
    area: "1865 sqft",
    location: "Harmu Housing Colony, Ranchi",
    type: "Apartment",
    status: "Ready to Move",
    postedBy: "Owner",
    postedDays: 2,
    imgCount: 20,
    verified: true,
    featured: true,
    amenities: ["Lift", "Power Backup", "Security", "Parking", "Gym"],
    floor: "8th of 12",
    facing: "East",
    age: "2 years",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=380&fit=crop"],
    badge: "Featured",
    badgeColor: "#E87C02",
  },
  {
    id: 2,
    title: "4 BHK Villa",
    price: "₹3.80 Cr",
    priceRaw: 38000000,
    area: "3200 sqft",
    location: "Kanke Road, Ranchi",
    type: "Villa",
    status: "Under Construction",
    postedBy: "Builder",
    postedDays: 1,
    imgCount: 15,
    verified: true,
    featured: true,
    amenities: ["Swimming Pool", "Garden", "Security", "Club House", "Power Backup"],
    floor: "Ground + 1",
    facing: "North",
    age: "New",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=380&fit=crop"],
    badge: "New Launch",
    badgeColor: "#BA0D0B",
  },
  {
    id: 3,
    title: "1 BHK Flat",
    price: "₹42 Lac",
    priceRaw: 4200000,
    area: "605 sqft",
    location: "Lalpur, Ranchi",
    type: "Apartment",
    status: "Ready to Move",
    postedBy: "Agent",
    postedDays: 5,
    imgCount: 8,
    verified: false,
    featured: false,
    amenities: ["Lift", "Parking", "Power Backup"],
    floor: "3rd of 6",
    facing: "West",
    age: "5 years",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=380&fit=crop"],
    badge: "Budget",
    badgeColor: "#2C9DD5",
  },
  {
    id: 4,
    title: "3 BHK Flat",
    price: "₹1.10 Cr",
    priceRaw: 11000000,
    area: "1400 sqft",
    location: "Ashok Nagar, Ranchi",
    type: "Apartment",
    status: "Ready to Move",
    postedBy: "Owner",
    postedDays: 3,
    imgCount: 11,
    verified: true,
    featured: false,
    amenities: ["Gym", "Lift", "Security", "Parking"],
    floor: "5th of 10",
    facing: "South",
    age: "3 years",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=380&fit=crop"],
    badge: "Verified",
    badgeColor: "#4ade80",
  },
  {
    id: 5,
    title: "2 BHK Apartment",
    price: "₹68 Lac",
    priceRaw: 6800000,
    area: "1050 sqft",
    location: "Morabadi, Ranchi",
    type: "Apartment",
    status: "Under Construction",
    postedBy: "Builder",
    postedDays: 0,
    imgCount: 22,
    verified: true,
    featured: true,
    amenities: ["Lift", "Power Backup", "CCTV", "Parking", "Garden"],
    floor: "2nd of 8",
    facing: "East",
    age: "New",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=380&fit=crop"],
    badge: "New",
    badgeColor: "#BA0D0B",
  },
  {
    id: 6,
    title: "Residential Plot",
    price: "₹85 Lac",
    priceRaw: 8500000,
    area: "2400 sqft",
    location: "Argora, Ranchi",
    type: "Plot",
    status: "Ready to Move",
    postedBy: "Owner",
    postedDays: 7,
    imgCount: 6,
    verified: false,
    featured: false,
    amenities: ["Corner Plot", "Main Road", "Gated"],
    floor: "—",
    facing: "North-East",
    age: "—",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=380&fit=crop"],
    badge: "Plot",
    badgeColor: "#E87C02",
  },
  {
    id: 7,
    title: "Office Space",
    price: "₹1.50 Cr",
    priceRaw: 15000000,
    area: "2200 sqft",
    location: "Main Road, Ranchi",
    type: "Commercial",
    status: "Ready to Move",
    postedBy: "Builder",
    postedDays: 4,
    imgCount: 14,
    verified: true,
    featured: false,
    amenities: ["Lift", "Parking", "24x7 Security", "Power Backup", "Cafeteria"],
    floor: "4th of 10",
    facing: "North",
    age: "1 year",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=380&fit=crop"],
    badge: "Commercial",
    badgeColor: "#a78bfa",
  },
  {
    id: 8,
    title: "5 BHK Luxury Villa",
    price: "₹7.20 Cr",
    priceRaw: 72000000,
    area: "6500 sqft",
    location: "Golf Course Road, Ranchi",
    type: "Villa",
    status: "Ready to Move",
    postedBy: "Builder",
    postedDays: 2,
    imgCount: 34,
    verified: true,
    featured: true,
    amenities: ["Private Pool", "Home Theatre", "Smart Home", "Spa", "Garden"],
    floor: "Ground + 2",
    facing: "East",
    age: "New",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=380&fit=crop"],
    badge: "Luxury",
    badgeColor: "#E87C02",
  },
];

const PROPERTY_TYPES = ["Apartment", "Villa", "Plot", "Commercial"];
const POSSESSION = ["Ready to Move", "Under Construction"];
const POSTED_BY = ["Owner", "Builder", "Agent"];
const AMENITIES_LIST = ["Lift", "Parking", "Power Backup", "Swimming Pool", "Gym", "Garden", "Security", "Club House"];
const SORT_OPTIONS = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest First", "Area: Large to Small"];
const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];

// ── Helper ─────────────────────────────────────────────────────────────────────
function CheckBox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
        style={{
          background: checked ? "#2C9DD5" : "transparent",
          border: `1.5px solid ${checked ? "#2C9DD5" : "#D6DADD"}`,
        }}
      >
        {checked && (
          <svg className="w-2.5 h-2.5" fill="none" stroke="#FFFFFF" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-xs transition-colors" style={{ color: checked ? "#15191C" : "#495057" }}>{label}</span>
    </label>
  );
}

// ── Price Range Slider ─────────────────────────────────────────────────────────
function PriceRange({ min, max, value, onChange }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs" style={{ color: "#495057" }}>Min: <span style={{ color: "#2C9DD5" }}>₹{(value[0] / 100000).toFixed(0)} Lac</span></span>
        <span className="text-xs" style={{ color: "#495057" }}>Max: <span style={{ color: "#2C9DD5" }}>₹{value[1] >= 10000000 ? (value[1] / 10000000).toFixed(1) + " Cr" : (value[1] / 100000).toFixed(0) + " Lac"}</span></span>
      </div>
      <input type="range" min={min} max={max} step={500000}
        value={value[1]}
        onChange={e => onChange([value[0], Number(e.target.value)])}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "#2C9DD5", background: "#E5E8EB" }}
      />
    </div>
  );
}

// ── Sidebar Filters ────────────────────────────────────────────────────────────
function Sidebar({ filters, setFilters, onReset }) {
  const toggle = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  };

  const sections = [
    { title: "Property Type", key: "types", options: PROPERTY_TYPES },
    { title: "BHK", key: "bhk", options: BHK_OPTIONS },
    { title: "Possession", key: "possession", options: POSSESSION },
    { title: "Posted By", key: "postedBy", options: POSTED_BY },
    { title: "Amenities", key: "amenities", options: AMENITIES_LIST },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="rounded-2xl overflow-hidden sticky top-20" style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #E5E8EB" }}>
          <h3 className="text-sm font-bold" style={{ color: "#15191C" }}>Filters</h3>
          <button onClick={onReset} className="text-xs font-semibold transition-colors hover:underline" style={{ color: "#BA0D0B" }}>
            Reset All
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[80vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {/* Price Range */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#495057" }}>Budget</p>
            <PriceRange min={0} max={100000000} value={filters.budget}
              onChange={val => setFilters(f => ({ ...f, budget: val }))} />
          </div>

          {/* Dynamic sections */}
          {sections.map(sec => (
            <div key={sec.title}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#495057" }}>{sec.title}</p>
              <div className="space-y-2">
                {sec.options.map(opt => (
                  <CheckBox key={opt} label={opt}
                    checked={filters[sec.key]?.includes(opt)}
                    onChange={() => toggle(sec.key, opt)} />
                ))}
              </div>
            </div>
          ))}

          {/* Verified only */}
          <div style={{ borderTop: "1px solid #E5E8EB", paddingTop: "16px" }}>
            <CheckBox label="Verified Properties Only"
              checked={filters.verifiedOnly}
              onChange={() => setFilters(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))} />
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Property Card (List View) ──────────────────────────────────────────────────
function PropertyCardList({ property }) {
  const [saved, setSaved] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col sm:flex-row transition-all duration-200 group cursor-pointer"
      style={{
        background: "#FFFFFF",
        border: property.featured ? "1.5px solid #2C9DD540" : "1px solid #E5E8EB",
        boxShadow: property.featured ? "0 0 24px #2C9DD510" : "none",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#2C9DD5"}
      onMouseLeave={e => e.currentTarget.style.borderColor = property.featured ? "#2C9DD540" : "#E5E8EB"}
    >
      {/* Image */}
      <div className="relative sm:w-64 h-52 sm:h-auto shrink-0 overflow-hidden">
        <img src={property.images[imgIdx]} alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)" }} />

        {/* Badge */}
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: property.badgeColor, color: "#FFFFFF" }}>
          {property.badge}
        </span>

        {/* Save */}
        <button onClick={e => { e.stopPropagation(); setSaved(!saved); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          style={{ background: "rgba(11,11,11,0.8)" }}>
          <svg className="w-3.5 h-3.5" fill={saved ? "#BA0D0B" : "none"} stroke={saved ? "#BA0D0B" : "#FFFFFF"} strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Image count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(11,11,11,0.8)", color: "#FFFFFF" }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          {property.imgCount}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-base font-bold leading-tight group-hover:transition-colors" style={{ color: "#15191C" }}>
            {property.title}
          </h3>
          {property.verified && (
            <span className="flex items-center gap-1 text-[10px] font-bold shrink-0" style={{ color: "#4ade80" }}>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Price + Area */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xl font-extrabold" style={{ color: "#2C9DD5" }}>{property.price}</span>
          <span className="text-xs" style={{ color: "#495057" }}>|</span>
          <span className="text-sm font-medium" style={{ color: "#495057" }}>{property.area}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#2C9DD5" }}>
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs" style={{ color: "#495057" }}>{property.location}</span>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { label: property.status },
            { label: `Floor: ${property.floor}` },
            { label: `Facing: ${property.facing}` },
            { label: property.age !== "—" ? `Age: ${property.age}` : null },
          ].filter(x => x.label).map(chip => (
            <span key={chip.label} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: "#FFFFFF", color: "#495057", border: "1px solid #E5E8EB" }}>
              {chip.label}
            </span>
          ))}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {property.amenities.slice(0, 4).map(a => (
            <span key={a} className="text-[10px] px-2 py-0.5 rounded"
              style={{ background: "#EAF4FB", color: "#2C9DD5", border: "1px solid #2C9DD520" }}>
              {a}
            </span>
          ))}
          {property.amenities.length > 4 && (
            <span className="text-[10px] font-semibold" style={{ color: "#E87C02" }}>
              +{property.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid #E5E8EB" }}>
          <div className="text-xs" style={{ color: "#495057" }}>
            By <span className="font-semibold" style={{ color: "#1F242A" }}>{property.postedBy}</span>
            {" · "}
            {property.postedDays === 0 ? "Today" : `${property.postedDays}d ago`}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all"
              style={{ background: "transparent", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#2C9DD5"; e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2C9DD5"; }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
              </svg>
              Contact
            </button>
            <button className="text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all"
              style={{ background: "#BA0D0B", color: "#FFFFFF" }}
              onMouseEnter={e => e.currentTarget.style.background = "#5C0B03"}
              onMouseLeave={e => e.currentTarget.style.background = "#BA0D0B"}>
              Site Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Property Card (Grid View) ──────────────────────────────────────────────────
function PropertyCardGrid({ property }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 group cursor-pointer"
      style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#2C9DD5"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#E5E8EB"}>

      <div className="relative h-44 overflow-hidden">
        <img src={property.images[0]} alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)" }} />
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: property.badgeColor, color: "#FFFFFF" }}>
          {property.badge}
        </span>
        <button onClick={e => { e.stopPropagation(); setSaved(!saved); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(11,11,11,0.8)" }}>
          <svg className="w-3.5 h-3.5" fill={saved ? "#BA0D0B" : "none"} stroke={saved ? "#BA0D0B" : "#FFFFFF"} strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(11,11,11,0.8)", color: "#FFFFFF" }}>
          📷 {property.imgCount}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold" style={{ color: "#15191C" }}>{property.title}</h3>
          {property.verified && (
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 20 20" style={{ color: "#4ade80" }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-extrabold" style={{ color: "#2C9DD5" }}>{property.price}</span>
          <span className="text-xs" style={{ color: "#495057" }}>| {property.area}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-3">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#2C9DD5" }}>
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px]" style={{ color: "#495057" }}>{property.location}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities.slice(0, 3).map(a => (
            <span key={a} className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: "#EAF4FB", color: "#2C9DD5", border: "1px solid #2C9DD520" }}>{a}</span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-[9px] font-semibold" style={{ color: "#E87C02" }}>+{property.amenities.length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid #E5E8EB" }}>
          <span className="text-[10px]" style={{ color: "#495057" }}>
            <span style={{ color: "#1F242A" }}>{property.postedBy}</span>
            {" · "}{property.postedDays === 0 ? "Today" : `${property.postedDays}d ago`}
          </span>
          <button className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            onMouseEnter={e => e.currentTarget.style.background = "#5C0B03"}
            onMouseLeave={e => e.currentTarget.style.background = "#BA0D0B"}>
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function SearchResults() {
  const [viewMode, setViewMode] = useState("list"); // list | grid
  const [sortBy, setSortBy] = useState("Relevance");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    budget: [0, 100000000],
    types: [],
    bhk: [],
    possession: [],
    postedBy: [],
    amenities: [],
    verifiedOnly: false,
  });

  function resetFilters() {
    setFilters({ budget: [0, 100000000], types: [], bhk: [], possession: [], postedBy: [], amenities: [], verifiedOnly: false });
  }

  // Apply filters
  const filtered = PROPERTIES.filter(p => {
    if (p.priceRaw > filters.budget[1]) return false;
    if (filters.types.length && !filters.types.includes(p.type)) return false;
    if (filters.possession.length && !filters.possession.includes(p.status)) return false;
    if (filters.postedBy.length && !filters.postedBy.includes(p.postedBy)) return false;
    if (filters.verifiedOnly && !p.verified) return false;
    if (filters.amenities.length && !filters.amenities.some(a => p.amenities.includes(a))) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.priceRaw - b.priceRaw;
    if (sortBy === "Price: High to Low") return b.priceRaw - a.priceRaw;
    if (sortBy === "Newest First") return a.postedDays - b.postedDays;
    if (sortBy === "Area: Large to Small") return parseInt(b.area) - parseInt(a.area);
    return b.featured - a.featured;
  });

  const activeFilterCount = filters.types.length + filters.bhk.length + filters.possession.length +
    filters.postedBy.length + filters.amenities.length + (filters.verifiedOnly ? 1 : 0);

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }} className="px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Search Bar (top) ── */}
        <div className="rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3"
          style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
          <div className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5"
            style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#2C9DD5" }}>
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <input type="text" defaultValue="Ranchi" className="flex-1 text-sm bg-transparent focus:outline-none"
              style={{ color: "#15191C" }} placeholder="Location, project, or landmark..." />
          </div>
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 w-full sm:w-40"
            style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#2C9DD5" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm" style={{ color: "#495057" }}>Flat +1</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 w-full sm:w-40"
            style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#2C9DD5" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
            </svg>
            <span className="text-sm" style={{ color: "#495057" }}>Budget</span>
          </div>
          <button className="px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
            style={{ background: "#BA0D0B", color: "#FFFFFF" }}
            onMouseEnter={e => e.currentTarget.style.background = "#5C0B03"}
            onMouseLeave={e => e.currentTarget.style.background = "#BA0D0B"}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            Search
          </button>
        </div>

        {/* ── Results Header ── */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold" style={{ color: "#15191C" }}>
              Properties in <span style={{ color: "#2C9DD5" }}>Ranchi</span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#495057" }}>
              {sorted.length} properties found
              {activeFilterCount > 0 && <span style={{ color: "#E87C02" }}> · {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied</span>}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter btn */}
            <button onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "#FFFFFF", color: "#15191C", border: "1px solid #E5E8EB" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#2C9DD5" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters {activeFilterCount > 0 && <span className="font-bold" style={{ color: "#E87C02" }}>({activeFilterCount})</span>}
            </button>

            {/* Sort */}
            <div className="relative">
              <button onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "#FFFFFF", color: "#15191C", border: "1px solid #E5E8EB" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#2C9DD5" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
                </svg>
                {sortBy}
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#495057" }}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-xl z-30 py-1 overflow-hidden shadow-2xl"
                  style={{ background: "#FFFFFF", border: "1px solid #2C9DD5" }}>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                      className="block w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{ color: sortBy === opt ? "#2C9DD5" : "#495057", background: sortBy === opt ? "#EAF4FB" : "transparent" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #E5E8EB" }}>
              {["list", "grid"].map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className="w-9 h-9 flex items-center justify-center transition-all"
                  style={{ background: viewMode === mode ? "#2C9DD5" : "#FFFFFF" }}>
                  {mode === "list" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      style={{ color: viewMode === "list" ? "#FFFFFF" : "#495057" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      style={{ color: viewMode === "grid" ? "#FFFFFF" : "#495057" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="flex gap-6">
          <Sidebar filters={filters} setFilters={setFilters} onReset={resetFilters} />

          {/* Results */}
          <div className="flex-1 min-w-0">
            {sorted.length === 0 ? (
              <div className="rounded-2xl flex flex-col items-center justify-center py-24 text-center"
                style={{ background: "#FFFFFF", border: "1px solid #E5E8EB" }}>
                <span className="text-5xl mb-4">🏚️</span>
                <p className="text-base font-bold mb-1" style={{ color: "#15191C" }}>No properties found</p>
                <p className="text-sm mb-4" style={{ color: "#495057" }}>Try adjusting your filters</p>
                <button onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {sorted.map(p => <PropertyCardList key={p.id} property={p} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sorted.map(p => <PropertyCardGrid key={p.id} property={p} />)}
              </div>
            )}

            {/* Load more */}
            {sorted.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button className="px-8 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "transparent", color: "#2C9DD5", border: "1.5px solid #2C9DD5" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#2C9DD5"; e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2C9DD5"; }}>
                  Load More Properties
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Filters Drawer ── */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 overflow-y-auto"
              style={{ background: "#FFFFFF", borderLeft: "1px solid #2C9DD5" }}>
              <div className="px-5 py-4 flex items-center justify-between sticky top-0"
                style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E8EB" }}>
                <h3 className="text-sm font-bold" style={{ color: "#15191C" }}>Filters</h3>
                <div className="flex items-center gap-3">
                  <button onClick={resetFilters} className="text-xs font-semibold" style={{ color: "#BA0D0B" }}>Reset</button>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#495057" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-5">
                <Sidebar filters={filters} setFilters={setFilters} onReset={resetFilters} />
              </div>
              <div className="sticky bottom-0 px-5 py-4" style={{ background: "#FFFFFF", borderTop: "1px solid #E5E8EB" }}>
                <button onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 rounded-xl text-sm font-bold"
                  style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
                  Show {sorted.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
