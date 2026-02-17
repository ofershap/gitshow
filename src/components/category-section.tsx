"use client";

import { useState } from "react";
import { RepoCategory, GitHubRepo } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";

interface CategorySectionProps {
  categories: RepoCategory[];
}

const CATEGORY_COLORS = [
  "border-l-violet-500",
  "border-l-cyan-500",
  "border-l-amber-500",
  "border-l-pink-500",
  "border-l-green-500",
  "border-l-blue-500",
  "border-l-red-500",
  "border-l-indigo-500",
];

function RepoRow({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-[--color-border-hover] hover:bg-[--color-surface-hover]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-white group-hover:text-violet-400 transition-colors truncate">
            {repo.name}
          </span>
          {repo.language && (
            <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-gray-400">
              {repo.language}
            </span>
          )}
        </div>
        {repo.description && (
          <p className="mt-1 text-sm text-gray-400 line-clamp-1">
            {repo.description}
          </p>
        )}
        {repo.topics.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {repo.topics.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-300/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs text-gray-500">
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

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-white">
        Projects by Category
      </h2>
      <div className="space-y-4">
        {categories.map((cat, i) => {
          const isExpanded = expandedCategory === cat.label;
          const visibleRepos = isExpanded ? cat.repos : cat.repos.slice(0, 3);
          const hasMore = cat.repos.length > 3;
          const colorClass = CATEGORY_COLORS[i % CATEGORY_COLORS.length];

          return (
            <div
              key={cat.label}
              className={`card-hover overflow-hidden rounded-2xl border border-[--color-border] border-l-[3px] bg-[--color-surface-raised] ${colorClass}`}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-[--color-border]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="font-display font-medium text-white">{cat.label}</span>
                  <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] tabular-nums text-gray-400">
                    {cat.repos.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-[--color-border] px-2 py-1">
                {visibleRepos.map((repo) => (
                  <RepoRow key={repo.name} repo={repo} />
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : cat.label)
                  }
                  className="w-full border-t border-[--color-border] py-2.5 text-center text-xs font-medium text-gray-500 transition-colors hover:bg-[--color-surface-hover] hover:text-violet-400"
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
