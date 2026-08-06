# Design: Multi-Venture Project Switch

**Date:** 2026-07-16  
**Status:** Superseded in part by [Agency → Customer → Initiative](./2026-08-06-agency-customer-initiative-design.md) (portfolio v2 registry). Flat ventures still migrate wrap-in-place.  
**Approach:** A — Filesystem registry + namespaced ventures (Chroma deferred)

## Jobs to be done

| Job | Outcome |
|-----|---------|
| Run multiple ventures in ClaudeSkills | Each venture has isolated business-idea + MEMORY trees |
| Swap active venture | Operator changes `projects/registry.json` active slug via OCC or API |
| Maintain memory | Per-venture `MEMORY/` markdown (decisions, sessions, entities) |
| Manage backlog | Jarvis DISPATCH/tracker/HANDOFFS resolve under active venture |

## Non-goals

- ChromaDB / vector embeddings in v1
- Multi-code-repo switching (e.g. SuperPatch)
- Cross-venture unified backlog
- Multi-user OCC auth

## Registry SSOT

Path: `projects/registry.json`

```json
{
  "active": "passive-grid",
  "projects": {
    "passive-grid": {
      "name": "Passive Grid",
      "businessIdea": "docs/projects/passive-grid/business-idea",
      "memory": "docs/projects/passive-grid/MEMORY"
    }
  }
}
```

## Layout

```
docs/projects/<slug>/
  business-idea/     # DISPATCH, RUNBOOK-TRACKER, HANDOFFS, BRIEFINGS, phase artifacts
  MEMORY/
    README.md
    decisions.md
    sessions/
    entities/
projects/registry.json
```

Canonical business-idea root for slug `S`: `docs/projects/S/business-idea/`.

## Path resolution (OCC)

- `loadRegistry(repoRoot)` → parse registry
- `activeProjectSlug(repoRoot)` → `registry.active`
- `businessIdeaRoot(repoRoot, slug?)` → absolute path to venture business-idea
- `dispatchRoot` / `trackerPath` / `handoffsDir` / `briefingsDir` / `memoryDir` derive from that
- Allowlists: `docs/projects/`, `skills/org/`, `templates/business-idea/`
- Write allowlist: tracker, `DISPATCH/`, `BRIEFINGS/`, `MEMORY/` under active (or any registered) venture

## Project switch

1. `POST /api/project` with `{ "active": "<slug>" }` (slug must exist in registry)
2. Persist `registry.active`
3. Subsequent snapshot/tasks use new roots
4. In-flight claimed packets stay under their venture; do not move across ventures

## Memory (v1)

Filesystem only. Orchestrator loads `MEMORY/README.md` + recent `sessions/` when starting phase work. No embeddings.

## Chroma (deferred)

When MEMORY/HANDOFFS grow too large for grep: one Chroma collection per venture (`project_<slug>`) or one collection + `where: { project_id }`. Not part of this delivery.

## Migration

`docs/projects/<active>/business-idea/` → `docs/projects/passive-grid/business-idea/` (hard cut). All hardcoded `docs/projects/<active>/business-idea/` references updated to the namespaced path or to registry-resolved helpers.

## New venture

**UI (preferred):** Situation Room → **New idea** → name (+ optional slug) → **Create & switch** → `POST /api/project/create`.

**CLI:** `scripts/new-venture.sh <slug> "<Name>"` scaffolds the same tree from `templates/business-idea/`, MEMORY, and registry.
