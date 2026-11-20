// Generate favicon.ico, apple-icon.png & ikon PWA dari src/app/icon.svg.
// Jalankan: node scripts/generate-icons.mjs
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile(new URL("../src/app/icon.svg", import.meta.url), "utf8");
// Versi full-bleed (tanpa sudut bulat) untuk iOS & maskable — OS yang memotong sudutnya.
const fullBleed = (pad = 0) => {
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace('rx="11"', 'rx="0"');
  const s = 40 + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${s} ${s}"><rect x="${-pad}" y="${-pad}" width="${s}" height="${s}" fill="#059669"/>${inner}</svg>`;
};

const png = (src, size) => sharp(Buffer.from(src), { density: 1200 }).resize(size, size).png().toBuffer();

// ICO berisi PNG (didukung semua browser modern)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => png(svg, s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
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
await writeFile(new URL("../src/app/favicon.ico", import.meta.url), Buffer.concat([header, ...dir, ...pngs]));

await writeFile(new URL("../src/app/apple-icon.png", import.meta.url), await png(fullBleed(0), 180));
await writeFile(new URL("../public/icon-192.png", import.meta.url), await png(svg, 192));
await writeFile(new URL("../public/icon-512.png", import.meta.url), await png(svg, 512));
await writeFile(new URL("../public/icon-maskable-512.png", import.meta.url), await png(fullBleed(6), 512));
console.log("Ikon berhasil dibuat.");
