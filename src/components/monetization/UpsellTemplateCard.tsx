"use client";

import { ArrowRight, Check, FileSpreadsheet, ShieldCheck, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";
import { siteConfig } from "@/lib/site";

const FEATURES = [
  "Stok bahan otomatis berkurang dari data penjualan",
  "Laporan laba rugi bulanan & grafik omzet",
  "Kalkulator HPP multi-menu (sampai 50 menu)",
  "Rekap pengeluaran harian + kategori biaya",
  "Bisa dibuka di Excel & Google Sheets",
];

const SHEETS = ["Dashboard", "Stok Bahan", "Penjualan", "Laba Rugi"];

const PREVIEW_ROWS = [
  ["01 Nov", "Es Kopi Susu Aren", "42", "Rp 630.000"],
  ["01 Nov", "Kopi Hitam", "18", "Rp 180.000"],
  ["02 Nov", "Es Kopi Susu Aren", "51", "Rp 765.000"],
  ["02 Nov", "Matcha Latte", "23", "Rp 414.000"],
];

export function UpsellTemplateCard() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState(SHEETS[2]);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-white p-5">
        <div aria-hidden className="pointer-events-none absolute -right-8 -bottom-10 size-36 rounded-full bg-emerald-200/40 blur-2xl" />
        <div className="relative flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-200">
            <FileSpreadsheet className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-emerald-700">
              <Sparkles className="size-3" aria-hidden /> Produk digital
            </p>
            <h3 className="mt-1.5 text-[15px] leading-snug font-semibold text-slate-900">
              Mau kelola stok & pembukuan bulanan otomatis?
            </h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-slate-600">
              Template Excel Keuangan UMKM — tinggal isi penjualan harian, laporan laba rugi jadi sendiri.
            </p>
            <button
              type="button"
              onClick={open}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/20"
            >
              Lihat preview template <ArrowRight className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="template-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-2xl bg-white p-0 text-slate-900 shadow-2xl ring-1 ring-slate-900/10 backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm open:animate-[hc-pop_180ms_ease-out]"
      >
        <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Preview</p>
              <h2 id="template-title" className="mt-0.5 text-lg font-semibold">
                Template Excel Keuangan UMKM
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup preview"
              className="grid size-9 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {/* Mock spreadsheet */}
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2">
                <span className="size-2.5 rounded-full bg-rose-300" />
                <span className="size-2.5 rounded-full bg-amber-300" />
                <span className="size-2.5 rounded-full bg-emerald-300" />
                <span className="ml-2 truncate text-[11.5px] text-slate-500">Keuangan-UMKM-HitungCuan.xlsx</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[440px] text-left text-[12px]">
                  <thead className="bg-emerald-600 text-white">
                    <tr>
                      {["Tanggal", "Menu", "Qty", "Omzet"].map((h) => (
                        <th key={h} className="px-3 py-2 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {PREVIEW_ROWS.map((row, i) => (
                      <tr key={i} className="border-t border-slate-100 odd:bg-white even:bg-slate-50/60">
                        {row.map((c, j) => (
                          <td key={j} className={"px-3 py-2 " + (j >= 2 ? "text-right" : "")}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-t-2 border-emerald-600/30 bg-emerald-50 font-semibold text-emerald-800">
                      <td className="px-3 py-2" colSpan={2}>
                        Total 2 hari
                      </td>
                      <td className="px-3 py-2 text-right">134</td>
                      <td className="px-3 py-2 text-right">Rp 1.989.000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex gap-px overflow-x-auto border-t border-slate-200 bg-slate-100 px-2 pt-1" role="tablist">
                {SHEETS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="tab"
                    aria-selected={tab === s}
                    onClick={() => setTab(s)}
                    className={
                      "shrink-0 rounded-t-md px-3 py-1.5 text-[11.5px] font-medium transition " +
                      (tab === s ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-800")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <ul className="space-y-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-slate-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-slate-200 sm:min-w-[190px]">
                <p className="text-[12px] text-slate-400 line-through tabular-nums">Rp 99.000</p>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">Rp 49.000</p>
                <p className="text-[11px] text-slate-500">Sekali bayar · update gratis</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="flex items-center gap-1.5 text-[12px] text-slate-500">
              <ShieldCheck className="size-4 text-emerald-600" aria-hidden /> File dikirim instan setelah pembayaran
            </p>
            <a
              href={siteConfig.templateUrl}
              target={siteConfig.templateUrl.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Beli template sekarang <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
