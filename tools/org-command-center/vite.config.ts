import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { orgCommandCenterApi } from "./server/vite-plugin-api";

export default defineConfig({
  plugins: [react(), tailwindcss(), orgCommandCenterApi()],
  server: {
    port: 5177,
    host: "127.0.0.1",
    watch: {
      ignored: ["**/whisper-sidecar/**", "**/livekit-agent/node_modules/**", "**/.venv/**"],
    },
  },
});

