import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white pb-24 lg:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
            Kalkulator HPP & harga jual gratis untuk UMKM kuliner Indonesia. Hitung modal, tentukan harga, dan jualan
            dengan percaya diri.
          </p>
        </div>
        <div className="text-[12.5px] leading-relaxed text-slate-400 md:max-w-sm md:text-right">
          <p>
            Hasil perhitungan bersifat estimasi untuk membantu pengambilan keputusan, bukan nasihat keuangan resmi.
            Komisi aplikasi dapat berbeda per merchant & wilayah.
          </p>
          <p className="mt-3 text-slate-500">© 2026 HitungCuan · Dibuat untuk UMKM Indonesia 🇮🇩</p>
        </div>
      </div>
    </footer>
  );
}
