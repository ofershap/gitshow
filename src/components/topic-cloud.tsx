interface TopicCloudProps {
  topics: { name: string; count: number }[];
}

const TOPIC_COLORS = [
  "from-blue-500/20 to-blue-500/5 text-blue-300 border-blue-500/20",
  "from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/20",
  "from-green-500/20 to-green-500/5 text-green-300 border-green-500/20",
  "from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/20",
  "from-pink-500/20 to-pink-500/5 text-pink-300 border-pink-500/20",
  "from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-500/20",
  "from-red-500/20 to-red-500/5 text-red-300 border-red-500/20",
  "from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-indigo-500/20",
];

export function TopicCloud({ topics }: TopicCloudProps) {
  if (topics.length === 0) return null;

  const maxCount = Math.max(...topics.map((t) => t.count));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="font-semibold text-white mb-3">Focus Areas</h3>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, i) => {
          const scale = 0.75 + (topic.count / maxCount) * 0.25;
          const colorClass = TOPIC_COLORS[i % TOPIC_COLORS.length];
          return (
            <span
              key={topic.name}
              className={`rounded-lg border bg-gradient-to-r px-2.5 py-1 text-xs font-medium transition-transform hover:scale-105 ${colorClass}`}
              style={{ fontSize: `${scale * 0.75}rem` }}
            >
              {topic.name}
              <span className="ml-1 opacity-50">{topic.count}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
