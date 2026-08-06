import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  graphifyExplain,
  graphifyPath,
  graphifyQuery,
  graphifyStatus,
  resolveGraphifyPaths,
} from "./graphify-query";

describe("resolveGraphifyPaths", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("prefers repo-root graphify-out when present", () => {
    root = mkdtempSync(join(tmpdir(), "occ-graphify-"));
    mkdirSync(join(root, "graphify-out"), { recursive: true });
    writeFileSync(join(root, "graphify-out/graph.json"), '{"nodes":[],"edges":[]}');
    writeFileSync(join(root, "graphify-out/graph.html"), "<html></html>");
    const paths = resolveGraphifyPaths(root);
    expect(paths.graphJson).toBe(join(root, "graphify-out/graph.json"));
    expect(paths.graphHtml).toBe(join(root, "graphify-out/graph.html"));
    expect(paths.ready).toBe(true);
  });

  it("falls back to org-command-center graphify-out", () => {
    root = mkdtempSync(join(tmpdir(), "occ-graphify-"));
    const occ = join(root, "tools/org-command-center/graphify-out");
    mkdirSync(occ, { recursive: true });
    writeFileSync(join(occ, "graph.json"), '{"nodes":[{"id":"a"}],"edges":[]}');
    const paths = resolveGraphifyPaths(root);
    expect(paths.graphJson).toBe(join(occ, "graph.json"));
    expect(paths.ready).toBe(true);
  });

  it("reports not ready when no graph exists", () => {
    root = mkdtempSync(join(tmpdir(), "occ-graphify-"));
    const paths = resolveGraphifyPaths(root);
    expect(paths.ready).toBe(false);
    expect(paths.graphJson).toBe(join(root, "graphify-out/graph.json"));
  });
});

describe("graphifyStatus", () => {
  let root = "";
  afterEach(() => {
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("returns node and edge counts from graph.json", () => {
    root = mkdtempSync(join(tmpdir(), "occ-graphify-"));
    mkdirSync(join(root, "graphify-out"), { recursive: true });
    writeFileSync(
      join(root, "graphify-out/graph.json"),
      JSON.stringify({
        nodes: [{ id: "a" }, { id: "b" }],
        links: [{ source: "a", target: "b" }],
      }),
    );
    writeFileSync(join(root, "graphify-out/graph.html"), "<html>viz</html>");
    const status = graphifyStatus(root);
    expect(status.ready).toBe(true);
    expect(status.nodeCount).toBe(2);
    expect(status.edgeCount).toBe(1);
    expect(status.hasHtml).toBe(true);
  });
});

describe("graphifyQuery / path / explain", () => {
  let root = "";
  afterEach(() => {
    vi.restoreAllMocks();
    if (root) rmSync(root, { recursive: true, force: true });
  });

  it("runs graphify query against the resolved graph and returns stdout", async () => {
    root = mkdtempSync(join(tmpdir(), "occ-graphify-"));
    mkdirSync(join(root, "graphify-out"), { recursive: true });
    writeFileSync(
      join(root, "graphify-out/graph.json"),
      JSON.stringify({ nodes: [{ id: "SeatNode", label: "SeatNode" }], edges: [] }),
    );

    const runCli = vi.fn(async () => ({
      stdout: "Node: SeatNode\n  Degree: 3\n",
      stderr: "",
      code: 0,
    }));

    const result = await graphifyQuery(
      root,
      { question: "what is SeatNode?" },
      { runCli },
    );
    expect(result.ok).toBe(true);
    expect(result.text).toContain("SeatNode");
    expect(runCli).toHaveBeenCalledWith(
      expect.objectContaining({
        args: expect.arrayContaining(["query", "what is SeatNode?"]),
      }),
    );
  });

  it("runs graphify path between two labels", async () => {
    root = mkdtempSync(join(tmpdir(), "occ-graphify-"));
    mkdirSync(join(root, "graphify-out"), { recursive: true });
    writeFileSync(join(root, "graphify-out/graph.json"), '{"nodes":[],"edges":[]}');

    const runCli = vi.fn(async () => ({
      stdout: "Shortest path (2 hops):\n  A --uses--> B\n",
      stderr: "",
      code: 0,
    }));

    const result = await graphifyPath(root, { source: "A", target: "B" }, { runCli });
    expect(result.ok).toBe(true);
    expect(result.text).toContain("Shortest path");
    expect(runCli).toHaveBeenCalledWith(
      expect.objectContaining({
        args: expect.arrayContaining(["path", "A", "B", "--undirected"]),
      }),
    );
  });

  it("throws when graph is missing", async () => {
    root = mkdtempSync(join(tmpdir(), "occ-graphify-"));
    await expect(graphifyQuery(root, { question: "auth" })).rejects.toThrow(/graph not ready/i);
    await expect(graphifyPath(root, { source: "A", target: "B" })).rejects.toThrow(
      /graph not ready/i,
    );
    await expect(graphifyExplain(root, { label: "X" })).rejects.toThrow(/graph not ready/i);
  });
});
