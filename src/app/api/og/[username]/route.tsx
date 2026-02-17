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
    const { user, totalStars, totalForks, repos, languages, categories, npmStats } = data;
    const topLangs = languages.slice(0, 4);
    const topCategories = categories.slice(0, 4);

    const rank = starRank(totalStars);

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#09090b",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow orbs — matching the website */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-60px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 65%)",
          }}
        />

        {/* Main card area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "32px",
            padding: "36px 40px",
            borderRadius: "24px",
            background: "#111113",
            border: "1px solid rgba(20,184,166,0.12)",
            boxShadow: "0 0 40px rgba(20,184,166,0.08), 0 0 80px rgba(20,184,166,0.03)",
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Inner card glow */}
          <div
            style={{
              position: "absolute",
              top: "-60px",
              right: "-40px",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Header: Avatar + Name + Bio */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar_url}
                alt=""
                width={100}
                height={100}
                style={{
                  borderRadius: "20px",
                  border: "2px solid rgba(20,184,166,0.35)",
                  boxShadow: "0 0 24px rgba(20,184,166,0.15), 0 0 60px rgba(20,184,166,0.06)",
                }}
              />
              {/* Rank badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  right: "-6px",
                  display: "flex",
                  background: "linear-gradient(135deg, #14b8a6, #10b981)",
                  borderRadius: "20px",
                  padding: "3px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "0.04em",
                  boxShadow: "0 2px 12px rgba(20,184,166,0.4)",
                }}
              >
                {rank}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  textShadow: "0 0 40px rgba(20,184,166,0.3)",
                }}
              >
                {user.name ?? user.login}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#14b8a6",
                  fontFamily: "monospace",
                }}
              >
                @{user.login}
              </span>
              {user.bio && (
                <span
                  style={{
                    fontSize: "14px",
                    color: "#a1a1aa",
                    marginTop: "6px",
                    lineHeight: 1.4,
                    maxWidth: "600px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {user.bio.length > 80 ? user.bio.slice(0, 80) + "..." : user.bio}
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
              position: "relative",
            }}
          >
            <StatBox icon="📦" value={repos.length.toString()} label="Projects" color="#14b8a6" />
            <StatBox icon="⭐" value={fmtNum(totalStars)} label="Stars" color="#f59e0b" />
            <StatBox icon="🍴" value={fmtNum(totalForks)} label="Forks" color="#06b6d4" />
            <StatBox icon="👥" value={fmtNum(user.followers)} label="Followers" color="#10b981" />
            {npmStats && npmStats.totalDownloads > 0 ? (
              <StatBox icon="📥" value={fmtNum(npmStats.totalDownloads)} label="npm dl/mo" color="#ef4444" />
            ) : null}
          </div>

          {/* Categories */}
          {topCategories.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "20px",
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              {topCategories.map((cat) => (
                <div
                  key={cat.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(20,184,166,0.06)",
                    borderRadius: "12px",
                    padding: "6px 14px",
                    border: "1px solid rgba(20,184,166,0.10)",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{cat.emoji}</span>
                  <span style={{ fontSize: "13px", color: "#d4d4d8", fontWeight: 500 }}>
                    {cat.label}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#14b8a6",
                      fontWeight: 600,
                      background: "rgba(20,184,166,0.10)",
                      borderRadius: "6px",
                      padding: "1px 6px",
                    }}
                  >
                    {cat.repos.length}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {topLangs.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "12px",
                position: "relative",
              }}
            >
              {topLangs.map((lang) => (
                <div
                  key={lang.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                    padding: "5px 12px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "4px",
                      background: lang.color,
                      boxShadow: `0 0 6px ${lang.color}50`,
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
                    {lang.name} {lang.percentage}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "16px",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #14b8a6, #f59e0b)",
                  backgroundClip: "text",
                  color: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                GitShow
              </span>
              <span style={{ fontSize: "12px", color: "#3f3f46" }}>|</span>
              <span style={{ fontSize: "13px", color: "#52525b" }}>
                Your GitHub, beautifully shown
              </span>
            </div>
            <span
              style={{
                fontSize: "14px",
                color: "#14b8a6",
                fontFamily: "monospace",
                fontWeight: 500,
              }}
            >
              gitshow.dev/{user.login}
            </span>
          </div>
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

function StatBox({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: `linear-gradient(135deg, ${color}12, ${color}06)`,
        borderRadius: "16px",
        padding: "12px 18px",
        border: `1px solid ${color}20`,
        minWidth: "90px",
      }}
    >
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span
        style={{
          fontSize: "26px",
          fontWeight: 700,
          color: "#ffffff",
          marginTop: "2px",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}

function fmtNum(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function starRank(stars: number): string {
  if (stars >= 100_000) return "Superstar";
  if (stars >= 10_000) return "Legend";
  if (stars >= 1_000) return "Architect";
  return "Creator";
}
