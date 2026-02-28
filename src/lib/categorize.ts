import { GitHubRepo, RepoCategory } from "./types";

interface CategoryRule {
  label: string;
  emoji: string;
  match: (repo: GitHubRepo) => boolean;
  priority: number;
}

const lc = (s: string) => s.toLowerCase();
const descMatch = (desc: string | null, re: RegExp) =>
  desc ? re.test(desc) : false;

const RULES: CategoryRule[] = [
  {
    label: "MCP Servers",
    emoji: "🔌",
    priority: 10,
    match: (r) =>
      lc(r.name).includes("mcp-server") ||
      lc(r.name).includes("mcp") ||
      r.topics.some((t) => ["mcp", "model-context-protocol"].includes(t)),
  },
  {
    label: "GitHub Actions",
    emoji: "⚡",
    priority: 9,
    match: (r) =>
      r.topics.some((t) => ["github-action", "action", "github-actions", "ci-cd", "ci", "automation"].includes(t)) ||
      lc(r.name).includes("-action") ||
      lc(r.name).includes("changelog") ||
      descMatch(r.description, /\b(github.?action|pull.?request|ci\/cd|automat)/i),
  },
  {
    label: "AI & ML",
    emoji: "🤖",
    priority: 8,
    match: (r) =>
      lc(r.name).startsWith("ai-") ||
      lc(r.name).includes("llm") ||
      lc(r.name).includes("gpt") ||
      lc(r.name).includes("openai") ||
      lc(r.name).includes("langchain") ||
      r.topics.some((t) =>
        ["ai", "ai-agent", "machine-learning", "openai", "llm", "deep-learning", "chatgpt", "claude", "claude-code", "anthropic", "gpt-4", "cursor-plugin", "cursor-ide"].includes(t)
      ) ||
      lc(r.name).includes("cursor") ||
      descMatch(r.description, /\b(ai|llm|gpt|machine.?learn|neural|model|inference|cursor|claude|agent)\b/i),
  },
  {
    label: "Web Frameworks",
    emoji: "🌐",
    priority: 7,
    match: (r) =>
      r.topics.some((t) =>
        ["nextjs", "nuxt", "svelte", "sveltekit", "remix", "astro", "express", "fastify", "django", "flask", "rails", "laravel", "spring"].includes(t)
      ) ||
      descMatch(r.description, /\b(framework|full.?stack|web.?app|web.?framework)\b/i),
  },
  {
    label: "React & UI",
    emoji: "⚛️",
    priority: 6,
    match: (r) =>
      r.topics.some((t) =>
        ["react", "vue", "svelte", "angular", "component", "ui", "css", "design-system", "tailwind"].includes(t)
      ) ||
      lc(r.name).startsWith("use-") ||
      lc(r.name).startsWith("react-") ||
      lc(r.name).startsWith("vue-") ||
      lc(r.name).includes("component") ||
      lc(r.name).includes("ui-") ||
      descMatch(r.description, /\b(react|vue|component|hook|ui.?kit|design.?system)\b/i),
  },
  {
    label: "CLI Tools",
    emoji: "💻",
    priority: 5,
    match: (r) =>
      r.topics.some((t) => ["cli", "terminal", "tui", "command-line", "scaffold"].includes(t)) ||
      lc(r.name).startsWith("create-") ||
      descMatch(r.description, /\b(cli|command.?line|terminal|tui)\b/i),
  },
  {
    label: "DevOps & Infra",
    emoji: "🔧",
    priority: 5,
    match: (r) =>
      r.topics.some((t) =>
        ["docker", "kubernetes", "k8s", "terraform", "devops", "ci-cd", "infrastructure", "cloud", "aws", "gcp", "azure", "helm", "serverless"].includes(t)
      ) ||
      descMatch(r.description, /\b(docker|kubernetes|k8s|terraform|deploy|infra|cloud|serverless|container)\b/i),
  },
  {
    label: "i18n & Localization",
    emoji: "🌍",
    priority: 4,
    match: (r) =>
      r.topics.some((t) =>
        ["hebrew", "i18n", "rtl", "arabic", "israel", "localization", "l10n", "internationalization"].includes(t)
      ) ||
      descMatch(r.description, /\b(i18n|rtl|hebrew|arabic|localization|translation)\b/i),
  },
  {
    label: "macOS & Desktop",
    emoji: "🖥️",
    priority: 4,
    match: (r) =>
      r.topics.some((t) =>
        ["macos", "macos-app", "electron", "tauri", "desktop", "swift", "swiftui", "cocoa"].includes(t)
      ) ||
      r.language === "Swift" ||
      descMatch(r.description, /\b(macos|desktop|electron|tauri|menubar)\b/i),
  },
  {
    label: "Mobile",
    emoji: "📱",
    priority: 4,
    match: (r) =>
      r.topics.some((t) =>
        ["ios", "android", "react-native", "flutter", "mobile", "expo", "swift", "kotlin"].includes(t)
      ) ||
      r.language === "Kotlin" ||
      r.language === "Dart" ||
      descMatch(r.description, /\b(ios|android|mobile|react.?native|flutter)\b/i),
  },
  {
    label: "Go Packages",
    emoji: "🐹",
    priority: 3,
    match: (r) =>
      r.language === "Go" &&
      r.topics.some((t) => ["golang", "go", "golang-package", "golang-library"].includes(t)),
  },
  {
    label: "Rust Crates",
    emoji: "🦀",
    priority: 3,
    match: (r) => r.language === "Rust",
  },
  {
    label: "Python Packages",
    emoji: "🐍",
    priority: 3,
    match: (r) =>
      r.language === "Python" &&
      !r.topics.some((t) => ["ai", "machine-learning", "deep-learning"].includes(t)),
  },
  {
    label: "Libraries & Utilities",
    emoji: "📦",
    priority: 2,
    match: (r) =>
      r.topics.some((t) =>
        ["npm-package", "zero-dependency", "typescript", "library", "utility", "utils", "package"].includes(t)
      ) ||
      descMatch(r.description, /\b(library|utility|helper|lightweight|zero.?dep|tiny)\b/i),
  },
];

