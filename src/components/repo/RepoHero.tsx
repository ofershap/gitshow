import Image from "next/image";
import type { RepoShowroomData } from "@/lib/repo-types";
import { CloneButton } from "./CloneButton";

interface RepoHeroProps {
  data: RepoShowroomData;
}

export function RepoHero({ data }: RepoHeroProps) {
  const { repo } = data;
  const ghUrl = repo.html_url;
  const tagline = repo.description || `${repo.owner.login}'s project`;
  const hasHomepage = !!repo.homepage;
  const isJsTs = ["TypeScript", "JavaScript"].includes(repo.language ?? "");

  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0c0c0e] to-[#0a0a0c]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-teal-500/[0.12] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[400px] translate-y-1/4 rounded-full bg-amber-500/[0.06] blur-[80px]" />
        <div className="absolute left-0 top-1/2 h-[200px] w-[300px] -translate-y-1/2 rounded-full bg-sky-500/[0.05] blur-[60px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center md:py-20">
        <a
          href={ghUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 rounded-2xl ring-2 ring-white/10 transition hover:ring-teal-500/40"
        >
          <Image
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            width={80}
            height={80}
            className="rounded-2xl"
          />
        </a>

        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl text-glow">
          {repo.name}
        </h1>

        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
          {tagline}
        </p>

        <a
          href={`https://gitshow.dev/${repo.owner.login}`}
          className="mt-2 font-mono text-sm text-zinc-500 transition hover:text-teal-400"
        >
          by {repo.owner.login}
        </a>

        {repo.topics.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            {repo.topics.slice(0, 8).map((topic) => (
              <a
                key={topic}
                href={`https://github.com/topics/${topic}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-zinc-500 transition hover:border-teal-500/30 hover:text-teal-400"
              >
                {topic}
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <a
            href={ghUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2 font-mono text-xs text-amber-300/90 transition hover:border-amber-500/40 hover:bg-amber-500/10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            Star on GitHub
          </a>
          <a
            href={`${ghUrl}/fork`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 font-mono text-xs text-zinc-400 transition hover:border-white/[0.15] hover:text-zinc-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>
            Fork
          </a>
          <CloneButton repoUrl={ghUrl} />
          {hasHomepage && (
            <a
              href={repo.homepage!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-4 py-2 font-mono text-xs text-teal-300/90 transition hover:border-teal-500/40 hover:bg-teal-500/10"
            >
              <GlobeIcon />
              Website
            </a>
          )}
          {isJsTs && (
            <a
              href={`https://www.npmjs.com/package/${repo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 font-mono text-xs text-red-300/90 transition hover:border-red-500/40 hover:bg-red-500/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0h-2.666V8.667h2.666v5.331zm12.001 0h-2.666v-4h-1.333v4h-1.335v-4h-1.333v4h-2.666V8.667h9.333v5.331z"/></svg>
              npm
            </a>
          )}
        </div>

        {repo.language && (
          <p className="mt-6 font-mono text-sm text-zinc-500">
            {repo.language}
          </p>
        )}
      </div>
    </header>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
