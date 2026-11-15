import type { Metadata } from "next";
import { ScrollToTop } from "@/components/scroll-to-top";
import { WebMcpTools } from "@/components/webmcp-tools";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gitshow.dev"),
  title: {
    default: "GitShow - GitHub Portfolios & Repository Showrooms",
    template: "%s — GitShow",
  },
  description:
    "Turn GitHub profiles and repos into portfolios and project showrooms with npm stats, repo categories, and tech stacks. Free, open source, no signup.",
  applicationName: "GitShow",
  verification: {
    google: "zn8NNlKIe-7WU0kPAKfIDcZmwISpj499v9dFBXpCsDE",
    other: { "msvalidate.01": "AAD3E490305203BA80DF599EC9F9067F" },
  },
  keywords: [
    "GitHub portfolio", "developer portfolio", "GitHub profile", "npm downloads",
    "open source contributions", "GitHub stats", "developer tools", "README badge",
    "GitHub visualization", "tech stack", "gitshow", "repository showroom",
    "open source project page", "GitHub repo landing page",
  ],
  authors: [{ name: "Ofer Shapira", url: "https://github.com/ofershap" }],
  creator: "Ofer Shapira",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://gitshow.dev",
  },
  openGraph: {
    title: "GitShow — Developer Portfolio from Any GitHub Profile",
    description:
      "npm stats, repo categorization, OS contributions, tech stack, README badges. Replace github.com with gitshow.dev.",
    type: "website",
    url: "https://gitshow.dev",
    siteName: "GitShow",
    locale: "en_US",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "GitShow developer portfolio generator - npm stats, repo categories, OS contributions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ofaborsh",
    creator: "@ofaborsh",
    title: "GitShow — Developer Portfolio from Any GitHub Profile",
    description:
      "npm stats, repo categorization, OS contributions, tech stack, README badges. Free and open source.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <head>
        <link rel="preload" href="/fonts/13971731025ec697-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/558ca1a6aa3cb55e-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/7b0b24f36b1a6d0b-s.p.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body
        className="relative min-h-screen font-sans antialiased"
        style={{ backgroundColor: "var(--color-surface)", color: "#e2e8f0" }}
      >
        {children}
        <ScrollToTop />
        <WebMcpTools />
      </body>
    </html>
  );
}
