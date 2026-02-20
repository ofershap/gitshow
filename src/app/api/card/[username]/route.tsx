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
    const { user, totalStars, totalForks, repos, npmStats } = data;

    const stats = buildStats(repos.length, totalStars, totalForks, user.followers, npmStats?.totalDownloads ?? 0);

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#0a0a0b",
          fontFamily: "system-ui, sans-serif",
          padding: "0 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-40px",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url}
            alt=""
            width={80}
            height={80}
            style={{
              borderRadius: "20px",
              border: "3px solid rgba(20,184,166,0.3)",
              boxShadow: "0 0 24px rgba(20,184,166,0.1)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "24px",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            {user.name ?? user.login}
          </span>
          <span
            style={{
              fontSize: "22px",
              color: "#14b8a6",
              fontFamily: "monospace",
              lineHeight: 1.2,
            }}
          >
            @{user.login}
          </span>
        </div>

        <div
          style={{
            width: "2px",
            height: "56px",
            background: "rgba(255,255,255,0.08)",
            marginLeft: "32px",
            marginRight: "28px",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "28px",
            alignItems: "center",
            flex: 1,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{s.icon}</span>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#e4e4e7",
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "20px",
                  color: "#52525b",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <span
          style={{
            position: "absolute",
            bottom: "8px",
            right: "20px",
            fontSize: "16px",
            fontWeight: 600,
            background: "linear-gradient(135deg, #14b8a6, #f59e0b)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "0.02em",
          }}
        >
          made with gitshow
        </span>
      </div>,
      {
        width: 920,
        height: 112,
      }
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response("User not found", { status: 404 });
    }
    return new Response("Error generating card", { status: 500 });
  }
}

interface Stat {
  icon: string;
  value: string;
  label: string;
}

function buildStats(
  repos: number,
  stars: number,
  forks: number,
  followers: number,
  npmDownloads: number
): Stat[] {
  const all: (Stat & { priority: number })[] = [];

  if (stars > 0) all.push({ icon: "⭐", value: fmtNum(stars), label: "stars", priority: stars });
  if (npmDownloads > 0) all.push({ icon: "📥", value: fmtNum(npmDownloads), label: "npm/mo", priority: npmDownloads });
  if (repos > 0) all.push({ icon: "📦", value: repos.toString(), label: "repos", priority: repos * 10 });
  if (forks > 0) all.push({ icon: "🍴", value: fmtNum(forks), label: "forks", priority: forks });
  if (followers > 0) all.push({ icon: "👥", value: fmtNum(followers), label: "followers", priority: followers });

  return all.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
