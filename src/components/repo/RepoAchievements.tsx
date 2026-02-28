import type { RepoShowroomData } from "@/lib/repo-types";
import { formatNumber, timeAgo } from "@/lib/utils";

const QUIET_DAYS = 60;

function isQuiet(pushedAt: string): boolean {
  const pushed = new Date(pushedAt).getTime();
  const now = Date.now();
  const days = (now - pushed) / (24 * 60 * 60 * 1000);
  return days > QUIET_DAYS;
}

function sinceYear(createdAt: string): string {
  return new Date(createdAt).getFullYear().toString();
}

interface RepoAchievementsProps {
  data: RepoShowroomData;
}

export function RepoAchievements({ data }: RepoAchievementsProps) {
  const { repo, contributorCount, latestRelease } = data;
  const ghUrl = repo.html_url;
  const quiet = isQuiet(repo.pushed_at);
  const activityLabel = quiet ? "Quiet" : "Active";
  const activitySub = timeAgo(repo.pushed_at);
  const year = sinceYear(repo.created_at);

  const items: { href?: string; icon: React.ReactNode; label: string; accent?: "star" | "teal" | "release" }[] = [
    {
      href: ghUrl,
      icon: <StarIcon />,
      label: `${formatNumber(repo.stargazers_count)} stars`,
      accent: "star",
    },
    {
      href: `${ghUrl}/fork`,
      icon: <ForkIcon />,
      label: `${formatNumber(repo.forks_count)} forks`,
    },
    {
      href: `${ghUrl}/graphs/contributors`,
      icon: <PeopleIcon />,
      label: `${formatNumber(contributorCount)} contributor${contributorCount === 1 ? "" : "s"}`,
    },
    {
      icon: <PulseDot active={!quiet} />,
      label: `${activityLabel} · ${activitySub}`,
      accent: "teal",
    },
    {
      href: ghUrl,
      icon: <CalendarIcon />,
      label: `Since ${year}`,
    },
  ];

  if (latestRelease) {
    items.push({
      href: latestRelease.html_url,
      icon: <ReleaseIcon />,
      label: latestRelease.tag_name,
      accent: "release",
    });
  }

  if (repo.license) {
    items.push({
      icon: <LicenseIcon />,
      label: repo.license,
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {items.map((item, i) => {
        const pill = (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border font-mono text-xs text-zinc-400 ${
              item.accent === "star"
                ? "border-amber-500/25 bg-amber-500/10 text-amber-200/90"
                : item.accent === "teal"
                  ? quiet
                    ? "border-zinc-600/50 bg-zinc-500/5"
                    : "border-teal-500/25 bg-teal-500/10 text-teal-300/90"
                  : item.accent === "release"
                    ? "border-violet-500/25 bg-violet-500/10 text-violet-300/90"
                    : "border-white/[0.08] bg-white/[0.04]"
            } px-3 py-1.5 transition hover:bg-white/[0.06]`}
          >
            {item.icon}
            <span>{item.label}</span>
          </span>
        );
        return item.href ? (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-90"
          >
            {pill}
          </a>
        ) : (
          <span key={i}>{pill}</span>
        );
      })}
    </div>
  );
}

function StarIcon() {
  return (
    <span className="text-amber-400/90" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </span>
  );
}

function ForkIcon() {
  return (
    <span className="text-zinc-400" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M12 18V3M7 6a5 5 0 0 0 10 0M7 21a5 5 0 0 1 10 0M7 6h10M7 21h10" />
      </svg>
    </span>
  );
}

function PeopleIcon() {
  return (
    <span className="text-zinc-400" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </span>
  );
}

function PulseDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
      <span
        className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
          active ? "bg-teal-400" : "bg-zinc-500"
        }`}
      />
      {active && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-40" />
      )}
    </span>
  );
}

function CalendarIcon() {
  return (
    <span className="text-zinc-400" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    </span>
  );
}

function ReleaseIcon() {
  return (
    <span className="text-violet-400/90" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    </span>
  );
}

function LicenseIcon() {
  return (
    <span className="text-zinc-400" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    </span>
  );
}
