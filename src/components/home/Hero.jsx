import { useState } from "react";

const NAV_LINKS = [
  { label: "Buy", hasDropdown: true },
  { label: "Rent", hasDropdown: true },
  { label: "Sell", hasDropdown: true },
  { label: "Home Loans", hasDropdown: true },
  { label: "Home Interiors", hasDropdown: true },
  { label: "Investment Advisory", hasDropdown: true, badge: "NEW" },
  { label: "Help", hasDropdown: true },
];

const SEARCH_TABS = ["Buy", "Rent", "New Projects", "Plot", "Commercial", "Post Free Property Ad"];

const PROPERTY_TYPES = [
  "Flat +1",
  "Apartment",
  "Villa",
  "Plot",
  "Commercial",
  "Office Space",
  "Row House",
];

const BUDGET_RANGES = [
  "Under ₹30 Lac",
  "₹30 - 50 Lac",
  "₹50 Lac - 1 Cr",
  "₹1 - 1.5 Cr",
  "₹1.5 - 2 Cr",
  "Above ₹2 Cr",
];

const HERO_CARDS = [
  {
    id: 1,
    count: "12,400+",
    label: "Verified Properties",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
    cta: "Explore",
  },
  {
    id: 2,
    count: "Featured",
    label: "Projects",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop",
    cta: "Explore",
  },
  {
    id: 3,
    count: "580+",
    label: "Budget Homes",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    cta: "Explore",
  },
];

const PROMO_CARD = {
  headline: "Discover Your Dream Property",
  subtext: "Get exclusive access to premium listings & investment insights",
  cta: "Talk to an Expert",
  badge: "Free Consultation",
};

