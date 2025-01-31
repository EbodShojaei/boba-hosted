import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

import { ThemeProvider } from "@/components/shared/Providers";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";
import CookieConsentBanner from "@/components/shared/CookieConsentBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiLB Leaderboard",
  description: "Comparing bWAR (Boba WAR) and standard WAR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="boba.report"
          data-description="Support me on Buy me a coffee!"
          data-message="Thanks for fueling our MLB predictions!"
          data-color="#5F7FFF"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="72"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <Analytics />
        <CookieConsentBanner />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Header />
          <div className="py-8 px-2">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
