import { useEffect, useRef, useState } from "react";
import RentAgreementDocument from "./RentAgreementDocument";
import { getRentAgreement, signRentAgreement } from "../lib/rentAgreements";
import { isValidAadhaar, isValidPan, formatAadhaar, normalizePan, digitsOnly, maskAadhaar } from "../lib/kyc";
import { printElement } from "../lib/printUtil";

const KYC_LABEL = {
  matched: "Details match what was entered when the agreement was prepared",
  submitted: "Details submitted",
  mismatch: "Details differ from what was entered when the agreement was prepared — please check with the other party",
};

function PartyStatus({ label, party }) {
  const signed = !!party?.signed_at;
  return (
    <div className="flex-1 rounded-xl px-4 py-3" style={{ background: signed ? "#F0FDF4" : "#F8FAFC", border: `1px solid ${signed ? "#BBF7D0" : "#E2E8F0"}` }}>
      <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#6B7280" }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: "#1F2937" }}>{party?.name || "—"}</p>
      <p className="text-xs font-semibold" style={{ color: signed ? "#15803D" : "#B45309" }}>
        {signed ? `✓ Signed ${new Date(party.signed_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}` : "Waiting to sign"}
      </p>
      {signed && party.aadhaar_last4 && <p className="text-[11px]" style={{ color: "#6B7280" }}>Aadhaar {maskAadhaar(party.aadhaar_last4)}</p>}
    </div>
  );
}

