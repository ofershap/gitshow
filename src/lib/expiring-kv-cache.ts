import { createHash } from "node:crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import type { IncrementalCache } from "@opennextjs/aws/types/overrides";

// Keep a week of stale data for ISR's failure fallback after the daily refresh.
// Only new runtime writes get expiration. Existing keys are left untouched.
const CACHE_RETENTION_SECONDS = 7 * 86400;

const expiringKVCache: IncrementalCache = {
  name: kvIncrementalCache.name,
  get: kvIncrementalCache.get.bind(kvIncrementalCache),
  delete: kvIncrementalCache.delete.bind(kvIncrementalCache),
  async set(key, value, cacheType) {
    const { env } = getCloudflareContext();
    const kv = env.NEXT_INC_CACHE_KV;
    if (!kv) throw new Error("No KV Namespace");
    const prefix = env.NEXT_INC_CACHE_KV_PREFIX ?? "incremental-cache";
    const buildId = process.env.NEXT_BUILD_ID ?? "no-build-id";
    const hash = createHash("sha256").update(key).digest("hex");
    const kvKey = `${prefix}/${buildId}/${hash}.${cacheType ?? "cache"}`.replace(/\/+/g, "/");
    try {
      await kv.put(kvKey, JSON.stringify({ value, lastModified: Date.now() }), {
        expirationTtl: CACHE_RETENTION_SECONDS,
      });
    } catch (error) {
      // Match the upstream adapter: a failed cache write must not break a page.
      console.error("Failed to set cache", error);
    }
  },
};

export default expiringKVCache;
