interface ActivityGraphProps {
  timeline: { month: string; count: number }[];
}

export function ActivityGraph({ timeline }: ActivityGraphProps) {
  if (timeline.length === 0) return null;

  const maxCount = Math.max(...timeline.map((t) => t.count));

  return (
    <div className="card-hover rounded-2xl border border-[--color-border] bg-[--color-surface-raised] p-5">
      <h3 className="font-display font-semibold text-white mb-4">Project Timeline</h3>
      <div className="flex items-end gap-1.5" style={{ height: "80px" }}>
        {timeline.map((t) => {
          const height = Math.max((t.count / maxCount) * 100, 8);
          const label = t.month.split("-")[1];
          const year = t.month.split("-")[0].slice(2);
          const intensity = t.count / maxCount;
          return (
            <div
              key={t.month}
              className="group relative flex flex-1 flex-col items-center"
            >
              <div className="absolute -top-7 hidden rounded-lg bg-[--color-surface-hover] px-2 py-1 text-[10px] font-medium text-white shadow-lg group-hover:block">
                {t.count} {t.count === 1 ? "project" : "projects"}
              </div>
              <div
                className="w-full rounded-t transition-all group-hover:brightness-125"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(to top, rgba(139,92,246,${0.3 + intensity * 0.4}), rgba(236,72,153,${0.2 + intensity * 0.3}))`,
                }}
              />
              <span className="mt-1 text-[9px] text-gray-600">
                {label}/{year}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
