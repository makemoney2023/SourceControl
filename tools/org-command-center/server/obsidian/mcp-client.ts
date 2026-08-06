export type ObsidianToolResult = {
  ok: boolean;
  text: string;
  error?: string;
};

export type ObsidianFetch = typeof fetch;

function mcpUrl(): string {
  return (process.env.OBSIDIAN_MCP_URL || "http://127.0.0.1:27200/mcp").trim();
}

function mcpToken(): string {
  return (process.env.OBSIDIAN_MCP_TOKEN || "").trim();
}

export function obsidianConfigured(): boolean {
  return mcpToken().length > 0;
}

let rpcId = 1;

export async function callObsidianTool(
  name: string,
  args: Record<string, unknown>,
  deps?: { fetch?: ObsidianFetch },
): Promise<ObsidianToolResult> {
  const token = mcpToken();
  if (!token) {
    return { ok: false, text: "", error: "OBSIDIAN_MCP_TOKEN not set" };
  }
  const fetchFn = deps?.fetch ?? fetch;
  const res = await fetchFn(mcpUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: rpcId++,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });
  const raw = await res.text();
  if (!res.ok) {
    return { ok: false, text: "", error: `HTTP ${res.status}: ${raw.slice(0, 200)}` };
  }
  let parsed: {
    result?: { content?: Array<{ type?: string; text?: string }>; isError?: boolean };
    error?: { message?: string };
  };
  try {
    parsed = JSON.parse(raw) as typeof parsed;
  } catch {
    return { ok: false, text: "", error: `Invalid JSON: ${raw.slice(0, 200)}` };
  }
  if (parsed.error?.message) {
    return { ok: false, text: "", error: parsed.error.message };
  }
  const text = (parsed.result?.content ?? [])
    .filter((c) => c.type === "text" && typeof c.text === "string")
    .map((c) => c.text)
    .join("\n")
    .trim();
  if (parsed.result?.isError) {
    return { ok: false, text, error: text || "tool error" };
  }
  return { ok: true, text: text || "OK" };
}

export async function createVaultFile(
  path: string,
  content: string,
  deps?: { fetch?: ObsidianFetch },
): Promise<ObsidianToolResult> {
  return callObsidianTool("create_vault_file", { path, content }, deps);
}

export async function getServerInfo(
  deps?: { fetch?: ObsidianFetch },
): Promise<ObsidianToolResult> {
  return callObsidianTool("get_server_info", {}, deps);
}
