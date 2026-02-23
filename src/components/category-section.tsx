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

function RepoRow({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-white/[0.03]"
    >
      <div className="flex-1 min-w-0">
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
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs text-zinc-500">
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            ⭐ {formatNumber(repo.stargazers_count)}
          </span>
        )}
        <span className="hidden sm:inline">{timeAgo(repo.pushed_at)}</span>
      </div>
    </a>
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
          const visibleRepos = isExpanded ? cat.repos : cat.repos.slice(0, 3);
          const hasMore = cat.repos.length > 3;
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
                {visibleRepos.map((repo, j) => (
                  <div key={repo.name}>
                    {j > 0 && <div style={{ borderTop: "1px solid var(--color-border)" }} />}
                    <RepoRow repo={repo} />
                  </div>
                ))}
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
                    : `Show ${cat.repos.length - 3} more`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
