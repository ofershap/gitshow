import { UrlSwap } from "@/components/url-swap";
import { UsernameInput } from "@/components/username-input";
import { Footer } from "@/components/footer";
import Link from "next/link";

const FEATURED = [
  { username: "torvalds", label: "Linus Torvalds", desc: "Creator of Linux & Git" },
  { username: "sindresorhus", label: "Sindre Sorhus", desc: "1000+ npm packages" },
  { username: "tj", label: "TJ Holowaychuk", desc: "Creator of Express.js" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
          Open Source
        </div>

        <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-white md:text-6xl">
          Your GitHub,{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            beautifully shown
          </span>
        </h1>

        <p className="mb-8 max-w-lg text-center text-base text-gray-400 md:text-lg">
          Replace{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-gray-300">
            github.com
          </code>{" "}
          with{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-blue-400">
            gitshow.dev
          </code>{" "}
          in any profile URL to get a stunning developer portfolio.
        </p>

        <div className="mb-8 w-full max-w-lg">
          <UrlSwap />
        </div>

        <UsernameInput />

        <div className="mt-16 w-full max-w-2xl">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
            Try these profiles
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {FEATURED.map((profile) => (
              <Link
                key={profile.username}
                href={`/${profile.username}`}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="text-sm font-medium text-white group-hover:text-blue-400">
                  {profile.label}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  @{profile.username}
                </div>
                <div className="mt-1 text-xs text-gray-600">{profile.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          <Feature
            title="Instant"
            description="No signup. No config. Just enter a username and get a beautiful portfolio in seconds."
          />
          <Feature
            title="Shareable"
            description="Every portfolio has a unique URL with a stunning social preview card for Twitter & LinkedIn."
          />
          <Feature
            title="Open Source"
            description="Free forever. Self-host it, fork it, contribute to it. MIT licensed."
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-xs text-gray-400">{description}</p>
    </div>
  );
}
