"use client";

import { Eraser, UtensilsCrossed } from "lucide-react";
import type { Dispatch } from "react";
import type { CalcState } from "@/lib/hpp";
import type { Action } from "./state";
import { DecimalInput, FieldLabel, GhostButton, SectionCard, TextInput, UnitSuffix } from "./ui";

const QUICK_BATCH = ["1", "10", "25", "50"];

export function ProductSection({ state, dispatch }: { state: CalcState; dispatch: Dispatch<Action> }) {
  return (
    <SectionCard
      step={1}
      id="produk"
      icon={UtensilsCrossed}
      title="Identitas Produk & Batch"
      description="Nama menu dan berapa porsi yang kamu buat dalam sekali produksi."
      action={
        <GhostButton icon={Eraser} onClick={() => dispatch({ type: "clear" })}>
          Mulai dari kosong
        </GhostButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <FieldLabel htmlFor="product-name">Nama menu</FieldLabel>
          <TextInput
            id="product-name"
            value={state.productName}
            onChange={(value) => dispatch({ type: "setProductName", value })}
            placeholder="cth. Es Kopi Susu Gula Aren"
          />
        </div>
        <div>
          <FieldLabel htmlFor="batch-size">
            Porsi per batch
          </FieldLabel>
          <DecimalInput
            id="batch-size"
            value={state.batchSize}
            onChange={(value) => dispatch({ type: "setBatchSize", value: value.replace(/[.,]/g, "") })}
            placeholder="10"
            suffixPad="pr-14"
            suffix={<UnitSuffix>porsi</UnitSuffix>}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK_BATCH.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => dispatch({ type: "setBatchSize", value: n })}
                className={
                  "rounded-md px-2 py-0.5 text-[11.5px] font-medium tabular-nums ring-1 transition " +
                  (state.batchSize === n
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-white text-slate-500 ring-slate-200 hover:text-slate-800 hover:ring-slate-300")
                }
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
