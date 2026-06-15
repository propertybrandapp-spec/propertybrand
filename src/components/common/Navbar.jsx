import { useState, useRef, useEffect } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const CITIES = [
  "Ranchi", "Delhi", "Mumbai", "Bangalore", "Hyderabad",
  "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur",
];

const NAV_ITEMS = [
  {
    label: "Buy",
    columns: [
      {
        heading: "Residential",
        links: [
          "Ready-to-Move Apartments",
          "Under Construction Projects",
          "Luxury Apartments",
          "Affordable Housing",
          "Gated Communities",
          "Villas & Row Houses",
          "Residential Plots",
        ],
      },
      {
        heading: "Commercial",
        links: [
          "Office Spaces",
          "Managed Workspaces",
          "Business Centers",
          "Retail Shops",
          "Showrooms",
          "Warehouses",
          "Industrial Sheds",
        ],
      },
      {
        heading: "By Budget",
        links: [
          "Under ₹30 Lac",
          "₹30 – 50 Lac",
          "₹50 Lac – 1 Cr",
          "₹1 – 1.5 Cr",
          "₹1.5 – 2 Cr",
          "Above ₹2 Cr",
        ],
      },
    ],
  },
  {
    label: "Rent",
    columns: [
      {
        heading: "Residential Rentals",
        links: [
          "Apartments for Rent",
          "Villas for Rent",
          "Independent Houses",
          "Co-living Spaces",
          "Student Accommodation",
          "Furnished Apartments",
        ],
      },
      {
        heading: "Commercial Rentals",
        links: [
          "Office Spaces",
          "Retail Shops",
          "Showrooms",
          "Coworking Spaces",
          "Warehouses",
        ],
      },
      {
        heading: "Rental Services",
        links: [
          "Tenant Verification",
          "Rental Agreement",
          "Property Inspection",
          "Rent Collection Support",
          "Property Management",
        ],
      },
    ],
  },
  {
    label: "Sell",
    columns: [
      {
        heading: "Sell Your Property",
        links: [
          "Post Free Property Ad",
          "Sell Apartment",
          "Sell Villa",
          "Sell Plot",
          "Sell Commercial Space",
        ],
      },
      {
        heading: "Services",
        links: [
          "Property Valuation",
          "Legal Assistance",
          "Documentation Support",
          "Resale Assistance",
          "Channel Partner Network",
        ],
      },
    ],
  },
  {
    label: "Home Loans",
    columns: [
      {
        heading: "Loan Services",
        links: [
          "Check Loan Eligibility",
          "Compare Home Loans",
          "Fast Approval",
          "Documentation Support",
          "Loan Against Property",
        ],
      },
      {
        heading: "Partner Banks",
        links: [
          "SBI Home Loan",
          "HDFC Home Loan",
          "ICICI Home Loan",
          "Axis Bank Home Loan",
          "LIC Housing Finance",
        ],
      },
      {
        heading: "Calculators",
        links: [
          "EMI Calculator",
          "Affordability Calculator",
          "Down Payment Calculator",
          "Stamp Duty Calculator",
          "Registration Cost Calculator",
        ],
      },
    ],
  },
  {
    label: "Home Interiors",
    columns: [
      {
        heading: "Interior Design",
        links: [
          "Modular Kitchen Design",
          "Bedroom Interiors",
          "Living Room Design",
          "Office Interiors",
          "Commercial Interiors",
          "Furniture Planning",
        ],
      },
      {
        heading: "Packages",
        links: [
          "Essential Package",
          "Premium Package",
          "Luxury Package",
        ],
      },
      {
        heading: "Architecture",
        links: [
          "House Planning",
          "Residential Design",
          "3D Visualization",
          "Approval Drawings",
          "Site Supervision",
        ],
      },
    ],
  },
  {
    label: "Investment Advisory",
    badge: "NEW",
    columns: [
      {
        heading: "Investment Options",
        links: [
          "High Growth Corridors",
          "Rental Yield Opportunities",
          "Commercial Investments",
          "Land Banking",
          "Retirement Homes",
          "NRI Investments",
        ],
      },
      {
        heading: "Investment Tools",
        links: [
          "ROI Calculator",
          "Rental Yield Calculator",
          "Capital Appreciation Estimator",
          "Investment Comparison Tool",
        ],
      },
    ],
  },
  {
    label: "Help",
    columns: [
      {
        heading: "Support",
        links: [
          "How to Buy a Property",
          "How to Rent a Property",
          "How to Apply for Home Loan",
          "What is RERA?",
          "How to Calculate EMI",
          "Contact Us",
        ],
      },
      {
        heading: "Resources",
        links: [
          "Real Estate Blog",
          "Market Reports",
          "Infrastructure Updates",
          "Government Policies",
          "Smart City Updates",
        ],
      },
    ],
  },
];

