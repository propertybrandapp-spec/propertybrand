// Whole-number -> words in the Indian system (lakh / crore), used to write
// amounts like ₹22,000 as "Twenty Two Thousand" on the rent agreement.
const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
  "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function below100(n) {
  return n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? " " + ONES[n % 10] : ""}`;
}
function below1000(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  return `${h ? ONES[h] + " Hundred" : ""}${h && r ? " " : ""}${r ? below100(r) : ""}`;
}

export function numberToIndianWords(value) {
  let n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return "";
  if (n === 0) return "Zero";
  const parts = [];
  const crore = Math.floor(n / 10000000); n %= 10000000;
  const lakh = Math.floor(n / 100000); n %= 100000;
  const thousand = Math.floor(n / 1000); n %= 1000;
  if (crore) parts.push(`${below100(crore % 100) || below1000(crore)} Crore`.replace(/^ /, ""));
  if (lakh) parts.push(`${below100(lakh)} Lakh`);
  if (thousand) parts.push(`${below100(thousand)} Thousand`);
  if (n) parts.push(below1000(n));
  return parts.join(" ");
}
