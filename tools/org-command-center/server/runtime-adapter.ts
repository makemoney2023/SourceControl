import { normalizeCursorModelId } from "../src/lib/cursor-models";
import type { TokenUsageLike } from "../src/lib/cost-rates";

export interface RuntimeRunInput {
  prompt: string;
  model: string;
  cwd: string;
  apiKey: string;
  signal?: AbortSignal;
  /** When set, resume existing agent instead of create */
  agentId?: string;
}

export interface RuntimeRunResult {
  status: string;
  result: unknown;
  agentId?: string;
  usage?: TokenUsageLike;
  durationMs?: number;
}

export interface RuntimeAdapter {
  run(input: RuntimeRunInput): Promise<RuntimeRunResult>;
}

function abortError(): Error {
  const err = new Error("Aborted");
  err.name = "AbortError";
  return err;
}

export async function withAbortSignal<T>(
  signal: AbortSignal | undefined,
  work: () => Promise<T>,
): Promise<T> {
  if (!signal) return work();
  if (signal.aborted) throw abortError();
  return new Promise<T>((resolve, reject) => {
    const onAbort = () => {
      reject(abortError());
    };
    signal.addEventListener("abort", onAbort, { once: true });
    work()
      .then((v) => {
        signal.removeEventListener("abort", onAbort);
        resolve(v);
      })
      .catch((e) => {
        signal.removeEventListener("abort", onAbort);
        reject(e);
      });
  });
}

export const cursorRuntimeAdapter: RuntimeAdapter = {
  async run(input) {
    return withAbortSignal(input.signal, async () => {
      const { Agent } = await import("@cursor/sdk");
      const opts = {
        apiKey: input.apiKey,
        model: { id: normalizeCursorModelId(input.model) },
        local: { cwd: input.cwd },
      };

      try {
        const agent = input.agentId
          ? await Agent.resume(input.agentId, opts)
          : await Agent.create(opts);
        const run = await agent.send(input.prompt, {
          model: opts.model,
        });
        const result = await run.wait();
        try {
          agent.close();
        } catch {
          /* ignore */
        }
        return {
          status: result.status ?? "completed",
          result: result.result,
          agentId: run.agentId || agent.agentId || result.id,
          usage: result.usage,
          durationMs: result.durationMs,
        };
      } catch (e) {
        // Fallback: one-shot prompt (no session continuity)
        if (input.agentId) throw e;
        const result = await Agent.prompt(input.prompt, opts);
        return {
          status: result.status ?? "completed",
          result: result.result,
          agentId: result.id,
          usage: result.usage,
          durationMs: result.durationMs,
        };
      }
    });
  },
};
