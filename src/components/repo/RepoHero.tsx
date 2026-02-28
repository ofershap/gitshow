import Image from "next/image";
import type { RepoShowroomData } from "@/lib/repo-types";

interface RepoHeroProps {
  data: RepoShowroomData;
}

export function RepoHero({ data }: RepoHeroProps) {
  const { repo } = data;
  const ghUrl = repo.html_url;
  const tagline = repo.description || `${repo.owner.login}'s project`;
  const hasHomepage = !!repo.homepage;

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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={ghUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/[0.2] hover:bg-white/[0.1]"
          >
            <GitHubIcon />
            GitHub
          </a>
          {hasHomepage && (
            <a
              href={repo.homepage!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-teal-500/40 bg-teal-500/15 px-6 py-3 text-sm font-semibold text-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.15)] transition hover:border-teal-500/60 hover:bg-teal-500/25 hover:text-teal-300 hover:shadow-[0_0_40px_rgba(20,184,166,0.2)]"
            >
              <GlobeIcon />
              Visit Website
            </a>
          )}
        </div>

        {repo.language && (
          <p className="mt-8 font-mono text-sm text-zinc-500">
            {repo.language}
          </p>
        )}
      </div>
    </header>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
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
