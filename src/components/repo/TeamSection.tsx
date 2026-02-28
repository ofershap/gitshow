import Image from "next/image";
import type { RepoContributor } from "@/lib/repo-types";
import { formatNumber } from "@/lib/utils";

const DEFAULT_SHOW = 8;

interface TeamSectionProps {
  contributors: RepoContributor[];
  contributorCount: number;
  repoUrl: string;
}

export function TeamSection({ contributors, contributorCount, repoUrl }: TeamSectionProps) {
  if (contributors.length === 0) return null;

  const show = contributors.slice(0, DEFAULT_SHOW);
  const total = contributorCount;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-teal-500/[0.06] blur-[80px]" />
      </div>

      <div className="relative z-10">
        <div className="mb-8 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            Meet the team
          </h2>
          <a
            href={`${repoUrl}/graphs/contributors`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm font-medium text-teal-400 transition hover:text-teal-300"
          >
            See all {total} on GitHub →
          </a>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-4">
          {show.map((c) => (
            <a
              key={c.login}
              href={c.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center"
            >
              <div className="relative mb-3">
                <Image
                  src={c.avatar_url}
                  alt={c.login}
                  width={72}
                  height={72}
                  className="rounded-2xl ring-2 ring-white/10 transition duration-300 group-hover:ring-teal-500/50 group-hover:scale-105"
                />
                {c.type === "Bot" && (
                  <span
                    className="absolute -bottom-1 -right-1 rounded bg-zinc-600 px-1.5 py-0.5 text-[9px] font-medium text-white"
                    title="Bot"
                  >
                    Bot
                  </span>
                )}
              </div>
              <span className="block font-medium text-white text-sm truncate w-full">
                {c.login}
              </span>
              <span className="text-xs text-zinc-500">
                {formatNumber(c.contributions)}{" "}
                {c.contributions === 1 ? "contribution" : "contributions"}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
