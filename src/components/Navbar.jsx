import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import AuthModal from "./AuthModal";
import ClientAccountMenu from "./ClientAccountMenu";
import SelectMembershipModal from "./SelectMembershipModal";
import BookExpertModal from "./BookExpertModal";

import { SERVICE_CITIES as CITIES } from "../lib/cities";

// ── REDESIGNED 6-PILLAR MASTER NAVIGATION ────────────────────────────────────
// As specified in the Discover Website blueprint:
// 1. Discover: Buy, rent, sell and lease every type of property.
// 2. Invest: REITs, income-generating assets, shared ownership and land opportunities.
// 3. Land & Develop: Land acquisition, feasibility, due diligence, construction and JDA.
// 4. Legal & Finance: Documentation, agreements, professional verification and loans.
// 5. Build & Move: Architecture, interiors, materials, logistics and relocation.
// 6. Own & Manage: Property management, rentals, maintenance and resale.
const NAV_ITEMS = [
  {
    label: "Discover",
    tagline: "Buy · Rent · Sell · Lease",
    columns: [
      {
        heading: "Buy Properties",
        links: [
          { label: "Residential Apartments & Villas", page: "search", filters: { transactionType: "Buy", types: ["Apartment", "Villa"] } },
          { label: "Luxury & Gated Communities", page: "search", filters: { transactionType: "Buy", tags: ["Luxury", "Gated Community"] } },
          { label: "Commercial Offices & Retail", page: "search", filters: { transactionType: "Buy", types: ["Commercial", "Office Space", "Shop / Showroom"] } },
          { label: "Industrial & Logistics Sheds", page: "search", filters: { transactionType: "Buy", types: ["Warehouse / Industrial Shed"] } },
          { label: "Residential & Commercial Plots", page: "search", filters: { transactionType: "Buy", types: ["Plot"] } },
          { label: "All Properties for Sale", page: "search", filters: { transactionType: "Buy" } },
        ],
      },
      {
        heading: "Rent & Lease",
        links: [
          { label: "Apartments & Independent Homes", page: "search", filters: { transactionType: "Rent", types: ["Apartment", "Independent House"] } },
          { label: "Commercial Offices & Retail", page: "search", filters: { transactionType: "Rent", types: ["Commercial", "Office Space", "Shop / Showroom"] } },
          { label: "Co-Living & Student Housing", page: "search", filters: { transactionType: "Rent", tags: ["Co-living", "Student Accommodation"] } },
          { label: "Warehouses & Storage Facilities", page: "search", filters: { transactionType: "Rent", types: ["Warehouse / Industrial Shed"] } },
          { label: "RentReady™ Digital Agreement", page: "rent-ready" },
          { label: "All Rental Properties", page: "search", filters: { transactionType: "Rent" } },
        ],
      },
      {
        heading: "Direct Portals",
        links: [
          { label: "Post Property (100% Free)", page: "post-property" },
          { label: "Channel Partner Network", page: "channel-partner" },
          { label: "Preferred Agents Directory", page: "agents" },
          { label: "Client Inquiries Dashboard", page: "inquiries" },
        ],
      },
    ],
  },
  {
    label: "Invest",
    tagline: "REITs · Shared · Income",
    columns: [
      {
        heading: "Investment Opportunities",
        links: [
          { label: "High Growth Corridors", page: "investment-advisory", anchor: "high-growth-corridors" },
          { label: "Rental Yield Opportunities", page: "investment-advisory", anchor: "rental-yield-opportunities" },
          { label: "Commercial Pre-Leased Assets", page: "investment-advisory", anchor: "commercial-investments" },
          { label: "Land Banking & Strategic Plots", page: "investment-advisory", anchor: "land-banking" },
          { label: "Retirement & Senior Living Hub", page: "lifestyle" },
          { label: "NRI Investment Advisory", page: "investment-advisory", anchor: "nri-investments" },
        ],
      },
      {
        heading: "Calculators & Advisory",
        links: [
          { label: "ROI & Cap Rate Calculator", page: "investment-advisory", anchor: "roi-calculator" },
          { label: "Rental Yield Calculator", page: "investment-advisory", anchor: "rental-yield-calculator" },
          { label: "Book Investment Consultant", page: "modal:book-expert", consultTopic: "investment" },
          { label: "Select Invest Membership", page: "modal:membership" },
        ],
      },
    ],
  },
  {
    label: "Land & Develop",
    tagline: "Buy · Verify · Build",
    columns: [
      {
        heading: "Land Opportunities",
        links: [
          { label: "Buy Residential & Commercial Plots", page: "search", filters: { transactionType: "Buy", types: ["Plot"] } },
          { label: "Farmland & Agricultural Land", page: "search", filters: { transactionType: "Buy", types: ["Agricultural Land", "Farmhouse"] } },
          { label: "Joint Development (JDA) Matching", page: "land-develop" },
          { label: "List Land for Sale / JDA", page: "post-property" },
        ],
      },
      {
        heading: "Verification & Development",
        links: [
          { label: "Land Title & 30-Yr Encumbrance Check", page: "modal:book-expert", consultTopic: "legal" },
          { label: "Zoning & Conversion Feasibility", page: "land-develop" },
          { label: "Architects & Turnkey Builders", page: "modal:book-expert", consultTopic: "land" },
          { label: "Land & Development Hub", page: "land-develop" },
        ],
      },
    ],
  },
  {
    label: "Legal & Finance",
    tagline: "Agreements · Loans · Checks",
    columns: [
      {
        heading: "Agreements & Contracts",
        links: [
          { label: "RentReady™ Digital Agreement", page: "rent-ready" },
          { label: "Commercial Lease Agreements", page: "modal:book-expert", consultTopic: "legal" },
          { label: "Sale Agreement & MOU Review", page: "contact", anchor: "legal" },
        ],
      },
      {
        heading: "Home Loans & Financing",
        links: [
          { label: "Home Loan Assistance", page: "investment-advisory", anchor: "emi-calculator" },
          { label: "EMI Calculator", page: "investment-advisory", anchor: "emi-calculator" },
          { label: "Loan Eligibility Check", page: "investment-advisory", anchor: "eligibility-check" },
          { label: "Bank Rate Comparison", page: "investment-advisory", anchor: "loan-comparison" },
        ],
      },
      {
        heading: "Legal Due Diligence",
        links: [
          { label: "Title Verification & Search Report", page: "modal:book-expert", consultTopic: "legal" },
          { label: "What is RERA? Guide & Checks", page: "faq", anchor: "what-is-rera" },
          { label: "Property Snagging & Inspection", page: "build-move" },
        ],
      },
    ],
  },
  {
    label: "Build & Move",
    tagline: "Design · Materials · Shifting",
    columns: [
      {
        heading: "Architecture & Interiors",
        links: [
          { label: "House Planning & Structural Vetting", page: "architects-design", anchor: "house-planning" },
          { label: "Residential Design Consultation", page: "architects-design", anchor: "residential-design" },
          { label: "Modular Kitchen Design", page: "architects-design", anchor: "modular-kitchen" },
          { label: "Turnkey Interior Packages", page: "architects-design", anchor: "interior-packages" },
        ],
      },
      {
        heading: "Materials & Relocation",
        links: [
          { label: "Building Materials Marketplace Connect", page: "build-move" },
          { label: "Packers & Movers Shifting Quotes", page: "build-move" },
          { label: "Pre-Possession Snagging & Inspection", page: "build-move" },
          { label: "Move-In Deep Cleaning & Sanitization", page: "rent-ready" },
        ],
      },
    ],
  },
  {
    label: "Manage",
    tagline: "Rentals · Maintenance · Resale",
    columns: [
      {
        heading: "Rental Management",
        links: [
          { label: "Tenant Sourcing & Screening", page: "property-management", anchor: "tenant-management" },
          { label: "Automated Rent Collection", page: "property-management", anchor: "rent-collection" },
          { label: "Move-In & Move-Out Inspections", page: "rent-ready" },
        ],
      },
      {
        heading: "Property Care & Resale",
        links: [
          { label: "Maintenance & Repairs Coordination", page: "property-management", anchor: "maintenance-coordination" },
          { label: "Remote Care for NRIs & Investors", page: "property-management" },
          { label: "Property Valuation & Resale Assistance", page: "contact", anchor: "resale" },
          { label: "Second Home & Farmhouse Care", page: "lifestyle" },
        ],
      },
    ],
  },
];

