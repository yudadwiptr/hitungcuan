"use client";

import { AlertTriangle, BadgePercent, Check, Package, ShoppingBag, SlidersHorizontal, TrendingUp } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { ResultActions } from "@/components/ui/actions";
import { CalculatorLayout } from "@/components/ui/CalculatorLayout";
import { CostDonut } from "@/components/ui/CostDonut";
import { CostItemsEditor } from "@/components/ui/CostItemsEditor";
import { DecimalInput, FieldLabel, MoneyInput, SectionCard, Segmented, Slider, TextInput, UnitSuffix, cx } from "@/components/ui/form";
import { MobileResultBar } from "@/components/ui/MobileResultBar";
import { usePersistedReducer } from "@/components/ui/usePersistedReducer";
import { makeId } from "@/components/calculator/state";
import { formatPercent, formatRupiah } from "@/lib/format";
import type { RoundingStep } from "@/lib/hpp";
import {
  EXTRA_SUGGESTIONS,
  MARKET_DEFAULT,
  MARKET_MARGIN_MAX,
  MARKET_MARGIN_MIN,
  PLATFORM_PRESETS,
  calculateMarket,
  marketWhatsApp,
  parseMarketState,
  type MarketResult,
  type MarketState,
  type PlatformId,
} from "@/lib/marketplace";

type Action = { type: "patch"; patch: Partial<MarketState> } | { type: "reset" };

function reducer(state: MarketState, action: Action): MarketState {
  if (action.type === "reset") return structuredClone(MARKET_DEFAULT);
  return { ...state, ...action.patch };
}

const STORAGE_KEY = "hitungcuan:marketplace:v1";

const ROUNDING: { value: RoundingStep; label: string }[] = [
  { value: 0, label: "Tanpa" },
  { value: 100, label: "100" },
  { value: 500, label: "500" },
  { value: 1000, label: "1.000" },
];

const COLORS = { buy: "#1E293B", extra: "#94A3B8", fee: "#D97706", profit: "#059669" };

