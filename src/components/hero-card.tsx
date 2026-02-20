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
  const stats = [
    { value: formatNumber(repoCount), label: "Projects", icon: "📦", accent: "teal" },
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
          {stats.map((s) => (
            <div
              key={s.label}
              className={`card-hover rounded-2xl border px-4 py-3.5 text-center transition-all ${accentStyles[s.accent]}`}
            >
              <div className="text-xl">{s.icon}</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-white">
                {s.value}
              </div>
              <div className="mt-0.5 text-[11px] font-medium text-zinc-500">{s.label}</div>
            </div>
          ))}
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
