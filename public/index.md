# GitShow — Developer Portfolios & Repository Showrooms from Any GitHub URL

GitShow transforms any public GitHub profile into an auto-generated developer portfolio, and any public repository into an open source showroom. Replace `github.com` with `gitshow.dev` in any profile or repo URL — no signup, no config, no deploy.

## How to use

- `github.com/username` → `gitshow.dev/username` (developer portfolio)
- `github.com/owner/repo` → `gitshow.dev/owner/repo` (repository showroom)

## What it adds over GitHub

npm download stats, smart repo categorization, tech stack visualization, focus areas, project timelines, open source contribution history, and per-repo showrooms with team, languages, commit activity, community health, and latest releases.

## APIs

- README badge (460x56 PNG): `https://gitshow.dev/api/card/{username}`
- Profile OG image (1200x630 PNG): `https://gitshow.dev/api/og/{username}`
- Repo OG image (1200x630 PNG): `https://gitshow.dev/api/og/{owner}/{repo}`

## For agents

- llms.txt: https://gitshow.dev/llms.txt
- ARD catalog: https://gitshow.dev/.well-known/ard.json
- Agent card: https://gitshow.dev/.well-known/agent-card.json

Free, open source, no signup. Built by Ofer Shapira — https://github.com/ofershap/gitshow
