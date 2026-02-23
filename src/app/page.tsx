import { UrlSwap } from "@/components/url-swap";
import { UsernameInput } from "@/components/username-input";
import { Footer } from "@/components/footer";
import { JsonLd, websiteJsonLd, webApplicationJsonLd } from "@/components/json-ld";
import Link from "next/link";

const FEATURED = [
  { username: "torvalds", label: "Linus Torvalds", desc: "Creator of Linux & Git", emoji: "🐧" },
  { username: "sindresorhus", label: "Sindre Sorhus", desc: "1000+ npm packages", emoji: "🦄" },
  { username: "tj", label: "TJ Holowaychuk", desc: "Creator of Express.js", emoji: "⚡" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={webApplicationJsonLd()} />

      <section aria-label="Hero" className="relative flex flex-1 flex-col items-center justify-center px-4 py-28 md:py-36">
        {/* Background orbs — teal + warm amber */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/15 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-amber-500/8 blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 h-[350px] w-[500px] translate-x-1/4 rounded-full bg-sky-500/6 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2.5 rounded-full border border-teal-500/20 bg-teal-500/[0.08] px-5 py-2 text-sm font-medium text-teal-300 animate-border-glow">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            Open Source &middot; Free Forever
          </div>

          <h1 className="animate-fade-up stagger-1 mb-8 max-w-4xl text-center font-display text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl">
            <span className="text-white text-glow">Your GitHub,</span>
            <br />
            <span className="animate-gradient bg-gradient-to-r from-teal-400 via-emerald-300 via-50% to-amber-400 bg-clip-text text-transparent">
              way cooler.
            </span>
          </h1>

          <p className="animate-fade-up stagger-2 mb-12 max-w-lg text-center text-lg leading-relaxed text-zinc-400 md:text-xl">
            Swap{" "}
            <code className="rounded-lg bg-white/[0.06] px-2.5 py-1 font-mono text-[0.9em] text-zinc-300">
              github.com
            </code>{" "}
            for{" "}
            <code className="rounded-lg bg-teal-500/15 px-2.5 py-1 font-mono text-[0.9em] text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
              gitshow.dev
            </code>{" "}
            — that&apos;s it.
          </p>

          <div className="animate-fade-up stagger-3 mb-6 w-full max-w-xl">
            <UrlSwap />
          </div>

          <div className="animate-fade-up stagger-4 mb-4">
            <UsernameInput />
          </div>

          <p className="animate-fade-up stagger-4 mt-2 text-xs text-zinc-600">
            No signup required. Works with any public GitHub profile.
          </p>
        </div>

        <section aria-label="Featured profiles" className="relative z-10 mt-24 w-full max-w-2xl animate-fade-up stagger-5">
          <h2 className="mb-6 text-center font-display text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            See it in action
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FEATURED.map((profile) => (
              <Link
                key={profile.username}
                href={`/${profile.username}`}
                className="card-hover group glass rounded-2xl p-5 text-center"
              >
                <div className="mb-2 text-2xl">{profile.emoji}</div>
                <div className="font-display text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                  {profile.label}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-zinc-500">
                  @{profile.username}
                </div>
                <div className="mt-2 text-xs text-zinc-400">{profile.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        <section aria-label="Features" className="relative z-10 mt-28 w-full max-w-4xl animate-fade-up stagger-6">
          <h2 className="sr-only">Features</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <FeatureCard
              icon="⚡"
              title="Instant"
              description="No signup. No config. Just a username and a stunning portfolio in seconds."
              gradient="from-amber-500/10 via-amber-500/5 to-transparent"
              glow="hover:shadow-[0_0_60px_rgba(245,158,11,0.1)]"
            />
            <FeatureCard
              icon="🔗"
              title="Shareable"
              description="Beautiful social preview cards for Twitter & LinkedIn. Share your work proudly."
              gradient="from-teal-500/10 via-teal-500/5 to-transparent"
              glow="hover:shadow-[0_0_60px_rgba(20,184,166,0.1)]"
            />
            <FeatureCard
              icon="🌿"
              title="Open Source"
              description="Free forever. Self-host it, fork it, contribute. MIT licensed."
              gradient="from-emerald-500/10 via-emerald-500/5 to-transparent"
              glow="hover:shadow-[0_0_60px_rgba(16,185,129,0.1)]"
            />
          </div>
        </section>
      </section>

      <Footer />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  glow,
}: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  glow: string;
}) {
  return (
    <div
      className={`card-hover glass rounded-2xl p-7 text-center transition-shadow ${glow}`}
    >
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-2xl`}>
        {icon}
      </div>
      <h3 className="font-display text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}
