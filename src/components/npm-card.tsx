import { NpmStats } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface NpmCardProps {
  stats: NpmStats;
}

export function NpmCard({ stats }: NpmCardProps) {
  const maxDownloads = Math.max(...stats.packages.map((p) => p.downloads));
  const topPackages = stats.packages.slice(0, 8);

  return (
    <div className="card-hover overflow-hidden rounded-2xl" style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <h3 className="font-display font-semibold text-white flex items-center gap-2">
          <span className="text-red-400 font-bold">npm</span> Packages
        </h3>
        <div className="text-right">
          <div className="font-display text-lg font-bold text-white">
            {formatNumber(stats.totalDownloads)}
          </div>
          <div className="text-[10px] text-gray-500">downloads/month</div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {topPackages.map((pkg) => {
          const width = Math.max((pkg.downloads / maxDownloads) * 100, 4);
          return (
            <a
              key={pkg.name}
              href={`https://www.npmjs.com/package/${pkg.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-gray-300 group-hover:text-emerald-300 transition-colors truncate mr-2">
                  {pkg.name}
                </span>
                <span className="shrink-0 tabular-nums text-gray-500">
                  {formatNumber(pkg.downloads)}
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div
                  className="h-full rounded-full transition-all group-hover:brightness-125"
                  style={{
                    width: `${width}%`,
                    background: "linear-gradient(90deg, rgba(16,185,129,0.7), rgba(52,211,153,0.5))",
                  }}
                />
              </div>
            </a>
          );
        })}
      </div>

      {stats.packages.length > 8 && (
        <div
          className="py-2.5 text-center text-[11px] text-gray-500"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          +{stats.packages.length - 8} more packages
        </div>
      )}
    </div>
  );
}
