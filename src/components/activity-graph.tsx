interface ActivityGraphProps {
  timeline: { month: string; count: number }[];
}

export function ActivityGraph({ timeline }: ActivityGraphProps) {
  if (timeline.length === 0) return null;

  const maxCount = Math.max(...timeline.map((t) => t.count));

  return (
    <div className="card-hover rounded-2xl p-5" style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}>
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
              <div
                className="absolute -top-7 hidden rounded-lg px-2 py-1 text-[10px] font-medium text-white shadow-lg group-hover:block"
                style={{ background: "var(--color-surface-hover)" }}
              >
                {t.count} {t.count === 1 ? "project" : "projects"}
              </div>
              <div
                className="w-full rounded-t transition-all group-hover:brightness-130"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(to top, rgba(20,184,166,${0.3 + intensity * 0.5}), rgba(245,158,11,${0.1 + intensity * 0.25}))`,
                  boxShadow: intensity > 0.5 ? `0 0 12px rgba(20,184,166,${intensity * 0.15})` : "none",
                }}
              />
              <span className="mt-1 text-[9px] text-zinc-600">
                {label}/{year}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
