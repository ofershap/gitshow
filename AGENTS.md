# GitShow agent rules



## Cloudflare must stay on the free tier



- This project must always stay within Cloudflare's free tier. Never choose a paid solution, plan, add-on or overage-billed product. No Workers Paid, no budget increases.
- 
- Before any infrastructure change (new binding, cache, queue, storage, cron, build or deploy change), check the expected resource use against the free limits and the current Cloudflare pricing docs. Check the account's Billing > Billable usage after the change ships.
- 
- R2 is not used: its operations were billed past the free allowance in Sept 2026 ($10.26) because of the ISR cache. The incremental cache is Workers KV (free tier). Do not move it back to R2.
- 
- Every push to `main` deploys automatically. Batch changes and avoid pushes that only churn the cache.
- 
- If a change cannot fit the free tier, stop and ask Ofer. Do not pick a paid option.



