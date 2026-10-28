import React, { useState, useRef, useEffect } from "react";
import { fetchPublicListings } from "../lib/listings";
import { fetchListingFieldOptions } from "../lib/listingOptions";
import { useSavedItems } from "../lib/SavedItemsContext";
import { useCompare } from "../lib/CompareContext";
import QuickViewModal from "./QuickViewModal";
import AdvertisementBanner from "./AdvertisementBanner";
import {
  budgetSteps, formatBudget, isBudgetActive, matchesBudget, matchesLocation, sameText,
} from "../lib/searchFilters";

// Fallback defaults for the filter sidebar — kept in sync with "Site
// Content" → Listing Options in the admin console (see the fetch below).
const DEFAULT_PROPERTY_TYPES = ["Apartment", "Villa", "Independent House", "Plot", "Commercial", "Office Space", "Shop / Showroom", "Warehouse / Industrial Shed", "Farmhouse", "Penthouse", "Studio Apartment", "Agricultural Land"];
const POSSESSION = ["Ready to Move", "Under Construction"];
const POSTED_BY = ["Owner", "Builder", "Agent"];
const DEFAULT_AMENITIES_LIST = ["Lift", "Parking", "Visitor Parking", "Power Backup", "Security", "24x7 Security", "CCTV", "Intercom", "Swimming Pool", "Gym", "Garden", "Club House", "Multipurpose Hall", "Indoor Games", "Kids Play Area", "Jogging Track", "Amphitheatre", "Yoga / Meditation Area", "Senior Citizen Sitout", "Cafeteria", "WiFi", "Housekeeping", "Fire Safety", "Rain Water Harvesting", "Sewage Treatment Plant", "Solar Water Heating", "EV Charging Point", "Water Softener Plant", "Vaastu Compliant", "Pet Friendly", "Gated Community"];
const SORT_OPTIONS = ["Relevance", "Price: Low to High", "Price: High to Low", "Newest First", "Area: Large to Small"];
const DEFAULT_BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "5+ BHK"];
const DEFAULT_TAGS_LIST = ["Luxury", "Affordable", "Gated Community", "Office", "Retail", "Industrial", "Co-living", "Student Accommodation", "New Launch", "Ready to Move", "RERA Approved", "Corner Plot", "Investment Opportunity"];

// ── Complete Property Category Architecture (Section 2 of Blueprint) ────────
export const PROPERTY_SECTORS = [
  { id: "all", label: "All Categories", icon: "🏢" },
  { id: "residential", label: "Residential", icon: "🏡", types: ["Apartment", "Villa", "Independent House", "Penthouse", "Studio Apartment"] },
  { id: "commercial", label: "Commercial", icon: "🏬", types: ["Commercial", "Office Space", "Shop / Showroom"] },
  { id: "industrial", label: "Industrial & Logistics", icon: "🏭", types: ["Warehouse / Industrial Shed"] },
  { id: "land", label: "Land & Plots", icon: "🗺️", types: ["Plot", "Agricultural Land", "Farmhouse"] },
  { id: "lifestyle", label: "Lifestyle & Co-living", icon: "🌴", tags: ["Luxury", "Gated Community", "Co-living", "Student Accommodation"] },
];

// Budget filter shape: [min, max]. min 0 = no lower limit, max null = no upper
// limit (so listings above any fixed ceiling are never silently hidden).
const NO_BUDGET = [0, null];

// ── Helper ─────────────────────────────────────────────────────────────────────
function CheckBox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
        style={{
          background: checked ? "#1565C0" : "transparent",
          border: `1.5px solid ${checked ? "#1565C0" : "#E2E8F0"}`,
        }}
      >
        {checked && (
          <svg className="w-2.5 h-2.5" fill="none" stroke="#FFFFFF" strokeWidth={3} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-xs transition-colors" style={{ color: checked ? "#1F2937" : "#6B7280" }}>{label}</span>
    </label>
  );
}

