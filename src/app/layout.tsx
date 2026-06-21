import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { SWRegister } from "@/components/sw-register";
import { InstallBanner } from "@/components/install-banner";
import { LanguageProvider } from "@/lib/language-context";
import { PageTransition } from "@/components/page-transition";

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
      <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
        <LanguageProvider>
          <head>
            <meta name="theme-color" content="#276224" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="PashuMarket" />
          </head>
          <body>
            <PageTransition>{children}</PageTransition>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: "1rem",
                  fontSize: "0.875rem",
                  padding: "12px 20px",
                },
              }}
            />
            <SWRegister />
            <InstallBanner />
          </body>
        </LanguageProvider>
      </html>
    </ClerkProvider>
  );
}
