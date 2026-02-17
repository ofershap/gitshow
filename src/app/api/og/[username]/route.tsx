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
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
          padding: "50px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url}
            alt=""
            width={100}
            height={100}
            style={{
              borderRadius: "20px",
              border: "3px solid rgba(255,255,255,0.15)",
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
                fontSize: "38px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              {user.name ?? user.login}
            </span>
            <span style={{ fontSize: "18px", color: "#60a5fa" }}>
              @{user.login}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "30px",
            marginTop: "28px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}
            >
              {repos.length}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Projects</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}
            >
              {fmtNum(totalStars)}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>Stars</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff" }}
            >
              {fmtNum(user.followers)}
            </span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              Followers
            </span>
          </div>
          {npmStats && npmStats.totalDownloads > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "28px", fontWeight: 700, color: "#ef4444" }}
              >
                {fmtNum(npmStats.totalDownloads)}
              </span>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                npm dl/mo
              </span>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          {topCategories.map((cat) => (
            <div
              key={cat.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "6px 14px",
                border: "1px solid rgba(255,255,255,0.08)",
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
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            {topLangs.map((lang) => (
              <div
                key={lang.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "12px",
                  padding: "6px 14px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: lang.color,
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
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#60a5fa",
            }}
          >
            GitShow
          </span>
          <span style={{ fontSize: "15px", color: "#6b7280" }}>
            gitshow.vercel.app/{user.login}
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

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
