# HitungCuan

Kalkulator cuan gratis untuk Indonesia — Next.js (App Router) · TypeScript · Tailwind CSS v4 · Lucide Icons.
Built by [Yuma Studio](https://yumastudio.digital/).

| Halaman | Kalkulator |
| --- | --- |
| `/` | HPP & harga jual kuliner UMKM (offline + GoFood/GrabFood/ShopeeFood) |
| `/jualan-online` | Harga jual marketplace & reseller (Shopee, Tokopedia/TikTok Shop, Lazada, FB/WA) + perbandingan platform |
| `/kpr` | Simulasi KPR bunga fix → floating, total bunga, dana awal, rasio cicilan/gaji, tabel angsuran |

## Fitur kalkulator HPP kuliner

- **Bahan baku dinamis** — biaya per porsi = (harga beli ÷ isi kemasan) × takaran, plus kebutuhan per batch.
- **Kemasan & operasional** per porsi, dengan quick-add item umum.
- **Simulasi margin** 10–80% (margin dari harga jual), pembulatan harga ke atas (100/500/1.000).
- **Komisi aplikasi online** (0% dine-in, 20% ojol, custom) — harga online = harga offline ÷ (1 − komisi), jadi laba bersih tetap utuh.
- **Panel ringkasan sticky** + donut chart proporsi harga, peringatan margin tipis (< 15%).
- **Salin ringkasan ke WhatsApp** & reset; data tersimpan otomatis di `localStorage` (tidak dikirim ke server).
- **Monetisasi non-intrusif**: slot AdSense 728×90 / 320×100, kartu upsell template Excel (modal preview), box tools afiliasi.
- **SEO**: metadata lengkap, Open Graph image dinamis, JSON-LD (WebApplication + FAQPage), sitemap, robots, web manifest, favicon/apple-icon.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Salin `.env.example` → `.env.local` dan isi `NEXT_PUBLIC_SITE_URL` (wajib saat produksi) serta ID AdSense / link afiliasi jika sudah ada.

## Struktur

```
src/
  app/                 layout, page, metadata routes (OG, sitemap, robots, manifest, ikon)
  lib/
    hpp.ts             tipe & fungsi murni `calculate()` — inti rumus
    format.ts          format Rupiah & parsing angka gaya Indonesia (deterministik, aman hydration)
    defaults.ts        data contoh "Es Kopi Susu Gula Aren"
    whatsapp.ts        builder teks ringkasan WhatsApp + clipboard
    site.ts            konfigurasi situs, env, link afiliasi
  components/
    calculator/        HppCalculator (state + useMemo), section input, SummaryPanel
    marketplace/, kpr/ kalkulator jualan online & KPR (logika di lib/marketplace.ts, lib/kpr.ts)
    ui/                form controls (Select, Slider, …), CalculatorLayout, CostDonut, autosave hook
    monetization/      AdSlot, UpsellTemplateCard, AffiliateTools
    content/           Panduan rumus & FAQ (konten SEO)
    brand/, layout/    Logo, header, footer
scripts/generate-brand.mjs   logo transparan + favicon/ikon dari brand/logo-source.jpg
```

Ubah logo? Ganti `brand/logo-source.jpg` (wordmark di latar krem) lalu jalankan `node scripts/generate-brand.mjs`.
