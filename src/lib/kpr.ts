import { formatPercent, formatRupiah, parseDecimal, parseMoney } from "./format";

export interface KprState {
  version: 1;
  propertyPrice: string;
  dpPct: number;
  tenorYears: string;
  fixedRate: string;
  fixedYears: string;
  floatingRate: string;
  upfrontPct: string;
  monthlyIncome: string;
}

export const KPR_DEFAULT: KprState = {
  version: 1,
  propertyPrice: "650000000",
  dpPct: 20,
  tenorYears: "15",
  fixedRate: "4,5",
  fixedYears: "3",
  floatingRate: "11",
  upfrontPct: "5",
  monthlyIncome: "15000000",
};

export const TENOR_OPTIONS = ["5", "10", "15", "20", "25", "30"];
export const DSR_LIMIT = 0.3;

export interface YearRow {
  year: number;
  monthlyPayment: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
  phase: "fix" | "floating";
}

export interface KprResult {
  price: number;
  dp: number;
  loan: number;
  months: number;
  fixedMonths: number;
  paymentFixed: number;
  paymentFloating: number;
  hasFloating: boolean;
  paymentJump: number;
  totalPaid: number;
  totalInterest: number;
  upfrontCost: number;
  cashNeeded: number;
  income: number;
  dsr: number;
  minIncome: number;
  years: YearRow[];
}

/** Angsuran anuitas: P × r / (1 − (1 + r)^−n) */
function annuity(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export function calculateKpr(s: KprState): KprResult {
  const price = parseMoney(s.propertyPrice);
  const dp = price * (s.dpPct / 100);
  const loan = Math.max(price - dp, 0);
  const tenor = Math.min(Math.max(Math.round(parseDecimal(s.tenorYears)), 1), 35);
  const months = tenor * 12;
  const fixedMonths = Math.min(Math.round(parseDecimal(s.fixedYears) * 12), months);
  const rFix = parseDecimal(s.fixedRate) / 100 / 12;
  const rFloat = parseDecimal(s.floatingRate) / 100 / 12;

  const paymentFixed = annuity(loan, rFix, months);
  let balance = loan;
  let paymentFloating = 0;
  let totalPaid = 0;
  const years: YearRow[] = [];
  let row: YearRow | null = null;

  for (let m = 1; m <= months; m++) {
    const isFix = m <= fixedMonths;
    if (!isFix && m === fixedMonths + 1) paymentFloating = annuity(balance, rFloat, months - fixedMonths);
    const rate = isFix ? rFix : rFloat;
    const payment = isFix ? paymentFixed : paymentFloating;
    const interest = balance * rate;
    const principal = Math.min(payment - interest, balance);
    balance = Math.max(balance - principal, 0);
    totalPaid += interest + principal;

    const year = Math.ceil(m / 12);
    if (!row || row.year !== year) {
      row = { year, monthlyPayment: payment, principalPaid: 0, interestPaid: 0, balance: 0, phase: isFix ? "fix" : "floating" };
      years.push(row);
    }
    row.principalPaid += principal;
    row.interestPaid += interest;
    row.balance = balance;
    if (!isFix) {
      row.monthlyPayment = payment;
      row.phase = "floating";
    }
  }

  const hasFloating = fixedMonths < months;
  const upfrontCost = price * (parseDecimal(s.upfrontPct) / 100);
  const income = parseMoney(s.monthlyIncome);
  const maxPayment = Math.max(paymentFixed, hasFloating ? paymentFloating : 0);

  return {
    price,
    dp,
    loan,
    months,
    fixedMonths,
    paymentFixed,
    paymentFloating,
    hasFloating,
    paymentJump: hasFloating && paymentFixed > 0 ? paymentFloating / paymentFixed - 1 : 0,
    totalPaid,
    totalInterest: Math.max(totalPaid - loan, 0),
    upfrontCost,
    cashNeeded: dp + upfrontCost,
    income,
    dsr: income > 0 ? maxPayment / income : 0,
    minIncome: maxPayment / DSR_LIMIT,
    years,
  };
}

export function kprWhatsApp(s: KprState, r: KprResult): string {
  const tenor = r.months / 12;
  const lines = [
    "*🏠 Simulasi KPR*",
    `_Harga properti ${formatRupiah(r.price)} · tenor ${tenor} tahun_`,
    "",
    `• DP ${s.dpPct}%: ${formatRupiah(r.dp)}`,
    `• Plafon pinjaman: ${formatRupiah(r.loan)}`,
    `• Cicilan masa fix (${s.fixedRate}% · ${r.fixedMonths / 12} th): *${formatRupiah(r.paymentFixed)}/bln*`,
  ];
  if (r.hasFloating) {
    lines.push(`• Cicilan floating (${s.floatingRate}%): *${formatRupiah(r.paymentFloating)}/bln* (+${formatPercent(r.paymentJump, 0)})`);
  }
  lines.push(
    `• Total bunga: ${formatRupiah(r.totalInterest)}`,
    `• Total pembayaran: ${formatRupiah(r.totalPaid)}`,
    `• Dana awal (DP + biaya ±${s.upfrontPct}%): ${formatRupiah(r.cashNeeded)}`,
  );
  if (r.income > 0) lines.push(`• Rasio cicilan/penghasilan: ${formatPercent(r.dsr)} (ideal ≤ 30%)`);
  lines.push("", "_Estimasi — cek penawaran resmi bank. Dihitung dengan HitungCuan_");
  return lines.join("\n");
}

const isStr = (v: unknown): v is string => typeof v === "string";

export function parseKprState(raw: string | null): KprState | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Partial<KprState>;
    if (
      d.version !== 1 ||
      typeof d.dpPct !== "number" ||
      ![d.propertyPrice, d.tenorYears, d.fixedRate, d.fixedYears, d.floatingRate, d.upfrontPct, d.monthlyIncome].every(isStr)
    ) {
      return null;
    }
    return d as KprState;
  } catch {
    return null;
  }
}
