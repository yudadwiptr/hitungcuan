import { formatPercent, formatRupiah, parseDecimal, parseMoney } from "./format";
import type { CostItem, RoundingStep } from "./hpp";

export type PlatformId = "shopee" | "tokopedia" | "lazada" | "social" | "custom";

export interface PlatformPreset {
  id: Exclude<PlatformId, "custom">;
  name: string;
  short: string;
  adminPct: number;
  servicePct: number;
  fixedFee: number;
  note: string;
}

/**
 * Estimasi tarif seller (bisa diedit user). Tarif asli berbeda per kategori, status toko,
 * & program yang diikuti, dan sering berubah — selalu cek Seller Center masing-masing.
 */
export const PLATFORM_PRESETS: PlatformPreset[] = [
  { id: "shopee", name: "Shopee", short: "Shopee", adminPct: 8, servicePct: 4, fixedFee: 1250, note: "Admin + Gratis Ongkir XTRA + biaya proses" },
  { id: "tokopedia", name: "Tokopedia & TikTok Shop", short: "Tokped/TikTok", adminPct: 7.5, servicePct: 3, fixedFee: 1000, note: "Komisi + layanan + biaya pesanan" },
  { id: "lazada", name: "Lazada", short: "Lazada", adminPct: 7, servicePct: 3, fixedFee: 0, note: "Komisi + biaya program" },
  { id: "social", name: "Facebook / WhatsApp / Instagram", short: "FB/WA/IG", adminPct: 0, servicePct: 0, fixedFee: 0, note: "Jual langsung, tanpa potongan" },
];

export interface MarketState {
  version: 1;
  productName: string;
  buyPrice: string;
  extras: CostItem[];
  platform: PlatformId;
  adminPct: string;
  servicePct: string;
  fixedFee: string;
  discountPct: string;
  marginPct: number;
  rounding: RoundingStep;
  monthlyUnits: string;
}

export const MARKET_MARGIN_MIN = 5;
export const MARKET_MARGIN_MAX = 60;
export const MARKET_THIN = 0.1;

export const MARKET_DEFAULT: MarketState = {
  version: 1,
  productName: "Tumbler Stainless 500 ml",
  buyPrice: "38000",
  extras: [
    { id: "ext-1", name: "Bubble wrap & kardus", amount: "2000" },
    { id: "ext-2", name: "Ongkir supplier per unit", amount: "1500" },
    { id: "ext-3", name: "Lakban & label", amount: "500" },
  ],
  platform: "shopee",
  adminPct: "8",
  servicePct: "4",
  fixedFee: "1250",
  discountPct: "0",
  marginPct: 20,
  rounding: 500,
  monthlyUnits: "60",
};

export const EXTRA_SUGGESTIONS = ["Bubble wrap & kardus", "Ongkir supplier per unit", "Lakban & label", "Biaya iklan per unit", "Bonus/hadiah kecil"];

interface Fees {
  feeRate: number;
  fixedFee: number;
}

export interface PriceBreakdown {
  valid: boolean;
  listPrice: number;
  paidPrice: number;
  platformFee: number;
  received: number;
  profit: number;
  margin: number;
}

export interface MarketResult extends PriceBreakdown {
  buy: number;
  extrasTotal: number;
  cost: number;
  feeRate: number;
  fixedFee: number;
  discount: number;
  targetMargin: number;
  breakEvenList: number;
  units: number;
  monthlyRevenue: number;
  monthlyProfit: number;
  isThin: boolean;
  comparison: (PriceBreakdown & { id: PlatformPreset["id"]; name: string })[];
}

function roundUp(value: number, step: RoundingStep): number {
  if (value <= 0) return 0;
  if (!step) return Math.ceil(value - 1e-9);
  return Math.ceil(value / step - 1e-9) * step;
}

function priceFor(cost: number, fees: Fees, discount: number, margin: number, step: RoundingStep): PriceBreakdown {
  const den = 1 - fees.feeRate - margin;
  if (cost <= 0 || den <= 0.02) {
    return { valid: cost <= 0, listPrice: 0, paidPrice: 0, platformFee: 0, received: 0, profit: 0, margin: 0 };
  }
  const paidRaw = (cost + fees.fixedFee) / den;
  const listPrice = roundUp(paidRaw / (1 - discount), step);
  const paidPrice = listPrice * (1 - discount);
  const platformFee = paidPrice * fees.feeRate + fees.fixedFee;
  const received = paidPrice - platformFee;
  const profit = received - cost;
  return { valid: true, listPrice, paidPrice, platformFee, received, profit, margin: paidPrice > 0 ? profit / paidPrice : 0 };
}

