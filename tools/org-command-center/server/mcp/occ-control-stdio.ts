#!/usr/bin/env npx tsx
/**
 * Stdio JSON-RPC bridge to OCC Control MCP HTTP endpoint.
 * Configure via tools/org-command-center/docs/mcp.json
 *
 * Env:
 *   OCC_API_BASE — default http://127.0.0.1:5177
 */

const base = (process.env.OCC_API_BASE || "http://127.0.0.1:5177").replace(/\/$/, "");

async function rpc(body: unknown): Promise<unknown> {
  const res = await fetch(`${base}/api/mcp/occ-control`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function handleLine(line: string): Promise<void> {
  let msg: { jsonrpc?: string; id?: unknown; method?: string; params?: unknown };
  try {
    msg = JSON.parse(line) as typeof msg;
  } catch {
    return;
  }
  if (!msg.method) return;

  if (msg.method === "initialize") {
    process.stdout.write(
      `${JSON.stringify({
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "occ-control", version: "0.1.0" },
        },
      })}\n`,
    );
    return;
  }

  if (msg.method === "notifications/initialized" || msg.method === "ping") {
    if (msg.id !== undefined) {
      process.stdout.write(
        `${JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: {} })}\n`,
      );
    }
    return;
  }

  if (msg.method === "tools/list") {
    const data = (await rpc({ method: "tools/list" })) as {
      tools?: Array<{ name: string; description: string }>;
    };
    process.stdout.write(
      `${JSON.stringify({
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          tools: (data.tools ?? []).map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: { type: "object", properties: {}, additionalProperties: true },
          })),
        },
      })}\n`,
    );
    return;
  }

  if (msg.method === "tools/call") {
    const params = (msg.params ?? {}) as {
      name?: string;
      arguments?: Record<string, unknown>;
    };
    const data = (await rpc({
      method: "tools/call",
      params: { name: params.name, arguments: params.arguments ?? {} },
    })) as { result?: unknown; error?: string };
    process.stdout.write(
      `${JSON.stringify({
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(data.result ?? data, null, 2),
            },
          ],
        },
      })}\n`,
    );
    return;
  }

  process.stdout.write(
    `${JSON.stringify({
      jsonrpc: "2.0",
      id: msg.id,
      error: { code: -32601, message: `Method not found: ${msg.method}` },
    })}\n`,
  );
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";
  for (const line of lines) {
    if (!line.trim()) continue;
    void handleLine(line.trim());
  }
});
