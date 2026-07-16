import { config } from "dotenv";
import { resolve } from "node:path";
import { resolveRepoRoot } from "./paths";

config({ path: resolve(resolveRepoRoot(), ".env.local") });

export const CHAT_TOOLS = [
  {
    name: "get_mission",
    description: "Get current mission strip (phase, progress, blockers)",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_tasks",
    description: "Get live org tasks",
    input_schema: {
      type: "object",
      properties: { status: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "get_seat",
    description: "Get seat drill-down by slug",
    input_schema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    name: "get_seat_report",
    description:
      "Derived seat report (status, handoffs, human/agent next actions) for any digital worker slug",
    input_schema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
  },
  {
    name: "open_ui",
    description: "Navigate the Situation Room UI",
    input_schema: {
      type: "object",
      properties: {
        mode: { type: "string", enum: ["mission", "assign", "outputs", "csuite"] },
        slug: { type: "string" },
        phase: { type: "string" },
      },
      required: ["mode"],
    },
  },
  {
    name: "file_briefing",
    description:
      "Pin a standup snapshot for a manager/CEO seat (optional); prefer get_seat_report for truth",
    input_schema: {
      type: "object",
      properties: {
        position: { type: "string" },
        phase_focus: { type: "string" },
        status: { type: "string", enum: ["on_track", "at_risk", "blocked"] },
        progress: { type: "string" },
        asks: { type: "string" },
        blockers: { type: "string" },
      },
      required: ["position", "progress"],
    },
  },
  {
    name: "queue_dispatch",
    description: "Queue a validated manager dispatch packet",
    input_schema: {
      type: "object",
      properties: {
        phase: { type: "string" },
        goal: { type: "string" },
      },
      required: ["phase", "goal"],
    },
  },
  {
    name: "spawn_manager",
    description: "Claim a DISPATCH packet (oldest or by filename) and spawn manager via Cursor SDK",
    input_schema: {
      type: "object",
      properties: { filename: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "cancel_run",
    description: "Cancel an in-flight spawn run by runId",
    input_schema: {
      type: "object",
      properties: { runId: { type: "string" } },
      required: ["runId"],
    },
  },
  {
    name: "pause_seat",
    description: "Pause or resume a manager seat (blocks spawn when paused)",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        paused: { type: "boolean" },
      },
      required: ["slug", "paused"],
    },
  },
  {
    name: "rewake_session",
    description: "Resume a claimed manager session by dispatchFilename or agentId",
    input_schema: {
      type: "object",
      properties: {
        dispatchFilename: { type: "string" },
        agentId: { type: "string" },
      },
      additionalProperties: false,
    },
  },
] as const;

export async function runChatLlm(args: {
  system: string;
  messages: { role: "user" | "assistant"; content: string }[];
  tools: typeof CHAT_TOOLS;
}): Promise<{ text: string; toolCalls: { name: string; input: Record<string, unknown> }[] }> {
  const anthropic = process.env.ANTHROPIC_API_KEY;
  const openai = process.env.OPENAI_API_KEY;
  const model =
    process.env.SITUATION_ROOM_CHAT_MODEL ||
    (anthropic ? "claude-sonnet-4-5" : "gpt-4.1");

  if (anthropic) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropic,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: args.system,
        tools: args.tools.map((t) => ({
          name: t.name,
          description: t.description,
          input_schema: t.input_schema,
        })),
        messages: args.messages,
      }),
    });
    if (!res.ok) throw new Error(`Anthropic chat failed: ${res.status} ${await res.text()}`);
    const data = (await res.json()) as {
      content: { type: string; text?: string; name?: string; input?: Record<string, unknown> }[];
    };
    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("\n");
    const toolCalls = data.content
      .filter((b) => b.type === "tool_use")
      .map((b) => ({ name: b.name!, input: b.input ?? {} }));
    return { text, toolCalls };
  }

  if (openai) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openai}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: args.system },
          ...args.messages,
        ],
        tools: args.tools.map((t) => ({
          type: "function",
          function: {
            name: t.name,
            description: t.description,
            parameters: t.input_schema,
          },
        })),
      }),
    });
    if (!res.ok) throw new Error(`OpenAI chat failed: ${res.status} ${await res.text()}`);
    const data = (await res.json()) as {
      choices: {
        message: {
          content?: string;
          tool_calls?: { function: { name: string; arguments: string } }[];
        };
      }[];
    };
    const msg = data.choices[0]?.message;
    const toolCalls = (msg?.tool_calls ?? []).map((t) => ({
      name: t.function.name,
      input: JSON.parse(t.function.arguments || "{}") as Record<string, unknown>,
    }));
    return { text: msg?.content ?? "", toolCalls };
  }

  // Offline stub: echo + get_mission suggestion
  return {
    text: "No ANTHROPIC_API_KEY or OPENAI_API_KEY set. I can still navigate via keyword commands. Say 'brief me' or set a chat API key in .env.local.",
    toolCalls: [],
  };
}
