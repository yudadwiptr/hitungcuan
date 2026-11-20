import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { STUDIO, TOOLS } from "@/lib/tools";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white pb-24 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="max-w-sm">
          <Logo className="h-7 w-auto" />
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
            Kalkulator cuan gratis untuk UMKM kuliner, reseller & seller online, sampai perencanaan KPR. Hitung dulu,
            baru jualan.
          </p>
        </div>

        <nav aria-label="Kalkulator">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400">Kalkulator</p>
          <ul className="mt-3 space-y-2">
            {TOOLS.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="text-[13.5px] text-slate-600 transition hover:text-emerald-700">
                  {t.title.replace("Kalkulator ", "")}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-[12.5px] leading-relaxed text-slate-400">
          <p>
            Hasil perhitungan bersifat estimasi untuk membantu pengambilan keputusan, bukan nasihat keuangan resmi. Tarif
            platform & suku bunga dapat berubah — selalu cek sumber resminya.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-[12.5px] text-slate-500 sm:flex-row sm:px-6">
          <p>© 2026 HitungCuan · Dibuat untuk Indonesia 🇮🇩</p>
          <p>
            Built by{" "}
            <a
              href={STUDIO.url}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-0.5 font-semibold text-slate-800 underline decoration-emerald-500/40 decoration-2 underline-offset-4 transition hover:text-emerald-700 hover:decoration-emerald-500"
            >
              {STUDIO.name}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
