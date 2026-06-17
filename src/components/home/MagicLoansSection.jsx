import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const banks = [
  {
    id: 1,
    name: "L&T Financial Services",
    logo: null,
    abbr: "L&T",
    bgColor: "bg-blue-900",
    textColor: "text-white",
    rate: "7.9%",
  },
  {
    id: 2,
    name: "LIC Housing Finance",
    logo: null,
    abbr: "LIC HFL",
    bgColor: "bg-green-700",
    textColor: "text-white",
    rate: "7.8%",
  },
  {
    id: 3,
    name: "SBI",
    logo: null,
    abbr: "SBI",
    bgColor: "bg-sky-600",
    textColor: "text-white",
    rate: "7.25%",
  },
  {
    id: 4,
    name: "Canara Bank",
    logo: null,
    abbr: "Canara",
    bgColor: "bg-blue-800",
    textColor: "text-white",
    rate: "7.15%",
  },
  {
    id: 5,
    name: "Bank of Baroda",
    logo: null,
    abbr: "BoB",
    bgColor: "bg-red-700",
    textColor: "text-white",
    rate: "7.2%",
  },
  {
    id: 6,
    name: "HDFC Bank",
    logo: null,
    abbr: "HDFC",
    bgColor: "bg-red-800",
    textColor: "text-white",
    rate: "7.35%",
  },
  {
    id: 7,
    name: "ICICI Bank",
    logo: null,
    abbr: "ICICI",
    bgColor: "bg-orange-600",
    textColor: "text-white",
    rate: "7.4%",
  },
  {
    id: 8,
    name: "Axis Bank",
    logo: null,
    abbr: "Axis",
    bgColor: "bg-purple-700",
    textColor: "text-white",
    rate: "7.5%",
  },
];

// SVG logos for top banks
const SBILogo = () => (
  <svg viewBox="0 0 60 28" className="w-10 h-6" fill="none">
    <circle cx="10" cy="14" r="10" fill="#1a5ca3" />
    <path d="M5 14 Q10 7 15 14 Q10 21 5 14Z" fill="white" opacity="0.7" />
    <text x="20" y="19" fontSize="13" fontWeight="bold" fill="#1a5ca3" fontFamily="Arial">
      SBI
    </text>
  </svg>
);

const BankLogoFallback = ({ abbr, bgColor }) => (
  <div
    className={`w-10 h-10 rounded flex items-center justify-center text-white text-xs font-bold ${bgColor}`}
  >
    {abbr.slice(0, 3)}
  </div>
);

