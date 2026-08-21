import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Telltail — See the signal. Do the next right thing.",
  description:
    "Training tool for missed moments. One chat thread. Attach a clip for a refuse-first read.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Telltail",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F2E9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} min-h-dvh antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
