import { LanguageStats } from "@/lib/types";

interface TechStackProps {
  languages: LanguageStats[];
}

export function TechStack({ languages }: TechStackProps) {
  const top = languages.slice(0, 6);
  const totalPercentage = top.reduce((s, l) => s + l.percentage, 0);

  return (
    <div className="card-hover rounded-2xl overflow-hidden" style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}>
      <div
        className="h-[2px]"
        style={{
          background: top.length > 0
            ? `linear-gradient(90deg, ${top.map((l) => l.color).join(', ')})`
            : "var(--color-border)",
        }}
      />
      <div className="p-5">
      <h3 className="font-display font-semibold text-white mb-4">Tech Stack</h3>

      <div className="h-3.5 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.04)" }}>
        {top.map((lang) => (
          <div
            key={lang.name}
            className="h-full transition-all first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(lang.percentage / totalPercentage) * 100}%`,
              backgroundColor: lang.color,
              opacity: 0.75,
            }}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {top.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: lang.color, boxShadow: `0 0 8px ${lang.color}40` }}
            />
            <span className="text-gray-300 truncate">{lang.name}</span>
            <span className="ml-auto font-mono text-xs tabular-nums text-gray-500">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
