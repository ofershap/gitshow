import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GITHUB_URL_RE =
  /^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\/?$/;

function extractUsername(input: string): string | null {
  const match = input.match(GITHUB_URL_RE);
  if (match) return match[1];

  if (/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(input)) {
    return input;
  }

  return null;
}

export function proxy(request: NextRequest) {
  const { searchParams, search } = request.nextUrl;

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
  matcher: "/",
};
