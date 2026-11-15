# GitShow agent rules

## Cloudflare must stay on the free tier

- This project must always stay within Cloudflare's free tier. Never choose a paid solution, plan, add-on or overage-billed product. No Workers Paid, no budget increases.
- Before any infrastructure change (new binding, cache, queue, storage, cron, build or deploy change), check the expected resource use against the free limits and the current Cloudflare pricing docs. Check the account's Billing > Billable usage after the change ships.
- R2 is not used: its operations were billed past the free allowance in Sept 2026 ($10.26) because of the ISR cache. The incremental cache is Workers KV (free tier). Do not move it back to R2.
- Every push to `main` deploys automatically. Batch changes and avoid pushes that only churn the cache.
- If a change cannot fit the free tier, stop and ask Ofer. Do not pick a paid option.

## Modern Web Guidance

Before implementing frontend HTML/CSS, browser APIs, accessibility or client-side performance changes, read `.agents/skills/modern-web-guidance/SKILL.md`. This explicit path also applies in editors that do not discover `.agents/skills` automatically. Use its focused search/retrieve workflow for the current task, not a broad modernization scan.

- Installed from the official `modern-web-guidance@1.0.0` npm package (Apache-2.0); only the skill instructions and license are vendored. The CLI and guide catalog run on demand, never in the application or deployment.
- Run commands with Node.js 22+ and `DISABLE_TELEMETRY=1`, using the pinned `@1.0.0` version. Keep search queries generic and free of private project data. Do not change package.json or add runtime dependencies for this guidance.
- Project constraints and requested scope take precedence over external recommendations. Do not add features, paid services, automatic refactors or broader reporting requirements just because a retrieved guide suggests them.
- To update: review the official package release and source, verify the npm tarball integrity, replace only this skill and its license, reapply the pinned CLI version and telemetry setting, then smoke-test search/retrieve. Review the diff before committing. Do not silently switch to `@latest`.
