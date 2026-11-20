import type { Metadata } from "next";
import { CalendarClock, Home, Landmark, Percent, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { FormulaGuide } from "@/components/content/FormulaGuide";
import { FaqSection } from "@/components/content/GuideSection";
import { KprCalculator } from "@/components/kpr/KprCalculator";
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
              Rencanakan rumah impian dengan angka yang jujur
            </>
          }
          title="Kalkulator Simulasi"
          highlight="KPR Rumah"
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
              { icon: Landmark, title: "Plafon pinjaman", formula: "Harga properti − DP", body: "Semakin besar DP, semakin kecil pokok pinjaman dan total bunga yang dibayar." },
              { icon: Percent, title: "Cicilan masa fix", formula: "P × r ÷ (1 − (1 + r)^−n)", body: "r = bunga fix ÷ 12, n = total bulan tenor. Cicilan tetap selama masa fix." },
              { icon: CalendarClock, title: "Cicilan floating", formula: "Sisa pokok × r' ÷ (1 − (1 + r')^−n')", body: "Dihitung ulang dari sisa pokok dengan bunga floating untuk sisa bulan tenor." },
              { icon: ShieldCheck, title: "Kemampuan bayar", formula: "Cicilan ÷ Penghasilan ≤ 30%", body: "Batas aman yang umum dipakai bank untuk menilai kelayakan KPR." },
            ]}
          />
          <OtherTools current="/kpr" />
          <FaqSection items={FAQ} description="Seputar bunga KPR, cicilan, dan persiapan dana sebelum akad." />
        </div>
      </main>
    </>
  );
}
