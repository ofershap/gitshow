import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="relative overflow-hidden rounded-3xl p-12" style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}>
        <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-teal-500/10 blur-[60px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-amber-500/8 blur-[60px]" />
        <div className="relative">
          <div className="text-6xl mb-4">👻</div>
          <h1 className="font-display text-5xl font-bold text-white text-glow">404</h1>
          <p className="mt-4 text-lg text-zinc-400">
            This developer is hiding... or doesn&apos;t exist yet.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl px-7 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #14b8a6, #0d9488)", boxShadow: "0 4px 20px rgba(20,184,166,0.25)" }}
          >
            Try another username
          </Link>
        </div>
      </div>
    </main>
  );
}
