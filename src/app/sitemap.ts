import type { MetadataRoute } from "next";

const FEATURED_PROFILES = [
  "torvalds",
  "sindresorhus",
  "tj",
  "gaearon",
  "yyx990803",
  "addyosmani",
  "kentcdodds",
  "thedaviddias",
  "jessfraz",
  "mxstbr",
  "Rich-Harris",
  "antfu",
  "tannerlinsley",
  "ThePrimeagen",
  "denoland",
  "rauchg",
  "shadcn",
  "t3dotgg",
  "leveluptuts",
  "fireship-io",
];

const FEATURED_REPOS = [
  "vercel/next.js",
  "facebook/react",
  "denoland/deno",
  "tailwindlabs/tailwindcss",
  "vuejs/core",
  "sveltejs/svelte",
  "oven-sh/bun",
  "withastro/astro",
  "vitejs/vite",
  "drizzle-team/drizzle-orm",
  "trpc/trpc",
  "colinhacks/zod",
  "honojs/hono",
  "modelcontextprotocol/servers",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gitshow.dev";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const profilePages: MetadataRoute.Sitemap = FEATURED_PROFILES.map(
    (username) => ({
      url: `${base}/${username}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }),
  );

  const repoPages: MetadataRoute.Sitemap = FEATURED_REPOS.map(
    (slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }),
  );

  return [...staticPages, ...profilePages, ...repoPages];
}
