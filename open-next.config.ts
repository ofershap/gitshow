import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// The ISR cache lives in Workers KV (free tier), not R2. R2 operations were
// billed past the free allowance in the 2026-09-22 cycle.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  queue: doQueue,
  // Workaround for opennextjs-cloudflare#754: on-demand ISR pages on dynamic
  // routes never reach HIT (always STALE -> revalidated on every request),
  // which was churning ~40k KV writes/day. Interception serves cached pages
  // before hitting NextServer.
  enableCacheInterception: true,
});
