"use client";

import { useEffect, useState } from "react";

const EXAMPLES = ["torvalds", "sindresorhus", "tj", "yyx990803"];

export function UrlSwap() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"github" | "swap" | "gitshow">("github");

  useEffect(() => {
    const cycle = () => {
      setPhase("github");
      const t1 = setTimeout(() => setPhase("swap"), 1500);
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

  return (
    <div className="relative mx-auto max-w-lg overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-mono text-sm backdrop-blur-sm md:text-base">
      <div className="flex items-center gap-1.5 text-gray-400">
        <span className="text-gray-600">https://</span>
        <span
          className={`transition-all duration-500 ${
            phase === "swap"
              ? "scale-110 text-blue-400"
              : phase === "gitshow"
                ? "text-blue-400"
                : "text-white"
          }`}
        >
          {domain}
        </span>
        <span className="text-gray-600">/</span>
        <span className="text-green-400">{username}</span>
      </div>
    </div>
  );
}
