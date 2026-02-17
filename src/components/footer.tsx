export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 py-6 text-center text-xs text-gray-500">
      <p>
        Built with{" "}
        <a
          href="https://github.com/ofershap/gitshow"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white"
        >
          GitShow
        </a>{" "}
        — Replace{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-gray-400">
          github.com
        </code>{" "}
        with{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-blue-400">
          gitshow.me
        </code>{" "}
        in any profile URL
      </p>
    </footer>
  );
}
