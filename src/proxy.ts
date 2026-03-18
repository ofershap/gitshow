import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GITHUB_URL_RE =
  /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/;

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_MAX;
}

function extractUsername(input: string): string | null {
  const match = input.match(GITHUB_URL_RE);
  if (match) return match[1];

  if (/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(input)) {
    return input;
  }

  return null;
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams, search } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }

    return NextResponse.next();
  }

  const urlParam = searchParams.get("url");
  if (urlParam) {
    const username = extractUsername(urlParam);
    if (username) {
      return NextResponse.redirect(new URL(`/${username}`, request.url));
    }
  }

  const raw = search.replace(/^\?/, "");
  if (raw && !raw.includes("=")) {
    const decoded = decodeURIComponent(raw);
    const username = extractUsername(decoded);
    if (username) {
      return NextResponse.redirect(new URL(`/${username}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/:path*"],
};
