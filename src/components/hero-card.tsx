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
    { value: formatNumber(repoCount), label: "Projects", icon: "📦", color: "from-violet-500/20 to-violet-500/5 border-violet-500/15 hover:border-violet-500/30" },
    { value: formatNumber(totalStars), label: "Stars", icon: "⭐", color: "from-amber-500/20 to-amber-500/5 border-amber-500/15 hover:border-amber-500/30" },
    { value: formatNumber(totalForks), label: "Forks", icon: "🍴", color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/15 hover:border-cyan-500/30" },
    { value: formatNumber(user.followers), label: "Followers", icon: "👥", color: "from-pink-500/20 to-pink-500/5 border-pink-500/15 hover:border-pink-500/30" },
  ];

  if (npmStats && npmStats.totalDownloads > 0) {
    stats.push({
      value: formatNumber(npmStats.totalDownloads),
      label: "npm dl/mo",
      icon: "📥",
      color: "from-red-500/20 to-red-500/5 border-red-500/15 hover:border-red-500/30",
    });
  }

  return (
    <div className="noise relative overflow-hidden rounded-3xl border border-[--color-border] bg-[--color-surface-raised] p-8 md:p-10">
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-500/[0.07] blur-[80px]" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-pink-500/[0.07] blur-[80px]" />
      <div className="absolute right-1/3 top-1/2 h-60 w-60 rounded-full bg-blue-500/[0.04] blur-[60px]" />

      <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="animate-pulse-ring rounded-2xl">
            <Image
              src={user.avatar_url}
              alt={user.name ?? user.login}
              width={130}
              height={130}
              className="rounded-2xl ring-2 ring-violet-500/30 transition-transform hover:scale-105"
              priority
            />
          </div>
          <div className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-violet-500/30">
            OSS
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {user.name ?? user.login}
          </h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            @{user.login}
          </a>

          {user.bio && (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-300">
              {user.bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-gray-400 sm:justify-start">
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

      <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`card-hover rounded-2xl border bg-gradient-to-br px-4 py-3 text-center transition-all ${s.color}`}
          >
            <div className="text-lg">{s.icon}</div>
            <div className="mt-1 font-display text-xl font-bold tabular-nums text-white">
              {s.value}
            </div>
            <div className="text-[11px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
