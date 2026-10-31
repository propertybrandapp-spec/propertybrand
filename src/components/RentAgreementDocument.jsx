import { forwardRef } from "react";
import { numberToIndianWords } from "../lib/numberWords";

// ── Residential Rent Agreement (Bhubaneswar, Odisha) ─────────────────────────
// The agreement text comes from the "Sites Updates" document. Everything the
// RentReady form collects is filled in; anything it doesn't collect is left as
// a blank line to be completed by hand before signing, exactly as in the
// template.

const BLANK = "________________";

function fmtDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// Last day of an N-month tenancy that starts on `start` (e.g. 1 Jan + 11 months -> 30 Nov)
function tenancyEnd(start, months) {
  if (!start || !months) return null;
  const dt = new Date(start);
  if (Number.isNaN(dt.getTime())) return null;
  dt.setMonth(dt.getMonth() + Number(months));
  dt.setDate(dt.getDate() - 1);
  return dt;
}

function money(n) {
  const v = Number(n);
  return v > 0 ? v.toLocaleString("en-IN") : null;
}

function V({ children }) {
  return <strong className="font-bold underline decoration-dotted underline-offset-2">{children}</strong>;
}

function Clause({ n, title, children }) {
  return (
    <section className="avoid-break">
      <h4 className="font-bold mt-5 mb-1.5 uppercase tracking-wide">{n}. {title}</h4>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function SignBlock({ title, lines }) {
  return (
    <div className="avoid-break">
      <p className="font-bold mb-1">{title}</p>
      {lines.map((l) => <p key={l}>{l}: __________________________</p>)}
    </div>
  );
}

const RentAgreementDocument = forwardRef(function RentAgreementDocument({ data }, ref) {
  const city = (data.city || "").trim() || "Bhubaneswar";
  const inBhubaneswar = city.toLowerCase() === "bhubaneswar";
  const stateText = inBhubaneswar ? "Odisha" : "the State in which the premises are situated";
  const startDate = fmtDate(data.moveInDate);
  const endDate = fmtDate(tenancyEnd(data.moveInDate, data.leaseDurationMonths));
  const months = Number(data.leaseDurationMonths) || 11;
  const monthsWords = numberToIndianWords(months).toLowerCase();
  const rent = money(data.monthlyRent);
  const deposit = money(data.securityDeposit);
  const maintenance = money(data.maintenanceCharges);
  const lockIn = Number(data.lockInPeriodMonths) || 0;
  const notice = Number(data.noticePeriodDays) || 30;
  const dueDay = data.rentDueDay || "";

  return (
    <div ref={ref} className="text-[13px] leading-relaxed text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <h3 className="text-center font-extrabold text-base tracking-wide">RESIDENTIAL RENT AGREEMENT</h3>
      <p className="text-center font-semibold mb-4">({inBhubaneswar ? "Bhubaneswar, Odisha" : city})</p>

      <p>
        This Rent Agreement is executed on this ___ day of _______, 20__ at {city}
        {inBhubaneswar ? ", District Khordha, Odisha" : ""}.
      </p>

      <p className="font-bold mt-4">BETWEEN</p>
      <p>
        Mr./Ms. <V>{data.ownerName || BLANK}</V>, aged about ___ years, son/daughter/spouse of ______________________________,
        residing at ________________________________________________, hereinafter referred to as the “LANDLORD” (which
        expression shall, unless repugnant to the context, include their legal heirs, successors, representatives and permitted assigns).
      </p>
      <p className="font-bold mt-2">AND</p>
      <p>
        Mr./Ms. <V>{data.tenantName || BLANK}</V>, aged about ___ years, son/daughter/spouse of ______________________________,
        permanently residing at ________________________________________________, holding ID proof{" "}
        <V>{data.tenantAadhaar ? `Aadhaar ${data.tenantAadhaar}` : "______________________________"}</V>, hereinafter referred to as
        the “TENANT” (which expression shall, unless repugnant to the context, include their legal heirs and permitted representatives).
      </p>
      <p className="mt-2">The Landlord and Tenant are hereinafter collectively referred to as the “Parties”.</p>

      <Clause n="1" title="Description of the Property">
        <p>The Landlord agrees to let out to the Tenant the residential premises described below:</p>
        <p>Full Address: <V>{data.propertyAddress || "________________________________________________"}</V></p>
        <p>Flat/House No.: <V>{data.flatNo || "__________________"}</V></p>
        <p>Floor: <V>{data.floor || "__________________"}</V></p>
        <p>Building/Society Name: <V>{data.buildingName || "__________________"}</V></p>
        <p>Parking Details, if applicable: <V>{data.parkingDetails || "__________________"}</V></p>
        <p>Furnishing Status: <V>{data.furnishing || "Furnished / Semi-furnished / Unfurnished"}</V></p>
        <p>The premises shall be used exclusively for residential purposes.</p>
      </Clause>

      <Clause n="2" title="Term of Tenancy">
        <p>
          The tenancy shall commence on <V>{startDate || "__/__/20__"}</V> and remain in force for a period of{" "}
          <V>{months} ({monthsWords})</V> months, ending on <V>{endDate || "__/__/20__"}</V>, unless terminated earlier in
          accordance with this Agreement.
        </p>
        <p>Any extension or renewal shall be mutually agreed upon in writing by both Parties before expiry of the tenancy.</p>
      </Clause>

      <Clause n="3" title="Monthly Rent">
        <p>
          The Tenant agrees to pay the Landlord a monthly rent of ₹<V>{rent || "____________"}</V> (Rupees{" "}
          <V>{rent ? `${numberToIndianWords(data.monthlyRent)} only` : "__________________________________ only"}</V>).
        </p>
        <p>Rent shall be paid on or before the <V>{dueDay || "___"}</V> day of each calendar month.</p>
        <p>Payment shall be made through bank transfer, UPI, or another mutually agreed method.</p>
        <p>The Landlord shall acknowledge rent payments through receipts, bank records, or other suitable documentation.</p>
        <p>Any applicable tax deduction or other statutory obligation shall be complied with by the relevant Party as required by law.</p>
      </Clause>

      <Clause n="4" title="Security Deposit">
        <p>
          The Tenant shall pay an interest-free refundable security deposit of ₹<V>{deposit || "____________"}</V> (Rupees{" "}
          <V>{deposit ? `${numberToIndianWords(data.securityDeposit)} only` : "__________________________________ only"}</V>) to
          the Landlord upon execution of this Agreement.
        </p>
        <p>The deposit shall be refunded within 15 days of vacant possession and handover of keys, after adjustment of:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Unpaid rent, if any.</li>
          <li>Outstanding electricity, water, gas, maintenance or other agreed charges attributable to the Tenant.</li>
          <li>The reasonable and documented cost of repairing damage beyond normal wear and tear caused by the Tenant or their occupants.</li>
        </ul>
        <p>
          No deduction shall be made for ordinary wear and tear or pre-existing damage. The Landlord shall provide an itemised
          statement of any deductions. The security deposit shall not automatically be treated as payment of the last month's rent.
        </p>
      </Clause>

      <Clause n="5" title="Rent Revision">
        <p>Any increase in rent upon renewal shall be mutually agreed upon in writing by the Parties before the renewal takes effect.</p>
        <p>No unilateral increase shall apply during the agreed tenancy term unless permitted by this Agreement and applicable law.</p>
      </Clause>

      <Clause n="6" title="Electricity, Water and Other Charges">
        <p>The following payment arrangements shall apply:</p>
        <p>Electricity charges: __________________________________</p>
        <p>Water charges: __________________________________</p>
        <p>Monthly society/maintenance charges: <V>{maintenance ? `₹${maintenance} per month` : "__________________________________"}</V></p>
        <p>LPG/piped gas, internet and other utility charges: __________________________________</p>
        <p>The Tenant shall pay the charges specifically allocated to them under this Agreement within the prescribed due dates.</p>
        <p>Property tax, structural repair costs and ownership-related statutory charges shall be borne by the Landlord unless otherwise lawfully agreed in writing.</p>
      </Clause>

      <Clause n="7" title="Use and Occupancy">
        <p>The premises shall be occupied by the Tenant and the following authorised occupants: __________________________________.</p>
        <p>The Tenant shall not use the premises for commercial, illegal or nuisance-causing activities.</p>
        <p>The Tenant shall not sublet, assign or transfer possession of the premises to another person without the Landlord's prior written consent.</p>
        <p>The Tenant shall comply with applicable laws and reasonable housing society rules.</p>
        <p>The Tenant shall not store hazardous or prohibited materials on the premises.</p>
      </Clause>

      <Clause n="8" title="Maintenance and Repairs">
        <p>The Tenant shall keep the premises reasonably clean and in good condition.</p>
        <p>Minor maintenance arising from ordinary use shall be handled as mutually agreed by the Parties.</p>
        <p>Structural repairs, major plumbing defects, concealed electrical faults and other repairs arising from ordinary deterioration shall be the Landlord's responsibility, except where caused by the Tenant's negligence or misuse.</p>
        <p>The Tenant shall promptly inform the Landlord of leaks, electrical hazards, structural defects or other material damage.</p>
        <p>The Tenant shall not make structural alterations, drill major structural members, or undertake permanent modifications without the Landlord's prior written consent.</p>
      </Clause>

      <Clause n="9" title="Furniture, Fixtures and Inventory">
        <p>Where the premises are furnished or semi-furnished, the Parties shall jointly prepare and sign an inventory of furniture, appliances, fixtures, keys and their condition at handover.</p>
        <p>The Tenant shall return the listed items in substantially the same condition, subject to normal wear and tear.</p>
        <p>An inventory and dated photographs may be attached as Annexure A to this Agreement.</p>
      </Clause>

      <Clause n="10" title="Landlord's Right of Inspection">
        <p>The Landlord or their authorised representative may inspect the premises after giving at least 24 hours' prior notice and obtaining a mutually reasonable time, except in a genuine emergency requiring immediate access.</p>
        <p>Inspections shall be conducted at reasonable hours with due respect for the Tenant's privacy.</p>
      </Clause>

      <Clause n="11" title="Notice and Termination">
        <p>
          Either Party may terminate this Agreement by giving <V>{notice} days'</V> written notice to the other Party.
          {lockIn > 0 && <> Neither Party shall give such notice to take effect within the first <V>{lockIn} months</V> of the tenancy (lock-in period), except for a material breach as described below.</>}
        </p>
        <p>The Agreement may also be terminated in the event of a material breach, including persistent non-payment of rent, unlawful use, unauthorised subletting or substantial damage to the premises, subject to applicable law and any required notice or opportunity to remedy the breach.</p>
        <p>Neither Party shall use force, unlawfully disconnect essential utilities, or otherwise resort to unlawful self-help to obtain possession. Recovery of possession shall follow the applicable legal process.</p>
      </Clause>

      <Clause n="12" title="Handover and Vacant Possession">
        <p>Upon expiry or lawful termination of the tenancy, the Tenant shall:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Vacate the premises and remove personal belongings.</li>
          <li>Return all keys, access cards and other items supplied by the Landlord.</li>
          <li>Clear rent and other charges payable under this Agreement up to the handover date.</li>
          <li>Return the premises in a reasonably clean condition, subject to normal wear and tear.</li>
          <li>Cooperate in recording the final meter readings and signing a handover acknowledgment.</li>
        </ul>
        <p>The Landlord shall settle the security deposit in accordance with Clause 4.</p>
      </Clause>

      <Clause n="13" title="No Ownership or Tenancy Transfer">
        <p>This Agreement grants the Tenant the right to occupy the premises for the agreed residential tenancy only. It does not transfer ownership or any permanent interest in the property.</p>
        <p>The Tenant shall not claim ownership rights or transfer occupancy rights contrary to this Agreement or applicable law.</p>
      </Clause>

      <Clause n="14" title="Police Verification and Identification">
        <p>The Parties shall cooperate with any police tenant verification, identity documentation or other formalities applicable to the tenancy in {city}.</p>
        <p>Copies of identity and address documents may be retained for lawful tenancy administration and verification purposes, with reasonable safeguards for personal information.</p>
      </Clause>

      <Clause n="15" title="Stamp Duty and Registration">
        <p>The Parties shall execute this Agreement on the appropriate stamp paper or through an applicable e-stamping process, as required by the laws in force in {stateText}.</p>
        <p>Any stamp duty, registration fee and related execution expenses shall be borne by: Landlord / Tenant / Shared equally (select one).</p>
        <p>The Parties shall comply with all applicable stamping and registration requirements. If the tenancy is extended or converted into a lease requiring registration, the necessary formalities shall be completed.</p>
      </Clause>

      <Clause n="16" title="Dispute Resolution and Jurisdiction">
        <p>The Parties shall first attempt to resolve disputes through mutual discussion.</p>
        <p>If a dispute cannot be resolved amicably, it shall be subject to the jurisdiction of the competent courts and authorities having jurisdiction over the property, in accordance with applicable law.</p>
      </Clause>

      <Clause n="17" title="Entire Agreement">
        <p>This Agreement, together with its signed annexures, constitutes the understanding between the Parties regarding the tenancy.</p>
        <p>Any amendment shall be made in writing and signed by both Parties. If any provision is held unenforceable, the remaining provisions shall continue to apply to the extent legally permissible.</p>
      </Clause>

      <Clause n="18" title="Declaration">
        <p>Both Parties confirm that they have read and understood the terms of this Agreement, have entered into it voluntarily, and agree to comply with its provisions.</p>
      </Clause>

      <p className="mt-5 avoid-break">
        IN WITNESS WHEREOF, the Parties have signed this Agreement on the date and at the place first mentioned above.
      </p>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 mt-5">
        <div className="avoid-break">
          <p className="font-bold mb-1">LANDLORD</p>
          <p>Signature: __________________________</p>
          <p>Full Name: <V>{data.ownerName || "__________________________"}</V></p>
          <p>Date: __/__/20__</p>
        </div>
        <div className="avoid-break">
          <p className="font-bold mb-1">TENANT</p>
          <p>Signature: __________________________</p>
          <p>Full Name: <V>{data.tenantName || "__________________________"}</V></p>
          <p>Date: __/__/20__</p>
        </div>
        <SignBlock title="WITNESS 1" lines={["Signature", "Name", "Address"]} />
        <SignBlock title="WITNESS 2" lines={["Signature", "Name", "Address"]} />
      </div>

      <section className="mt-8 avoid-break" style={{ breakBefore: "page" }}>
        <h4 className="font-bold uppercase tracking-wide text-center mb-3">Annexure A — Property Inventory and Handover</h4>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1.5 text-left">Item</th>
              <th className="border border-gray-400 px-2 py-1.5 text-left w-24">Quantity</th>
              <th className="border border-gray-400 px-2 py-1.5 text-left w-40">Condition at handover</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Fans and lights", "Air conditioners", "Geysers", "Wardrobes and cupboards", "Beds and furniture",
              "Kitchen fittings/appliances", "Keys/access cards", "Electricity meter reading",
              "Water meter reading, if applicable", "Other items",
            ].map((item) => (
              <tr key={item}>
                <td className="border border-gray-400 px-2 py-2">{item}</td>
                <td className="border border-gray-400 px-2 py-2">______</td>
                <td className="border border-gray-400 px-2 py-2">______</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-5 space-y-1.5">
          <p>Landlord's signature: __________________</p>
          <p>Tenant's signature: __________________</p>
          <p>Date of handover: __/__/20__</p>
        </div>
      </section>
    </div>
  );
});

export default RentAgreementDocument;
