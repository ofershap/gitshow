import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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
    default: "GitShow — Your GitHub, beautifully shown",
    template: "%s — GitShow",
  },
  description:
    "Replace github.com with gitshow.dev in any profile URL to get a stunning developer portfolio. Open source, no signup required.",
  applicationName: "GitShow",
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
    title: "GitShow — Your GitHub, beautifully shown",
    description:
      "Replace github.com with gitshow.dev in any profile URL to get a stunning developer portfolio.",
    type: "website",
    url: "https://gitshow.dev",
    siteName: "GitShow",
    locale: "en_US",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "GitShow — Your GitHub, beautifully shown",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ofaborsh",
    creator: "@ofaborsh",
    title: "GitShow — Your GitHub, beautifully shown",
    description:
      "Replace github.com with gitshow.dev in any profile URL to get a stunning developer portfolio.",
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
        className={`${dmSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} relative min-h-screen font-sans antialiased`}
        style={{ backgroundColor: "var(--color-surface)", color: "#e2e8f0" }}
      >
        {children}
      </body>
    </html>
  );
}
