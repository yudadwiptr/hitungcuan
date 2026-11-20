"use client";

import { AlertTriangle, ChevronDown, Home, Landmark, Percent, Wallet } from "lucide-react";
import { useMemo } from "react";
import { ResultActions } from "@/components/ui/actions";
import { CalculatorLayout } from "@/components/ui/CalculatorLayout";
import { DecimalInput, FieldLabel, MoneyInput, SectionCard, Select, Slider, UnitSuffix, cx } from "@/components/ui/form";
import { MobileResultBar } from "@/components/ui/MobileResultBar";
import { usePersistedReducer } from "@/components/ui/usePersistedReducer";
import { formatPercent, formatRupiah } from "@/lib/format";
import { DSR_LIMIT, KPR_DEFAULT, TENOR_OPTIONS, calculateKpr, kprWhatsApp, parseKprState, type KprResult, type KprState } from "@/lib/kpr";

type Action = { type: "patch"; patch: Partial<KprState> } | { type: "reset" };

function reducer(state: KprState, action: Action): KprState {
  if (action.type === "reset") return structuredClone(KPR_DEFAULT);
  return { ...state, ...action.patch };
}

const STORAGE_KEY = "hitungcuan:kpr:v1";
const DP_MARKS = [0, 10, 20, 30];
const TENOR_SELECT = TENOR_OPTIONS.map((t) => ({ value: t, label: `${t} tahun`, description: `${Number(t) * 12} bulan` }));
const FIX_SELECT = ["1", "2", "3", "5", "10"].map((t) => ({ value: t, label: `${t} tahun`, description: "bunga fix" }));

/** Juta/Miliar singkat: 650000000 -> "650 jt" */
function shortRupiah(n: number): string {
  if (n >= 1e9) return `Rp ${(n / 1e9).toFixed(n >= 1e10 ? 0 : 2).replace(".", ",").replace(/,?0+$/, "")} M`;
  if (n >= 1e6) return `Rp ${Math.round(n / 1e6)} jt`;
  return formatRupiah(n);
}

export function KprCalculator() {
  const [state, dispatch] = usePersistedReducer(STORAGE_KEY, reducer, KPR_DEFAULT, parseKprState);
  const r = useMemo(() => calculateKpr(state), [state]);
  const patch = (p: Partial<KprState>) => dispatch({ type: "patch", patch: p });
  const fixOptions = FIX_SELECT.filter((o) => Number(o.value) <= Number(state.tenorYears));

  return (
    <CalculatorLayout
      inputs={
        <>
          <SectionCard step={1} id="properti" icon={Home} title="Harga Properti & Uang Muka" description="Harga rumah/apartemen dan DP yang kamu siapkan.">
            <FieldLabel htmlFor="kpr-price">Harga properti</FieldLabel>
            <MoneyInput id="kpr-price" value={state.propertyPrice} onChange={(v) => patch({ propertyPrice: v })} />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["350000000", "500000000", "750000000", "1000000000", "1500000000"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => patch({ propertyPrice: v })}
                  className={cx(
                    "rounded-md px-2 py-0.5 text-[11.5px] font-medium tabular-nums ring-1 transition",
                    state.propertyPrice === v ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-white text-slate-500 ring-slate-200 hover:text-slate-800",
                  )}
                >
                  {shortRupiah(Number(v))}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <label htmlFor="kpr-dp" className="text-[13px] font-medium text-slate-700">
                Uang muka (DP)
                <span className="mt-0.5 block text-[11.5px] font-normal text-slate-400 tabular-nums">{formatRupiah(r.dp)}</span>
              </label>
              <output htmlFor="kpr-dp" className="text-3xl font-bold tracking-tight text-emerald-600 tabular-nums">
                {state.dpPct}
                <span className="text-lg font-semibold">%</span>
              </output>
            </div>
            <Slider id="kpr-dp" className="mt-4" min={0} max={50} value={state.dpPct} onChange={(v) => patch({ dpPct: v })} valueText={`${state.dpPct} persen`} />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {DP_MARKS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => patch({ dpPct: m })}
                  className={cx(
                    "rounded-md px-2.5 py-1 text-[12px] font-medium tabular-nums ring-1 transition",
                    state.dpPct === m ? "bg-emerald-600 text-white ring-emerald-600" : "bg-white text-slate-600 ring-slate-200 hover:ring-slate-300",
                  )}
                >
                  {m}%
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard step={2} id="bunga" icon={Percent} title="Tenor & Suku Bunga" description="Umumnya bank memberi bunga fix promo di awal, lalu mengikuti bunga floating.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1.5 text-[12.5px] font-medium text-slate-700">Tenor pinjaman</p>
                <Select
                  variant="field"
                  ariaLabel="Tenor pinjaman"
                  value={state.tenorYears}
                  options={TENOR_SELECT}
                  onChange={(v) => patch({ tenorYears: v, ...(Number(state.fixedYears) > Number(v) ? { fixedYears: v } : {}) })}
                />
              </div>
              <div>
                <p className="mb-1.5 text-[12.5px] font-medium text-slate-700">Masa bunga fix</p>
                <Select variant="field" ariaLabel="Masa bunga fix" value={state.fixedYears} options={fixOptions} onChange={(v) => patch({ fixedYears: v })} />
              </div>
              <div>
                <FieldLabel htmlFor="kpr-fix" hint="per tahun">
                  Bunga fix
                </FieldLabel>
                <DecimalInput id="kpr-fix" value={state.fixedRate} onChange={(v) => patch({ fixedRate: v })} suffix={<UnitSuffix>%</UnitSuffix>} />
              </div>
              <div>
                <FieldLabel htmlFor="kpr-float" hint="per tahun">
                  Bunga floating
                </FieldLabel>
                <DecimalInput id="kpr-float" value={state.floatingRate} onChange={(v) => patch({ floatingRate: v })} suffix={<UnitSuffix>%</UnitSuffix>} />
              </div>
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-slate-400">
              Bunga floating mengikuti kebijakan bank & suku bunga acuan, jadi bisa naik-turun. Pakai angka yang agak
              konservatif (lebih tinggi) supaya aman.
            </p>
          </SectionCard>

          <SectionCard step={3} id="kemampuan" icon={Wallet} title="Dana Awal & Kemampuan Bayar" description="Biaya di luar DP dan cek apakah cicilan masih sehat untuk penghasilanmu.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="kpr-upfront" hint="dari harga properti">
                  Biaya akad, pajak & notaris
                </FieldLabel>
                <DecimalInput id="kpr-upfront" value={state.upfrontPct} onChange={(v) => patch({ upfrontPct: v })} suffix={<UnitSuffix>%</UnitSuffix>} />
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-400">
                  Provisi, administrasi, appraisal, asuransi, notaris & BPHTB — umumnya ±4–7%.
                </p>
              </div>
              <div>
                <FieldLabel htmlFor="kpr-income" hint="opsional">
                  Penghasilan bersih per bulan
                </FieldLabel>
                <MoneyInput id="kpr-income" value={state.monthlyIncome} onChange={(v) => patch({ monthlyIncome: v })} />
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-slate-400">Gabungan suami-istri jika joint income.</p>
              </div>
            </div>
          </SectionCard>
        </>
      }
      result={<KprSummary state={state} r={r} onReset={() => dispatch({ type: "reset" })} />}
      footer={
        <MobileResultBar
          items={[
            { label: "Cicilan fix", value: formatRupiah(r.paymentFixed), tone: "emerald" },
            ...(r.hasFloating ? [{ label: "Floating", value: formatRupiah(r.paymentFloating), tone: "amber" as const }] : []),
          ]}
        />
      }
    />
  );
}

