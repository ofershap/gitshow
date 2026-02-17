import { ImageResponse } from "next/og";
import { fetchProfile, NotFoundError } from "@/lib/github";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const data = await fetchProfile(username);
    const { user, totalStars, repos, languages, categories, npmStats } = data;
    const topLangs = languages.slice(0, 4);
    const topCategories = categories.slice(0, 4);

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #09090b 0%, #111113 40%, #0d1117 70%, #09090b 100%)",
          padding: "50px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url}
            alt=""
            width={110}
            height={110}
            style={{
              borderRadius: "22px",
              border: "3px solid rgba(20,184,166,0.3)",
              boxShadow: "0 0 30px rgba(20,184,166,0.12)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "40px",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              {user.name ?? user.login}
            </span>
            <span style={{ fontSize: "18px", color: "#14b8a6" }}>
              @{user.login}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "36px",
            marginTop: "32px",
            position: "relative",
          }}
        >
          <StatBox value={repos.length.toString()} label="Projects" color="#14b8a6" />
          <StatBox value={fmtNum(totalStars)} label="Stars" color="#f59e0b" />
          <StatBox value={fmtNum(user.followers)} label="Followers" color="#10b981" />
          {npmStats && npmStats.totalDownloads > 0 ? (
            <StatBox value={fmtNum(npmStats.totalDownloads)} label="npm dl/mo" color="#ef4444" />
          ) : null}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "28px", position: "relative" }}>
          {topCategories.map((cat) => (
            <div
              key={cat.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(20,184,166,0.08)",
                borderRadius: "14px",
                padding: "8px 16px",
                border: "1px solid rgba(20,184,166,0.12)",
              }}
            >
              <span style={{ fontSize: "16px" }}>{cat.emoji}</span>
              <span style={{ fontSize: "14px", color: "#d1d5db" }}>
                {cat.label}
              </span>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                {cat.repos.length}
              </span>
            </div>
          ))}
        </div>

        {topLangs.length > 0 ? (
          <div style={{ display: "flex", gap: "10px", marginTop: "16px", position: "relative" }}>
            {topLangs.map((lang) => (
              <div
                key={lang.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "14px",
                  padding: "8px 16px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "5px",
                    background: lang.color,
                    boxShadow: `0 0 8px ${lang.color}40`,
                  }}
                />
                <span style={{ fontSize: "14px", color: "#9ca3af" }}>
                  {lang.name} {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #14b8a6, #f59e0b)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            GitShow
          </span>
          <span style={{ fontSize: "16px", color: "#6b7280" }}>
            gitshow.me/{user.login}
          </span>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response("User not found", { status: 404 });
    }
    return new Response("Error generating image", { status: 500 });
  }
}

function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        borderRadius: "16px",
        padding: "12px 20px",
        border: `1px solid ${color}20`,
      }}
    >
      <span
        style={{ fontSize: "30px", fontWeight: 700, color: "#ffffff" }}
      >
        {value}
      </span>
      <span style={{ fontSize: "12px", color: "#6b7280" }}>{label}</span>
    </div>
  );
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
