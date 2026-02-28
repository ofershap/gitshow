import type { RepoShowroomData } from "@/lib/repo-types";
import { timeAgo } from "@/lib/utils";

const SHOW_IN_PROGRESS_PR_MAX = 10;
const SHOW_IN_PROGRESS_ISSUES_MAX = 20;
const QUIET_DAYS = 60;

function isQuiet(pushedAt: string): boolean {
  const pushed = new Date(pushedAt).getTime();
  const now = Date.now();
  const days = (now - pushed) / (24 * 60 * 60 * 1000);
  return days > QUIET_DAYS;
}

function buildStatusParts(data: RepoShowroomData): string[] {
  const { repo, openPrsCount, openIssuesCount } = data;
  const pushedAt = timeAgo(repo.pushed_at);
  const quiet = isQuiet(repo.pushed_at);
  const showInProgress =
    openPrsCount <= SHOW_IN_PROGRESS_PR_MAX &&
    openIssuesCount <= SHOW_IN_PROGRESS_ISSUES_MAX;
  const activityText =
    pushedAt === "just now" || pushedAt.endsWith(" ago")
      ? `Last activity ${pushedAt}`
      : pushedAt;
  const statusLabel = quiet ? "Quiet" : "Active";
  const parts: string[] = [statusLabel];
  if (showInProgress && openPrsCount > 0) {
    parts.push(
      openPrsCount === 1 ? "1 in progress" : `${openPrsCount} in progress`
    );
  }
  if (showInProgress && openIssuesCount > 0 && openPrsCount === 0) {
    parts.push(
      openIssuesCount === 1 ? "1 discussion" : `${openIssuesCount} discussions`
    );
  }
  parts.push(activityText);
  return parts;
}

export function StatusPill({
  data,
  size = "default",
}: {
  data: RepoShowroomData;
  size?: "default" | "compact";
}) {
  const parts = buildStatusParts(data);
  const quiet = isQuiet(data.repo.pushed_at);
  const compact = size === "compact";
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${
        quiet
          ? "border-zinc-600/50 bg-zinc-500/5"
          : "border-teal-500/25 bg-teal-500/10"
      } ${compact ? "px-3 py-1.5" : "px-4 py-2"}`}
    >
      <span
        className={`relative flex ${compact ? "h-1.5 w-1.5" : "h-2 w-2"} ${quiet ? "" : "animate-pulse"}`}
        aria-hidden
      >
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            quiet ? "bg-zinc-500" : "bg-teal-400"
          }`}
        />
        {!quiet && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-40" />
        )}
      </span>
      <span
        className={`font-mono text-zinc-400 ${compact ? "text-xs" : "text-sm"}`}
      >
        {parts.join(" · ")}
      </span>
    </div>
  );
}

interface StatusLineProps {
  data: RepoShowroomData;
}

export function StatusLine({ data }: StatusLineProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <StatusPill data={data} />
    </div>
  );
}
