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
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-2xl border border-[--color-border] bg-[--color-surface-raised] px-6 py-4 font-mono text-base backdrop-blur-sm md:text-lg">
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity: isActive ? 0.15 : 0,
          background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2), rgba(245,158,11,0.1))",
        }}
      />
      <div className="relative flex items-center gap-1.5 text-gray-400">
        <span className="text-gray-600">https://</span>
        <span
          key={flipKey}
          className={`transition-all duration-500 ${
            phase === "swap"
              ? "animate-slot-flip text-violet-400"
              : phase === "gitshow"
                ? "text-violet-400 font-semibold"
                : "text-gray-200"
          }`}
        >
          {domain}
        </span>
        <span className="text-gray-600">/</span>
        <span className="text-emerald-400">{username}</span>
      </div>
    </div>
  );
}
