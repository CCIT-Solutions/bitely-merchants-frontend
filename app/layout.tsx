import { IBM_Plex_Sans_Arabic, Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import "@/i18n/i18n";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import Script from "next/script";

const GoogleSansFlex = Google_Sans_Flex({
  variable: "--font-google-sans-flex",
  weight: ["100", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  subsets: ["latin"],
});

const IBMPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-IBMPlexSansArabic",
  weight: ["100", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "Bitely - Healthy Meals",
  description:
    "Bitely is a platform designed for healthy meal vendors, enabling restaurants to manage customer subscriptions with ease. Customers can access dedicated vendor links to choose meals through a flexible subscription model and manage their meal schedules effortlessly.",
  keywords: [
    "Bitely",
    "healthy meals",
    "meal subscription",
    "food subscription platform",
    "restaurant management system",
    "meal planning",
    "diet meals",
  ],
  authors: [{ name: "Bitely Team" }],
  creator: "Bitely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning={true}
      data-scroll-behavior="smooth"
      style={{ scrollBehavior: "smooth" }}
    >
      <head>
        <Script src="/scripts/lang-init.js" strategy="afterInteractive" />
      </head>
      <body
        className={`
          ${IBMPlexSansArabic.variable}
          ${GoogleSansFlex.variable}
          antialiased
        `}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}