import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ToolIcon } from "@/components/brand/ToolIcon";
import { TOOLS } from "@/lib/tools";

/** Kartu kalkulator lain — internal linking untuk SEO & navigasi. */
export function OtherTools({ current }: { current: string }) {
  const others = TOOLS.filter((t) => t.href !== current);
  return (
    <section aria-labelledby="other-tools-title">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Kalkulator lainnya</p>
      <h2 id="other-tools-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
        Satu tempat untuk semua hitungan cuan
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {others.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-[0_8px_24px_-12px_rgba(5,150,105,0.35)]"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10 transition group-hover:bg-emerald-600 group-hover:text-white">
              <ToolIcon name={t.icon} className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-[15px] font-semibold text-slate-900">{t.title}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-500">{t.tag}</span>
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-slate-500">{t.description}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-700">
                Buka kalkulator <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
