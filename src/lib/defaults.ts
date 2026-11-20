import type { CalcState } from "./hpp";

/**
 * Data contoh realistis (harga pasar ritel 2026) — Es Kopi Susu Gula Aren 250 ml.
 * ID dibuat statis supaya render server & client identik.
 */
export const DEFAULT_STATE: CalcState = {
  version: 1,
  productName: "Es Kopi Susu Gula Aren",
  batchSize: "10",
  ingredients: [
    { id: "ing-1", name: "Biji kopi arabika blend", price: "120000", packSize: "1000", unit: "gram", dose: "18" },
    { id: "ing-2", name: "Susu UHT full cream", price: "19500", packSize: "1000", unit: "ml", dose: "150" },
    { id: "ing-3", name: "Gula aren cair", price: "35000", packSize: "1000", unit: "ml", dose: "25" },
    { id: "ing-4", name: "Susu kental manis", price: "12500", packSize: "370", unit: "gram", dose: "15" },
    { id: "ing-5", name: "Es batu kristal", price: "8000", packSize: "5000", unit: "gram", dose: "150" },
  ],
  packaging: [
    { id: "pkg-1", name: "Cup 16 oz + tutup", amount: "900" },
    { id: "pkg-2", name: "Sedotan", amount: "150" },
    { id: "pkg-3", name: "Kantong plastik", amount: "200" },
    { id: "pkg-4", name: "Stiker label", amount: "250" },
  ],
  operational: [
    { id: "ops-1", name: "Gas & listrik", amount: "300" },
    { id: "ops-2", name: "Tenaga kerja", amount: "1000" },
    { id: "ops-3", name: "Penyusutan alat", amount: "200" },
  ],
  marginPct: 35,
  onlineEnabled: true,
  commissionPreset: "ojol",
  customCommission: "25",
  rounding: 500,
};

export const EMPTY_STATE: CalcState = {
  ...DEFAULT_STATE,
  productName: "",
  batchSize: "1",
  ingredients: [{ id: "ing-empty", name: "", price: "", packSize: "", unit: "gram", dose: "" }],
  packaging: [],
  operational: [],
};

export const PACKAGING_SUGGESTIONS = [
  "Cup + tutup",
  "Sedotan",
  "Kantong plastik",
  "Stiker label",
  "Box / paper bowl",
  "Sendok & tisu",
];

export const OPERATIONAL_SUGGESTIONS = [
  "Gas & listrik",
  "Tenaga kerja",
  "Air bersih",
  "Sewa tempat",
  "Penyusutan alat",
];
