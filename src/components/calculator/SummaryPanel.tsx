"use client";

import { AlertTriangle, Bike, Store, TrendingUp } from "lucide-react";
import { formatPercent, formatRupiah } from "@/lib/format";
import type { CalcResult, CalcState } from "@/lib/hpp";
import { buildWhatsAppSummary } from "@/lib/whatsapp";
import { ResultActions } from "@/components/ui/actions";
import { CostDonut, type DonutSegment } from "@/components/ui/CostDonut";
import { cx } from "@/components/ui/form";

const COLORS = {
  ingredients: "#1E293B", // slate-800
  overhead: "#94A3B8", // slate-400
  commission: "#D97706", // amber-600
  profit: "#059669", // emerald-600
};

export function SummaryPanel({
  state,
  result: r,
  onReset,
}: {
  state: CalcState;
  result: CalcResult;
  onReset: () => void;
}) {
  const useOnline = state.onlineEnabled && r.commission > 0;
  const chartPrice = useOnline ? r.onlinePrice : r.offlinePrice;
  const chartProfit = useOnline ? r.profitOnline : r.profitOffline;
  const segments: DonutSegment[] = [
    { key: "ing", label: "Bahan baku", value: r.ingredientsTotal, color: COLORS.ingredients },
    { key: "ovh", label: "Kemasan & operasional", value: r.overheadTotal, color: COLORS.overhead },
    ...(useOnline
      ? [{ key: "com", label: "Komisi aplikasi", value: r.commissionAmount, color: COLORS.commission }]
      : []),
    { key: "pro", label: "Laba bersih", value: Math.max(chartProfit, 0), color: COLORS.profit },
  ];

  const hasData = r.hpp > 0;
  const name = state.productName.trim() || "Menu tanpa nama";

  return (
    <section
      id="hasil"
      aria-labelledby="hasil-title"
      className="scroll-mt-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)]"
    >
      {/* Header + HPP */}
      <div className="relative overflow-hidden bg-slate-900 px-5 pt-5 pb-5 text-white sm:px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-emerald-500/25 blur-3xl"
        />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="hasil-title" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
              Ringkasan per porsi
            </h2>
            <p className="mt-1 truncate text-[15px] font-semibold" title={name}>
              {name}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-white/15 tabular-nums">
            {r.portions} porsi/batch
          </span>
        </div>

        <div className="relative mt-5">
          <p className="text-[12px] text-slate-400">Total HPP per porsi</p>
          <p className="mt-0.5 text-[32px] leading-none font-bold tracking-tight tabular-nums" aria-live="polite">
            {formatRupiah(r.hpp)}
          </p>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-[11.5px]">
            {[
              ["Bahan", r.ingredientsTotal],
              ["Kemasan", r.packagingTotal],
              ["Operasional", r.operationalTotal],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-lg bg-white/[0.06] px-2.5 py-2 ring-1 ring-white/10">
                <dt className="text-slate-400">{label}</dt>
                <dd className="mt-0.5 font-semibold text-slate-100 tabular-nums">{formatRupiah(value as number)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        {/* Harga jual */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
            <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-800">
              <Store className="size-3.5" aria-hidden /> Harga offline
            </p>
            <p className="mt-1.5 text-xl font-bold tracking-tight text-emerald-700 tabular-nums">
              {formatRupiah(r.offlinePrice)}
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-800/60">Dine-in / takeaway</p>
          </div>

          <div
            className={cx(
              "rounded-xl border p-3.5",
              state.onlineEnabled ? "border-amber-200 bg-amber-50/70" : "border-slate-200 bg-slate-50",
            )}
          >
            <p
              className={cx(
                "flex items-center gap-1.5 text-[11.5px] font-medium",
                state.onlineEnabled ? "text-amber-800" : "text-slate-500",
              )}
            >
              <Bike className="size-3.5" aria-hidden /> Harga aplikasi
            </p>
            {state.onlineEnabled ? (
              <>
                <p className="mt-1.5 text-xl font-bold tracking-tight text-amber-700 tabular-nums">
                  {formatRupiah(r.onlinePrice)}
                </p>
                <p className="mt-0.5 text-[11px] text-amber-800/60 tabular-nums">
                  Komisi {formatPercent(r.commission)} = {formatRupiah(r.commissionAmount)}
                </p>
              </>
            ) : (
              <p className="mt-1.5 text-[12px] leading-snug text-slate-500">Aktifkan simulasi komisi untuk melihat harga.</p>
            )}
          </div>
        </div>

        {/* Laba bersih */}
        <div
          className={cx(
            "flex items-center justify-between gap-3 rounded-xl p-3.5 ring-1",
            r.isThin ? "bg-rose-50 ring-rose-200" : "bg-white ring-slate-200",
          )}
        >
          <div>
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
              <TrendingUp className={cx("size-4", r.isThin ? "text-rose-600" : "text-emerald-600")} aria-hidden />
              Laba bersih per porsi
            </p>
            <p
              className={cx(
                "mt-1 text-2xl font-bold tracking-tight tabular-nums",
                r.isThin ? "text-rose-600" : "text-emerald-600",
              )}
            >
              {formatRupiah(r.profitOffline)}
            </p>
            {useOnline && (
              <p className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
                Via aplikasi: {formatRupiah(r.profitOnline)} setelah komisi
              </p>
            )}
          </div>
          <span
            className={cx(
              "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold tabular-nums",
              r.isThin ? "bg-rose-600 text-white" : "bg-emerald-600 text-white",
            )}
          >
            Margin {formatPercent(r.actualMarginOffline)}
          </span>
        </div>

        {r.isThin && (
          <div role="alert" className="flex gap-2.5 rounded-xl bg-rose-50 p-3 text-[12.5px] leading-relaxed text-rose-800 ring-1 ring-rose-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden />
            <p>
              <span className="font-semibold">Margin terlalu tipis (&lt;15%).</span> Kenaikan harga bahan sedikit saja
              bisa bikin rugi. Pertimbangkan naikkan margin atau tekan biaya bahan.
            </p>
          </div>
        )}

        {/* Chart */}
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h3 className="text-[13px] font-semibold text-slate-900">Proporsi harga jual</h3>
            <span className="text-[11px] text-slate-400">{useOnline ? "basis harga aplikasi" : "basis harga offline"}</span>
          </div>
          {hasData ? (
            <CostDonut segments={segments} total={chartPrice} centerLabel={useOnline ? "Harga app" : "Harga jual"} />
          ) : (
            <p className="py-6 text-center text-[12.5px] text-slate-400">Isi bahan baku untuk melihat grafik.</p>
          )}
        </div>

        {/* Per batch */}
        <dl className="grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 ring-1 ring-slate-200/70">
          {[
            ["Modal batch", r.batch.cost, "text-slate-900"],
            ["Omzet batch", r.batch.revenueOffline, "text-slate-900"],
            ["Laba batch", r.batch.profitOffline, r.isThin ? "text-rose-600" : "text-emerald-600"],
          ].map(([label, value, color]) => (
            <div key={label as string} className="px-3 text-center">
              <dt className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
              <dd className={cx("mt-0.5 text-[13px] font-bold tabular-nums", color as string)}>
                {formatRupiah(value as number)}
              </dd>
            </div>
          ))}
        </dl>

        <ResultActions getText={() => buildWhatsAppSummary(state, r)} onReset={onReset} />
      </div>
    </section>
  );
}
