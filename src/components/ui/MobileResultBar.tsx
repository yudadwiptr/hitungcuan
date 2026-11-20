"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cx } from "./form";

export interface ResultBarItem {
  label: string;
  value: string;
  tone?: "default" | "emerald" | "amber" | "rose";
}

const TONES = {
  default: "text-slate-900",
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  rose: "text-rose-600",
};

/** Bar ringkas di bawah layar (mobile/tablet) — otomatis sembunyi saat panel hasil terlihat. */
export function MobileResultBar({ items, targetId = "hasil" }: { items: ResultBarItem[]; targetId?: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <div
      className={cx(
        "fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-lg transition-transform duration-300 lg:hidden",
        hidden ? "translate-y-full" : "translate-y-0",
      )}
      aria-hidden={hidden}
    >
      <div className="mx-auto flex max-w-xl items-center gap-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 flex-1">
            <p className="truncate text-[10.5px] font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className={cx("truncate text-[15px] font-bold tabular-nums", TONES[item.tone ?? "default"])}>
              {item.value}
            </p>
          </div>
        ))}
        <a
          href={`#${targetId}`}
          tabIndex={hidden ? -1 : 0}
          className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl bg-slate-900 px-3.5 text-[13px] font-semibold text-white"
        >
          Lihat hasil <ChevronDown className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
