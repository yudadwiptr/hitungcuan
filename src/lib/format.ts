/**
 * Helper format & parsing angka gaya Indonesia.
 * Sengaja tidak memakai Intl agar output identik di server & client
 * (menghindari hydration mismatch karena perbedaan data ICU/spasi non-breaking).
 */

function groupThousands(intString: string): string {
  return intString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** 12500 -> "Rp 12.500" ; -3000 -> "-Rp 3.000" */
export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}Rp ${groupThousands(String(Math.abs(rounded)))}`;
}

/** 1234.5 -> "1.234,5" (maksimal `maxFraction` digit desimal, tanpa nol di belakang) */
export function formatNumber(value: number, maxFraction = 2): string {
  if (!Number.isFinite(value)) return "0";
  const sign = value < 0 ? "-" : "";
  const fixed = Math.abs(value).toFixed(maxFraction);
  const [intPart, fracPart = ""] = fixed.split(".");
  const trimmedFrac = fracPart.replace(/0+$/, "");
  return `${sign}${groupThousands(intPart)}${trimmedFrac ? `,${trimmedFrac}` : ""}`;
}

/** 0.3512 -> "35,1%" */
export function formatPercent(ratio: number, maxFraction = 1): string {
  return `${formatNumber(ratio * 100, maxFraction)}%`;
}

/** Ambil hanya digit dari input nominal Rupiah. "Rp 12.500" -> "12500" */
export function sanitizeMoney(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  return digits.slice(0, 13);
}

/** Tampilan input nominal: "12500" -> "12.500" */
export function displayMoney(digits: string): string {
  return digits ? groupThousands(digits) : "";
}

export function parseMoney(digits: string): number {
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

/** Izinkan digit, titik, dan koma untuk input jumlah/takaran. */
export function sanitizeDecimal(raw: string): string {
  return raw.replace(/[^\d.,]/g, "").slice(0, 12);
}

/**
 * Parse angka gaya Indonesia dengan toleransi format internasional.
 * - "0,5" -> 0.5     (koma = desimal)
 * - "1.000" -> 1000  (titik + 3 digit = ribuan)
 * - "1.000,5" -> 1000.5
 * - "0.5" / "1.25" -> desimal
 */
export function parseDecimal(raw: string): number {
  const s = raw.trim();
  if (!s) return 0;
  let normalized: string;
  if (s.includes(",")) {
    normalized = s.replace(/\./g, "").replace(",", ".").replace(/,/g, "");
  } else {
    const parts = s.split(".");
    const looksLikeThousands =
      parts.length > 2 || (parts.length === 2 && parts[1].length === 3);
    normalized = looksLikeThousands ? parts.join("") : s;
  }
  const n = parseFloat(normalized);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
