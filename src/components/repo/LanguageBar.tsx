import type { LanguageBreakdown } from "@/lib/repo-types";

interface LanguageBarProps {
  languages: LanguageBreakdown[];
  repoUrl: string;
}

const MAX_DISPLAY = 6;

export function LanguageBar({ languages, repoUrl }: LanguageBarProps) {
  if (languages.length === 0) return null;

  const top = languages.slice(0, MAX_DISPLAY);
  const otherPct = languages
    .slice(MAX_DISPLAY)
    .reduce((sum, l) => sum + l.percentage, 0);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-10">
      <div className="absolute -right-20 -top-20 h-[200px] w-[200px] rounded-full bg-teal-500/[0.04] blur-[60px]" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-white">
            Languages
          </h2>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-zinc-500 transition hover:text-teal-400"
          >
            View on GitHub →
          </a>
        </div>

        <div className="mb-4 flex h-2.5 w-full overflow-hidden rounded-full">
          {top.map((lang) => (
            <div
              key={lang.name}
              className="transition-all duration-500"
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
                minWidth: lang.percentage > 0 ? "2px" : 0,
              }}
              title={`${lang.name} ${lang.percentage}%`}
            />
          ))}
          {otherPct > 0 && (
            <div
              className="bg-zinc-600"
              style={{ width: `${otherPct}%`, minWidth: "2px" }}
              title={`Other ${otherPct.toFixed(1)}%`}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {top.map((lang) => (
            <div key={lang.name} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="font-mono text-xs text-zinc-300">
                {lang.name}
              </span>
              <span className="font-mono text-xs text-zinc-500">
                {lang.percentage}%
              </span>
            </div>
          ))}
          {otherPct > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-600" />
              <span className="font-mono text-xs text-zinc-300">Other</span>
              <span className="font-mono text-xs text-zinc-500">
                {otherPct.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