export function MarketplaceCalculator({ sidebarBottom }: { sidebarBottom?: ReactNode }) {
  const [state, dispatch] = usePersistedReducer(STORAGE_KEY, reducer, MARKET_DEFAULT, parseMarketState);
  const r = useMemo(() => calculateMarket(state), [state]);
  const patch = (p: Partial<MarketState>) => dispatch({ type: "patch", patch: p });

  const choosePlatform = (id: PlatformId) => {
    const preset = PLATFORM_PRESETS.find((p) => p.id === id);
    if (!preset) return patch({ platform: "custom" });
    patch({
      platform: id,
      adminPct: String(preset.adminPct),
      servicePct: String(preset.servicePct),
      fixedFee: String(preset.fixedFee),
      ...(id === "social" ? { discountPct: "0" } : {}),
    });
  };

  return (
    <CalculatorLayout
      inputs={
        <>
          {/* 1. Produk & modal */}
          <SectionCard
            step={1}
            id="produk"
            icon={Package}
            title="Produk & Modal"
            description="Harga beli dari supplier plus biaya kecil per unit yang sering terlupa."
            action={
              <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-emerald-50 py-1.5 pr-3.5 pl-3 ring-1 ring-emerald-600/15">
                <span className="text-[11.5px] font-medium text-emerald-700/80">Modal/unit</span>
                <span className="text-[14px] font-bold text-emerald-800 tabular-nums">{formatRupiah(r.cost)}</span>
              </div>
            }
          >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div>
                <FieldLabel htmlFor="mp-name">Nama produk</FieldLabel>
                <TextInput id="mp-name" value={state.productName} onChange={(v) => patch({ productName: v })} placeholder="cth. Tumbler Stainless" />
              </div>
              <div>
                <FieldLabel htmlFor="mp-buy">Harga beli / modal per unit</FieldLabel>
                <MoneyInput id="mp-buy" value={state.buyPrice} onChange={(v) => patch({ buyPrice: v })} />
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-slate-900">Biaya tambahan per unit</p>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[12.5px] font-semibold text-amber-700 ring-1 ring-amber-600/15 tabular-nums">
                  {formatRupiah(r.extrasTotal)}
                </span>
              </div>
              <CostItemsEditor
                idPrefix="mp-extra"
                items={state.extras}
                suggestions={EXTRA_SUGGESTIONS}
                onAdd={(name) => patch({ extras: [...state.extras, { id: makeId("ext"), name: name ?? "", amount: "" }] })}
                onUpdate={(id, p) => patch({ extras: state.extras.map((e) => (e.id === id ? { ...e, ...p } : e)) })}
                onRemove={(id) => patch({ extras: state.extras.filter((e) => e.id !== id) })}
              />
            </div>
          </SectionCard>

          {/* 2. Platform */}
          <SectionCard
            step={2}
            id="platform"
            icon={ShoppingBag}
            title="Platform & Potongan"
            description="Pilih tempat jualan. Tarif terisi otomatis (estimasi) dan bisa kamu sesuaikan."
          >
            <div role="radiogroup" aria-label="Platform jualan" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[...PLATFORM_PRESETS, null].map((p) => {
                const id: PlatformId = p?.id ?? "custom";
                const active = state.platform === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => choosePlatform(id)}
                    className={cx(
                      "relative rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15",
                      active ? "border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500" : "border-slate-200 bg-white hover:border-slate-300",
                    )}
                  >
                    {active && (
                      <span className="absolute top-2.5 right-2.5 grid size-4 place-items-center rounded-full bg-emerald-600 text-white">
                        <Check className="size-3" aria-hidden />
                      </span>
                    )}
                    <span className="block pr-5 text-[13px] font-semibold text-slate-900">{p?.name ?? "Custom"}</span>
                    <span className="mt-0.5 block text-[11.5px] text-slate-500 tabular-nums">
                      {p ? (p.adminPct + p.servicePct > 0 ? `± ${String(p.adminPct + p.servicePct).replace(".", ",")}% + ${formatRupiah(p.fixedFee)}` : "Tanpa potongan") : "Atur tarif sendiri"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <FieldLabel htmlFor="mp-admin">Biaya admin</FieldLabel>
                <DecimalInput id="mp-admin" value={state.adminPct} onChange={(v) => patch({ adminPct: v, platform: "custom" })} suffix={<UnitSuffix>%</UnitSuffix>} />
              </div>
              <div>
                <FieldLabel htmlFor="mp-service">Biaya layanan/program</FieldLabel>
                <DecimalInput id="mp-service" value={state.servicePct} onChange={(v) => patch({ servicePct: v, platform: "custom" })} suffix={<UnitSuffix>%</UnitSuffix>} />
              </div>
              <div>
                <FieldLabel htmlFor="mp-fixed">Biaya per pesanan</FieldLabel>
                <MoneyInput id="mp-fixed" value={state.fixedFee} onChange={(v) => patch({ fixedFee: v, platform: "custom" })} />
              </div>
              <div>
                <FieldLabel htmlFor="mp-discount">Voucher/diskon toko</FieldLabel>
                <DecimalInput id="mp-discount" value={state.discountPct} onChange={(v) => patch({ discountPct: v })} suffix={<UnitSuffix>%</UnitSuffix>} />
              </div>
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-slate-400">
              Tarif marketplace berbeda per kategori, status toko (Star/Mall/Official), & program yang diikuti — dan sering
              berubah. Cek angka terbaru di Seller Center kamu.
            </p>
          </SectionCard>

          {/* 3. Margin */}
          <SectionCard
            step={3}
            id="margin"
            icon={SlidersHorizontal}
            title="Target Margin & Volume"
            description="Margin dihitung dari harga yang dibayar pembeli, setelah semua potongan."
          >
            <div className="flex items-end justify-between gap-4">
              <label htmlFor="mp-margin" className="text-[13px] font-medium text-slate-700">
                Target margin laba bersih
                <span className="mt-0.5 block text-[11.5px] font-normal text-slate-400">Reseller umumnya 10–30%</span>
              </label>
              <output htmlFor="mp-margin" className={cx("text-3xl font-bold tracking-tight tabular-nums", state.marginPct < 10 ? "text-rose-600" : "text-emerald-600")}>
                {state.marginPct}
                <span className="text-lg font-semibold">%</span>
              </output>
            </div>
            <Slider
              id="mp-margin"
              className="mt-4"
              min={MARKET_MARGIN_MIN}
              max={MARKET_MARGIN_MAX}
              value={state.marginPct}
              onChange={(v) => patch({ marginPct: v })}
              danger={state.marginPct < 10}
              valueText={`${state.marginPct} persen`}
            />
            <div className="mt-1 flex justify-between text-[11px] text-slate-400 tabular-nums">
              <span>{MARKET_MARGIN_MIN}%</span>
              <span className="text-rose-500/80">← tipis &lt;10%</span>
              <span>{MARKET_MARGIN_MAX}%</span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[13px] font-medium text-slate-700">Pembulatan harga ke atas</p>
                <Segmented label="Pembulatan harga" value={state.rounding} options={ROUNDING} onChange={(v) => patch({ rounding: v })} />
              </div>
              <div>
                <FieldLabel htmlFor="mp-units" hint="opsional">
                  Target terjual per bulan
                </FieldLabel>
                <DecimalInput
                  id="mp-units"
                  value={state.monthlyUnits}
                  onChange={(v) => patch({ monthlyUnits: v.replace(/[.,]/g, "") })}
                  suffixPad="pr-12"
                  suffix={<UnitSuffix>unit</UnitSuffix>}
                />
              </div>
            </div>
          </SectionCard>
        </>
      }
      result={<MarketSummary state={state} r={r} onReset={() => dispatch({ type: "reset" })} />}
      sidebarBottom={sidebarBottom}
      footer={
        <MobileResultBar
          items={[
            { label: "Modal/unit", value: formatRupiah(r.cost) },
            { label: "Harga tayang", value: formatRupiah(r.listPrice), tone: "emerald" },
          ]}
        />
      }
    />
  );
}

function MarketSummary({ state, r, onReset }: { state: MarketState; r: MarketResult; onReset: () => void }) {
  const platformName = PLATFORM_PRESETS.find((p) => p.id === state.platform)?.name ?? "Custom";
  const invalid = r.cost > 0 && !r.valid;

  return (
    <section
      id="hasil"
      aria-labelledby="hasil-title"
      className="scroll-mt-32 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] md:scroll-mt-20"
    >
      <div className="relative overflow-hidden bg-slate-900 px-5 pt-5 pb-5 text-white sm:px-6">
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id="hasil-title" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
              Harga tayang rekomendasi
            </h2>
            <p className="mt-1 truncate text-[15px] font-semibold">{state.productName.trim() || "Produk tanpa nama"}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-white/15">
            {platformName}
          </span>
        </div>
        <p className="relative mt-5 text-[34px] leading-none font-bold tracking-tight tabular-nums" aria-live="polite">
          {invalid ? "—" : formatRupiah(r.listPrice)}
        </p>
        <dl className="relative mt-4 grid grid-cols-3 gap-2 text-[11.5px]">
          {[
            ["Modal", r.cost],
            ["Potongan", r.platformFee],
            ["Diterima", r.received],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg bg-white/[0.06] px-2.5 py-2 ring-1 ring-white/10">
              <dt className="text-slate-400">{label}</dt>
              <dd className="mt-0.5 font-semibold text-slate-100 tabular-nums">{formatRupiah(value as number)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        {invalid ? (
          <div role="alert" className="flex gap-2.5 rounded-xl bg-rose-50 p-3 text-[12.5px] leading-relaxed text-rose-800 ring-1 ring-rose-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rose-600" aria-hidden />
            <p>
              <span className="font-semibold">Margin + potongan platform ≥ 100%.</span> Turunkan target margin atau cek
              lagi persentase biaya.
            </p>
          </div>
        ) : (
          <>
            <div className={cx("flex items-center justify-between gap-3 rounded-xl p-3.5 ring-1", r.isThin ? "bg-rose-50 ring-rose-200" : "bg-white ring-slate-200")}>
              <div>
                <p className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600">
                  <TrendingUp className={cx("size-4", r.isThin ? "text-rose-600" : "text-emerald-600")} aria-hidden />
                  Laba bersih per unit
                </p>
                <p className={cx("mt-1 text-2xl font-bold tracking-tight tabular-nums", r.isThin ? "text-rose-600" : "text-emerald-600")}>
                  {formatRupiah(r.profit)}
                </p>
                {r.discount > 0 && (
                  <p className="mt-0.5 text-[11px] text-slate-500 tabular-nums">
                    Pembeli bayar {formatRupiah(r.paidPrice)} setelah diskon {formatPercent(r.discount)}
                  </p>
                )}
              </div>
              <span className={cx("shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold text-white tabular-nums", r.isThin ? "bg-rose-600" : "bg-emerald-600")}>
                Margin {formatPercent(r.margin)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl bg-amber-50/70 px-3.5 py-3 ring-1 ring-amber-200">
              <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-amber-900">
                <BadgePercent className="size-4 text-amber-600" aria-hidden /> Harga minimum balik modal
              </p>
              <p className="text-[15px] font-bold text-amber-700 tabular-nums">{formatRupiah(r.breakEvenList)}</p>
            </div>

            {r.cost > 0 && (
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-semibold text-slate-900">Ke mana uang pembeli pergi</h3>
                </div>
                <CostDonut
                  centerLabel="Dibayar"
                  total={r.paidPrice}
                  segments={[
                    { key: "buy", label: "Harga beli", value: r.buy, color: COLORS.buy },
                    { key: "ext", label: "Biaya tambahan", value: r.extrasTotal, color: COLORS.extra },
                    { key: "fee", label: "Potongan platform", value: r.platformFee, color: COLORS.fee },
                    { key: "pro", label: "Laba bersih", value: Math.max(r.profit, 0), color: COLORS.profit },
                  ]}
                />
              </div>
            )}

            {r.units > 0 && (
              <dl className="grid grid-cols-2 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 ring-1 ring-slate-200/70">
                <div className="px-3 text-center">
                  <dt className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">Omzet/bulan</dt>
                  <dd className="mt-0.5 text-[14px] font-bold text-slate-900 tabular-nums">{formatRupiah(r.monthlyRevenue)}</dd>
                </div>
                <div className="px-3 text-center">
                  <dt className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">Laba/bulan</dt>
                  <dd className={cx("mt-0.5 text-[14px] font-bold tabular-nums", r.isThin ? "text-rose-600" : "text-emerald-600")}>
                    {formatRupiah(r.monthlyProfit)}
                  </dd>
                </div>
              </dl>
            )}
          </>
        )}

        {/* Perbandingan platform */}
        {r.cost > 0 && (
          <div className="rounded-xl border border-slate-200">
            <h3 className="border-b border-slate-100 px-4 py-2.5 text-[13px] font-semibold text-slate-900">
              Bandingkan antar platform
              <span className="ml-1 font-normal text-slate-400">· margin {formatPercent(r.targetMargin, 0)}</span>
            </h3>
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="text-[10.5px] uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-2 text-left font-medium">Platform</th>
                  <th className="px-2 py-2 text-right font-medium">Harga</th>
                  <th className="px-4 py-2 text-right font-medium">Laba</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {r.comparison.map((c) => (
                  <tr key={c.id} className={cx("border-t border-slate-100", state.platform === c.id && "bg-emerald-50/60")}>
                    <td className="px-4 py-2 font-medium text-slate-700">
                      {c.name}
                      {state.platform === c.id && <span className="ml-1.5 text-[10px] font-semibold text-emerald-600">dipilih</span>}
                    </td>
                    <td className="px-2 py-2 text-right font-semibold text-slate-900">{c.valid ? formatRupiah(c.listPrice) : "—"}</td>
                    <td className="px-4 py-2 text-right text-emerald-700">{c.valid ? formatRupiah(c.profit) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ResultActions getText={() => marketWhatsApp(state, r)} onReset={onReset} />
      </div>
    </section>
  );
}
