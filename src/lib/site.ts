function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "HitungCuan",
  title: "HitungCuan — Kalkulator HPP & Harga Jual Kuliner UMKM",
  shortDescription: "Kalkulator HPP & harga jual kuliner, gratis.",
  description:
    "Hitung HPP (Harga Pokok Penjualan) per porsi, tentukan harga jual offline & harga GoFood/GrabFood/ShopeeFood yang tetap untung setelah potongan komisi. Gratis, real-time, tanpa daftar.",
  url: resolveSiteUrl(),
  locale: "id_ID",
  keywords: [
    "kalkulator HPP",
    "cara menghitung HPP makanan",
    "harga pokok penjualan",
    "kalkulator harga jual",
    "HPP minuman",
    "harga jual GoFood",
    "harga jual GrabFood",
    "komisi ShopeeFood",
    "margin keuntungan UMKM",
    "food cost calculator",
    "UMKM kuliner",
  ],
  /** Link halaman pembelian produk digital. Isi via env saat produknya siap. */
  templateUrl: process.env.NEXT_PUBLIC_TEMPLATE_URL || "#",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
  adsenseSlots: {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "",
  },
} as const;

export interface AffiliateItem {
  id: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  cta: string;
  icon: "pos" | "printer";
}

/** Ganti `href` dengan link afiliasi kamu (env opsional). */
export const affiliateItems: AffiliateItem[] = [
  {
    id: "pos",
    title: "Aplikasi Kasir POS Gratis",
    description: "Catat transaksi, stok, & laporan harian dari HP. Cocok untuk kedai & booth.",
    meta: "Android & iOS · Gratis",
    href: process.env.NEXT_PUBLIC_AFF_POS_URL || "#",
    cta: "Coba gratis",
    icon: "pos",
  },
  {
    id: "printer",
    title: "Printer Thermal Bluetooth 58mm",
    description: "Cetak struk & label pesanan ojol tanpa kabel. Kompatibel dengan banyak aplikasi kasir.",
    meta: "Mulai ± Rp 150 ribuan",
    href: process.env.NEXT_PUBLIC_AFF_PRINTER_URL || "#",
    cta: "Cek harga",
    icon: "printer",
  },
];
