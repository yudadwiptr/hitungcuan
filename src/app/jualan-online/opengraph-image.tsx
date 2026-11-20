import { ogSize, renderOg } from "@/lib/og";

export const alt = "Kalkulator Harga Jual Marketplace & Reseller — HitungCuan";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOg({
    title: "Kalkulator Harga Jual Marketplace",
    subtitle: "Harga tayang Shopee, Tokopedia, TikTok Shop & FB yang tetap untung setelah potongan.",
    chips: ["Reseller", "Bandingkan platform", "Gratis"],
    card: {
      eyebrow: "HARGA TAYANG",
      caption: "Tumbler Stainless · Shopee",
      big: "Rp 64.000",
      rows: [
        { label: "Modal / unit", value: "Rp 42.000", color: "#0F172A" },
        { label: "Potongan", value: "Rp 8.930", color: "#D97706" },
        { label: "Laba bersih", value: "Rp 13.070", color: "#059669" },
      ],
    },
  });
}
