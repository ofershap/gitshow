import { ImageResponse } from "next/og";
import { fetchRepoShowroom, RepoNotFoundError } from "@/lib/github-repo";

export const revalidate = 86400;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string; repo: string }> }
) {
  const { username: owner, repo } = await params;

  try {
    const data = await fetchRepoShowroom(owner, repo);
    const { repo: r, contributors, languages, latestRelease } = data;
    const topLangs = languages.slice(0, 5);
    const topContribs = contributors.slice(0, 6);
    const desc = r.description
      ? r.description.length > 100
        ? r.description.slice(0, 100) + "..."
        : r.description
      : null;

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
            display: "flex",
            flexDirection: "column",
            margin: "32px",
            padding: "36px 40px",
            borderRadius: "24px",
            background: "#111113",
            border: "1px solid rgba(20,184,166,0.12)",
            boxShadow: "0 0 40px rgba(20,184,166,0.08)",
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
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

          <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={r.owner.avatar_url}
              alt=""
              width={80}
              height={80}
              style={{
                borderRadius: "16px",
                border: "2px solid rgba(20,184,166,0.35)",
                boxShadow: "0 0 24px rgba(20,184,166,0.15)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <span
                style={{
                  fontSize: "38px",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  textShadow: "0 0 40px rgba(20,184,166,0.3)",
                }}
              >
                {r.name}
              </span>
              <span style={{ fontSize: "16px", color: "#14b8a6", fontFamily: "monospace" }}>
                {r.full_name}
              </span>
            </div>
            {latestRelease && (
              <div
                style={{
                  display: "flex",
                  background: "rgba(139,92,246,0.12)",
                  borderRadius: "12px",
                  padding: "6px 14px",
                  border: "1px solid rgba(139,92,246,0.2)",
                  fontSize: "14px",
                  color: "#c4b5fd",
                  fontFamily: "monospace",
                  fontWeight: 600,
                }}
              >
                {latestRelease.tag_name}
              </div>
            )}
          </div>

          {desc && (
            <span
              style={{
                fontSize: "16px",
                color: "#a1a1aa",
                marginTop: "16px",
                lineHeight: 1.5,
                position: "relative",
              }}
            >
              {desc}
            </span>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "20px", position: "relative" }}>
            <StatBox icon="⭐" value={fmtNum(r.stargazers_count)} label="Stars" color="#f59e0b" />
            <StatBox icon="🍴" value={fmtNum(r.forks_count)} label="Forks" color="#06b6d4" />
            <StatBox icon="👥" value={contributors.length.toString()} label="Contributors" color="#10b981" />
            <StatBox icon="🔓" value={String(data.openIssuesCount)} label="Issues" color="#ef4444" />
            <StatBox icon="🔀" value={String(data.openPrsCount)} label="Open PRs" color="#8b5cf6" />
          </div>

          {topContribs.length > 0 && (
            <div style={{ display: "flex", gap: "-8px", marginTop: "20px", position: "relative" }}>
              {topContribs.map((c, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={c.login}
                  src={c.avatar_url}
                  alt=""
                  width={40}
                  height={40}
                  style={{
                    borderRadius: "50%",
                    border: "2px solid #111113",
                    marginLeft: i === 0 ? 0 : "-10px",
                  }}
                />
              ))}
              {contributors.length > 6 && (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    border: "2px solid #111113",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "-10px",
                    fontSize: "12px",
                    color: "#71717a",
                    fontWeight: 600,
                  }}
                >
                  +{contributors.length - 6}
                </div>
              )}
            </div>
          )}

          {topLangs.length > 0 && (
            <div style={{ display: "flex", gap: "8px", marginTop: "14px", position: "relative" }}>
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
                Open source showroom
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
              gitshow.dev/{r.full_name}
            </span>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "CDN-Cache-Control": "public, max-age=86400",
        },
      }
    );
  } catch (error) {
    if (error instanceof RepoNotFoundError) {
      return new Response("Repository not found", { status: 404 });
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
        padding: "10px 16px",
        border: `1px solid ${color}20`,
        minWidth: "80px",
      }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#ffffff",
          marginTop: "2px",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: "10px", color: "#71717a", fontWeight: 500 }}>
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
