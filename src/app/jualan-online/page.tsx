import type { Metadata } from "next";
import { BadgePercent, Calculator, Layers, Scale, ShoppingBag, Store, Zap } from "lucide-react";
import { FormulaGuide } from "@/components/content/FormulaGuide";
import { FaqSection } from "@/components/content/GuideSection";
import { OtherTools } from "@/components/layout/OtherTools";
import { PageHero } from "@/components/layout/PageHero";
import { MarketplaceCalculator } from "@/components/marketplace/MarketplaceCalculator";
import { AdSlot } from "@/components/monetization/AdSlot";
import { AffiliateTools } from "@/components/monetization/AffiliateTools";
import { JsonLd } from "@/components/seo/JsonLd";

const TITLE = "Kalkulator Harga Jual Shopee, Tokopedia & Marketplace untuk Reseller";
const DESCRIPTION =
  "Hitung harga jual di Shopee, Tokopedia, TikTok Shop, Lazada, sampai Facebook Marketplace yang tetap untung setelah biaya admin, layanan, & voucher. Lengkap dengan perbandingan antar platform. Gratis.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "kalkulator harga jual shopee",
    "biaya admin shopee",
    "kalkulator tokopedia",
    "harga jual tiktok shop",
    "kalkulator reseller",
    "cara menghitung harga jual dropship",
    "margin jualan online",
  ],
  alternates: { canonical: "/jualan-online" },
  openGraph: { url: "/jualan-online", title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    q: "Berapa potongan biaya admin Shopee, Tokopedia, dan TikTok Shop?",
    a: "Besarannya berbeda per kategori produk, status toko (biasa, Star, Mall/Official), dan program yang diikuti seperti gratis ongkir atau cashback. Kalkulator ini memakai estimasi umum yang bisa kamu ubah sendiri — selalu cocokkan dengan tarif terbaru di Seller Center masing-masing.",
  },
  {
    q: "Bagaimana rumus harga jual agar tetap untung setelah dipotong marketplace?",
    a: "Harga jual = (Modal + biaya per pesanan) ÷ (1 − % potongan − % target margin). Dengan rumus ini, setelah marketplace memotong biayanya, laba yang tersisa tetap sesuai target margin dari harga yang dibayar pembeli.",
  },
  {
    q: "Kenapa harga di Facebook atau WhatsApp bisa lebih murah?",
    a: "Jualan langsung lewat Facebook Marketplace, grup, WhatsApp, atau Instagram umumnya tidak dipotong komisi platform. Jadi dengan margin yang sama, harga bisa lebih rendah — atau dengan harga yang sama, laba kamu lebih besar.",
  },
  {
    q: "Apa itu harga minimum balik modal?",
    a: "Harga tayang terendah agar uang yang kamu terima setelah semua potongan pas sama dengan modal (laba nol). Jangan pasang harga di bawah angka ini, termasuk saat ikut flash sale atau promo.",
  },
  {
    q: "Apakah voucher toko memengaruhi harga jual?",
    a: "Ya. Voucher atau diskon yang ditanggung toko mengurangi uang yang dibayar pembeli, dan potongan persentase marketplace dihitung dari harga setelah diskon. Kalkulator otomatis menaikkan harga tayang supaya margin tetap terjaga.",
  },
];

export default function JualanOnlinePage() {
  return (
    <>
      <JsonLd name="Kalkulator Harga Jual Marketplace — HitungCuan" description={DESCRIPTION} path="/jualan-online" faq={FAQ} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pt-5">
          <AdSlot />
        </div>

        <PageHero
          eyebrow={
            <>
              <ShoppingBag className="size-3.5 text-emerald-600" aria-hidden />
              Untuk reseller, dropshipper & seller online
            </>
          }
          title="Kalkulator Harga Jual"
          highlight="Marketplace & Reseller"
          description="Jualan di Shopee, Tokopedia, TikTok Shop, Lazada, atau langsung lewat Facebook & WhatsApp? Hitung harga tayang yang tetap untung setelah biaya admin, layanan, dan voucher — lalu bandingkan semua platform sekaligus."
          points={[
            { icon: Zap, label: "Real-time" },
            { icon: Scale, label: "Bandingkan antar platform" },
            { icon: BadgePercent, label: "Harga minimum balik modal" },
          ]}
        />

        <div id="kalkulator" className="scroll-mt-32 md:scroll-mt-24">
          <MarketplaceCalculator sidebarBottom={<AffiliateTools />} />
        </div>

        <div className="mt-20 space-y-20">
          <FormulaGuide
            title="Rumus harga jual marketplace yang dipakai HitungCuan"
            description="Potongan marketplace dihitung dari harga yang dibayar pembeli, jadi markup-nya harus dihitung dari belakang."
            steps={[
              { icon: Layers, title: "Total modal per unit", formula: "Harga beli + Biaya tambahan", body: "Masukkan juga packing, ongkir dari supplier, lakban, sampai biaya iklan per unit." },
              { icon: Store, title: "Potongan platform", formula: "% admin + % layanan + biaya/pesanan", body: "Biaya persentase dihitung dari harga yang dibayar pembeli, biaya tetap per pesanan ditambahkan." },
              { icon: Calculator, title: "Harga dibayar pembeli", formula: "(Modal + biaya/pesanan) ÷ (1 − potongan − margin)", body: "Hasilnya: setelah dipotong, laba bersih tetap sesuai target margin." },
              { icon: BadgePercent, title: "Harga tayang", formula: "Harga dibayar ÷ (1 − voucher toko)", body: "Kalau kamu memberi voucher/diskon, harga tayang dinaikkan agar margin tidak tergerus." },
            ]}
          />
          <OtherTools current="/jualan-online" />
          <FaqSection items={FAQ} description="Seputar biaya marketplace, harga jual reseller, dan strategi promo." />
        </div>
      </main>
    </>
  );
}
