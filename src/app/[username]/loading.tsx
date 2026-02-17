export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-400" />
        <p className="font-display text-sm text-gray-400">Loading profile...</p>
      </div>
    </main>
  );
}
