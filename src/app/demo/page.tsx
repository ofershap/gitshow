import { HeroCard } from "@/components/hero-card";
import { CategorySection } from "@/components/category-section";
import { NpmCard } from "@/components/npm-card";
import { TechStack } from "@/components/tech-stack";
import { TopicCloud } from "@/components/topic-cloud";
import { ActivityGraph } from "@/components/activity-graph";
import { SocialLinks } from "@/components/social-links";
import { Footer } from "@/components/footer";
import type { GitHubUser, GitHubRepo, RepoCategory, NpmStats, LanguageStats } from "@/lib/types";

const user: GitHubUser = {
  login: "alexchen",
  name: "Alex Chen",
  avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  html_url: "https://github.com/alexchen",
  bio: "Staff Engineer at Vercel. Building tools that make developers faster. TypeScript, Rust, Go.",
  company: "Vercel",
  location: "San Francisco, CA",
  blog: "https://alexchen.dev",
  twitter_username: "alexchendev",
  public_repos: 84,
  followers: 12400,
  following: 230,
  created_at: "2014-03-15T00:00:00Z",
};

const makeRepo = (name: string, desc: string, lang: string, stars: number, topics: string[], pushed: string): GitHubRepo => ({
  name,
  description: desc,
  html_url: `https://github.com/alexchen/${name}`,
  homepage: null,
  stargazers_count: stars,
  forks_count: Math.floor(stars * 0.12),
  language: lang,
  topics,
  fork: false,
  archived: false,
  pushed_at: pushed,
  created_at: "2022-01-01T00:00:00Z",
  updated_at: pushed,
});

const repos: GitHubRepo[] = [
  makeRepo("turbocache", "Blazing fast build cache for monorepos", "Rust", 8200, ["rust", "build-tools", "monorepo", "cache"], "2026-02-15T00:00:00Z"),
  makeRepo("edge-router", "Type-safe API router for edge runtimes", "TypeScript", 5100, ["typescript", "edge", "api", "router"], "2026-02-10T00:00:00Z"),
  makeRepo("react-motion-kit", "Production-ready animation primitives for React", "TypeScript", 3400, ["react", "animation", "motion", "ui"], "2026-02-12T00:00:00Z"),
  makeRepo("schema-forge", "Generate TypeScript types from any data source", "TypeScript", 2900, ["typescript", "codegen", "schema", "cli"], "2026-01-28T00:00:00Z"),
  makeRepo("pg-migrate", "Zero-downtime PostgreSQL migrations", "Go", 2100, ["go", "postgres", "migrations", "database"], "2026-01-20T00:00:00Z"),
  makeRepo("use-realtime", "React hooks for WebSocket & SSE connections", "TypeScript", 1800, ["react", "hooks", "websocket", "realtime"], "2026-02-01T00:00:00Z"),
  makeRepo("dotenv-vault", "Encrypted environment variable management", "TypeScript", 1500, ["security", "env", "cli", "encryption"], "2026-01-15T00:00:00Z"),
  makeRepo("bench-it", "Micro-benchmarking framework for Node.js", "TypeScript", 1200, ["benchmarking", "performance", "nodejs"], "2025-12-20T00:00:00Z"),
  makeRepo("k8s-lens", "Kubernetes cluster visualization CLI", "Go", 980, ["kubernetes", "cli", "devops", "monitoring"], "2025-11-10T00:00:00Z"),
  makeRepo("ai-gateway", "Rate-limited proxy for LLM APIs", "TypeScript", 870, ["ai", "llm", "proxy", "api"], "2026-02-08T00:00:00Z"),
  makeRepo("css-reset-2026", "Modern CSS reset for 2026 browsers", "CSS", 650, ["css", "reset", "frontend"], "2025-10-01T00:00:00Z"),
  makeRepo("git-stack", "Stacked PRs workflow for Git", "Rust", 520, ["git", "cli", "workflow", "rust"], "2025-09-15T00:00:00Z"),
];

const categories: RepoCategory[] = [
  { label: "Developer Tools", emoji: "🛠️", repos: repos.filter(r => ["turbocache", "schema-forge", "bench-it", "git-stack"].includes(r.name)) },
  { label: "Web & API", emoji: "🌐", repos: repos.filter(r => ["edge-router", "ai-gateway", "dotenv-vault"].includes(r.name)) },
  { label: "React & UI", emoji: "⚛️", repos: repos.filter(r => ["react-motion-kit", "use-realtime", "css-reset-2026"].includes(r.name)) },
  { label: "Infrastructure", emoji: "🏗️", repos: repos.filter(r => ["pg-migrate", "k8s-lens"].includes(r.name)) },
];

const languages: LanguageStats[] = [
  { name: "TypeScript", count: 7, percentage: 52, color: "#3178c6" },
  { name: "Rust", count: 2, percentage: 18, color: "#dea584" },
  { name: "Go", count: 2, percentage: 16, color: "#00ADD8" },
  { name: "CSS", count: 1, percentage: 8, color: "#563d7c" },
  { name: "Shell", count: 1, percentage: 6, color: "#89e051" },
];

const npmStats: NpmStats = {
  totalDownloads: 284000,
  packages: [
    { name: "edge-router", downloads: 89000 },
    { name: "react-motion-kit", downloads: 72000 },
    { name: "schema-forge", downloads: 51000 },
    { name: "use-realtime", downloads: 38000 },
    { name: "dotenv-vault", downloads: 22000 },
    { name: "bench-it", downloads: 12000 },
  ],
};

const topTopics = [
  { name: "typescript", count: 7 },
  { name: "react", count: 3 },
  { name: "cli", count: 3 },
  { name: "rust", count: 2 },
  { name: "api", count: 2 },
  { name: "go", count: 2 },
  { name: "devops", count: 2 },
  { name: "performance", count: 2 },
  { name: "ai", count: 1 },
  { name: "kubernetes", count: 1 },
];

const activityTimeline = [
  { month: "2025-04", count: 1 },
  { month: "2025-06", count: 2 },
  { month: "2025-08", count: 1 },
  { month: "2025-09", count: 2 },
  { month: "2025-10", count: 1 },
  { month: "2025-11", count: 1 },
  { month: "2025-12", count: 2 },
  { month: "2026-01", count: 3 },
  { month: "2026-02", count: 4 },
];

const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

export default function DemoPage() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-6">
      <div className="animate-fade-up">
        <HeroCard
          user={user}
          totalStars={totalStars}
          totalForks={totalForks}
          repoCount={repos.length}
          npmStats={npmStats}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8 animate-fade-up stagger-2">
          <CategorySection categories={categories} />
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="animate-fade-up stagger-3">
            <NpmCard stats={npmStats} />
          </div>
          <div className="animate-fade-up stagger-4">
            <TechStack languages={languages} />
          </div>
          <div className="animate-fade-up stagger-5">
            <TopicCloud topics={topTopics} />
          </div>
          <div className="animate-fade-up stagger-6">
            <ActivityGraph timeline={activityTimeline} />
          </div>
          <div className="animate-fade-up stagger-7">
            <SocialLinks user={user} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
