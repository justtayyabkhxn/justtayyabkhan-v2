import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Tayyab Khan | Creative Web Dev",
  description: "Full-stack developer based in New Delhi. Building scalable web apps with React, Next.js, and Node.js. Open to freelance.",
  metadataBase: new URL("https://justtayyabkhan.com"),
  openGraph: {
    title: "Tayyab Khan",
    description: "Full-stack developer based in New Delhi. Building scalable web apps with React, Next.js, and Node.js. Open to freelance.",
    url: "https://justtayyabkhan.com",
    siteName: "Tayyab Khan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tayyab Khan",
    description: "Full-stack developer based in New Delhi. Building scalable web apps with React, Next.js, and Node.js.",
    creator: "@justtayyabkhxn",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background`}
      >
        <ThemeProvider attribute={"class"} defaultTheme="dark">
          <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.035] noise-overlay" />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
