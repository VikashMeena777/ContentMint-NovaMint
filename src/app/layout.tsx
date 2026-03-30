import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContentMint — Generate Viral Content Instantly",
  description:
    "Generate irresistible hooks, captions, CTAs, titles, and ideas in seconds. Built for creators who can't afford to be forgettable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
