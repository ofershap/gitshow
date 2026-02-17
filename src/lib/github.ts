import {
  GitHubUser,
  GitHubRepo,
  LanguageStats,
  ProfileData,
} from "./types";
import { fetchNpmStats } from "./npm";
import { categorizeRepos } from "./categorize";

const GITHUB_API = "https://api.github.com";

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
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Lua: "#000080",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Scala: "#c22d40",
  Zig: "#ec915c",
  Nix: "#7e7eff",
};

function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? "#8b8b8b";
}

async function githubFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitShow/1.0",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${GITHUB_API}${path}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (res.status === 404) {
    throw new NotFoundError(`GitHub user not found`);
  }

  if (res.status === 403) {
    throw new RateLimitError("GitHub API rate limit exceeded");
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

function computeLanguages(repos: GitHubRepo[]): LanguageStats[] {
  const counts = new Map<string, number>();

  for (const repo of repos) {
    if (repo.language && !repo.fork) {
      counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
    }
  }

  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
      color: getLanguageColor(name),
    }))
    .sort((a, b) => b.count - a.count);
}

function computeTopTopics(
  repos: GitHubRepo[]
): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    for (const topic of repo.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .filter((t) => t.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function computeTimeline(
  repos: GitHubRepo[]
): { month: string; count: number }[] {
  const months = new Map<string, number>();
  for (const repo of repos) {
    const d = new Date(repo.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.set(key, (months.get(key) ?? 0) + 1);
  }
  return Array.from(months.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);
}

export async function fetchProfile(username: string): Promise<ProfileData> {
  const [user, repos] = await Promise.all([
    githubFetch<GitHubUser>(`/users/${username}`),
    githubFetch<GitHubRepo[]>(
      `/users/${username}/repos?sort=stars&per_page=100&type=owner`
    ),
  ]);

  const publicRepos = repos.filter((r) => !r.fork && !r.archived);

  const totalStars = publicRepos.reduce(
    (sum, r) => sum + r.stargazers_count,
    0
  );
  const totalForks = publicRepos.reduce((sum, r) => sum + r.forks_count, 0);
  const languages = computeLanguages(publicRepos);
  const categories = categorizeRepos(publicRepos);
  const topTopics = computeTopTopics(publicRepos);
  const activityTimeline = computeTimeline(publicRepos);

  const npmStats = await fetchNpmStats(username).catch(() => null);

  return {
    user,
    repos: publicRepos,
    languages,
    categories,
    totalStars,
    totalForks,
    npmStats,
    topTopics,
    activityTimeline,
  };
}
