import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const NAV = [
  { href: "#kalkulator", label: "Kalkulator" },
  { href: "#cara-hitung", label: "Cara hitung" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="HitungCuan — beranda" className="rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20">
          <Logo />
        </Link>
        <nav aria-label="Navigasi utama" className="flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
            >
              {item.label}
            </a>
          ))}
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700 ring-1 ring-emerald-600/15">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            Gratis · tanpa daftar
          </span>
        </nav>
      </div>
    </header>
  );
}
