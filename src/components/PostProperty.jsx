import ProjectExtrasFields from "./ProjectExtrasFields";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { createListing, LANDMARK_CATEGORIES } from "../lib/listings";
import { uploadToR2, validateImageFile, validateDocumentFile, computeImageHash, hammingDistance, looksLikeScreenshot, getImageDimensions } from "../lib/r2Upload";
import { fetchListingFieldOptions } from "../lib/listingOptions";
import LocationPicker, { reverseGeocode } from "./LocationPicker";
import { parseGoogleMapsLocation } from "../lib/googleMaps";
import { getFormProfile, AREA_LABELS } from "../lib/listingProfile";
import { isLandType, PLOT_AREA_UNITS, LAND_USE_OPTIONS as DEFAULT_LAND_USE_OPTIONS, PLOT_APPROVAL_OPTIONS, LAND_PHOTO_LABELS, resolvePlotArea, landValidationMessage, formatPlotArea } from "../lib/landListing";
import AuthModal from "./AuthModal";
import { withExtraTypes, transactionFor } from "../lib/propertyTypes";
import { Home, CheckCircle2 } from "lucide-react";
import { parsePriceInput } from "../lib/priceUtils";
import { fetchInvestmentOpportunities } from "../lib/siteContent";

// Fallback defaults — used until the dynamic options load (or if the
// "Site Content" → Listing Options table is still empty). Admins can add
// more of these from the admin console without a code change.
const DEFAULT_PROPERTY_TYPES = ["Apartment", "Villa", "Independent House", "Duplex", "Plot", "Commercial", "Office Space", "Shop / Showroom", "Warehouse / Industrial Shed", "Farmhouse", "Penthouse", "Studio Apartment", "Agricultural Land", "Office", "Retail", "Industrial", "Co-living", "Student Accommodation"];
const DEFAULT_BHK_OPTIONS = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "5+ BHK"];
const DEFAULT_IDEAL_FOR_OPTIONS = ["Families", "Working Professionals", "Bachelors", "Students", "Retirees", "Doctors / Clinics", "Commercial Setup", "Investors / High ROI", "Startups", "Corporate Lease", "Couples"];
const DEFAULT_AMENITIES = ["Lift", "Parking", "Visitor Parking", "Power Backup", "Security", "24x7 Security", "CCTV", "Intercom", "Swimming Pool", "Gym", "Garden", "Club House", "Multipurpose Hall", "Indoor Games", "Kids Play Area", "Jogging Track", "Amphitheatre", "Yoga / Meditation Area", "Senior Citizen Sitout", "Cafeteria", "WiFi", "Housekeeping", "Fire Safety", "Rain Water Harvesting", "Sewage Treatment Plant", "Solar Water Heating", "EV Charging Point", "Water Softener Plant", "Vaastu Compliant", "Pet Friendly", "Gated Community"];
const DEFAULT_POSSESSION_OPTIONS = ["Ready to Move", "Under Construction", "New Launch"];
const FACING_OPTIONS = ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"];
// ── New in Section 2A: Property Identity & Basic Details ──
const LISTING_TYPE_OPTIONS = ["Sale", "Rent", "Lease", "Resale", "New Launch", "Under Construction"];
const VASTU_OPTIONS = ["Vastu Compliant", "Not Vastu Compliant", "Not Specified"];
const FURNISHING_OPTIONS = ["Unfurnished", "Semi-furnished", "Fully furnished"];
const CONDITION_OPTIONS = ["New", "Renovated", "Well maintained", "Needs renovation"];
// ── New in Section 2B: Price & Financial Transparency ──
const PRICE_TYPE_OPTIONS = ["All-Inclusive", "Base Price"];
const MAINTENANCE_FREQUENCY_OPTIONS = ["Monthly", "Quarterly", "Half-Yearly", "Annually"];
const BROKERAGE_TYPE_OPTIONS = ["None", "One Month Rent", "Fixed Amount", "Percentage of Rent"];
const APPRECIATION_OPTIONS = ["Low", "Moderate", "High", "Very High"];
const BANK_PRESETS = ["SBI", "HDFC", "ICICI", "Axis Bank", "Bank of Baroda", "Punjab National Bank", "Kotak Mahindra", "LIC Housing Finance", "IDFC First", "Yes Bank"];
// ── New in Section 2C: Location & Connectivity ──
const ADDRESS_VISIBILITY_OPTIONS = ["Exact Address", "Approximate Location", "Locality Only"];
const NEIGHBOURHOOD_PROFILE_OPTIONS = ["Residential", "Commercial", "Mixed-Use", "Emerging Growth Corridor"];
// ── New in Section 2E: Legal & Verification Information ──
const RERA_STATUS_OPTIONS = ["Registered", "Not Applicable", "Pending Verification"];
const OWNERSHIP_TYPE_OPTIONS = ["Freehold", "Leasehold", "Cooperative", "Society", "Authority Lease", "Other"];
// ── New in Section 2F: Amenities & Lifestyle ──
const UNIT_FEATURES_OPTIONS = ["Modular Kitchen", "False Ceiling", "Wooden Flooring", "Vitrified Tile Flooring", "Walk-in Closet", "Study Room", "Private Balcony", "Premium Bath Fittings", "Piped Gas Connection", "In-unit Video Door Phone", "Air Conditioning", "Wardrobes", "Home Automation", "Private Terrace/Garden"];
const PARKING_TYPE_OPTIONS = ["Open", "Covered", "Basement", "Multi-level Mechanical", "Stilt", "None"];
const EV_CHARGING_OPTIONS = ["Available", "Not Available", "Planned"];
const POWER_BACKUP_OPTIONS = ["None", "Common Areas Only", "Partial Apartment Backup", "Full Apartment Backup"];
const SECURITY_FEATURES_OPTIONS = ["Security Guards", "CCTV Surveillance", "Access Control", "Video Door Phone"];
const WATER_SOURCE_OPTIONS = ["Municipal Supply", "Borewell", "Both", "Tanker Supply", "Not Specified"];
const WATER_SEWAGE_FEATURES_OPTIONS = ["Water Treatment Plant", "Sewage Treatment Plant (STP)", "Rainwater Harvesting"];
const INTERNET_READINESS_OPTIONS = ["Fibre Ready", "Broadband Ready", "Not Ready", "Not Specified"];
const MOBILE_NETWORK_QUALITY_OPTIONS = ["Excellent", "Good", "Average", "Poor", "Not Specified"];
const PET_POLICY_OPTIONS = ["Pets Allowed", "Not Allowed", "Restrictions Apply", "Not Specified"];
const SENIOR_CITIZEN_FEATURES_OPTIONS = ["Ramps", "Lifts", "Handrails", "Common Seating Areas", "Emergency Support/Alert System"];
const ACCESSIBILITY_FEATURES_OPTIONS = ["Wheelchair Ramps", "Wide Doorways", "Accessible Restrooms", "Braille Signage", "Accessible Parking", "Elevator Access", "Tactile Flooring"];
// ── New in Section 3C: Questions for Sellers / Listing Owners ──
const SELLER_ROLE_OPTIONS = ["Owner", "Authorized Representative", "Builder", "Agent"];
const EXCLUSIVE_LISTING_OPTIONS = ["Exclusive to PropertyBrands", "Also Listed Elsewhere"];
const OCCUPANCY_OPTIONS = ["Vacant", "Occupied by Owner", "Occupied by Tenant"];
const MARKETING_SUPPORT_OPTIONS = ["Professional Photography", "Video Walkthrough", "Valuation", "Marketing Support"];
// ── New in Section 2G: Media & Virtual Experience ──
const ROOM_LABEL_OPTIONS = ["Exterior", "Living Room", "Kitchen", "Bedroom", "Bathroom", "Balcony", "Dining Room", "Other"];
const MANDATORY_ROOM_CATEGORIES = ["Exterior", "Living Room", "Kitchen", "Bedroom", "Bathroom", "Balcony"];
const MIN_PHOTOS = 8;
const MAX_RECOMMENDED_PHOTOS = 15;
// Plots & land have no rooms — a few clear views of the land are what buyers want.
const LAND_MANDATORY_CATEGORIES = ["Plot View"];
const LAND_MIN_PHOTOS = 3;
// ── New in Section 2H: Seller / Agent Information ──
const POSTED_BY_OPTIONS = ["Owner", "Builder", "Channel Partner", "Agent", "Property Manager"];
const CONTACT_METHOD_OPTIONS = ["Call", "WhatsApp", "Chat", "Email"];

