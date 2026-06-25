import { useState, useRef, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import AuthModal from "./AuthModal";
import ClientAccountMenu from "./ClientAccountMenu";

const CITIES = [
  "Ranchi", "Delhi", "Mumbai", "Bangalore", "Hyderabad",
  "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur",
];

// ── NAV URL MAP ───────────────────────────────────────────────────────────────
// Paste real URLs/page-ids here for each nav destination. To point any link
// elsewhere, just change the value on the right — no need to touch markup below.
const NAV_URL_MAP = {
  // Buy Property (per spec: Residential / Commercial / Plotted Developments)
  readyToMove: "search",
  underConstruction: "search",
  luxuryApartments: "search",
  affordableHousing: "search",
  gatedCommunities: "search",
  villasRowHouses: "search",
  residentialPlots: "search",
  officeSpaces: "search",
  retailSpaces: "search",
  industrialProperties: "search",

  // Rent Property (per spec: Rental Services)
  rentApartments: "search",
  rentVillas: "search",
  rentOfficeSpaces: "search",
  rentShops: "search",
  coLivingSpaces: "search",
  studentAccommodation: "search",

  // Investment Advisory (per spec)
  highGrowthCorridors: "home",
  rentalYieldOpportunities: "home",
  commercialInvestments: "home",
  landBanking: "home",
  retirementHomes: "home",
  nriInvestments: "home",
  roiCalculator: "home",
  rentalYieldCalculator: "home",

  // Home Loan Assistance (per spec)
  emiCalculator: "home",
  eligibilityCheck: "home",
  loanComparison: "home",

  // Architects & Interior Design (per spec)
  housePlanning: "property-management",
  residentialDesign: "property-management",
  modularKitchen: "property-management",
  interiorPackages: "property-management",

  // Property Management (per spec)
  tenantManagement: "property-management",
  rentCollection: "property-management",
  maintenanceCoordination: "property-management",

  // Help (per spec: FAQ + Contact)
  howToBuy: "home",
  howToRent: "home",
  howToApplyLoan: "home",
  whatIsRera: "home",
  howToCalculateEmi: "home",
  howToRentProperty: "home",
  blog: "blog",
  contact: "contact",
};

const NAV_ITEMS = [
  {
    label: "Buy",
    columns: [
      {
        heading: "Residential Properties",
        links: [
          { label: "Ready-to-Move Apartments", page: NAV_URL_MAP.readyToMove },
          { label: "Under Construction Projects", page: NAV_URL_MAP.underConstruction },
          { label: "Luxury Apartments", page: NAV_URL_MAP.luxuryApartments },
          { label: "Affordable Housing", page: NAV_URL_MAP.affordableHousing },
          { label: "Gated Communities", page: NAV_URL_MAP.gatedCommunities },
          { label: "Villas & Row Houses", page: NAV_URL_MAP.villasRowHouses },
          { label: "Residential Plots", page: NAV_URL_MAP.residentialPlots },
        ],
      },
      {
        heading: "Commercial Properties",
        links: [
          { label: "Office Spaces", page: NAV_URL_MAP.officeSpaces },
          { label: "Retail Spaces", page: NAV_URL_MAP.retailSpaces },
          { label: "Industrial Properties", page: NAV_URL_MAP.industrialProperties },
        ],
      },
    ],
  },
  {
    label: "Rent",
    columns: [
      {
        heading: "Rental Properties",
        links: [
          { label: "Apartments", page: NAV_URL_MAP.rentApartments },
          { label: "Villas", page: NAV_URL_MAP.rentVillas },
          { label: "Office Spaces", page: NAV_URL_MAP.rentOfficeSpaces },
          { label: "Shops", page: NAV_URL_MAP.rentShops },
          { label: "Co-living Spaces", page: NAV_URL_MAP.coLivingSpaces },
          { label: "Student Accommodation", page: NAV_URL_MAP.studentAccommodation },
        ],
      },
    ],
  },
  {
    label: "Investment Advisory",
    columns: [
      {
        heading: "Investment Options",
        links: [
          { label: "High Growth Corridors", page: NAV_URL_MAP.highGrowthCorridors },
          { label: "Rental Yield Opportunities", page: NAV_URL_MAP.rentalYieldOpportunities },
          { label: "Commercial Investments", page: NAV_URL_MAP.commercialInvestments },
          { label: "Land Banking Opportunities", page: NAV_URL_MAP.landBanking },
          { label: "Retirement Homes", page: NAV_URL_MAP.retirementHomes },
          { label: "NRI Investments", page: NAV_URL_MAP.nriInvestments },
        ],
      },
      {
        heading: "Investment Tools",
        links: [
          { label: "ROI Calculator", page: NAV_URL_MAP.roiCalculator },
          { label: "Rental Yield Calculator", page: NAV_URL_MAP.rentalYieldCalculator },
        ],
      },
    ],
  },
  {
    label: "Home Loans",
    columns: [
      {
        heading: "Home Loan Assistance",
        links: [
          { label: "EMI Calculator", page: NAV_URL_MAP.emiCalculator },
          { label: "Eligibility Check", page: NAV_URL_MAP.eligibilityCheck },
          { label: "Loan Comparison", page: NAV_URL_MAP.loanComparison },
        ],
      },
    ],
  },
  {
    label: "Architects & Design",
    columns: [
      {
        heading: "Architects & Design Consultation",
        links: [
          { label: "House Planning", page: NAV_URL_MAP.housePlanning },
          { label: "Residential Design", page: NAV_URL_MAP.residentialDesign },
        ],
      },
      {
        heading: "Interior Design Services",
        links: [
          { label: "Modular Kitchen Design", page: NAV_URL_MAP.modularKitchen },
          { label: "Interior Packages", page: NAV_URL_MAP.interiorPackages },
        ],
      },
    ],
  },
  {
    label: "Property Management",
    columns: [
      {
        heading: "Complete Property Care",
        links: [
          { label: "Tenant Management", page: NAV_URL_MAP.tenantManagement },
          { label: "Rent Collection", page: NAV_URL_MAP.rentCollection },
          { label: "Maintenance Coordination", page: NAV_URL_MAP.maintenanceCoordination },
        ],
      },
    ],
  },
  {
    label: "Help",
    columns: [
      {
        heading: "FAQ",
        links: [
          { label: "How to Buy a Property", page: NAV_URL_MAP.howToBuy },
          { label: "How to Apply for a Home Loan", page: NAV_URL_MAP.howToApplyLoan },
          { label: "What is RERA?", page: NAV_URL_MAP.whatIsRera },
          { label: "How to Calculate EMI", page: NAV_URL_MAP.howToCalculateEmi },
          { label: "How to Rent a Property", page: NAV_URL_MAP.howToRentProperty },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Real Estate Blog", page: NAV_URL_MAP.blog },
          { label: "Contact Us", page: NAV_URL_MAP.contact },
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

function DropdownMenu({ item, isOpen, onNavigate,index }) {
  if (!isOpen || !item.columns) return null;
  return (
<div
  className={`absolute top-full mt-0 z-50 min-w-max ${
    index <= 1
      ? "left-0"
      : "left-1/2 -translate-x-1/2"
  }`}
>
        <div
  className={`flex ${
    index === 0
      ? "justify-start pl-8"
      : index === 1
      ? "justify-start pl-9"
      : "justify-center"
  }`}
>
        <div className="w-3 h-3 rotate-45 -mb-1.5 z-10 relative border-l border-t" style={{ background: "#FFFFFF", borderColor: "#2C9DD5" }} />
      </div>
      <div className="rounded-xl shadow-2xl overflow-hidden border" style={{ background: "#FFFFFF", borderColor: "#2C9DD5" }}>
        <div className="flex gap-0 divide-x" style={{ borderColor: "#2C9DD5" }}>
          {item.columns.map((col) => (
            <div key={col.heading} className="px-5 pb-5 pt-7 min-w-[180px]" style={{ borderColor: "#2C9DD5" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#2C9DD5" }}>{col.heading}</p>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button onClick={() => onNavigate && onNavigate(link.page)} className="text-sm block py-0.5 transition-colors text-left w-full" style={{ color: "#495057" }}
                      onMouseEnter={e => e.target.style.color = "#2C9DD5"}
                      onMouseLeave={e => e.target.style.color = "#495057"}>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CityDropdown({ selectedCity, onSelect, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center gap-1.5 text-sm font-medium transition ml-3" style={{ color: "#15191C" }}>
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">{selectedCity}</span>
        <ChevronDown className={isOpen ? "rotate-180" : ""} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-44 rounded-xl shadow-2xl z-50 py-2 overflow-hidden border" style={{ background: "#FFFFFF", borderColor: "#2C9DD5" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-1" style={{ color: "#2C9DD5" }}>Select City</p>
          {CITIES.map((city) => (
            <button key={city} onClick={() => onSelect(city)}
              className="block w-full text-left px-3 py-2 text-sm transition"
              style={{ color: city === selectedCity ? "#2C9DD5" : "#495057" }}
              onMouseEnter={e => e.currentTarget.style.color = "#2C9DD5"}
              onMouseLeave={e => e.currentTarget.style.color = city === selectedCity ? "#2C9DD5" : "#495057"}>
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavItem({ item, onNavigate, onLinkClick }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0" style={{ borderColor: "#2C9DD5" }}>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold" style={{ color: "#15191C" }}>
        <span className="flex items-center gap-2">
          {item.label}
          {item.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#E87C02", color: "#FFFFFF" }}>{item.badge}</span>}
        </span>
        <ChevronDown className={open ? "rotate-180" : ""} style={{ color: open ? "#2C9DD5" : "#495057" }} />
      </button>
      {open && item.columns && (
        <div className="px-5 pb-4" style={{ background: "#FFFFFF" }}>
          {item.columns.map((col) => (
            <div key={col.heading} className="mt-3">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#2C9DD5" }}>{col.heading}</p>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => { onNavigate && onNavigate(link.page); onLinkClick && onLinkClick(); }}
                      className="text-sm block py-0.5 transition text-left w-full"
                      style={{ color: "#495057" }}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ onNavigate }) {
  const { isLoggedIn } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bhubaneswar");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) { setActiveDropdown(null); setCityOpen(false); }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleResize() { if (window.innerWidth >= 1024) setMobileOpen(false); }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleMouseEnter(label) { clearTimeout(timeoutRef.current); setActiveDropdown(label); setCityOpen(false); }
  function handleMouseLeave() { timeoutRef.current = setTimeout(() => setActiveDropdown(null), 120); }
  function handleCitySelect(city) { setSelectedCity(city); setCityOpen(false); }

  return (
    <header ref={navRef} className="sticky top-0 z-50">
      {/* Top Bar */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #2C9DD5" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="font-extrabold text-[22px] tracking-tight leading-none" style={{ color: "#15191C" }}>
                property<span style={{ color: "#2C9DD5" }}>Brands</span>
              </span>
            </a>
            <CityDropdown selectedCity={selectedCity} onSelect={handleCitySelect} isOpen={cityOpen}
              onToggle={() => { setCityOpen(!cityOpen); setActiveDropdown(null); }} />
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <button className="text-sm font-semibold transition" style={{ color: "#2C9DD5" }}>PB Prime</button>
            <div className="w-px h-4" style={{ background: "#2C9DD5" }} />
            {isLoggedIn ? (
              <ClientAccountMenu onNavigate={onNavigate} />
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="text-sm font-semibold transition" style={{ color: "#15191C" }}>Login</button>
            )}
            <button className="text-sm font-bold px-4 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition"
              style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
              Post Property
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded" style={{ background: "#E87C02", color: "#FFFFFF" }}>FREE</span>
            </button>
          </div>
          <button className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5" onClick={() => setMobileOpen(!mobileOpen)}>
            {[0,1,2].map((i) => (
              <span key={i} className="block w-5 h-0.5 transition-all duration-300" style={{ background: "#15191C",
                transform: mobileOpen ? (i===0?"rotate(45deg) translateY(8px)":i===2?"rotate(-45deg) translateY(-8px)":""):"",
                opacity: mobileOpen && i===1 ? 0 : 1 }} />
            ))}
          </button>
        </div>
      </div>

      {/* Secondary Nav */}
      <nav className="hidden lg:block border-b" style={{ background: "#FFFFFF", borderColor: "#2C9DD5" }}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center">
            {NAV_ITEMS.map((item,index) => (
              <li key={item.label} className="relative" onMouseEnter={() => handleMouseEnter(item.label)} onMouseLeave={handleMouseLeave}>
                <button className="flex items-center gap-1 px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px"
                  style={{ color: activeDropdown === item.label ? "#2C9DD5" : "#495057", borderBottomColor: activeDropdown === item.label ? "#2C9DD5" : "transparent" }}>
                  {item.label}
                  {item.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded leading-none" style={{ background: "#E87C02", color: "#FFFFFF" }}>{item.badge}</span>}
                  <ChevronDown className={activeDropdown === item.label ? "rotate-180" : ""} />
                </button>
                <DropdownMenu item={item} isOpen={activeDropdown === item.label} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden border-t overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[85vh] overflow-y-auto" : "max-h-0"}`}
        style={{ background: "#FFFFFF", borderColor: "#2C9DD5" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ background: "#FFFFFF", borderColor: "#2C9DD5" }}>
          <button className="text-sm font-semibold" style={{ color: "#2C9DD5" }}>PB Prime</button>
          {isLoggedIn ? (
            <button onClick={() => { setMobileOpen(false); onNavigate && onNavigate("profile"); }} className="text-sm font-semibold" style={{ color: "#15191C" }}>My Account</button>
          ) : (
            <button onClick={() => { setMobileOpen(false); setAuthModalOpen(true); }} className="text-sm font-semibold" style={{ color: "#15191C" }}>Login</button>
          )}
          <button className="text-sm font-bold px-4 py-1.5 rounded-md flex items-center gap-1.5" style={{ background: "#BA0D0B", color: "#FFFFFF" }}>
            Post Property <span className="text-[9px] font-extrabold px-1 py-0.5 rounded" style={{ background: "#E87C02", color: "#FFFFFF" }}>FREE</span>
          </button>
        </div>
        <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "#2C9DD5" }}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#2C9DD5" }}>
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "#15191C" }}>{selectedCity}</span>
          <button className="ml-auto text-xs font-semibold" style={{ color: "#2C9DD5" }} onClick={() => setCityOpen(!cityOpen)}>Change City</button>
        </div>
        {cityOpen && (
          <div className="grid grid-cols-3 gap-2 px-5 py-3 border-b" style={{ background: "#FFFFFF", borderColor: "#2C9DD5" }}>
            {CITIES.map((city) => (
              <button key={city} onClick={() => { handleCitySelect(city); setMobileOpen(false); }}
                className="text-sm py-1.5 px-2 rounded-md text-center transition"
                style={{ background: city === selectedCity ? "#2C9DD5" : "transparent", color: city === selectedCity ? "#FFFFFF" : "#495057" }}>
                {city}
              </button>
            ))}
          </div>
        )}
        <div>{NAV_ITEMS.map((item) => <MobileNavItem key={item.label} item={item} onNavigate={onNavigate} onLinkClick={() => setMobileOpen(false)} />)}</div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
