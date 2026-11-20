import { Bike, Calculator, ChevronDown, Layers, Target } from "lucide-react";
import { FAQ_ITEMS } from "./faq";
import { Eq, FormulaGuide, Frac, Num, Op, Term } from "./FormulaGuide";

export function GuideSection() {
  return (
    <FormulaGuide
      title="Rumus HPP & harga jual yang dipakai HitungCuan"
      description="Empat langkah sederhana yang biasa dipakai konsultan F&B — sekarang otomatis, real-time, dan gratis."
      steps={[
        {
          icon: Layers,
          title: "Biaya bahan per porsi",
          formulaLabel: "Harga beli dibagi isi kemasan, dikali takaran",
          formula: (
            <Eq>
              <Frac num={<Term>Harga beli</Term>} den={<Term>Isi kemasan</Term>} />
              <Op>×</Op>
              <Term>Takaran</Term>
            </Eq>
          ),
          body: "Ubah harga kemasan jadi harga per gram/ml/pcs, lalu kalikan dengan takaran yang dipakai di satu porsi.",
        },
        {
          icon: Calculator,
          title: "Total HPP",
          formulaLabel: "Bahan baku ditambah kemasan ditambah operasional",
          formula: (
            <Eq>
              <Term>Bahan baku</Term>
              <Op>+</Op>
              <Term>Kemasan</Term>
              <Op>+</Op>
              <Term>Operasional</Term>
            </Eq>
          ),
          body: "Jangan lupa biaya tersembunyi: cup, sedotan, gas, listrik, sampai upah karyawan yang dibagi per porsi.",
        },
        {
          icon: Target,
          title: "Harga jual offline",
          formulaLabel: "HPP dibagi satu dikurangi target margin",
          formula: (
            <Frac
              num={<Term accent>HPP</Term>}
              den={
                <>
                  <Num>1</Num>
                  <Op>−</Op>
                  <Term>Margin</Term>
                </>
              }
            />
          ),
          body: "Margin dihitung dari harga jual, jadi laba bersih yang kamu targetkan benar-benar masuk kantong.",
        },
        {
          icon: Bike,
          title: "Harga aplikasi online",
          formulaLabel: "Harga offline dibagi satu dikurangi komisi",
          formula: (
            <Frac
              num={<Term accent>Harga offline</Term>}
              den={
                <>
                  <Num>1</Num>
                  <Op>−</Op>
                  <Term>Komisi</Term>
                </>
              }
            />
          ),
          body: "Markup otomatis supaya setelah dipotong komisi GoFood/GrabFood/ShopeeFood, laba bersihmu tetap utuh.",
        },
      ]}
    />
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