export default function Hero() {
  const [activeTab, setActiveTab] = useState("Buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("Flat +1");
  const [budget, setBudget] = useState("Budget");
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="font-sans min-h-screen bg-white">
      {/* ── Top Nav ── */}
      <header className="bg-[#E03A3C] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-1">
              <span className="text-white font-bold text-xl tracking-tight leading-none">
                property
                <span className="text-yellow-300">Brands</span>
              </span>
            </a>
            <button className="ml-3 flex items-center gap-1 text-white text-sm font-medium opacity-90 hover:opacity-100">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Ranchi</span>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="text-white text-sm font-medium hover:text-yellow-200 transition hidden sm:block">
              PB Prime
            </button>
            <button className="text-white text-sm font-medium hover:text-yellow-200 transition">
              Login
            </button>
            <button className="bg-white text-[#E03A3C] text-sm font-bold px-4 py-1.5 rounded hover:bg-yellow-50 transition flex items-center gap-1.5 shadow">
              Post Property
              <span className="bg-[#E03A3C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">FREE</span>
            </button>
          </div>
        </div>

        {/* ── Secondary Nav ── */}
        <nav className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href="#"
                    className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#E03A3C] whitespace-nowrap transition border-b-2 border-transparent hover:border-[#E03A3C]"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="bg-green-500 text-white text-[9px] font-bold px-1 py-0.5 rounded ml-0.5 leading-none">
                        {link.badge}
                      </span>
                    )}
                    {link.hasDropdown && (
                      <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* ── Hero Section ── */}
      <section className="bg-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Search Box */}
            <div className="flex-1 min-w-0">
              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 leading-tight">
                Start your{" "}
                <span className="text-[#E03A3C] font-extrabold">#DiscoverInvestGrow</span>{" "}
                Journey
              </h1>
              <p className="text-gray-400 text-sm mb-6 font-medium tracking-wide">
                Discover. Invest. Build. Grow. Compare. Discuss. Decide.
              </p>

              {/* Search Tabs */}
              <div className="flex flex-wrap gap-0 mb-4 border-b border-gray-200">
                {SEARCH_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap border-b-2 -mb-px ${
                      activeTab === tab
                        ? "text-[#E03A3C] border-[#E03A3C]"
                        : "text-gray-500 border-transparent hover:text-[#E03A3C]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-0 border border-gray-300 rounded-lg overflow-visible shadow-sm bg-white">
                {/* Location */}
                <div className="flex items-center gap-2 px-3 py-3 flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <svg className="w-4 h-4 text-[#E03A3C] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search locality, city, project..."
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none min-w-0"
                  />
                </div>

                {/* Property Type Dropdown */}
                <div className="relative border-b sm:border-b-0 sm:border-r border-gray-200">
                  <button
                    onClick={() => {
                      setShowPropertyDropdown(!showPropertyDropdown);
                      setShowBudgetDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 whitespace-nowrap hover:bg-gray-50 w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 text-[#E03A3C]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {propertyType}
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showPropertyDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                      {PROPERTY_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setPropertyType(type);
                            setShowPropertyDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E03A3C] transition"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Budget Dropdown */}
                <div className="relative border-b sm:border-b-0 sm:border-r border-gray-200">
                  <button
                    onClick={() => {
                      setShowBudgetDropdown(!showBudgetDropdown);
                      setShowPropertyDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 whitespace-nowrap hover:bg-gray-50 w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 text-[#E03A3C]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    {budget}
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showBudgetDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1">
                      {BUDGET_RANGES.map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setBudget(range);
                            setShowBudgetDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-[#E03A3C] transition"
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button className="flex items-center justify-center gap-2 bg-[#E03A3C] text-white px-6 py-3 text-sm font-bold hover:bg-red-700 transition rounded-b-lg sm:rounded-b-none sm:rounded-r-lg whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  Search
                </button>
              </div>

              {/* Quick CTA Strip */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["Explore Properties", "Schedule Site Visit", "Calculate EMI", "Talk to an Expert"].map((cta) => (
                  <button
                    key={cta}
                    className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-full hover:border-[#E03A3C] hover:text-[#E03A3C] transition font-medium"
                  >
                    {cta}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Promo Card */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="rounded-xl overflow-hidden border border-gray-100 shadow-md bg-gradient-to-br from-red-50 to-white">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=200&fit=crop"
                    alt="Interior design"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[11px] font-bold px-2 py-0.5 rounded">
                    Save 40%
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Get Home Interiors from</p>
                  <p className="text-sm font-bold text-gray-900 mb-3">Top Architects & Designers</p>
                  <button className="w-full bg-[#E03A3C] text-white text-xs font-bold py-2 rounded hover:bg-red-700 transition">
                    Check Offers
                  </button>
                  <div className="flex justify-center gap-1.5 mt-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className={`block w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-[#E03A3C]" : "bg-gray-300"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Property Cards Grid ── */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              We've got properties for everyone
            </h2>
            <div className="w-12 h-0.5 bg-[#E03A3C] mb-5 rounded-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1 – Verified Listings */}
              <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=260&fit=crop"
                  alt="Owner Properties"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-white text-2xl font-extrabold leading-tight">12,400+</p>
                  <p className="text-white text-sm font-semibold">Verified Listings</p>
                  <span className="inline-flex items-center gap-1 text-white text-xs mt-1 hover:underline font-medium">
                    Explore
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Card 2 – Featured Projects */}
              <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition">
                <img
                  src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=260&fit=crop"
                  alt="Featured Projects"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-white text-2xl font-extrabold leading-tight">Projects</p>
                  <p className="text-white text-sm font-semibold">Featured Developers</p>
                  <span className="inline-flex items-center gap-1 text-white text-xs mt-1 hover:underline font-medium">
                    Explore
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Card 3 – Promo */}
              <div className="relative rounded-xl overflow-hidden bg-[#E03A3C] group cursor-pointer shadow-sm hover:shadow-lg transition flex flex-col justify-between p-4 h-44">
                <div>
                  <p className="text-white font-bold text-base leading-tight mb-1">
                    Discover Your<br />Dream Property
                  </p>
                  <p className="text-red-100 text-xs">
                    Exclusive access to premium listings & investment insights
                  </p>
                </div>
                <button className="self-start bg-white text-[#E03A3C] text-xs font-bold px-4 py-2 rounded-full hover:bg-yellow-50 transition">
                  Talk to an Expert
                </button>
              </div>

              {/* Card 4 – Budget Homes */}
              <div className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop"
                  alt="Budget Homes"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-white text-2xl font-extrabold leading-tight">580+</p>
                  <p className="text-white text-sm font-semibold">Budget Homes</p>
                  <span className="inline-flex items-center gap-1 text-white text-xs mt-1 hover:underline font-medium">
                    Explore
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
