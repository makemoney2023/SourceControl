import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

export function resolveOccRoot(from = fileURLToPath(import.meta.url)): string {
  return join(dirname(from), "../..");
}

export function chromaPersistPath(occRoot: string): string {
  return join(occRoot, ".data/chroma");
}

export function chromaUrl(): string {
  return process.env.CHROMA_URL ?? "http://127.0.0.1:8000";
}

export function parseChromaUrl(url = chromaUrl()): { host: string; port: number; ssl: boolean } {
  const parsed = new URL(url);
  const host = parsed.hostname || "127.0.0.1";
  const port = parsed.port ? Number(parsed.port) : parsed.protocol === "https:" ? 443 : 8000;
  return { host, port, ssl: parsed.protocol === "https:" };
}

export async function chromaHeartbeatFetch(url = chromaUrl()): Promise<boolean> {
  try {
    const base = url.replace(/\/$/, "");
    const res = await fetch(`${base}/api/v2/heartbeat`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function ensureChromaRunning(occRoot: string): Promise<{ ok: boolean; detail: string }> {
  if (await chromaHeartbeatFetch()) {
    return { ok: true, detail: "Chroma already running" };
  }

  if (process.env.JARVIS_CHROMA_AUTOSTART !== "1") {
    return {
      ok: false,
      detail: "Chroma not reachable; start with `npx chroma run --path .data/chroma --port 8000` or set JARVIS_CHROMA_AUTOSTART=1",
    };
  }

  const persist = chromaPersistPath(occRoot);
  mkdirSync(persist, { recursive: true });
  const { port } = parseChromaUrl();

  try {
    const child = spawn(
      "npx",
      ["chroma", "run", "--path", persist, "--port", String(port)],
      {
        cwd: occRoot,
        detached: true,
        stdio: "ignore",
      },
    );
    child.unref();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, detail: `Failed to spawn Chroma: ${msg}` };
  }

  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 250));
    if (await chromaHeartbeatFetch()) {
      return { ok: true, detail: "Chroma auto-started" };
    }
  }

  return { ok: false, detail: "Chroma auto-start timed out" };
}
