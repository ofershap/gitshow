import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GitShow",
    short_name: "GitShow",
    description:
      "Replace github.com with gitshow.dev in any profile URL to get a stunning developer portfolio.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0e14",
    theme_color: "#14b8a6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
    ],
  };
}
