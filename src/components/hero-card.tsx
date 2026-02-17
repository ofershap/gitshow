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
    { value: formatNumber(repoCount), label: "Projects", icon: "📦" },
    { value: formatNumber(totalStars), label: "Stars", icon: "⭐" },
    { value: formatNumber(totalForks), label: "Forks", icon: "🍴" },
    { value: formatNumber(user.followers), label: "Followers", icon: "👥" },
  ];

  if (npmStats && npmStats.totalDownloads > 0) {
    stats.push({
      value: formatNumber(npmStats.totalDownloads),
      label: "npm dl/mo",
      icon: "📥",
    });
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-xl">
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative">
          <Image
            src={user.avatar_url}
            alt={user.name ?? user.login}
            width={120}
            height={120}
            className="rounded-2xl ring-2 ring-white/20 transition-transform hover:scale-105"
            priority
          />
          <div className="absolute -bottom-2 -right-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg">
            OPEN SOURCE
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {user.name ?? user.login}
          </h1>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 transition-colors hover:text-blue-300"
          >
            @{user.login}
          </a>

          {user.bio && (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-300">
              {user.bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-gray-400 sm:justify-start">
            {user.location && (
              <span className="flex items-center gap-1">📍 {user.location}</span>
            )}
            {user.company && (
              <span className="flex items-center gap-1">🏢 {user.company}</span>
            )}
            <span className="flex items-center gap-1">
              📅 Building since {memberSince(user.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group rounded-2xl border border-white/5 bg-white/[0.04] px-4 py-3 text-center transition-all hover:border-white/20 hover:bg-white/[0.08]"
          >
            <div className="text-lg">{s.icon}</div>
            <div className="mt-1 text-xl font-bold tabular-nums text-white">
              {s.value}
            </div>
            <div className="text-[11px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
