"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site";
import { HouseAdBanner } from "./HouseAdBanner";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Slot Google AdSense dengan ukuran tetap (728×90 desktop / 320×100 mobile)
 * agar tidak menyebabkan layout shift (CLS). Tanpa env AdSense → tampil house ad Yuma Studio.
 */
export function AdSlot({ slot = siteConfig.adsenseSlots.top }: { slot?: string }) {
  const client = siteConfig.adsenseClient;
  const live = Boolean(client && slot);

  useEffect(() => {
    if (!live) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // script AdSense belum siap / diblokir ad-blocker
    }
  }, [live]);

  if (!live) {
    return (
      <div className="mx-auto w-full max-w-[970px]">
        <HouseAdBanner />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div
        className="relative h-[100px] w-full max-w-[320px] overflow-hidden rounded-xl md:h-[90px] md:max-w-[728px]"
        aria-label="Iklan"
      >
        <ins
          className="adsbygoogle block h-full w-full"
          data-ad-client={client}
          data-ad-slot={slot}
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
}
