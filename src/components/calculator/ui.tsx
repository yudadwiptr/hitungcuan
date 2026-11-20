"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { displayMoney, sanitizeDecimal, sanitizeMoney } from "@/lib/format";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const inputBase =
  "h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-[0_1px_0_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

/* ------------------------------------------------------------------ */
/* Kartu section                                                       */
/* ------------------------------------------------------------------ */

export function SectionCard({
  step,
  icon: Icon,
  title,
  description,
  action,
  children,
  id,
}: {
  step: number;
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id ?? `step-${step}`}-title`}
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="relative mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
            <Icon className="size-[18px]" aria-hidden />
            <span className="absolute -top-1.5 -right-1.5 grid size-4 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white tabular-nums">
              {step}
            </span>
          </span>
          <div className="min-w-0">
            <h2 id={`${id ?? `step-${step}`}-title`} className="text-[15px] font-semibold text-slate-900">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{description}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Field & input                                                       */
/* ------------------------------------------------------------------ */

export function FieldLabel({
  htmlFor,
  children,
  hint,
  className,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cx("mb-1.5 flex items-baseline justify-between gap-2", className)}>
      <span className="text-[12.5px] font-medium text-slate-700">{children}</span>
      {hint && <span className="text-[11.5px] text-slate-400">{hint}</span>}
    </label>
  );
}

type BaseInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
};

export function TextInput({ id, value, onChange, placeholder, className, ariaLabel }: BaseInputProps) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoComplete="off"
      className={cx(inputBase, className)}
    />
  );
}

/** Input nominal Rupiah: simpan digit mentah, tampilkan "12.500". */
export function MoneyInput({ id, value, onChange, placeholder = "0", className, ariaLabel }: BaseInputProps) {
  return (
    <div className={cx("relative", className)}>
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[13px] font-medium text-slate-400">
        Rp
      </span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={displayMoney(value)}
        onChange={(e) => onChange(sanitizeMoney(e.target.value))}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        className={cx(inputBase, "pl-9 text-right tabular-nums")}
      />
    </div>
  );
}

/** Input jumlah/takaran dengan suffix satuan (teks atau slot custom). */
export function DecimalInput({
  id,
  value,
  onChange,
  placeholder = "0",
  className,
  ariaLabel,
  suffix,
  suffixPad = "pr-9",
}: BaseInputProps & { suffix?: ReactNode; suffixPad?: string }) {
  return (
    <div className={cx("relative", className)}>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(sanitizeDecimal(e.target.value))}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        className={cx(inputBase, "tabular-nums", suffix ? suffixPad : "")}
      />
      {suffix && <div className="absolute inset-y-0 right-0 flex items-center">{suffix}</div>}
    </div>
  );
}

export function UnitSuffix({ children }: { children: ReactNode }) {
  return <span className="pointer-events-none pr-2.5 text-[12px] font-medium text-slate-400">{children}</span>;
}

/* ------------------------------------------------------------------ */
/* Kontrol                                                             */
/* ------------------------------------------------------------------ */

export function Switch({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20",
        checked ? "bg-emerald-600" : "bg-slate-300",
      )}
    >
      <span
        className={cx(
          "inline-block size-5 rounded-full bg-white shadow-sm ring-1 ring-slate-900/5 transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  label,
  tone = "emerald",
}: {
  value: T;
  options: { value: T; label: ReactNode; sub?: ReactNode }[];
  onChange: (v: T) => void;
  label: string;
  tone?: "emerald" | "amber";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full gap-1 rounded-xl bg-slate-100 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "flex flex-1 flex-col items-center justify-center rounded-lg px-2 py-1.5 text-[12.5px] font-medium transition focus-visible:outline-none focus-visible:ring-2",
              tone === "amber" ? "focus-visible:ring-amber-500/40" : "focus-visible:ring-emerald-500/40",
              active
                ? cx(
                    "bg-white shadow-sm ring-1 ring-slate-900/5",
                    tone === "amber" ? "text-amber-700" : "text-emerald-700",
                  )
                : "text-slate-600 hover:text-slate-900",
            )}
          >
            <span className="tabular-nums">{opt.label}</span>
            {opt.sub && <span className="text-[10.5px] font-normal text-slate-400">{opt.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function GhostButton({
  children,
  onClick,
  icon: Icon,
  className,
  ariaLabel,
}: {
  children?: ReactNode;
  onClick: () => void;
  icon?: LucideIcon;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30",
        className,
      )}
    >
      {Icon && <Icon className="size-4" aria-hidden />}
      {children}
    </button>
  );
}

export function AddRowButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-2.5 text-[13px] font-medium text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50/60 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/15"
    >
      <span className="grid size-5 place-items-center rounded-md bg-white text-base leading-none ring-1 ring-slate-200 transition group-hover:ring-emerald-300">
        +
      </span>
      {children}
    </button>
  );
}
