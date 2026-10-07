import type { Metadata } from "next";
import { DM_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import { ScrollToTop } from "@/components/scroll-to-top";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
      <body
        className={`${dmSans.variable} ${outfit.variable} ${jetbrainsMono.variable} relative min-h-screen font-sans antialiased`}
        style={{ backgroundColor: "var(--color-surface)", color: "#e2e8f0" }}
      >
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
