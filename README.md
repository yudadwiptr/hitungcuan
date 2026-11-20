# HitungCuan

Kalkulator HPP (Harga Pokok Penjualan) & simulasi harga jual untuk UMKM kuliner Indonesia.
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Lucide Icons.

## Fitur

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
    calculator/        HppCalculator (state + useMemo), section input, SummaryPanel, CostDonut
    monetization/      AdSlot, UpsellTemplateCard, AffiliateTools
    content/           Panduan rumus & FAQ (konten SEO)
    brand/, layout/    Logo, header, footer
scripts/generate-icons.mjs   generate favicon.ico & PNG ikon dari src/app/icon.svg
```

Ubah logo? Edit `src/app/icon.svg` lalu jalankan `node scripts/generate-icons.mjs`.
