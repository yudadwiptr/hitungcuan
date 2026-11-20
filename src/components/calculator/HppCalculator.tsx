"use client";

import { useMemo, type ReactNode } from "react";
import { CalculatorLayout } from "@/components/ui/CalculatorLayout";
import { MobileResultBar } from "@/components/ui/MobileResultBar";
import { usePersistedReducer } from "@/components/ui/usePersistedReducer";
import { DEFAULT_STATE } from "@/lib/defaults";
import { formatRupiah } from "@/lib/format";
import { calculate } from "@/lib/hpp";
import { IngredientsSection } from "./IngredientsSection";
import { OverheadSection } from "./OverheadSection";
import { PricingSection } from "./PricingSection";
import { ProductSection } from "./ProductSection";
import { STORAGE_KEY, parseStoredState, reducer } from "./state";
import { SummaryPanel } from "./SummaryPanel";

export function HppCalculator({ belowResult, sidebarBottom }: { belowResult?: ReactNode; sidebarBottom?: ReactNode }) {
  const [state, dispatch] = usePersistedReducer(STORAGE_KEY, reducer, DEFAULT_STATE, parseStoredState);
  const result = useMemo(() => calculate(state), [state]);

  return (
    <CalculatorLayout
      inputs={
        <>
          <ProductSection state={state} dispatch={dispatch} />
          <IngredientsSection state={state} result={result} dispatch={dispatch} />
          <OverheadSection state={state} result={result} dispatch={dispatch} />
          <PricingSection state={state} result={result} dispatch={dispatch} />
        </>
      }
      result={<SummaryPanel state={state} result={result} onReset={() => dispatch({ type: "reset" })} />}
      belowResult={belowResult}
      sidebarBottom={sidebarBottom}
      footer={
        <MobileResultBar
          items={[
            { label: "HPP / porsi", value: formatRupiah(result.hpp) },
            { label: "Harga jual", value: formatRupiah(result.offlinePrice), tone: "emerald" },
          ]}
        />
      }
    />
  );
}
