export function Footer() {
  return (
    <footer className="mt-12 border-t border-[--color-border] py-8 text-center">
      <p className="text-sm text-gray-500">
        Built with{" "}
        <a
          href="https://github.com/ofershap/gitshow"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-semibold text-violet-400/80 transition-colors hover:text-violet-300"
        >
          GitShow
        </a>
      </p>
      <p className="mt-2 text-xs text-gray-600">
        Replace{" "}
        <code className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-gray-500">
          github.com
        </code>{" "}
        with{" "}
        <code className="rounded bg-violet-500/10 px-1.5 py-0.5 font-mono text-violet-400/70">
          gitshow.me
        </code>{" "}
        in any profile URL
      </p>
    </footer>
  );
}
