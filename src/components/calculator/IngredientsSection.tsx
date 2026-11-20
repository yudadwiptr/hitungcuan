"use client";

import { Trash2, Wheat } from "lucide-react";
import type { Dispatch } from "react";
import { formatNumber, formatRupiah } from "@/lib/format";
import { UNITS, type CalcResult, type CalcState, type Ingredient, type Unit } from "@/lib/hpp";
import { makeId, type Action } from "./state";
import { AddRowButton, DecimalInput, MoneyInput, SectionCard, Select, TextInput, UnitSuffix, cx } from "@/components/ui/form";

const GRID =
  "grid grid-cols-6 gap-x-2.5 gap-y-2.5 @xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,1.45fr)_minmax(0,1.05fr)_minmax(0,0.95fr)_2.25rem] @xl:items-start @xl:gap-y-0";

const cellLabel = "mb-1 block text-[11.5px] font-medium text-slate-500 @xl:sr-only";

export function IngredientsSection({
  state,
  result,
  dispatch,
}: {
  state: CalcState;
  result: CalcResult;
  dispatch: Dispatch<Action>;
}) {
  const update = (id: string, patch: Partial<Omit<Ingredient, "id">>) =>
    dispatch({ type: "updateIngredient", id, patch });

  return (
    <SectionCard
      step={2}
      id="bahan-baku"
      icon={Wheat}
      title="Rincian Bahan Baku"
      description="Masukkan harga beli per kemasan & takaran per porsi — biaya per porsi dihitung otomatis."
      action={
        <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-emerald-50 py-1.5 pr-3.5 pl-3 ring-1 ring-emerald-600/15">
          <span className="text-[11.5px] font-medium text-emerald-700/80">Total/porsi</span>
          <span className="text-[14px] font-bold text-emerald-800 tabular-nums">{formatRupiah(result.ingredientsTotal)}</span>
        </div>
      }
    >
      <div className="@container">
        {/* Header tabel (hanya di container lebar) */}
        <div
          aria-hidden
          className={cx(
            GRID,
            "mb-2 hidden px-1 text-[11.5px] font-medium uppercase tracking-wide text-slate-400 @xl:grid",
          )}
        >
          <span>Nama bahan</span>
          <span>Harga beli</span>
          <span>Isi kemasan</span>
          <span>Takaran/porsi</span>
          <span className="text-right">Biaya/porsi</span>
          <span />
        </div>

        <ul className="space-y-3 @xl:space-y-2">
          {state.ingredients.map((ing, index) => {
            const r = result.ingredients[index];
            const base = `ing-${ing.id}`;
            const unitLabel = ing.unit === "gram" ? "g" : ing.unit;
            return (
              <li
                key={ing.id}
                className="rounded-xl border border-slate-200 bg-slate-50/40 p-3 @xl:border-transparent @xl:bg-transparent @xl:p-1 @xl:hover:bg-slate-50"
              >
                <div className={GRID}>
                  <div className="order-1 col-span-5 @xl:col-span-1">
                    <label htmlFor={`${base}-name`} className={cellLabel}>
                      Nama bahan
                    </label>
                    <TextInput
                      id={`${base}-name`}
                      value={ing.name}
                      onChange={(name) => update(ing.id, { name })}
                      placeholder={`Bahan ${index + 1}`}
                    />
                  </div>

                  <div className="order-2 col-span-1 flex items-end justify-end @xl:order-6 @xl:items-center @xl:justify-center">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "removeIngredient", id: ing.id })}
                      aria-label={`Hapus ${ing.name || `bahan ${index + 1}`}`}
                      className="grid size-10 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30 @xl:size-9"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>

                  <div className="order-3 col-span-3 @xl:col-span-1">
                    <label htmlFor={`${base}-price`} className={cellLabel}>
                      Harga beli
                    </label>
                    <MoneyInput id={`${base}-price`} value={ing.price} onChange={(price) => update(ing.id, { price })} />
                  </div>

                  <div className="order-4 col-span-3 @xl:col-span-1">
                    <label htmlFor={`${base}-pack`} className={cellLabel}>
                      Isi kemasan
                    </label>
                    <DecimalInput
                      id={`${base}-pack`}
                      value={ing.packSize}
                      onChange={(packSize) => update(ing.id, { packSize })}
                      placeholder="1000"
                      suffixPad="pr-16"
                      suffix={
                        <Select
                          ariaLabel="Satuan kemasan"
                          value={ing.unit}
                          options={UNITS}
                          onChange={(unit: Unit) => update(ing.id, { unit })}
                          className="mr-1.5"
                        />
                      }
                    />
                  </div>

                  <div className="order-5 col-span-3 @xl:col-span-1">
                    <label htmlFor={`${base}-dose`} className={cellLabel}>
                      Takaran/porsi
                    </label>
                    <DecimalInput
                      id={`${base}-dose`}
                      value={ing.dose}
                      onChange={(dose) => update(ing.id, { dose })}
                      placeholder="0"
                      suffix={<UnitSuffix>{unitLabel}</UnitSuffix>}
                    />
                  </div>

                  <div className="order-6 col-span-3 flex flex-col items-end justify-center rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200 @xl:order-5 @xl:col-span-1 @xl:h-10 @xl:bg-transparent @xl:px-0 @xl:ring-0">
                    <span className="text-[11px] text-slate-400 @xl:sr-only">Biaya/porsi</span>
                    <span
                      className={cx(
                        "text-sm font-semibold tabular-nums",
                        r?.valid ? "text-slate-900" : "text-slate-300",
                      )}
                    >
                      {formatRupiah(r?.costPerPortion ?? 0)}
                    </span>
                    {r?.valid && result.portions > 1 && (
                      <span className="text-[10.5px] text-slate-400 tabular-nums">
                        {formatNumber(r.needPerBatch)} {unitLabel}/batch
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {state.ingredients.length === 0 && (
          <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            Belum ada bahan. Tambahkan minimal satu bahan baku.
          </p>
        )}

        <div className="mt-3">
          <AddRowButton onClick={() => dispatch({ type: "addIngredient", id: makeId("ing") })}>
            Tambah bahan baku
          </AddRowButton>
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
          Rumus: <span className="font-medium text-slate-500">(Harga beli ÷ Isi kemasan) × Takaran</span>. Tulis
          desimal pakai koma, mis. <span className="tabular-nums">0,5</span> pcs.
        </p>
      </div>
    </SectionCard>
  );
}
