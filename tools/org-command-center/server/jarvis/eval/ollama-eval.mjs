#!/usr/bin/env node
/**
 * Local-only optional golden eval via Ollama. Skips gracefully when Ollama or qwen3 is unavailable.
 * CI uses heuristicIntent + policy in run-golden.test.ts instead.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL ?? "qwen3";
const __dir = dirname(fileURLToPath(import.meta.url));
const golden = JSON.parse(readFileSync(join(__dir, "golden.json"), "utf8"));

function isLocalhost(url) {
  try {
    const { hostname } = new URL(url);
    return hostname === "127.0.0.1" || hostname === "localhost";
  } catch {
    return false;
  }
}

async function skip(message) {
  console.log(`SKIP: ${message}`);
  process.exit(0);
}

async function main() {
  if (!isLocalhost(HOST)) {
    await skip(`OLLAMA_HOST must be localhost (got ${HOST})`);
  }

  let tags;
  try {
    const res = await fetch(`${HOST}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) await skip(`Ollama not reachable at ${HOST}`);
    tags = await res.json();
  } catch {
    await skip(`Ollama not reachable at ${HOST}`);
  }

  const names = new Set(
    (tags.models ?? []).map((m) => (m.name ?? "").split(":")[0]),
  );
  if (!names.has(MODEL)) {
    await skip(`Model '${MODEL}' not found locally (ollama pull ${MODEL})`);
  }

  const intents = [
    "mission.get",
    "digest.get",
    "seat.report",
    "tasks.list",
    "runs.list",
    "activity.list",
    "alerts.list",
    "spend.get",
    "file.read",
    "dispatch.queue",
    "alerts.ack",
    "routine.enable",
    "spawn.run_next",
    "run.cancel",
    "run.rewake",
    "agent.pause",
    "agent.resume",
    "csuite.draft",
    "mode.set",
  ];

  let passed = 0;
  let failed = 0;

  for (const c of golden) {
    const payload = {
      model: MODEL,
      stream: false,
      messages: [
        {
          role: "system",
          content: `Classify the operator utterance into exactly one Jarvis intent. Reply with only the intent string from: ${intents.join(", ")}`,
        },
        { role: "user", content: c.utterance },
      ],
    };

    let intent;
    try {
      const res = await fetch(`${HOST}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) {
        failed++;
        console.log(`FAIL (HTTP): "${c.utterance}"`);
        continue;
      }
      const data = await res.json();
      intent = (data.message?.content ?? "").trim().split(/\s/)[0];
    } catch {
      failed++;
      console.log(`FAIL (timeout): "${c.utterance}"`);
      continue;
    }

    if (intent === c.expectIntent) {
      passed++;
    } else {
      failed++;
      console.log(`FAIL: "${c.utterance}" → got ${intent}, expected ${c.expectIntent}`);
    }
  }

  console.log(`Ollama golden eval: ${passed}/${golden.length} passed (${MODEL})`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.log(`SKIP: ${err.message}`);
  process.exit(0);
});
