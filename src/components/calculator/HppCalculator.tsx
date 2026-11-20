"use client";

import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import { DEFAULT_STATE } from "@/lib/defaults";
import { calculate } from "@/lib/hpp";
import { IngredientsSection } from "./IngredientsSection";
import { MobileResultBar } from "./MobileResultBar";
import { OverheadSection } from "./OverheadSection";
import { PricingSection } from "./PricingSection";
import { ProductSection } from "./ProductSection";
import { STORAGE_KEY, parseStoredState, reducer } from "./state";
import { SummaryPanel } from "./SummaryPanel";

/**
 * Root kalkulator. Render awal selalu memakai DEFAULT_STATE (identik di server & client),
 * data tersimpan dari localStorage baru dimuat setelah mount → bebas hydration mismatch.
 */
export function HppCalculator({ belowResult, sidebarBottom }: { belowResult?: ReactNode; sidebarBottom?: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  useEffect(() => {
    try {
      const stored = parseStoredState(window.localStorage.getItem(STORAGE_KEY));
      if (stored) dispatch({ type: "hydrate", state: stored });
    } catch {
      // localStorage tidak tersedia (mode privat / diblokir) — pakai data contoh saja
    }
  }, []);

  useEffect(() => {
    // State awal (referensi DEFAULT_STATE) belum pernah diubah user → jangan timpa data tersimpan.
    // Aksi "reset" sengaja mengembalikan salinan, jadi tetap tersimpan.
    if (state === DEFAULT_STATE) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // abaikan kuota penuh / storage diblokir
    }
  }, [state]);

  const result = useMemo(() => calculate(state), [state]);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:gap-8">
        <div className="min-w-0 space-y-6">
          <ProductSection state={state} dispatch={dispatch} />
          <IngredientsSection state={state} result={result} dispatch={dispatch} />
          <OverheadSection state={state} result={result} dispatch={dispatch} />
          <PricingSection state={state} result={result} dispatch={dispatch} />
        </div>

        <aside className="flex min-w-0 flex-col gap-6" aria-label="Hasil perhitungan">
          <div className="flex-1">
            <div className="lg:sticky lg:top-20 lg:-mx-2 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:px-2 lg:pb-2 lg:[scrollbar-width:thin]">
              <SummaryPanel state={state} result={result} onReset={() => dispatch({ type: "reset" })} />
              <p className="mt-2.5 text-center text-[11.5px] text-slate-400">
                Data tersimpan otomatis di browser ini — tidak dikirim ke server.
              </p>
            </div>
          </div>
          {belowResult}
          {sidebarBottom}
        </aside>
      </div>

      <MobileResultBar result={result} />
    </>
  );
}
