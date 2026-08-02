import { useState, useEffect } from "react";
import { useSavedItems } from "../lib/SavedItemsContext";
import { fetchPriceHistory, fetchComparableListings } from "../lib/listings";
import LocationMap from "./LocationMap";

// Converts a YouTube/Vimeo share link into an embeddable iframe URL. Returns
// null for anything else (Google Drive links, direct .mp4 links, etc.) so
// those just render as a plain "Watch Video" link instead of a broken embed.
function toEmbeddableVideoUrl(url) {
  if (!url) return null;
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{6,})/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

// Prefers an explicit share link (e.g. pointing at a specific building
// entrance/Street View); otherwise builds a directions URL straight from
// the pinned coordinates; otherwise falls back to a text search on the
// location string. Always returns *something* usable as long as either a
// pin or a location string exists.
function directionsUrl(property) {
  if (property.googleMapsLink) return property.googleMapsLink;
  if (property.latitude != null && property.longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`;
  }
  if (!property.location) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`;
}

// Rough "what would this cost me a month" estimate for Buy listings, shown
// so price/monthly-cost is understandable within the first screen without
// forcing a trip to the full EMI Calculator. Uses the listing's own EMI
// assumptions (Section 2B — set per-listing in the admin form, defaulting to
// 20% down / 8.5% p.a. / 20-year tenure if the listing predates that field).
// priceRaw is in rupees; returns a formatted string like "₹68,432" or null if
// we don't have a usable price.
function estimatedMonthlyEmi(property) {
  if (property.transactionType === "Rent" || !property.priceRaw) return null;
  const downPct = property.emiDownPaymentPercent ?? 20;
  const rate = property.emiInterestRate ?? 8.5;
  const years = property.emiTenureYears ?? 20;
  const principal = property.priceRaw * (1 - downPct / 100);
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  const factor = Math.pow(1 + monthlyRate, months);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  if (!isFinite(emi) || emi <= 0) return null;
  return `₹${Math.round(emi).toLocaleString("en-IN")}`;
}

// The assumptions behind estimatedMonthlyEmi(), spelled out for transparency
// (spec asks for the EMI estimate to be shown "with interest-rate and tenure
// assumptions", not just the number on its own).
function emiAssumptionsText(property) {
  const downPct = property.emiDownPaymentPercent ?? 20;
  const rate = property.emiInterestRate ?? 8.5;
  const years = property.emiTenureYears ?? 20;
  return `Assumes ${downPct}% down payment, ${rate}% p.a. interest, ${years}-year tenure.`;
}

function downPaymentEstimate(property) {
  if (property.transactionType === "Rent" || !property.priceRaw) return null;
  const downPct = property.emiDownPaymentPercent ?? 20;
  return `₹${Math.round(property.priceRaw * (downPct / 100)).toLocaleString("en-IN")}`;
}

// ── Mini card used in the "Similar Properties" strip ─────────────────────────
function SimilarCard({ property, onOpen }) {
  return (
    <button
      onClick={() => onOpen(property)}
      className="text-left rounded-2xl overflow-hidden shrink-0 w-64 transition-all duration-200 group"
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1E88E5"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#E2E8F0"}
    >
      <div className="relative h-36 overflow-hidden">
        <img src={property.images?.[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {property.badge && (
          <span className="absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: property.badgeColor || "#1E88E5", color: "#FFFFFF" }}>
            {property.badge}
          </span>
        )}
      </div>
      <div className="p-3.5">
        <p className="text-sm font-bold truncate" style={{ color: "#1F2937" }}>{property.title}</p>
        <p className="text-base font-extrabold mt-0.5" style={{ color: "#1E88E5" }}>{property.price}</p>
        <p className="text-xs truncate mt-1" style={{ color: "#6B7280" }}>{property.location}</p>
      </div>
    </button>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function PropertyDetail({ property, pool = [], onNavigate }) {
  const { isPropertySaved, toggleSaveProperty } = useSavedItems();
  const [activeImage, setActiveImage] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [comparable, setComparable] = useState(null);

  // Both hooks below must stay above the `if (!property)` early return —
  // React requires hooks to run in the same order on every render.
  useEffect(() => {
    if (!property) return;
    let cancelled = false;
    const listingId = property.dbId || property.id;
    fetchPriceHistory(listingId).then(({ data }) => { if (!cancelled) setPriceHistory(data || []); });
    fetchComparableListings(property.location, listingId).then(({ data }) => { if (!cancelled) setComparable(data); });
    return () => { cancelled = true; };
  }, [property?.dbId, property?.id, property?.location]);

  if (!property) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg font-bold" style={{ color: "#1F2937" }}>Property not found</p>
        <button onClick={() => onNavigate && onNavigate("search")} className="mt-4 text-sm font-bold" style={{ color: "#1E88E5" }}>
          ← Back to Search
        </button>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [];
  const contactSubject = property.transactionType === "Rent" ? "rent" : "buy";
  const saved = isPropertySaved(property.dbId || property.id);

  const similar = pool
    .filter((p) => p.id !== property.id && p.type === property.type)
    .slice(0, 4);

  function openSimilar(p) {
    onNavigate && onNavigate("property-detail", { property: p, pool });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div style={{ background: "#FFFFFF" }} className="pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-6">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-1.5 text-xs mb-5 flex-wrap" style={{ color: "#6B7280" }}>
          <button onClick={() => onNavigate && onNavigate("home")} className="hover:underline" style={{ color: "#1E88E5" }}>Home</button>
          <span>/</span>
          <button onClick={() => onNavigate && onNavigate("search")} className="hover:underline" style={{ color: "#1E88E5" }}>
            {property.transactionType === "Rent" ? "Rent" : "Buy"}
          </button>
          {property.type && (<><span>/</span><span>{property.type}</span></>)}
          <span>/</span>
          <span className="truncate" style={{ color: "#1F2937" }}>{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ══════════ LEFT: Gallery + Details ══════════ */}
          <div className="lg:col-span-2">

            {/* Gallery */}
            <div className="rounded-2xl overflow-hidden mb-3" style={{ border: "1px solid #E2E8F0", background: "#F1F5F9" }}>
              {images.length > 0 ? (
                <img src={images[activeImage]} alt={property.title} className="w-full h-[320px] sm:h-[440px] object-cover" />
              ) : (
                <div className="w-full h-[320px] sm:h-[440px] flex items-center justify-center text-sm" style={{ color: "#6B7280" }}>
                  No photos available yet
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all"
                    style={{ border: activeImage === i ? "2px solid #1E88E5" : "2px solid transparent", opacity: activeImage === i ? 1 : 0.7 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title block (mobile-visible here, desktop shown in right rail too) */}
            <div className="mb-6 lg:hidden">
              <h1 className="text-xl font-extrabold" style={{ color: "#1F2937" }}>{property.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm" style={{ color: "#6B7280" }}>{property.location}</p>
                {directionsUrl(property) && (
                  <a href={directionsUrl(property)} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold shrink-0 hover:underline" style={{ color: "#1E88E5" }}>
                    Get Directions
                  </a>
                )}
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                property.bhkLabel && { label: "Configuration", value: property.bhkLabel },
                property.area && { label: "Area", value: property.area },
                property.floor && { label: "Floor", value: property.floor },
                property.facing && { label: "Facing", value: property.facing },
                property.age && { label: "Age", value: property.age },
                property.status && { label: "Possession", value: property.status },
                property.postedBy && { label: "Posted By", value: property.postedBy },
                { label: "Listed", value: property.postedDays === 0 ? "Today" : `${property.postedDays}d ago` },
              ].filter(Boolean).map((f) => (
                <div key={f.label} className="rounded-xl p-3.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>{f.label}</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: "#1F2937" }}>{f.value}</p>
                </div>
              ))}
            </div>

            {/* Property Details (project identity, configuration, area breakdown) */}
            {(() => {
              const unitLine = [property.projectName, property.towerBlock, property.unitNumberPublic ? property.unitNumber : null]
                .filter(Boolean).join(", ");
              const rows = [
                property.listingCode && { label: "Listing ID", value: property.listingCode },
                unitLine && { label: "Project / Unit", value: unitLine },
                property.listingType && { label: "Listing Type", value: property.listingType },
                property.bathrooms != null && { label: "Bathrooms", value: property.bathrooms },
                property.balconies != null && { label: "Balconies", value: property.balconies },
                property.servantRoom && { label: "Servant Room", value: "Yes" },
                property.builtUpArea && { label: "Built-up Area", value: `${property.builtUpArea} sqft` },
                property.superBuiltUpArea && { label: "Super Built-up Area", value: `${property.superBuiltUpArea} sqft` },
                property.carpetArea && { label: "Carpet Area", value: `${property.carpetArea} sqft` },
                property.plotArea && { label: "Plot Area", value: `${property.plotArea} sqft` },
                property.totalFloors && { label: "Total Floors", value: property.totalFloors },
                property.totalUnits && { label: "Total Units", value: property.totalUnits },
                property.entranceDirection && { label: "Entrance Direction", value: property.entranceDirection },
                property.vastuStatus && property.vastuStatus !== "Not Specified" && { label: "Vastu Status", value: property.vastuStatus },
                property.furnishing && { label: "Furnishing", value: property.furnishing },
                property.condition && { label: "Condition", value: property.condition },
              ].filter(Boolean);
              if (rows.length === 0) return null;
              return (
                <div className="mb-8">
                  <h2 className="text-base font-bold mb-3" style={{ color: "#1F2937" }}>Property Details</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {rows.map((r) => (
                      <div key={r.label} className="rounded-xl p-3.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>{r.label}</p>
                        <p className="text-sm font-bold mt-0.5" style={{ color: "#1F2937" }}>{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Price & Financial Details (Section 2B) */}
            {(() => {
              const costRows = [
                property.costBase && { label: "Base Cost", value: property.costBase },
                property.costFloorRise && { label: "Floor Rise", value: property.costFloorRise },
                property.costParking && { label: "Parking", value: property.costParking },
                property.costClubhouse && { label: "Clubhouse", value: property.costClubhouse },
                property.costPlc && { label: "PLC", value: property.costPlc },
                property.costGst && { label: "GST", value: property.costGst },
                property.costRegistration && { label: "Registration", value: property.costRegistration },
                property.costMaintenanceDeposit && { label: "Maintenance Deposit", value: property.costMaintenanceDeposit },
                property.costOther && { label: property.costOtherLabel || "Other Charges", value: property.costOther },
              ].filter(Boolean);

              const hasLoanInfo = property.approvedBanks?.length > 0 || property.loanEligibilityNotes;
              const hasInvestmentInfo = property.estimatedMonthlyRent || property.rentalYieldPercent || property.appreciationPotential || property.recommendedHoldingPeriod;

              if (costRows.length === 0 && !hasLoanInfo && !hasInvestmentInfo && !comparable && priceHistory.length <= 1) return null;

              return (
                <div className="mb-8 space-y-6">
                  <h2 className="text-base font-bold" style={{ color: "#1F2937" }}>Price &amp; Financial Details</h2>

                  {costRows.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#6B7280" }}>Cost Breakup</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {costRows.map((r) => (
                          <div key={r.label} className="rounded-xl p-3.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>{r.label}</p>
                            <p className="text-sm font-bold mt-0.5" style={{ color: "#1F2937" }}>₹{r.value.toLocaleString("en-IN")}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {comparable && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#6B7280" }}>Comparable Pricing in {property.location}</p>
                      <p className="text-sm" style={{ color: "#1F2937" }}>
                        <span className="font-bold">₹{comparable.min.toLocaleString("en-IN")} – ₹{comparable.max.toLocaleString("en-IN")}</span> per sqft
                        <span style={{ color: "#6B7280" }}> (avg ₹{comparable.avg.toLocaleString("en-IN")}/sqft, based on {comparable.count} other listing{comparable.count === 1 ? "" : "s"} nearby)</span>
                      </p>
                    </div>
                  )}

                  {hasInvestmentInfo && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#6B7280" }}>Investment Indicators</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {property.estimatedMonthlyRent && (
                          <div className="rounded-xl p-3.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>Est. Monthly Rent</p>
                            <p className="text-sm font-bold mt-0.5" style={{ color: "#1F2937" }}>₹{property.estimatedMonthlyRent.toLocaleString("en-IN")}</p>
                          </div>
                        )}
                        {property.rentalYieldPercent != null && (
                          <div className="rounded-xl p-3.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>Rental Yield</p>
                            <p className="text-sm font-bold mt-0.5" style={{ color: "#1F2937" }}>{property.rentalYieldPercent}%/yr</p>
                          </div>
                        )}
                        {property.appreciationPotential && (
                          <div className="rounded-xl p-3.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>Appreciation Potential</p>
                            <p className="text-sm font-bold mt-0.5" style={{ color: "#1F2937" }}>{property.appreciationPotential}</p>
                          </div>
                        )}
                        {property.recommendedHoldingPeriod && (
                          <div className="rounded-xl p-3.5" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>Recommended Holding Period</p>
                            <p className="text-sm font-bold mt-0.5" style={{ color: "#1F2937" }}>{property.recommendedHoldingPeriod}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {hasLoanInfo && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#6B7280" }}>Loan Eligibility</p>
                      {property.approvedBanks?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {property.approvedBanks.map((b) => (
                            <span key={b} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#F1F5F9", color: "#1F2937" }}>{b}</span>
                          ))}
                        </div>
                      )}
                      {property.loanEligibilityNotes && (
                        <p className="text-sm" style={{ color: "#6B7280" }}>{property.loanEligibilityNotes}</p>
                      )}
                    </div>
                  )}

                  {priceHistory.length > 1 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#6B7280" }}>Price History</p>
                      <div className="space-y-1.5">
                        {priceHistory.map((h, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span style={{ color: "#1F2937" }} className="font-semibold">{h.priceLabel}</span>
                            <span style={{ color: "#6B7280" }}>{new Date(h.changedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px]" style={{ color: "#9CA3AF" }}>
                    Last updated {new Date(property.updatedAt || property.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              );
            })()}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-base font-bold mb-2" style={{ color: "#1F2937" }}>About this property</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                {property.description || `This ${property.bhkLabel ? property.bhkLabel + " " : ""}${property.type?.toLowerCase() || "property"} in ${property.location} is listed ${property.transactionType === "Rent" ? "for rent" : "for sale"} by a ${property.postedBy?.toLowerCase() || "verified"} on PropertyBrands${property.area ? `, spanning ${property.area}` : ""}. Reach out below to schedule a visit or speak with our team for more details.`}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base font-bold mb-3" style={{ color: "#1F2937" }}>Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: "#EFF6FF", color: "#1F2937" }}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="#1E88E5" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {property.latitude != null && property.longitude != null && (
              <div className="mb-8">
                <h2 className="text-base font-bold mb-3" style={{ color: "#1F2937" }}>Location</h2>
                <LocationMap latitude={property.latitude} longitude={property.longitude} label={property.title} />
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm" style={{ color: "#6B7280" }}>{property.location}</p>
                  {directionsUrl(property) && (
                    <a href={directionsUrl(property)} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold shrink-0 hover:underline" style={{ color: "#1E88E5" }}>
                      Get Directions
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Videos */}
            {property.videoUrls?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base font-bold mb-3" style={{ color: "#1F2937" }}>Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.videoUrls.map((url) => {
                    const embedUrl = toEmbeddableVideoUrl(url);
                    return embedUrl ? (
                      <div key={url} className="aspect-video rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                        <iframe src={embedUrl} title="Property video" className="w-full h-full" allowFullScreen />
                      </div>
                    ) : (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl hover:underline"
                        style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#1E88E5" }}>
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch Video
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags */}
            {property.tags?.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {property.tags.map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#FEF3C7", color: "#F59E0B" }}>{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* ══════════ RIGHT: Sticky buy-box ══════════ */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 rounded-2xl p-6" style={{ border: "1px solid #E2E8F0", background: "#FFFFFF" }}>

              <div className="hidden lg:block mb-3">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-lg font-extrabold leading-tight" style={{ color: "#1F2937" }}>{property.title}</h1>
                  {property.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold shrink-0" style={{ color: "#1E88E5" }}>
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm" style={{ color: "#6B7280" }}>{property.location}</p>
                  {directionsUrl(property) && (
                    <a href={directionsUrl(property)} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold shrink-0 hover:underline" style={{ color: "#1E88E5" }}>
                      Get Directions
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <span className="text-3xl font-extrabold" style={{ color: "#1E88E5" }}>{property.price}</span>
                {property.priceNegotiable && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#F0FDF4", color: "#16A34A" }}>Negotiable</span>
                )}
              </div>
              {property.pricePerSqft && (
                <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                  ₹{property.pricePerSqft.toLocaleString("en-IN")}/sqft{property.priceType ? ` · ${property.priceType}` : ""}
                </p>
              )}
              {property.transactionType === "Rent" && (
                <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
                  {property.securityDeposit
                    ? `+ ₹${property.securityDeposit.toLocaleString("en-IN")} security deposit`
                    : "+ security deposit"}
                  {property.maintenanceAmount ? ` & ₹${property.maintenanceAmount.toLocaleString("en-IN")}/${(property.maintenanceFrequency || "month").toLowerCase()} maintenance` : " & maintenance, as applicable"}
                </p>
              )}
              {property.transactionType !== "Rent" && (
                estimatedMonthlyEmi(property) ? (
                  <div className="mb-4">
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      Est. EMI <span className="font-bold" style={{ color: "#1F2937" }}>{estimatedMonthlyEmi(property)}/mo</span>
                      {downPaymentEstimate(property) && <> · Down payment <span className="font-bold" style={{ color: "#1F2937" }}>{downPaymentEstimate(property)}</span></>}
                      {" "}·{" "}
                      <button onClick={() => onNavigate && onNavigate("investment-advisory", "emi-calculator")} className="font-semibold hover:underline" style={{ color: "#1E88E5" }}>
                        Calculate exactly
                      </button>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#9CA3AF" }}>{emiAssumptionsText(property)}</p>
                  </div>
                ) : (
                  <div className="mb-4" />
                )
              )}

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => onNavigate && onNavigate("contact", { subject: contactSubject, property, intent: "contact" })}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#1E88E5", color: "#FFFFFF" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#1565C0"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#1E88E5"}
                >
                  Contact {property.postedBy || "Owner"}
                </button>
                <button
                  onClick={() => onNavigate && onNavigate("contact", { subject: contactSubject, property, intent: "site-visit" })}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#FFFFFF", color: "#1E88E5", border: "1.5px solid #1E88E5" }}
                >
                  Schedule a Site Visit
                </button>
                <button
                  onClick={() => onNavigate && onNavigate("contact", { subject: contactSubject, property, intent: "callback" })}
                  className="text-xs font-semibold hover:underline text-center"
                  style={{ color: "#6B7280" }}
                >
                  Prefer a callback instead? Request one →
                </button>
                <button
                  onClick={() => toggleSaveProperty(property)}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  style={{ background: "#F8FAFC", color: saved ? "#1E88E5" : "#1F2937", border: "1px solid #E2E8F0" }}
                >
                  <svg className="w-4 h-4" fill={saved ? "#1E88E5" : "none"} stroke={saved ? "#1E88E5" : "#1F2937"} strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {saved ? "Saved" : "Save Property"}
                </button>
              </div>

              <div className="mt-5 pt-5 flex items-center justify-between text-xs" style={{ borderTop: "1px solid #E2E8F0", color: "#6B7280" }}>
                <span>Posted by <span className="font-semibold" style={{ color: "#1F2937" }}>{property.postedBy || "—"}</span></span>
                <span>{property.postedDays === 0 ? "Today" : `${property.postedDays}d ago`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Similar Properties ── */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>Similar Properties</h2>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {similar.map((p) => <SimilarCard key={p.id} property={p} onOpen={openSimilar} />)}
            </div>
          </div>
        )}

        {/* ── Report listing ── */}
        <div className="mt-10 text-center">
          <button onClick={() => onNavigate && onNavigate("contact", "other")} className="text-xs hover:underline" style={{ color: "#6B7280" }}>
            Something wrong with this listing? Report it
          </button>
        </div>
      </div>
    </div>
  );
}
