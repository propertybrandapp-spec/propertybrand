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
    <div className="font-sans min-h-screen bg-[#FFFFFF]">
      {/* ── Top Nav ── */}

      {/* ── Hero Section ── */}
      <section className="bg-[#FFFFFF] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Search Box */}
            <div className="flex-1 min-w-0">
              {/* Headline */}
              <h1 className="text-3xl md:text-4xl font-bold text-[#15191C] mb-1 leading-tight">
                Start your{" "}
                <span className="text-[#2C9DD5] font-extrabold">#DiscoverInvestGrow</span>{" "}
                Journey
              </h1>
              <p className="text-[#5B6670] text-sm mb-6 font-medium tracking-wide">
                Discover. Invest. Build. Grow. Compare. Discuss. Decide.
              </p>

              {/* Search Tabs */}
              <div className="flex flex-wrap gap-0 mb-4 border-b border-[#E5E8EB]">
                {SEARCH_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap border-b-2 -mb-px ${
                      activeTab === tab
                        ? "text-[#2C9DD5] border-[#2C9DD5]"
                        : "text-[#5B6670] border-transparent hover:text-[#2C9DD5]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-0 border border-[#D6DADD] rounded-lg overflow-visible shadow-sm bg-[#FFFFFF]">
                {/* Location */}
                <div className="flex items-center gap-2 px-3 py-3 flex-1 min-w-0 border-b sm:border-b-0 sm:border-r border-[#E5E8EB]">
                  <svg className="w-4 h-4 text-[#2C9DD5] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search locality, city, project..."
                    className="flex-1 text-sm text-[#1F242A] placeholder-[#5B6670] bg-transparent focus:outline-none min-w-0"
                  />
                </div>

                {/* Property Type Dropdown */}
                <div className="relative border-b sm:border-b-0 sm:border-r border-[#E5E8EB]">
                  <button
                    onClick={() => {
                      setShowPropertyDropdown(!showPropertyDropdown);
                      setShowBudgetDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#1F242A] whitespace-nowrap hover:bg-[#FFFFFF] w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 text-[#2C9DD5]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {propertyType}
                    <svg className="w-3.5 h-3.5 text-[#5B6670]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showPropertyDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-[#FFFFFF] border border-[#E5E8EB] rounded-lg shadow-xl z-50 py-1">
                      {PROPERTY_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setPropertyType(type);
                            setShowPropertyDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-[#1F242A] hover:bg-[#1a0a0a] hover:text-[#2C9DD5] transition"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Budget Dropdown */}
                <div className="relative border-b sm:border-b-0 sm:border-r border-[#E5E8EB]">
                  <button
                    onClick={() => {
                      setShowBudgetDropdown(!showBudgetDropdown);
                      setShowPropertyDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#1F242A] whitespace-nowrap hover:bg-[#FFFFFF] w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 text-[#2C9DD5]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    {budget}
                    <svg className="w-3.5 h-3.5 text-[#5B6670]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showBudgetDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-[#FFFFFF] border border-[#E5E8EB] rounded-lg shadow-xl z-50 py-1">
                      {BUDGET_RANGES.map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setBudget(range);
                            setShowBudgetDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-[#1F242A] hover:bg-[#1a0a0a] hover:text-[#2C9DD5] transition"
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button className="flex items-center justify-center gap-2 bg-[#BA0D0B] text-white px-6 py-3 text-sm font-bold hover:bg-[#5C0B03] transition rounded-b-lg sm:rounded-b-none sm:rounded-r-lg whitespace-nowrap">
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
                    className="text-xs border border-[#D6DADD] text-[#5B6670] px-3 py-1.5 rounded-full hover:border-[#2C9DD5] hover:text-[#2C9DD5] transition font-medium"
                  >
                    {cta}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Promo Card */}
            <div className="w-full lg:w-64 shrink-0">
              <div className="rounded-xl overflow-hidden border border-[#E5E8EB] shadow-md bg-gradient-to-br from-[#FFFFFF] to-white">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=200&fit=crop"
                    alt="Interior design"
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#E87C02] text-[#15191C] text-[11px] font-bold px-2 py-0.5 rounded">
                    Save 40%
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#5B6670] font-medium mb-0.5">Get Home Interiors from</p>
                  <p className="text-sm font-bold text-[#15191C] mb-3">Top Architects & Designers</p>
                  <button className="w-full bg-[#BA0D0B] text-white text-xs font-bold py-2 rounded hover:bg-[#5C0B03] transition">
                    Check Offers
                  </button>
                  <div className="flex justify-center gap-1.5 mt-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className={`block w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-[#2C9DD5]" : "bg-[#D6DADD]"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Property Cards Grid ── */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-[#15191C] mb-1">
              We've got properties for everyone
            </h2>
            <div className="w-12 h-0.5 bg-[#2C9DD5] mb-5 rounded-full" />

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
              <div className="relative rounded-xl overflow-hidden bg-[#BA0D0B] group cursor-pointer shadow-sm hover:shadow-lg transition flex flex-col justify-between p-4 h-44">
                <div>
                  <p className="text-white font-bold text-base leading-tight mb-1">
                    Discover Your<br />Dream Property
                  </p>
                  <p className="text-[#5B6670] text-xs">
                    Exclusive access to premium listings & investment insights
                  </p>
                </div>
                <button className="self-start bg-[#15191C] text-[#BA0D0B] text-xs font-bold px-4 py-2 rounded-full hover:bg-[#F2F4F6] transition">
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
