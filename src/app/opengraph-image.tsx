import { ImageResponse } from "next/og";

export const alt = "HitungCuan — Kalkulator HPP & Harga Jual Kuliner UMKM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Mark({ s }: { s: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="11" fill="#059669" />
      <path d="M0 11C0 4.925 4.925 0 11 0h18c6.075 0 11 4.925 11 11v4C27 15 13 22 0 30V11Z" fill="#10B981" opacity=".55" />
      <rect x="9" y="22.5" width="5.5" height="9" rx="1.75" fill="#fff" fillOpacity=".6" />
      <rect x="17.25" y="17" width="5.5" height="14.5" rx="1.75" fill="#fff" fillOpacity=".82" />
      <rect x="25.5" y="11" width="5.5" height="20.5" rx="1.75" fill="#fff" />
      <circle cx="13" cy="13.5" r="4.25" fill="#FBBF24" />
    </svg>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #E2E8F0" }}>
      <span style={{ fontSize: 22, color: "#64748B" }}>{label}</span>
      <span style={{ fontSize: 26, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #F8FAFC 0%, #ECFDF5 100%)",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Mark s={64} />
            <span style={{ fontSize: 40, fontWeight: 800, color: "#0F172A", display: "flex" }}>
              Hitung<span style={{ color: "#059669" }}>Cuan</span>
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 60, fontWeight: 800, color: "#0F172A", lineHeight: 1.1, letterSpacing: -1.5 }}>
              Kalkulator HPP &amp; Harga Jual Kuliner
            </span>
            <span style={{ fontSize: 26, color: "#475569", marginTop: 20, lineHeight: 1.4 }}>
              Hitung modal per porsi & harga GoFood/GrabFood yang tetap untung. Gratis untuk UMKM.
            </span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["Real-time", "Komisi ojol", "Salin ke WhatsApp"].map((t) => (
              <span
                key={t}
                style={{ fontSize: 20, fontWeight: 600, color: "#047857", background: "#D1FAE5", padding: "8px 16px", borderRadius: 999 }}
              >
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
            <span style={{ fontSize: 16, color: "#6EE7B7", letterSpacing: 2, fontWeight: 700 }}>HPP PER PORSI</span>
            <span style={{ fontSize: 22, color: "#CBD5E1", marginTop: 6 }}>Es Kopi Susu Gula Aren</span>
            <span style={{ fontSize: 54, color: "#FFFFFF", fontWeight: 800, marginTop: 10 }}>Rp 9.707</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "12px 32px 24px" }}>
            <Row label="Harga offline" value="Rp 15.000" color="#059669" />
            <Row label="Harga aplikasi" value="Rp 19.000" color="#D97706" />
            <Row label="Laba bersih" value="Rp 5.293" color="#059669" />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