const EMPTY_FORM = {
  title: "",
  location: "",
  type: "Apartment",
  transactionType: "Buy",
  listingType: "Sale",
  priceRaw: "",
  priceOnRequest: false,
  bhk: [],
  amenities: [],
  area: "",
  status: "Ready to Move",
  description: "",
  googleMapsLink: "",
  latitude: null,
  longitude: null,
  videoUrls: [],
  locationVideoUrl: "",
  idealFor: [],
  investmentCorridor: "",
  images: [],
  unitConfigs: [],
  handoverDate: "",
  handoverTimeline: "",
  priceTrend: [],
  contactPhone: "",

  // ── Section 2A: Property Identity & Basic Details ──
  projectName: "",
  developerName: "",
  // ── Section 2E: Legal & Verification (self-declared subset only — see
  // migration_017 comment for why the rest stays admin-only) ──
  ownershipType: "",
  reraStatus: "Pending Verification",
  towerBlock: "",
  unitNumber: "",
  unitNumberPublic: true,
  bathrooms: "",
  balconies: "",
  servantRoom: false,
  builtUpArea: "",
  superBuiltUpArea: "",
  carpetArea: "",
  plotArea: "",
  // ── Plot / land details ──
  plotAreaValue: "",
  plotAreaUnit: "sqft",
  plotLength: "",
  plotWidth: "",
  roadWidth: "",
  cornerPlot: false,
  boundaryWall: false,
  landUse: "",
  plotApproval: "",
  openForJda: false,
  jdaTerms: "",
  titleVerified: false,
  zoningDone: false,
  floorNumber: "",
  totalFloors: "",
  totalUnits: "",
  facing: "",
  entranceDirection: "",
  vastuStatus: "Not Specified",
  furnishing: "",
  condition: "",
  age: "",

  // ── Section 2B: Price & Financial Transparency ──
  priceNegotiable: false,
  priceType: "All-Inclusive",
  costBase: "",
  costFloorRise: "",
  costParking: "",
  costClubhouse: "",
  costPlc: "",
  costGst: "",
  costRegistration: "",
  costMaintenanceDeposit: "",
  costOther: "",
  costOtherLabel: "",
  maintenanceAmount: "",
  maintenanceFrequency: "Monthly",
  securityDeposit: "",
  brokerageType: "None",
  brokerageAmount: "",
  lockInPeriod: "",
  noticePeriod: "",
  leaseTerms: "",
  emiInterestRate: 8.5,
  emiTenureYears: 20,
  emiDownPaymentPercent: 20,
  approvedBanks: [],
  loanEligibilityNotes: "",
  estimatedMonthlyRent: "",
  appreciationPotential: "",
  recommendedHoldingPeriod: "",

  // ── Section 2C: Location & Connectivity ──
  locality: "",
  landmark: "",
  city: "",
  pincode: "",
  addressVisibility: "Exact Address",
  nearbyLandmarks: [],
  roadWidth: "",
  approachRoadDetails: "",
  publicTransportNotes: "",
  neighbourhoodProfile: "",

  // ── Section 2F: Amenities & Lifestyle ──
  unitFeatures: [],
  parkingType: "",
  parkingSlots: "",
  evChargingStatus: "",
  powerBackupType: "",
  securityFeatures: [],
  waterSource: "",
  waterSewageFeatures: [],
  internetReadiness: "",
  mobileNetworkQuality: "",
  petPolicy: "",
  petPolicyNotes: "",
  seniorCitizenFeatures: [],
  accessibilityFeatures: [],

  // ── Section 2G: Media & Virtual Experience ──
  imageDetails: [],
  virtualTourUrl: "",
  droneViewUrl: "",
  floorPlanUrl: "",
  floorPlanCaption: "",
  brochureUrl: "",

  // ── Section 2H: Seller / Agent Information ──
  postedBy: "Owner",
  posterName: "",
  posterPhone: "",
  posterEmail: "",
  posterPhotoUrl: "",
  posterPreferredContactMethods: [],
  posterAvailabilityNotes: "",
  posterPhoneMaskingEnabled: true,

  // ── Section 3C: Questions for Sellers / Listing Owners ──
  sellerRoleConfirmation: "",
  sellerExclusiveListing: "",
  sellerReasonForSelling: "",
  sellerMinimumAcceptablePrice: "",
  sellerCurrentlyOccupied: "",
  sellerAvailabilityDate: "",
  sellerDocumentsAvailable: false,
  sellerWantsMarketingSupport: [],
  sellerContactAuthorization: false,

  // ── Section 4: Property Detail Page — Key Highlights ──
  keyHighlights: [],
};

