export function Footer() {
  return (
    <footer className="mt-16 py-10 text-center" style={{ borderTop: "1px solid var(--color-border)" }}>
      <div className="mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/ofershap/gitshow"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-teal-400"
            aria-label="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://x.com/ofaborsh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors hover:text-teal-400"
            aria-label="X (Twitter)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
        <p className="text-sm text-zinc-500">
          Built by{" "}
          <a
            href="https://gitshow.dev/ofershap"
            className="font-display font-semibold text-teal-400/80 transition-colors hover:text-teal-300"
          >
            @ofershap
          </a>
        </p>
        <p className="text-xs text-zinc-600">
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
      </div>
    </footer>
  );
}
