import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { SWRegister } from "@/components/sw-register";
import { InstallBanner } from "@/components/install-banner";
import { LanguageProvider } from "@/lib/language-context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PashuMarket",
  description: "A rural cattle marketplace with video-first listings.",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PashuMarket",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <LanguageProvider>
          <head>
            <meta name="theme-color" content="#276224" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="PashuMarket" />
          </head>
          <body>
            {children}
            <SWRegister />
            <InstallBanner />
          </body>
        </LanguageProvider>
      </html>
    </ClerkProvider>
  );
}
