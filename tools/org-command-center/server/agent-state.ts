import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface AgentStateFile {
  paused: boolean;
  updated_at: string;
  budget_usd?: number | null;
}

export function agentStateDir(dispatchRoot: string) {
  return join(dispatchRoot, "agent-state");
}

export function agentStatePath(dispatchRoot: string, slug: string) {
  return join(agentStateDir(dispatchRoot), `${slug}.json`);
}

export function isSeatPaused(dispatchRoot: string, slug: string): boolean {
  const path = agentStatePath(dispatchRoot, slug);
  if (!existsSync(path)) return false;
  try {
    const raw = JSON.parse(readFileSync(path, "utf8")) as AgentStateFile;
    return Boolean(raw.paused);
  } catch {
    return false;
  }
}

export function readAgentState(dispatchRoot: string, slug: string): AgentStateFile | null {
  const path = agentStatePath(dispatchRoot, slug);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as AgentStateFile;
  } catch {
    return null;
  }
}

export function setSeatPaused(dispatchRoot: string, slug: string, paused: boolean): AgentStateFile {
  mkdirSync(agentStateDir(dispatchRoot), { recursive: true });
  const prev = readAgentState(dispatchRoot, slug);
  const state: AgentStateFile = {
    paused,
    updated_at: new Date().toISOString(),
    budget_usd: prev?.budget_usd ?? null,
  };
  writeFileSync(agentStatePath(dispatchRoot, slug), JSON.stringify(state, null, 2), "utf8");
  return state;
}

export function setSeatBudget(
  dispatchRoot: string,
  slug: string,
  budgetUsd: number | null,
): AgentStateFile {
  mkdirSync(agentStateDir(dispatchRoot), { recursive: true });
  const prev = readAgentState(dispatchRoot, slug);
  const state: AgentStateFile = {
    paused: Boolean(prev?.paused),
    updated_at: new Date().toISOString(),
    budget_usd: budgetUsd,
  };
  writeFileSync(agentStatePath(dispatchRoot, slug), JSON.stringify(state, null, 2), "utf8");
  return state;
}

export function listAgentStates(dispatchRoot: string): Record<string, AgentStateFile> {
  const dir = agentStateDir(dispatchRoot);
  if (!existsSync(dir)) return {};
  const out: Record<string, AgentStateFile> = {};
  for (const name of readdirSync(dir).filter((n) => n.endsWith(".json"))) {
    const slug = name.replace(/\.json$/, "");
    try {
      out[slug] = JSON.parse(readFileSync(join(dir, name), "utf8")) as AgentStateFile;
    } catch {
      /* skip */
    }
  }
  return out;
}
