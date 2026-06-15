import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Phone,
  ChevronDown,
  X,
  Menu,
  ArrowRight,
  MapPin,
  Mail,
  LogIn,
  Calendar,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home",       href: "#" },
  { label: "About Us",   href: "#" },
  {
    label: "Properties",
    href: "#",
    children: [
      { label: "Residential",      sub: "Apartments, Villas & Plots" },
      { label: "Commercial",       sub: "Offices & Retail Spaces" },
      { label: "New Launches",     sub: "Upcoming Projects" },
      { label: "Ready to Move",    sub: "Immediate Possession" },
    ],
  },
  {
    label: "Services",
    href: "#",
    children: [
      { label: "Home Loans",          sub: "Best rates, quick approvals" },
      { label: "Legal Advisory",      sub: "Due diligence & documentation" },
      { label: "Interior Design",     sub: "Turnkey solutions" },
      { label: "Property Management", sub: "End-to-end rental support" },
    ],
  },
  { label: "Investment", href: "#" },
  { label: "Blog",       href: "#" },
  { label: "Contact",    href: "#" },
];

const MOBILE_LINKS = [
  "Home",
  "About Us",
  "Properties",
  "Services",
  "Investment",
  "Blog",
  "Contact",
];

// ─── Top utility bar ──────────────────────────────────────────────────────────
function TopBar({ scrolled }) {
  return (
    <motion.div
      initial={false}
      animate={{
        height: scrolled ? 0 : "auto",
        opacity: scrolled ? 0 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden bg-[#0F4C81]"
      aria-hidden={scrolled}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between py-2">
        {/* Left — contact details */}
        <div className="flex items-center gap-6">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 text-white/80 hover:text-white text-[11.5px] font-medium transition-colors duration-150 focus:outline-none focus-visible:underline"
            aria-label="Call us"
          >
            <Phone className="w-3 h-3 text-amber-400" aria-hidden="true" />
            +91 98765 43210
          </a>
          <a
            href="mailto:info@propertybrands.in"
            className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-white text-[11.5px] font-medium transition-colors duration-150 focus:outline-none focus-visible:underline"
            aria-label="Email us"
          >
            <Mail className="w-3 h-3 text-amber-400" aria-hidden="true" />
            info@propertybrands.in
          </a>
        </div>

        {/* Right — trust badge */}
        <div className="hidden md:flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" aria-hidden="true" />
          <span className="text-white/70 text-[11px] font-medium tracking-wide">
            Serving 25+ cities across India
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Dropdown menu ────────────────────────────────────────────────────────────
function DropdownMenu({ items, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white border border-slate-200 shadow-[0_8px_32px_rgba(15,76,129,0.12)] z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Notch */}
          <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-l border-t border-slate-200 rotate-45" aria-hidden="true" />

          <ul className="py-1.5">
            {items.map((item) => (
              <li key={item.label} role="none">
                <a
                  href="#"
                  role="menuitem"
                  className="group flex flex-col px-5 py-3 hover:bg-slate-50 transition-colors duration-100 focus:outline-none focus-visible:bg-slate-100"
                >
                  <span className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#0F4C81] transition-colors duration-150">
                    {item.label}
                  </span>
                  {item.sub && (
                    <span className="text-[11.5px] text-slate-400 mt-0.5 font-normal">
                      {item.sub}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* Footer link */}
          <div className="border-t border-slate-100 px-5 py-2.5">
            <a
              href="#"
              className="flex items-center gap-1.5 text-[#0F4C81] text-[12px] font-semibold hover:gap-2.5 transition-all duration-150 focus:outline-none focus-visible:underline"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────
function NavLink({ link, scrolled, isActive, onSetActive }) {
  const hasChildren = !!link.children;
  const isOpen = isActive;
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onSetActive(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, onSetActive]);

  const textColor = scrolled
    ? "text-slate-600 hover:text-[#0F4C81]"
    : "text-slate-700 hover:text-[#0F4C81]";

  return (
    <li className="relative" ref={ref}>
      {hasChildren ? (
        <button
          onClick={() => onSetActive(!isOpen)}
          className={`group flex items-center gap-1 text-[13.5px] font-medium py-1 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-1 rounded-sm ${textColor} ${isOpen ? "text-[#0F4C81]" : ""}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {link.label}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#0F4C81]" : "text-slate-400"}`}
            aria-hidden="true"
          />
          {/* Underline */}
          <span
            className={`absolute -bottom-px left-0 right-0 h-[1.5px] bg-[#0F4C81] origin-left transition-transform duration-200 ${isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
            aria-hidden="true"
          />
        </button>
      ) : (
        <a
          href={link.href}
          className={`group relative flex items-center text-[13.5px] font-medium py-1 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-1 rounded-sm ${textColor}`}
        >
          {link.label}
          <span
            className="absolute -bottom-px left-0 right-0 h-[1.5px] bg-[#0F4C81] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
            aria-hidden="true"
          />
        </a>
      )}

      {hasChildren && (
        <DropdownMenu items={link.children} isOpen={isOpen} />
      )}
    </li>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────
function MobileDrawer({ isOpen, onClose }) {
  // Trap focus & close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#0F172A]/50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer — slides from right */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 w-[82vw] max-w-sm bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-[#0F4C81] flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div className="leading-none">
                  <span
                    className="block text-[#0F172A] font-bold text-[14px] tracking-tight"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    PropertyBrands
                  </span>
                  <span className="block text-[#0F4C81] text-[9.5px] font-semibold tracking-[0.16em] uppercase mt-0.5">
                    Realty Services
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] rounded-sm"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Mobile navigation">
              <ul role="list">
                {MOBILE_LINKS.map((label, i) => (
                  <motion.li
                    key={label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.25, ease: "easeOut" }}
                  >
                    <a
                      href="#"
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3.5 text-[15px] font-medium text-slate-700 hover:text-[#0F4C81] hover:bg-slate-50 rounded-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81]"
                    >
                      {label}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                    </a>
                  </motion.li>
                ))}
              </ul>

              {/* Divider */}
              <div className="mx-4 my-4 border-t border-slate-100" aria-hidden="true" />

              {/* CTA buttons */}
              <div className="px-4 flex flex-col gap-3">
                <a
                  href="#"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 font-semibold py-3 rounded-sm text-[14px] hover:border-[#0F4C81] hover:text-[#0F4C81] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81]"
                  aria-label="Login to your account"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  Login
                </a>
                <a
                  href="#"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 bg-[#0F4C81] text-white font-bold py-3 rounded-sm text-[14px] hover:bg-[#0d3f6e] transition-colors duration-150 shadow-[0_2px_10px_rgba(15,76,129,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                  aria-label="Schedule a site visit"
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  Schedule Site Visit
                </a>
              </div>
            </nav>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-[#0F4C81] transition-colors focus:outline-none focus-visible:underline"
                aria-label="Call us"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                +91 98765 43210
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Navbar (main export) ─────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Scroll detection
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on route/resize
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
      setActiveDropdown(null);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/97 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_12px_rgba(15,76,129,0.08)]"
            : "bg-white border-b border-slate-200"
        }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Top utility bar */}
        <TopBar scrolled={scrolled} />

        {/* Main nav row */}
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between h-[62px]">

            {/* ── Logo ──────────────────────────────────────────────────────── */}
            <a
              href="/"
              className="flex items-center gap-3 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] rounded-sm"
              aria-label="PropertyBrands Realty Services — go to homepage"
            >
              {/* Logomark */}
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 bg-[#0F4C81] rounded-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 className="w-[18px] h-[18px] text-white" aria-hidden="true" />
                </div>
                {/* Amber accent corner */}
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-amber-400 rounded-tl-sm" aria-hidden="true" />
              </div>

              {/* Wordmark */}
              <div className="leading-none">
                <span
                  className="block text-[#0F172A] font-bold tracking-tight text-[15.5px]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  PROPERTYBRANDS
                </span>
                <span className="block text-[#0F4C81] text-[9.5px] font-semibold tracking-[0.22em] uppercase mt-[2px]">
                  Realty Services
                </span>
              </div>
            </a>

            {/* ── Desktop nav links ──────────────────────────────────────────── */}
            <nav aria-label="Main navigation" className="hidden lg:block">
              <ul className="flex items-center gap-7" role="list">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.label}
                    link={link}
                    scrolled={scrolled}
                    isActive={activeDropdown === link.label}
                    onSetActive={(val) =>
                      setActiveDropdown(val ? link.label : null)
                    }
                  />
                ))}
              </ul>
            </nav>

            {/* ── Right CTAs ─────────────────────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Login — ghost */}
              <motion.a
                href="#"
                whileHover={{ borderColor: "#0F4C81", color: "#0F4C81" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 border border-slate-300 text-slate-600 font-semibold px-4 py-2 rounded-sm text-[13px] tracking-wide transition-all duration-150 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-1"
                aria-label="Login to your account"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                Login
              </motion.a>

              {/* Schedule Site Visit — primary */}
              <motion.a
                href="#"
                whileHover={{ backgroundColor: "#0d3f6e" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 bg-[#0F4C81] text-white font-bold px-5 py-2 rounded-sm text-[13px] tracking-wide transition-colors duration-150 shadow-[0_2px_10px_rgba(15,76,129,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] focus-visible:ring-offset-2"
                aria-label="Schedule a site visit"
              >
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                Schedule Site Visit
              </motion.a>
            </div>

            {/* ── Mobile hamburger ──────────────────────────────────────────── */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex flex-col items-end gap-[5px] p-2 text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] rounded-sm"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
            >
              <span className="w-5 h-[1.5px] bg-current" />
              <span className="w-4 h-[1.5px] bg-current" />
              <span className="w-5 h-[1.5px] bg-current" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Spacer — pushes page content below fixed header */}
      <div className="h-[62px]" aria-hidden="true" />
    </>
  );
}
