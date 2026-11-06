import React, { useState, useRef } from "react";
import { submitLead } from "../lib/leads";
import { printElement } from "../lib/printUtil";
import RentAgreementDocument from "./RentAgreementDocument";
import { renderToStaticMarkup } from "react-dom/server";
import { sendAgreementEmail, validRecipients } from "../lib/sendAgreement";
import { createRentAgreement, signingLink } from "../lib/rentAgreements";

const STEPS = [
  { num: 1, title: "Property Details", desc: "Address, unit type & rent" },
  { num: 2, title: "Parties", desc: "Owner & Tenant details" },
  { num: 3, title: "Agreement Terms", desc: "Deposit, maintenance & lock-in" },
  { num: 4, title: "Legal Preview", desc: "State-compliant draft" },
  { num: 5, title: "E-Sign & Stamp Duty", desc: "Digital verification & notary" },
  { num: 6, title: "Move-In Kit", desc: "Shifting, deep cleaning & checklist" },
];

export default function RentReadyHub({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyAddress: "",
    flatNo: "",
    floor: "",
    buildingName: "",
    parkingDetails: "",
    furnishing: "Semi-furnished",
    rentDueDay: "5",
    city: "Bhubaneswar",
    propertyType: "2 BHK Apartment",
    monthlyRent: "22000",
    securityDeposit: "44000",
    maintenanceCharges: "2500",
    leaseDurationMonths: "11",
    lockInPeriodMonths: "6",
    noticePeriodDays: "30",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerPan: "",
    tenantName: "",
    tenantPhone: "",
    tenantEmail: "",
    tenantAadhaar: "",
    moveInDate: "",
    needPackers: true,
    needDeepClean: true,
    needMoveInInspection: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const agreementRef = useRef(null);
  const [printNote, setPrintNote] = useState("");
  // Result of emailing the agreement: { status: "sent" | "failed" | "no-email", to: [], error }
  const [emailResult, setEmailResult] = useState(null);
  // Personal review-and-sign links for each party ({ owner, tenant }), or null if they could not be created.
  const [signLinks, setSignLinks] = useState(null);
  const [signLinksError, setSignLinksError] = useState("");
  const [copied, setCopied] = useState("");

  function handlePrintAgreement() {
    setPrintNote("");
    if (!printElement(agreementRef.current, "Residential Rent Agreement")) {
      setPrintNote("Your browser blocked the print window. Allow pop-ups for this site and try again.");
    }
  }

  // The on-screen agreement only exists on step 4, so for the completion screen
  // render it into a detached element and print that.
  function handlePrintAgreementFromData() {
    setPrintNote("");
    const holder = document.createElement("div");
    holder.innerHTML = renderToStaticMarkup(<RentAgreementDocument data={formData} />);
    if (!printElement(holder, "Residential Rent Agreement")) {
      setPrintNote("Your browser blocked the print window. Allow pop-ups for this site and try again.");
    }
  }

  function updateField(key, val) {
    setFormData((prev) => ({ ...prev, [key]: val }));
  }

  async function handleFinalSubmit() {
    setIsSubmitting(true);
    try {
      await submitLead({
        name: formData.tenantName || formData.ownerName || "RentReady Applicant",
        phone: formData.tenantPhone || formData.ownerPhone || "Not provided",
        email: formData.tenantEmail || formData.ownerEmail || null,
        city: formData.city,
        source: "rent-ready",
        property_id: null,
        message: `[RENTREADY DRAFT] Property: ${formData.propertyAddress}, ${formData.city} | Rent: ₹${formData.monthlyRent}/mo | Deposit: ₹${formData.securityDeposit} | Owner: ${formData.ownerName} (${formData.ownerPhone}) | Tenant: ${formData.tenantName} (${formData.tenantPhone}) | Services: Packers=${formData.needPackers}, Cleaning=${formData.needDeepClean}, Inspection=${formData.needMoveInInspection}`,
      });

      // 1. Create the agreement record with a personal signing link for each party.
      const ownerEmail = validRecipients([formData.ownerEmail])[0] || "";
      const tenantEmail = validRecipients([formData.tenantEmail])[0] || "";
      let links = null;
      const created = await createRentAgreement({ form: formData, ownerEmail, tenantEmail });
      if (created.data) {
        links = { owner: signingLink(created.data.ownerToken), tenant: signingLink(created.data.tenantToken) };
        setSignLinks(links);
      } else {
        setSignLinksError(created.error?.message || "unknown error");
      }

      // 2. Email each party their own link (plus the agreement itself).
      const markup = renderToStaticMarkup(<RentAgreementDocument data={formData} />);
      const buildHtml = (roleLabel, link) =>
        `<div style="font-family:Georgia,serif;font-size:14px;line-height:1.6;color:#111;max-width:760px;margin:0 auto;padding:16px">`
        + `<p style="font-family:Arial,sans-serif;font-size:14px;color:#222">Hello, a rent agreement for <b>${(formData.propertyAddress || "the rental property").replace(/</g, "&lt;")}</b> has been prepared on PropertyBrands RentReady. You are named as the <b>${roleLabel}</b>.</p>`
        + (link
          ? `<p style="font-family:Arial,sans-serif"><a href="${link}" style="display:inline-block;background:#1565C0;color:#fff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:8px">Review &amp; sign the agreement</a></p>`
            + `<p style="font-family:Arial,sans-serif;font-size:12px;color:#555">On that page you can read the agreement, confirm your Aadhaar and PAN, and sign. This link is personal to you — please do not forward it. If the button doesn't work, copy this address into your browser:<br/>${link}</p>`
          : `<p style="font-family:Arial,sans-serif;font-size:13px;color:#444">Please print the draft below, fill in the blank lines and sign it on stamp paper.</p>`)
        + `<hr/>${markup}</div>`;

      const subject = `${formData.propertyAddress || "Rental property"}, ${formData.city}`.slice(0, 150);
      const parties = [
        { role: "Landlord", email: ownerEmail, link: links?.owner },
        { role: "Tenant", email: tenantEmail, link: links?.tenant },
      ].filter((p) => p.email);

      if (parties.length === 0) {
        setEmailResult({ status: "no-email", to: [] });
      } else {
        const results = await Promise.all(parties.map(async (p) => ({
          ...p,
          result: await sendAgreementEmail({ to: [p.email], subject: `${p.link ? "Please review & sign — " : ""}${subject}`.slice(0, 150), html: buildHtml(p.role, p.link), text: p.link ? `Review and sign your rent agreement: ${p.link}` : "Your rent agreement draft from PropertyBrands RentReady is in this email." },
          ),
        })));
        const sent = results.filter((r) => r.result.ok).map((r) => r.email);
        const failed = results.filter((r) => !r.result.ok);
        setEmailResult(failed.length === 0
          ? { status: "sent", to: sent }
          : { status: "failed", to: failed.map((f) => f.email), sent, error: failed[0].result.error });
      }
      setIsCompleted(true);
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <span>⚡</span> RentReady™ Digital Agreement & Move-In Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white" style={{ color: "#FFFFFF" }}>
            One-Click Verified Rental Agreements & Smooth Move-In
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-2xl mx-auto" style={{ color: "#E0E7FF" }}>
            Say goodbye to unreviewed generic contracts and broker hassles. Create state-compliant legally vetted agreements, review and e-sign online, and schedule shifting in under 5 minutes.
          </p>

          {/* Stepper Progress */}
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-4xl mx-auto">
            {STEPS.map((step) => {
              const active = currentStep === step.num;
              const completed = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => completed && setCurrentStep(step.num)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    completed ? "cursor-pointer" : ""
                  } ${
                    active
                      ? "bg-white text-gray-900 border-white shadow-md ring-2 ring-amber-400"
                      : completed
                      ? "bg-white/10 text-blue-200 border-white/20"
                      : "bg-black/20 text-blue-300/60 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        active
                          ? "bg-blue-600 text-white"
                          : completed
                          ? "bg-emerald-500 text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {completed ? "✓" : step.num}
                    </span>
                    <span className="text-[11px] font-bold truncate">{step.title}</span>
                  </div>
                  <p className="text-[9px] opacity-80 truncate hidden sm:block">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-10">
          {isCompleted ? (
            <div className="py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                RentReady Application & Draft Initiated!
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
                Your rental agreement draft has been generated for <strong>{formData.propertyAddress}</strong>.{" "}
                {signLinks ? "The landlord and the tenant each have a personal link to review it, confirm Aadhaar and PAN, and sign." : "Print it, fill in the blank lines and sign it on stamp paper."}
              </p>
              {signLinks && (
                <div className="mt-4 max-w-xl mx-auto text-left space-y-3">
                  {[["Landlord", "owner", formData.ownerName], ["Tenant", "tenant", formData.tenantName]].map(([label, key, name]) => (
                    <div key={key} className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">{label} signing link{name ? ` — ${name}` : ""}</p>
                      <p className="text-[11px] text-gray-600 break-all mt-1">{signLinks[key]}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <button type="button" onClick={() => { try { navigator.clipboard.writeText(signLinks[key]); setCopied(key); setTimeout(() => setCopied(""), 2000); } catch { /* clipboard blocked */ } }}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-blue-300 text-blue-800 hover:bg-blue-100">
                          {copied === key ? "Copied ✓" : "Copy link"}
                        </button>
                        <a href={`https://wa.me/?text=${encodeURIComponent(`Please review and sign the rent agreement (${label}): ${signLinks[key]}`)}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700">
                          Share on WhatsApp
                        </a>
                        <a href={signLinks[key]} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1565C0] text-white hover:bg-[#0D47A1]">Open &amp; sign now</a>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-gray-500">Each link is personal — share the landlord link only with the landlord and the tenant link only with the tenant.</p>
                </div>
              )}
              {!signLinks && signLinksError && (
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-3 max-w-lg mx-auto">
                  Online signing links couldn't be created right now ({signLinksError}). You can still print the agreement below and sign it on stamp paper.
                </p>
              )}
              {emailResult?.status === "sent" && (
                <p className="text-sm font-semibold text-emerald-700 mt-3">✓ {signLinks ? "Signing link" : "Agreement"} emailed to {emailResult.to.join(", ")}.</p>
              )}
              {emailResult?.status === "failed" && (
                <div className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-lg mx-auto">
                  <p className="font-semibold">We couldn't email {emailResult.to.join(", ")}{emailResult.error ? ` (${emailResult.error})` : ""}.</p>
                  <p className="text-xs mt-1">{signLinks ? "Use the links above — copy them or share on WhatsApp." : "Use \"Print / Save as PDF\" below."}</p>
                </div>
              )}
              {emailResult?.status === "no-email" && (
                <p className="text-xs text-gray-500 mt-3">No email address was entered, so nothing was emailed. {signLinks ? "Share the links above instead." : "Use \"Print / Save as PDF\" below."}</p>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handlePrintAgreementFromData}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#1565C0] text-white hover:bg-[#0D47A1] transition"
                >
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => onNavigate && onNavigate("home")}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-900 text-white hover:bg-black transition"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => onNavigate && onNavigate("search", { transactionType: "Rent" })}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Browse More Rentals
                </button>
              </div>
              {printNote && <p className="mt-3 text-xs font-semibold text-amber-700">{printNote}</p>}
            </div>
          ) : (
            <div>
              {/* STEP 1: Property */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Step 1: Property Location & Unit Details</h3>
                    <p className="text-xs text-gray-500">Enter the rented premises address and unit specifications</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Property Type</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => updateField("propertyType", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      >
                        <option value="1 BHK Apartment">1 BHK Apartment</option>
                        <option value="2 BHK Apartment">2 BHK Apartment</option>
                        <option value="3 BHK Apartment">3 BHK Apartment</option>
                        <option value="Independent Villa">Independent Villa</option>
                        <option value="Commercial Office Space">Commercial Office Space</option>
                        <option value="Retail Shop">Retail Shop</option>
                        <option value="Warehouse / Industrial Shed">Warehouse / Industrial Shed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Property Address *</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Flat 402, Tower B, Green Valley Heights, Patia, Bhubaneswar - 751024"
                      value={formData.propertyAddress}
                      onChange={(e) => updateField("propertyAddress", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Flat / House No.</label>
                      <input type="text" value={formData.flatNo} onChange={(e) => updateField("flatNo", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Floor</label>
                      <input type="text" value={formData.floor} onChange={(e) => updateField("floor", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Building / Society Name</label>
                      <input type="text" value={formData.buildingName} onChange={(e) => updateField("buildingName", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Parking Details (if applicable)</label>
                      <input type="text" value={formData.parkingDetails} onChange={(e) => updateField("parkingDetails", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Furnishing Status</label>
                      <select value={formData.furnishing} onChange={(e) => updateField("furnishing", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none">
                        <option value="Furnished">Furnished</option>
                        <option value="Semi-furnished">Semi-furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Parties */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Step 2: Landlord & Tenant Information</h3>
                    <p className="text-xs text-gray-500">Provide legal identification details for agreement drafting</p>
                  </div>

                  {/* Landlord Card */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Landlord / Owner Details</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Owner Full Legal Name *"
                        value={formData.ownerName}
                        onChange={(e) => updateField("ownerName", e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                      <input
                        type="tel"
                        placeholder="Owner Mobile Number *"
                        value={formData.ownerPhone}
                        onChange={(e) => updateField("ownerPhone", e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="email"
                        placeholder="Owner Email Address"
                        value={formData.ownerEmail}
                        onChange={(e) => updateField("ownerEmail", e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Owner PAN (Optional)"
                        value={formData.ownerPan}
                        onChange={(e) => updateField("ownerPan", e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                    </div>
                  </div>

                  {/* Tenant Card */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Tenant Details</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Tenant Full Legal Name *"
                        value={formData.tenantName}
                        onChange={(e) => updateField("tenantName", e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                      <input
                        type="tel"
                        placeholder="Tenant Mobile Number *"
                        value={formData.tenantPhone}
                        onChange={(e) => updateField("tenantPhone", e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="email"
                        placeholder="Tenant Email Address"
                        value={formData.tenantEmail}
                        onChange={(e) => updateField("tenantEmail", e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Tenant Aadhaar / ID Number"
                        value={formData.tenantAadhaar}
                        onChange={(e) => updateField("tenantAadhaar", e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Financial Terms */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Step 3: Agreed Financial Terms & Duration</h3>
                    <p className="text-xs text-gray-500">Rent, security deposit, maintenance and notice periods</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Rent (₹) *</label>
                      <input
                        type="number"
                        value={formData.monthlyRent}
                        onChange={(e) => updateField("monthlyRent", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Security Deposit (₹) *</label>
                      <input
                        type="number"
                        value={formData.securityDeposit}
                        onChange={(e) => updateField("securityDeposit", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Maintenance (₹)</label>
                      <input
                        type="number"
                        value={formData.maintenanceCharges}
                        onChange={(e) => updateField("maintenanceCharges", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Rent Due By (Day of Month)</label>
                      <select
                        value={formData.rentDueDay}
                        onChange={(e) => updateField("rentDueDay", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      >
                        {Array.from({ length: 28 }, (_, i) => String(i + 1)).map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Tenancy Start Date</label>
                      <input
                        type="date"
                        value={formData.moveInDate}
                        onChange={(e) => updateField("moveInDate", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      />
                    </div>
                  </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Tenure (Months)</label>
                      <select
                        value={formData.leaseDurationMonths}
                        onChange={(e) => updateField("leaseDurationMonths", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      >
                        <option value="11">11 Months (Standard)</option>
                        <option value="22">22 Months</option>
                        <option value="33">33 Months</option>
                        <option value="60">5 Years (Commercial)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Lock-in Period</label>
                      <select
                        value={formData.lockInPeriodMonths}
                        onChange={(e) => updateField("lockInPeriodMonths", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      >
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="11">11 Months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Notice Period</label>
                      <select
                        value={formData.noticePeriodDays}
                        onChange={(e) => updateField("noticePeriodDays", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      >
                        <option value="30">30 Days (1 Month)</option>
                        <option value="60">60 Days (2 Months)</option>
                        <option value="90">90 Days (3 Months)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Legal Preview */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Step 4: Rent Agreement Preview</h3>
                      <p className="text-xs text-gray-500">Residential Rent Agreement — your details are filled in below</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      18 Clauses + Inventory Annexure
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-inner max-h-[28rem] overflow-y-auto">
                    <RentAgreementDocument ref={agreementRef} data={formData} />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePrintAgreement}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1565C0] hover:bg-[#0D47A1] transition"
                    >
                      Print / Save Agreement as PDF
                    </button>
                    <p className="text-[11px] text-gray-500">
                      Lines left blank (ages, parents' names, addresses, utilities) are filled in by hand before signing.
                    </p>
                  </div>
                  {printNote && <p className="text-xs font-semibold text-amber-700">{printNote}</p>}
                </div>
              )}

              {/* STEP 5: E-Sign & Formalities */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Step 5: Digital Stamp Duty & E-Signing Formalities</h3>
                    <p className="text-xs text-gray-500">Legally valid electronic signing and automated stamp duty filing</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50">
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Stamp Duty Calculation</span>
                      <div className="mt-3 space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Jurisdiction:</span>
                          <span className="font-bold text-gray-900">{formData.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Standard E-Stamp Duty:</span>
                          <span className="font-bold text-gray-900">₹100 – ₹500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Digital Aadhaar e-Sign Fee:</span>
                          <span className="font-bold text-emerald-600">FREE with RentReady</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50">
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Verification Steps</span>
                      <ul className="mt-3 space-y-2 text-xs text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                          <span>Instant Aadhaar OTP verification for both parties</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                          <span>Audit trail & time-stamped digital certificate</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                          <span>Admissible in legal disputes & rental address proof</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Move-In Kit */}
              {currentStep === 6 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-lg font-bold text-gray-900">Step 6: Move-In Bundle & Shifting Assistance</h3>
                    <p className="text-xs text-gray-500">Optional discounted relocation, inventory checklist and cleaning</p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.needPackers}
                          onChange={(e) => updateField("needPackers", e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">Packers & Movers Shifting Quotes</p>
                          <p className="text-[11px] text-gray-500">Receive vetted local quotes with zero transit breakage guarantee</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600">Up to 20% off</span>
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.needDeepClean}
                          onChange={(e) => updateField("needDeepClean", e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">Deep Cleaning & Sanitization</p>
                          <p className="text-[11px] text-gray-500">Full kitchen, bathroom and floor scrub prior to handover</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600">₹1,499 special</span>
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.needMoveInInspection}
                          onChange={(e) => updateField("needMoveInInspection", e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">Digital Move-In Inventory & Snag List</p>
                          <p className="text-[11px] text-gray-500">Timestamped photos of electrical fixtures, meter readings & paint status</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Included</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
                  >
                    ← Previous
                  </button>
                ) : <div />}

                {currentStep < 6 ? (
                  <button
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition"
                    style={{ background: "#1565C0" }}
                  >
                    Next: {STEPS[currentStep].title} →
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
                    style={{ background: "#059669" }}
                  >
                    {isSubmitting ? "Generating Draft..." : "Generate Agreement & Submit Draft"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
