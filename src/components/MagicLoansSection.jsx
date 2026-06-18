import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const banks = [
  { id: 1,  name: "L&T Financial Services", abbr: "L&T",    bgColor: "bg-blue-900",   rate: "7.9%"  },
  { id: 2,  name: "LIC Housing Finance",    abbr: "LIC",    bgColor: "bg-green-700",  rate: "7.8%"  },
  { id: 3,  name: "SBI",                    abbr: "SBI",    bgColor: "bg-sky-600",    rate: "7.25%" },
  { id: 4,  name: "Canara Bank",            abbr: "CAN",    bgColor: "bg-blue-800",   rate: "7.15%" },
  { id: 5,  name: "Bank of Baroda",         abbr: "BoB",    bgColor: "bg-red-700",    rate: "7.2%"  },
  { id: 6,  name: "HDFC Bank",              abbr: "HDFC",   bgColor: "bg-red-800",    rate: "7.35%" },
  { id: 7,  name: "ICICI Bank",             abbr: "ICICI",  bgColor: "bg-orange-600", rate: "7.4%"  },
  { id: 8,  name: "Axis Bank",              abbr: "AXIS",   bgColor: "bg-purple-700", rate: "7.5%"  },
  { id: 9,  name: "Kotak Mahindra",         abbr: "KMB",    bgColor: "bg-red-600",    rate: "7.6%"  },
  { id: 10, name: "Punjab National Bank",   abbr: "PNB",    bgColor: "bg-indigo-700", rate: "7.3%"  },
];

// Duplicate banks array for seamless infinite loop
const infiniteBanks = [...banks, ...banks, ...banks];

const BankCard = ({ bank }) => (
  <div className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group" style={{ minWidth: "110px" }}>
    <div className="w-20 h-16 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-0.5 transition-all overflow-hidden">
      <div className={`w-14 h-12 rounded-lg flex items-center justify-center text-white text-sm font-extrabold tracking-wide ${bank.bgColor}`}>
        {bank.abbr}
      </div>
    </div>
    <span className="text-[11px] text-gray-500 font-medium text-center leading-tight">
      Starts at{" "}
      <span className="text-gray-800 font-bold">{bank.rate}</span>
    </span>
  </div>
);

