import { useMemo, useState } from "react";
import { banks } from "./MagicLoansSection";
import { submitLead } from "../lib/leads";

// Indicative terms per bank (rates are the "starts at" figures shown on the
// partner carousel). Real offers depend on the applicant's profile, so the
// table says so and the "Get this rate" button asks our team to confirm.
const TERMS = {
  1: { fee: "0.50% (min ₹5,000)", maxTenure: 25 },
  2: { fee: "0.50% (max ₹15,000)", maxTenure: 30 },
  3: { fee: "0.35% (max ₹10,000)", maxTenure: 30 },
  4: { fee: "0.50% (max ₹10,000)", maxTenure: 30 },
  5: { fee: "0.50% (max ₹7,500)", maxTenure: 30 },
  6: { fee: "Up to 0.50%", maxTenure: 30 },
  7: { fee: "Up to 0.50%", maxTenure: 30 },
  8: { fee: "Up to 1.00%", maxTenure: 30 },
  9: { fee: "Up to 0.50%", maxTenure: 20 },
  10: { fee: "0.35% (max ₹15,000)", maxTenure: 30 },
};

export function emi(principal, annualRatePct, years) {
  const n = Math.round(years * 12);
  const r = annualRatePct / 12 / 100;
  if (!principal || n <= 0) return 0;
  if (r === 0) return principal / n;
  const f = Math.pow(1 + r, n);
  return (principal * r * f) / (f - 1);
}

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const lakh = (n) => (n >= 10000000 ? `₹${+(n / 10000000).toFixed(2)} Cr` : `₹${+(n / 100000).toFixed(2)} Lac`);

