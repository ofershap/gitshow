export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-surface)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full" style={{ border: "2px solid rgba(20,184,166,0.2)", borderTopColor: "#14b8a6" }} />
        <p className="font-display text-sm text-zinc-400">Loading profile...</p>
      </div>
    </main>
  );
}
