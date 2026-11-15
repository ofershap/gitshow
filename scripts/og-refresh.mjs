// og-refresh: re-renders og images OUTSIDE the worker and uploads them to the
// gitshow-og-cache KV namespace. Runs from GitHub Actions (daily + dispatch).
//
// What it renders:
//   - the seed set below (profiles linked from Ofer's READMEs)
//   - every key in the KV "og:pending" list (bounded at 200 by the worker;
//     populated when a request misses the cache and gets the static fallback)
// On success the key leaves the pending list; on failure it stays for the
// next run. Long-cached keys that never miss are not auto-refreshed yet.
//
// Never prints secrets. Fails red (exit 1) if any render or upload failed.

const ACCOUNT = process.env.CF_ACCOUNT_ID;
const NS = process.env.OG_KV_NAMESPACE_ID;
const TOKEN = process.env.CF_API_TOKEN;
const PRERENDER_KEY = process.env.OG_PRERENDER_KEY || "og-render-ci";
const PORT = process.env.OG_RENDER_PORT || "3939";
const SEED_USERS = ["ofershap", "torvalds", "sindresorhus"];
const PENDING_CAP = 200;

if (!ACCOUNT || !NS || !TOKEN) {
  console.error("missing CF_ACCOUNT_ID / OG_KV_NAMESPACE_ID / CF_API_TOKEN");
  process.exit(2);
}

const API = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/storage/kv/namespaces/${NS}`;

async function cf(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: { Authorization: `Bearer ${TOKEN}`, ...(opts.headers || {}) },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || (body && body.success === false)) {
    throw new Error(`CF ${path}: HTTP ${res.status}`);
  }
  return body;
}

function keyToUrlPath(key) {
  if (key === "index") return "/api/og";
  const parts = key.split("/");
  if (parts[0] === "user" && parts.length === 2) return `/api/og/${parts[1]}`;
  if (parts[0] === "repo" && parts.length === 3)
    return `/api/og/${parts[1]}/${parts[2]}`;
  return null;
}

const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
const REPO_RE = /^[A-Za-z0-9._-]{1,100}$/;

function keyIsSafe(key) {
  if (key === "index") return true;
  const parts = key.split("/");
  if (parts[0] === "user" && parts.length === 2) return USERNAME_RE.test(parts[1]);
  if (parts[0] === "repo" && parts.length === 3)
    return USERNAME_RE.test(parts[1]) && REPO_RE.test(parts[2]);
  return false;
}

async function getPending() {
  const res = await fetch(`${API}/values/og:pending`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`read pending: HTTP ${res.status}`);
  const parsed = await res.json();
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((k) => typeof k === "string")
    .filter(keyIsSafe)
    .slice(0, PENDING_CAP);
}

// The local Next server shares the production /api/* limit: 20/min per IP.
// Pace requests rather than disabling the middleware in production.
const RENDER_INTERVAL_MS = 3100;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function render(path) {
  await sleep(RENDER_INTERVAL_MS);
  const request = () => fetch(`http://localhost:${PORT}${path}`, {
    headers: { "x-og-prerender": PRERENDER_KEY },
    signal: AbortSignal.timeout(60000),
  });
  let res = await request();
  if (res.status === 429) {
    // One bounded retry. Never hammer a throttled local/upstream service.
    const seconds = Number(res.headers.get("retry-after"));
    const waitMs = Number.isFinite(seconds) && seconds > 0
      ? Math.min(Math.max(seconds * 1000, 60000), 65000)
      : 60000;
    await res.arrayBuffer();
    await sleep(waitMs);
    res = await request();
  }
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.includes("image/png")) {
    const error = new Error(`render ${path}: HTTP ${res.status} ${type}`);
    error.status = res.status;
    throw error;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10000) throw new Error(`render ${path}: suspicious ${buf.length}B`);
  return buf;
}

async function upload(key, buf) {
  const res = await fetch(`${API}/values/${encodeURIComponent(`og:${key}`)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/octet-stream",
    },
    body: buf,
  });
  if (!res.ok) throw new Error(`upload og:${key}: HTTP ${res.status}`);
}

const pending = await getPending();
const keys = [...new Set([...SEED_USERS.map((u) => `user/${u}`), ...pending])];
console.log(`rendering ${keys.length} keys (${pending.length} pending)`);

const stillPending = new Set(pending);
let failures = 0;
for (const key of keys) {
  const path = keyToUrlPath(key);
  if (!path) {
    console.log(`skip unrecognized key ${key}`);
    stillPending.delete(key);
    continue;
  }
  try {
    const buf = await render(path);
    await upload(key, buf);
    stillPending.delete(key);
    console.log(`ok og:${key} ${buf.length}B`);
  } catch (e) {
    failures++;
    console.error(`FAIL ${key}: ${e.message}`);
    if (e.status === 429 || e.status === 403) {
      console.error("stopping on persistent throttling; remaining keys stay pending");
      break;
    }
  }
}

// Write back only genuinely-still-missing pending keys (seeds were never pending).
const remaining = pending.filter((k) => stillPending.has(k));
await cf(`/values/og:pending`, {
  method: "PUT",
  headers: { "Content-Type": "text/plain" },
  body: JSON.stringify(remaining),
});
console.log(`done: ${keys.length - failures}/${keys.length} rendered, ${remaining.length} still pending`);
if (failures > 0) process.exit(1);
