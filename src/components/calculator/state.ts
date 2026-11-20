import { DEFAULT_STATE, EMPTY_STATE } from "@/lib/defaults";
import {
  MARGIN_MAX,
  MARGIN_MIN,
  type CalcState,
  type CommissionPreset,
  type CostItem,
  type CostListKey,
  type Ingredient,
  type RoundingStep,
} from "@/lib/hpp";

export const STORAGE_KEY = "hitungcuan:v1";

export type Action =
  | { type: "setProductName"; value: string }
  | { type: "setBatchSize"; value: string }
  | { type: "addIngredient"; id: string }
  | { type: "updateIngredient"; id: string; patch: Partial<Omit<Ingredient, "id">> }
  | { type: "removeIngredient"; id: string }
  | { type: "addCost"; list: CostListKey; id: string; name?: string }
  | { type: "updateCost"; list: CostListKey; id: string; patch: Partial<Omit<CostItem, "id">> }
  | { type: "removeCost"; list: CostListKey; id: string }
  | { type: "setMargin"; value: number }
  | { type: "setOnline"; value: boolean }
  | { type: "setCommissionPreset"; value: CommissionPreset }
  | { type: "setCustomCommission"; value: string }
  | { type: "setRounding"; value: RoundingStep }
  | { type: "reset" }
  | { type: "clear" }
  | { type: "hydrate"; state: CalcState };

/** Dipanggil dari event handler (bukan reducer) supaya reducer tetap murni. */
export function makeId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

export function reducer(state: CalcState, action: Action): CalcState {
  switch (action.type) {
    case "setProductName":
      return { ...state, productName: action.value };
    case "setBatchSize":
      return { ...state, batchSize: action.value };
    case "addIngredient":
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          { id: action.id, name: "", price: "", packSize: "", unit: "gram", dose: "" },
        ],
      };
    case "updateIngredient":
      return {
        ...state,
        ingredients: state.ingredients.map((ing) =>
          ing.id === action.id ? { ...ing, ...action.patch } : ing,
        ),
      };
    case "removeIngredient":
      return { ...state, ingredients: state.ingredients.filter((i) => i.id !== action.id) };
    case "addCost":
      return {
        ...state,
        [action.list]: [...state[action.list], { id: action.id, name: action.name ?? "", amount: "" }],
      };
    case "updateCost":
      return {
        ...state,
        [action.list]: state[action.list].map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item,
        ),
      };
    case "removeCost":
      return { ...state, [action.list]: state[action.list].filter((i) => i.id !== action.id) };
    case "setMargin":
      return { ...state, marginPct: Math.min(Math.max(action.value, MARGIN_MIN), MARGIN_MAX) };
    case "setOnline":
      return { ...state, onlineEnabled: action.value };
    case "setCommissionPreset":
      return { ...state, commissionPreset: action.value };
    case "setCustomCommission":
      return { ...state, customCommission: action.value };
    case "setRounding":
      return { ...state, rounding: action.value };
    case "reset":
      return structuredClone(DEFAULT_STATE);
    case "clear":
      return structuredClone(EMPTY_STATE);
    case "hydrate":
      return action.state;
  }
}

const isStr = (v: unknown): v is string => typeof v === "string";

/** Validasi data dari localStorage — data rusak/versi lama diabaikan. */
export function parseStoredState(raw: string | null): CalcState | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Partial<CalcState>;
    if (d.version !== 1) return null;
    const okIngredients =
      Array.isArray(d.ingredients) &&
      d.ingredients.every(
        (i) => i && isStr(i.id) && isStr(i.name) && isStr(i.price) && isStr(i.packSize) && isStr(i.dose) &&
          ["gram", "ml", "pcs"].includes(i.unit),
      );
    const okCosts = (list: unknown) =>
      Array.isArray(list) && list.every((i: CostItem) => i && isStr(i.id) && isStr(i.name) && isStr(i.amount));
    if (
      !okIngredients ||
      !okCosts(d.packaging) ||
      !okCosts(d.operational) ||
      !isStr(d.productName) ||
      !isStr(d.batchSize) ||
      typeof d.marginPct !== "number" ||
      typeof d.onlineEnabled !== "boolean" ||
      !["dinein", "ojol", "custom"].includes(d.commissionPreset as string) ||
      !isStr(d.customCommission) ||
      ![0, 100, 500, 1000].includes(d.rounding as number)
    ) {
      return null;
    }
    return d as CalcState;
  } catch {
    return null;
  }
}
