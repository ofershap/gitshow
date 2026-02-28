import type { CommunityHealth as CommunityHealthData } from "@/lib/repo-types";

interface CommunityHealthProps {
  health: CommunityHealthData;
  repoUrl: string;
}

const FILE_LABELS: { key: keyof CommunityHealthData["files"]; label: string }[] = [
  { key: "readme", label: "README" },
  { key: "license", label: "License" },
  { key: "contributing", label: "Contributing" },
  { key: "code_of_conduct", label: "Code of Conduct" },
  { key: "issue_template", label: "Issue Template" },
  { key: "pull_request_template", label: "PR Template" },
];

export function CommunityHealth({ health, repoUrl }: CommunityHealthProps) {
  const pct = health.health_percentage;
  const presentCount = FILE_LABELS.filter((f) => health.files[f.key]).length;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent p-8 md:p-10">
      <div className="absolute -right-16 -bottom-16 h-[180px] w-[180px] rounded-full bg-emerald-500/[0.04] blur-[60px]" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-white">
              Community health
            </h2>
            <p className="mt-0.5 font-mono text-xs text-zinc-500">
              {presentCount} of {FILE_LABELS.length} standards met
            </p>
          </div>
          <a
            href={`${repoUrl}/community`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-zinc-500 transition hover:text-teal-400"
          >
            Community profile →
          </a>
        </div>

        <div className="mb-5 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke={pct >= 80 ? "#14b8a6" : pct >= 50 ? "#f59e0b" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray={`${(pct / 100) * 100.53} 100.53`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">
              {pct}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILE_LABELS.map(({ key, label }) => (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs ${
                  health.files[key]
                    ? "border border-teal-500/20 bg-teal-500/10 text-teal-300"
                    : "border border-white/[0.06] bg-white/[0.02] text-zinc-500"
                }`}
              >
                <span className="text-[10px]">{health.files[key] ? "✓" : "○"}</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
