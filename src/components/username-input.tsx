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
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
          @
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-9 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-50"
        disabled={!username.trim()}
      >
        Generate
      </button>
    </form>
  );
}
