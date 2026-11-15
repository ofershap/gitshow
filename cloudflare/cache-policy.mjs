// Only explicitly cacheable public responses may enter Workers Cache.
// Preserve Next.js lifetimes and variants. Unknown routes fail closed.
const USER = '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?';
const REPO = '[A-Za-z0-9._-]{1,100}';
const PUBLIC = new RegExp(`^/(?:${USER}(?:/${REPO})?|api/og(?:/${USER}(?:/${REPO})?)?|api/card/${USER})?/?$`);
const DENY = /(?:^|,)\s*(?:private|no-store|no-cache)(?:\s|,|=|$)/i;
const POSITIVE_TTL = /(?:^|,)\s*(?:s-maxage|max-age)\s*=\s*"?([1-9][0-9]*)"?(?:\s|,|$)/i;

export function applyCachePolicy(request, response) {
  const headers = new Headers(response.headers);
  const controls = ['cache-control', 'cdn-cache-control', 'cloudflare-cdn-cache-control']
    .map(name => headers.get(name)).filter(Boolean);
  const safe = ['GET', 'HEAD'].includes(request.method)
    && PUBLIC.test(new URL(request.url).pathname)
    && response.status === 200
    && !request.headers.has('cookie')
    && !request.headers.has('authorization')
    && !headers.has('set-cookie')
    && !controls.some(value => DENY.test(value))
    && controls.some(value => POSITIVE_TTL.test(value));

  // Vary is checked before invoking the Worker. Add these even on anonymous
  // fills, so a later stateful request cannot hit that anonymous response.
  const vary = new Map((headers.get('vary') || '').split(',').map(x => x.trim())
    .filter(Boolean).map(x => [x.toLowerCase(), x]));
  for (const name of ['Cookie', 'Authorization', 'Host']) vary.set(name.toLowerCase(), name);
  headers.set('vary', [...vary.values()].join(', '));
  if (!safe) {
    headers.set('cloudflare-cdn-cache-control', 'no-store');
    headers.set('cdn-cache-control', 'no-store');
    headers.set('cache-control', 'private, no-store');
  }
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}
