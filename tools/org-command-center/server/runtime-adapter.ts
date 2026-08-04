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
  runId?: string;
  /** Platform correlation id — log with agentId for support / dashboards */
  requestId?: string;
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

type SdkAgentHandle = {
  agentId?: string;
  close: () => void | Promise<void>;
  send: (
    prompt: string,
    opts?: { model: { id: string } },
  ) => Promise<{
    id?: string;
    agentId?: string;
    requestId?: string;
    wait: () => Promise<{
      status?: string;
      result?: unknown;
      id?: string;
      requestId?: string;
      usage?: TokenUsageLike;
      durationMs?: number;
    }>;
  }>;
};

/**
 * Local Cursor SDK adapter for OCC worker spawn.
 * Distinguishes startup failures (thrown CursorAgentError) from run failures
 * (returned status === "error"). Always disposes the agent handle.
 */
export const cursorRuntimeAdapter: RuntimeAdapter = {
  async run(input) {
    return withAbortSignal(input.signal, async () => {
      const { Agent } = await import("@cursor/sdk");
      const opts = {
        apiKey: input.apiKey,
        model: { id: normalizeCursorModelId(input.model) },
        local: { cwd: input.cwd },
      };

      let agent: SdkAgentHandle | undefined;
      try {
        agent = (
          input.agentId
            ? await Agent.resume(input.agentId, opts)
            : await Agent.create(opts)
        ) as SdkAgentHandle;

        const run = await agent.send(input.prompt, {
          model: opts.model,
        });
        const result = await run.wait();
        return {
          status: result.status ?? "completed",
          result: result.result,
          agentId: agent.agentId || run.agentId || result.id,
          runId: run.id ?? result.id,
          requestId: run.requestId ?? result.requestId,
          usage: result.usage,
          durationMs: result.durationMs,
        };
      } finally {
        if (agent) {
          try {
            await agent.close();
          } catch {
            /* ignore dispose errors */
          }
        }
      }
    });
  },
};
