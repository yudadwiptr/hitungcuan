"use client";

import { Check, MessageCircle, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/whatsapp";
import { cx } from "./form";

function useTimers() {
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);
  return (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
}

/** Tombol "Salin ringkasan ke WhatsApp" + reset dengan konfirmasi dua klik. */
export function ResultActions({ getText, onReset }: { getText: () => string; onReset: () => void }) {
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const [confirmReset, setConfirmReset] = useState(false);
  const later = useTimers();

  const handleCopy = async () => {
    const ok = await copyText(getText());
    setCopied(ok ? "ok" : "fail");
    later(() => setCopied("idle"), 2400);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      later(() => setConfirmReset(false), 3000);
      return;
    }
    setConfirmReset(false);
    onReset();
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className={cx(
            "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[13.5px] font-semibold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4",
            copied === "fail"
              ? "bg-rose-600 focus-visible:ring-rose-500/30"
              : "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500/30",
          )}
        >
          {copied === "ok" ? <Check className="size-4" aria-hidden /> : <MessageCircle className="size-4" aria-hidden />}
          {copied === "ok" ? (
            "Tersalin! Tinggal paste"
          ) : copied === "fail" ? (
            "Gagal menyalin"
          ) : (
            <>
              <span className="sm:hidden">Salin ke WhatsApp</span>
              <span className="hidden sm:inline">Salin ringkasan ke WhatsApp</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className={cx(
            "inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3.5 text-[13px] font-medium ring-1 transition focus-visible:outline-none focus-visible:ring-4",
            confirmReset
              ? "bg-rose-50 text-rose-700 ring-rose-300 focus-visible:ring-rose-500/20"
              : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-400/20",
          )}
        >
          <RotateCcw className="size-4" aria-hidden />
          {confirmReset ? "Yakin?" : "Reset"}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied === "ok" ? "Ringkasan disalin ke clipboard" : ""}
      </p>
    </>
  );
}
