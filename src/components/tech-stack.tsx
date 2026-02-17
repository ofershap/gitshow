import { LanguageStats } from "@/lib/types";

interface TechStackProps {
  languages: LanguageStats[];
}

export function TechStack({ languages }: TechStackProps) {
  const top = languages.slice(0, 6);
  const totalPercentage = top.reduce((s, l) => s + l.percentage, 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="font-semibold text-white mb-4">Tech Stack</h3>

      <div className="h-3 rounded-full bg-white/5 overflow-hidden flex">
        {top.map((lang) => (
          <div
            key={lang.name}
            className="h-full transition-all first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${(lang.percentage / totalPercentage) * 100}%`,
              backgroundColor: lang.color,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {top.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-gray-300 truncate">{lang.name}</span>
            <span className="ml-auto text-xs tabular-nums text-gray-500">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
