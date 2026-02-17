import { GitHubRepo } from "@/lib/types";
import { formatNumber, timeAgo } from "@/lib/utils";

interface RepoCardProps {
  repo: GitHubRepo;
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-white group-hover:text-blue-400">
          {repo.name}
        </h3>
        {repo.stargazers_count > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-yellow-400">
            <StarIcon />
            {formatNumber(repo.stargazers_count)}
          </span>
        )}
      </div>

      {repo.description && (
        <p className="mt-2 line-clamp-2 text-xs text-gray-400">
          {repo.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <ForkIcon />
            {formatNumber(repo.forks_count)}
          </span>
        )}
        <span className="ml-auto">{timeAgo(repo.pushed_at)}</span>
      </div>

      {repo.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? "#8b8b8b";
}

function StarIcon() {
  return (
    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 7V3m10 4V3M7 7a4 4 0 004 4h2a4 4 0 004-4M7 7H5m12 0h2m-7 4v6m0 0l-2 2m2-2l2 2"
      />
    </svg>
  );
}
