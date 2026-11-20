import { ArrowUpRight, BadgeCheck, Printer, Smartphone } from "lucide-react";
import { affiliateItems } from "@/lib/site";

const ICONS = { pos: Smartphone, printer: Printer };

export function AffiliateTools() {
  return (
    <section aria-labelledby="tools-title" className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 id="tools-title" className="text-[14px] font-semibold text-slate-900">
          Tools Rekomendasi UMKM
        </h3>
        <span className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">Afiliasi</span>
      </div>

      <ul className="mt-3 space-y-2.5">
        {affiliateItems.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <li key={item.id}>
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="sponsored nofollow noopener"
                className="group flex gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-emerald-600">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-slate-900">{item.title}</span>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-600/20">
                      <BadgeCheck className="size-3" aria-hidden /> Rekomendasi
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-slate-500">{item.description}</span>
                  <span className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">{item.meta}</span>
                    <span className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-emerald-700">
                      {item.cta}
                      <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        Beberapa link adalah link afiliasi. Kami bisa mendapat komisi kecil tanpa biaya tambahan untukmu — ini membantu
        HitungCuan tetap gratis.
      </p>
    </section>
  );
}
