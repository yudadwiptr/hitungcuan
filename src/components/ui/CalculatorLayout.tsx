"use client";

import { useEffect, useRef, type ReactNode } from "react";

const HEADER_OFFSET = 80; // tinggi header sticky + jarak
const BOTTOM_GAP = 16;

/**
 * Grid 60/40: input di kiri, panel hasil sticky di kanan (1 kolom di mobile).
 * Kalau panel lebih tinggi dari layar, `top` dibuat negatif sehingga panel ikut ter-scroll
 * sampai bagian bawahnya terlihat, baru menempel — tanpa scrollbar di dalam panel.
 */
export function CalculatorLayout({
  inputs,
  result,
  belowResult,
  sidebarBottom,
  footer,
}: {
  inputs: ReactNode;
  result: ReactNode;
  belowResult?: ReactNode;
  sidebarBottom?: ReactNode;
  footer?: ReactNode;
}) {
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const update = () => {
      const top = Math.min(HEADER_OFFSET, window.innerHeight - el.offsetHeight - BOTTOM_GAP);
      el.style.top = `${top}px`;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] xl:gap-8">
        <div className="min-w-0 space-y-6">{inputs}</div>
        <aside className="flex min-w-0 flex-col gap-6" aria-label="Hasil perhitungan">
          <div className="flex-1">
            <div ref={stickyRef} className="lg:sticky" style={{ top: HEADER_OFFSET }}>
              {result}
              <p className="mt-2.5 text-center text-[11.5px] text-slate-400">
                Data tersimpan otomatis di browser ini — tidak dikirim ke server.
              </p>
            </div>
          </div>
          {belowResult}
          {sidebarBottom}
        </aside>
      </div>
      {footer}
    </>
  );
}
