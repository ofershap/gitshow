// OG image serving layer.
//
// Request path NEVER renders: rendering satori in the worker exceeds the
// Workers Free 10ms CPU budget (chronic 1102s). Images are rendered offline
// (local `next dev` + the x-og-prerender secret header) and uploaded to the
// OG_CACHE_KV namespace. On a miss we serve the static fallback card and
// record the key (bounded, deduplicated) so the next render run can fill it.
// KV reads do not count toward worker CPU time.

import { getCloudflareContext } from "@opennextjs/cloudflare";

const PENDING_KEY = "og:pending";
const PENDING_CAP = 200;
const KEY_PREFIX = "og:";

interface OgKv {
  get(key: string, type: "arrayBuffer"): Promise<ArrayBuffer | null>;
  put(key: string, value: string): Promise<void>;
}

interface CfEnvLike {
  env: Record<string, unknown>;
}

async function ogKv(): Promise<OgKv | null> {
  try {
    const ctx = (await getCloudflareContext({
      async: true,
    })) as unknown as CfEnvLike;
    const kv = ctx.env?.OG_CACHE_KV;
    if (!kv) return null;
    return kv as OgKv;
  } catch {
    return null;
  }
}

export function ogPngResponse(body: ArrayBuffer): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "CDN-Cache-Control": "public, max-age=86400",
      "X-Og-Source": "kv",
    },
  });
}

export function ogFallbackRedirect(request: Request): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: new URL("/og-fallback.png", request.url).toString(),
      "Cache-Control": "public, max-age=60",
    },
  });
}

// Rendering stays available only to the offline render job: local next dev
// sets OG_PRERENDER_KEY and the job sends it as a header. Production has no
// OG_PRERENDER_KEY var, so the gate is always closed there.
export function isOgPrerender(request: Request): boolean {
  const expected = process.env.OG_PRERENDER_KEY;
  if (!expected) return false;
  return request.headers.get("x-og-prerender") === expected;
}

export async function readCachedOg(key: string): Promise<ArrayBuffer | null> {
  const kv = await ogKv();
  if (!kv) return null;
  try {
    const hit = await kv.get(KEY_PREFIX + key, "arrayBuffer");
    return hit;
  } catch {
    return null;
  }
}

// Bounded best-effort list of missed keys for the next render run. Cap keeps
// crawler traffic from growing it without limit; misses past the cap just get
// the fallback until the next upload.
export async function registerPendingOg(key: string): Promise<void> {
  const kv = await ogKv();
  if (!kv) return;
  try {
    const raw = await kv.get(PENDING_KEY, "arrayBuffer");
    const parsed: unknown = raw ? JSON.parse(new TextDecoder().decode(raw)) : [];
    if (!Array.isArray(parsed)) return;
    const list = parsed.filter((x): x is string => typeof x === "string");
    if (list.includes(key) || list.length >= PENDING_CAP) return;
    list.push(key);
    await kv.put(PENDING_KEY, JSON.stringify(list));
  } catch {
    // best effort; the fallback was already served
  }
}
