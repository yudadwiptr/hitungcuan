"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Slot Google AdSense dengan ukuran tetap (728×90 desktop / 320×100 mobile)
 * agar tidak menyebabkan layout shift (CLS). Tanpa env AdSense → tampil placeholder halus.
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

  return (
    <div className="flex justify-center">
      <div
        className="relative h-[100px] w-full max-w-[320px] overflow-hidden rounded-xl md:h-[90px] md:max-w-[728px]"
        aria-label="Iklan"
      >
        {live ? (
          <ins
            className="adsbygoogle block h-full w-full"
            data-ad-client={client}
            data-ad-slot={slot}
            data-full-width-responsive="false"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center gap-3 border border-dashed border-slate-300 bg-[repeating-linear-gradient(135deg,transparent,transparent_8px,rgba(148,163,184,0.07)_8px,rgba(148,163,184,0.07)_16px)] text-slate-400">
            <span className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Iklan
            </span>
            <span className="text-[12px]">
              Ruang sponsor · <span className="tabular-nums md:hidden">320×100</span>
              <span className="hidden tabular-nums md:inline">728×90</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
