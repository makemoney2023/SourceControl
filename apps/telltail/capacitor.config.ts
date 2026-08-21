import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Ionic Capacitor shell for iOS/Android wraps of the same web chat app.
 * Explore MVP: config only — no store binaries. Wrapped builds load the hosted web app URL.
 */
const config: CapacitorConfig = {
  appId: "com.telltail.explore",
  appName: "Telltail",
  webDir: "public",
  server: {
    url: process.env.CAPACITOR_SERVER_URL ?? "http://localhost:3010",
    cleartext: true,
  },
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
