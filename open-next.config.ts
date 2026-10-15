import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import cdnIncrementalCache from "./src/lib/expiring-kv-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// ISR entries are stored in the Cloudflare Cache API (see src/lib/expiring-kv-cache.ts),
// not in Workers KV: the free KV tier allows 1K writes/day and R2 operations were
// billed past the free allowance in the 2026-09-22 cycle.
export default defineCloudflareConfig({
  incrementalCache: cdnIncrementalCache,
  queue: doQueue,
  // Workaround for opennextjs-cloudflare#754: on-demand ISR pages on dynamic
  // routes never reach HIT (always STALE -> revalidated on every request).
  // Interception serves cached pages before hitting NextServer.
  enableCacheInterception: true,
});
