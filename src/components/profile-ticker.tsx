"use client";

import { useState } from "react";
import Link from "next/link";

const ROW_1 = [
  "torvalds", "sindresorhus", "tj", "gaearon", "yyx990803",
  "addyosmani", "kentcdodds", "antfu", "Rich-Harris", "shadcn",
  "rauchg", "ThePrimeagen", "tannerlinsley", "jessfraz", "mxstbr",
  "t3dotgg", "leveluptuts", "fireship-io", "kelseyhightower", "denoland",
];

const ROW_2 = [
  "leerob", "wesbos", "cassidoo", "developit", "mattpocock",
  "BurntSushi", "mitchellh", "ljharb", "fatih", "tmcw",
  "pacocoursey", "tiangolo", "mholt", "benawad", "colinhacks",
  "pilcrowOnPaper", "sharkdp", "jaredpalmer", "Jarred-Sumner", "oven-sh",
];

const ROW_REPOS = [
  "vercel/next.js", "facebook/react", "denoland/deno", "tailwindlabs/tailwindcss",
  "vuejs/core", "sveltejs/svelte", "oven-sh/bun", "withastro/astro",
  "solidjs/solid", "remix-run/remix", "vitejs/vite", "drizzle-team/drizzle-orm",
  "trpc/trpc", "colinhacks/zod", "honojs/hono", "modelcontextprotocol/servers",
];

function TickerCard({ username }: { username: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <Link
      href={`/${username}`}
      className="block shrink-0 opacity-80 transition-opacity hover:opacity-100"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/card/${username}`}
        alt={`${username}'s profile`}
        width={460}
        height={56}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-14 w-auto rounded-xl border border-white/[0.06] transition-all hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]"
      />
    </Link>
  );
}

function RepoTickerCard({ slug }: { slug: string }) {
  return (
    <Link
      href={`/${slug}`}
      className="block shrink-0 opacity-80 transition-opacity hover:opacity-100"
    >
      <div className="flex h-14 items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#111113] px-5 transition-all hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.1)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 text-zinc-500">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-mono text-sm text-zinc-300 whitespace-nowrap">{slug}</span>
      </div>
    </Link>
  );
}

function TickerRow({ children, direction }: { children: React.ReactNode; direction: "left" | "right" }) {
  const animationClass = direction === "left" ? "animate-ticker-left" : "animate-ticker-right";

  return (
    <div className="ticker-row relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
      <div className={`flex gap-4 ${animationClass}`} style={{ width: "max-content" }}>
        {children}
      </div>
    </div>
  );
}

export function ProfileTicker() {
  const doubledRow1 = [...ROW_1, ...ROW_1];
  const doubledRow2 = [...ROW_2, ...ROW_2];
  const doubledRepos = [...ROW_REPOS, ...ROW_REPOS];

  return (
    <div className="space-y-4">
      <TickerRow direction="left">
        {doubledRow1.map((username, i) => (
          <TickerCard key={`${username}-${i}`} username={username} />
        ))}
      </TickerRow>
      <TickerRow direction="right">
        {doubledRow2.map((username, i) => (
          <TickerCard key={`${username}-${i}`} username={username} />
        ))}
      </TickerRow>
      <TickerRow direction="left">
        {doubledRepos.map((slug, i) => (
          <RepoTickerCard key={`${slug}-${i}`} slug={slug} />
        ))}
      </TickerRow>
    </div>
  );
}
