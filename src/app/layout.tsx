import type { Metadata, Viewport } from "next";
import { Doto, Geist, Martian_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const doto = Doto({ subsets: ["latin"], axes: ["ROND"], variable: "--font-doto" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian" });

const title = "Ramon Adedotun (@phantom)";
const description =
  "Ramon Adedotun, a.k.a. Phantom. Full-stack developer who builds web apps, tests them like an attacker, and reads the data afterward. Based in Nigeria, working remotely.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Ramon Adedotun",
    title,
    description: "I build it, break it, and measure it. Full-stack web, security, and data work.",
  },
  twitter: {
    card: "summary",
    title,
    description: "I build it, break it, and measure it. Full-stack web, security, and data work.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${doto.variable} ${geist.variable} ${martian.variable}`}>
      <body>{children}</body>
    </html>
  );
}