export default function LoanRateComparison({ selectedBankId, onSelectBank }) {
  const [amountLac, setAmountLac] = useState(50);
  const [years, setYears] = useState(20);
  const [sort, setSort] = useState("rate"); // rate | emi | interest
  const [enquiry, setEnquiry] = useState(null); // bank being enquired about
  const [form, setForm] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const principal = Math.max(0, Number(amountLac) || 0) * 100000;

  const rows = useMemo(() => {
    const list = banks.map((b) => {
      const rate = parseFloat(b.rate);
      const t = TERMS[b.id] || { fee: "—", maxTenure: 30 };
      const tenure = Math.min(Number(years) || 0, t.maxTenure);
      const monthly = emi(principal, rate, tenure);
      return { ...b, rateNum: rate, fee: t.fee, maxTenure: t.maxTenure, tenure, monthly, totalInterest: monthly * tenure * 12 - principal };
    });
    const key = sort === "emi" ? "monthly" : sort === "interest" ? "totalInterest" : "rateNum";
    return list.sort((a, b) => a[key] - b[key]);
  }, [principal, years, sort]);

  const best = rows[0];
  const worst = rows[rows.length - 1];

  async function sendEnquiry(e) {
    e.preventDefault();
    const phone = form.phone.replace(/\D/g, "").slice(-10);
    if (form.name.trim().length < 2) return setStatus({ state: "error", message: "Please enter your name." });
    if (!/^[6-9]\d{9}$/.test(phone)) return setStatus({ state: "error", message: "Enter a valid 10-digit mobile number." });
    setStatus({ state: "sending", message: "" });
    const { error } = await submitLead({
      name: form.name.trim(),
      phone,
      interest: `[LOAN ENQUIRY] ${enquiry.name} — ${lakh(principal)} for ${enquiry.tenure} yrs at ${enquiry.rate} (EMI about ${inr(enquiry.monthly)})`,
      source: "Website",
    });
    if (error) return setStatus({ state: "error", message: "Couldn't send your request. Please try again." });
    setStatus({ state: "done", message: `Thanks ${form.name.trim().split(" ")[0]}! Our loan team will call you about ${enquiry.name}.` });
  }

  return (
    <div id="rate-comparison" className="mx-4 mb-6 rounded-2xl border border-gray-200 bg-white p-5" style={{ scrollMarginTop: "100px" }}>
      <h3 className="text-base font-bold text-gray-900">Bank Rate Comparison</h3>
      <p className="text-xs text-gray-500 mb-4">Enter your loan and see what each bank would cost you per month. Rates are indicative starting rates — your final rate depends on your profile.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">Loan amount: <b>{lakh(principal)}</b></span>
          <input type="range" min="5" max="500" step="5" value={amountLac} onChange={(e) => setAmountLac(e.target.value)} className="w-full accent-[#1565C0]" aria-label="Loan amount in lakh" />
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-gray-500">₹</span>
            <input type="number" min="1" value={amountLac} onChange={(e) => setAmountLac(e.target.value)} className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm" aria-label="Loan amount (Lac)" />
            <span className="text-xs text-gray-500">Lac</span>
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">Tenure: <b>{years} years</b></span>
          <input type="range" min="1" max="30" step="1" value={years} onChange={(e) => setYears(e.target.value)} className="w-full accent-[#1565C0]" aria-label="Tenure in years" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-gray-700">Sort banks by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white">
            <option value="rate">Lowest interest rate</option>
            <option value="emi">Lowest monthly EMI</option>
            <option value="interest">Lowest total interest</option>
          </select>
        </label>
      </div>

      {best && worst && principal > 0 && (
        <p className="text-xs rounded-lg px-3 py-2 mb-3" style={{ background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0" }}>
          {best.name} is cheapest here: EMI about <b>{inr(best.monthly)}</b>/month — about <b>{inr(worst.totalInterest - best.totalInterest)}</b> less interest than {worst.name} over the loan.
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-gray-500 border-b border-gray-200">
              <th className="py-2 pr-3">Bank</th>
              <th className="py-2 pr-3">Rate</th>
              <th className="py-2 pr-3">Monthly EMI</th>
              <th className="py-2 pr-3">Total interest</th>
              <th className="py-2 pr-3">Processing fee</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} onClick={() => onSelectBank && onSelectBank(r)} className="border-b border-gray-100 cursor-pointer hover:bg-slate-50"
                style={selectedBankId === r.id ? { background: "#EFF6FF" } : undefined} aria-selected={selectedBankId === r.id}>
                <td className="py-2.5 pr-3 font-semibold text-gray-900">
                  {r.name}{i === 0 && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Best</span>}
                  {r.tenure < Number(years) && <span className="block text-[10px] font-normal text-amber-700">Max tenure {r.maxTenure} yrs applied</span>}
                </td>
                <td className="py-2.5 pr-3 font-bold text-[#1565C0]">{r.rate}</td>
                <td className="py-2.5 pr-3">{inr(r.monthly)}</td>
                <td className="py-2.5 pr-3">{inr(r.totalInterest)}</td>
                <td className="py-2.5 pr-3 text-xs text-gray-600">{r.fee}</td>
                <td className="py-2.5 text-right">
                  <button type="button" onClick={(e) => { e.stopPropagation(); setEnquiry(r); setStatus({ state: "idle", message: "" }); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: "#1565C0" }}>
                    Get this rate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enquiry && (
        <form onSubmit={sendEnquiry} className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-bold text-gray-900 mb-1">Get {enquiry.name}'s rate confirmed</p>
          <p className="text-xs text-gray-600 mb-3">{lakh(principal)} for {enquiry.tenure} years · EMI about {inr(enquiry.monthly)}. Leave your details and our loan team will call you.</p>
          {status.state === "done" ? (
            <p className="text-sm font-semibold text-green-700">{status.message}</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" aria-label="Your name" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Mobile number" aria-label="Mobile number" inputMode="tel" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" disabled={status.state === "sending"} className="px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-60" style={{ background: "#0F2D52" }}>
                {status.state === "sending" ? "Sending…" : "Request call back"}
              </button>
            </div>
          )}
          {status.state === "error" && <p className="text-xs text-red-600 mt-2">{status.message}</p>}
        </form>
      )}
      <p className="text-[10px] text-gray-400 mt-3">Indicative only. EMI is calculated on a reducing balance; actual rates, fees and eligibility are set by each bank.</p>
    </div>
  );
}
