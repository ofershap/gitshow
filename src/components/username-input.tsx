"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export function UsernameInput() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed) {
      router.push(`/${trimmed}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-violet-400/60">
          @
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full rounded-xl border border-[--color-border] bg-[--color-surface-raised] py-3 pl-9 pr-4 font-mono text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-violet-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.15)] focus:ring-1 focus:ring-violet-500/30"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-3 font-display text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40 hover:brightness-110 disabled:opacity-50"
        disabled={!username.trim()}
      >
        Generate
      </button>
    </form>
  );
}