export default function MagicLoansSection() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollRef = useRef(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsAutoScrolling(false);
    el.scrollBy({ left: dir * 180, behavior: "smooth" });
    setTimeout(() => setIsAutoScrolling(true), 3000);
  };

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const tick = () => {
      if (!isAutoScrolling) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 2, behavior: "auto" });
      }
    };

    autoScrollRef.current = setInterval(tick, 30);
    return () => clearInterval(autoScrollRef.current);
  }, [isAutoScrolling]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  return (
    <div className="w-full px-4 py-4 bg-white">
      {/* Card wrapper */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-gray-200"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #f0fdf4 40%, #fef9f0 70%, #fff 100%)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-64 w-40 h-40 rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #f87171 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-80 w-32 h-32 rounded-full opacity-15 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #86efac 0%, transparent 70%)",
          }}
        />

        <div className="flex items-stretch">
          {/* Left content */}
          <div className="flex-1 px-6 py-5 flex flex-col justify-between min-w-0">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[#e8303a] font-bold text-lg tracking-tight leading-none">
                  magic
                </span>
                <span
                  className="font-bold text-lg tracking-tight leading-none"
                  style={{ color: "#222" }}
                >
                  L
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full mx-0.5 align-middle"
                    style={{ background: "#e8303a", marginBottom: "1px" }}
                  >
                    <span className="text-white font-bold text-[9px]">O</span>
                  </span>
                  ans
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-gray-900 font-bold text-lg leading-snug mb-2">
                Compare Home Loan Offers from 40+ Banks
              </h2>

              {/* Badges */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>
                    Rates starting from{" "}
                    <span className="font-bold text-gray-900">7.1%</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span>
                    <span className="font-bold text-[#e8303a]">0%*</span>{" "}
                    Processing Fee
                  </span>
                </div>
              </div>
            </div>

            {/* Bank slider */}
            <div>
              <p className="text-[10px] font-semibold text-[#e8303a] tracking-widest uppercase mb-2">
                Our Banking Partners
              </p>

              <div className="relative flex items-center">
                {/* Left arrow */}
                <button
                  onClick={() => scrollBy(-1)}
                  disabled={!canScrollLeft}
                  className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center mr-2 shadow-sm transition disabled:opacity-30 hover:bg-gray-50 z-10"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>

                {/* Scrollable bank cards */}
                <div
                  ref={scrollRef}
                  className="flex gap-3 overflow-x-auto scrollbar-hide flex-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  onMouseEnter={() => setIsAutoScrolling(false)}
                  onMouseLeave={() => setIsAutoScrolling(true)}
                >
                  {banks.map((bank) => (
                    <div
                      key={bank.id}
                      className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group"
                      style={{ minWidth: "80px" }}
                    >
                      <div className="w-16 h-10 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow overflow-hidden px-1">
                        <BankLogoFallback abbr={bank.abbr} bgColor={bank.bgColor} />
                      </div>
                      <span className="text-[11px] text-gray-600 font-medium">
                        Starts at{" "}
                        <span className="text-gray-800 font-semibold">
                          {bank.rate}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => scrollBy(1)}
                  disabled={!canScrollRight}
                  className="flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center ml-2 shadow-sm transition disabled:opacity-30 hover:bg-gray-50 z-10"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-6 mt-4">
              <a
                href="#"
                className="text-[#e8303a] font-semibold text-sm flex items-center gap-1 hover:underline"
              >
                Explore Bank Offers <span aria-hidden>→</span>
              </a>
              <button
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #e8303a, #c0202a)",
                  boxShadow: "0 4px 14px rgba(232,48,58,0.4)",
                }}
              >
                Check Your Eligibility
              </button>
            </div>
          </div>

          {/* Right illustration */}
          <div className="hidden sm:flex items-end justify-center w-48 flex-shrink-0 relative pr-4 pb-0">
            {/* Hand + House SVG illustration */}
            <svg
              viewBox="0 0 160 160"
              className="w-44 h-44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* House body */}
              <rect x="30" y="80" width="80" height="55" rx="3" fill="#d1d5db" />
              {/* Roof */}
              <polygon points="22,82 70,40 118,82" fill="#9ca3af" />
              {/* Door */}
              <rect x="57" y="108" width="18" height="27" rx="2" fill="#6b7280" />
              {/* Door knob */}
              <circle cx="72" cy="123" r="2" fill="#d1d5db" />
              {/* Windows */}
              <rect x="35" y="90" width="20" height="14" rx="2" fill="#bfdbfe" />
              <rect x="84" y="90" width="20" height="14" rx="2" fill="#bfdbfe" />
              {/* Window cross */}
              <line x1="45" y1="90" x2="45" y2="104" stroke="white" strokeWidth="1" />
              <line x1="35" y1="97" x2="55" y2="97" stroke="white" strokeWidth="1" />
              <line x1="94" y1="90" x2="94" y2="104" stroke="white" strokeWidth="1" />
              <line x1="84" y1="97" x2="104" y2="97" stroke="white" strokeWidth="1" />
              {/* Chimney */}
              <rect x="85" y="50" width="12" height="20" rx="2" fill="#9ca3af" />

              {/* Hand coming from top right */}
              <g transform="translate(88, 10) rotate(15)">
                {/* Palm */}
                <rect x="0" y="30" width="28" height="28" rx="6" fill="#f5cba7" />
                {/* Fingers */}
                <rect x="2" y="10" width="7" height="26" rx="4" fill="#f5cba7" />
                <rect x="11" y="4" width="7" height="30" rx="4" fill="#f5cba7" />
                <rect x="20" y="8" width="7" height="26" rx="4" fill="#f5cba7" />
                {/* Thumb */}
                <rect x="-7" y="32" width="10" height="18" rx="5" fill="#f5cba7" />
                {/* Fingernails */}
                <rect x="3" y="11" width="5" height="6" rx="3" fill="#fde8d8" />
                <rect x="12" y="5" width="5" height="6" rx="3" fill="#fde8d8" />
                <rect x="21" y="9" width="5" height="6" rx="3" fill="#fde8d8" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
