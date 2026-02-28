interface CommitSparklineProps {
  weeklyCommits: number[];
  repoUrl: string;
}

export function CommitSparkline({ weeklyCommits, repoUrl }: CommitSparklineProps) {
  if (weeklyCommits.length === 0) return null;

  const max = Math.max(...weeklyCommits, 1);
  const barCount = weeklyCommits.length;
  const total = weeklyCommits.reduce((a, b) => a + b, 0);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-10">
      <div className="absolute -left-20 -bottom-20 h-[200px] w-[200px] rounded-full bg-sky-500/[0.04] blur-[60px]" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-white">
              Commit activity
            </h2>
            <p className="mt-0.5 font-mono text-xs text-zinc-500">
              Last {barCount} weeks · {total} commit{total === 1 ? "" : "s"}
            </p>
          </div>
          <a
            href={`${repoUrl}/graphs/commit-activity`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-zinc-500 transition hover:text-teal-400"
          >
            Full graph →
          </a>
        </div>

        <div className="flex items-end gap-[3px]" style={{ height: 48 }}>
          {weeklyCommits.map((count, i) => {
            const height = max > 0 ? Math.max((count / max) * 100, count > 0 ? 8 : 2) : 2;
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-colors duration-200"
                style={{
                  height: `${height}%`,
                  backgroundColor:
                    count === 0
                      ? "rgba(255,255,255,0.04)"
                      : i === barCount - 1
                        ? "rgba(20,184,166,0.6)"
                        : "rgba(20,184,166,0.3)",
                }}
                title={`Week ${i + 1}: ${count} commit${count === 1 ? "" : "s"}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
