"use client";

import { useState } from "react";
import { RepoCategory, GitHubRepo } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";

interface CategorySectionProps {
  categories: RepoCategory[];
}

function RepoRow({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-white/10 hover:bg-white/[0.04]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
            {repo.name}
          </span>
          {repo.language && (
            <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-gray-400">
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
                className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400"
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
      <h2 className="text-lg font-semibold text-white">
        Projects by Category
      </h2>
      <div className="space-y-3">
        {categories.map((cat) => {
          const isExpanded = expandedCategory === cat.label;
          const visibleRepos = isExpanded ? cat.repos : cat.repos.slice(0, 3);
          const hasMore = cat.repos.length > 3;

          return (
            <div
              key={cat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="font-medium text-white">{cat.label}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-gray-400">
                    {cat.repos.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-white/5 px-2 py-1">
                {visibleRepos.map((repo) => (
                  <RepoRow key={repo.name} repo={repo} />
                ))}
              </div>
              {hasMore && (
                <button
                  onClick={() =>
                    setExpandedCategory(isExpanded ? null : cat.label)
                  }
                  className="w-full border-t border-white/5 py-2 text-center text-xs text-gray-500 transition-colors hover:bg-white/[0.03] hover:text-gray-300"
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
