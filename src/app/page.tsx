import type { Metadata } from "next";
import { BadgeCheck, Bike, Zap } from "lucide-react";
import { HppCalculator } from "@/components/calculator/HppCalculator";
import { FaqSection, GuideSection } from "@/components/content/GuideSection";
import { FAQ_ITEMS } from "@/components/content/faq";
import { OtherTools } from "@/components/layout/OtherTools";
import { PageHero } from "@/components/layout/PageHero";
import { AdSlot } from "@/components/monetization/AdSlot";
import { AffiliateTools } from "@/components/monetization/AffiliateTools";
import { UpsellTemplateCard } from "@/components/monetization/UpsellTemplateCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: siteConfig.title, description: siteConfig.description },
};

export default function Home() {
  return (
    <>
      <JsonLd name="Kalkulator HPP & Harga Jual Kuliner — HitungCuan" description={siteConfig.description} path="/" faq={FAQ_ITEMS} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Slot 1 — Top banner AdSense */}
        <div className="pt-5">
          <AdSlot />
        </div>

        <PageHero
          eyebrow={
            <>
              <span className="rounded-full bg-emerald-600 px-1.5 py-px text-[10px] font-bold text-white">BARU</span>
              Kalkulator jualan online & simulasi KPR
            </>
          }
          title="Kalkulator HPP & Harga Jual"
          highlight="Kuliner UMKM"
          description="Hitung modal per porsi, tentukan harga jual offline, dan harga di aplikasi pesan-antar yang tetap untung setelah dipotong komisi — semuanya berubah instan saat kamu mengetik."
          points={[
            { icon: Zap, label: "Real-time, tanpa tombol hitung" },
            { icon: Bike, label: "Harga GoFood/GrabFood/ShopeeFood" },
            { icon: BadgeCheck, label: "Gratis & data tetap di perangkatmu" },
          ]}
        />

        <div id="kalkulator" className="scroll-mt-32 md:scroll-mt-24">
          <HppCalculator belowResult={<UpsellTemplateCard />} sidebarBottom={<AffiliateTools />} />
        </div>

        <div className="mt-20 space-y-20">
          <GuideSection />
          <OtherTools current="/" />
          <FaqSection />
        </div>
      </main>
    </>
  );
}
