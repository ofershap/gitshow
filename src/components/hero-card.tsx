import Image from "next/image";
import { GitHubUser, NpmStats } from "@/lib/types";
import { formatNumber, memberSince } from "@/lib/utils";

interface HeroCardProps {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
  repoCount: number;
  npmStats: NpmStats | null;
}

export function HeroCard({
  user,
  totalStars,
  totalForks,
  repoCount,
  npmStats,
}: HeroCardProps) {
  const stats: { value: string; label: string; icon: string; accent: string; href?: string }[] = [
    { value: formatNumber(repoCount), label: "Projects", icon: "📦", accent: "teal", href: "#projects" },
    { value: formatNumber(totalStars), label: "Stars", icon: "⭐", accent: "amber" },
    { value: formatNumber(totalForks), label: "Forks", icon: "🍴", accent: "cyan" },
    { value: formatNumber(user.followers), label: "Followers", icon: "👥", accent: "emerald" },
  ];

  if (npmStats && npmStats.totalDownloads > 0) {
    stats.push({
      value: formatNumber(npmStats.totalDownloads),
      label: "npm dl/mo",
      icon: "📥",
      accent: "lime",
    });
  }

  const accentStyles: Record<string, string> = {
    teal: "border-teal-500/20 bg-teal-500/[0.06] hover:border-teal-500/40 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)]",
    amber: "border-amber-500/20 bg-amber-500/[0.06] hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    cyan: "border-cyan-500/20 bg-cyan-500/[0.06] hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]",
    emerald: "border-emerald-500/20 bg-emerald-500/[0.06] hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    lime: "border-lime-500/20 bg-lime-500/[0.06] hover:border-lime-500/40 hover:shadow-[0_0_30px_rgba(132,204,22,0.1)]",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] glow-accent" style={{ background: "var(--color-surface-raised)" }}>
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-teal-500/[0.06] blur-[100px] animate-glow-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-500/[0.04] blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.03] blur-[80px]" />
      </div>

      <div className="relative z-10 p-8 md:p-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar with glow ring + rank badge */}
          <div className="relative shrink-0">
            <div className="rounded-2xl animate-pulse-glow">
              <Image
                src={user.avatar_url}
                alt={user.name ?? user.login}
                width={140}
                height={140}
                className="rounded-2xl ring-2 ring-teal-500/30 transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
            <div className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-lg shadow-teal-500/25">
              {starRank(totalStars)}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl text-glow">
              {user.name ?? user.login}
            </h1>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-teal-400 transition-colors hover:text-teal-300"
            >
              @{user.login}
            </a>

            <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 transition-colors hover:text-teal-400"
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {user.blog && user.blog.includes("linkedin.com") && (
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 transition-colors hover:text-teal-400"
                  aria-label="LinkedIn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
              {user.twitter_username && (
                <a
                  href={`https://x.com/${user.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 transition-colors hover:text-teal-400"
                  aria-label="X (Twitter)"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>

            {user.bio && (
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300/90">
                {user.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-zinc-400 sm:justify-start">
              {user.location && (
                <span className="flex items-center gap-1.5">📍 {user.location}</span>
              )}
              {user.company && (
                <span className="flex items-center gap-1.5">🏢 {user.company}</span>
              )}
              <span className="flex items-center gap-1.5">
                📅 Building since {memberSince(user.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {stats.map((s) => {
            const content = (
              <>
                <div className="text-xl">{s.icon}</div>
                <div className="mt-1 font-display text-2xl font-bold tabular-nums text-white">
                  {s.value}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-zinc-500">{s.label}</div>
              </>
            );

            const className = `card-hover rounded-2xl border px-4 py-3.5 text-center transition-all ${accentStyles[s.accent]}`;

            return s.href ? (
              <a
                key={s.label}
                href={s.href}
                className={`${className} cursor-pointer no-underline`}
              >
                {content}
              </a>
            ) : (
              <div key={s.label} className={className}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function starRank(stars: number): string {
  if (stars >= 100_000) return "Superstar";
  if (stars >= 10_000) return "Legend";
  if (stars >= 1_000) return "Architect";
  return "Creator";
}
