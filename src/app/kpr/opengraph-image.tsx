import { ogSize, renderOg } from "@/lib/og";

export const alt = "Kalkulator Simulasi KPR — HitungCuan";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    title: "Kalkulator Simulasi KPR Rumah",
    subtitle: "Cicilan bunga fix + floating, total bunga, dana awal, dan cek rasio cicilan terhadap gaji.",
    chips: ["Fix + floating", "Tabel angsuran", "Gratis"],
    card: {
      eyebrow: "CICILAN PER BULAN",
      caption: "Rumah Rp 650 jt · 15 tahun",
      big: "Rp 3,98 jt",
      rows: [
        { label: "DP 20%", value: "Rp 130 jt", color: "#0F172A" },
        { label: "Setelah floating", value: "Rp 5,5 jt", color: "#D97706" },
        { label: "Total bunga", value: "Rp 421 jt", color: "#059669" },
      ],
    },
  });
}