// ── Chevron Icon ──────────────────────────────────────────────────────────────
function ChevronDown({ className = "" }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform duration-200 ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ── Dropdown Menu ─────────────────────────────────────────────────────────────
function DropdownMenu({ item, isOpen }) {
  if (!isOpen || !item.columns) return null;
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-50 min-w-max">
      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45 -mb-1.5 z-10 relative" />
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex gap-0 divide-x divide-gray-100">
          {item.columns.map((col) => (
            <div key={col.heading} className="p-5 min-w-[180px]">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                {col.heading}
              </p>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-[#E03A3C] transition-colors block py-0.5"
                    >
                      {link}
                    </a>
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

// ── City Selector Dropdown ────────────────────────────────────────────────────
function CityDropdown({ selectedCity, onSelect, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-white text-sm font-medium hover:text-yellow-200 transition ml-3"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="hidden sm:inline">{selectedCity}</span>
        <ChevronDown className={isOpen ? "rotate-180" : ""} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 overflow-hidden">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-1">
            Select City
          </p>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => onSelect(city)}
              className={`block w-full text-left px-3 py-2 text-sm transition ${
                city === selectedCity
                  ? "text-[#E03A3C] bg-red-50 font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#E03A3C]"
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

// ── Mobile Nav Item ───────────────────────────────────────────────────────────
function MobileNavItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold text-gray-800"
      >
        <span className="flex items-center gap-2">
          {item.label}
          {item.badge && (
            <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              {item.badge}
            </span>
          )}
        </span>
        <ChevronDown className={open ? "rotate-180 text-[#E03A3C]" : "text-gray-400"} />
      </button>
      {open && item.columns && (
        <div className="bg-gray-50 px-5 pb-4">
          {item.columns.map((col) => (
            <div key={col.heading} className="mt-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                {col.heading}
              </p>
              <ul className="space-y-1">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-[#E03A3C] block py-0.5 transition"
                    >
                      {link}
                    </a>
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

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Ranchi");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  // Close all dropdowns on outside click
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

  // Close mobile menu on resize
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
  }

  return (
    <header ref={navRef} className="sticky top-0 z-50">
      {/* ── Top Bar ── */}
      <div className="bg-[#E03A3C]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo + City */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-0.5">
              <span className="text-white font-extrabold text-[22px] tracking-tight leading-none">
                property
                <span className="text-yellow-300">Brands</span>
              </span>
            </a>
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

          {/* Right side – desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="text-white text-sm font-semibold hover:text-yellow-200 transition">
              PB Prime
            </button>
            <div className="w-px h-4 bg-white/30" />
            <button className="text-white text-sm font-semibold hover:text-yellow-200 transition">
              Login
            </button>
            <button className="bg-white text-[#E03A3C] text-sm font-bold px-4 py-1.5 rounded-md hover:bg-yellow-50 transition flex items-center gap-1.5 shadow-sm">
              Post Property
              <span className="bg-[#E03A3C] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                FREE
              </span>
            </button>
          </div>

          {/* Hamburger – mobile */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Secondary Nav – Desktop ── */}
      <nav className="hidden lg:block bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                    activeDropdown === item.label
                      ? "text-[#E03A3C] border-[#E03A3C]"
                      : "text-gray-700 border-transparent hover:text-[#E03A3C] hover:border-[#E03A3C]"
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
                      {item.badge}
                    </span>
                  )}
                  <ChevronDown
                    className={activeDropdown === item.label ? "rotate-180 text-[#E03A3C]" : "text-gray-400"}
                  />
                </button>
                <DropdownMenu item={item} isOpen={activeDropdown === item.label} />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        className={`lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[85vh] overflow-y-auto" : "max-h-0"
        }`}
      >
        {/* Mobile top actions */}
        <div className="flex items-center justify-between px-5 py-3 bg-red-50 border-b border-red-100">
          <button className="text-[#E03A3C] text-sm font-semibold">PB Prime</button>
          <button className="text-[#E03A3C] text-sm font-semibold">Login</button>
          <button className="bg-[#E03A3C] text-white text-sm font-bold px-4 py-1.5 rounded-md flex items-center gap-1.5">
            Post Property
            <span className="bg-white text-[#E03A3C] text-[9px] font-extrabold px-1 py-0.5 rounded">
              FREE
            </span>
          </button>
        </div>

        {/* City selector mobile */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#E03A3C]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-700 font-medium">{selectedCity}</span>
          <button
            className="ml-auto text-xs text-[#E03A3C] font-semibold"
            onClick={() => setCityOpen(!cityOpen)}
          >
            Change City
          </button>
        </div>

        {/* Mobile city list */}
        {cityOpen && (
          <div className="grid grid-cols-3 gap-2 px-5 py-3 bg-gray-50 border-b border-gray-100">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => {
                  handleCitySelect(city);
                  setMobileOpen(false);
                }}
                className={`text-sm py-1.5 px-2 rounded-md text-center transition ${
                  city === selectedCity
                    ? "bg-[#E03A3C] text-white font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}

        {/* Mobile nav items */}
        <div>
          {NAV_ITEMS.map((item) => (
            <MobileNavItem key={item.label} item={item} />
          ))}
        </div>
      </div>
    </header>
  );
}
