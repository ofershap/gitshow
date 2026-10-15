import { error } from "@opennextjs/aws/adapters/logger.js";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import type { IncrementalCache } from "@opennextjs/aws/types/overrides";

// ISR entries live in the Cloudflare Cache API (per data center, free, no write
// quota) instead of Workers KV, whose free tier allows only 1K writes/day.
// KV is kept as a read-only fallback for entries written at build time.
// Every runtime write goes to the Cache API only.
const CACHE_NAME = "gitshow-isr";
const RETENTION_SECONDS = 7 * 86400;

function cacheUrl(key: string, cacheType?: string): string {
  const buildId = process.env.NEXT_BUILD_ID ?? "no-build-id";
  return (
    "http://cache.local" + `/${buildId}/${key}`.replace(/\/+/g, "/") + `.${cacheType ?? "cache"}`
  );
}

let cachePromise: Promise<Cache> | undefined;
function getCache(): Promise<Cache> {
  cachePromise ??= caches.open(CACHE_NAME);
  return cachePromise;
}

const cdnIncrementalCache: IncrementalCache = {
  name: kvIncrementalCache.name,
  async get(key, cacheType) {
    try {
      const cache = await getCache();
      const hit = await cache.match(cacheUrl(key, cacheType));
      if (hit) return await hit.json();
    } catch (e) {
      error("Failed to read ISR entry from Cache API", e);
    }
    return kvIncrementalCache.get(key, cacheType);
  },
  async set(key, value, cacheType) {
    try {
      const cache = await getCache();
      await cache.put(
        cacheUrl(key, cacheType),
        new Response(JSON.stringify({ value, lastModified: Date.now() }), {
          headers: { "cache-control": `max-age=${RETENTION_SECONDS}` },
        })
      );
    } catch (e) {
      // A failed cache write must not break a page.
      error("Failed to write ISR entry to Cache API", e);
    }
  },
  async delete(key) {
    try {
      const cache = await getCache();
      await cache.delete(cacheUrl(key, "cache"));
    } catch (e) {
      error("Failed to delete ISR entry from Cache API", e);
    }
  },
};

export default cdnIncrementalCache;
