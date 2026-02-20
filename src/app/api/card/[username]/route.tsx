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
          padding: "0 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "-20px",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Avatar */}
        <div style={{ display: "flex", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url}
            alt=""
            width={40}
            height={40}
            style={{
              borderRadius: "10px",
              border: "1.5px solid rgba(20,184,166,0.3)",
              boxShadow: "0 0 12px rgba(20,184,166,0.1)",
            }}
          />
        </div>

        {/* Name + handle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "12px",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: "16px",
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
              fontSize: "11px",
              color: "#14b8a6",
              fontFamily: "monospace",
              lineHeight: 1.2,
            }}
          >
            @{user.login}
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "28px",
            background: "rgba(255,255,255,0.08)",
            marginLeft: "16px",
            marginRight: "14px",
            flexShrink: 0,
          }}
        />

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "14px",
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
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "12px" }}>{s.icon}</span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#e4e4e7",
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "#52525b",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* GitShow branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #14b8a6, #f59e0b)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            GitShow
          </span>
        </div>
      </div>,
      {
        width: 460,
        height: 56,
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
