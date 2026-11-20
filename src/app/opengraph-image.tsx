import { ogSize, renderOg } from "@/lib/og";

export const alt = "HitungCuan — Kalkulator HPP & Harga Jual Kuliner UMKM";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    title: "Kalkulator HPP & Harga Jual Kuliner",
    subtitle: "Hitung modal per porsi & harga GoFood/GrabFood yang tetap untung. Gratis untuk UMKM.",
    chips: ["Real-time", "Komisi ojol", "Salin ke WhatsApp"],
    card: {
      eyebrow: "HPP PER PORSI",
      caption: "Es Kopi Susu Gula Aren",
      big: "Rp 9.707",
      rows: [
        { label: "Harga offline", value: "Rp 15.000", color: "#059669" },
        { label: "Harga aplikasi", value: "Rp 19.000", color: "#D97706" },
        { label: "Laba bersih", value: "Rp 5.293", color: "#059669" },
      ],
    },
  });
}
