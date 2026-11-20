"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/format";
import type { CalcResult } from "@/lib/hpp";
import { cx } from "./ui";

/** Bar ringkas di bawah layar (mobile/tablet) — sembunyi saat panel hasil terlihat. */
export function MobileResultBar({ result }: { result: CalcResult }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("hasil");
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cx(
        "fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-lg transition-transform duration-300 lg:hidden",
        hidden ? "translate-y-full" : "translate-y-0",
      )}
      aria-hidden={hidden}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">HPP / porsi</p>
          <p className="text-[15px] font-bold text-slate-900 tabular-nums">{formatRupiah(result.hpp)}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-medium uppercase tracking-wide text-slate-400">Harga jual</p>
          <p className="text-[15px] font-bold text-emerald-600 tabular-nums">{formatRupiah(result.offlinePrice)}</p>
        </div>
        <a
          href="#hasil"
          tabIndex={hidden ? -1 : 0}
          className="inline-flex h-10 items-center gap-1 rounded-xl bg-slate-900 px-3.5 text-[13px] font-semibold text-white"
        >
          Lihat hasil <ChevronUp className="size-4 rotate-180" aria-hidden />
        </a>
      </div>
    </div>
  );
}
