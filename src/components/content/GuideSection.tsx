import { Bike, Calculator, ChevronDown, Layers, Target } from "lucide-react";
import { FAQ_ITEMS } from "./faq";

const STEPS = [
  {
    icon: Layers,
    title: "Biaya bahan per porsi",
    formula: "(Harga beli ÷ Isi kemasan) × Takaran",
    body: "Ubah harga kemasan jadi harga per gram/ml/pcs, lalu kalikan dengan takaran yang dipakai di satu porsi.",
  },
  {
    icon: Calculator,
    title: "Total HPP",
    formula: "Bahan baku + Kemasan + Operasional",
    body: "Jangan lupa biaya tersembunyi: cup, sedotan, gas, listrik, sampai upah karyawan yang dibagi per porsi.",
  },
  {
    icon: Target,
    title: "Harga jual offline",
    formula: "HPP ÷ (1 − Target margin)",
    body: "Margin dihitung dari harga jual, jadi laba bersih yang kamu targetkan benar-benar masuk kantong.",
  },
  {
    icon: Bike,
    title: "Harga aplikasi online",
    formula: "Harga offline ÷ (1 − Komisi)",
    body: "Markup otomatis supaya setelah dipotong komisi GoFood/GrabFood/ShopeeFood, laba bersihmu tetap utuh.",
  },
];

export function GuideSection() {
  return (
    <section id="cara-hitung" aria-labelledby="cara-hitung-title" className="scroll-mt-24">
      <div className="max-w-2xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Cara hitung</p>
        <h2 id="cara-hitung-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
          Rumus HPP & harga jual yang dipakai HitungCuan
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
          Empat langkah sederhana yang biasa dipakai konsultan F&B — sekarang otomatis, real-time, dan gratis.
        </p>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10">
                <s.icon className="size-[18px]" aria-hidden />
              </span>
              <span className="text-[28px] font-bold text-slate-100 tabular-nums">0{i + 1}</span>
            </div>
            <h3 className="mt-4 text-[15px] font-semibold text-slate-900">{s.title}</h3>
            <p className="mt-2 rounded-lg bg-slate-900 px-3 py-2 font-mono text-[12px] text-emerald-300">{s.formula}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-500">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FaqSection({
  items = FAQ_ITEMS,
  description = "Seputar HPP, margin, dan strategi harga di aplikasi pesan-antar.",
}: {
  items?: { q: string; a: string }[];
  description?: string;
}) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-32 md:scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-600">FAQ</p>
          <h2 id="faq-title" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
            Pertanyaan yang sering ditanyakan
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{description}</p>
        </div>
        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {items.map((item, i) => (
            <details key={item.q} className="group px-5 py-1" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[14.5px] font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="size-4 shrink-0 text-slate-400 transition group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pb-4 text-[14px] leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
