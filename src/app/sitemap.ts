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

  return [...staticPages, ...profilePages];
}
