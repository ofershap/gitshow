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
    const { user, totalStars, languages } = data;
    const topLangs = languages.slice(0, 5);

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url}
            alt=""
            width={120}
            height={120}
            style={{
              borderRadius: "60px",
              border: "3px solid rgba(255,255,255,0.2)",
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
                fontSize: "42px",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              {user.name ?? user.login}
            </span>
            <span style={{ fontSize: "22px", color: "#60a5fa" }}>
              @{user.login}
            </span>
          </div>
        </div>

        {user.bio ? (
          <span
            style={{
              fontSize: "20px",
              color: "#9ca3af",
              marginTop: "24px",
              lineHeight: 1.4,
            }}
          >
            {user.bio.length > 120
              ? user.bio.slice(0, 120) + "..."
              : user.bio}
          </span>
        ) : null}

        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "32px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff" }}
            >
              {fmtNum(user.public_repos)}
            </span>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>Repos</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff" }}
            >
              {fmtNum(totalStars)}
            </span>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>Stars</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff" }}
            >
              {fmtNum(user.followers)}
            </span>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              Followers
            </span>
          </div>
        </div>

        {topLangs.length > 0 ? (
          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
            {topLangs.map((lang) => (
              <div
                key={lang.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "8px 16px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "5px",
                    background: lang.color,
                  }}
                />
                <span style={{ fontSize: "16px", color: "#d1d5db" }}>
                  {lang.name}
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
              fontSize: "24px",
              fontWeight: 700,
              color: "#60a5fa",
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

function fmtNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
