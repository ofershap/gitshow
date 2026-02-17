export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  created_at: string;
  updated_at: string;
}

export interface LanguageStats {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RepoCategory {
  label: string;
  emoji: string;
  repos: GitHubRepo[];
}

export interface NpmStats {
  totalDownloads: number;
  packages: { name: string; downloads: number }[];
}

export interface ProfileData {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: LanguageStats[];
  categories: RepoCategory[];
  totalStars: number;
  totalForks: number;
  npmStats: NpmStats | null;
  topTopics: { name: string; count: number }[];
  activityTimeline: { month: string; count: number }[];
}
