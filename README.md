# gitshow

[![CI](https://github.com/ofershap/gitshow/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/gitshow/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Replace `github.com` with `gitshow.me` in any GitHub profile URL to get a stunning developer portfolio — instantly, no signup required.

```
github.com/torvalds  →  gitshow.me/torvalds
```

> Beautiful developer portfolios generated from GitHub profiles. Bento-grid layout, dynamic OG images for social sharing, mobile-friendly. Built with Next.js, fully open source.

## How It Works

1. Take any GitHub profile URL: `https://github.com/username`
2. Replace the domain: `https://gitshow.me/username`
3. Share your beautiful portfolio on Twitter, LinkedIn, or anywhere

Every portfolio page includes:

- **Profile overview** — avatar, bio, stats (repos, stars, forks, followers)
- **Top repositories** — sorted by stars, with descriptions, languages, and topics
- **Language breakdown** — visual chart of your tech stack
- **Social links** — GitHub, Twitter/X, LinkedIn, website (auto-detected)
- **OG image** — dynamic social preview card generated for every profile

## Self-Hosting

Clone and deploy your own instance:

```bash
git clone https://github.com/ofershap/gitshow.git
cd gitshow
npm install
npm run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub personal access token for higher API rate limits (60/hr without, 5000/hr with) |

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fofershap%2Fgitshow)

## Tech Stack

- **Next.js 16** — App Router, ISR (revalidate every hour)
- **React 19** — Server Components
- **Tailwind CSS 4** — Utility-first styling
- **TypeScript** — Strict mode
- **Vercel OG** — Dynamic social preview images
- **GitHub REST API** — Profile and repository data

## Development

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## License

MIT
