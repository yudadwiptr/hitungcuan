import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

interface OgOptions {
  title: string;
  subtitle: string;
  chips: string[];
  card: { eyebrow: string; caption: string; big: string; rows: { label: string; value: string; color: string }[] };
}

/** Template OG image bersama untuk semua halaman kalkulator. */
export async function renderOg({ title, subtitle, chips, card }: OgOptions) {
  const logo = await readFile(join(process.cwd(), "public/brand/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #FAF8F1 0%, #ECFDF5 100%)",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={272} height={50} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 56, fontWeight: 800, color: "#0F172A", lineHeight: 1.1, letterSpacing: -1.5 }}>{title}</span>
            <span style={{ fontSize: 25, color: "#475569", marginTop: 20, lineHeight: 1.4 }}>{subtitle}</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {chips.map((t) => (
              <span key={t} style={{ fontSize: 20, fontWeight: 600, color: "#047857", background: "#D1FAE5", padding: "8px 16px", borderRadius: 999 }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            width: 420,
            display: "flex",
            flexDirection: "column",
            background: "#FFFFFF",
            borderRadius: 28,
            border: "1px solid #E2E8F0",
            boxShadow: "0 30px 60px -20px rgba(15,23,42,0.25)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", background: "#0F172A", padding: "28px 32px" }}>
            <span style={{ fontSize: 16, color: "#6EE7B7", letterSpacing: 2, fontWeight: 700 }}>{card.eyebrow}</span>
            <span style={{ fontSize: 22, color: "#CBD5E1", marginTop: 6 }}>{card.caption}</span>
            <span style={{ fontSize: 52, color: "#FFFFFF", fontWeight: 800, marginTop: 10 }}>{card.big}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "12px 32px 24px" }}>
            {card.rows.map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: 22, color: "#64748B" }}>{r.label}</span>
                <span style={{ fontSize: 26, fontWeight: 700, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
