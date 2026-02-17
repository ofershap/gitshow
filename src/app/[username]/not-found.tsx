import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="noise relative overflow-hidden rounded-3xl border border-[--color-border] bg-[--color-surface-raised] p-12">
        <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-violet-500/10 blur-[60px]" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-pink-500/10 blur-[60px]" />
        <div className="relative">
          <div className="text-6xl mb-4">👻</div>
          <h1 className="font-display text-5xl font-bold text-white">404</h1>
          <p className="mt-4 text-lg text-gray-400">
            This developer is hiding... or doesn&apos;t exist yet.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40 hover:brightness-110"
          >
            Try another username
          </Link>
        </div>
      </div>
    </main>
  );
}
