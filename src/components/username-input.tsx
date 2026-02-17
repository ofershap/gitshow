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
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-teal-400/50">
          @
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full rounded-xl py-3.5 pl-9 pr-4 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_30px_rgba(20,184,166,0.12)]"
          style={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
          }}
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="rounded-xl px-7 py-3.5 font-display text-sm font-semibold text-white transition-all hover:brightness-110 hover:shadow-[0_0_40px_rgba(20,184,166,0.2)] disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, #14b8a6, #0d9488)",
          boxShadow: "0 4px 20px rgba(20,184,166,0.25)",
        }}
        disabled={!username.trim()}
      >
        Generate
      </button>
    </form>
  );
}