function repoScore(r: GitHubRepo): number {
  const stars = r.stargazers_count * 3;
  const forks = r.forks_count * 2;
  const daysSincePush = (Date.now() - new Date(r.pushed_at).getTime()) / 86_400_000;
  const recency = Math.max(0, 1 - daysSincePush / 365);
  return stars + forks + recency;
}

function categoryScore(repos: GitHubRepo[]): number {
  const topRepo = Math.max(...repos.map(repoScore));
  const aggregate = repos.reduce((sum, r) => sum + repoScore(r), 0);
  return topRepo * 2 + aggregate;
}

function sortRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return [...repos].sort((a, b) => repoScore(b) - repoScore(a));
}

export function categorizeRepos(repos: GitHubRepo[]): RepoCategory[] {
  const visible = repos.filter((r) => r.description || r.topics.length > 0);

  const assigned = new Set<string>();
  const categoryMap = new Map<string, RepoCategory>();

  const sortedRules = [...RULES].sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    const matched = visible.filter(
      (r) => !assigned.has(r.name) && rule.match(r)
    );
    if (matched.length > 0) {
      categoryMap.set(rule.label, {
        label: rule.label,
        emoji: rule.emoji,
        repos: sortRepos(matched),
      });
      matched.forEach((r) => assigned.add(r.name));
    }
  }

  const uncategorized = visible.filter((r) => !assigned.has(r.name));

  if (uncategorized.length > 0) {
    const byLang = new Map<string, GitHubRepo[]>();
    for (const r of uncategorized) {
      const lang = r.language ?? "Other";
      if (!byLang.has(lang)) byLang.set(lang, []);
      byLang.get(lang)!.push(r);
    }

    const otherBucket: GitHubRepo[] = [];

    for (const [lang, langRepos] of byLang) {
      if (lang === "Other" || langRepos.length < 2) {
        otherBucket.push(...langRepos);
        continue;
      }

      const existing = Array.from(categoryMap.values()).find((c) =>
        c.label.toLowerCase().includes(lang.toLowerCase())
      );
      if (existing) {
        existing.repos.push(...sortRepos(langRepos));
      } else {
        const emoji = LANG_EMOJI[lang] ?? "📁";
        categoryMap.set(lang, {
          label: `${lang} Projects`,
          emoji,
          repos: sortRepos(langRepos),
        });
      }
    }

    if (otherBucket.length > 0) {
      categoryMap.set("Other Projects", {
        label: "Other Projects",
        emoji: "📁",
        repos: sortRepos(otherBucket),
      });
    }
  }

  const MAX_CATEGORIES = 8;
  let result = Array.from(categoryMap.values())
    .filter((c) => c.repos.length > 0)
    .sort((a, b) => {
      if (a.label === "Other Projects") return 1;
      if (b.label === "Other Projects") return -1;
      return categoryScore(b.repos) - categoryScore(a.repos);
    });

  if (result.length > MAX_CATEGORIES) {
    const keep = result.slice(0, MAX_CATEGORIES - 1);
    const merge = result.slice(MAX_CATEGORIES - 1);
    const mergedRepos = merge.flatMap((c) => c.repos);

    const existingOther = keep.find((c) => c.label === "Other Projects");
    if (existingOther) {
      existingOther.repos.push(...sortRepos(mergedRepos));
    } else {
      keep.push({
        label: "Other Projects",
        emoji: "📁",
        repos: sortRepos(mergedRepos),
      });
    }
    result = keep;
  }

  return result;
}

const LANG_EMOJI: Record<string, string> = {
  TypeScript: "🔷",
  JavaScript: "🟡",
  Python: "🐍",
  Go: "🐹",
  Rust: "🦀",
  Java: "☕",
  "C++": "⚙️",
  C: "⚙️",
  Ruby: "💎",
  PHP: "🐘",
  Swift: "🍎",
  Kotlin: "🟣",
  Dart: "🎯",
  Shell: "🐚",
  HTML: "🌐",
  CSS: "🎨",
  Vue: "💚",
  Elixir: "💧",
};
