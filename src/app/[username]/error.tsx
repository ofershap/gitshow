"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isRateLimit = error.message?.includes("rate limit");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-white">
          {isRateLimit ? "Rate Limited" : "Something went wrong"}
        </h1>
        <p className="mt-4 text-gray-400">
          {isRateLimit
            ? "GitHub API rate limit exceeded. Please try again in a few minutes."
            : "Failed to load this profile. Please try again."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-200"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