// The page a landlord or tenant opens from their personal link.
export default function AgreementSign({ token }) {
  const [state, setState] = useState({ status: "loading", agreement: null });
  const docRef = useRef(null);
  const [form, setForm] = useState({ signature: "", aadhaar: "", pan: "", consent: false });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!token) { setState({ status: "invalid", agreement: null }); return undefined; }
    getRentAgreement(token).then(({ data, error }) => {
      if (cancelled) return;
      if (error) setState({ status: "error", agreement: null });
      else if (!data) setState({ status: "invalid", agreement: null });
      else {
        setState({ status: "ready", agreement: data });
        const mine = data[data.role];
        setForm((f) => ({ ...f, signature: mine?.name || "" }));
      }
    });
    return () => { cancelled = true; };
  }, [token]);

  const a = state.agreement;
  const roleLabel = a?.role === "owner" ? "Landlord" : "Tenant";
  const me = a ? a[a.role] : null;
  const other = a ? a[a.role === "owner" ? "tenant" : "owner"] : null;
  const alreadySigned = !!me?.signed_at;

  function validate() {
    const e = {};
    if (form.signature.trim().length < 2) e.signature = "Type your full name to sign.";
    if (!isValidAadhaar(form.aadhaar)) e.aadhaar = "Enter your 12-digit Aadhaar number (check for a typo).";
    if (!isValidPan(form.pan)) e.pan = "Enter a valid PAN, like ABCDE1234F.";
    if (!form.consent) e.consent = "Please tick the box to confirm.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSign(ev) {
    ev.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSaving(true);
    const { data, error } = await signRentAgreement({
      token, signature: form.signature.trim(), aadhaar: digitsOnly(form.aadhaar), pan: normalizePan(form.pan), consent: form.consent,
    });
    setSaving(false);
    if (error || !data) { setSubmitError(error?.message || "Couldn't save your signature. Please try again."); return; }
    setState({ status: "ready", agreement: data });
  }

  function handlePrint() {
    if (docRef.current) printElement(docRef.current, "Residential Rent Agreement");
  }

  if (state.status === "loading") {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-sm" style={{ color: "#6B7280" }}>Opening your agreement…</div>;
  }
  if (state.status !== "ready") {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-lg font-bold mb-2" style={{ color: "#1F2937" }}>{state.status === "error" ? "We couldn't open this agreement" : "This signing link isn't valid"}</p>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          {state.status === "error"
            ? "Please check your internet connection and try again in a moment."
            : "The link may be incomplete or copied wrongly. Open the link from your email or message again, or ask the person who prepared the agreement to share it again."}
        </p>
      </div>
    );
  }

  const fullySigned = a.status === "fully_signed";

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#1565C0" }}>RentReady · Review &amp; Sign</p>
        <h1 className="text-xl sm:text-2xl font-extrabold mt-1" style={{ color: "#1F2937" }}>
          Rent agreement — you are signing as the {roleLabel}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Read the agreement below, confirm your Aadhaar and PAN, then sign. Both parties get their own link.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <PartyStatus label="Landlord" party={a.owner} />
        <PartyStatus label="Tenant" party={a.tenant} />
      </div>

      {fullySigned && (
        <p className="mb-5 text-sm font-semibold rounded-xl px-4 py-3" style={{ background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}>
          ✓ Both parties have signed. Print or save a copy below.
        </p>
      )}

      <div className="rounded-2xl p-4 sm:p-6 mb-6 overflow-x-auto" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
        <RentAgreementDocument ref={docRef} data={a.form_data} signatures={{ owner: a.owner, tenant: a.tenant }} />
      </div>

      {alreadySigned ? (
        <div className="rounded-2xl p-5" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <p className="text-sm font-bold" style={{ color: "#166534" }}>✓ You have signed this agreement.</p>
          {me.kyc_status && <p className="text-xs mt-1" style={{ color: "#166534" }}>{KYC_LABEL[me.kyc_status]}</p>}
          {!fullySigned && <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Waiting for {other?.name || "the other party"} to sign using their link.</p>}
          <button type="button" onClick={handlePrint} className="mt-3 px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "#1565C0" }}>
            Print / Save as PDF
          </button>
        </div>
      ) : (
        <form onSubmit={handleSign} noValidate className="rounded-2xl p-5 sm:p-6 space-y-4" style={{ background: "#FFFFFF", border: "1.5px solid #1565C0" }}>
          <div>
            <p className="text-base font-bold" style={{ color: "#1F2937" }}>Confirm your identity and sign</p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              We check that the Aadhaar number is well-formed and, if the preparer entered your details, that they match. We keep only the last 4 digits of your Aadhaar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold" style={{ color: "#1F2937" }}>Aadhaar number</span>
              <input id="sign-aadhaar" inputMode="numeric" autoComplete="off" value={formatAadhaar(form.aadhaar)} onChange={(e) => setForm((f) => ({ ...f, aadhaar: e.target.value }))}
                placeholder="XXXX XXXX XXXX" className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm" style={{ border: `1.5px solid ${errors.aadhaar ? "#DC2626" : "#E2E8F0"}` }} />
              {errors.aadhaar && <span className="text-xs" style={{ color: "#DC2626" }}>{errors.aadhaar}</span>}
            </label>
            <label className="block">
              <span className="text-xs font-semibold" style={{ color: "#1F2937" }}>PAN</span>
              <input id="sign-pan" autoComplete="off" value={form.pan} onChange={(e) => setForm((f) => ({ ...f, pan: normalizePan(e.target.value) }))}
                placeholder="ABCDE1234F" className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm uppercase" style={{ border: `1.5px solid ${errors.pan ? "#DC2626" : "#E2E8F0"}` }} />
              {errors.pan && <span className="text-xs" style={{ color: "#DC2626" }}>{errors.pan}</span>}
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold" style={{ color: "#1F2937" }}>Your signature — type your full name</span>
            <input id="sign-name" value={form.signature} onChange={(e) => setForm((f) => ({ ...f, signature: e.target.value }))}
              placeholder="Full name as on your ID" className="mt-1 w-full rounded-xl px-3 py-2.5 text-sm" style={{ border: `1.5px solid ${errors.signature ? "#DC2626" : "#E2E8F0"}` }} />
            {errors.signature && <span className="text-xs" style={{ color: "#DC2626" }}>{errors.signature}</span>}
            {form.signature.trim() && (
              <span className="block mt-2 px-4 py-3 rounded-xl text-2xl" style={{ background: "#F8FAFC", border: "1px dashed #CBD5E1", fontFamily: "'Brush Script MT','Segoe Script','Lucida Handwriting',cursive" }}>
                {form.signature}
              </span>
            )}
          </label>

          <label className="flex items-start gap-2 text-xs cursor-pointer" style={{ color: "#1F2937" }}>
            <input id="sign-consent" type="checkbox" checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} className="mt-0.5 w-4 h-4 accent-[#1565C0]" />
            <span>I have read the whole agreement, the details above are mine, and I agree to sign it electronically as the {roleLabel}.</span>
          </label>
          {errors.consent && <p className="text-xs" style={{ color: "#DC2626" }}>{errors.consent}</p>}
          {submitError && <p className="text-sm font-semibold" style={{ color: "#DC2626" }}>{submitError}</p>}

          <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ background: "#1565C0" }}>
            {saving ? "Signing…" : "Sign Agreement"}
          </button>
          <p className="text-[11px]" style={{ color: "#6B7280" }}>
            This is an electronic acknowledgement recorded with the time and your details. For stamp duty or registration, also print the agreement on the required stamp paper.
          </p>
        </form>
      )}
    </section>
  );
}
