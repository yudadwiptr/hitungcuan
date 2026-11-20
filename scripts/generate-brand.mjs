// Generate aset brand dari brand/logo-source.jpg (wordmark "hitungcuan." di latar krem):
// - public/brand/logo.png         wordmark transparan & di-trim
// - src/app/icon.png, favicon.ico, apple-icon.png, ikon PWA  → monogram "h." di kotak hijau
// Jalankan: node scripts/generate-brand.mjs
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const out = (p) => new URL(p, root);

const GREEN = [9, 118, 86];
const AMBER = [243, 166, 26];
const BG = [250, 247, 238];

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// 1) Latar krem → transparan. Tiap piksel dipetakan ke warna foreground terdekat
//    (hijau / amber) dengan alpha sesuai jaraknya dari warna latar (anti-alias tetap halus).
const src = sharp(new URL("brand/logo-source.jpg", root).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const { data, info } = await src.removeAlpha().raw().toBuffer({ resolveWithObject: true });
const rgba = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  const p = [data[i], data[i + 1], data[i + 2]];
  const fg = p[0] - p[2] > 20 ? AMBER : GREEN;
  const a = Math.min(1, Math.max(0, (dist(p, BG) - 10) / (dist(fg, BG) - 22)));
  rgba[j] = fg[0];
  rgba[j + 1] = fg[1];
  rgba[j + 2] = fg[2];
  rgba[j + 3] = Math.round(a * 255);
}
const raw = { raw: { width: info.width, height: info.height, channels: 4 } };

// bounding box konten
let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
for (let y = 0; y < info.height; y++)
  for (let x = 0; x < info.width; x++)
    if (rgba[(y * info.width + x) * 4 + 3] > 24) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };

await mkdir(out("public/brand/"), { recursive: true });
const wordmark = await sharp(rgba, raw).extract(box).png().toBuffer();
await sharp(wordmark).resize({ height: 160 }).png({ compressionLevel: 9 }).toFile(out("public/brand/logo.png").pathname.replace(/^\/([A-Za-z]:)/, "$1"));

// 2) Monogram "h." — ambil glyph "h" (kolom pertama sampai celah kosong) + titik amber.
const colHasInk = (x) => {
  for (let y = minY; y <= maxY; y++) if (rgba[(y * info.width + x) * 4 + 3] > 24) return true;
  return false;
};
let hEnd = minX;
while (colHasInk(hEnd + 1)) hEnd++;
let hTop = info.height, hBottom = 0;
for (let y = minY; y <= maxY; y++)
  for (let x = minX; x <= hEnd; x++)
    if (rgba[(y * info.width + x) * 4 + 3] > 24) {
      hTop = Math.min(hTop, y);
      hBottom = Math.max(hBottom, y);
    }
const hBox = { left: minX, top: hTop, width: hEnd - minX + 1, height: hBottom - hTop + 1 };
// glyph putih: pakai alpha dari ekstrak, warna diganti putih
const hRaw = await sharp(rgba, raw).extract(hBox).raw().toBuffer();
for (let i = 0; i < hRaw.length; i += 4) hRaw[i] = hRaw[i + 1] = hRaw[i + 2] = 255;
const hGlyph = { raw: { width: hBox.width, height: hBox.height, channels: 4 } };

async function monogram(size, { rounded = true, scale = 1 } = {}) {
  const S = 512;
  const glyphH = Math.round(300 * scale);
  const glyphW = Math.round((hBox.width / hBox.height) * glyphH);
  const dot = Math.round(glyphH * 0.27);
  const gap = Math.round(glyphH * 0.06);
  const totalW = glyphW + gap + dot;
  const left = Math.round((S - totalW) / 2);
  const top = Math.round((S - glyphH) / 2);
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0E8C66"/><stop offset="1" stop-color="#086A4D"/></linearGradient></defs>
    <rect width="${S}" height="${S}" rx="${rounded ? 120 : 0}" fill="url(#g)"/>
    <circle cx="${left + glyphW + gap + dot / 2}" cy="${top + glyphH - dot / 2}" r="${dot / 2}" fill="rgb(${AMBER.join(",")})"/>
  </svg>`;
  const glyph = await sharp(hRaw, hGlyph).resize(glyphW, glyphH).png().toBuffer();
  const composed = await sharp(Buffer.from(bg)).composite([{ input: glyph, left, top }]).png().toBuffer();
  return sharp(composed).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
}

const p = (u) => out(u).pathname.replace(/^\/([A-Za-z]:)/, "$1");
await writeFile(p("src/app/icon.png"), await monogram(512));
await writeFile(p("src/app/apple-icon.png"), await monogram(180, { rounded: false }));
await writeFile(p("public/icon-192.png"), await monogram(192));
await writeFile(p("public/icon-512.png"), await monogram(512));
await writeFile(p("public/icon-maskable-512.png"), await monogram(512, { rounded: false, scale: 0.8 }));

// favicon.ico (berisi PNG 16/32/48)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => monogram(s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
await writeFile(p("src/app/favicon.ico"), Buffer.concat([header, ...dir, ...pngs]));

const meta = await sharp(p("public/brand/logo.png")).metadata();
console.log(`logo.png ${meta.width}x${meta.height}, glyph h ${hBox.width}x${hBox.height}`);
