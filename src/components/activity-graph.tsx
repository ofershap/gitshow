interface ActivityGraphProps {
  timeline: { month: string; count: number }[];
}

export function ActivityGraph({ timeline }: ActivityGraphProps) {
  if (timeline.length === 0) return null;

  const maxCount = Math.max(...timeline.map((t) => t.count));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="font-semibold text-white mb-4">Project Timeline</h3>
      <div className="flex items-end gap-1.5" style={{ height: "80px" }}>
        {timeline.map((t) => {
          const height = Math.max((t.count / maxCount) * 100, 8);
          const label = t.month.split("-")[1];
          const year = t.month.split("-")[0].slice(2);
          return (
            <div
              key={t.month}
              className="group relative flex flex-1 flex-col items-center"
            >
              <div className="absolute -top-6 hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                {t.count} {t.count === 1 ? "project" : "projects"}
              </div>
              <div
                className="w-full rounded-t bg-gradient-to-t from-blue-500/40 to-blue-400/60 transition-all group-hover:from-blue-500/60 group-hover:to-blue-400/80"
                style={{ height: `${height}%` }}
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