const inputStyle = { background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#1F2937" };

function Field({ label, children, required, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
        {label}{required && <span style={{ color: "#DC2626" }}> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs mt-1.5" style={{ color: "#6B7280" }}>{hint}</p>}
    </div>
  );
}

function TextInput(props) {
  return <input {...props} className="w-full text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2" style={inputStyle} />;
}

function Select({ children, ...props }) {
  return <select {...props} className="w-full text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2" style={inputStyle}>{children}</select>;
}

function CustomizableSelect({ value, onChange, options = [], placeholder = "— Select —", addLabel = "+ Add Custom...", inputPlaceholder = "Enter custom..." }) {
  const [isCustom, setIsCustom] = useState(false);
  const [draft, setDraft] = useState("");
  const [customList, setCustomList] = useState([]);

  const allOpts = Array.from(new Set([...options, ...customList, ...(value && !options.includes(value) ? [value] : [])]));

  function commitCustom() {
    const val = draft.trim();
    if (val) {
      setCustomList((prev) => (prev.includes(val) ? prev : [...prev, val]));
      onChange(val);
    }
    setIsCustom(false);
    setDraft("");
  }

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitCustom();
            } else if (e.key === "Escape") {
              setIsCustom(false);
              setDraft("");
            }
          }}
          placeholder={inputPlaceholder}
          autoFocus
        />
        <button
          type="button"
          onClick={commitCustom}
          className="px-3 py-2 text-xs font-bold rounded-xl text-white bg-[#1565C0] shrink-0 hover:bg-[#0D47A1]"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => { setIsCustom(false); setDraft(""); }}
          className="px-2.5 py-2 text-xs font-semibold rounded-xl text-slate-600 bg-slate-100 shrink-0 hover:bg-slate-200"
          title="Cancel"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <Select
      value={value || ""}
      onChange={(e) => {
        if (e.target.value === "__custom__") {
          setIsCustom(true);
        } else {
          onChange(e.target.value);
        }
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {allOpts.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
      <option value="__custom__">{addLabel}</option>
    </Select>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
      style={{
        background: active ? "#1565C0" : "#F1F5F9",
        color: active ? "#FFFFFF" : "#6B7280",
        border: active ? "1px solid #1565C0" : "1px solid #E2E8F0",
      }}
    >
      {label}
    </button>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function PostProperty({ onNavigate }) {
  const { isLoggedIn } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [options, setOptions] = useState(null); // null = loading
  const [videoDraft, setVideoDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [photoWarnings, setPhotoWarnings] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Bare land (plots, agricultural land) is described by size/road/approvals, not rooms.
  const profile = getFormProfile(form.type);
  const isLand = profile.kind === "land";
  const minPhotos = isLand ? LAND_MIN_PHOTOS : MIN_PHOTOS;
  const mandatoryCategories = isLand ? LAND_MANDATORY_CATEGORIES : MANDATORY_ROOM_CATEGORIES;
  const photoLabelOptions = isLand ? LAND_PHOTO_LABELS : ROOM_LABEL_OPTIONS;

  const [corridors, setCorridors] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchListingFieldOptions().then(({ data }) => { if (!cancelled) setOptions(data); });
    fetchInvestmentOpportunities().then(({ data }) => { if (!cancelled && data) setCorridors(data); });
    return () => { cancelled = true; };
  }, []);

  const PROPERTY_TYPES = withExtraTypes(options?.propertyTypes?.length ? options.propertyTypes : DEFAULT_PROPERTY_TYPES);
  const BHK_OPTIONS = options?.bhkOptions?.length ? options.bhkOptions : DEFAULT_BHK_OPTIONS;
  const AMENITIES = options?.amenities?.length ? options.amenities : DEFAULT_AMENITIES;
  const POSSESSION_OPTIONS = options?.possessionOptions?.length ? options.possessionOptions : DEFAULT_POSSESSION_OPTIONS;
  const LAND_USE_OPTIONS = options?.landUseOptions?.length ? options.landUseOptions : DEFAULT_LAND_USE_OPTIONS;

  const [customBhkList, setCustomBhkList] = useState([]);
  const [showCustomBhk, setShowCustomBhk] = useState(false);
  const [customBhkDraft, setCustomBhkDraft] = useState("");

  const allBhkOptions = Array.from(new Set([...BHK_OPTIONS, ...customBhkList, ...(Array.isArray(form.bhk) ? form.bhk : [])]));

  function handleAddCustomBhk() {
    const val = customBhkDraft.trim();
    if (!val) return;
    const formatted = /^\d+(\.\d+)?$/.test(val) ? `${val} BHK` : val;
    if (!customBhkList.includes(formatted)) {
      setCustomBhkList((prev) => [...prev, formatted]);
    }
    if (!form.bhk.includes(formatted)) {
      setForm((f) => ({ ...f, bhk: [...f.bhk, formatted] }));
    }
    setCustomBhkDraft("");
    setShowCustomBhk(false);
  }

  const [customIdealForList, setCustomIdealForList] = useState([]);
  const [showCustomIdealFor, setShowCustomIdealFor] = useState(false);
  const [customIdealForDraft, setCustomIdealForDraft] = useState("");

  const allIdealForOptions = Array.from(new Set([
    ...DEFAULT_IDEAL_FOR_OPTIONS,
    ...customIdealForList,
    ...(Array.isArray(form.idealFor) ? form.idealFor : []),
  ]));

  function handleAddCustomIdealFor() {
    const val = customIdealForDraft.trim();
    if (!val) return;
    if (!customIdealForList.includes(val)) {
      setCustomIdealForList((prev) => [...prev, val]);
    }
    if (!form.idealFor.includes(val)) {
      setForm((f) => ({ ...f, idealFor: [...f.idealFor, val] }));
    }
    setCustomIdealForDraft("");
    setShowCustomIdealFor(false);
  }

  function toggleInArray(key, value) {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  }

  // ── Section 4: Why This Property — key highlights (simple text list) ──
  function addHighlight() {
    setForm((f) => ({ ...f, keyHighlights: [...f.keyHighlights, ""] }));
  }
  function updateHighlight(index, value) {
    setForm((f) => ({ ...f, keyHighlights: f.keyHighlights.map((h, i) => (i === index ? value : h)) }));
  }
  function removeHighlight(index) {
    setForm((f) => ({ ...f, keyHighlights: f.keyHighlights.filter((_, i) => i !== index) }));
  }

  // ── Section 2C: nearby landmarks (repeatable rows) ──
  function addLandmark() {
    setForm((f) => ({
      ...f,
      nearbyLandmarks: [...f.nearbyLandmarks, { _key: `new-${Date.now()}-${f.nearbyLandmarks.length}`, category: "School", name: "", distance: "", travelTime: "" }],
    }));
  }
  function updateLandmark(key, field, value) {
    setForm((f) => ({
      ...f,
      nearbyLandmarks: f.nearbyLandmarks.map((l) => (l._key === key ? { ...l, [field]: value } : l)),
    }));
  }
  function removeLandmark(key) {
    setForm((f) => ({ ...f, nearbyLandmarks: f.nearbyLandmarks.filter((l) => l._key !== key) }));
  }

  // Best-effort: suggests locality/city/pincode from a dropped pin without
  // overwriting anything the owner already typed, and never blocks pin-picking.
  async function handlePinChange({ latitude, longitude }) {
    setForm((f) => ({ ...f, latitude, longitude }));
    if (latitude == null || longitude == null) return;
    try {
      const suggestion = await reverseGeocode(latitude, longitude);
      setForm((f) => ({
        ...f,
        locality: f.locality || suggestion.locality || f.locality,
        city: f.city || suggestion.city || f.city,
        pincode: f.pincode || suggestion.pincode || f.pincode,
      }));
    } catch {
      // silent — reverse geocoding is a convenience, not a requirement
    }
  }

  // Pasting a Google Maps link into the link field also drops the map pin on
  // that spot (when the link contains coordinates), so the two never disagree.
  const [googleLinkNote, setGoogleLinkNote] = useState("");
  function handleGoogleLinkChange(value) {
    set("googleMapsLink", value);
    const parsed = parseGoogleMapsLocation(value);
    if (parsed?.short) {
      setGoogleLinkNote("This is a short link — it works for \"Get Directions\", but it doesn't contain coordinates, so the pin wasn't moved. Open it and paste the full address-bar URL to place the pin from it.");
    } else if (parsed) {
      setGoogleLinkNote("Pin placed from this link.");
      handlePinChange({ latitude: parsed.latitude, longitude: parsed.longitude });
    } else {
      setGoogleLinkNote("");
    }
  }

  function addVideoUrl() {
    if (!videoDraft.trim()) return;
    set("videoUrls", [...form.videoUrls, videoDraft.trim()]);
    setVideoDraft("");
  }

  function removeVideoUrl(url) {
    set("videoUrls", form.videoUrls.filter((u) => u !== url));
  }

  const imageHashesRef = useRef(new Map()); // url -> perceptual hash, this session only — not persisted

  // ── Section 2H: poster photo upload ──
  const [posterPhotoUploading, setPosterPhotoUploading] = useState(false);
  const [posterPhotoError, setPosterPhotoError] = useState("");
  async function handlePosterPhotoSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) { setPosterPhotoError(validationError); return; }
    setPosterPhotoError("");
    setPosterPhotoUploading(true);
    const { url, error } = await uploadToR2(file, "avatars");
    setPosterPhotoUploading(false);
    if (error) { setPosterPhotoError(error); return; }
    set("posterPhotoUrl", url);
  }

  // ── Section 2G: brochure upload (PDF or image, straight to R2) ──
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [brochureUploadError, setBrochureUploadError] = useState("");
  async function handleBrochureFileSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const validationError = validateDocumentFile(file);
    if (validationError) { setBrochureUploadError(validationError); return; }
    setBrochureUploadError("");
    setBrochureUploading(true);
    const { url, error } = await uploadToR2(file, "documents");
    setBrochureUploading(false);
    if (error) { setBrochureUploadError(error); return; }
    set("brochureUrl", url);
  }

  async function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadError("");
    setPhotoWarnings([]);
    setUploading(true);

    const newWarnings = [];
    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) { setUploadError(validationError); continue; }

      try {
        const [hash, dims] = await Promise.all([computeImageHash(file), getImageDimensions(file)]);
        if (looksLikeScreenshot(file, dims.width, dims.height)) {
          newWarnings.push(`"${file.name}" looks like it might be a screenshot — double-check before submitting.`);
        }
        for (const [existingUrl, existingHash] of imageHashesRef.current) {
          if (hammingDistance(hash, existingHash) <= 5) {
            newWarnings.push(`"${file.name}" looks like a duplicate (or near-duplicate) of a photo already added.`);
            break;
          }
        }
        imageHashesRef.current.set(file.name, hash);
      } catch {
        // hashing is a convenience check — never block the actual upload over it
      }

      const result = await uploadToR2(file, "listings");
      if (result.error) {
        setUploadError(result.error);
      } else {
        setForm((f) => ({ ...f, images: [...f.images, result.url] }));
        const hash = imageHashesRef.current.get(file.name);
        if (hash) { imageHashesRef.current.delete(file.name); imageHashesRef.current.set(result.url, hash); }
      }
    }
    if (newWarnings.length) setPhotoWarnings(newWarnings);
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url) {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url), imageDetails: f.imageDetails.filter((d) => d.url !== url) }));
    imageHashesRef.current.delete(url);
  }

  function moveImage(url, direction) {
    setForm((f) => {
      const idx = f.images.indexOf(url);
      const swapWith = idx + direction;
      if (swapWith < 0 || swapWith >= f.images.length) return f;
      const images = [...f.images];
      [images[idx], images[swapWith]] = [images[swapWith], images[idx]];
      return { ...f, images };
    });
  }

  function makeCoverImage(url) {
    setForm((f) => ({ ...f, images: [url, ...f.images.filter((u) => u !== url)] }));
  }

  function imageDetailFor(f, url) {
    return f.imageDetails.find((d) => d.url === url) || { url, caption: "", roomLabel: "" };
  }

  function setImageDetail(url, field, value) {
    setForm((f) => {
      const existing = f.imageDetails.find((d) => d.url === url);
      const imageDetails = existing
        ? f.imageDetails.map((d) => (d.url === url ? { ...d, [field]: value } : d))
        : [...f.imageDetails, { url, caption: "", roomLabel: "", [field]: value }];
      return { ...f, imageDetails };
    });
  }

  function missingMandatoryCategories() {
    const covered = new Set(form.imageDetails.filter((d) => d.roomLabel).map((d) => d.roomLabel));
    return mandatoryCategories.filter((c) => !covered.has(c));
  }

  function priceLabelFromRaw(raw) {
    return parsePriceInput(raw, form.transactionType).label;
  }

  function numericPrice() {
    if (form.priceOnRequest) return 0;
    return parsePriceInput(form.priceRaw, form.transactionType).numericValue;
  }

  // ── Section 2B live previews — see AdminListingForm.jsx for the same logic ──
  function estimatedAreaSqft() {
    if (isLand) return resolvePlotArea(form);
    return Number(form.builtUpArea) || Number(form.superBuiltUpArea) || Number(form.carpetArea) || Number(form.plotArea) || null;
  }

  function pricePerSqftPreview() {
    const area = estimatedAreaSqft();
    const price = numericPrice();
    if (!area || !price) return null;
    return Math.round(price / area);
  }

  function emiPreview() {
    const price = numericPrice();
    const rate = Number(form.emiInterestRate) || 0;
    const years = Number(form.emiTenureYears) || 0;
    const downPct = Number(form.emiDownPaymentPercent) || 0;
    if (!price || !years) return null;
    const principal = price * (1 - downPct / 100);
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) return Math.round(principal / months);
    const factor = Math.pow(1 + monthlyRate, months);
    const emi = (principal * monthlyRate * factor) / (factor - 1);
    return isFinite(emi) && emi > 0 ? Math.round(emi) : null;
  }

  function downPaymentPreview() {
    const price = numericPrice();
    const downPct = Number(form.emiDownPaymentPercent) || 0;
    if (!price) return null;
    return Math.round(price * (downPct / 100));
  }

  function rentalYieldPreview() {
    const price = numericPrice();
    const rent = Number(form.estimatedMonthlyRent) || 0;
    if (!price || !rent) return null;
    return ((rent * 12 / price) * 100).toFixed(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaveError("");

    if (!form.title || !form.location || (!form.priceOnRequest && !String(form.priceRaw).trim())) {
      setSaveError('Title, location, and price are required — or check "Call for Details" if you\'d rather not list a price.');
      return;
    }

    if (String(form.contactPhone || "").replace(/\D/g, "").slice(-10).length !== 10) {
      setSaveError("Please enter your 10-digit contact number — our team uses it to verify and approve your listing.");
      return;
    }

    const landProblem = landValidationMessage(form);
    if (landProblem) {
      setSaveError(landProblem);
      return;
    }

    setSaving(true);
    const { error } = await createListing({
      ...form,
      price: form.priceOnRequest ? "" : priceLabelFromRaw(form.priceRaw),
      // moderationStatus intentionally omitted — createListing/denormalizeListing
      // defaults it to "Pending", and RLS only allows inserting as Pending anyway.
    });
    setSaving(false);

    if (error) {
      setSaveError(error.message || "Something went wrong submitting your property. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  // ── Not logged in ──
  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#EFF6FF" }}>
          <Home className="w-7 h-7" style={{ color: "#1565C0" }} strokeWidth={2} />
        </span>
        <p className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>Log in to post your property</p>
        <p className="text-sm mb-5 max-w-sm" style={{ color: "#6B7280" }}>
          Creating a free account lets you manage your listing and track inquiries from interested buyers or tenants.
        </p>
        <button onClick={() => setAuthModalOpen(true)} className="px-6 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#1565C0", color: "#FFFFFF" }}>
          Log In / Sign Up
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // ── Submitted ──
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#F0FDF4" }}>
          <CheckCircle2 className="w-8 h-8" style={{ color: "#16A34A" }} strokeWidth={2} />
        </span>
        <p className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>Property submitted for review!</p>
        <p className="text-sm mb-6 max-w-sm" style={{ color: "#6B7280" }}>
          Our team will verify the details and publish it within 24 hours. You can track its status from your profile.
        </p>
        <div className="flex gap-3">
          <button onClick={() => onNavigate && onNavigate("my-properties")} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#EFF6FF", color: "#1565C0" }}>
            My Properties
          </button>
          <button onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); }} className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ background: "#1565C0", color: "#FFFFFF" }}>
            Post Another
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div style={{ background: "#FFFFFF" }} className="px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#FFFFFF", color: "#1565C0", border: "1px solid #1565C0" }}>
            Free Listing
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: "#1F2937" }}>Post Your Property</h1>
          <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
            List your property for free. Our team reviews every submission before it goes live.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {saveError && (
            <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: "#FEE2E2", color: "#DC2626" }}>{saveError}</div>
          )}

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <Field label="Title" required>
              <TextInput value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={profile.titleHint} required />
            </Field>

            <Field label="Location" required>
              <TextInput value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Patia, Bhubaneswar" required />
            </Field>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Transaction Type">
                <Select value={form.transactionType} onChange={(e) => set("transactionType", e.target.value)}>
                  <option value="Buy">For Sale</option>
                  <option value="Rent">For Rent</option>
                </Select>
              </Field>
              <Field label="Property Type">
                <CustomizableSelect
                  value={form.type}
                  onChange={(val) => {
                    setForm((f) => ({
                      ...f,
                      type: val,
                      ...((val === "Agricultural Land" || val === "Farmhouse") && !f.landUse ? { landUse: "Agricultural" } : {})
                    }));
                  }}
                  options={PROPERTY_TYPES}
                  placeholder=""
                  addLabel="+ Add Custom Type..."
                  inputPlaceholder="e.g. Row House / Penthouse"
                />
              </Field>
              <Field label="Possession">
                <CustomizableSelect
                  value={form.status}
                  onChange={(val) => set("status", val)}
                  options={POSSESSION_OPTIONS}
                  placeholder=""
                  addLabel="+ Add Custom Possession..."
                  inputPlaceholder="e.g. Immediate / Ready Dec 2026"
                />
              </Field>
            </div>

            {isLand ? (
              <div className="rounded-xl p-4 space-y-4" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1F2937" }}>Plot / Land Details</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Plots are searched by size, road access and approvals — fill in what you know.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Plot Area" required hint="Pick the unit you know — we store it in sq ft.">
                    <div className="flex gap-2">
                      <TextInput type="number" min="0" step="any" value={form.plotAreaValue} onChange={(e) => set("plotAreaValue", e.target.value)} placeholder="e.g. 1800" />
                      <Select value={form.plotAreaUnit} onChange={(e) => set("plotAreaUnit", e.target.value)}>
                        {PLOT_AREA_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </Select>
                    </div>
                    {formatPlotArea(resolvePlotArea(form)) && (
                      <p className="text-[11px] mt-1 font-semibold" style={{ color: "#16A34A" }}>= {formatPlotArea(resolvePlotArea(form))}</p>
                    )}
                  </Field>
                  <Field label="Road Width (ft)" hint="Width of the road the plot faces">
                    <TextInput type="number" min="0" step="any" value={form.roadWidth} onChange={(e) => set("roadWidth", e.target.value)} placeholder="e.g. 30" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Length (ft)" hint="Optional">
                    <TextInput type="number" min="0" step="any" value={form.plotLength} onChange={(e) => set("plotLength", e.target.value)} placeholder="e.g. 60" />
                  </Field>
                  <Field label="Width (ft)" hint="Optional">
                    <TextInput type="number" min="0" step="any" value={form.plotWidth} onChange={(e) => set("plotWidth", e.target.value)} placeholder="e.g. 30" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Land Use">
                    <CustomizableSelect
                      value={form.landUse}
                      onChange={(val) => set("landUse", val)}
                      options={LAND_USE_OPTIONS}
                      placeholder="— Select —"
                      addLabel="+ Add Custom Land Use..."
                      inputPlaceholder="e.g. Farmhouse Zoning"
                    />
                  </Field>
                  <Field label="Approval / Layout">
                    <CustomizableSelect
                      value={form.plotApproval}
                      onChange={(val) => set("plotApproval", val)}
                      options={PLOT_APPROVAL_OPTIONS}
                      placeholder="— Select —"
                      addLabel="+ Add Custom Approval..."
                      inputPlaceholder="e.g. BDA Approved / Gram Panchayat"
                    />
                  </Field>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                    <input type="checkbox" checked={form.cornerPlot} onChange={(e) => set("cornerPlot", e.target.checked)} className="w-4 h-4 rounded accent-[#1565C0]" />
                    Corner plot
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                    <input type="checkbox" checked={form.boundaryWall} onChange={(e) => set("boundaryWall", e.target.checked)} className="w-4 h-4 rounded accent-[#1565C0]" />
                    Boundary wall built
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-200/80 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Joint Development & Verification</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer" style={{ color: "#1565C0" }}>
                      <input
                        type="checkbox"
                        checked={form.openForJda}
                        onChange={(e) => set("openForJda", e.target.checked)}
                        className="w-4 h-4 rounded accent-[#1565C0]"
                      />
                      <span>🤝 Open for Joint Development (JDA)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                      <input
                        type="checkbox"
                        checked={form.titleVerified}
                        onChange={(e) => set("titleVerified", e.target.checked)}
                        className="w-4 h-4 rounded accent-[#1565C0]"
                      />
                      🛡️ Title & Encumbrance Verified
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                      <input
                        type="checkbox"
                        checked={form.zoningDone}
                        onChange={(e) => set("zoningDone", e.target.checked)}
                        className="w-4 h-4 rounded accent-[#1565C0]"
                      />
                      📑 Zoning & Conversion Done
                    </label>
                  </div>
                  {form.openForJda && (
                    <Field label="JDA Terms / Revenue Share Ratio" hint="e.g. 50:50 Revenue Share, Area Sharing, or Open for builder proposals">
                      <TextInput
                        value={form.jdaTerms}
                        onChange={(e) => set("jdaTerms", e.target.value)}
                        placeholder="e.g. 50:50 Revenue Share / Open for proposals"
                      />
                    </Field>
                  )}
                </div>
              </div>
            ) : profile.bhk ? (
            <Field label="BHK" hint="Select all that apply — e.g. a project offering both 2 BHK and 3 BHK units.">
              <div className="flex flex-wrap items-center gap-2">
                {allBhkOptions.map((b) => (
                  <Chip key={b} label={b} active={form.bhk.includes(b)} onClick={() => toggleInArray("bhk", b)} />
                ))}
                {showCustomBhk ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-400 bg-blue-50/60">
                    <input
                      type="text"
                      value={customBhkDraft}
                      onChange={(e) => setCustomBhkDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomBhk();
                        } else if (e.key === "Escape") {
                          setShowCustomBhk(false);
                        }
                      }}
                      placeholder="e.g. 2.5 BHK, 6 BHK"
                      className="text-xs bg-transparent outline-none w-28 text-slate-800 font-semibold placeholder:text-slate-400"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomBhk}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 px-1 py-0.5 rounded"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCustomBhk(false); setCustomBhkDraft(""); }}
                      className="text-xs text-slate-400 hover:text-slate-600 px-0.5"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCustomBhk(true)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="text-sm font-bold leading-none">+</span> Custom
                  </button>
                )}
              </div>
            </Field>
            ) : null}

            <Field label="Pin Location on Map" hint="This powers the interactive map buyers/tenants see on your listing.">
              <LocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onChange={handlePinChange}
              />
            </Field>

            <Field label="Google Maps Link (optional)" hint="Paste a full Google Maps link and the pin above moves to it. Also used for the &quot;Get Directions&quot; button.">
              <TextInput value={form.googleMapsLink} onChange={(e) => handleGoogleLinkChange(e.target.value)}
                placeholder="Paste a Google Maps share link (optional)" />
              {googleLinkNote && <p className="text-xs mt-1.5" style={{ color: googleLinkNote.startsWith("Pin placed") ? "#16A34A" : "#B45309" }}>{googleLinkNote}</p>}
            </Field>

            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label={`Price (${form.transactionType === "Rent" ? "₹ / month" : "₹ total"})`}
                  required={!form.priceOnRequest}
                  hint="Single price (e.g. 60000 or 2.4 Cr) or price range (e.g. 6000-60000 or ₹6000 - ₹60000)"
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm select-none">
                      ₹
                    </div>
                    <TextInput
                      type="text"
                      value={form.priceRaw}
                      onChange={(e) => set("priceRaw", e.target.value)}
                      placeholder={form.transactionType === "Rent" ? "e.g. 6000 - 60000 or 25000" : "e.g. 24000000 or 50 Lac - 1.2 Cr"}
                      required={!form.priceOnRequest}
                      disabled={form.priceOnRequest}
                      className="pl-8"
                    />
                  </div>
                </Field>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Quick helpers:</span>
                <button
                  type="button"
                  onClick={() => set("priceRaw", form.transactionType === "Rent" ? "6000 - 60000" : "50 Lac - 1.2 Cr")}
                  className="px-2 py-0.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                >
                  + Price Range
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const curr = form.priceRaw || "";
                    if (!curr.startsWith("₹")) set("priceRaw", `₹ ${curr}`.trim());
                  }}
                  className="px-2 py-0.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition"
                >
                  + ₹ Sign
                </button>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer pt-1" style={{ color: "#1F2937" }}>
                <input
                  type="checkbox"
                  checked={form.priceOnRequest}
                  onChange={(e) => set("priceOnRequest", e.target.checked)}
                  className="w-4 h-4 rounded accent-[#1565C0]"
                />
                Don't want to list a price? Show "Call for Details" instead
              </label>

              {form.priceOnRequest ? (
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Will display as <span className="font-bold" style={{ color: "#1565C0" }}>Call for Details</span> — interested buyers/tenants will need to reach out directly instead of seeing a number.
                </p>
              ) : form.priceRaw ? (
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Will display as <span className="font-bold" style={{ color: "#1565C0" }}>{priceLabelFromRaw(form.priceRaw)}</span>
                </p>
              ) : null}
            </div>

            <Field label="Description">
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4}
                placeholder="Tell buyers or tenants a bit about the property..."
                className="w-full text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 resize-none" style={inputStyle} />
            </Field>

            <Field label="Why This Property? — Key Highlights" hint="3-5 short reasons this property stands out.">
              <div className="space-y-2">
                {form.keyHighlights.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <TextInput value={h} onChange={(e) => updateHighlight(i, e.target.value)} placeholder="e.g. Corner unit with unobstructed park view" />
                    <button type="button" onClick={() => removeHighlight(i)} className="text-xs font-bold px-3 py-2 rounded-lg shrink-0 hover:opacity-80" style={{ color: "#DC2626" }}>Remove</button>
                  </div>
                ))}
                {form.keyHighlights.length < 5 && (
                  <button type="button" onClick={addHighlight} className="text-xs font-bold px-3 py-2 rounded-lg" style={{ background: "#EFF6FF", color: "#1565C0" }}>
                    + Add Highlight
                  </button>
                )}
              </div>
            </Field>

            <Field label="Amenities">
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <Chip key={a} label={a} active={form.amenities.includes(a)} onClick={() => toggleInArray("amenities", a)} />
                ))}
              </div>
            </Field>

            {/* Ideal For */}
            <Field label="Ideal For" hint="Select who this property suits best, or add your own custom targets — displayed on the listing page.">
              <div className="flex flex-wrap items-center gap-2">
                {allIdealForOptions.map((opt) => (
                  <Chip key={opt} label={opt} active={(form.idealFor || []).includes(opt)} onClick={() => toggleInArray("idealFor", opt)} />
                ))}
                {showCustomIdealFor ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-400 bg-blue-50/60">
                    <input
                      type="text"
                      value={customIdealForDraft}
                      onChange={(e) => setCustomIdealForDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomIdealFor();
                        } else if (e.key === "Escape") {
                          setShowCustomIdealFor(false);
                        }
                      }}
                      placeholder="e.g. IT Professionals, Expats"
                      className="text-xs bg-transparent outline-none w-36 text-slate-800 font-semibold placeholder:text-slate-400"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomIdealFor}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 px-1 py-0.5 rounded"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCustomIdealFor(false); setCustomIdealForDraft(""); }}
                      className="text-xs text-slate-400 hover:text-slate-600 px-0.5"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCustomIdealFor(true)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="text-sm font-bold leading-none">+</span> Custom Ideal For
                  </button>
                )}
              </div>
            </Field>

            {/* Investment Corridor / Opportunity */}
            <Field label="Investment Corridor / Advisory Opportunity" hint="Link this property directly to an Investment Corridor (e.g. Nayapalli, Main Road) so visitors browsing investment opportunities find this property directly.">
              <Select value={form.investmentCorridor || ""} onChange={(e) => set("investmentCorridor", e.target.value)}>
                <option value="">— Not linked to an investment corridor —</option>
                {corridors.map((c) => (
                  <option key={c.id || c.area} value={c.area}>
                    {c.area} ({c.tag || c.type || c.city})
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="rounded-2xl p-6 space-y-6" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Amenities &amp; Lifestyle</h2>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Unit-level features, parking, security, utilities, and accessibility.</p>
            </div>

            <Field label="Unit-Level Features" hint="Specific to this unit — separate from the shared amenities above.">
              <div className="flex flex-wrap gap-2">
                {UNIT_FEATURES_OPTIONS.map((u) => (
                  <Chip key={u} label={u} active={form.unitFeatures.includes(u)} onClick={() => toggleInArray("unitFeatures", u)} />
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Parking Type">
                <Select value={form.parkingType} onChange={(e) => set("parkingType", e.target.value)}>
                  <option value="">— N/A —</option>
                  {PARKING_TYPE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </Field>
              <Field label="Parking Slots">
                <TextInput type="number" min="0" value={form.parkingSlots} onChange={(e) => set("parkingSlots", e.target.value)} placeholder="e.g. 2" />
              </Field>
              <Field label="EV Charging">
                <Select value={form.evChargingStatus} onChange={(e) => set("evChargingStatus", e.target.value)}>
                  <option value="">— N/A —</option>
                  {EV_CHARGING_OPTIONS.map((e_) => <option key={e_} value={e_}>{e_}</option>)}
                </Select>
              </Field>
            </div>

            <Field label="Power Backup">
              <Select value={form.powerBackupType} onChange={(e) => set("powerBackupType", e.target.value)}>
                <option value="">— N/A —</option>
                {POWER_BACKUP_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>

            <Field label="Security Features">
              <div className="flex flex-wrap gap-2">
                {SECURITY_FEATURES_OPTIONS.map((s) => (
                  <Chip key={s} label={s} active={form.securityFeatures.includes(s)} onClick={() => toggleInArray("securityFeatures", s)} />
                ))}
              </div>
            </Field>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7280" }}>Water &amp; Sewage</h3>
              <Field label="Water Source">
                <Select value={form.waterSource} onChange={(e) => set("waterSource", e.target.value)}>
                  <option value="">— N/A —</option>
                  {WATER_SOURCE_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
                </Select>
              </Field>
              <div className="mt-3">
                <Field label="Water & Sewage Features">
                  <div className="flex flex-wrap gap-2">
                    {WATER_SEWAGE_FEATURES_OPTIONS.map((w) => (
                      <Chip key={w} label={w} active={form.waterSewageFeatures.includes(w)} onClick={() => toggleInArray("waterSewageFeatures", w)} />
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Internet / Fibre Readiness">
                <Select value={form.internetReadiness} onChange={(e) => set("internetReadiness", e.target.value)}>
                  <option value="">— N/A —</option>
                  {INTERNET_READINESS_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </Select>
              </Field>
              <Field label="Mobile Network Quality">
                <Select value={form.mobileNetworkQuality} onChange={(e) => set("mobileNetworkQuality", e.target.value)}>
                  <option value="">— N/A —</option>
                  {MOBILE_NETWORK_QUALITY_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Pet Policy">
                <Select value={form.petPolicy} onChange={(e) => set("petPolicy", e.target.value)}>
                  <option value="">— N/A —</option>
                  {PET_POLICY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </Field>
              <Field label="Pet Policy Notes">
                <TextInput value={form.petPolicyNotes} onChange={(e) => set("petPolicyNotes", e.target.value)} placeholder="e.g. Small breeds only" />
              </Field>
            </div>

            <Field label="Senior-Citizen-Friendly Features">
              <div className="flex flex-wrap gap-2">
                {SENIOR_CITIZEN_FEATURES_OPTIONS.map((s) => (
                  <Chip key={s} label={s} active={form.seniorCitizenFeatures.includes(s)} onClick={() => toggleInArray("seniorCitizenFeatures", s)} />
                ))}
              </div>
            </Field>

            <Field label="Accessibility Features">
              <div className="flex flex-wrap gap-2">
                {ACCESSIBILITY_FEATURES_OPTIONS.map((a) => (
                  <Chip key={a} label={a} active={form.accessibilityFeatures.includes(a)} onClick={() => toggleInArray("accessibilityFeatures", a)} />
                ))}
              </div>
            </Field>
          </div>

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Property Identity &amp; Configuration</h2>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Project details, room configuration, and area breakdown — helps buyers/tenants find exactly what they need.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Project Name" hint="Optional">
                <TextInput value={form.projectName} onChange={(e) => set("projectName", e.target.value)} placeholder="e.g. Skyline Residency" />
              </Field>
              <Field label="Developer / Builder Name" hint="Optional">
                <TextInput value={form.developerName} onChange={(e) => set("developerName", e.target.value)} placeholder="e.g. Skyline Builders" />
              </Field>
            </div>
            {(profile.tower || profile.unitLabel) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.tower && (
                <Field label="Tower / Block">
                  <TextInput value={form.towerBlock} onChange={(e) => set("towerBlock", e.target.value)} placeholder="e.g. Tower B" />
                </Field>
              )}
              {profile.unitLabel && (
                <Field label={profile.unitLabel}>
                  <TextInput value={form.unitNumber} onChange={(e) => set("unitNumber", e.target.value)} placeholder={profile.unitPlaceholder} />
                </Field>
              )}
            </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ownership Type" hint="Optional">
                <CustomizableSelect
                  value={form.ownershipType}
                  onChange={(val) => set("ownershipType", val)}
                  options={OWNERSHIP_TYPE_OPTIONS}
                  placeholder="— N/A —"
                  addLabel="+ Add Custom Ownership..."
                  inputPlaceholder="e.g. Freehold / Patta"
                />
              </Field>
              <Field label="RERA Status">
                <Select value={form.reraStatus} onChange={(e) => set("reraStatus", e.target.value)}>
                  {RERA_STATUS_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </Select>
              </Field>
            </div>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Other legal details (title status, certificates, verification) are confirmed by our team after review.
            </p>

            {profile.unitLabel && (
            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
              <input type="checkbox" checked={form.unitNumberPublic} onChange={(e) => set("unitNumberPublic", e.target.checked)} className="w-4 h-4 rounded accent-[#1565C0]" />
              Show my {profile.unitLabel.toLowerCase()} on the public listing
            </label>
            )}

            <Field label="Listing Type">
              <Select value={form.listingType} onChange={(e) => { set("listingType", e.target.value); set("transactionType", transactionFor(e.target.value, form.transactionType)); }}>
                {LISTING_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>

            {(profile.bathrooms || profile.balconies || profile.servantRoom) && (
            <div className="grid grid-cols-3 gap-4">
              {profile.bathrooms && (
                <Field label={profile.bathLabel}>
                  <TextInput type="number" min="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} placeholder="e.g. 2" />
                </Field>
              )}
              {profile.balconies && (
                <Field label="Balconies">
                  <TextInput type="number" min="0" value={form.balconies} onChange={(e) => set("balconies", e.target.value)} placeholder="e.g. 1" />
                </Field>
              )}
              {profile.servantRoom && (
                <div className="flex items-end pb-2.5">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                    <input type="checkbox" checked={form.servantRoom} onChange={(e) => set("servantRoom", e.target.checked)} className="w-4 h-4 rounded accent-[#1565C0]" />
                    Servant Room
                  </label>
                </div>
              )}
            </div>
            )}

            {profile.areas.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#1F2937" }}>Area (sqft)</p>
              {profile.areaHint && <p className="text-xs mb-2" style={{ color: "#6B7280" }}>{profile.areaHint}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {profile.areas.map((k) => (
                  <Field key={k} label={AREA_LABELS[k]}>
                    <TextInput type="number" min="0" value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder="sq ft" />
                  </Field>
                ))}
              </div>
            </div>
            )}

            {(profile.floorNumber || profile.totalFloors || profile.totalUnits) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.floorNumber && (
                <Field label="Floor Number" hint="0 = ground floor">
                  <TextInput type="number" min="0" value={form.floorNumber} onChange={(e) => set("floorNumber", e.target.value)} placeholder="e.g. 8" />
                </Field>
              )}
              {profile.totalFloors && (
                <Field label={profile.totalFloorsLabel}>
                  <TextInput type="number" min="0" value={form.totalFloors} onChange={(e) => set("totalFloors", e.target.value)} placeholder="e.g. 12" />
                </Field>
              )}
              {profile.totalUnits && (
                <Field label="Total Units in Project">
                  <TextInput type="number" min="0" value={form.totalUnits} onChange={(e) => set("totalUnits", e.target.value)} placeholder="e.g. 240" />
                </Field>
              )}
            </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Facing">
                <CustomizableSelect
                  value={form.facing}
                  onChange={(val) => set("facing", val)}
                  options={FACING_OPTIONS}
                  placeholder="— N/A —"
                  addLabel="+ Add Custom Facing..."
                  inputPlaceholder="e.g. North-North-East"
                />
              </Field>
              <Field label="Entrance Direction">
                <CustomizableSelect
                  value={form.entranceDirection}
                  onChange={(val) => set("entranceDirection", val)}
                  options={FACING_OPTIONS}
                  placeholder="— N/A —"
                  addLabel="+ Add Custom Direction..."
                  inputPlaceholder="e.g. North-East"
                />
              </Field>
              <Field label="Vastu Status">
                <CustomizableSelect
                  value={form.vastuStatus}
                  onChange={(val) => set("vastuStatus", val)}
                  options={VASTU_OPTIONS}
                  placeholder=""
                  addLabel="+ Add Custom Vastu..."
                  inputPlaceholder="e.g. Partially Compliant"
                />
              </Field>
            </div>

            {(profile.furnishing || profile.condition || profile.age) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {profile.furnishing && (
                <Field label="Furnishing">
                  <CustomizableSelect
                    value={form.furnishing}
                    onChange={(val) => set("furnishing", val)}
                    options={FURNISHING_OPTIONS}
                    placeholder="— N/A —"
                    addLabel="+ Add Custom Furnishing..."
                    inputPlaceholder="e.g. Semi-Furnished with White Goods"
                  />
                </Field>
              )}
              {profile.condition && (
                <Field label="Condition">
                  <CustomizableSelect
                    value={form.condition}
                    onChange={(val) => set("condition", val)}
                    options={CONDITION_OPTIONS}
                    placeholder="— N/A —"
                    addLabel="+ Add Custom Condition..."
                    inputPlaceholder="e.g. Under Remodeling"
                  />
                </Field>
              )}
              {profile.age && (
                <Field label="Age of Property">
                  <TextInput value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="e.g. 2 years / New" />
                </Field>
              )}
            </div>
            )}
          </div>

          <ProjectExtrasFields form={form} set={set} isLand={isLand} hasBhk={!!profile.bhk} />

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Price &amp; Financial Details</h2>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Optional, but listings with a transparent cost breakup get more serious inquiries.</p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
                <input type="checkbox" checked={form.priceNegotiable} onChange={(e) => set("priceNegotiable", e.target.checked)} className="w-4 h-4 rounded accent-[#1565C0]" />
                Price is negotiable
              </label>
              <div className="flex-1 min-w-[180px]">
                <Field label="Price Type">
                  <Select value={form.priceType} onChange={(e) => set("priceType", e.target.value)}>
                    {PRICE_TYPE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </Field>
              </div>
            </div>

            {pricePerSqftPreview() && (
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Price per sqft: <span className="font-bold" style={{ color: "#1565C0" }}>₹{pricePerSqftPreview().toLocaleString("en-IN")}/sqft</span>
              </p>
            )}

            <Field label="Cost Breakup (optional)" hint="Fill in whichever line items apply.">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <TextInput type="number" min="0" value={form.costBase} onChange={(e) => set("costBase", e.target.value)} placeholder="Base Cost" />
                <TextInput type="number" min="0" value={form.costFloorRise} onChange={(e) => set("costFloorRise", e.target.value)} placeholder="Floor Rise" />
                <TextInput type="number" min="0" value={form.costParking} onChange={(e) => set("costParking", e.target.value)} placeholder="Parking" />
                <TextInput type="number" min="0" value={form.costClubhouse} onChange={(e) => set("costClubhouse", e.target.value)} placeholder="Clubhouse" />
                <TextInput type="number" min="0" value={form.costPlc} onChange={(e) => set("costPlc", e.target.value)} placeholder="PLC" />
                <TextInput type="number" min="0" value={form.costGst} onChange={(e) => set("costGst", e.target.value)} placeholder="GST" />
                <TextInput type="number" min="0" value={form.costRegistration} onChange={(e) => set("costRegistration", e.target.value)} placeholder="Registration" />
                <TextInput type="number" min="0" value={form.costMaintenanceDeposit} onChange={(e) => set("costMaintenanceDeposit", e.target.value)} placeholder="Maintenance Deposit" />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Monthly Maintenance">
                <TextInput type="number" min="0" value={form.maintenanceAmount} onChange={(e) => set("maintenanceAmount", e.target.value)} placeholder="e.g. 3500" />
              </Field>
              <Field label="Maintenance Frequency">
                <Select value={form.maintenanceFrequency} onChange={(e) => set("maintenanceFrequency", e.target.value)}>
                  {MAINTENANCE_FREQUENCY_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
              </Field>
            </div>

            {form.transactionType === "Rent" && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7280" }}>Rental Terms</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Field label="Security Deposit">
                    <TextInput type="number" min="0" value={form.securityDeposit} onChange={(e) => set("securityDeposit", e.target.value)} placeholder="e.g. 100000" />
                  </Field>
                  <Field label="Brokerage">
                    <Select value={form.brokerageType} onChange={(e) => set("brokerageType", e.target.value)}>
                      {BROKERAGE_TYPE_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
                    </Select>
                  </Field>
                  {(form.brokerageType === "Fixed Amount" || form.brokerageType === "Percentage of Rent") && (
                    <Field label={form.brokerageType === "Percentage of Rent" ? "Brokerage (%)" : "Brokerage (₹)"}>
                      <TextInput type="number" min="0" value={form.brokerageAmount} onChange={(e) => set("brokerageAmount", e.target.value)} />
                    </Field>
                  )}
                  <Field label="Lock-in Period">
                    <TextInput value={form.lockInPeriod} onChange={(e) => set("lockInPeriod", e.target.value)} placeholder="e.g. 11 months" />
                  </Field>
                  <Field label="Notice Period">
                    <TextInput value={form.noticePeriod} onChange={(e) => set("noticePeriod", e.target.value)} placeholder="e.g. 1 month" />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Other Lease Terms">
                    <textarea value={form.leaseTerms} onChange={(e) => set("leaseTerms", e.target.value)} rows={2}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 resize-none" style={inputStyle} />
                  </Field>
                </div>
              </div>
            )}

            {form.transactionType === "Buy" && (
              <>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7280" }}>EMI Assumptions</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Interest Rate (% p.a.)">
                      <TextInput type="number" min="0" step="0.1" value={form.emiInterestRate} onChange={(e) => set("emiInterestRate", e.target.value)} />
                    </Field>
                    <Field label="Tenure (years)">
                      <TextInput type="number" min="1" value={form.emiTenureYears} onChange={(e) => set("emiTenureYears", e.target.value)} />
                    </Field>
                    <Field label="Down Payment (%)">
                      <TextInput type="number" min="0" max="100" value={form.emiDownPaymentPercent} onChange={(e) => set("emiDownPaymentPercent", e.target.value)} />
                    </Field>
                  </div>
                  {(emiPreview() || downPaymentPreview()) && (
                    <p className="text-xs mt-2" style={{ color: "#6B7280" }}>
                      {downPaymentPreview() && <>Down payment ≈ <span className="font-bold" style={{ color: "#1565C0" }}>₹{downPaymentPreview().toLocaleString("en-IN")}</span>. </>}
                      {emiPreview() && <>Estimated EMI ≈ <span className="font-bold" style={{ color: "#1565C0" }}>₹{emiPreview().toLocaleString("en-IN")}/month</span>.</>}
                    </p>
                  )}
                </div>

                <Field label="Loan Eligibility — Approved Banks" hint="Select banks that have pre-approved this project, if known.">
                  <div className="flex flex-wrap gap-2">
                    {BANK_PRESETS.map((b) => (
                      <Chip key={b} label={b} active={form.approvedBanks.includes(b)} onClick={() => toggleInArray("approvedBanks", b)} />
                    ))}
                  </div>
                </Field>

                <Field label="Loan Eligibility Notes">
                  <TextInput value={form.loanEligibilityNotes} onChange={(e) => set("loanEligibilityNotes", e.target.value)} placeholder="e.g. Pre-approved by SBI up to 80% LTV" />
                </Field>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "#6B7280" }}>Investment Indicators</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Estimated Monthly Rent" hint="Used to compute rental yield below.">
                      <TextInput type="number" min="0" value={form.estimatedMonthlyRent} onChange={(e) => set("estimatedMonthlyRent", e.target.value)} placeholder="e.g. 25000" />
                    </Field>
                    <Field label="Appreciation Potential">
                      <Select value={form.appreciationPotential} onChange={(e) => set("appreciationPotential", e.target.value)}>
                        <option value="">— N/A —</option>
                        {APPRECIATION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </Select>
                    </Field>
                    <Field label="Recommended Holding Period">
                      <TextInput value={form.recommendedHoldingPeriod} onChange={(e) => set("recommendedHoldingPeriod", e.target.value)} placeholder="e.g. 5-7 years" />
                    </Field>
                  </div>
                  {rentalYieldPreview() && (
                    <p className="text-xs mt-2" style={{ color: "#6B7280" }}>
                      Estimated rental yield: <span className="font-bold" style={{ color: "#1565C0" }}>{rentalYieldPreview()}%</span> per year.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Location &amp; Connectivity</h2>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Auto-suggested from the map pin above where possible — feel free to edit.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Locality">
                <TextInput value={form.locality} onChange={(e) => set("locality", e.target.value)} placeholder="e.g. Patia" />
              </Field>
              <Field label="Landmark">
                <TextInput value={form.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="e.g. Near KIIT Square" />
              </Field>
              <Field label="City">
                <TextInput value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Bhubaneswar" />
              </Field>
              <Field label="Pincode">
                <TextInput value={form.pincode} onChange={(e) => set("pincode", e.target.value)} placeholder="e.g. 751024" />
              </Field>
            </div>

            <Field label="Address Visibility" hint="Controls how precisely your map pin/address shows on the public listing.">
              <Select value={form.addressVisibility} onChange={(e) => set("addressVisibility", e.target.value)}>
                {ADDRESS_VISIBILITY_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
              </Select>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Road Width">
                <TextInput value={form.roadWidth} onChange={(e) => set("roadWidth", e.target.value)} placeholder="e.g. 40 ft wide" />
              </Field>
              <Field label="Approach Road Details">
                <TextInput value={form.approachRoadDetails} onChange={(e) => set("approachRoadDetails", e.target.value)} placeholder="e.g. Tar road, well maintained" />
              </Field>
              <Field label="Neighbourhood Profile">
                <Select value={form.neighbourhoodProfile} onChange={(e) => set("neighbourhoodProfile", e.target.value)}>
                  <option value="">— N/A —</option>
                  {NEIGHBOURHOOD_PROFILE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                </Select>
              </Field>
            </div>

            <Field label="Public Transport Availability">
              <TextInput value={form.publicTransportNotes} onChange={(e) => set("publicTransportNotes", e.target.value)} placeholder="e.g. Bus routes 12, 45 nearby; auto stand 100m" />
            </Field>

            <Field label="Nearby Landmarks & Key Destinations" hint="Powers the 'What's Nearby' section (with layer filters) on your listing's public page.">
              <div className="space-y-2.5">
                {form.nearbyLandmarks.map((l) => (
                  <div key={l._key} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_0.8fr_0.8fr_auto] gap-2 sm:items-center">
                    <Select value={l.category} onChange={(e) => updateLandmark(l._key, "category", e.target.value)}>
                      {LANDMARK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </Select>
                    <TextInput value={l.name} onChange={(e) => updateLandmark(l._key, "name", e.target.value)} placeholder="Name (e.g. DAV Public School)" />
                    <TextInput value={l.distance} onChange={(e) => updateLandmark(l._key, "distance", e.target.value)} placeholder="Distance (1.2 km)" />
                    <TextInput value={l.travelTime} onChange={(e) => updateLandmark(l._key, "travelTime", e.target.value)} placeholder="Time (5 min)" />
                    <button type="button" onClick={() => removeLandmark(l._key)} className="text-xs font-bold px-2 py-2.5 rounded-lg hover:opacity-80" style={{ color: "#DC2626" }}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addLandmark} className="text-xs font-bold px-3 py-2 rounded-lg" style={{ background: "#EFF6FF", color: "#1565C0" }}>
                  + Add Nearby Landmark
                </button>
              </div>
            </Field>
          </div>

          {/* ── Videos (Separated: Location Video & Property Walkthrough Videos) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location / Neighborhood Video */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Location / Neighborhood Video Tour</h2>
                </div>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Dedicated video link for the surrounding locality, road connectivity, and neighborhood — powers the interactive &quot;Watch Location Video&quot; button on the property page.
                </p>
              </div>
              <TextInput
                value={form.locationVideoUrl}
                onChange={(e) => set("locationVideoUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or Vimeo"
              />
              {form.locationVideoUrl && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] text-emerald-700 font-medium">Location video active</span>
                  <a
                    href={form.locationVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 font-semibold hover:underline ml-auto"
                  >
                    Preview ↗
                  </a>
                </div>
              )}
            </div>

            {/* Property Walkthrough Videos */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🎬</span>
                  <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Property Walkthrough Video(s)</h2>
                </div>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Property walkthroughs, 3D tours, or interior videos (YouTube or Vimeo) — displayed in the listing&apos;s photo &amp; video gallery.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.videoUrls.map((url) => (
                  <span key={url} className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "#F1F5F9", color: "#1F2937" }}>
                    {url.length > 36 ? url.slice(0, 36) + "…" : url}
                    <button type="button" onClick={() => removeVideoUrl(url)} className="font-bold hover:text-red-700" style={{ color: "#DC2626" }}>×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <TextInput
                  value={videoDraft}
                  onChange={(e) => setVideoDraft(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVideoUrl(); } }}
                />
                <button type="button" onClick={addVideoUrl} className="text-xs font-bold px-4 rounded-xl shrink-0" style={{ background: "#1565C0", color: "#FFFFFF" }}>Add</button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 space-y-4" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Photos</h2>
            <p className="text-xs" style={{ color: "#6B7280" }}>The first photo is the cover image shown on cards — use "Cover" to change it.</p>

            {(() => {
              const missing = missingMandatoryCategories();
              const count = form.images.length;
              if (count >= minPhotos && missing.length === 0) {
                return (
                  <div className="px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "#F0FDF4", color: "#16A34A" }}>
                    ✓ {count} photos, all mandatory categories covered.
                  </div>
                );
              }
              return (
                <div className="px-3.5 py-2.5 rounded-xl text-xs" style={{ background: "#FFFBEB", color: "#92400E" }}>
                  <p className="font-semibold">
                    {count} of {minPhotos}–{MAX_RECOMMENDED_PHOTOS} recommended photos{count < minPhotos ? ` (${minPhotos - count} more recommended)` : ""}.
                  </p>
                  {missing.length > 0 && <p className="mt-0.5">Missing {isLand ? "photo" : "room"} labels for: {missing.join(", ")}.</p>}
                </div>
              );
            })()}

            {uploadError && <div className="px-3.5 py-2.5 rounded-xl text-xs font-semibold" style={{ background: "#FEE2E2", color: "#DC2626" }}>{uploadError}</div>}
            {photoWarnings.length > 0 && (
              <div className="px-3.5 py-2.5 rounded-xl text-xs space-y-1" style={{ background: "#FFFBEB", color: "#92400E" }}>
                {photoWarnings.map((w, i) => <p key={i}>⚠ {w}</p>)}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {form.images.map((url, idx) => {
                const detail = imageDetailFor(form, url);
                return (
                  <div key={url} className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                    <div className="relative w-full aspect-square group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#1565C0", color: "#FFFFFF" }}>COVER</span>}
                      <button type="button" onClick={() => removeImage(url)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "rgba(0,0,0,0.7)", color: "#FFFFFF" }}>×</button>
                      <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" disabled={idx === 0} onClick={() => moveImage(url, -1)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold disabled:opacity-30" style={{ background: "rgba(0,0,0,0.7)", color: "#FFFFFF" }}>‹</button>
                        {idx !== 0 && <button type="button" onClick={() => makeCoverImage(url)} className="text-[9px] font-bold px-1.5 rounded" style={{ background: "rgba(0,0,0,0.7)", color: "#FFFFFF" }}>Cover</button>}
                        <button type="button" disabled={idx === form.images.length - 1} onClick={() => moveImage(url, 1)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold disabled:opacity-30" style={{ background: "rgba(0,0,0,0.7)", color: "#FFFFFF" }}>›</button>
                      </div>
                    </div>
                    <div className="p-1.5 space-y-1">
                      <Select value={detail.roomLabel} onChange={(e) => setImageDetail(url, "roomLabel", e.target.value)}>
                        <option value="">{isLand ? "Photo label…" : "Room label…"}</option>
                        {photoLabelOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                      </Select>
                      <TextInput value={detail.caption} onChange={(e) => setImageDetail(url, "caption", e.target.value)} placeholder="Caption (optional)" />
                    </div>
                  </div>
                );
              })}
              <label className="rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer aspect-square" style={{ border: "1.5px dashed #E2E8F0", color: "#6B7280" }}>
                {uploading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" style={{ color: "#1565C0" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] font-semibold text-center px-1">Add Photo</span>
                  </>
                )}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleFilesSelected} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Virtual Experience, Floor Plan &amp; Brochure</h2>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>All optional.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="360° Virtual Tour Link" hint="Matterport, Kuula, or similar.">
                <TextInput value={form.virtualTourUrl} onChange={(e) => set("virtualTourUrl", e.target.value)} placeholder="https://my.matterport.com/show/?m=..." />
              </Field>
              <Field label="Drone View Link" hint="Only where legally permitted to fly/film.">
                <TextInput value={form.droneViewUrl} onChange={(e) => set("droneViewUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
              </Field>
            </div>
            <Field label="Unit Floor Plan Link" hint="A link to your floor plan image or PDF.">
              <TextInput value={form.floorPlanUrl} onChange={(e) => set("floorPlanUrl", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="Floor Plan Caption">
              <TextInput value={form.floorPlanCaption} onChange={(e) => set("floorPlanCaption", e.target.value)} placeholder="e.g. 3BHK · 1450 sqft, with dimensions" />
            </Field>
            <Field label="Brochure (Google Drive Link)" hint="Paste Google Drive link to the property brochure (make sure sharing is set to 'Anyone with the link can view'). You can also upload a PDF.">
              <div className="flex items-center gap-3 flex-wrap">
                <TextInput value={form.brochureUrl} onChange={(e) => set("brochureUrl", e.target.value)} placeholder="https://drive.google.com/... or paste Drive link (or upload →)" />
                <label className="text-xs font-bold px-3 py-2.5 rounded-lg cursor-pointer shrink-0" style={{ background: "#F1F5F9", color: "#1F2937" }}>
                  {brochureUploading ? "Uploading…" : "Upload PDF"}
                  <input type="file" accept="application/pdf,image/*" className="hidden" onChange={handleBrochureFileSelected} disabled={brochureUploading} />
                </label>
                {form.brochureUrl && (
                  <a href={form.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline shrink-0">
                    Test Link ↗
                  </a>
                )}
              </div>
              {brochureUploadError && <p className="text-xs font-semibold mt-1.5" style={{ color: "#DC2626" }}>{brochureUploadError}</p>}
            </Field>
          </div>

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>Your Contact Information</h2>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>How buyers/tenants can reach you about this listing.</p>
            </div>

            <Field label="I am posting as a...">
              <Select value={form.postedBy} onChange={(e) => set("postedBy", e.target.value)}>
                {POSTED_BY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>

            <div className="flex items-center gap-3">
              {form.posterPhotoUrl ? (
                <img src={form.posterPhotoUrl} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ background: "#F1F5F9", color: "#6B7280" }}>?</div>
              )}
              <label className="text-xs font-bold px-3 py-2 rounded-lg cursor-pointer" style={{ background: "#F1F5F9", color: "#1F2937" }}>
                {posterPhotoUploading ? "Uploading…" : "Upload Photo"}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handlePosterPhotoSelected} disabled={posterPhotoUploading} />
              </label>
              {posterPhotoError && <span className="text-xs font-semibold" style={{ color: "#DC2626" }}>{posterPhotoError}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Your Name">
                <TextInput value={form.posterName} onChange={(e) => set("posterName", e.target.value)} placeholder="e.g. Rajesh Kumar" />
              </Field>
              <Field label="Phone">
                <TextInput value={form.posterPhone} onChange={(e) => set("posterPhone", e.target.value)} placeholder="e.g. 98765 43210" />
              </Field>
              <Field label="Email">
                <TextInput value={form.posterEmail} onChange={(e) => set("posterEmail", e.target.value)} placeholder="e.g. rajesh@example.com" />
              </Field>
            </div>

            <Field label="Your contact number (private)" required hint="Only the PropertyBrands team sees this, to call you when approving your listing. It is never shown to visitors.">
              <TextInput value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value.replace(/[^\d+\s-]/g, ""))} inputMode="tel" placeholder="10-digit mobile number" aria-label="Your contact number (private)" />
            </Field>

            <Field label="Preferred Contact Methods">
              <div className="flex flex-wrap gap-2">
                {CONTACT_METHOD_OPTIONS.map((m) => (
                  <Chip key={m} label={m} active={form.posterPreferredContactMethods.includes(m)} onClick={() => toggleInArray("posterPreferredContactMethods", m)} />
                ))}
              </div>
            </Field>

            <Field label="Availability for Site Visits">
              <TextInput value={form.posterAvailabilityNotes} onChange={(e) => set("posterAvailabilityNotes", e.target.value)} placeholder="e.g. Weekends only, 10am–6pm" />
            </Field>

            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
              <input type="checkbox" checked={form.posterPhoneMaskingEnabled} onChange={(e) => set("posterPhoneMaskingEnabled", e.target.checked)} className="w-4 h-4 rounded accent-[#1565C0]" />
              Mask my phone number until a visitor taps "Reveal"
            </label>
          </div>

          <div className="rounded-2xl p-6 space-y-5" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: "#1F2937" }}>A Few Final Questions</h2>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Helps our team verify and support your listing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your Relationship to the Property">
                <Select value={form.sellerRoleConfirmation} onChange={(e) => set("sellerRoleConfirmation", e.target.value)}>
                  <option value="">— N/A —</option>
                  {SELLER_ROLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Is this listed elsewhere too?">
                <Select value={form.sellerExclusiveListing} onChange={(e) => set("sellerExclusiveListing", e.target.value)}>
                  <option value="">— N/A —</option>
                  {EXCLUSIVE_LISTING_OPTIONS.map((e_) => <option key={e_} value={e_}>{e_}</option>)}
                </Select>
              </Field>
            </div>

            <div className="rounded-xl p-4 space-y-4" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
              <p className="text-xs font-bold" style={{ color: "#92400E" }}>🔒 Private — only visible to our team, never shown on your public listing.</p>
              <Field label="Reason for Selling / Renting" hint="Optional.">
                <textarea value={form.sellerReasonForSelling} onChange={(e) => set("sellerReasonForSelling", e.target.value)} rows={2}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 resize-none" style={{ ...inputStyle, background: "#FFFFFF" }} />
              </Field>
              <Field label="Minimum Acceptable Price (₹)" hint="Helps our team negotiate on your behalf.">
                <TextInput type="number" min="0" value={form.sellerMinimumAcceptablePrice} onChange={(e) => set("sellerMinimumAcceptablePrice", e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Is it currently occupied?">
                <Select value={form.sellerCurrentlyOccupied} onChange={(e) => set("sellerCurrentlyOccupied", e.target.value)}>
                  <option value="">— N/A —</option>
                  {OCCUPANCY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </Select>
              </Field>
              <Field label="Availability Date">
                <TextInput type="date" value={form.sellerAvailabilityDate} onChange={(e) => set("sellerAvailabilityDate", e.target.value)} />
              </Field>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
              <input type="checkbox" checked={form.sellerDocumentsAvailable} onChange={(e) => set("sellerDocumentsAvailable", e.target.checked)} className="w-4 h-4 rounded accent-[#1565C0]" />
              I have all property documents ready for verification
            </label>

            <Field label="Would you like any of these?">
              <div className="flex flex-wrap gap-2">
                {MARKETING_SUPPORT_OPTIONS.map((m) => (
                  <Chip key={m} label={m} active={form.sellerWantsMarketingSupport.includes(m)} onClick={() => toggleInArray("sellerWantsMarketingSupport", m)} />
                ))}
              </div>
            </Field>

            <label className="flex items-start gap-2 text-sm font-semibold cursor-pointer" style={{ color: "#1F2937" }}>
              <input type="checkbox" checked={form.sellerContactAuthorization} onChange={(e) => set("sellerContactAuthorization", e.target.checked)} className="w-4 h-4 rounded accent-[#1565C0] mt-0.5" />
              I authorize PropertyBrands to contact me for verification and to connect me with buyer/tenant leads
            </label>
          </div>

          <button type="submit" disabled={saving || uploading}
            className="w-full py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: "#1565C0", color: "#FFFFFF" }}>
            {saving ? "Submitting..." : "Submit Property for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