function ChevronDown({ className = "" }) {
  return (
    <svg className={`w-3 h-3 transition-transform duration-200 ${className}`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function DropdownMenu({ item, isOpen, onNavigate, onOpenModal }) {
  const panelRef = useRef(null);
  const [align, setAlign] = useState("left");

  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) return;
    setAlign("left");
    const raf = requestAnimationFrame(() => {
      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth - 16) {
        setAlign("right");
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  if (!isOpen || !item.columns) return null;

  return (
    <div
      ref={panelRef}
      className={`absolute top-full mt-1 z-50 min-w-max shadow-2xl rounded-2xl overflow-hidden border border-blue-100 bg-white animate-fade-in ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      <div className="flex gap-0 divide-x divide-gray-100 p-2">
        {item.columns.map((col) => (
          <div key={col.heading} className="px-5 py-4 min-w-[200px]">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-blue-900">
              {col.heading}
            </p>
            <ul className="space-y-1">
              {col.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.page === "modal:membership") {
                        onOpenModal("membership");
                      } else if (link.page === "modal:book-expert") {
                        onOpenModal("expert", link.consultTopic);
                      } else if (onNavigate) {
                        onNavigate(link.page, link.filters || link.anchor);
                      }
                    }}
                    className="text-xs text-gray-600 hover:text-blue-700 hover:font-medium block py-1 transition-colors text-left w-full"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="bg-gray-50/80 px-5 py-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
        <span className="font-medium text-blue-900">{item.tagline}</span>
        <span className="text-gray-400">Verified by Property Brands</span>
      </div>
    </div>
  );
}

function CityDropdown({ selectedCity, onSelect, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 text-gray-800 transition"
      >
        <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span>{selectedCity}</span>
        <ChevronDown className={isOpen ? "rotate-180" : ""} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-48 max-h-80 overflow-y-auto rounded-xl shadow-2xl z-50 py-2 bg-white border border-gray-200 animate-fade-in">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-1 text-gray-400">Select City</p>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => onSelect(city)}
              className={`block w-full text-left px-3 py-1.5 text-xs transition ${
                city === selectedCity ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ onNavigate, currentPage }) {
  const { isLoggedIn, profile } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [expertInitialTopic, setExpertInitialTopic] = useState(null);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bhubaneswar");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setCityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleMouseEnter(label) {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(label);
    setCityOpen(false);
  }

  function handleMouseLeave() {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 120);
  }

  function handleCitySelect(city) {
    setSelectedCity(city);
    setCityOpen(false);
    onNavigate && onNavigate("search", { location: city });
  }

  function openModalHandler(type, topic) {
    setActiveDropdown(null);
    if (type === "membership") {
      setMembershipModalOpen(true);
    } else if (type === "expert") {
      setExpertInitialTopic(topic || "investment");
      setExpertModalOpen(true);
    }
  }

  return (
    <header ref={navRef} className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* ── TOP PRIMARY BAR ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => onNavigate && onNavigate("home")}
            className="flex items-center gap-3 text-left group"
          >
            <img
              src="/cropped_logo.png"
              alt="PropertyBrands"
              className="h-11 w-auto object-contain"
            />
            <div className="hidden sm:flex flex-col border-l border-gray-200 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 leading-tight">
                Property Brands
              </span>
              <span className="text-[10px] font-semibold text-gray-500 tracking-tight">
                Discover · Invest · Build · Manage
              </span>
            </div>
          </button>

          {/* City Selector */}
          <CityDropdown
            selectedCity={selectedCity}
            onSelect={handleCitySelect}
            isOpen={cityOpen}
            onToggle={() => {
              setCityOpen(!cityOpen);
              setActiveDropdown(null);
            }}
          />
        </div>

        {/* Right Action Cluster */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Select Membership CTA */}
          <button
            onClick={() => setMembershipModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm hover:shadow hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
              color: "#FFFFFF",
            }}
          >
            <span className="text-amber-300">✨</span>
            <span>Select Membership</span>
          </button>

          {/* Book an Expert CTA */}
          <button
            onClick={() => {
              setExpertInitialTopic("investment");
              setExpertModalOpen(true);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 text-blue-800 hover:bg-blue-50 transition"
          >
            Book an Expert
          </button>

          <div className="w-px h-5 bg-gray-200" />

          {/* User Sign In / Account */}
          {isLoggedIn ? (
            <ClientAccountMenu onNavigate={onNavigate} />
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold text-gray-700 hover:text-blue-700 transition"
            >
              Sign In
            </button>
          )}

          {/* Post Property / List a Project */}
          <button
            onClick={() => onNavigate && onNavigate("post-property")}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-sm transition hover:shadow-md hover:bg-blue-700 text-white"
            style={{ background: "#1565C0" }}
          >
            <span>Post Property / Project</span>
            <span className="rounded px-1.5 py-0.5 text-[9px] font-black bg-amber-400 text-gray-950">
              FREE
            </span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg border border-gray-200 p-1.5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-800 transition ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-800 transition ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-800 transition ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* ── SECONDARY 6-PILLAR NAVIGATION STRIP ── */}
      <nav className="hidden lg:block border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ul className="flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isOpen = activeDropdown === item.label;
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => {
                      if (item.label === "Discover") onNavigate && onNavigate("search");
                      if (item.label === "Invest") onNavigate && onNavigate("investment-advisory");
                      if (item.label === "Land & Develop") onNavigate && onNavigate("land-develop");
                      if (item.label === "Build & Move") onNavigate && onNavigate("build-move");
                      if (item.label === "Manage") onNavigate && onNavigate("property-management");
                      if (item.label === "Legal & Finance") onNavigate && onNavigate("rent-ready");
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px ${
                      isOpen
                        ? "text-blue-700 border-blue-600 bg-blue-50/50"
                        : "text-gray-700 border-transparent hover:text-blue-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={isOpen ? "rotate-180 text-blue-600" : "text-gray-400"} />
                  </button>

                  <DropdownMenu
                    item={item}
                    isOpen={isOpen}
                    onNavigate={onNavigate}
                    onOpenModal={openModalHandler}
                  />
                </li>
              );
            })}

            {/* Quick RentReady link pill */}
            <li className="ml-auto">
              <button
                onClick={() => onNavigate && onNavigate("rent-ready")}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 transition"
              >
                <span>⚡</span> RentReady™ Agreement
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-200">
            <button
              onClick={() => {
                setMobileOpen(false);
                setMembershipModalOpen(true);
              }}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"
            >
              ✨ Select Membership
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                setExpertModalOpen(true);
              }}
              className="py-2 px-3 rounded-xl text-xs font-bold bg-gray-100 text-gray-800"
            >
              Book an Expert
            </button>
          </div>

          {/* 6 Pillars Accordion in Mobile */}
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-3 bg-gray-50 flex items-center justify-between font-bold text-xs text-gray-900">
                  <span>{item.label}</span>
                  <span className="text-[10px] font-normal text-gray-500">{item.tagline}</span>
                </div>
                <div className="p-3 space-y-3 bg-white">
                  {item.columns.map((col) => (
                    <div key={col.heading}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-900 mb-1">
                        {col.heading}
                      </p>
                      <div className="space-y-1 pl-1">
                        {col.links.map((link) => (
                          <button
                            key={link.label}
                            onClick={() => {
                              setMobileOpen(false);
                              if (link.page === "modal:membership") setMembershipModalOpen(true);
                              else if (link.page === "modal:book-expert") openModalHandler("expert", link.consultTopic);
                              else if (onNavigate) onNavigate(link.page, link.filters || link.anchor);
                            }}
                            className="block text-left text-xs text-gray-600 hover:text-blue-600 py-0.5"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom mobile actions */}
          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                onNavigate && onNavigate("post-property");
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white text-center shadow"
              style={{ background: "#1565C0" }}
            >
              Post Property / Project (FREE)
            </button>
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs border border-gray-300 text-gray-800"
              >
                Sign In / Register
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onNavigate && onNavigate("profile");
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs border border-gray-300 text-gray-800"
              >
                My Account
              </button>
            )}
          </div>
        </div>
      )}

      {/* Global Modals triggered from Navbar */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SelectMembershipModal
        isOpen={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
        onNavigate={onNavigate}
      />
      <BookExpertModal
        isOpen={expertModalOpen}
        onClose={() => setExpertModalOpen(false)}
        initialTopic={expertInitialTopic}
      />
    </header>
  );
}
