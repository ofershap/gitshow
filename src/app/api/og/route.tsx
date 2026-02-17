import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
        fontFamily: "system-ui, sans-serif",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <span
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#60a5fa",
            letterSpacing: "-2px",
          }}
        >
          GitShow
        </span>

        <span
          style={{
            fontSize: "28px",
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Your GitHub profile, but way better
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginTop: "48px",
          background: "rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "20px 40px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ fontSize: "24px", color: "#6b7280" }}>
          github.com/username
        </span>
        <span style={{ fontSize: "28px", color: "#60a5fa" }}>→</span>
        <span style={{ fontSize: "24px", color: "#ffffff", fontWeight: 700 }}>
          gitshow.dev/username
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "40px",
        }}
      >
        {["npm downloads", "auto-categories", "tech stack", "project timeline"].map(
          (label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: "12px",
                padding: "8px 16px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ fontSize: "16px", color: "#d1d5db" }}>
                {label}
              </span>
            </div>
          )
        )}
      </div>

      <span
        style={{
          marginTop: "48px",
          fontSize: "18px",
          color: "#4b5563",
        }}
      >
        gitshow.dev
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
