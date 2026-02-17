import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur-sm">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="mt-4 text-lg text-gray-400">
          This GitHub user doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gray-200"
        >
          Try another username
        </Link>
      </div>
    </main>
  );
}
