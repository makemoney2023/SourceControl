import { afterEach, describe, expect, it, vi } from "vitest";
import { callObsidianTool, createVaultFile, obsidianConfigured } from "./mcp-client";

describe("obsidianConfigured", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is false without token", () => {
    vi.stubEnv("OBSIDIAN_MCP_TOKEN", "");
    vi.stubEnv("OBSIDIAN_MCP_URL", "");
    expect(obsidianConfigured()).toBe(false);
  });

  it("is true when token is set", () => {
    vi.stubEnv("OBSIDIAN_MCP_TOKEN", "test-token");
    expect(obsidianConfigured()).toBe(true);
  });
});

describe("callObsidianTool", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("posts tools/call and returns text content", async () => {
    vi.stubEnv("OBSIDIAN_MCP_TOKEN", "tok");
    vi.stubEnv("OBSIDIAN_MCP_URL", "http://127.0.0.1:27200/mcp");
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: { content: [{ type: "text", text: "OK" }] },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await callObsidianTool("create_vault_file", {
      path: "org/x/a.md",
      content: "# hi",
    });
    expect(result).toEqual({ ok: true, text: "OK" });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:27200/mcp",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer tok",
        }),
      }),
    );
  });

  it("createVaultFile wraps create_vault_file", async () => {
    vi.stubEnv("OBSIDIAN_MCP_TOKEN", "tok");
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: { content: [{ type: "text", text: "OK" }] },
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const r = await createVaultFile("org/x/a.md", "# a");
    expect(r.ok).toBe(true);
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body.params.name).toBe("create_vault_file");
    expect(body.params.arguments.path).toBe("org/x/a.md");
  });
});
