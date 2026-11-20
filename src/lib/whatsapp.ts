import { formatPercent, formatRupiah } from "./format";
import type { CalcResult, CalcState } from "./hpp";

/** Teks ringkasan siap paste ke WhatsApp (pakai *tebal* & _miring_ khas WA). */
export function buildWhatsAppSummary(state: CalcState, r: CalcResult): string {
  const name = state.productName.trim() || "Menu tanpa nama";
  const lines: string[] = [
    `*🧮 HPP & Harga Jual — ${name}*`,
    `_Produksi ${r.portions} porsi per batch_`,
    "",
    "*Rincian biaya per porsi*",
    `• Bahan baku: ${formatRupiah(r.ingredientsTotal)}`,
    `• Kemasan: ${formatRupiah(r.packagingTotal)}`,
    `• Operasional: ${formatRupiah(r.operationalTotal)}`,
    `*Total HPP: ${formatRupiah(r.hpp)}*`,
    "",
    `*Rekomendasi harga jual* (target margin ${formatPercent(r.margin, 0)})`,
    `• Offline / dine-in: *${formatRupiah(r.offlinePrice)}*`,
  ];

  if (state.onlineEnabled) {
    lines.push(
      `• Aplikasi online (komisi ${formatPercent(r.commission)}): *${formatRupiah(r.onlinePrice)}*`,
    );
  }

  lines.push(
    `• Laba bersih/porsi: ${formatRupiah(r.profitOffline)} (${formatPercent(r.actualMarginOffline)})`,
  );
  if (state.onlineEnabled && r.commission > 0) {
    lines.push(`• Laba bersih/porsi via app: ${formatRupiah(r.profitOnline)}`);
  }

  lines.push(
    "",
    `*Per batch (${r.portions} porsi)*`,
    `• Modal: ${formatRupiah(r.batch.cost)}`,
    `• Omzet offline: ${formatRupiah(r.batch.revenueOffline)}`,
    `• Laba bersih: ${formatRupiah(r.batch.profitOffline)}`,
  );

  if (r.isThin) {
    lines.push("", "⚠️ _Margin di bawah 15% — rawan rugi kalau harga bahan naik._");
  }

  lines.push("", "_Dihitung dengan HitungCuan_");
  return lines.join("\n");
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // jatuh ke fallback di bawah
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
