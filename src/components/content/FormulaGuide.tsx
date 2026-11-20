import type { LucideIcon } from "lucide-react";

export interface FormulaStep {
  icon: LucideIcon;
  title: string;
  formula: string;
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
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                <s.icon className="size-[18px]" aria-hidden />
              </span>
              <span className="text-[28px] font-bold text-slate-100 tabular-nums">0{i + 1}</span>
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-2 rounded-lg bg-slate-900 px-3 py-2 font-mono text-[12px] text-emerald-300">{s.formula}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
