import { BadgeCheck, Bike, Zap } from "lucide-react";
import { HppCalculator } from "@/components/calculator/HppCalculator";
import { FaqSection, GuideSection } from "@/components/content/GuideSection";
import { FAQ_ITEMS } from "@/components/content/faq";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AdSlot } from "@/components/monetization/AdSlot";
import { AffiliateTools } from "@/components/monetization/AffiliateTools";
import { UpsellTemplateCard } from "@/components/monetization/UpsellTemplateCard";
import { siteConfig } from "@/lib/site";

const HIGHLIGHTS = [
  { icon: Zap, label: "Real-time, tanpa tombol hitung" },
  { icon: Bike, label: "Harga GoFood/GrabFood/ShopeeFood" },
  { icon: BadgeCheck, label: "Gratis & data tetap di perangkatmu" },
];

function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "id-ID",
      offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Slot 1 — Top banner AdSense */}
        <div className="pt-5">
          <AdSlot />
        </div>

        {/* Hero */}
        <div className="pt-8 pb-8 sm:pt-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] font-medium text-slate-600 shadow-sm">
            <span className="rounded-full bg-emerald-600 px-1.5 py-px text-[10px] font-bold text-white">BARU</span>
            Simulasi komisi ojol otomatis
          </p>
          <h1 className="mt-4 max-w-3xl text-[30px] leading-[1.15] font-bold tracking-tight text-slate-900 sm:text-[40px]">
            Kalkulator HPP & Harga Jual <span className="text-emerald-600">Kuliner UMKM</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-slate-600">
            Hitung modal per porsi, tentukan harga jual offline, dan harga di aplikasi pesan-antar yang tetap untung
            setelah dipotong komisi — semuanya berubah instan saat kamu mengetik.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {HIGHLIGHTS.map((h) => (
              <li key={h.label} className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                <h.icon className="size-4 text-emerald-600" aria-hidden />
                {h.label}
              </li>
            ))}
          </ul>
        </div>

        <div id="kalkulator" className="scroll-mt-24">
          <HppCalculator belowResult={<UpsellTemplateCard />} sidebarBottom={<AffiliateTools />} />
        </div>

        <div className="mt-20 space-y-20">
          <GuideSection />
          <FaqSection />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