function YearChart({ r }: { r: KprResult }) {
  const max = Math.max(...r.years.map((y) => y.principalPaid + y.interestPaid), 1);
  return (
    <div>
      <div className="flex h-32 items-end gap-[3px]" role="img" aria-label="Grafik pembayaran pokok dan bunga per tahun">
        {r.years.map((y) => {
          const total = y.principalPaid + y.interestPaid;
          return (
            <div
              key={y.year}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
              title={`Tahun ${y.year}: pokok ${formatRupiah(y.principalPaid)}, bunga ${formatRupiah(y.interestPaid)}`}
            >
              <div className="flex flex-col overflow-hidden rounded-t-[3px]" style={{ height: `${(total / max) * 100}%` }}>
                <div className="bg-amber-500" style={{ flexGrow: y.interestPaid }} />
                <div className="bg-emerald-600" style={{ flexGrow: y.principalPaid }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[10.5px] text-slate-400 tabular-nums">
        <span>Th 1</span>
        <span>Th {r.years.length}</span>
      </div>
      <div className="mt-2 flex gap-4 text-[11.5px] text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] bg-emerald-600" aria-hidden /> Pokok
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px] bg-amber-500" aria-hidden /> Bunga
        </span>
      </div>
    </div>
  );
}

function KprSummary({ state, r, onReset }: { state: KprState; r: KprResult; onReset: () => void }) {
  const dsrTone = r.dsr <= DSR_LIMIT ? "emerald" : r.dsr <= 0.4 ? "amber" : "rose";
  const toneClass = {
    emerald: { bar: "bg-emerald-500", text: "text-emerald-700", box: "bg-emerald-50 ring-emerald-200" },
    amber: { bar: "bg-amber-500", text: "text-amber-700", box: "bg-amber-50 ring-amber-200" },
    rose: { bar: "bg-rose-500", text: "text-rose-700", box: "bg-rose-50 ring-rose-200" },
  }[dsrTone];

  return (
    <section
      id="hasil"
      aria-labelledby="hasil-title"
      className="scroll-mt-32 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] md:scroll-mt-20"
    >
      <div className="relative overflow-hidden bg-slate-900 px-5 pt-5 pb-5 text-white sm:px-6">
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <h2 id="hasil-title" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Cicilan per bulan
          </h2>
          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-white/15 tabular-nums">
            {r.months / 12} th · {r.months} bln
          </span>
        </div>
        <p className="relative mt-3 text-[34px] leading-none font-bold tracking-tight tabular-nums" aria-live="polite">
          {formatRupiah(r.paymentFixed)}
        </p>
        <p className="relative mt-1.5 text-[12px] text-slate-400">
          {r.hasFloating ? `Tahun 1–${r.fixedMonths / 12} · bunga fix ${state.fixedRate}%` : `Sepanjang tenor · bunga fix ${state.fixedRate}%`}
        </p>

        {r.hasFloating && (
          <div className="relative mt-4 flex items-center justify-between gap-3 rounded-xl bg-amber-400/10 px-3.5 py-3 ring-1 ring-amber-300/25">
            <div>
              <p className="text-[11.5px] text-amber-200/80">Setelah masa fix · floating {state.floatingRate}%</p>
              <p className="mt-0.5 text-lg font-bold text-amber-300 tabular-nums">{formatRupiah(r.paymentFloating)}</p>
            </div>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11.5px] font-semibold text-amber-200 tabular-nums">
              {r.paymentJump >= 0 ? "+" : ""}
              {formatPercent(r.paymentJump, 0)}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <dl className="grid grid-cols-2 gap-3">
          {[
            ["Plafon pinjaman", r.loan, "text-slate-900"],
            ["Total bunga", r.totalInterest, "text-amber-700"],
            ["Total pembayaran", r.totalPaid, "text-slate-900"],
            ["Dana awal (DP + biaya)", r.cashNeeded, "text-emerald-700"],
          ].map(([label, value, color]) => (
            <div key={label as string} className="rounded-xl bg-slate-50 px-3.5 py-3 ring-1 ring-slate-200/70">
              <dt className="text-[11.5px] text-slate-500">{label}</dt>
              <dd className={cx("mt-0.5 text-[15px] font-bold tabular-nums", color as string)}>{formatRupiah(value as number)}</dd>
            </div>
          ))}
        </dl>

        {r.income > 0 && r.loan > 0 && (
          <div className={cx("rounded-xl p-3.5 ring-1", toneClass.box)}>
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-slate-700">
                <Landmark className="size-4 text-slate-500" aria-hidden /> Rasio cicilan / penghasilan
              </p>
              <p className={cx("text-[15px] font-bold tabular-nums", toneClass.text)}>{formatPercent(r.dsr)}</p>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white ring-1 ring-slate-900/5">
              <div className={cx("h-full rounded-full transition-[width] duration-500", toneClass.bar)} style={{ width: `${Math.min(r.dsr / 0.6, 1) * 100}%` }} />
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-slate-600">
              {dsrTone === "emerald"
                ? "Sehat — di bawah batas umum bank 30%."
                : dsrTone === "amber"
                  ? "Mepet — sebagian bank masih menerima hingga 40%, tapi ruang keuanganmu sempit."
                  : "Terlalu berat — besar kemungkinan ditolak bank."}{" "}
              Penghasilan ideal minimal <span className="font-semibold tabular-nums">{formatRupiah(r.minIncome)}</span>/bulan.
            </p>
          </div>
        )}

        {r.hasFloating && r.paymentJump > 0.25 && (
          <div role="alert" className="flex gap-2.5 rounded-xl bg-amber-50 p-3 text-[12.5px] leading-relaxed text-amber-900 ring-1 ring-amber-200">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
            <p>
              Cicilan naik <span className="font-semibold">{formatPercent(r.paymentJump, 0)}</span> setelah masa fix. Siapkan
              dana cadangan atau pertimbangkan pelunasan sebagian sebelum floating.
            </p>
          </div>
        )}

        {r.loan > 0 && (
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-[13px] font-semibold text-slate-900">Pokok vs bunga per tahun</h3>
            <YearChart r={r} />
          </div>
        )}

        {r.loan > 0 && (
          <details className="group rounded-xl border border-slate-200">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[13px] font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
              Tabel angsuran per tahun
              <ChevronDown className="size-4 text-slate-400 transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="max-h-72 overflow-auto border-t border-slate-100">
              <table className="w-full text-[12px] tabular-nums">
                <thead className="sticky top-0 bg-slate-50 text-[10.5px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Th</th>
                    <th className="px-2 py-2 text-right font-medium">Cicilan/bln</th>
                    <th className="px-2 py-2 text-right font-medium">Bunga</th>
                    <th className="px-3 py-2 text-right font-medium">Sisa pokok</th>
                  </tr>
                </thead>
                <tbody>
                  {r.years.map((y) => (
                    <tr key={y.year} className="border-t border-slate-100">
                      <td className="px-3 py-1.5 text-slate-500">
                        {y.year}
                        {y.phase === "fix" && <span className="ml-1 text-[9.5px] font-semibold text-emerald-600">FIX</span>}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium text-slate-900">{formatRupiah(y.monthlyPayment)}</td>
                      <td className="px-2 py-1.5 text-right text-amber-700">{formatRupiah(y.interestPaid)}</td>
                      <td className="px-3 py-1.5 text-right text-slate-600">{formatRupiah(y.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}

        <ResultActions getText={() => kprWhatsApp(state, r)} onReset={onReset} />
      </div>
    </section>
  );
}
