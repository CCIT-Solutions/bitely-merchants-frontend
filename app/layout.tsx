import localFont from "next/font/local";
import { Google_Sans_Flex } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import "@/i18n/i18n";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import Script from "next/script";

export const leagueSpartan = localFont({
  src: [
    { path: "./fonts/LeagueSpartan-Thin.ttf", weight: "100" },
    { path: "./fonts/LeagueSpartan-ExtraLight.ttf", weight: "200" },
    { path: "./fonts/LeagueSpartan-Light.ttf", weight: "300" },
    { path: "./fonts/LeagueSpartan-Regular.ttf", weight: "400" },
    { path: "./fonts/LeagueSpartan-Medium.ttf", weight: "500" },
    { path: "./fonts/LeagueSpartan-SemiBold.ttf", weight: "600" },
    { path: "./fonts/LeagueSpartan-Bold.ttf", weight: "700" },
    { path: "./fonts/LeagueSpartan-ExtraBold.ttf", weight: "800" },
    { path: "./fonts/LeagueSpartan-Black.ttf", weight: "900" },
  ],
  variable: "--font-league-spartan",
  display: "swap",
  preload: true,
});

const IBMPlexSansArabic = Google_Sans_Flex({
  variable: "--font-IBMPlexSansArabic",
  weight: ["100", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  subsets: [ "latin"],
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
        {/* <link
          rel="stylesheet"
          href="https://cdn.moyasar.com/mpf/1.7.3/moyasar.css"
        /> */}
        {/* <Script
          src="https://cdn.moyasar.com/mpf/1.7.3/moyasar.js"
          strategy="afterInteractive"
        /> */}
        <Script src="/scripts/lang-init.js" strategy="afterInteractive" />
      </head>
      <body
        className={`
          ${IBMPlexSansArabic.variable}
          ${leagueSpartan.variable}
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
