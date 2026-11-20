import type { Metadata } from "next";
import { CalendarClock, Home, Landmark, Percent, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Eq, FormulaGuide, Frac, Num, Op, Pow, Term, Var } from "@/components/content/FormulaGuide";
import { FaqSection } from "@/components/content/GuideSection";
import { KprCalculator } from "@/components/kpr/KprCalculator";
import { KprHeadline } from "@/components/kpr/KprHeadline";
import { OtherTools } from "@/components/layout/OtherTools";
import { PageHero } from "@/components/layout/PageHero";
import { AdSlot } from "@/components/monetization/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";

const TITLE = "Kalkulator Simulasi KPR — Cicilan Rumah Bunga Fix & Floating";
const DESCRIPTION =
  "Simulasi KPR rumah: hitung cicilan per bulan dengan bunga fix lalu floating, total bunga, dana awal (DP + biaya akad), tabel angsuran, dan cek rasio cicilan terhadap penghasilan. Gratis & real-time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "simulasi KPR",
    "kalkulator KPR",
    "cicilan rumah",
    "bunga fix floating",
    "hitung cicilan KPR",
    "tabel angsuran KPR",
    "DP rumah",
  ],
  alternates: { canonical: "/kpr" },
  openGraph: { url: "/kpr", title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    q: "Apa bedanya bunga fix dan floating pada KPR?",
    a: "Bunga fix tetap selama periode tertentu (misalnya 1–5 tahun pertama), sehingga cicilan tidak berubah. Setelah itu berlaku bunga floating yang mengikuti kebijakan bank dan suku bunga acuan, sehingga cicilan bisa naik atau turun. Kalkulator ini menghitung ulang cicilan dari sisa pokok saat masa floating dimulai.",
  },
  {
    q: "Bagaimana rumus cicilan KPR?",
    a: "Bank umumnya memakai metode anuitas: Cicilan = Pokok × r ÷ (1 − (1 + r)^−n), dengan r = bunga tahunan ÷ 12 dan n = jumlah bulan. Di awal tenor porsi bunga lebih besar, lalu porsi pokok makin besar seiring waktu.",
  },
  {
    q: "Berapa maksimal cicilan KPR dari gaji?",
    a: "Patokan umum bank adalah cicilan total (termasuk utang lain) tidak lebih dari sekitar 30% penghasilan bersih, meski beberapa bank menerima hingga 35–40%. Semakin rendah rasionya, semakin besar peluang disetujui dan semakin longgar keuanganmu.",
  },
  {
    q: "Selain DP, biaya apa saja yang perlu disiapkan saat akad KPR?",
    a: "Biasanya ada biaya provisi, administrasi, appraisal, asuransi jiwa & kebakaran, notaris/PPAT, serta pajak BPHTB. Totalnya sering berkisar 4–7% dari harga properti, tergantung bank dan daerah.",
  },
  {
    q: "Apakah hasil simulasi ini sama dengan perhitungan bank?",
    a: "Hasilnya estimasi yang mendekati metode anuitas bank. Angka final bisa berbeda karena perbedaan suku bunga, pembulatan, asuransi, dan kebijakan masing-masing bank. Selalu minta simulasi resmi sebelum akad.",
  },
];

export default function KprPage() {
  return (
    <>
      <JsonLd name="Kalkulator Simulasi KPR — HitungCuan" description={DESCRIPTION} path="/kpr" faq={FAQ} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="pt-5">
          <AdSlot />
        </div>

        <PageHero
          eyebrow={
            <>
              <Home className="size-3.5 text-emerald-600" aria-hidden />
              Kalkulator Simulasi KPR Rumah
            </>
          }
          heading={<KprHeadline />}
          description="Hitung cicilan KPR dengan skema bunga fix lalu floating seperti penawaran bank sungguhan. Lihat total bunga, dana awal yang harus disiapkan, dan apakah cicilannya masih sehat untuk penghasilanmu."
          points={[
            { icon: Zap, label: "Real-time" },
            { icon: TrendingUp, label: "Bunga fix + floating" },
            { icon: ShieldCheck, label: "Cek rasio cicilan/gaji" },
          ]}
        />

        <div id="kalkulator" className="scroll-mt-32 md:scroll-mt-24">
          <KprCalculator />
        </div>

        <div className="mt-20 space-y-20">
          <FormulaGuide
            title="Cara HitungCuan menghitung simulasi KPR"
            description="Metode anuitas — sama seperti yang umum dipakai bank di Indonesia."
            steps={[
              {
                icon: Landmark,
                title: "Plafon pinjaman",
                formulaLabel: "Harga properti dikurangi DP",
                formula: (
                  <Eq>
                    <Term>Harga properti</Term>
                    <Op>−</Op>
                    <Term>DP</Term>
                  </Eq>
                ),
                body: "Semakin besar DP, semakin kecil pokok pinjaman dan total bunga yang dibayar.",
              },
              {
                icon: Percent,
                title: "Cicilan masa fix",
                formulaLabel: "P kali r dibagi satu dikurangi satu tambah r pangkat minus n",
                formula: (
                  <Frac
                    num={
                      <>
                        <Var>P</Var>
                        <Op>×</Op>
                        <Var>r</Var>
                      </>
                    }
                    den={
                      <>
                        <Num>1</Num>
                        <Op>−</Op>
                        <Pow
                          base={
                            <>
                              <Num>(1</Num>
                              <Op>+</Op>
                              <Var>r</Var>
                              <Num>)</Num>
                            </>
                          }
                          exp="−n"
                        />
                      </>
                    }
                  />
                ),
                legend: "P = plafon · r = bunga fix ÷ 12 · n = total bulan",
                body: "Metode anuitas: cicilan sama setiap bulan selama masa bunga fix.",
              },
              {
                icon: CalendarClock,
                title: "Cicilan floating",
                formulaLabel: "S kali r aksen dibagi satu dikurangi satu tambah r aksen pangkat minus n aksen",
                formula: (
                  <Frac
                    num={
                      <>
                        <Var>S</Var>
                        <Op>×</Op>
                        <Var>r′</Var>
                      </>
                    }
                    den={
                      <>
                        <Num>1</Num>
                        <Op>−</Op>
                        <Pow
                          base={
                            <>
                              <Num>(1</Num>
                              <Op>+</Op>
                              <Var>r′</Var>
                              <Num>)</Num>
                            </>
                          }
                          exp="−n′"
                        />
                      </>
                    }
                  />
                ),
                legend: "S = sisa pokok · r′ = bunga floating ÷ 12 · n′ = sisa bulan",
                body: "Dihitung ulang dari sisa pokok saat masa fix berakhir, untuk sisa tenor.",
              },
              {
                icon: ShieldCheck,
                title: "Kemampuan bayar",
                formulaLabel: "Cicilan dibagi penghasilan, maksimal 30 persen",
                formula: (
                  <Eq>
                    <Frac num={<Term>Cicilan</Term>} den={<Term>Penghasilan</Term>} />
                    <Op>≤</Op>
                    <Term accent>30%</Term>
                  </Eq>
                ),
                body: "Batas aman yang umum dipakai bank untuk menilai kelayakan KPR.",
              },
            ]}
          />
          <OtherTools current="/kpr" />
          <FaqSection items={FAQ} description="Seputar bunga KPR, cicilan, dan persiapan dana sebelum akad." />
        </div>
      </main>
    </>
  );
}