export function calculateMarket(s: MarketState): MarketResult {
  const buy = parseMoney(s.buyPrice);
  const extrasTotal = s.extras.reduce((a, e) => a + parseMoney(e.amount), 0);
  const cost = buy + extrasTotal;
  const feeRate = Math.min((parseDecimal(s.adminPct) + parseDecimal(s.servicePct)) / 100, 0.9);
  const fixedFee = parseMoney(s.fixedFee);
  const discount = Math.min(parseDecimal(s.discountPct) / 100, 0.9);
  const targetMargin = Math.min(Math.max(s.marginPct, MARKET_MARGIN_MIN), MARKET_MARGIN_MAX) / 100;
  const units = Math.max(0, Math.floor(parseDecimal(s.monthlyUnits)));

  const main = priceFor(cost, { feeRate, fixedFee }, discount, targetMargin, s.rounding);
  const breakEvenList = cost > 0 ? Math.ceil((cost + fixedFee) / (1 - feeRate) / (1 - discount)) : 0;

  const comparison = PLATFORM_PRESETS.map((p) => ({
    id: p.id,
    name: p.short,
    ...priceFor(
      cost,
      { feeRate: (p.adminPct + p.servicePct) / 100, fixedFee: p.fixedFee },
      p.id === "social" ? 0 : discount,
      targetMargin,
      s.rounding,
    ),
  }));

  return {
    ...main,
    buy,
    extrasTotal,
    cost,
    feeRate,
    fixedFee,
    discount,
    targetMargin,
    breakEvenList,
    units,
    monthlyRevenue: main.paidPrice * units,
    monthlyProfit: main.profit * units,
    isThin: main.valid && cost > 0 && main.margin < MARKET_THIN,
    comparison,
  };
}

export function marketWhatsApp(s: MarketState, r: MarketResult): string {
  const preset = PLATFORM_PRESETS.find((p) => p.id === s.platform);
  const platform = preset?.name ?? "Custom";
  const lines = [
    `*🛍️ Harga Jual Online — ${s.productName.trim() || "Produk"}*`,
    `_Platform: ${platform}_`,
    "",
    "*Modal per unit*",
    `• Harga beli: ${formatRupiah(r.buy)}`,
    `• Biaya tambahan: ${formatRupiah(r.extrasTotal)}`,
    `*Total modal: ${formatRupiah(r.cost)}*`,
    "",
    `*Rekomendasi harga* (target margin ${formatPercent(r.targetMargin, 0)})`,
    `• Harga tayang: *${formatRupiah(r.listPrice)}*`,
  ];
  if (r.discount > 0) lines.push(`• Dibayar pembeli (diskon ${formatPercent(r.discount)}): ${formatRupiah(r.paidPrice)}`);
  lines.push(
    `• Potongan platform: ${formatRupiah(r.platformFee)}`,
    `• Uang diterima: ${formatRupiah(r.received)}`,
    `• Laba bersih/unit: ${formatRupiah(r.profit)} (${formatPercent(r.margin)})`,
    `• Harga minimum balik modal: ${formatRupiah(r.breakEvenList)}`,
  );
  if (r.units > 0) {
    lines.push("", `*Target ${r.units} unit/bulan*`, `• Omzet: ${formatRupiah(r.monthlyRevenue)}`, `• Laba bersih: ${formatRupiah(r.monthlyProfit)}`);
  }
  lines.push("", "_Dihitung dengan HitungCuan_");
  return lines.join("\n");
}

const isStr = (v: unknown): v is string => typeof v === "string";

export function parseMarketState(raw: string | null): MarketState | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Partial<MarketState>;
    const okExtras =
      Array.isArray(d.extras) && d.extras.every((e) => e && isStr(e.id) && isStr(e.name) && isStr(e.amount));
    if (
      d.version !== 1 ||
      !okExtras ||
      ![d.productName, d.buyPrice, d.adminPct, d.servicePct, d.fixedFee, d.discountPct, d.monthlyUnits].every(isStr) ||
      typeof d.marginPct !== "number" ||
      !["shopee", "tokopedia", "lazada", "social", "custom"].includes(d.platform as string) ||
      ![0, 100, 500, 1000].includes(d.rounding as number)
    ) {
      return null;
    }
    return d as MarketState;
  } catch {
    return null;
  }
}
