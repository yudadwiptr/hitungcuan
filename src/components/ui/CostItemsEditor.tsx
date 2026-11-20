"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CostItem } from "@/lib/hpp";
import { MoneyInput, TextInput } from "./form";

/** Daftar biaya sederhana (nama + nominal) dengan quick-add saran. */
export function CostItemsEditor({
  idPrefix,
  items,
  suggestions = [],
  onAdd,
  onUpdate,
  onRemove,
}: {
  idPrefix: string;
  items: CostItem[];
  suggestions?: string[];
  onAdd: (name?: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<CostItem, "id">>) => void;
  onRemove: (id: string) => void;
}) {
  const existing = new Set(items.map((i) => i.name.trim().toLowerCase()));
  const available = suggestions.filter((s) => !existing.has(s.toLowerCase()));

  return (
    <div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center gap-2">
            <TextInput
              id={`${idPrefix}-${item.id}-name`}
              ariaLabel={`Nama biaya ${index + 1}`}
              value={item.name}
              onChange={(name) => onUpdate(item.id, { name })}
              placeholder="Nama biaya"
              className="flex-[1.4]"
            />
            <MoneyInput
              id={`${idPrefix}-${item.id}-amount`}
              ariaLabel={`Nominal ${item.name || `biaya ${index + 1}`}`}
              value={item.amount}
              onChange={(amount) => onUpdate(item.id, { amount })}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => onRemove(item.id)}
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
          onClick={() => onAdd()}
          className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[12px] font-medium text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-50"
        >
          <Plus className="size-3.5" aria-hidden /> Tambah biaya
        </button>
        {available.slice(0, 4).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onAdd(name)}
            className="rounded-md bg-white px-2 py-1 text-[12px] text-slate-500 ring-1 ring-slate-200 transition hover:text-slate-800 hover:ring-slate-300"
          >
            + {name}
          </button>
        ))}
      </div>
    </div>
  );
}
