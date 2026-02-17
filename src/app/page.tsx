import { UrlSwap } from "@/components/url-swap";
import { UsernameInput } from "@/components/username-input";
import { Footer } from "@/components/footer";
import Link from "next/link";

const FEATURED = [
  { username: "torvalds", label: "Linus Torvalds", desc: "Creator of Linux & Git", color: "from-amber-500/20 to-amber-500/5 border-amber-500/20" },
  { username: "sindresorhus", label: "Sindre Sorhus", desc: "1000+ npm packages", color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20" },
  { username: "tj", label: "TJ Holowaychuk", desc: "Creator of Express.js", color: "from-green-500/20 to-green-500/5 border-green-500/20" },
];

const FEATURES = [
  {
    title: "Instant",
    description: "No signup. No config. Just a username and a stunning portfolio in seconds.",
    icon: "⚡",
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/20 hover:shadow-amber-500/10",
  },
  {
    title: "Shareable",
    description: "Stunning social preview cards for Twitter & LinkedIn. Share your work proudly.",
    icon: "🔗",
    color: "from-violet-500/20 to-violet-500/5 border-violet-500/20 hover:shadow-violet-500/10",
  },
  {
    title: "Open Source",
    description: "Free forever. Self-host it, fork it, contribute. MIT licensed.",
    icon: "💜",
    color: "from-pink-500/20 to-pink-500/5 border-pink-500/20 hover:shadow-pink-500/10",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
        <div className="animate-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          Open Source &middot; Free Forever
        </div>

        <h1 className="animate-fade-up stagger-1 mb-6 text-center font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
          Your GitHub,{" "}
          <span className="animate-gradient bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            way cooler
          </span>
        </h1>

        <p className="animate-fade-up stagger-2 mb-10 max-w-xl text-center text-lg leading-relaxed text-gray-400 md:text-xl">
          Replace{" "}
          <code className="rounded-md bg-white/[0.06] px-2 py-1 font-mono text-sm text-gray-300">
            github.com
          </code>{" "}
          with{" "}
          <code className="rounded-md bg-violet-500/15 px-2 py-1 font-mono text-sm text-violet-300">
            gitshow.me
          </code>{" "}
          in any profile URL.
        </p>

        <div className="animate-fade-up stagger-3 mb-8 w-full max-w-xl">
          <UrlSwap />
        </div>

        <div className="animate-fade-up stagger-4">
          <UsernameInput />
        </div>

        <div className="mt-20 w-full max-w-3xl animate-fade-up stagger-5">
          <p className="mb-5 text-center font-display text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Try these profiles
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FEATURED.map((profile) => (
              <Link
                key={profile.username}
                href={`/${profile.username}`}
                className={`card-hover group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-center backdrop-blur-sm ${profile.color}`}
              >
                <div className="font-display text-base font-semibold text-white group-hover:text-violet-300 transition-colors">
                  {profile.label}
                </div>
                <div className="mt-1 font-mono text-xs text-gray-500">
                  @{profile.username}
                </div>
                <div className="mt-2 text-xs text-gray-400">{profile.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-20 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3 animate-fade-up stagger-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`card-hover relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 text-center backdrop-blur-sm ${feature.color} hover:shadow-lg`}
            >
              <div className="mb-3 text-3xl">{feature.icon}</div>
              <h3 className="font-display text-base font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
