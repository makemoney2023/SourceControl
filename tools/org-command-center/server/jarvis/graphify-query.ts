import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { JarvisExecError } from "./errors";

export type GraphifyPaths = {
  graphJson: string;
  graphHtml: string;
  ready: boolean;
  hasHtml: boolean;
};

export type GraphifyStatus = GraphifyPaths & {
  nodeCount: number;
  edgeCount: number;
};

export type GraphifyCliResult = {
  stdout: string;
  stderr: string;
  code: number;
};

export type GraphifyRunCli = (opts: {
  args: string[];
  cwd: string;
}) => Promise<GraphifyCliResult>;

const DEFAULT_TIMEOUT_MS = 60_000;

function candidateRoots(repoRoot: string): string[] {
  return [
    join(repoRoot, "graphify-out"),
    join(repoRoot, "tools/org-command-center/graphify-out"),
  ];
}

export function resolveGraphifyPaths(repoRoot: string): GraphifyPaths {
  const override = process.env.GRAPHIFY_GRAPH_PATH?.trim();
  if (override) {
    const graphJson = override;
    const graphHtml = join(join(override, ".."), "graph.html");
    const ready = existsSync(graphJson);
    return {
      graphJson,
      graphHtml: existsSync(graphHtml) ? graphHtml : join(repoRoot, "graphify-out/graph.html"),
      ready,
      hasHtml: existsSync(graphHtml),
    };
  }

  for (const dir of candidateRoots(repoRoot)) {
    const graphJson = join(dir, "graph.json");
    if (existsSync(graphJson)) {
      const graphHtml = join(dir, "graph.html");
      return {
        graphJson,
        graphHtml,
        ready: true,
        hasHtml: existsSync(graphHtml),
      };
    }
  }

  const fallback = join(repoRoot, "graphify-out");
  return {
    graphJson: join(fallback, "graph.json"),
    graphHtml: join(fallback, "graph.html"),
    ready: false,
    hasHtml: false,
  };
}

function countGraph(graphJson: string): { nodeCount: number; edgeCount: number } {
  try {
    const raw = JSON.parse(readFileSync(graphJson, "utf8")) as {
      nodes?: unknown[];
      edges?: unknown[];
      links?: unknown[];
    };
    const edgeList = Array.isArray(raw.links)
      ? raw.links
      : Array.isArray(raw.edges)
        ? raw.edges
        : [];
    return {
      nodeCount: Array.isArray(raw.nodes) ? raw.nodes.length : 0,
      edgeCount: edgeList.length,
    };
  } catch {
    return { nodeCount: 0, edgeCount: 0 };
  }
}

export function graphifyStatus(repoRoot: string): GraphifyStatus {
  const paths = resolveGraphifyPaths(repoRoot);
  if (!paths.ready) {
    return { ...paths, nodeCount: 0, edgeCount: 0 };
  }
  const counts = countGraph(paths.graphJson);
  return { ...paths, ...counts };
}

async function defaultRunCli(opts: {
  args: string[];
  cwd: string;
}): Promise<GraphifyCliResult> {
  return new Promise((resolve, reject) => {
    const child = spawn("graphify", opts.args, {
      cwd: opts.cwd,
      env: process.env,
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new JarvisExecError("graphify timed out", "timeout"));
    }, DEFAULT_TIMEOUT_MS);
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(
        new JarvisExecError(
          `graphify CLI unavailable: ${err.message}`,
          "dependency_missing",
        ),
      );
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code: code ?? 1 });
    });
  });
}

function assertReady(repoRoot: string): GraphifyPaths {
  const paths = resolveGraphifyPaths(repoRoot);
  if (!paths.ready) {
    throw new JarvisExecError(
      "graphify graph not ready — run graphify extract (see tools/org-command-center/README.md)",
      "not_ready",
    );
  }
  return paths;
}

async function runGraphify(
  repoRoot: string,
  args: string[],
  runCli: GraphifyRunCli,
): Promise<{ ok: true; text: string; graph: string }> {
  const paths = assertReady(repoRoot);
  const result = await runCli({
    args: [...args, "--graph", paths.graphJson],
    cwd: repoRoot,
  });
  if (result.code !== 0) {
    const detail = (result.stderr || result.stdout || "unknown error").trim();
    throw new JarvisExecError(`graphify failed: ${detail}`, "exec_failed");
  }
  return {
    ok: true,
    text: (result.stdout || result.stderr).trim(),
    graph: paths.graphJson,
  };
}

export async function graphifyQuery(
  repoRoot: string,
  args: { question: string; budget?: number },
  deps?: { runCli?: GraphifyRunCli },
): Promise<{ ok: true; text: string; graph: string }> {
  const question = args.question.trim();
  if (!question) throw new JarvisExecError("question required", "missing_arg");
  const cliArgs = ["query", question];
  if (args.budget != null && Number.isFinite(args.budget) && args.budget > 0) {
    cliArgs.push("--budget", String(Math.floor(args.budget)));
  }
  return runGraphify(repoRoot, cliArgs, deps?.runCli ?? defaultRunCli);
}

export async function graphifyPath(
  repoRoot: string,
  args: { source: string; target: string },
  deps?: { runCli?: GraphifyRunCli },
): Promise<{ ok: true; text: string; graph: string }> {
  const source = args.source.trim();
  const target = args.target.trim();
  if (!source || !target) {
    throw new JarvisExecError("source and target required", "missing_arg");
  }
  // Corpus graphs are undirected by default; --undirected finds neighborhood paths.
  return runGraphify(
    repoRoot,
    ["path", source, target, "--undirected"],
    deps?.runCli ?? defaultRunCli,
  );
}

export async function graphifyExplain(
  repoRoot: string,
  args: { label: string },
  deps?: { runCli?: GraphifyRunCli },
): Promise<{ ok: true; text: string; graph: string }> {
  const label = args.label.trim();
  if (!label) throw new JarvisExecError("label required", "missing_arg");
  return runGraphify(repoRoot, ["explain", label], deps?.runCli ?? defaultRunCli);
}
