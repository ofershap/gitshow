import { ContributionsData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface ContributionsCardProps {
  contributions: ContributionsData;
  username: string;
}

const MIN_EXTERNAL_REPOS = 2;

export function shouldShowContributions(
  contributions: ContributionsData | null,
  ownRepoCount: number,
): boolean {
  if (!contributions) return false;
  if (contributions.topRepos.length < MIN_EXTERNAL_REPOS) return false;
  return true;
}

export function shouldShowContributionsFirst(
  contributions: ContributionsData,
  ownRepoCount: number,
): boolean {
  return contributions.topRepos.length > ownRepoCount;
}

export function ContributionsCard({ contributions, username }: ContributionsCardProps) {
  const maxCommits = Math.max(...contributions.topRepos.map((r) => r.commitCount));
  const topRepos = contributions.topRepos.slice(0, 8);

  const stats = [
    { value: formatNumber(contributions.totalCommits), label: "Commits", accent: "violet" },
    { value: formatNumber(contributions.totalPullRequests), label: "PRs", accent: "fuchsia" },
    { value: formatNumber(contributions.totalIssues), label: "Issues", accent: "pink" },
    { value: formatNumber(contributions.totalReposContributedTo), label: "Repos", accent: "purple" },
  ];

  const accentStyles: Record<string, string> = {
    violet: "border-violet-500/20 bg-violet-500/[0.06]",
    fuchsia: "border-fuchsia-500/20 bg-fuchsia-500/[0.06]",
    pink: "border-pink-500/20 bg-pink-500/[0.06]",
    purple: "border-purple-500/20 bg-purple-500/[0.06]",
  };

  return (
    <div
      className="card-hover overflow-hidden rounded-2xl"
      style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}
    >
      <div
        className="px-5 py-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <h3 className="font-display font-semibold text-white flex items-center gap-2">
          <span className="text-xl">🌍</span> Open Source Contributions
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2 p-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border px-3 py-2.5 text-center ${accentStyles[s.accent]}`}
          >
            <div className="font-display text-lg font-bold tabular-nums text-white">
              {s.value}
            </div>
            <div className="text-[10px] font-medium text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>

      {topRepos.length > 0 && (
        <div className="px-5 pb-4">
          <div className="mb-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Top projects contributed to
          </div>
          <div className="space-y-3">
            {topRepos.map((repo) => {
              const width = Math.max((repo.commitCount / maxCommits) * 100, 6);
              return (
                <a
                  key={repo.nameWithOwner}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-300 group-hover:text-violet-300 transition-colors truncate mr-2">
                      {repo.nameWithOwner}
                    </span>
                    <span className="flex shrink-0 items-center gap-2 tabular-nums text-zinc-500">
                      {repo.stargazersCount > 0 && (
                        <span>⭐ {formatNumber(repo.stargazersCount)}</span>
                      )}
                      <span>{repo.commitCount} {repo.commitCount === 1 ? "commit" : "commits"}</span>
                    </span>
                  </div>
                  <div
                    className="mt-1 h-1.5 overflow-hidden rounded-full"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all group-hover:brightness-125"
                      style={{
                        width: `${width}%`,
                        background: "linear-gradient(90deg, rgba(139,92,246,0.7), rgba(192,132,252,0.5))",
                      }}
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div
        className="flex items-center justify-between px-5 py-2.5 text-[11px] text-zinc-500"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <span>Based on last 12 months of activity</span>
        {contributions.topRepos.length > 8 && (
          <span>+{contributions.topRepos.length - 8} more repos</span>
        )}
      </div>
    </div>
  );
}
