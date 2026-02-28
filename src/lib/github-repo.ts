import type {
  RepoShowroomData,
  RepoShowroomActivity,
  LanguageBreakdown,
  LatestRelease,
  CommunityHealth,
} from "./repo-types";

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
  Dockerfile: "#384d54",
  Makefile: "#427819",
  SCSS: "#c6538c",
  Less: "#1d365d",
  "Objective-C": "#438eff",
  R: "#198CE7",
  Julia: "#a270ba",
  Perl: "#0298c3",
  Clojure: "#db5855",
};

export class RepoNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RepoNotFoundError";
  }
}

async function repoFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitShow/1.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${GITHUB_API}${path}`, {
    headers,
    next: { revalidate: 3600 },
  });

  if (res.status === 404) throw new RepoNotFoundError("Repository not found");
  if (res.status === 403) throw new Error("GitHub API rate limit exceeded");
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  return res.json();
}

async function repoFetchSafe<T>(path: string): Promise<T | null> {
  try {
    return await repoFetch<T>(path);
  } catch {
    return null;
  }
}

interface GhRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  license: { spdx_id: string | null; name: string } | null;
  pushed_at: string;
  created_at: string;
  owner: { login: string; avatar_url: string; html_url: string };
}

interface GhContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type?: string;
}

interface GhIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  state: string;
  user: { login: string; avatar_url: string; html_url: string };
  created_at: string;
  updated_at: string;
  pull_request?: unknown;
}

interface GhRelease {
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
}

interface GhCommunityProfile {
  health_percentage: number;
  files: {
    readme: { url: string } | null;
    license: { url: string } | null;
    contributing: { url: string } | null;
    code_of_conduct: { url: string } | null;
    issue_template: { url: string } | null;
    pull_request_template: { url: string } | null;
  };
}

interface GhParticipation {
  all: number[];
  owner: number[];
}

async function fetchOpenPullsCount(owner: string, repo: string): Promise<number> {
  const list = await repoFetch<GhIssue[]>(
    `/repos/${owner}/${repo}/pulls?state=open&per_page=100`
  );
  return list.length;
}

async function fetchContributorCount(owner: string, repo: string): Promise<number> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitShow/1.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=1&anon=true`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!res.ok) return 0;

  const link = res.headers.get("link");
  if (!link) {
    const body = await res.json();
    return Array.isArray(body) ? body.length : 0;
  }

  const match = link.match(/&page=(\d+)>;\s*rel="last"/);
  return match ? parseInt(match[1], 10) : 1;
}

function parseLanguages(raw: Record<string, number>): LanguageBreakdown[] {
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return Object.entries(raw)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / total) * 1000) / 10,
      color: LANGUAGE_COLORS[name] ?? "#8b8b8b",
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

function parseCommunity(raw: GhCommunityProfile): CommunityHealth {
  return {
    health_percentage: raw.health_percentage,
    files: {
      readme: !!raw.files.readme,
      license: !!raw.files.license,
      contributing: !!raw.files.contributing,
      code_of_conduct: !!raw.files.code_of_conduct,
      issue_template: !!raw.files.issue_template,
      pull_request_template: !!raw.files.pull_request_template,
    },
  };
}

export async function fetchRepoShowroom(
  owner: string,
  repo: string
): Promise<RepoShowroomData> {
  const [ghRepo, contributors, openPulls, recentIssues, contributorCount] = await Promise.all([
    repoFetch<GhRepo>(`/repos/${owner}/${repo}`),
    repoFetch<GhContributor[]>(
      `/repos/${owner}/${repo}/contributors?per_page=30`
    ),
    fetchOpenPullsCount(owner, repo),
    repoFetch<GhIssue[]>(
      `/repos/${owner}/${repo}/issues?state=all&sort=updated&per_page=10`
    ),
    fetchContributorCount(owner, repo),
  ]);

  const [rawLanguages, rawRelease, rawCommunity, rawParticipation] =
    await Promise.all([
      repoFetchSafe<Record<string, number>>(
        `/repos/${owner}/${repo}/languages`
      ),
      repoFetchSafe<GhRelease>(
        `/repos/${owner}/${repo}/releases/latest`
      ),
      repoFetchSafe<GhCommunityProfile>(
        `/repos/${owner}/${repo}/community/profile`
      ),
      repoFetchSafe<GhParticipation>(
        `/repos/${owner}/${repo}/stats/participation`
      ),
    ]);

  const openPrsCount = openPulls;
  const openIssuesCount = Math.max(
    0,
    ghRepo.open_issues_count - openPrsCount
  );

  const BOT_SUFFIXES = ["[bot]", "-bot", "bot"];
  const isBot = (login: string) =>
    BOT_SUFFIXES.some((s) => login.toLowerCase().endsWith(s)) ||
    login === "dependabot" || login === "renovate" || login === "greenkeeper";

  const recentActivity: RepoShowroomActivity[] = recentIssues
    .filter((i) => !isBot(i.user.login))
    .map((i) => ({
      id: i.id,
      number: i.number,
      title: i.title,
      body: i.body,
      html_url: i.html_url,
      state: (i.state === "open" ? "open" : "closed") as "open" | "closed",
      user: i.user,
      created_at: i.created_at,
      updated_at: i.updated_at,
      is_pr: "pull_request" in i && !!i.pull_request,
    }))
    .slice(0, 8);

  const homepage =
    ghRepo.homepage && ghRepo.homepage.trim() !== "" ? ghRepo.homepage : null;

  const licenseId = ghRepo.license?.spdx_id ?? null;

  return {
    repo: {
      name: ghRepo.name,
      full_name: ghRepo.full_name,
      description: ghRepo.description,
      html_url: ghRepo.html_url,
      homepage,
      stargazers_count: ghRepo.stargazers_count,
      forks_count: ghRepo.forks_count,
      open_issues_count: ghRepo.open_issues_count,
      language: ghRepo.language,
      topics: ghRepo.topics ?? [],
      license: licenseId !== "NOASSERTION" ? licenseId : null,
      pushed_at: ghRepo.pushed_at,
      created_at: ghRepo.created_at,
      owner: ghRepo.owner,
    },
    contributors: contributors.map((c) => ({
      login: c.login,
      avatar_url: c.avatar_url,
      html_url: c.html_url,
      contributions: c.contributions,
      type: c.type as "User" | "Bot" | undefined,
    })),
    contributorCount: Math.max(contributorCount, contributors.length),
    openPrsCount,
    openIssuesCount,
    recentActivity,
    languages: rawLanguages ? parseLanguages(rawLanguages) : [],
    latestRelease: rawRelease
      ? {
          tag_name: rawRelease.tag_name,
          name: rawRelease.name,
          published_at: rawRelease.published_at,
          html_url: rawRelease.html_url,
        }
      : null,
    communityHealth: rawCommunity ? parseCommunity(rawCommunity) : null,
    weeklyCommits: rawParticipation?.all?.slice(-12) ?? [],
  };
}
