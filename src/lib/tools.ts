export type ToolIcon = "kuliner" | "marketplace" | "kpr";

export interface Tool {
  href: string;
  nav: string;
  /** Label pendek di samping logo, mis. "hitungcuan. | KPR" */
  label: string;
  title: string;
  description: string;
  icon: ToolIcon;
  tag: string;
}

/** Daftar kalkulator — dipakai navigasi, footer, sitemap, dan section "Kalkulator lainnya". */
export const TOOLS: Tool[] = [
  {
    href: "/",
    nav: "HPP Kuliner",
    label: "Kuliner",
    title: "Kalkulator HPP & Harga Jual Kuliner",
    description: "Hitung modal per porsi, harga jual offline, dan harga GoFood/GrabFood/ShopeeFood yang tetap untung.",
    icon: "kuliner",
    tag: "UMKM F&B",
  },
  {
    href: "/jualan-online",
    nav: "Jualan Online",
    label: "Jualan Online",
    title: "Kalkulator Harga Jual Marketplace",
    description: "Untuk reseller & seller Shopee, Tokopedia, TikTok Shop, Lazada, sampai Facebook Marketplace.",
    icon: "marketplace",
    tag: "Reseller",
  },
  {
    href: "/kpr",
    nav: "Simulasi KPR",
    label: "KPR",
    title: "Kalkulator Simulasi KPR",
    description: "Cicilan rumah dengan bunga fix + floating, total bunga, dana awal, dan cek kemampuan bayar.",
    icon: "kpr",
    tag: "Properti",
  },
];

export const STUDIO = {
  name: "Yuma Studio",
  url: "https://yumastudio.digital/",
};
