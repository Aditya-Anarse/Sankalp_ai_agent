import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05060A",
};

export const metadata: Metadata = {
  title: "SANKALP | Autonomous AI Marketing Employee",
  description:
    "SANKALP is an autonomous AI marketing employee for businesses. It researches trends, crafts strategies, creates high-retention content, quality checks, publishes across channels, and continuously learns.",
  keywords: [
    "AI marketing employee",
    "autonomous marketing agent",
    "SANKALP AI",
    "social media automation",
    "generative AI marketing",
  ],
  authors: [{ name: "SANKALP AI Systems" }],
  icons: {
    icon: "/favicon.ico",
  },
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#05060A] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-white min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
