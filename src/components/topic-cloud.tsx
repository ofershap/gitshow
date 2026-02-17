interface TopicCloudProps {
  topics: { name: string; count: number }[];
}

const TOPIC_STYLES = [
  { bg: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.2)", color: "#5eead4" },
  { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.2)", color: "#67e8f9" },
  { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)", color: "#fcd34d" },
  { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.2)", color: "#6ee7b7" },
  { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.2)", color: "#93c5fd" },
  { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.2)", color: "#fca5a5" },
  { bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.2)", color: "#fdba74" },
  { bg: "rgba(14,165,233,0.12)", border: "rgba(14,165,233,0.2)", color: "#7dd3fc" },
];

export function TopicCloud({ topics }: TopicCloudProps) {
  if (topics.length === 0) return null;

  const maxCount = Math.max(...topics.map((t) => t.count));

  return (
    <div className="card-hover rounded-2xl p-5" style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}>
      <h3 className="font-display font-semibold text-white mb-3">Focus Areas</h3>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, i) => {
          const scale = 0.8 + (topic.count / maxCount) * 0.2;
          const style = TOPIC_STYLES[i % TOPIC_STYLES.length];
          return (
            <span
              key={topic.name}
              className="rounded-lg px-3 py-1 text-xs font-medium transition-all hover:scale-110 hover:brightness-125 cursor-default"
              style={{
                fontSize: `${scale * 0.75}rem`,
                background: style.bg,
                border: `1px solid ${style.border}`,
                color: style.color,
              }}
            >
              {topic.name}
              <span className="ml-1.5 opacity-40">{topic.count}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
