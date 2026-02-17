# GitShow

[![CI](https://github.com/ofershap/gitshow/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/gitshow/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Your GitHub profile is functional. Let's make it beautiful.**

```
https://github.com/torvalds  →  https://gitshow.me/torvalds
```

Just replace `github.com` with `gitshow.me` in any profile URL. That's it. No signup, no config, no deploy.

> Inspired by [GitMCP](https://gitmcp.io) — same URL-swap pattern, but for developer portfolios instead of AI context.

---

## See It In Action

| GitHub Profile | GitShow Portfolio |
|---|---|
| [github.com/torvalds](https://github.com/torvalds) | [gitshow.me/torvalds](https://gitshow.vercel.app/torvalds) |
| [github.com/sindresorhus](https://github.com/sindresorhus) | [gitshow.me/sindresorhus](https://gitshow.vercel.app/sindresorhus) |
| [github.com/tj](https://github.com/tj) | [gitshow.me/tj](https://gitshow.vercel.app/tj) |

---

## What You Get

Every profile is auto-generated with a bento-grid layout:

| Section | What's shown |
|---------|-------------|
| **Profile card** | Avatar, name, bio, company, location, member since |
| **Stats** | Repos, total stars, total forks, followers |
| **Top repositories** | 6 best repos sorted by stars → recency, with descriptions, language badges, topics |
| **Language chart** | Visual breakdown of your tech stack across all repos |
| **Social links** | GitHub, Twitter/X, LinkedIn, website — auto-detected from your profile |
| **OG image** | Dynamic 1200×630 social card — looks great when shared on Twitter & LinkedIn |

Forks and archived repos are automatically filtered out. Only your original work is shown.

---

## URL Patterns

All of these work:

```
gitshow.me/username                              # direct
gitshow.me/?url=https://github.com/username      # query param
gitshow.me/?https://github.com/username           # bare prefix
```

---

## Architecture

```
Browser request
    ↓
Next.js App Router (Vercel Edge)
    ↓
GitHub REST API (/users, /repos)
    ↓
Server-rendered portfolio page
    ↓
ISR cache (1 hour TTL)
```

| Component | Role |
|-----------|------|
| **Next.js 16** | App Router, Server Components, ISR |
| **React 19** | Zero client JS on portfolio pages |
| **Tailwind CSS 4** | Dark theme, responsive layout |
| **Vercel OG** | Dynamic social preview image generation (Satori) |
| **GitHub API** | Profile + repos data, cached with `revalidate: 3600` |

---

## Deploy Your Own

### One-click Vercel deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fofershap%2Fgitshow)

### Or clone and run locally

```bash
git clone https://github.com/ofershap/gitshow.git
cd gitshow
npm install
npm run dev    # → http://localhost:3000
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub PAT for higher rate limits (60/hr → 5,000/hr) |

> **Tip:** Without a token, the GitHub API allows 60 requests/hour per IP. If you're deploying publicly, add a token to avoid rate limiting.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page — URL swap animation, search
│   ├── layout.tsx                  # Root layout — dark theme, Geist font
│   ├── [username]/
│   │   ├── page.tsx                # Portfolio page (SSR + ISR)
│   │   ├── loading.tsx             # Spinner while loading
│   │   ├── error.tsx               # Error boundary (rate limit, etc.)
│   │   └── not-found.tsx           # 404 for invalid usernames
│   └── api/og/[username]/
│       └── route.tsx               # OG image generation (1200×630 PNG)
├── components/
│   ├── profile-header.tsx          # Avatar, name, bio, stats grid
│   ├── repo-card.tsx               # Repository card with stars, language, topics
│   ├── language-chart.tsx          # Stacked bar + legend
│   ├── social-links.tsx            # GitHub, Twitter, LinkedIn, website
│   ├── url-swap.tsx                # Animated URL swap (client)
│   └── username-input.tsx          # Search input (client)
├── lib/
│   ├── github.ts                   # GitHub API client with caching
│   ├── types.ts                    # TypeScript interfaces
│   └── utils.ts                    # formatNumber, timeAgo, getTopRepos
└── proxy.ts                        # URL redirect handler
```

---

## Development

```bash
npm run dev      # Dev server → localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

---

## How It Compares

| Feature | GitShow | GitProfile | CheckMyGit | GitHubFolio |
|---------|---------|-----------|------------|-------------|
| URL swap (no setup) | ✅ | ❌ (fork + deploy) | ❌ (enter username) | ❌ (enter username) |
| Central hosted URL | ✅ | ❌ | ✅ | ✅ |
| Dynamic OG images | ✅ | ❌ | PNG export | ❌ |
| Server-rendered (SEO) | ✅ | ✅ (static) | ❌ (client) | ❌ (client) |
| Smart repo curation | ✅ | ❌ | ❌ | ❌ |
| Self-hostable | ✅ | ✅ | ✅ | ❌ |
| Mobile-first | ✅ | ✅ | ✅ | ✅ |

---

## License

MIT © [Ofer Shapira](https://github.com/ofershap)
