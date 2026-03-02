import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/cozy/AuthInitializer";
import LayoutShell from "@/components/cozy/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CozyLetters",
  description: "Send warm letters to random souls around the world",
  applicationName: "CozyLetters",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CozyLetters",
  },
};

export const viewport: Viewport = {
  themeColor: "#C4756B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AuthInitializer />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
