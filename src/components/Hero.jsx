import { useState, useEffect } from "react";
import { fetchHeroContent, fetchHeroCards } from "../lib/siteContent";
import { fetchListingFieldOptions } from "../lib/listingOptions";

// ── Fallback content ──────────────────────────────────────────────────────────
// Everything below is shown only until an admin sets real values in
// Admin console → Site Content → "Hero Content" / "Hero Cards" / "Listing
// Options". The moment a real hero_content row or hero_cards rows exist,
// they fully replace this — same pattern used by Testimonials, ChannelPartner,
// PropertyManagement, and InvestmentAdvisory (see src/lib/siteContent.js).

const DEFAULT_HERO_CONTENT = {
  headlinePrefix: "Start your",
  headlineHighlight: "#DiscoverInvestGrow",
  headlineSuffix: "Journey",
  subtext: "Discover. Invest. Build. Grow. Compare. Discuss. Decide.",
  searchTabs: ["Buy", "Rent", "New Projects", "Plot", "Commercial", "Post Free Property Ad"],
  quickCtas: [
    { label: "Explore Properties", linkType: "page", linkValue: "search" },
    { label: "Schedule Site Visit", linkType: "page", linkValue: "contact" },
    { label: "Calculate EMI", linkType: "page", linkValue: "investment-advisory" },
    { label: "Talk to an Expert", linkType: "page", linkValue: "contact" },
  ],
  promoBadge: "Save 40%",
  promoImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=200&fit=crop",
  promoEyebrow: "Get Home Interiors from",
  promoHeading: "Top Architects & Designers",
  promoCtaLabel: "Check Offers",
  promoCtaLinkType: "page",
  promoCtaLinkValue: "architects-design",
};

const DEMO_HERO_CARDS = [
  {
    id: "demo-1",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=260&fit=crop",
    title: "12,400+",
    subtitle: "Verified Listings",
    cta: "Explore",
    linkType: "page",
    linkValue: "search",
  },
  {
    id: "demo-2",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=260&fit=crop",
    title: "Projects",
    subtitle: "Featured Developers",
    cta: "Explore",
    linkType: "page",
    linkValue: "search",
  },
  {
    id: "demo-3",
    backgroundColor: "#1E88E5",
    title: "Discover Your Dream Property",
    subtitle: "Exclusive access to premium listings & investment insights",
    cta: "Talk to an Expert",
    linkType: "page",
    linkValue: "contact",
  },
  {
    id: "demo-4",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop",
    title: "580+",
    subtitle: "Budget Homes",
    cta: "Explore",
    linkType: "page",
    linkValue: "search",
  },
];

// Fallback lists for the two search-bar dropdowns — kept in sync with "Site
// Content" → Listing Options in the admin console (see the fetch below).
const DEFAULT_PROPERTY_TYPES = ["Apartment", "Villa", "Independent House", "Plot", "Commercial", "Office Space"];
const DEFAULT_BUDGET_RANGES = ["Under ₹30 Lac", "₹30 - 50 Lac", "₹50 Lac - 1 Cr", "₹1 - 1.5 Cr", "₹1.5 - 2 Cr", "Above ₹2 Cr"];

// ── Helpers ────────────────────────────────────────────────────────────────────

// Every editable link on the Hero (cards, quick CTAs, promo button) is either
// an internal page key (handled through the app's onNavigate router) or a
// plain external URL, chosen in the admin console via a link-type toggle.
function goTo(onNavigate, linkType, linkValue) {
  if (!linkValue) return;
  if (linkType === "url") {
    window.open(linkValue, "_blank", "noopener,noreferrer");
  } else {
    onNavigate && onNavigate(linkValue);
  }
}

