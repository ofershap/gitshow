"use client";

import { GitHubUser } from "@/lib/types";

interface ShareBarProps {
  user: GitHubUser;
}

export function ShareBar({ user }: ShareBarProps) {
  const url = `https://gitshow.vercel.app/${user.login}`;
  const text = `Check out ${user.name ?? user.login}'s open source portfolio`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
      >
        Share on 𝕏
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
      >
        Share on LinkedIn
      </a>
      <button
        onClick={handleCopy}
        className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
      >
        Copy Link
      </button>
    </div>
  );
}
