import Link from "next/link";

export default function RepoNotFound() {
  return (
    <article className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold text-white">
        Repository not found
      </h1>
      <p className="mt-2 text-zinc-400">
        The repo may be private, renamed, or the URL might be wrong.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl border border-teal-500/30 bg-teal-500/10 px-5 py-2.5 text-sm font-medium text-teal-400 transition hover:bg-teal-500/20"
      >
        Back to GitShow
      </Link>
    </article>
  );
}
