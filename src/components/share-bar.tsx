"use client";

import { useState } from "react";
import { GitHubUser } from "@/lib/types";

interface ShareBarProps {
  user: GitHubUser;
}

export function ShareBar({ user }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://gitshow.vercel.app/${user.login}`;
  const text = `Check out ${user.name ?? user.login}'s open source portfolio`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-display text-sm font-medium text-zinc-400">Share this portfolio</p>
      <div className="flex items-center gap-3">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card-hover rounded-xl px-5 py-2.5 text-sm text-zinc-300 transition-all hover:text-white"
          style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}
        >
          Share on 𝕏
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card-hover rounded-xl px-5 py-2.5 text-sm text-zinc-300 transition-all hover:text-white"
          style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}
        >
          Share on LinkedIn
        </a>
        <button
          onClick={handleCopy}
          className="card-hover rounded-xl px-5 py-2.5 text-sm text-zinc-300 transition-all hover:text-white"
          style={{ background: "var(--color-surface-raised)", border: "1px solid var(--color-border)" }}
        >
          {copied ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </span>
          ) : (
            "Copy Link"
          )}
        </button>
      </div>
    </div>
  );
}
