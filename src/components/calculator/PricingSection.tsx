"use client";

import { Bike, Info, SlidersHorizontal, Store } from "lucide-react";
import type { CSSProperties, Dispatch } from "react";
import { formatPercent } from "@/lib/format";
import {
  MARGIN_MAX,
  MARGIN_MIN,
  OJOL_COMMISSION,
  THIN_MARGIN,
  type CalcResult,
  type CalcState,
  type CommissionPreset,
  type RoundingStep,
} from "@/lib/hpp";
import type { Action } from "./state";
import { DecimalInput, Segmented, SectionCard, Switch, UnitSuffix, cx } from "@/components/ui/form";

const MARGIN_MARKS = [20, 30, 35, 50, 60];

const ROUNDING_OPTIONS: { value: RoundingStep; label: string }[] = [
  { value: 0, label: "Tanpa" },
  { value: 100, label: "100" },
  { value: 500, label: "500" },
  { value: 1000, label: "1.000" },
];

const COMMISSION_OPTIONS: { value: CommissionPreset; label: string; sub: string }[] = [
  { value: "dinein", label: "0%", sub: "Dine-in" },
  { value: "ojol", label: `${OJOL_COMMISSION}%`, sub: "Ojol standar" },
  { value: "custom", label: "Custom", sub: "Atur sendiri" },
];

export function PricingSection({
  state,
  result,
  dispatch,
}: {
  state: CalcState;
  result: CalcResult;
  dispatch: Dispatch<Action>;
}) {
  const thin = state.marginPct / 100 < THIN_MARGIN;
  const fill = ((state.marginPct - MARGIN_MIN) / (MARGIN_MAX - MARGIN_MIN)) * 100;

  return (
    <SectionCard
      step={4}
      id="margin"
      icon={SlidersHorizontal}
      title="Simulasi Margin & Harga Jual"
      description="Geser target margin laba bersih, lalu simulasikan potongan komisi aplikasi online."
    >
      {/* Margin slider */}
      <div>
        <div className="flex items-end justify-between gap-4">
          <label htmlFor="margin" className="text-[13px] font-medium text-slate-700">
            Target margin laba bersih
            <span className="mt-0.5 block text-[11.5px] font-normal text-slate-400">
              Persentase dari harga jual · setara markup {formatPercent(result.markup, 0)} dari HPP
            </span>
          </label>
          <output
            htmlFor="margin"
            className={cx(
              "text-3xl font-bold tracking-tight tabular-nums",
              thin ? "text-rose-600" : "text-emerald-600",
            )}
          >
            {state.marginPct}
            <span className="text-lg font-semibold">%</span>
          </output>
        </div>

        <input
          id="margin"
          type="range"
          min={MARGIN_MIN}
          max={MARGIN_MAX}
          step={1}
          value={state.marginPct}
          onChange={(e) => dispatch({ type: "setMargin", value: Number(e.target.value) })}
          className={cx("hc-range mt-4", thin && "hc-range--thin")}
          style={{ "--fill": `${fill}%` } as CSSProperties}
          aria-valuetext={`${state.marginPct} persen`}
        />
        <div className="mt-1 flex justify-between text-[11px] text-slate-400 tabular-nums">
          <span>{MARGIN_MIN}%</span>
          <span className="text-rose-500/80">← tipis &lt;15%</span>
          <span>{MARGIN_MAX}%</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {MARGIN_MARKS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => dispatch({ type: "setMargin", value: m })}
              className={cx(
                "rounded-md px-2.5 py-1 text-[12px] font-medium tabular-nums ring-1 transition",
                state.marginPct === m
                  ? "bg-emerald-600 text-white ring-emerald-600"
                  : "bg-white text-slate-600 ring-slate-200 hover:ring-slate-300",
              )}
            >
              {m}%
            </button>
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-slate-100" />

      {/* Pembulatan */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
            <Store className="size-4 text-slate-400" aria-hidden /> Pembulatan harga ke atas
          </p>
          <Segmented
            label="Pembulatan harga"
            value={state.rounding}
            options={ROUNDING_OPTIONS}
            onChange={(value) => dispatch({ type: "setRounding", value })}
          />
          <p className="mt-2 text-[11.5px] leading-relaxed text-slate-400">
            Harga bulat (mis. Rp 15.000) lebih mudah diingat & mempercepat kembalian.
          </p>
        </div>

        {/* Komisi ojol */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="online-toggle" className="flex items-center gap-1.5 text-[13px] font-medium text-slate-700">
              <Bike className="size-4 text-slate-400" aria-hidden /> Komisi aplikasi online
            </label>
            <Switch
              id="online-toggle"
              label="Aktifkan simulasi komisi aplikasi online"
              checked={state.onlineEnabled}
              onChange={(value) => dispatch({ type: "setOnline", value })}
            />
          </div>

          <div className={cx("transition", !state.onlineEnabled && "pointer-events-none opacity-40")} aria-disabled={!state.onlineEnabled}>
            <Segmented
              label="Preset komisi"
              tone="amber"
              value={state.commissionPreset}
              options={COMMISSION_OPTIONS}
              onChange={(value) => dispatch({ type: "setCommissionPreset", value })}
            />
            {state.commissionPreset === "custom" && (
              <div className="mt-2">
                <DecimalInput
                  id="custom-commission"
                  ariaLabel="Persentase komisi custom"
                  value={state.customCommission}
                  onChange={(value) => dispatch({ type: "setCustomCommission", value })}
                  placeholder="25"
                  suffix={<UnitSuffix>%</UnitSuffix>}
                />
              </div>
            )}
            <p className="mt-2 text-[11.5px] leading-relaxed text-slate-400">
              GoFood, GrabFood & ShopeeFood umumnya memotong ±20% + PPN. Cek kontrak merchant kamu.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2.5 rounded-xl bg-slate-50 p-3.5 text-[12.5px] leading-relaxed text-slate-600 ring-1 ring-slate-200/70">
        <Info className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
        <p>
          <span className="font-semibold text-slate-800">Harga online = Harga offline ÷ (1 − komisi).</span> Dengan
          markup ini, setelah aplikasi memotong komisinya, uang yang masuk ke kamu tetap sama seperti jualan offline —
          laba bersih utuh.
        </p>
      </div>
    </SectionCard>
  );
}
