import { WorkerOptions, cli } from "@livekit/agents";
import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

config({
  path: resolve(fileURLToPath(new URL(".", import.meta.url)), "../../../.env.local"),
});
config({ path: resolve(fileURLToPath(new URL(".", import.meta.url)), "../.env") });

process.env.LIVEKIT_URL ||= "ws://127.0.0.1:7880";
process.env.LIVEKIT_API_KEY ||= "devkey";
process.env.LIVEKIT_API_SECRET ||= "secret";

cli.runApp(
  new WorkerOptions({
    agent: fileURLToPath(new URL("./agent.ts", import.meta.url)),
    agentName: process.env.LIVEKIT_AGENT_NAME || "situation-room",
  }),
);
