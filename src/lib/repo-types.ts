export interface RepoContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type?: "User" | "Bot";
}

export interface RepoShowroomActivity {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  state: "open" | "closed";
  user: { login: string; avatar_url: string; html_url: string };
  created_at: string;
  updated_at: string;
  is_pr: boolean;
}

export interface LanguageBreakdown {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface LatestRelease {
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
}

export interface CommunityHealth {
  health_percentage: number;
  files: {
    readme: boolean;
    license: boolean;
    contributing: boolean;
    code_of_conduct: boolean;
    issue_template: boolean;
    pull_request_template: boolean;
  };
}

export interface RepoShowroomData {
  repo: {
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
    license: string | null;
    pushed_at: string;
    created_at: string;
    owner: { login: string; avatar_url: string; html_url: string };
  };
  contributors: RepoContributor[];
  contributorCount: number;
  openPrsCount: number;
  openIssuesCount: number;
  recentActivity: RepoShowroomActivity[];
  languages: LanguageBreakdown[];
  latestRelease: LatestRelease | null;
  communityHealth: CommunityHealth | null;
  weeklyCommits: number[];
}
