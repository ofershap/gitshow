"use client";

import { useMemo, useState } from "react";
import { RepoCategory, GitHubRepo } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";

const SEARCH_THRESHOLD = 10;

interface CategorySectionProps {
  categories: RepoCategory[];
}

const CATEGORY_ACCENTS = [
  { border: "#14b8a6", bg: "rgba(20, 184, 166, 0.06)" },
  { border: "#06b6d4", bg: "rgba(6, 182, 212, 0.06)" },
  { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.06)" },
  { border: "#10b981", bg: "rgba(16, 185, 129, 0.06)" },
  { border: "#3b82f6", bg: "rgba(59, 130, 246, 0.06)" },
  { border: "#ef4444", bg: "rgba(239, 68, 68, 0.06)" },
  { border: "#f97316", bg: "rgba(249, 115, 22, 0.06)" },
  { border: "#0ea5e9", bg: "rgba(14, 165, 233, 0.06)" },
];

function gitshowPath(ghUrl: string): string {
  const match = ghUrl.match(/github\.com\/(.+)/);
  return match ? `/${match[1]}` : ghUrl;
}

function RepoRow({ repo }: { repo: GitHubRepo }) {
  return (
    <div className="group flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-white/[0.03]">
      <a href={gitshowPath(repo.html_url)} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-white group-hover:text-teal-400 transition-colors truncate">
            {repo.name}
          </span>
          {repo.language && (
            <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-zinc-400">
              {repo.language}
            </span>
          )}
        </div>
        {repo.description && (
          <p className="mt-1 text-sm text-zinc-400 line-clamp-1">
            {repo.description}
          </p>
        )}
        {repo.topics.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {repo.topics.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md bg-teal-500/10 px-1.5 py-0.5 text-[10px] text-teal-300/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </a>
      <div className="flex shrink-0 items-center gap-3 text-xs text-zinc-500">
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            ⭐ {formatNumber(repo.stargazers_count)}
          </span>
        )}
        <span className="hidden sm:inline">{timeAgo(repo.pushed_at)}</span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-600 transition-colors hover:text-zinc-300"
          aria-label="View on GitHub"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export function CategorySection({ categories }: CategorySectionProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const totalProjects = useMemo(
    () => categories.reduce((sum, c) => sum + c.repos.length, 0),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        repos: cat.repos.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q) ||
            r.topics.some((t) => t.toLowerCase().includes(q)) ||
            r.language?.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.repos.length > 0);
  }, [categories, search]);

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-white">
        Projects by Category
      </h2>
      {totalProjects >= SEARCH_THRESHOLD && (
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${totalProjects} projects...`}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-teal-500/40 focus:bg-white/[0.06]"
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}
      {search && filteredCategories.length === 0 && (
        <p className="py-8 text-center text-sm text-zinc-500">
          No projects matching &ldquo;{search}&rdquo;
        </p>
      )}
      <div className="space-y-4">
        {filteredCategories.map((cat, i) => {
          const isExpanded = expandedCategory === cat.label;
          const hasMore = cat.repos.length > 5;
          const accent = CATEGORY_ACCENTS[i % CATEGORY_ACCENTS.length];

          return (
            <div
              key={cat.label}
              className="card-hover overflow-hidden rounded-2xl"
              style={{
                background: "var(--color-surface-raised)",
                borderLeft: `3px solid ${accent.border}`,
                border: `1px solid var(--color-border)`,
                borderLeftWidth: "3px",
                borderLeftColor: accent.border,
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="font-display font-medium text-white">{cat.label}</span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] tabular-nums text-zinc-400"
                    style={{ background: accent.bg }}
                  >
                    {cat.repos.length}
                  </span>
                </div>
              </div>
              <div className="px-2 py-1">
                {cat.repos.slice(0, 5).map((repo, j) => (
                  <div key={repo.name}>
                    {j > 0 && <div style={{ borderTop: "1px solid var(--color-border)" }} />}
                    <RepoRow repo={repo} />
                  </div>
                ))}
                {hasMore && (
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      {cat.repos.slice(5).map((repo, j) => (
                        <div key={repo.name}>
                          {(j > 0 || true) && <div style={{ borderTop: "1px solid var(--color-border)" }} />}
                          <RepoRow repo={repo} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {hasMore && (
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : cat.label)
                  }
                  className="w-full py-2.5 text-center text-xs font-medium text-zinc-500 transition-colors hover:text-teal-400"
                  style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}
                >
                  {isExpanded
                    ? "Show less"
                    : `Show ${cat.repos.length - 5} more`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
