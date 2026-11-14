import { ImageResponse } from "next/og";
import { fetchProfile, NotFoundError } from "@/lib/github";

export const revalidate = 86400;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const data = await fetchProfile(username);
    const { user, totalStars, totalForks, languages, categories, npmStats } = data;
    const topLangs = languages.slice(0, 4);
    const repoCount = categories.reduce((sum, c) => sum + c.repos.length, 0);

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
          padding: "56px 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-140px",
            right: "-80px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.14) 0%, transparent 65%)",
          }}
        />

        {/* Header: avatar + name + bio */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url}
            alt=""
            width={112}
            height={112}
            style={{
              borderRadius: "24px",
              border: "2px solid rgba(20,184,166,0.35)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontSize: "44px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.02em" }}>
                {user.name ?? user.login}
              </span>
              <span style={{ fontSize: "22px", color: "#14b8a6", fontFamily: "monospace" }}>
                @{user.login}
              </span>
            </div>
            {user.bio && (
              <span style={{ fontSize: "20px", color: "#a1a1aa", marginTop: "8px" }}>
                {user.bio.length > 90 ? user.bio.slice(0, 90) + "..." : user.bio}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              background: "rgba(20,184,166,0.12)",
              border: "1px solid rgba(20,184,166,0.30)",
              borderRadius: "16px",
              padding: "8px 18px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#14b8a6",
            }}
          >
            {rank}
          </div>
        </div>

        {/* Stats line */}
        <span style={{ fontSize: "26px", color: "#e4e4e7", fontWeight: 600, marginTop: "44px" }}>
          {[
            `${repoCount} projects`,
            `${fmtNum(totalStars)} stars`,
            `${fmtNum(totalForks)} forks`,
            `${fmtNum(user.followers)} followers`,
            ...(npmStats && npmStats.totalDownloads > 0
              ? [`${fmtNum(npmStats.totalDownloads)} npm dl/mo`]
              : []),
          ].join("  ·  ")}
        </span>

        {/* Languages line */}
        {topLangs.length > 0 && (
          <span style={{ fontSize: "20px", color: "#8b8b93", marginTop: "18px" }}>
            {topLangs.map((l) => `${l.name} ${l.percentage}%`).join("  ·  ")}
          </span>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: 800, color: "#14b8a6", letterSpacing: "-0.02em" }}>
            GitShow
          </span>
          <span style={{ fontSize: "18px", color: "#14b8a6", fontFamily: "monospace" }}>
            gitshow.dev/{user.login}
          </span>
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
    if (error instanceof NotFoundError) {
      return new Response("User not found", { status: 404 });
    }
    console.error("og render error:", error);
    return new Response("Error generating image", { status: 500 });
  }
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
