import { LanguageStats } from "@/lib/types";

interface LanguageChartProps {
  languages: LanguageStats[];
}

export function LanguageChart({ languages }: LanguageChartProps) {
  const top = languages.slice(0, 8);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <h2 className="mb-4 text-sm font-semibold text-white">Languages</h2>

      <div className="mb-4 flex h-3 overflow-hidden rounded-full">
        {top.map((lang) => (
          <div
            key={lang.name}
            className="transition-all duration-500"
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
              minWidth: lang.percentage > 0 ? "4px" : "0",
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {top.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="truncate text-gray-300">{lang.name}</span>
            <span className="ml-auto text-gray-500">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
