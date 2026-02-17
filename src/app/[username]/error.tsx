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
      <div className="relative overflow-hidden rounded-3xl p-12" style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}>
        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/10 blur-[60px]" />
        <h1 className="relative font-display text-4xl font-bold text-white">
          {isRateLimit ? "Rate Limited" : "Something went wrong"}
        </h1>
        <p className="relative mt-4 text-zinc-400">
          {isRateLimit
            ? "GitHub API rate limit exceeded. Please try again in a few minutes."
            : "Failed to load this profile. Please try again."}
        </p>
        <div className="relative mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl px-6 py-2.5 text-sm text-white transition-all hover:brightness-110"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl px-6 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)", boxShadow: "0 4px 20px rgba(20,184,166,0.25)" }}
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
