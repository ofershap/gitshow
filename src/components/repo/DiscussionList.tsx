import Image from "next/image";
import type {
  RepoShowroomActivity,
  RepoShowroomData,
} from "@/lib/repo-types";
import { timeAgo } from "@/lib/utils";
import { StatusPill } from "./StatusLine";

const DEFAULT_SHOW = 3;

function cleanSnippet(body: string | null): string {
  if (!body) return "";
  let s = body;
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  s = s.replace(/```[\s\S]*?```/g, "");
  s = s.replace(/`[^`]+`/g, "");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/\|[^\n]*\|/g, "");
  s = s.replace(/^[-*]{3,}$/gm, "");
  s = s.replace(/^[\s>*-]+/gm, " ");
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

interface DiscussionListProps {
  items: RepoShowroomActivity[];
  repoUrl: string;
  statusData?: RepoShowroomData;
  variant?: "open" | "merged";
}

const VARIANT_CONFIG = {
  open: {
    title: "Recent PRs & issues",
    glowColor: "bg-amber-500/[0.04]",
    linkHref: (url: string) => `${url}/issues`,
    linkText: "See all on GitHub →",
  },
  merged: {
    title: "Recent fixes",
    glowColor: "bg-purple-500/[0.04]",
    linkHref: (url: string) => `${url}/pulls?q=is%3Apr+is%3Aclosed`,
    linkText: "View closed PRs →",
  },
};

export function DiscussionList({
  items,
  repoUrl,
  statusData,
  variant = "open",
}: DiscussionListProps) {
  if (items.length === 0) return null;

  const config = VARIANT_CONFIG[variant];
  const show = items.slice(0, DEFAULT_SHOW);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-10">
      <div className={`pointer-events-none absolute bottom-0 left-0 h-48 w-64 rounded-full ${config.glowColor} blur-[60px]`} />

      <div className="relative z-10">
        <div className="mb-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                {config.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {statusData && (
                <StatusPill data={statusData} size="compact" />
              )}
              <a
                href={config.linkHref(repoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-medium text-teal-400 transition hover:text-teal-300"
              >
                {config.linkText}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {show.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-white/[0.1] hover:bg-white/[0.04]"
            >
              <div className="flex gap-4">
                <a
                  href={item.user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0"
                >
                  <Image
                    src={item.user.avatar_url}
                    alt={item.user.login}
                    width={44}
                    height={44}
                    className="rounded-xl ring-1 ring-white/10"
                  />
                </a>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={item.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white transition hover:text-teal-400 line-clamp-2"
                    >
                      {item.title}
                    </a>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium ${
                        item.state === "open"
                          ? "bg-teal-500/20 text-teal-400"
                          : item.is_pr
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-zinc-500/20 text-zinc-400"
                      }`}
                    >
                      {item.state === "open" ? "Open" : item.is_pr ? "Merged" : "Closed"}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-zinc-500">
                      {item.is_pr ? "PR" : "Issue"}
                    </span>
                  </div>
                  {item.body && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {cleanSnippet(item.body)}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-zinc-500">
                      {item.user.login}
                      <span className="text-zinc-600"> · </span>
                      {timeAgo(item.updated_at)}
                    </span>
                    <a
                      href={item.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 transition hover:text-teal-400"
                      aria-label="View on GitHub"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
