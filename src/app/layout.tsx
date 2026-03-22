import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "ContentMint — AI Content That Converts",
    template: "%s | ContentMint",
  },
  description:
    "Generate viral hooks, captions, CTAs, titles & content ideas in seconds. AI-powered content generation for creators, marketers & founders.",
  keywords: [
    "AI content generator",
    "viral hooks",
    "caption generator",
    "CTA generator",
    "content ideas",
    "social media AI",
    "ContentMint",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "ContentMint — AI Content That Converts",
    description:
      "Generate viral hooks, captions, CTAs, titles & content ideas in seconds.",
    type: "website",
    siteName: "ContentMint",
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentMint — AI Content That Converts",
    description:
      "Generate viral hooks, captions, CTAs, titles & content ideas in seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="noise-overlay" style={{ fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );
}
