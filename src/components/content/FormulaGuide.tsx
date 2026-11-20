import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Notasi rumus: istilah (chip), variabel, operator, pecahan, pangkat  */
/* ------------------------------------------------------------------ */

/** Istilah berupa kata, mis. "Harga beli" — tampil sebagai chip agar mudah dibaca. */
export function Term({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={
        "inline-block whitespace-nowrap rounded-md px-1.5 py-0.5 text-[12.5px] leading-5 font-semibold ring-1 " +
        (accent ? "bg-emerald-50 text-emerald-800 ring-emerald-600/20" : "bg-white text-slate-700 ring-slate-200")
      }
    >
      {children}
    </span>
  );
}

/** Variabel matematika satu huruf, mis. P, r, n. */
export function Var({ children }: { children: ReactNode }) {
  return <span className="font-serif text-[16px] italic text-slate-900">{children}</span>;
}

/** Angka konstanta, mis. 1 atau 30% (tegak, bukan miring). */
export function Num({ children }: { children: ReactNode }) {
  return <span className="text-[15px] font-medium text-slate-800 tabular-nums">{children}</span>;
}

export function Op({ children }: { children: ReactNode }) {
  return <span className="px-0.5 text-[14px] font-medium text-slate-400">{children}</span>;
}

export function Pow({ base, exp }: { base: ReactNode; exp: ReactNode }) {
  return (
    <span className="inline-flex items-start whitespace-nowrap">
      <span className="inline-flex items-center gap-0.5">{base}</span>
      <span className="ml-0.5 font-serif text-[11.5px] leading-none italic text-slate-700">{exp}</span>
    </span>
  );
}

/** Pecahan bertumpuk: pembilang di atas garis, penyebut di bawah. */
export function Frac({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-stretch align-middle">
      <span className="flex flex-wrap items-center justify-center gap-1 px-1 pb-1.5">{num}</span>
      <span className="h-[1.5px] rounded-full bg-slate-400/80" aria-hidden />
      <span className="flex flex-wrap items-center justify-center gap-1 px-1 pt-1.5">{den}</span>
    </span>
  );
}

/** Baris rumus — elemen berjajar & otomatis turun baris di layar sempit. */
export function Eq({ children }: { children: ReactNode }) {
  return <span className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2">{children}</span>;
}

/* ------------------------------------------------------------------ */
/* Section panduan                                                     */
/* ------------------------------------------------------------------ */

export interface FormulaStep {
  icon: LucideIcon;
  title: string;
  /** Rumus ditulis dengan Term/Var/Op/Frac/Pow */
  formula: ReactNode;
  /** Keterangan simbol singkat di bawah rumus, mis. "r = bunga ÷ 12" */
  legend?: string;
  /** Teks alternatif rumus untuk pembaca layar */
  formulaLabel: string;
  body: string;
}

export function FormulaGuide({ title, description, steps }: { title: string; description: string; steps: FormulaStep[] }) {
  return (
    <section id="cara-hitung" aria-labelledby="cara-hitung-title" className="scroll-mt-32 md:scroll-mt-24">
      <div className="max-w-2xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Cara hitung</p>
        <h2 id="cara-hitung-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
          {title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{description}</p>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                <s.icon className="size-[18px]" aria-hidden />
              </span>
              <h3 className="min-w-0 flex-1 text-[15px] leading-snug font-semibold text-slate-900">{s.title}</h3>
              <span className="text-[13px] font-bold text-slate-300 tabular-nums">0{i + 1}</span>
            </div>

            <div
              role="math"
              aria-label={s.formulaLabel}
              className="mt-4 flex min-h-[104px] flex-col items-center justify-center rounded-xl bg-[linear-gradient(180deg,#F8FAFC,#FFFFFF)] px-3 py-4 text-slate-800 ring-1 ring-slate-200/80"
            >
              <div aria-hidden>{s.formula}</div>
              {s.legend && (
                <p aria-hidden className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
                  {s.legend}
                </p>
              )}
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-slate-500">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
