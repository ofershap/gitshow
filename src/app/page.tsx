import type { ReactNode } from "react";
import { UrlSwap } from "@/components/url-swap";
import { UsernameInput } from "@/components/username-input";
import { ProfileTicker } from "@/components/profile-ticker";
import { Footer } from "@/components/footer";
import { JsonLd, websiteJsonLd, webApplicationJsonLd, faqPageJsonLd } from "@/components/json-ld";

const svg = (children: ReactNode) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const FEATURES: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: svg(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>),
    title: "npm Download Stats",
    text: "Total downloads per month across all your packages, with a per-package breakdown and bar chart.",
  },
  {
    icon: svg(<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>),
    title: "Smart Repo Categories",
    text: "Repos auto-grouped by what they are: MCP Servers, CLI Tools, React & UI, DevOps, AI & ML, i18n, and more.",
  },
  {
    icon: svg(<><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>),
    title: "Open Source Contributions",
    text: "Commits and PRs to other people's repos over the last 12 months. Shows what you give back, not just what you own.",
  },
  {
    icon: svg(<><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>),
    title: "Tech Stack Visualization",
    text: "Language breakdown across all your repos as a visual bar. See your stack at a glance.",
  },
  {
    icon: svg(<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>),
    title: "Focus Areas",
    text: "Aggregated topic cloud from all your repos. Shows what you specialize in.",
  },
  {
    icon: svg(<><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>),
    title: "README Badge Card",
    text: "Embeddable PNG card with your avatar and stats. One line of markdown in any README.",
  },
  {
    icon: svg(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>),
    title: "Social Preview Cards",
    text: "Dynamic 1200x630 OG images generated per profile. Looks good when shared on X and LinkedIn.",
  },
  {
    icon: svg(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>),
    title: "Repo Showroom",
    text: "Every repo gets a full page: team, languages, commit activity, community health, recent PRs, and quick actions.",
  },
  {
    icon: svg(<><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>),
    title: "LLM & GEO Ready",
    text: "Schema.org structured data, llms.txt, AI crawler access. Built to surface in ChatGPT, Perplexity, and Google AI.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={webApplicationJsonLd()} />
      <JsonLd data={faqPageJsonLd()} />

      <section aria-label="Hero" className="relative flex flex-col items-center justify-center px-4 py-28 md:py-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/15 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-amber-500/8 blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 h-[350px] w-[500px] translate-x-1/4 rounded-full bg-sky-500/6 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
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
            No signup required. Works with any public GitHub profile, organization, or repo.
          </p>
        </div>
      </section>

      <section aria-label="Featured profiles" className="relative px-4 py-16">
        <h2 className="mb-2 text-center font-display text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 animate-fade-up stagger-5">
          Works for every user and repo
        </h2>
        <p className="mb-8 text-center text-sm text-zinc-600 animate-fade-up stagger-5">
          Developers, organizations, and open source projects
        </p>
        <div className="animate-fade-up stagger-6">
          <ProfileTicker />
        </div>
      </section>

      <section aria-label="What GitShow shows that GitHub doesn't" className="relative px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center font-display text-3xl font-bold text-white md:text-4xl animate-fade-up">
            What GitHub doesn&apos;t show
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-base text-zinc-400 animate-fade-up stagger-1">
            GitHub gives you a flat list of repos. GitShow tells the story of what you actually build, what you contribute to, and how your work gets used.
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card-hover glass rounded-2xl p-6 transition-shadow hover:shadow-[0_0_40px_rgba(20,184,166,0.06)] animate-fade-up stagger-${Math.min(i + 1, 8)}`}
              >
                <div className="mb-3 text-teal-400/80">{f.icon}</div>
                <h3 className="font-display text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="How to use GitShow" className="relative px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-white md:text-4xl">
            Three ways to use it
          </h2>

          <div className="space-y-6">
            <div className="animate-fade-up stagger-1">
              <HowToStep
                step="1"
                title="Visit any profile or repo"
                code="gitshow.dev/owner/repo"
                text="Replace github.com with gitshow.dev in any GitHub profile or repository URL. Works instantly."
              />
            </div>
            <div className="animate-fade-up stagger-2">
              <HowToStep
                step="2"
                title="Embed in your README"
                code={'[![Made by you](https://gitshow.dev/api/card/YOUR_USERNAME)](https://gitshow.dev/YOUR_USERNAME)'}
                text="One line of markdown. The card updates automatically with your latest stats."
              />
            </div>
            <div className="animate-fade-up stagger-3">
              <HowToStep
                step="3"
                title="Share on social"
                code="https://gitshow.dev/your-username"
                text="Every profile has a dynamic OG image. Paste the link on X or LinkedIn and it looks great."
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="See it in action" className="relative px-4 pt-16 pb-4">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <p className="mb-4 text-center font-display text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Built with GitShow
          </p>
          <a
            href="/ofershap"
            className="block transition-transform hover:scale-[1.02]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/api/card/ofershap"
              alt="ofershap's GitShow card"
              width={460}
              height={56}
              loading="lazy"
              className="h-14 w-auto rounded-xl border border-white/[0.06] shadow-[0_0_30px_rgba(20,184,166,0.08)]"
            />
          </a>
        </div>
      </section>

      <section aria-label="Open source and free" className="relative px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
            Open source, free, no strings
          </h2>
          <p className="mb-6 text-base leading-relaxed text-zinc-400">
            MIT licensed. Self-host it, fork it, contribute. Built with Next.js, React, TypeScript, and Tailwind CSS. Deployed on Vercel.
          </p>
          <a
            href="https://github.com/ofershap/gitshow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-teal-500/30 hover:bg-white/[0.06] hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function HowToStep({ step, title, code, text }: { step: string; title: string; code: string; text: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 font-display text-sm font-bold text-teal-400">
          {step}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{text}</p>
          <code className="mt-3 block overflow-x-auto rounded-lg bg-white/[0.04] px-4 py-2.5 font-mono text-xs text-teal-300">
            {code}
          </code>
        </div>
      </div>
    </div>
  );
}
