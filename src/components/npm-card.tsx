import { NpmStats } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface NpmCardProps {
  stats: NpmStats;
}

export function NpmCard({ stats }: NpmCardProps) {
  const maxDownloads = Math.max(...stats.packages.map((p) => p.downloads));
  const topPackages = stats.packages.slice(0, 8);

  return (
    <div className="card-hover overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-surface-raised]">
      <div className="flex items-center justify-between border-b border-[--color-border] px-5 py-3">
        <h3 className="font-display font-semibold text-white flex items-center gap-2">
          <span className="text-red-400">npm</span> Packages
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
                <span className="font-mono text-gray-300 group-hover:text-red-300 transition-colors truncate mr-2">
                  {pkg.name}
                </span>
                <span className="shrink-0 tabular-nums text-gray-500">
                  {formatNumber(pkg.downloads)}
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500/70 to-rose-400/50 transition-all group-hover:from-red-500 group-hover:to-rose-400"
                  style={{ width: `${width}%` }}
                />
              </div>
            </a>
          );
        })}
      </div>

      {stats.packages.length > 8 && (
        <div className="border-t border-[--color-border] py-2.5 text-center text-[11px] text-gray-500">
          +{stats.packages.length - 8} more packages
        </div>
      )}
    </div>
  );
}
