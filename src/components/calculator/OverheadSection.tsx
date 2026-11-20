"use client";

import { Package, Plus, Trash2, Zap, type LucideIcon } from "lucide-react";
import type { Dispatch } from "react";
import { OPERATIONAL_SUGGESTIONS, PACKAGING_SUGGESTIONS } from "@/lib/defaults";
import { formatRupiah } from "@/lib/format";
import type { CalcResult, CalcState, CostListKey } from "@/lib/hpp";
import { makeId, type Action } from "./state";
import { MoneyInput, SectionCard, TextInput } from "@/components/ui/form";

function CostList({
  list,
  title,
  icon: Icon,
  hint,
  total,
  suggestions,
  state,
  dispatch,
}: {
  list: CostListKey;
  title: string;
  icon: LucideIcon;
  hint: string;
  total: number;
  suggestions: string[];
  state: CalcState;
  dispatch: Dispatch<Action>;
}) {
  const items = state[list];
  const existing = new Set(items.map((i) => i.name.trim().toLowerCase()));
  const available = suggestions.filter((s) => !existing.has(s.toLowerCase()));

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/40 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-white text-slate-600 ring-1 ring-slate-200">
            <Icon className="size-3.5" aria-hidden />
          </span>
          <div>
            <h3 className="text-[13.5px] font-semibold text-slate-900">{title}</h3>
            <p className="text-[11.5px] text-slate-400">{hint}</p>
          </div>
        </div>
        <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[12.5px] font-semibold text-amber-700 ring-1 ring-amber-600/15 tabular-nums">
          {formatRupiah(total)}
        </span>
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            <TextInput
              id={`${list}-${item.id}-name`}
              ariaLabel={`Nama biaya ${index + 1}`}
              value={item.name}
              onChange={(name) => dispatch({ type: "updateCost", list, id: item.id, patch: { name } })}
              placeholder="Nama biaya"
              className="flex-[1.3]"
            />
            <MoneyInput
              id={`${list}-${item.id}-amount`}
              ariaLabel={`Biaya ${item.name || index + 1} per porsi`}
              value={item.amount}
              onChange={(amount) => dispatch({ type: "updateCost", list, id: item.id, patch: { amount } })}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => dispatch({ type: "removeCost", list, id: item.id })}
              aria-label={`Hapus ${item.name || `biaya ${index + 1}`}`}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => dispatch({ type: "addCost", list, id: makeId(list) })}
          className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[12px] font-medium text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
        >
          <Plus className="size-3.5" aria-hidden /> Tambah
        </button>
        {available.slice(0, 4).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => dispatch({ type: "addCost", list, id: makeId(list), name })}
            className="rounded-md bg-white px-2 py-1 text-[12px] text-slate-500 ring-1 ring-slate-200 transition hover:text-slate-800 hover:ring-slate-300"
          >
            + {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function OverheadSection({
  state,
  result,
  dispatch,
}: {
  state: CalcState;
  result: CalcResult;
  dispatch: Dispatch<Action>;
}) {
  return (
    <SectionCard
      step={3}
      id="overhead"
      icon={Package}
      title="Biaya Kemasan & Operasional"
      description="Semua nominal dihitung per porsi. Bagi biaya bulanan dengan estimasi porsi terjual per bulan."
    >
      <div className="@container">
      <div className="grid gap-4 @xl:grid-cols-2">
        <CostList
          list="packaging"
          title="Kemasan"
          icon={Package}
          hint="Cup, sedotan, plastik, stiker"
          total={result.packagingTotal}
          suggestions={PACKAGING_SUGGESTIONS}
          state={state}
          dispatch={dispatch}
        />
        <CostList
          list="operational"
          title="Operasional"
          icon={Zap}
          hint="Gas, listrik, tenaga kerja"
          total={result.operationalTotal}
          suggestions={OPERATIONAL_SUGGESTIONS}
          state={state}
          dispatch={dispatch}
        />
      </div>
      </div>
    </SectionCard>
  );
}
