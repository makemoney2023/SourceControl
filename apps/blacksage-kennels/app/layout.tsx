import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { PAGE_META } from "@/lib/content/page-meta";
import { getSiteUrl } from "@/lib/seo/site-url";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: PAGE_META.home.title,
  description: PAGE_META.home.description,
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${manrope.variable} min-h-screen bg-blacksage-ground text-blacksage-text-primary antialiased`}
      >
        <SkipLink />
        <AnalyticsScripts />
        <PageViewTracker />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
