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
      <div className="noise relative overflow-hidden rounded-3xl border border-[--color-border] bg-[--color-surface-raised] p-12">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/10 blur-[60px]" />
        <h1 className="relative font-display text-4xl font-bold text-white">
          {isRateLimit ? "Rate Limited" : "Something went wrong"}
        </h1>
        <p className="relative mt-4 text-gray-400">
          {isRateLimit
            ? "GitHub API rate limit exceeded. Please try again in a few minutes."
            : "Failed to load this profile. Please try again."}
        </p>
        <div className="relative mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl border border-[--color-border] bg-[--color-surface] px-6 py-2.5 text-sm text-white transition-all hover:border-[--color-border-hover] hover:bg-[--color-surface-hover]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
