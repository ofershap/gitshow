import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitShow — Your GitHub, beautifully shown",
  description:
    "Replace github.com with gitshow.dev in any profile URL to get a stunning developer portfolio. Open source, no signup required.",
  openGraph: {
    title: "GitShow — Your GitHub, beautifully shown",
    description:
      "Replace github.com with gitshow.dev in any profile URL to get a stunning developer portfolio.",
    type: "website",
    url: "https://gitshow.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitShow — Your GitHub, beautifully shown",
    description:
      "Replace github.com with gitshow.dev in any profile URL to get a stunning developer portfolio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0a0a0a] font-sans text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
