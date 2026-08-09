"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

function parseGitHubInput(raw: string): string | null {
  let trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("@")) {
    trimmed = trimmed.slice(1).trim();
    if (!trimmed) return null;
  }

  const urlMatch = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#]+(?:\/[^/?#]+)?)\/?$/i
  );
  if (urlMatch) {
    return `/${urlMatch[1]}`;
  }

  if (/^[^\s/]+\/[^\s/]+$/.test(trimmed)) {
    return `/${trimmed}`;
  }

  if (/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(trimmed)) {
    return `/${trimmed}`;
  }

  return null;
}

export function UsernameInput() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const path = parseGitHubInput(value);
    if (path) {
      router.push(path);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="username or owner/repo"
        className="w-full rounded-xl py-3.5 px-4 font-mono text-sm text-white placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_30px_rgba(20,184,166,0.12)]"
        style={{
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
        }}
        autoFocus
      />
      <button
        type="submit"
        className="rounded-xl px-7 py-3.5 font-display text-sm font-semibold text-white transition-all hover:brightness-110 hover:shadow-[0_0_40px_rgba(20,184,166,0.2)] disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, #14b8a6, #0d9488)",
          boxShadow: "0 4px 20px rgba(20,184,166,0.25)",
        }}
        disabled={!value.trim()}
      >
        Generate
      </button>
    </form>
  );
}