export default function MagicLoansSection() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const animFrameRef = useRef(null);
  const speedRef = useRef(0.8); // px per frame

  // Continuous smooth scroll via requestAnimationFrame
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const step = () => {
      if (!isPaused) {
        el.scrollLeft += speedRef.current;
        // Reset to start of second copy for seamless loop
        const oneThird = el.scrollWidth / 3;
        if (el.scrollLeft >= oneThird * 2) {
          el.scrollLeft -= oneThird;
        }
      }
      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPaused]);

  const manualScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsPaused(true);
    el.scrollBy({ left: dir * 220, behavior: "smooth" });
    setTimeout(() => setIsPaused(false), 2000);
  };

  return (
    <div className="w-full px-4 py-4 bg-white">
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-gray-200"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 40%, #fef9f0 70%, #fff 100%)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-1/3 w-48 h-48 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #f87171 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/2 w-36 h-36 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #86efac 0%, transparent 70%)" }}
        />

        <div className="flex items-stretch">
          {/* ── Left content ── */}
          <div className="flex-1 px-6 py-5 flex flex-col justify-between min-w-0">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-0.5 mb-2">
                <span className="text-[#e8303a] font-bold text-xl tracking-tight leading-none">magic</span>
                <span className="font-bold text-xl tracking-tight leading-none text-gray-900">
                  L
                  <span
                    className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full mx-0.5 align-middle"
                    style={{ background: "#e8303a", marginBottom: "2px" }}
                  >
                    <span className="text-white font-black text-[10px]">O</span>
                  </span>
                  ans
                </span>
              </div>

              <h2 className="text-gray-900 font-bold text-lg leading-snug mb-2">
                Compare Home Loan Offers from 40+ Banks
              </h2>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>Rates starting from <span className="font-bold text-gray-900">7.1%</span></span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span><span className="font-bold text-[#e8303a]">0%*</span> Processing Fee</span>
                </div>
              </div>
            </div>

            {/* Bank slider */}
            <div>
              <p className="text-[10px] font-semibold text-[#e8303a] tracking-widest uppercase mb-3">
                Our Banking Partners
              </p>

              <div className="relative flex items-center gap-2">
                {/* Left arrow */}
                <button
                  onClick={() => manualScroll(-1)}
                  className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 hover:shadow-md transition-all z-10"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>

                {/* Scrollable track — overflow hidden so no scrollbar shows */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-hidden flex-1"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onTouchStart={() => setIsPaused(true)}
                  onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
                >
                  {infiniteBanks.map((bank, i) => (
                    <BankCard key={`${bank.id}-${i}`} bank={bank} />
                  ))}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => manualScroll(1)}
                  className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 hover:shadow-md transition-all z-10"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>

                {/* Fade edges */}
                <div className="absolute left-10 top-0 h-full w-8 pointer-events-none z-10"
                  style={{ background: "linear-gradient(to right, rgba(255,255,255,0.9), transparent)" }} />
                <div className="absolute right-10 top-0 h-full w-8 pointer-events-none z-10"
                  style={{ background: "linear-gradient(to left, rgba(255,255,255,0.9), transparent)" }} />
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
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #e8303a, #c0202a)",
                  boxShadow: "0 4px 14px rgba(232,48,58,0.4)",
                }}
              >
                Check Your Eligibility
              </button>
            </div>
          </div>

          {/* ── Right illustration ── */}
          <div className="hidden sm:flex items-end justify-center w-48 flex-shrink-0 relative pr-2 pb-0">
            <svg viewBox="0 0 160 160" className="w-44 h-44" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* House body */}
              <rect x="30" y="80" width="80" height="55" rx="3" fill="#d1d5db" />
              {/* Roof */}
              <polygon points="22,82 70,40 118,82" fill="#9ca3af" />
              {/* Door */}
              <rect x="57" y="108" width="18" height="27" rx="2" fill="#6b7280" />
              <circle cx="72" cy="123" r="2" fill="#d1d5db" />
              {/* Windows */}
              <rect x="35" y="90" width="20" height="14" rx="2" fill="#bfdbfe" />
              <rect x="84" y="90" width="20" height="14" rx="2" fill="#bfdbfe" />
              <line x1="45" y1="90" x2="45" y2="104" stroke="white" strokeWidth="1" />
              <line x1="35" y1="97" x2="55" y2="97" stroke="white" strokeWidth="1" />
              <line x1="94" y1="90" x2="94" y2="104" stroke="white" strokeWidth="1" />
              <line x1="84" y1="97" x2="104" y2="97" stroke="white" strokeWidth="1" />
              {/* Chimney */}
              <rect x="85" y="50" width="12" height="20" rx="2" fill="#9ca3af" />
              {/* Hand */}
              <g transform="translate(88, 10) rotate(15)">
                <rect x="0" y="30" width="28" height="28" rx="6" fill="#f5cba7" />
                <rect x="2" y="10" width="7" height="26" rx="4" fill="#f5cba7" />
                <rect x="11" y="4" width="7" height="30" rx="4" fill="#f5cba7" />
                <rect x="20" y="8" width="7" height="26" rx="4" fill="#f5cba7" />
                <rect x="-7" y="32" width="10" height="18" rx="5" fill="#f5cba7" />
                <rect x="3" y="11" width="5" height="6" rx="3" fill="#fde8d8" />
                <rect x="12" y="5" width="5" height="6" rx="3" fill="#fde8d8" />
                <rect x="21" y="9" width="5" height="6" rx="3" fill="#fde8d8" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