function HeroCard({ card, onNavigate }) {
  const handleClick = () => goTo(onNavigate, card.linkType, card.linkValue);

  if (card.backgroundColor) {
    return (
      <div
        onClick={handleClick}
        className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition flex flex-col justify-between p-4 h-44"
        style={{ background: card.backgroundColor }}
      >
        <div>
          <p className="text-white font-bold text-base leading-tight mb-1">{card.title}</p>
          {card.subtitle && <p className="text-white/85 text-xs">{card.subtitle}</p>}
        </div>
        {card.cta && (
          <span
            className="self-start bg-white text-xs font-bold px-4 py-2 rounded-full group-hover:bg-[#FEF3C7] transition"
            style={{ color: card.backgroundColor }}
          >
            {card.cta}
          </span>
        )}
      </div>
    );
  }

  return (
    <div onClick={handleClick} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition">
      <img
        src={card.image}
        alt={card.title || ""}
        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-3">
        {card.title && <p className="text-white text-2xl font-extrabold leading-tight">{card.title}</p>}
        {card.subtitle && <p className="text-white text-sm font-semibold">{card.subtitle}</p>}
        {card.cta && (
          <span className="inline-flex items-center gap-1 text-white text-xs mt-1 hover:underline font-medium">
            {card.cta}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

export default function Hero({ onNavigate }) {
  const [heroContent, setHeroContent] = useState(null); // null = still loading
  const [heroCards, setHeroCards] = useState(null); // null = still loading
  const [fieldOptions, setFieldOptions] = useState(null);

  const [activeTab, setActiveTab] = useState(null);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState(null);
  const [budget, setBudget] = useState("Budget");
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchHeroContent().then(({ data }) => { if (!cancelled) setHeroContent(data || DEFAULT_HERO_CONTENT); });
    fetchHeroCards().then(({ data }) => { if (!cancelled) setHeroCards(data && data.length > 0 ? data : DEMO_HERO_CARDS); });
    fetchListingFieldOptions().then(({ data }) => { if (!cancelled) setFieldOptions(data); });
    return () => { cancelled = true; };
  }, []);

  const content = heroContent || DEFAULT_HERO_CONTENT;
  const cards = heroCards || DEMO_HERO_CARDS;
  const SEARCH_TABS = content.searchTabs?.length ? content.searchTabs : DEFAULT_HERO_CONTENT.searchTabs;
  const QUICK_CTAS = content.quickCtas?.length ? content.quickCtas : DEFAULT_HERO_CONTENT.quickCtas;
  const PROPERTY_TYPES = fieldOptions?.propertyTypes?.length ? fieldOptions.propertyTypes : DEFAULT_PROPERTY_TYPES;
  const BUDGET_RANGES = fieldOptions?.budgetRanges?.length ? fieldOptions.budgetRanges : DEFAULT_BUDGET_RANGES;

  // Derived instead of synced via effect — stays valid even if the admin
  // changes the underlying lists after the page has already loaded.
  const currentTab = activeTab && SEARCH_TABS.includes(activeTab) ? activeTab : SEARCH_TABS[0];
  const currentPropertyType = propertyType && PROPERTY_TYPES.includes(propertyType) ? propertyType : PROPERTY_TYPES[0];

  function handleSearch() {
    if (currentTab === "Post Free Property Ad") {
      onNavigate && onNavigate("post-property");
      return;
    }
    onNavigate && onNavigate("search", {
      transactionType: currentTab === "Rent" ? "Rent" : "Buy",
      types: currentPropertyType ? [currentPropertyType] : [],
    });
  }

  return (
    <div className="font-sans bg-[#FFFFFF]">
      {/* ── Hero Section ── */}
      <section className="bg-[#FFFFFF] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Search Box */}
            <div className="flex-1 min-w-0">
              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-1 leading-tight">
                {content.headlinePrefix}{" "}
                {content.headlineHighlight && (
                  <span className="text-[#1E88E5] font-extrabold">{content.headlineHighlight}</span>
                )}{" "}
                {content.headlineSuffix}
              </h1>
              {content.subtext && (
                <p className="text-[#6B7280] text-sm mb-6 font-medium tracking-wide">{content.subtext}</p>
              )}

              {/* Search Tabs */}
              <div className="flex flex-wrap gap-0 mb-4 border-b border-[#E2E8F0]">
                {SEARCH_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap border-b-2 -mb-px ${
                      currentTab === tab
                        ? "text-[#1E88E5] border-[#1E88E5]"
                        : "text-[#6B7280] border-transparent hover:text-[#1E88E5]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-0 border border-[#E2E8F0] rounded-lg overflow-visible shadow-sm bg-[#FFFFFF]">
                {/* Location */}
                <div className="flex items-center gap-2 px-3 py-3 flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-[#E2E8F0]">
                  <svg className="w-4 h-4 text-[#1E88E5] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search locality, city, project..."
                    className="flex-1 text-sm text-[#1F2937] placeholder-[#6B7280] bg-transparent focus:outline-none min-w-0"
                  />
                </div>

                {/* Property Type Dropdown */}
                <div className="relative border-b sm:border-b-0 sm:border-r border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      setShowPropertyDropdown(!showPropertyDropdown);
                      setShowBudgetDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#1F2937] whitespace-nowrap hover:bg-[#FFFFFF] w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 text-[#1E88E5]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {currentPropertyType}
                    <svg className="w-3.5 h-3.5 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showPropertyDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg shadow-xl z-50 py-1">
                      {PROPERTY_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setPropertyType(type);
                            setShowPropertyDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-[#1F2937] hover:bg-[#EFF6FF] hover:text-[#1E88E5] transition"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Budget Dropdown */}
                <div className="relative border-b sm:border-b-0 sm:border-r border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      setShowBudgetDropdown(!showBudgetDropdown);
                      setShowPropertyDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#1F2937] whitespace-nowrap hover:bg-[#FFFFFF] w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 text-[#1E88E5]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    {budget}
                    <svg className="w-3.5 h-3.5 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showBudgetDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg shadow-xl z-50 py-1">
                      {BUDGET_RANGES.map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setBudget(range);
                            setShowBudgetDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-[#1F2937] hover:bg-[#EFF6FF] hover:text-[#1E88E5] transition"
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 bg-[#1E88E5] text-white px-6 py-3 text-sm font-bold hover:bg-[#1565C0] transition rounded-b-lg sm:rounded-b-none sm:rounded-r-lg whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  Search
                </button>
              </div>

              {/* Quick CTA Strip */}
              {QUICK_CTAS.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {QUICK_CTAS.map((cta, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(onNavigate, cta.linkType, cta.linkValue)}
                      className="text-xs border border-[#E2E8F0] text-[#6B7280] px-3 py-1.5 rounded-full hover:border-[#1E88E5] hover:text-[#1E88E5] transition font-medium"
                    >
                      {cta.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Promo Card */}
            {(content.promoImage || content.promoHeading) && (
              <div className="w-full lg:w-64 shrink-0">
                <div className="rounded-xl overflow-hidden border border-[#E2E8F0] shadow-md bg-gradient-to-br from-[#FFFFFF] to-white">
                  <div className="relative">
                    {content.promoImage && (
                      <img src={content.promoImage} alt="" className="w-full h-40 object-cover" />
                    )}
                    {content.promoBadge && (
                      <div className="absolute top-2 left-2 bg-[#F59E0B] text-[#1F2937] text-[11px] font-bold px-2 py-0.5 rounded">
                        {content.promoBadge}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {content.promoEyebrow && <p className="text-xs text-[#6B7280] font-medium mb-0.5">{content.promoEyebrow}</p>}
                    {content.promoHeading && <p className="text-sm font-bold text-[#1F2937] mb-3">{content.promoHeading}</p>}
                    {content.promoCtaLabel && (
                      <button
                        onClick={() => goTo(onNavigate, content.promoCtaLinkType, content.promoCtaLinkValue)}
                        className="w-full bg-[#1E88E5] text-white text-xs font-bold py-2 rounded hover:bg-[#1565C0] transition"
                      >
                        {content.promoCtaLabel}
                      </button>
                    )}
                    <div className="flex justify-center gap-1.5 mt-3">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={`block w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-[#1E88E5]" : "bg-[#E2E8F0]"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Property Cards Grid ── */}
          {cards.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-[#1F2937] mb-1">
                We've got properties for everyone
              </h2>
              <div className="w-12 h-0.5 bg-[#1E88E5] mb-5 rounded-full" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards.map((card) => (
                  <HeroCard key={card.id} card={card} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
