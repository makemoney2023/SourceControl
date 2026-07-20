/**
 * Thin OCC Control MCP adapter — tools map to jarvis act/confirm.
 * HTTP bridge: POST /api/mcp/occ-control
 */

import { handleJarvisAct, handleJarvisConfirm } from "../jarvis/act";

export const OCC_CONTROL_TOOLS = [
  { name: "occ_mission_get", intent: "mission.get", confirm: false },
  { name: "occ_runs_watch", intent: "runs.watch", confirm: false },
  { name: "occ_runs_get", intent: "runs.get", confirm: false },
  { name: "occ_blocker_list", intent: "blocker.list", confirm: false },
  { name: "occ_memory_brief", intent: "memory.brief", confirm: false },
  { name: "occ_seat_report", intent: "seat.report", confirm: false },
  { name: "occ_dispatch_preview", intent: "dispatch.preview", confirm: false },
  { name: "occ_work_resolve", intent: "work.resolve", confirm: false },
  { name: "occ_work_request", intent: "work.request", confirm: true },
  { name: "occ_confirm", intent: null, confirm: true },
] as const;

export type OccControlToolName = (typeof OCC_CONTROL_TOOLS)[number]["name"];

const TOOL_BY_NAME = new Map(OCC_CONTROL_TOOLS.map((t) => [t.name, t]));

export function listOccControlTools() {
  return OCC_CONTROL_TOOLS.map(({ name, confirm }) => ({
    name,
    description: confirm
      ? `${name} (confirm-gated company action)`
      : `${name} (read / resolve)`,
    confirm,
  }));
}

export async function callOccControlTool(
  repoRoot: string,
  name: string,
  args: Record<string, unknown> = {},
  roomId = "mcp",
): Promise<unknown> {
  if (name === "occ_confirm") {
    const token = typeof args.confirmToken === "string" ? args.confirmToken : "";
    const accept = args.accept === true;
    return handleJarvisConfirm(repoRoot, roomId, token, accept);
  }

  const tool = TOOL_BY_NAME.get(name as OccControlToolName);
  if (!tool || !tool.intent) {
    return { status: "error", reason: `unknown tool: ${name}` };
  }

  const mode =
    args.mode === "ops" ||
    args.mode === "review" ||
    args.mode === "architect" ||
    args.mode === "briefing"
      ? args.mode
      : tool.confirm
        ? "ops"
        : "briefing";

  const { mode: _m, confirmToken, accept: _a, ...intentArgs } = args;
  return handleJarvisAct(repoRoot, roomId, {
    intent: tool.intent,
    args: intentArgs,
    confirmToken: typeof confirmToken === "string" ? confirmToken : undefined,
    mode,
  });
}

export async function handleOccControlRpc(
  repoRoot: string,
  body: unknown,
): Promise<unknown> {
  const req = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const method = String(req.method ?? "");

  if (method === "tools/list") {
    return { tools: listOccControlTools() };
  }

  if (method === "tools/call") {
    const params =
      req.params && typeof req.params === "object"
        ? (req.params as Record<string, unknown>)
        : {};
    const name = String(params.name ?? "");
    const args =
      params.arguments && typeof params.arguments === "object"
        ? (params.arguments as Record<string, unknown>)
        : {};
    const roomId = typeof params.roomId === "string" ? params.roomId : "mcp";
    return { result: await callOccControlTool(repoRoot, name, args, roomId) };
  }

  return { error: `unsupported method: ${method || "(missing)"}` };
}