// ── Budget (min / max) ─────────────────────────────────────────────────────────
function BudgetFilter({ value, onChange, mode = "Buy" }) {
  const steps = budgetSteps(mode);
  const [min, max] = value;
  // Keep a value that came from the Hero (e.g. exactly ₹30 Lac) selectable
  // even if it isn't one of the preset steps.
  const withCurrent = (current) => (current && !steps.includes(current) ? [...steps, current].sort((a, b) => a - b) : steps);
  const minOptions = withCurrent(min);
  const maxOptions = withCurrent(max);

  const selectStyle = { background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" };

  function setMin(raw) {
    const nextMin = raw === "" ? 0 : Number(raw);
    // never leave min above max — push max out to "no limit" instead of producing an impossible range
    const nextMax = max !== null && nextMin > max ? null : max;
    onChange([nextMin, nextMax]);
  }
  function setMax(raw) {
    const nextMax = raw === "" ? null : Number(raw);
    const nextMin = nextMax !== null && min > nextMax ? 0 : min;
    onChange([nextMin, nextMax]);
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <label className="block">
        <span className="block text-[11px] mb-1" style={{ color: "#6B7280" }}>Min</span>
        <select value={min > 0 ? String(min) : ""} onChange={e => setMin(e.target.value)}
          aria-label="Minimum budget" className="w-full rounded-lg px-2 py-2 text-xs focus:outline-none" style={selectStyle}>
          <option value="">No min</option>
          {minOptions.map(v => <option key={v} value={v}>{formatBudget(v, mode)}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="block text-[11px] mb-1" style={{ color: "#6B7280" }}>Max</span>
        <select value={max !== null && max !== undefined ? String(max) : ""} onChange={e => setMax(e.target.value)}
          aria-label="Maximum budget" className="w-full rounded-lg px-2 py-2 text-xs focus:outline-none" style={selectStyle}>
          <option value="">No max</option>
          {maxOptions.map(v => <option key={v} value={v}>{formatBudget(v, mode)}</option>)}
        </select>
      </label>
    </div>
  );
}

// ── Sidebar Filters ────────────────────────────────────────────────────────────
function Sidebar({
  filters,
  setFilters,
  onReset,
  propertyTypes,
  bhkOptions,
  amenitiesList,
  tagsList,
  variant = "desktop", // "desktop" = sticky card shown from lg up; "drawer" = bare, always visible (mobile filter drawer)
}) {
  const isDrawer = variant === "drawer";
  const toggle = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  };

  const WAREHOUSE_OPTIONS = ["20ft+ Ceiling", "30ft+ Ceiling", "Multiple Loading Docks", "Heavy Power Load (100kVA+)", "Wide 40ft+ Truck Road"];
  const LAND_OPTIONS = ["Freehold Land", "NA / Conversion Approved", "Corner Plot", "RERA Approved Layout", "Irrigated Farmland"];
  const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];

  const sections = [
    { title: "Property Type", key: "types", options: propertyTypes },
    { title: "BHK", key: "bhk", options: bhkOptions },
    filters.transactionType === "Rent" && { title: "Rental Furnishing", key: "furnishing", options: FURNISHING_OPTIONS },
    { title: "Possession / Stage", key: "possession", options: POSSESSION },
    { title: "Industrial & Warehouse Specs", key: "warehouseSpecs", options: WAREHOUSE_OPTIONS },
    { title: "Land Zoning & Clearances", key: "landZoning", options: LAND_OPTIONS },
    { title: "Category", key: "tags", options: tagsList },
    { title: "Posted By", key: "postedBy", options: POSTED_BY },
    { title: "Amenities", key: "amenities", options: amenitiesList },
  ].filter(Boolean);

  return (
    <aside className={isDrawer ? "w-full" : "w-64 shrink-0 hidden lg:block"}>
      <div className={isDrawer ? "" : "rounded-2xl overflow-hidden sticky top-20"} style={isDrawer ? undefined : { background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
        {/* Header (the drawer has its own header, so only the desktop card shows this one) */}
        {!isDrawer && (
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #E2E8F0" }}>
            <h3 className="text-sm font-bold" style={{ color: "#1F2937" }}>Filters</h3>
            <button onClick={onReset} className="text-xs font-semibold transition-colors hover:underline" style={{ color: "#1565C0" }}>
              Reset All
            </button>
          </div>
        )}

        <div className={isDrawer ? "space-y-6" : "p-5 space-y-6 max-h-[80vh] overflow-y-auto"} style={isDrawer ? undefined : { scrollbarWidth: "none" }}>
          {/* Price Range */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#6B7280" }}>Budget</p>
            <BudgetFilter value={filters.budget} mode={filters.transactionType}
              onChange={val => setFilters(f => ({ ...f, budget: val }))} />
            {isBudgetActive(filters.budget) && (
              <button type="button" onClick={() => setFilters(f => ({ ...f, budget: NO_BUDGET }))}
                className="mt-2 text-[11px] font-semibold hover:underline" style={{ color: "#1565C0" }}>
                Clear budget
              </button>
            )}
          </div>

          {/* Dynamic sections */}
          {sections.map(sec => (
            <div key={sec.title}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#6B7280" }}>{sec.title}</p>
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
          <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
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
function PropertyCardList({ property, onOpen, onQuickView, onNavigate }) {
  const { isPropertySaved, toggleSaveProperty } = useSavedItems();
  const { isComparing, toggleCompare, items, maxCompare } = useCompare();
  const saved = isPropertySaved(property.dbId || property.id);
  const comparing = isComparing(property.dbId || property.id);
  const compareFull = items.length >= maxCompare && !comparing;
  const [imgIdx, setImgIdx] = useState(0);
  const contactSubject = property.transactionType === "Rent" ? "rent" : "buy";

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col sm:flex-row transition-all duration-200 group cursor-pointer"
      style={{
        background: "#FFFFFF",
        border: property.featured ? "1.5px solid #1565C040" : "1px solid #E2E8F0",
        boxShadow: property.featured ? "0 0 24px #1565C010" : "none",
      }}
      onClick={() => onOpen && onOpen(property)}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#1565C0"}
      onMouseLeave={e => e.currentTarget.style.borderColor = property.featured ? "#1565C040" : "#E2E8F0"}
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

        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={e => { e.stopPropagation(); onQuickView && onQuickView(property); }}
            aria-label="Quick view"
            className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ background: "rgba(11,11,11,0.8)" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="#FFFFFF" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button onClick={e => { e.stopPropagation(); toggleSaveProperty(property); }}
            aria-label="Save"
            disabled={false}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            style={{ background: "rgba(11,11,11,0.8)" }}>
            <svg className="w-3.5 h-3.5" fill={saved ? "#1565C0" : "none"} stroke={saved ? "#1565C0" : "#FFFFFF"} strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button onClick={e => { e.stopPropagation(); toggleCompare(property); }}
            aria-label="Compare" disabled={compareFull}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 disabled:opacity-40"
            style={{ background: comparing ? "#1565C0" : "rgba(11,11,11,0.8)" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="#FFFFFF" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>
        </div>

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
          <h3 className="text-base font-bold leading-tight group-hover:transition-colors" style={{ color: "#1F2937" }}>
            {property.title}
          </h3>
          {property.verified && (
            <span className="flex items-center gap-1 text-[10px] font-bold shrink-0" style={{ color: "#1565C0" }}>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Price + Area */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-xl font-extrabold" style={{ color: "#1565C0" }}>{property.price}</span>
          <span className="text-xs" style={{ color: "#6B7280" }}>|</span>
          <span className="text-sm font-medium" style={{ color: "#6B7280" }}>{property.area}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#1565C0" }}>
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs" style={{ color: "#6B7280" }}>{property.location}</span>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { label: property.status },
            { label: property.floor ? `Floor: ${property.floor}` : null },
            { label: property.facing ? `Facing: ${property.facing}` : null },
            { label: property.age && property.age !== "—" ? `Age: ${property.age}` : null },
          ].filter(x => x.label).map(chip => (
            <span key={chip.label} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: "#FFFFFF", color: "#6B7280", border: "1px solid #E2E8F0" }}>
              {chip.label}
            </span>
          ))}
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {property.amenities.slice(0, 4).map(a => (
            <span key={a} className="text-[10px] px-2 py-0.5 rounded"
              style={{ background: "#EFF6FF", color: "#1565C0", border: "1px solid #1565C020" }}>
              {a}
            </span>
          ))}
          {property.amenities.length > 4 && (
            <span className="text-[10px] font-semibold" style={{ color: "#F59E0B" }}>
              +{property.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
          <div className="text-xs" style={{ color: "#6B7280" }}>
            By <span className="font-semibold" style={{ color: "#1F2937" }}>{property.postedBy}</span>
            {" · "}
            {property.postedDays === 0 ? "Today" : `${property.postedDays}d ago`}
          </div>
          <div className="flex gap-2">
            <button onClick={e => { e.stopPropagation(); onNavigate && onNavigate("contact", { subject: contactSubject, property, intent: "contact" }); }}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all"
              style={{ background: "transparent", color: "#1565C0", border: "1.5px solid #1565C0" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1565C0"; e.currentTarget.style.color = "#FFFFFF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1565C0"; }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
              </svg>
              Contact
            </button>
            <button onClick={e => { e.stopPropagation(); onNavigate && onNavigate("contact", { subject: contactSubject, property, intent: "site-visit" }); }}
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all"
              style={{ background: "#1565C0", color: "#FFFFFF" }}
              onMouseEnter={e => e.currentTarget.style.background = "#0D47A1"}
              onMouseLeave={e => e.currentTarget.style.background = "#1565C0"}>
              Site Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Property Card (Grid View) ──────────────────────────────────────────────────
function PropertyCardGrid({ property, onOpen, onQuickView, onNavigate }) {
  const { isPropertySaved, toggleSaveProperty } = useSavedItems();
  const { isComparing, toggleCompare, items, maxCompare } = useCompare();
  const saved = isPropertySaved(property.dbId || property.id);
  const comparing = isComparing(property.dbId || property.id);
  const compareFull = items.length >= maxCompare && !comparing;
  const contactSubject = property.transactionType === "Rent" ? "rent" : "buy";

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 group cursor-pointer"
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
      onClick={() => onOpen && onOpen(property)}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#1565C0"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}>

      <div className="relative h-44 overflow-hidden">
        <img src={property.images[0]} alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)" }} />
        <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: property.badgeColor, color: "#FFFFFF" }}>
          {property.badge}
        </span>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button onClick={e => { e.stopPropagation(); onQuickView && onQuickView(property); }}
            aria-label="Quick view"
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(11,11,11,0.8)" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="#FFFFFF" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button onClick={e => { e.stopPropagation(); toggleSaveProperty(property); }}
            aria-label="Save"
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(11,11,11,0.8)" }}>
            <svg className="w-3.5 h-3.5" fill={saved ? "#1565C0" : "none"} stroke={saved ? "#1565C0" : "#FFFFFF"} strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button onClick={e => { e.stopPropagation(); toggleCompare(property); }}
            aria-label="Compare" disabled={compareFull}
            className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-40"
            style={{ background: comparing ? "#1565C0" : "rgba(11,11,11,0.8)" }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="#FFFFFF" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(11,11,11,0.8)", color: "#FFFFFF" }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          {property.imgCount}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold" style={{ color: "#1F2937" }}>{property.title}</h3>
          {property.verified && (
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 20 20" style={{ color: "#1565C0" }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-extrabold" style={{ color: "#1565C0" }}>{property.price}</span>
          <span className="text-xs" style={{ color: "#6B7280" }}>| {property.area}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-3">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#1565C0" }}>
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px]" style={{ color: "#6B7280" }}>{property.location}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities.slice(0, 3).map(a => (
            <span key={a} className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: "#EFF6FF", color: "#1565C0", border: "1px solid #1565C020" }}>{a}</span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-[9px] font-semibold" style={{ color: "#F59E0B" }}>+{property.amenities.length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid #E2E8F0" }}>
          <span className="text-[10px]" style={{ color: "#6B7280" }}>
            <span style={{ color: "#1F2937" }}>{property.postedBy}</span>
            {" · "}{property.postedDays === 0 ? "Today" : `${property.postedDays}d ago`}
          </span>
          <button onClick={e => { e.stopPropagation(); onNavigate && onNavigate("contact", { subject: contactSubject, property, intent: "contact" }); }}
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "#1565C0", color: "#FFFFFF" }}
            onMouseEnter={e => e.currentTarget.style.background = "#0D47A1"}
            onMouseLeave={e => e.currentTarget.style.background = "#1565C0"}>
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
// ── Build the filters object, merging any nav-provided overrides over sensible defaults ──
function buildFilters(overrides) {
  const transactionType = overrides?.transactionType || "Buy";
  const b = overrides?.budget;
  const budget = Array.isArray(b)
    ? [Number(b[0]) > 0 ? Number(b[0]) : 0, b[1] !== null && b[1] !== undefined && Number.isFinite(Number(b[1])) ? Number(b[1]) : null]
    : NO_BUDGET;
  return {
    transactionType,
    location: overrides?.location || "",
    budget,
    types: overrides?.types || [],
    bhk: overrides?.bhk || [],
    possession: overrides?.possession || [],
    postedBy: overrides?.postedBy || [],
    amenities: overrides?.amenities || [],
    tags: overrides?.tags || [],
    verifiedOnly: overrides?.verifiedOnly || false,
    furnishing: overrides?.furnishing || [],
    warehouseSpecs: overrides?.warehouseSpecs || [],
    landZoning: overrides?.landZoning || [],
  };
}

export default function SearchResults({ initialFilters, onNavigate }) {
  const [viewMode, setViewMode] = useState("list"); // list | grid
  const resultsRef = useRef(null);
  const [sortBy, setSortBy] = useState("Relevance");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState(() => buildFilters(initialFilters));
  useEffect(() => {
    if (initialFilters) {
      setFilters(buildFilters(initialFilters));
    }
  }, [initialFilters]);
  const [listings, setListings] = useState(null); // null = still loading, [] = loaded but empty
  const [loadError, setLoadError] = useState("");
  const [fieldOptions, setFieldOptions] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchPublicListings().then(({ data, error }) => {
      if (cancelled) return;
      setListings(data);
      if (error) setLoadError(error.message || "Couldn't load properties right now.");
    });
    fetchListingFieldOptions().then(({ data }) => { if (!cancelled) setFieldOptions(data); });
    return () => { cancelled = true; };
  }, []);

  const PROPERTY_TYPES = fieldOptions?.propertyTypes?.length ? fieldOptions.propertyTypes : DEFAULT_PROPERTY_TYPES;
  const BHK_OPTIONS = fieldOptions?.bhkOptions?.length ? fieldOptions.bhkOptions : DEFAULT_BHK_OPTIONS;
  const AMENITIES_LIST = fieldOptions?.amenities?.length ? fieldOptions.amenities : DEFAULT_AMENITIES_LIST;
  const TAGS_LIST = fieldOptions?.tags?.length ? fieldOptions.tags : DEFAULT_TAGS_LIST;

  const ALL_PROPERTIES = listings || [];
  const isLoading = listings === null;

  function openProperty(property) {
    onNavigate && onNavigate("property-detail", { property, pool: ALL_PROPERTIES });
  }

  const [quickViewProperty, setQuickViewProperty] = useState(null);

  // "Reset All" clears the sidebar filters but keeps the location search —
  // that has its own × button and a "Clear Location" button on the empty state.
  function resetFilters() {
    setFilters(buildFilters({ transactionType: filters.transactionType, location: filters.location }));
  }

  // Switching Buy <-> Rent keeps what the user typed/picked (location, property
  // type, BHK, ...). Only the budget is reset (lakhs/crores vs. rupees per
  // month aren't comparable) along with the rent-only furnishing choice.
  function setTransactionType(tt) {
    if (tt === filters.transactionType) return;
    setFilters(f => ({ ...f, transactionType: tt, budget: NO_BUDGET, furnishing: [] }));
  }

  // Apply filters
  const filtered = ALL_PROPERTIES.filter(p => {
    if (p.transactionType !== filters.transactionType) return false;
    if (!matchesBudget(p, filters.budget)) return false;
    if (filters.types.length && !filters.types.some(t => sameText(t, p.type))) return false;
    if (filters.bhk.length && !filters.bhk.some(b => p.bhk.includes(b))) return false;
    if (filters.possession.length && !filters.possession.includes(p.status)) return false;
    if (filters.postedBy?.length && !filters.postedBy.includes(p.postedBy)) return false;
    if (filters.verifiedOnly && !p.verified) return false;
    if (filters.amenities?.length && !filters.amenities.some(a => (p.amenities || []).includes(a))) return false;
    if (filters.tags?.length && !filters.tags.some(t => (p.tags || []).includes(t))) return false;
    if (filters.furnishing?.length) {
      // The listing's own Furnishing field is the source of truth; only fall back
      // to tags/description for older listings that never set it. (The old
      // substring check on description made "Furnished" also match "Unfurnished".)
      const ok = p.furnishing
        ? filters.furnishing.some(f => sameText(f, p.furnishing))
        : filters.furnishing.some(f => (p.tags || []).some(t => sameText(t, f)));
      if (!ok) return false;
    }
    if (filters.warehouseSpecs?.length && !filters.warehouseSpecs.some(w => (p.unitFeatures || p.amenities || p.tags || []).some(x => typeof x === "string" && x.toLowerCase().includes(w.toLowerCase().split(" ")[0])) || (p.description || "").toLowerCase().includes(w.toLowerCase().split(" ")[0]))) return false;
    if (filters.landZoning?.length && !filters.landZoning.some(z => (p.tags || p.approvals || []).some(x => typeof x === "string" && x.toLowerCase().includes(z.toLowerCase().split(" ")[0])) || (p.title || "").toLowerCase().includes(z.toLowerCase().split(" ")[0]))) return false;
    if (!matchesLocation(p, filters.location)) return false;
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High" || sortBy === "Price: High to Low") {
      // "Call for Details" listings have no priceRaw to compare — always
      // push them to the end rather than letting them read as the cheapest
      // option just because priceRaw defaults to 0.
      if (!a.priceRaw && !b.priceRaw) return 0;
      if (!a.priceRaw) return 1;
      if (!b.priceRaw) return -1;
      return sortBy === "Price: Low to High" ? a.priceRaw - b.priceRaw : b.priceRaw - a.priceRaw;
    }
    if (sortBy === "Newest First") return a.postedDays - b.postedDays;
    if (sortBy === "Area: Large to Small") return (parseInt(b.area) || 0) - (parseInt(a.area) || 0);
    return b.featured - a.featured;
  });

  const activeFilterCount = filters.types.length + filters.bhk.length + filters.possession.length +
    filters.postedBy.length + filters.amenities.length + filters.tags.length + (filters.verifiedOnly ? 1 : 0) +
    filters.furnishing.length + filters.warehouseSpecs.length + filters.landZoning.length +
    (isBudgetActive(filters.budget) ? 1 : 0);

  const activeSector = (() => {
    if (filters.types.length === 1 && (filters.types[0] === "Plot" || filters.types[0] === "Agricultural Land")) return "land";
    if (filters.types.length === 1 && filters.types[0] === "Warehouse / Industrial Shed") return "industrial";
    if (filters.types.length && filters.types.every(t => ["Commercial", "Office Space", "Shop / Showroom"].includes(t))) return "commercial";
    if (filters.types.length && filters.types.every(t => ["Apartment", "Villa", "Independent House", "Penthouse", "Studio Apartment"].includes(t))) return "residential";
    if (filters.tags.length && filters.tags.every(t => ["Luxury", "Gated Community", "Co-living", "Student Accommodation"].includes(t))) return "lifestyle";
    return "all";
  })();

  function handleSectorSelect(sector) {
    if (sector.id === "all") {
      setFilters(f => ({ ...f, types: [], tags: [] }));
    } else if (sector.types) {
      setFilters(f => ({ ...f, types: sector.types, tags: [] }));
    } else if (sector.tags) {
      setFilters(f => ({ ...f, types: [], tags: sector.tags }));
    }
  }

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }} className="px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Top Transaction & Category Architecture Strip ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          {/* Buy / Rent toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl w-fit" style={{ background: "#F1F5F9" }}>
            {["Buy", "Rent"].map((tt) => (
              <button
                key={tt}
                onClick={() => setTransactionType(tt)}
                className="px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all"
                style={{
                  background: filters.transactionType === tt ? "#1565C0" : "transparent",
                  color: filters.transactionType === tt ? "#FFFFFF" : "#6B7280",
                }}
              >
                {tt === "Buy" ? "For Sale" : "For Rent"}
              </button>
            ))}
          </div>

          {/* Quick RentReady link for rentals */}
          {filters.transactionType === "Rent" && (
            <button
              onClick={() => onNavigate && onNavigate("rent-ready")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition"
            >
              <span>⚡</span> RentReady™ Agreement & Move-In Suite
            </button>
          )}
        </div>

        {/* ── Category Architecture Strip (Section 2 of Blueprint) ── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {PROPERTY_SECTORS.map((sector) => {
            const isSelected = activeSector === sector.id;
            return (
              <button
                key={sector.id}
                onClick={() => handleSectorSelect(sector)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <span>{sector.icon}</span>
                <span>{sector.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Search Bar (top) ── */}
        <div className="rounded-2xl p-4 mb-4 flex flex-col sm:flex-row gap-3"
          style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
          <div className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5"
            style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#1565C0" }}>
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <input type="text" value={filters.location}
              onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
              onKeyDown={e => { if (e.key === "Enter") resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }}
              className="flex-1 text-sm bg-transparent focus:outline-none"
              style={{ color: "#1F2937" }} placeholder="Location, project, or landmark..." />
            {filters.location && (
              <button onClick={() => setFilters(f => ({ ...f, location: "" }))} aria-label="Clear location"
                className="text-xs font-bold shrink-0" style={{ color: "#6B7280" }}>
                ×
              </button>
            )}
          </div>
          <button onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all justify-center"
            style={{ background: "#1565C0", color: "#FFFFFF" }}
            onMouseEnter={e => e.currentTarget.style.background = "#0D47A1"}
            onMouseLeave={e => e.currentTarget.style.background = "#1565C0"}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            Search
          </button>
        </div>

        {/* ── Quick Filter Tags & Badges Strip ── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] shrink-0">Quick Filters:</span>
          
          <button
            onClick={() => setFilters(f => ({ ...f, verifiedOnly: !f.verifiedOnly }))}
            className={`px-3 py-1.5 rounded-full font-semibold transition border flex items-center gap-1.5 shrink-0 ${
              filters.verifiedOnly
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400 font-bold"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            <span>✓</span> Verified Only
          </button>

          <button
            onClick={() => {
              const hasRera = filters.tags.includes("RERA Approved");
              setFilters(f => ({
                ...f,
                tags: hasRera ? f.tags.filter(t => t !== "RERA Approved") : [...f.tags, "RERA Approved"],
              }));
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition border shrink-0 ${
              filters.tags.includes("RERA Approved")
                ? "bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-400 font-bold"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            🏛️ RERA Approved
          </button>

          <button
            onClick={() => {
              const hasReady = filters.possession.includes("Ready to Move");
              setFilters(f => ({
                ...f,
                possession: hasReady ? f.possession.filter(p => p !== "Ready to Move") : [...f.possession, "Ready to Move"],
              }));
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition border shrink-0 ${
              filters.possession.includes("Ready to Move")
                ? "bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-400 font-bold"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            🔑 Ready to Move
          </button>

          <button
            onClick={() => {
              const hasLuxury = filters.tags.includes("Luxury");
              setFilters(f => ({
                ...f,
                tags: hasLuxury ? f.tags.filter(t => t !== "Luxury") : [...f.tags, "Luxury"],
              }));
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition border shrink-0 ${
              filters.tags.includes("Luxury")
                ? "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400 font-bold"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            ✨ Luxury
          </button>

          <button
            onClick={() => {
              const hasOwner = filters.postedBy.includes("Owner");
              setFilters(f => ({
                ...f,
                postedBy: hasOwner ? f.postedBy.filter(p => p !== "Owner") : [...f.postedBy, "Owner"],
              }));
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition border shrink-0 ${
              filters.postedBy.includes("Owner")
                ? "bg-indigo-50 text-indigo-800 border-indigo-300 ring-1 ring-indigo-400 font-bold"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            👤 By Owner
          </button>
        </div>

        {/* ── Results Header ── */}
        <div ref={resultsRef} className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold" style={{ color: "#1F2937" }}>
              {filters.transactionType === "Rent" ? "Properties for Rent" : "Properties for Sale"}
              {filters.location.trim() && <> in <span style={{ color: "#1565C0" }}>{filters.location.trim()}</span></>}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
              {sorted.length} properties found
              {activeFilterCount > 0 && <span style={{ color: "#F59E0B" }}> · {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied</span>}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter btn */}
            <button onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "#FFFFFF", color: "#1F2937", border: "1px solid #E2E8F0" }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#1565C0" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters {activeFilterCount > 0 && <span className="font-bold" style={{ color: "#F59E0B" }}>({activeFilterCount})</span>}
            </button>

            {/* Sort */}
            <div className="relative">
              <button onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "#FFFFFF", color: "#1F2937", border: "1px solid #E2E8F0" }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#1565C0" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
                </svg>
                {sortBy}
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#6B7280" }}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-xl z-30 py-1 overflow-hidden shadow-2xl"
                  style={{ background: "#FFFFFF", border: "1px solid #1565C0" }}>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                      className="block w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{ color: sortBy === opt ? "#1565C0" : "#6B7280", background: sortBy === opt ? "#EFF6FF" : "transparent" }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
              {["list", "grid"].map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className="w-9 h-9 flex items-center justify-center transition-all"
                  style={{ background: viewMode === mode ? "#1565C0" : "#FFFFFF" }}>
                  {mode === "list" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      style={{ color: viewMode === "list" ? "#FFFFFF" : "#6B7280" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      style={{ color: viewMode === "grid" ? "#FFFFFF" : "#6B7280" }}>
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
          <Sidebar
  filters={filters}
  setFilters={setFilters}
  onReset={resetFilters}
  propertyTypes={PROPERTY_TYPES}
  bhkOptions={BHK_OPTIONS}
  amenitiesList={AMENITIES_LIST}
  tagsList={TAGS_LIST}
/>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl h-40 animate-pulse" style={{ background: "#F1F5F9" }} />
                ))}
              </div>
            ) : loadError ? (
              <div className="rounded-2xl flex flex-col items-center justify-center py-24 text-center"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <span className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#FEF3C7" }}>
                  <svg className="w-7 h-7" fill="none" stroke="#F59E0B" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </span>
                <p className="text-base font-bold mb-1" style={{ color: "#1F2937" }}>Couldn't load properties</p>
                <p className="text-sm" style={{ color: "#6B7280" }}>{loadError}</p>
              </div>
            ) : ALL_PROPERTIES.length === 0 ? (
              <div className="rounded-2xl flex flex-col items-center justify-center py-24 text-center"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <span className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#EFF6FF" }}>
                  <svg className="w-7 h-7" fill="none" stroke="#1565C0" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </span>
                <p className="text-base font-bold mb-1" style={{ color: "#1F2937" }}>No properties listed yet</p>
                <p className="text-sm mb-4" style={{ color: "#6B7280" }}>Be the first — post your property for free.</p>
                <button onClick={() => onNavigate && onNavigate("post-property")}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: "#1565C0", color: "#FFFFFF" }}>
                  Post a Property
                </button>
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-2xl flex flex-col items-center justify-center py-24 text-center"
                style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
                <span className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#F1F5F9" }}>
                  <svg className="w-7 h-7" fill="none" stroke="#6B7280" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </span>
                <p className="text-base font-bold mb-1" style={{ color: "#1F2937" }}>
                  {filters.location.trim() ? `No properties found in "${filters.location.trim()}"` : "No properties match your filters"}
                </p>
                <p className="text-sm mb-4 max-w-md" style={{ color: "#6B7280" }}>
                  {filters.location.trim()
                    ? "Currently, our featured properties are in Bhubaneswar and Odisha. Explore all listings or clear your location search."
                    : "Try adjusting your budget, BHK, or other filter criteria."}
                </p>
                <div className="flex flex-wrap gap-2.5 justify-center">
                  {filters.location.trim() && (
                    <button onClick={() => setFilters(f => ({ ...f, location: "" }))}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                      style={{ background: "#1565C0", color: "#FFFFFF" }}>
                      Clear Location ({filters.location.trim()})
                    </button>
                  )}
                  <button onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                    style={{ background: "#F1F5F9", color: "#1F2937", border: "1px solid #E2E8F0" }}>
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {sorted.map((p, idx) => (
                  <React.Fragment key={p.id}>
                    <PropertyCardList property={p} onOpen={openProperty} onQuickView={setQuickViewProperty} onNavigate={onNavigate} />
                    {idx === 2 && (
                      <div className="my-6">
                        <AdvertisementBanner placement="search" onNavigate={onNavigate} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
                {sorted.length < 3 && (
                  <div className="my-6">
                    <AdvertisementBanner placement="search" onNavigate={onNavigate} />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sorted.map((p, idx) => (
                  <React.Fragment key={p.id}>
                    <PropertyCardGrid property={p} onOpen={openProperty} onQuickView={setQuickViewProperty} onNavigate={onNavigate} />
                    {idx === 3 && (
                      <div className="col-span-full my-4">
                        <AdvertisementBanner placement="search" onNavigate={onNavigate} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
                {sorted.length < 4 && (
                  <div className="col-span-full my-4">
                    <AdvertisementBanner placement="search" onNavigate={onNavigate} />
                  </div>
                )}
              </div>
            )}

            {/* Load more */}
            {sorted.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button className="px-8 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "transparent", color: "#1565C0", border: "1.5px solid #1565C0" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1565C0"; e.currentTarget.style.color = "#FFFFFF"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1565C0"; }}>
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
              style={{ background: "#FFFFFF", borderLeft: "1px solid #1565C0" }}>
              <div className="px-5 py-4 flex items-center justify-between sticky top-0"
                style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}>
                <h3 className="text-sm font-bold" style={{ color: "#1F2937" }}>Filters</h3>
                <div className="flex items-center gap-3">
                  <button onClick={resetFilters} className="text-xs font-semibold" style={{ color: "#1565C0" }}>Reset</button>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#6B7280" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-5">
                <Sidebar
                  variant="drawer"
                  filters={filters}
                  setFilters={setFilters}
                  onReset={resetFilters}
                  propertyTypes={PROPERTY_TYPES}
                  bhkOptions={BHK_OPTIONS}
                  amenitiesList={AMENITIES_LIST}
                  tagsList={TAGS_LIST}
                />
              </div>
              <div className="sticky bottom-0 px-5 py-4" style={{ background: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
                <button onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 rounded-xl text-sm font-bold"
                  style={{ background: "#1565C0", color: "#FFFFFF" }}>
                  Show {sorted.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {quickViewProperty && (
        <QuickViewModal
          property={quickViewProperty}
          onClose={() => setQuickViewProperty(null)}
          onViewDetails={(p) => { setQuickViewProperty(null); openProperty(p); }}
        />
      )}
    </div>
  );
}
