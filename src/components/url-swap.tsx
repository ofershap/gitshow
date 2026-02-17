"use client";

import { useEffect, useState } from "react";

const EXAMPLES = ["torvalds", "sindresorhus", "tj", "yyx990803"];

export function UrlSwap() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"github" | "swap" | "gitshow">("github");
  const [flipKey, setFlipKey] = useState(0);

  useEffect(() => {
    const cycle = () => {
      setPhase("github");
      const t1 = setTimeout(() => {
        setPhase("swap");
        setFlipKey((k) => k + 1);
      }, 1500);
      const t2 = setTimeout(() => setPhase("gitshow"), 2000);
      const t3 = setTimeout(() => {
        setIndex((i) => (i + 1) % EXAMPLES.length);
      }, 4500);
      return [t1, t2, t3];
    };

    const timers = cycle();
    const interval = setInterval(() => {
      const t = cycle();
      timers.push(...t);
    }, 5000);

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, []);

  const username = EXAMPLES[index];
  const domain = phase === "gitshow" ? "gitshow.me" : "github.com";
  const isActive = phase === "gitshow" || phase === "swap";

  return (
    <div
      className="relative mx-auto max-w-xl overflow-hidden rounded-2xl font-mono text-base md:text-lg animate-border-glow"
      style={{
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        padding: "18px 24px",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          opacity: isActive ? 1 : 0,
          background: "radial-gradient(ellipse at center, rgba(20,184,166,0.06) 0%, transparent 70%)",
          boxShadow: isActive ? "inset 0 0 40px rgba(20,184,166,0.04)" : "none",
        }}
      />
      <div className="relative flex items-center gap-1.5">
        <span className="text-zinc-600">https://</span>
        <span
          key={flipKey}
          className={`transition-all duration-500 ${
            phase === "swap"
              ? "animate-slot-flip text-teal-400"
              : phase === "gitshow"
                ? "text-teal-400 font-semibold"
                : "text-zinc-200"
          }`}
          style={phase === "gitshow" ? { textShadow: "0 0 20px rgba(20,184,166,0.4)" } : undefined}
        >
          {domain}
        </span>
        <span className="text-zinc-600">/</span>
        <span className="text-amber-400">{username}</span>
      </div>
    </div>
  );
}
