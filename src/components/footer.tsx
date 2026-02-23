export function Footer() {
  return (
    <footer className="mt-16 py-8 text-center" style={{ borderTop: "1px solid var(--color-border)" }}>
      <p className="text-sm text-zinc-500">
        Built with{" "}
        <a
          href="https://github.com/ofershap/gitshow"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-semibold text-teal-400/80 transition-colors hover:text-teal-300"
        >
          GitShow
        </a>
      </p>
      <p className="mt-2 text-xs text-zinc-600">
        Replace{" "}
        <code className="rounded px-1.5 py-0.5 font-mono text-zinc-500" style={{ background: "rgba(255,255,255,0.04)" }}>
          github.com
        </code>{" "}
        with{" "}
        <code className="rounded px-1.5 py-0.5 font-mono text-teal-400/60" style={{ background: "rgba(20,184,166,0.08)" }}>
          gitshow.dev
        </code>{" "}
        in any profile URL
      </p>
    </footer>
  );
}
