export default function RepoLoading() {
  return (
    <article className="mx-auto min-h-screen max-w-4xl px-4 py-8 md:px-6">
      <div className="h-32 animate-pulse rounded-3xl bg-white/[0.04]" />
      <div className="mt-6 h-6 w-64 animate-pulse rounded-lg bg-white/[0.04]" />
      <div className="mt-8 h-48 animate-pulse rounded-2xl bg-white/[0.04]" />
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl bg-white/[0.04]"
          />
        ))}
      </div>
      <div className="mt-12 h-6 w-48 animate-pulse rounded-lg bg-white/[0.04]" />
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white/[0.04]"
          />
        ))}
      </div>
    </article>
  );
}
