import type { RepoShowroomData } from "@/lib/repo-types";
import { timeAgo } from "@/lib/utils";

interface RepoAgentSummaryProps {
  owner: string;
  repo: string;
  data: RepoShowroomData;
}

export function RepoAgentSummary({ owner, repo, data }: RepoAgentSummaryProps) {
  const { repo: r, contributors, openPrsCount, openIssuesCount, languages, latestRelease, communityHealth } = data;
  const lastActivity = timeAgo(r.pushed_at);
  const contributorLogins = contributors.slice(0, 10).map((c) => c.login).join(", ");

  const summary = [
    `Repository: ${r.full_name}.`,
    r.description ? `Description: ${r.description}` : null,
    `Stars: ${r.stargazers_count}, Forks: ${r.forks_count}.`,
    r.language ? `Primary language: ${r.language}.` : null,
    languages.length > 0
      ? `Languages: ${languages.slice(0, 5).map((l) => `${l.name} (${l.percentage}%)`).join(", ")}.`
      : null,
    r.license ? `License: ${r.license}.` : null,
    r.homepage ? `Homepage: ${r.homepage}` : null,
    r.topics.length > 0 ? `Topics: ${r.topics.join(", ")}.` : null,
    latestRelease ? `Latest release: ${latestRelease.tag_name} (${timeAgo(latestRelease.published_at)}).` : null,
    `Open PRs: ${openPrsCount}, open issues: ${openIssuesCount}.`,
    `Last activity: ${lastActivity}.`,
    communityHealth ? `Community health: ${communityHealth.health_percentage}%.` : null,
    contributors.length > 0
      ? `Top contributors: ${contributorLogins}${contributors.length > 10 ? " and others." : "."}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="mt-10 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
      aria-label="Structured summary for AI agents and search engines"
    >
      <div className="flex items-center gap-2 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
        </svg>
        <span className="text-xs font-medium text-zinc-600">Structured data for AI agents</span>
      </div>
      <p className="select-all font-mono text-xs leading-relaxed text-zinc-500" suppressHydrationWarning>
        {summary}
      </p>
    </div>
  );
}
