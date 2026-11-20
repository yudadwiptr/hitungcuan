import { parseDecimal, parseMoney } from "./format";

export type Unit = "gram" | "ml" | "pcs";

export const UNITS: { value: Unit; label: string }[] = [
  { value: "gram", label: "g" },
  { value: "ml", label: "ml" },
  { value: "pcs", label: "pcs" },
];

export interface Ingredient {
  id: string;
  name: string;
  /** Harga beli satu kemasan, digit saja (contoh "120000") */
  price: string;
  /** Isi satu kemasan, string mentah dari input */
  packSize: string;
  unit: Unit;
  /** Takaran per porsi, satuan sama dengan `unit` */
  dose: string;
}

export interface CostItem {
  id: string;
  name: string;
  /** Nominal per porsi, digit saja */
  amount: string;
}

export type CostListKey = "packaging" | "operational";
export type CommissionPreset = "dinein" | "ojol" | "custom";
export type RoundingStep = 0 | 100 | 500 | 1000;

export interface CalcState {
  version: 1;
  productName: string;
  batchSize: string;
  ingredients: Ingredient[];
  packaging: CostItem[];
  operational: CostItem[];
  /** Target margin laba bersih terhadap harga jual, dalam persen (10–80) */
  marginPct: number;
  onlineEnabled: boolean;
  commissionPreset: CommissionPreset;
  customCommission: string;
  rounding: RoundingStep;
}

export const MARGIN_MIN = 10;
export const MARGIN_MAX = 80;
export const THIN_MARGIN = 0.15;
export const OJOL_COMMISSION = 20;
export const MAX_COMMISSION = 90;

export interface IngredientResult {
  id: string;
  costPerPortion: number;
  needPerBatch: number;
  valid: boolean;
}

export interface CalcResult {
  ingredients: IngredientResult[];
  ingredientsTotal: number;
  packagingTotal: number;
  operationalTotal: number;
  overheadTotal: number;
  hpp: number;
  portions: number;
  margin: number;
  commission: number;
  offlinePriceRaw: number;
  offlinePrice: number;
  onlinePrice: number;
  commissionAmount: number;
  profitOffline: number;
  profitOnline: number;
  actualMarginOffline: number;
  markup: number;
  isThin: boolean;
  batch: {
    cost: number;
    revenueOffline: number;
    profitOffline: number;
  };
}

function roundUp(value: number, step: RoundingStep): number {
  if (value <= 0) return 0;
  if (!step) return Math.round(value);
  return Math.ceil(value / step - 1e-9) * step;
}

export function commissionPct(state: CalcState): number {
  if (!state.onlineEnabled) return 0;
  if (state.commissionPreset === "dinein") return 0;
  if (state.commissionPreset === "ojol") return OJOL_COMMISSION;
  return Math.min(parseDecimal(state.customCommission), MAX_COMMISSION);
}

const sumCosts = (items: CostItem[]) =>
  items.reduce((acc, item) => acc + parseMoney(item.amount), 0);

/**
 * Inti perhitungan HPP & harga jual. Fungsi murni — aman dipanggil di useMemo.
 *
 * - Biaya bahan/porsi = (harga beli ÷ isi kemasan) × takaran
 * - HPP = bahan + kemasan + operasional
 * - Harga offline = HPP ÷ (1 − margin)          → margin dihitung dari harga jual
 * - Harga online  = harga offline ÷ (1 − komisi) → laba bersih tetap utuh setelah dipotong aplikasi
 */
export function calculate(state: CalcState): CalcResult {
  const portions = Math.max(1, Math.floor(parseDecimal(state.batchSize)) || 1);

  const ingredients: IngredientResult[] = state.ingredients.map((ing) => {
    const price = parseMoney(ing.price);
    const pack = parseDecimal(ing.packSize);
    const dose = parseDecimal(ing.dose);
    const valid = price > 0 && pack > 0 && dose > 0;
    return {
      id: ing.id,
      costPerPortion: pack > 0 ? (price / pack) * dose : 0,
      needPerBatch: dose * portions,
      valid,
    };
  });

  const ingredientsTotal = ingredients.reduce((a, r) => a + r.costPerPortion, 0);
  const packagingTotal = sumCosts(state.packaging);
  const operationalTotal = sumCosts(state.operational);
  const overheadTotal = packagingTotal + operationalTotal;
  const hpp = ingredientsTotal + overheadTotal;

  const margin = Math.min(Math.max(state.marginPct, MARGIN_MIN), MARGIN_MAX) / 100;
  const commission = commissionPct(state) / 100;

  const offlinePriceRaw = hpp > 0 ? hpp / (1 - margin) : 0;
  const offlinePrice = roundUp(offlinePriceRaw, state.rounding);
  const onlinePrice = roundUp(offlinePrice / (1 - commission), state.rounding);
  const commissionAmount = onlinePrice * commission;

  const profitOffline = offlinePrice - hpp;
  const profitOnline = onlinePrice - commissionAmount - hpp;
  const actualMarginOffline = offlinePrice > 0 ? profitOffline / offlinePrice : 0;

  return {
    ingredients,
    ingredientsTotal,
    packagingTotal,
    operationalTotal,
    overheadTotal,
    hpp,
    portions,
    margin,
    commission,
    offlinePriceRaw,
    offlinePrice,
    onlinePrice,
    commissionAmount,
    profitOffline,
    profitOnline,
    actualMarginOffline,
    markup: margin / (1 - margin),
    isThin: hpp > 0 && Math.min(margin, actualMarginOffline) < THIN_MARGIN,
    batch: {
      cost: hpp * portions,
      revenueOffline: offlinePrice * portions,
      profitOffline: profitOffline * portions,
    },
  };
}
