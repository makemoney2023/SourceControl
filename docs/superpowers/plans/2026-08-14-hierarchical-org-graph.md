# Hierarchical Org Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Control Center and Obsidian the same four-level graph: Agency → Customer → Initiative → Seat ego-network, with real edges.

**Architecture:** One scoped builder (`buildScopedOrgGraph`) reads the portfolio registry plus per-initiative work snapshots. `OrgWorkGraphView` drills one level at a time. The same edge list is written as generated `memorybank/org/GRAPH/` MOCs and `<!-- graph:start -->` footers so Obsidian’s native graph shows the same tree.

**Tech Stack:** TypeScript, Vitest, Hono (`tools/org-command-center/server/api.ts`), existing `OrgWorkGraph` types, vault writes under `memorybank/org/GRAPH/`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-14-hierarchical-org-graph-design.md`
- Strict drill-down 1 → 2 → 3 → 4; breadcrumb is the only way up; no Agency → Initiative skip
- Knowledge graph opens at `scope=agency` for the **active agency**
- Agency graph has no handoff/run/deliverable/artifact nodes
- Seat ego-network draws spawned ICs, related IC handoffs, reports_to, csuite review, position skill + packs + packsUsed, phase — not same-phase peers, not other initiatives
- Seat/phase MOCs are per initiative (`CEO — Sieger Show Secretary` ≠ `CEO — Blacksage Kennels · Main`)
- Initiative MOC title is `<Initiative Name>` when unique in the agency; otherwise `<Customer Name> · <Initiative Name>` (so every `Main` is unique)
- Handoff bodies are not rewritten; only the `<!-- graph:start -->` / `<!-- graph:end -->` block
- OCC is Hono + Vite, not Next.js — do **not** use `after()`. Schedule vault sync with `void syncVaultGraph(...).catch(...)`
- Graphify `graph.html` / Jarvis `graph.*` stay unchanged
- TDD: failing test first. Tests run from `tools/org-command-center` via `npm test -- <file>`
- Do not add `peers=1` in v1

---

## File map

| File | Responsibility |
|------|----------------|
| `tools/org-command-center/src/jarvis/graph-scope.ts` | `GraphScope`, `GraphFocus`, `nextGraphFocus`, `breadcrumbTrail`, `initiativeMocTitle` |
| `tools/org-command-center/src/jarvis/graph-scope.test.ts` | Click and breadcrumb rules |
| `tools/org-command-center/src/lib/types.ts` | Add `icsSpawned: string[]` on `HandoffRecord` |
| `tools/org-command-center/src/lib/parse-handoff.ts` | Parse `ics_spawned` |
| `tools/org-command-center/src/lib/parse-handoff.test.ts` | Parser test |
| `tools/org-command-center/server/initiative-work.ts` | Load handoffs/runs/inbox for one `businessIdea` path |
| `tools/org-command-center/server/initiative-work.test.ts` | Loader test |
| `tools/org-command-center/src/jarvis/org-work-graph.ts` | `skill` kind, new edges, `buildScopedOrgGraph`, `buildSeatEgoGraph` |
| `tools/org-command-center/src/jarvis/org-work-graph.test.ts` | Scope + ego tests |
| `tools/org-command-center/server/api.ts` | Four-scope GET + 404s + fire-and-forget sync |
| `tools/org-command-center/src/api/client.ts` | `fetchOrgWorkGraph(focus)` |
| `tools/org-command-center/src/jarvis/hud/OrgWorkGraphView.tsx` | Breadcrumb, labels, zoom/pan, click rules |
| `tools/org-command-center/src/jarvis/SituationRoom.tsx` | Focus state; open at agency |
| `tools/org-command-center/server/obsidian/vault-graph-sync.ts` | MOCs + footers |
| `tools/org-command-center/server/obsidian/vault-graph-sync.test.ts` | Idempotent writes |
| `tools/org-command-center/server/obsidian/index.ts` | Re-export sync |
| `tools/org-command-center/server/jarvis/tools-exec.ts` | Call sync from `obsidian.sync` |
| `tools/org-command-center/README.md` | Knowledge graph scopes |

---

### Task 1: Graph focus click helper

**Files:**
- Create: `tools/org-command-center/src/jarvis/graph-scope.ts`
- Test: `tools/org-command-center/src/jarvis/graph-scope.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `GraphScope`, `GraphFocus`, `nextGraphFocus()`, `breadcrumbTrail()`, `parseInitiativeSlug()`, `initiativeMocTitle()`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import {
  breadcrumbTrail,
  initiativeMocTitle,
  nextGraphFocus,
  parseInitiativeSlug,
  type GraphFocus,
} from "./graph-scope";

const agency: GraphFocus = { scope: "agency" };

describe("nextGraphFocus", () => {
  it("agency + customer node drills to customer", () => {
    expect(
      nextGraphFocus(agency, { kind: "customer", slug: "blacksage-kennels" }),
    ).toEqual({ scope: "customer", customer: "blacksage-kennels" });
  });

  it("agency + initiative node is refused", () => {
    expect(
      nextGraphFocus(agency, {
        kind: "initiative",
        slug: "blacksage-kennels/sieger-show-secretary",
      }),
    ).toBeNull();
  });

  it("customer + initiative node drills to initiative", () => {
    expect(
      nextGraphFocus(
        { scope: "customer", customer: "blacksage-kennels" },
        { kind: "initiative", slug: "blacksage-kennels/sieger-show-secretary" },
      ),
    ).toEqual({
      scope: "initiative",
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
    });
  });

  it("initiative + seat node drills to seat", () => {
    expect(
      nextGraphFocus(
        {
          scope: "initiative",
          customer: "blacksage-kennels",
          initiative: "sieger-show-secretary",
        },
        { kind: "seat", slug: "ceo-strategist" },
      ),
    ).toEqual({
      scope: "seat",
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
      seat: "ceo-strategist",
    });
  });

  it("seat + work node opens work without changing scope", () => {
    expect(
      nextGraphFocus(
        {
          scope: "seat",
          customer: "blacksage-kennels",
          initiative: "sieger-show-secretary",
          seat: "ceo-strategist",
        },
        { kind: "handoff", slug: "ceo-strategist" },
      ),
    ).toBe("open-work");
  });
});

describe("parseInitiativeSlug / moc titles", () => {
  it("splits customer/initiative", () => {
    expect(parseInitiativeSlug("blacksage-kennels/sieger-show-secretary")).toEqual({
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
    });
  });

  it("disambiguates Main", () => {
    expect(
      initiativeMocTitle({
        initiativeName: "Main",
        customerName: "Blacksage Kennels",
        uniqueInAgency: false,
      }),
    ).toBe("Blacksage Kennels · Main");
    expect(
      initiativeMocTitle({
        initiativeName: "Sieger Show Secretary",
        customerName: "Blacksage Kennels",
        uniqueInAgency: true,
      }),
    ).toBe("Sieger Show Secretary");
  });
});

describe("breadcrumbTrail", () => {
  it("builds four crumbs for a seat focus", () => {
    const crumbs = breadcrumbTrail(
      {
        scope: "seat",
        customer: "blacksage-kennels",
        initiative: "sieger-show-secretary",
        seat: "ceo-strategist",
      },
      {
        orgName: "Velocity Agency",
        customerName: "Blacksage Kennels",
        initiativeName: "Sieger Show Secretary",
        seatTitle: "CEO / Strategist",
      },
    );
    expect(crumbs.map((c) => c.scope)).toEqual([
      "agency",
      "customer",
      "initiative",
      "seat",
    ]);
    expect(crumbs[3]?.label).toBe("CEO / Strategist");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- src/jarvis/graph-scope.test.ts`

Expected: FAIL — `Cannot find module './graph-scope'`

- [ ] **Step 3: Write minimal implementation**

```ts
export type GraphScope = "agency" | "customer" | "initiative" | "seat";

export type GraphFocus = {
  scope: GraphScope;
  customer?: string;
  initiative?: string;
  seat?: string;
};

export type GraphClickNode = {
  kind: string;
  slug?: string;
};

export function parseInitiativeSlug(
  slug: string,
): { customer: string; initiative: string } | null {
  const i = slug.indexOf("/");
  if (i <= 0 || i === slug.length - 1) return null;
  return { customer: slug.slice(0, i), initiative: slug.slice(i + 1) };
}

export function nextGraphFocus(
  current: GraphFocus,
  node: GraphClickNode,
): GraphFocus | "open-work" | null {
  if (current.scope === "agency" && node.kind === "customer" && node.slug) {
    return { scope: "customer", customer: node.slug };
  }
  if (current.scope === "customer" && node.kind === "initiative" && node.slug) {
    const parsed = parseInitiativeSlug(node.slug);
    if (!parsed || parsed.customer !== current.customer) return null;
    return {
      scope: "initiative",
      customer: parsed.customer,
      initiative: parsed.initiative,
    };
  }
  if (current.scope === "initiative" && node.kind === "seat" && node.slug) {
    return {
      scope: "seat",
      customer: current.customer,
      initiative: current.initiative,
      seat: node.slug,
    };
  }
  if (
    current.scope === "seat" &&
    (node.kind === "handoff" ||
      node.kind === "run" ||
      node.kind === "deliverable" ||
      node.kind === "artifact" ||
      node.kind === "skill" ||
      node.kind === "phase")
  ) {
    return "open-work";
  }
  return null;
}

export function initiativeMocTitle(input: {
  initiativeName: string;
  customerName: string;
  uniqueInAgency: boolean;
}): string {
  if (input.uniqueInAgency) return input.initiativeName;
  return `${input.customerName} · ${input.initiativeName}`;
}

export type BreadcrumbCrumb = {
  scope: GraphScope;
  label: string;
  focus: GraphFocus;
};

export function breadcrumbTrail(
  focus: GraphFocus,
  names: {
    orgName: string;
    customerName?: string;
    initiativeName?: string;
    seatTitle?: string;
  },
): BreadcrumbCrumb[] {
  const crumbs: BreadcrumbCrumb[] = [
    { scope: "agency", label: names.orgName, focus: { scope: "agency" } },
  ];
  if (focus.customer && names.customerName) {
    crumbs.push({
      scope: "customer",
      label: names.customerName,
      focus: { scope: "customer", customer: focus.customer },
    });
  }
  if (focus.customer && focus.initiative && names.initiativeName) {
    crumbs.push({
      scope: "initiative",
      label: names.initiativeName,
      focus: {
        scope: "initiative",
        customer: focus.customer,
        initiative: focus.initiative,
      },
    });
  }
  if (focus.seat && names.seatTitle) {
    crumbs.push({
      scope: "seat",
      label: names.seatTitle,
      focus: { ...focus, scope: "seat" },
    });
  }
  return crumbs;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- src/jarvis/graph-scope.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/graph-scope.ts tools/org-command-center/src/jarvis/graph-scope.test.ts
git commit -m "feat(org-graph): add strict agency-to-seat focus helper"
```

---

### Task 2: Parse `ics_spawned` on handoffs

**Files:**
- Modify: `tools/org-command-center/src/lib/types.ts` (`HandoffRecord`)
- Modify: `tools/org-command-center/src/lib/parse-handoff.ts` (`parseHandoff`)
- Test: `tools/org-command-center/src/lib/parse-handoff.test.ts`

**Interfaces:**
- Consumes: existing `parseHandoff`
- Produces: `HandoffRecord.icsSpawned: string[]`

- [ ] **Step 1: Write the failing test** (append to `parse-handoff.test.ts`)

```ts
  it("parses ics_spawned list", () => {
    const h = parseHandoff(
      "1-manager-ceo-strategist.md",
      `---
phase: "1"
position: ceo-strategist
ics_spawned:
  - business-analyst
  - market-research-analyst
---
# Brief
`,
    );
    expect(h.icsSpawned).toEqual(["business-analyst", "market-research-analyst"]);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- src/lib/parse-handoff.test.ts`

Expected: FAIL — `icsSpawned` undefined

- [ ] **Step 3: Write minimal implementation**

Add to `HandoffRecord` in `types.ts` (after `position`):

```ts
  icsSpawned: string[];
```

In `parse-handoff.ts`, reuse `parsePathList` (already in file):

```ts
    icsSpawned: parsePathList(data.ics_spawned),
```

Add `icsSpawned: []` to every handoff factory in tests that construct a full `HandoffRecord` (search `HandoffRecord` / `handoff({` in `org-work-graph.test.ts` and other fixtures). The factory in `org-work-graph.test.ts` must include `icsSpawned: []` in its default object.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- src/lib/parse-handoff.test.ts src/jarvis/org-work-graph.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/lib/types.ts tools/org-command-center/src/lib/parse-handoff.ts tools/org-command-center/src/lib/parse-handoff.test.ts tools/org-command-center/src/jarvis/org-work-graph.test.ts
git commit -m "feat(org-graph): parse ics_spawned on handoff records"
```

---

### Task 3: Load work for one initiative path

**Files:**
- Create: `tools/org-command-center/server/initiative-work.ts`
- Test: `tools/org-command-center/server/initiative-work.test.ts`

**Interfaces:**
- Consumes: `indexHandoffs`, `listRuns`, `listReviewInbox`-style inbox parse
- Produces: `loadInitiativeWork(repoRoot, businessIdeaRel) => { handoffs, runs, inbox }`

- [ ] **Step 1: Write the failing test**

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { loadInitiativeWork } from "./initiative-work";

describe("loadInitiativeWork", () => {
  it("reads handoffs, runs, and inbox under a businessIdea path", () => {
    const root = join(tmpdir(), `init-work-${Date.now()}`);
    const idea = "docs/orgs/x/customers/c/initiatives/i/business-idea";
    mkdirSync(join(root, idea, "HANDOFFS"), { recursive: true });
    mkdirSync(join(root, idea, "DISPATCH", "runs"), { recursive: true });
    mkdirSync(join(root, idea, "REVIEW", "inbox"), { recursive: true });
    writeFileSync(
      join(root, idea, "HANDOFFS", "1-manager-ceo-strategist.md"),
      `---
phase: "1"
position: ceo-strategist
ics_spawned:
  - business-analyst
---
# Brief
`,
    );
    writeFileSync(
      join(root, idea, "DISPATCH", "runs", "1-ceo.json"),
      JSON.stringify({
        runId: "1-ceo",
        status: "completed",
        position: "ceo-strategist",
        phase: "1",
        claimed: "x.yaml",
        dispatch_filename: "x.yaml",
        wake_reason: "on_demand",
        started_at: "t",
        llm_model: "x",
      }),
    );
    writeFileSync(
      join(root, idea, "REVIEW", "inbox", "1-ceo-strategist-deliverable.md"),
      `---
position: ceo-strategist
phase: "1"
status: ready
---
# D
`,
    );
    const work = loadInitiativeWork(root, idea);
    expect(work.handoffs[0]?.position).toBe("ceo-strategist");
    expect(work.handoffs[0]?.icsSpawned).toEqual(["business-analyst"]);
    expect(work.runs[0]?.runId).toBe("1-ceo");
    expect(work.inbox[0]?.position).toBe("ceo-strategist");
  });

  it("returns empty lists when folders are missing", () => {
    const root = join(tmpdir(), `init-work-empty-${Date.now()}`);
    mkdirSync(root, { recursive: true });
    const work = loadInitiativeWork(root, "docs/missing");
    expect(work.handoffs).toEqual([]);
    expect(work.runs).toEqual([]);
    expect(work.inbox).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- server/initiative-work.test.ts`

Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```ts
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { indexHandoffs } from "../src/lib/parse-handoff";
import type { HandoffRecord } from "../src/lib/types";
import { listRuns } from "./runs-fs";
import type { RunRecord } from "../src/lib/runs";
import type { OrgWorkInboxItem } from "../src/jarvis/org-work-graph";

export type InitiativeWork = {
  handoffs: HandoffRecord[];
  runs: RunRecord[];
  inbox: OrgWorkInboxItem[];
};

function parseFrontmatter(raw: string): Record<string, string> {
  if (!raw.startsWith("---")) return {};
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = raw.slice(3, end).trim();
  const out: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

export function loadInitiativeWork(
  repoRoot: string,
  businessIdeaRel: string,
): InitiativeWork {
  const ideaAbs = join(repoRoot, businessIdeaRel);
  const hd = join(ideaAbs, "HANDOFFS");
  const handoffs = existsSync(hd)
    ? indexHandoffs(
        readdirSync(hd)
          .filter((n) => n.endsWith(".md") && n !== "README.md")
          .map((name) => ({
            name,
            content: readFileSync(join(hd, name), "utf8"),
          })),
      )
    : [];
  const runs = listRuns(join(ideaAbs, "DISPATCH", "runs"), 200);
  const inboxDir = join(ideaAbs, "REVIEW", "inbox");
  const inbox: OrgWorkInboxItem[] = [];
  if (existsSync(inboxDir)) {
    for (const filename of readdirSync(inboxDir)) {
      if (!filename.endsWith(".md")) continue;
      const abs = join(inboxDir, filename);
      if (!statSync(abs).isFile()) continue;
      const fm = parseFrontmatter(readFileSync(abs, "utf8"));
      inbox.push({
        filename,
        path: `${businessIdeaRel}/REVIEW/inbox/${filename}`,
        status: fm.status || "pending_review",
        position: fm.position,
        phase: fm.phase,
        goal: fm.goal,
      });
    }
  }
  return { handoffs, runs, inbox };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- server/initiative-work.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/server/initiative-work.ts tools/org-command-center/server/initiative-work.test.ts
git commit -m "feat(org-graph): load handoffs runs inbox per initiative path"
```

---

### Task 4: Agency-scoped graph (structure only)

**Files:**
- Modify: `tools/org-command-center/src/jarvis/org-work-graph.ts`
- Test: `tools/org-command-center/src/jarvis/org-work-graph.test.ts`

**Interfaces:**
- Consumes: `GraphScope` from `graph-scope.ts`; existing `buildOrgWorkGraph`
- Produces: `ScopedGraphInput`, `buildScopedOrgGraph()` — agency branch

- [ ] **Step 1: Write the failing test** (append)

```ts
import { buildScopedOrgGraph } from "./org-work-graph";

describe("buildScopedOrgGraph agency", () => {
  it("has agency, customers, initiatives, and no work nodes", () => {
    const g = buildScopedOrgGraph({
      scope: "agency",
      orgSlug: "velocity-agency",
      orgName: "Velocity Agency",
      org,
      initiatives: [
        {
          customer: "blacksage-kennels",
          customerName: "Blacksage Kennels",
          initiative: "main",
          initiativeName: "Main",
          uniqueInAgency: false,
        },
        {
          customer: "blacksage-kennels",
          customerName: "Blacksage Kennels",
          initiative: "sieger-show-secretary",
          initiativeName: "Sieger Show Secretary",
          uniqueInAgency: true,
        },
      ],
    });
    expect(g.nodes.some((n) => n.kind === "agency")).toBe(true);
    expect(g.nodes.filter((n) => n.kind === "customer")).toHaveLength(1);
    expect(g.nodes.filter((n) => n.kind === "initiative")).toHaveLength(2);
    expect(g.nodes.some((n) => n.kind === "handoff")).toBe(false);
    expect(g.nodes.some((n) => n.kind === "seat")).toBe(false);
    expect(g.edges.some((e) => e.kind === "serves")).toBe(true);
    expect(g.edges.some((e) => e.kind === "owns")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- src/jarvis/org-work-graph.test.ts`

Expected: FAIL — `buildScopedOrgGraph` is not exported

- [ ] **Step 3: Write minimal implementation**

Add to `org-work-graph.ts`:

```ts
import type { GraphScope } from "./graph-scope";

export type ScopedInitiativeInput = {
  customer: string;
  customerName: string;
  initiative: string;
  initiativeName: string;
  uniqueInAgency: boolean;
  work?: OrgWorkGraph;
};

export type ScopedGraphInput = {
  scope: GraphScope;
  orgSlug: string;
  orgName: string;
  org: OrgRegistry;
  customer?: string;
  initiative?: string;
  seat?: string;
  initiatives: ScopedInitiativeInput[];
};

export function buildScopedOrgGraph(input: ScopedGraphInput): OrgWorkGraph {
  if (input.scope === "agency") return buildAgencyGraph(input);
  if (input.scope === "customer") return buildCustomerGraph(input);
  if (input.scope === "initiative") return buildInitiativeGraph(input);
  return buildSeatEgoGraph(input);
}

function buildAgencyGraph(input: ScopedGraphInput): OrgWorkGraph {
  // Same node/edge construction as today's buildPortfolioWorkGraph
  // agency → customer (serves) → initiative (owns).
  // Do NOT attach workGraph or work_summary nodes.
  // Initiative node slug MUST be `${customer}/${initiative}`.
}
```

For this task, `buildCustomerGraph` / `buildInitiativeGraph` / `buildSeatEgoGraph` may throw `new Error("not implemented")` — only agency must pass. Copy the agency/customer/initiative layout loop from `buildPortfolioWorkGraph` (lines 109–169) and stop before the `isActive && workGraph` block.

Add `skill` to `OrgWorkNodeKind` and `KIND_META` (`{ label: "Skill", color: "#c792ea" }` is already used for artifact — use `#e1bee7` for skill). Add edge kinds `spawned`, `related_handoff`, `reviewed_by`, `uses_skill` to `OrgWorkEdgeKind`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- src/jarvis/org-work-graph.test.ts`

Expected: PASS (existing portfolio tests still pass; new agency test passes)

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/org-work-graph.ts tools/org-command-center/src/jarvis/org-work-graph.test.ts
git commit -m "feat(org-graph): build agency scope without work nodes"
```

---

### Task 5: Customer and initiative scopes

**Files:**
- Modify: `tools/org-command-center/src/jarvis/org-work-graph.ts`
- Test: `tools/org-command-center/src/jarvis/org-work-graph.test.ts`

**Interfaces:**
- Consumes: `buildOrgWorkGraph`, `ScopedGraphInput.work`
- Produces: customer graph (all that customer’s initiative work) and initiative graph (one work graph, seats labeled)

- [ ] **Step 1: Write the failing test**

```ts
describe("buildScopedOrgGraph customer / initiative", () => {
  it("customer includes work from every initiative under that customer only", () => {
    const sieger = buildOrgWorkGraph({ org, handoffs: [], runs: [], inbox: [] });
    const g = buildScopedOrgGraph({
      scope: "customer",
      orgSlug: "velocity-agency",
      orgName: "Velocity Agency",
      org,
      customer: "blacksage-kennels",
      initiatives: [
        {
          customer: "blacksage-kennels",
          customerName: "Blacksage Kennels",
          initiative: "sieger-show-secretary",
          initiativeName: "Sieger Show Secretary",
          uniqueInAgency: true,
          work: sieger,
        },
        {
          customer: "passive-grid",
          customerName: "Passive Grid",
          initiative: "main",
          initiativeName: "Main",
          uniqueInAgency: false,
          work: sieger,
        },
      ],
    });
    expect(g.nodes.some((n) => n.kind === "seat")).toBe(true);
    expect(g.nodes.some((n) => n.id.includes("passive-grid"))).toBe(false);
    expect(g.nodes.some((n) => n.kind === "initiative" && n.slug === "blacksage-kennels/sieger-show-secretary")).toBe(true);
  });

  it("initiative excludes other initiatives", () => {
    const work = buildOrgWorkGraph({ org, handoffs: [], runs: [], inbox: [] });
    const g = buildScopedOrgGraph({
      scope: "initiative",
      orgSlug: "velocity-agency",
      orgName: "Velocity Agency",
      org,
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
      initiatives: [
        {
          customer: "blacksage-kennels",
          customerName: "Blacksage Kennels",
          initiative: "sieger-show-secretary",
          initiativeName: "Sieger Show Secretary",
          uniqueInAgency: true,
          work,
        },
        {
          customer: "blacksage-kennels",
          customerName: "Blacksage Kennels",
          initiative: "main",
          initiativeName: "Main",
          uniqueInAgency: false,
          work,
        },
      ],
    });
    expect(g.nodes.filter((n) => n.kind === "initiative")).toHaveLength(1);
    expect(g.nodes.some((n) => n.slug === "blacksage-kennels/main")).toBe(false);
    expect(g.nodes.some((n) => n.kind === "seat")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- src/jarvis/org-work-graph.test.ts`

Expected: FAIL — `not implemented`

- [ ] **Step 3: Write minimal implementation**

`buildCustomerGraph`: filter `input.initiatives` to `input.customer`. Create customer + those initiative nodes. For each initiative with `work`, namespace work node ids as `${initiativeId}:${n.id}` (same as current `buildPortfolioWorkGraph` lines 171–188) and `runs` edges from initiative → seat nodes.

`buildInitiativeGraph`: filter to the single `customer` + `initiative`. Attach that `work` graph the same way. If `work` is missing, return structure + empty work.

Keep `buildSeatEgoGraph` throwing until Task 6.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- src/jarvis/org-work-graph.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/org-work-graph.ts tools/org-command-center/src/jarvis/org-work-graph.test.ts
git commit -m "feat(org-graph): expand customer and initiative work scopes"
```

---

### Task 6: Seat ego-network

**Files:**
- Modify: `tools/org-command-center/src/jarvis/org-work-graph.ts`
- Test: `tools/org-command-center/src/jarvis/org-work-graph.test.ts`

**Interfaces:**
- Consumes: `HandoffRecord.icsSpawned`, `HandoffRecord.packsUsed`, `HandoffRecord.kind`, roster, `parsePositionPacks` (optional; packsUsed is enough if skill files are not in the test)
- Produces: `buildSeatEgoGraph` via `buildScopedOrgGraph({ scope: "seat", seat })`

- [ ] **Step 1: Write the failing test**

```ts
describe("buildScopedOrgGraph seat ego", () => {
  it("includes spawned IC, related handoff, skill, phase; excludes unrelated same-phase seat", () => {
    const work = buildOrgWorkGraph({
      org,
      handoffs: [
        handoff({
          filename: "1-manager-ceo-strategist.md",
          kind: "manager",
          position: "ceo-strategist",
          phase: "1",
          icsSpawned: ["business-analyst"],
          packsUsed: ["skills/org/positions/ceo-strategist/SKILL.md"],
        }),
        handoff({
          filename: "1-business-analyst.md",
          position: "business-analyst",
          phase: "1",
        }),
        handoff({
          filename: "1-csuite-review.md",
          kind: "csuite",
          position: "ceo-strategist",
          phase: "1",
        }),
        handoff({
          filename: "1-manager-cmo.md",
          kind: "manager",
          position: "cmo",
          phase: "1",
        }),
      ],
      runs: [],
      inbox: [],
    });
    const g = buildScopedOrgGraph({
      scope: "seat",
      orgSlug: "velocity-agency",
      orgName: "Velocity Agency",
      org,
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
      seat: "ceo-strategist",
      initiatives: [
        {
          customer: "blacksage-kennels",
          customerName: "Blacksage Kennels",
          initiative: "sieger-show-secretary",
          initiativeName: "Sieger Show Secretary",
          uniqueInAgency: true,
          work,
        },
      ],
    });
    const ids = g.nodes.map((n) => n.id);
    expect(ids.some((id) => id.includes("seat:ceo-strategist"))).toBe(true);
    expect(ids.some((id) => id.includes("seat:business-analyst"))).toBe(true);
    expect(ids.some((id) => id.includes("1-business-analyst"))).toBe(true);
    expect(ids.some((id) => id.includes("1-csuite-review"))).toBe(true);
    expect(ids.some((id) => nKind(g, id) === "skill")).toBe(true);
    expect(ids.some((id) => id.includes("seat:cmo"))).toBe(false);
    expect(g.edges.some((e) => e.kind === "spawned")).toBe(true);
    expect(g.edges.some((e) => e.kind === "related_handoff")).toBe(true);
    expect(g.edges.some((e) => e.kind === "reviewed_by")).toBe(true);
    expect(g.edges.some((e) => e.kind === "uses_skill")).toBe(true);
  });
});

function nKind(g: ReturnType<typeof buildScopedOrgGraph>, id: string) {
  return g.nodes.find((n) => n.id === id)?.kind;
}
```

Update the `handoff()` factory default with `icsSpawned: []` if Task 2 did not already.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- src/jarvis/org-work-graph.test.ts`

Expected: FAIL — seat builder not implemented or CMO leaked in

- [ ] **Step 3: Write minimal implementation**

`buildSeatEgoGraph(input)`:

1. Find the initiative entry; require `work` and `input.seat`.
2. Collect keep-set:
   - `seat:${input.seat}`
   - work nodes in `work` whose `slug === input.seat`
   - for each manager/other handoff of that seat with `icsSpawned`: add `seat:${ic}` and `handoff:<matching ic filename>` (same phase, position === ic)
   - csuite handoffs with same `phase` as this seat’s packets (`kind === "csuite"`)
   - `phase:${phase}` for those packets
   - skill nodes: one per `packsUsed` entry plus `skills/org/positions/${seat}/SKILL.md` (id `skill:${slugFromPath(path)}`, kind `skill`, label = last path segment)
3. Copy kept nodes (re-id with initiative prefix like other scopes). Drop any seat not in the keep-set (this excludes CMO).
4. Copy `work.edges` whose both ends are kept.
5. Add `spawned` (manager seat → IC seat), `related_handoff` (manager handoff ↔ IC handoff), `reviewed_by` (this seat’s handoff → csuite handoff), `uses_skill` (seat or handoff → skill).
6. Always include `reports_to` if the manager seat is in the keep-set (CEO has empty reportsTo — fine). If `reportsTo` is set and that manager is on the roster, include that manager seat + the edge even if they have no work in the keep-set.

`slugFromPath("skills/org/positions/ceo-strategist/SKILL.md")` → `ceo-strategist`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- src/jarvis/org-work-graph.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/org-work-graph.ts tools/org-command-center/src/jarvis/org-work-graph.test.ts
git commit -m "feat(org-graph): build seat ego-network without phase peers"
```

---

### Task 7: API four scopes and 404s

**Files:**
- Modify: `tools/org-command-center/server/api.ts` (`GET /api/org-work-graph`, ~661–714)
- Modify: `tools/org-command-center/src/api/client.ts` (`fetchOrgWorkGraph`)
- Test: add `tools/org-command-center/server/org-work-graph-api.test.ts` **or** extend an existing API test if one already boots `createApi`. If no lightweight API test harness exists, test a extracted helper instead:

Create `tools/org-command-center/server/org-work-graph-query.ts` with `parseOrgWorkGraphQuery(url: URL): GraphFocus | { error: string }` and test that. `createApi` calls it.

**Interfaces:**
- Consumes: `buildScopedOrgGraph`, `loadInitiativeWork`, `loadRegistry`, `parseOrgRegistry`
- Produces: `GET /api/org-work-graph?scope=&customer=&initiative=&seat=`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { parseOrgWorkGraphQuery } from "./org-work-graph-query";

describe("parseOrgWorkGraphQuery", () => {
  it("defaults to agency", () => {
    expect(parseOrgWorkGraphQuery(new URL("http://x/api/org-work-graph"))).toEqual({
      scope: "agency",
    });
  });

  it("rejects initiative without customer", () => {
    const r = parseOrgWorkGraphQuery(
      new URL("http://x/api/org-work-graph?scope=initiative"),
    );
    expect(r).toEqual({ error: "customer and initiative are required for scope=initiative" });
  });

  it("rejects legacy portfolio as unknown scope", () => {
    const r = parseOrgWorkGraphQuery(
      new URL("http://x/api/org-work-graph?scope=portfolio"),
    );
    expect(r).toEqual({ error: "scope must be agency, customer, initiative, or seat" });
  });

  it("parses seat focus", () => {
    expect(
      parseOrgWorkGraphQuery(
        new URL(
          "http://x/api/org-work-graph?scope=seat&customer=blacksage-kennels&initiative=sieger-show-secretary&seat=ceo-strategist",
        ),
      ),
    ).toEqual({
      scope: "seat",
      customer: "blacksage-kennels",
      initiative: "sieger-show-secretary",
      seat: "ceo-strategist",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- server/org-work-graph-query.test.ts`

Expected: FAIL — module not found

- [ ] **Step 3: Write parser + wire API**

`org-work-graph-query.ts`:

```ts
import type { GraphFocus, GraphScope } from "../src/jarvis/graph-scope";

const SCOPES: GraphScope[] = ["agency", "customer", "initiative", "seat"];

export function parseOrgWorkGraphQuery(
  url: URL,
): GraphFocus | { error: string } {
  const raw = (url.searchParams.get("scope") || "agency").toLowerCase();
  if (!SCOPES.includes(raw as GraphScope)) {
    return { error: "scope must be agency, customer, initiative, or seat" };
  }
  const scope = raw as GraphScope;
  const customer = url.searchParams.get("customer") || undefined;
  const initiative = url.searchParams.get("initiative") || undefined;
  const seat = url.searchParams.get("seat") || undefined;
  if (scope === "customer" && !customer) {
    return { error: "customer is required for scope=customer" };
  }
  if ((scope === "initiative" || scope === "seat") && (!customer || !initiative)) {
    return { error: `customer and initiative are required for scope=${scope}` };
  }
  if (scope === "seat" && !seat) {
    return { error: "seat is required for scope=seat" };
  }
  return { scope, customer, initiative, seat };
}
```

Replace `GET /api/org-work-graph` in `api.ts`:

1. `parseOrgWorkGraphQuery(new URL(c.req.url, "http://local"))`
2. On `{ error }`, return `c.json({ ok: false, error }, 404)`
3. `loadRegistry` → active org entry. If `customer` / `initiative` / `seat` not in that org, 404 `{ ok: false, error: "unknown customer" }` (or initiative/seat).
4. Build `initiatives[]`: for each customer/initiative in the **active org**, set `uniqueInAgency` by counting initiative **names**. When `scope` is `customer`/`initiative`/`seat`, call `loadInitiativeWork(repoRoot, entry.businessIdea)` and `buildOrgWorkGraph({ org: snap.org, ...work })` for those initiatives that are needed (agency: skip work loads).
5. `buildScopedOrgGraph({ ... })`
6. `void import("./obsidian/vault-graph-sync").then((m) => m.syncVaultGraph(repoRoot, graph, { orgSlug, orgName, initiatives })).catch((err) => console.warn("[vault-graph-sync]", err))` — only after Task 8 exists; for this task leave a `// sync hooked in Task 11` comment and skip the import so this commit stays green.
7. Return `{ ok: true, scope, graph }`

`fetchOrgWorkGraph` in `client.ts`:

```ts
export async function fetchOrgWorkGraph(
  focus: import("../jarvis/graph-scope").GraphFocus = { scope: "agency" },
): Promise<import("../jarvis/org-work-graph").OrgWorkGraph> {
  const q = new URLSearchParams({ scope: focus.scope });
  if (focus.customer) q.set("customer", focus.customer);
  if (focus.initiative) q.set("initiative", focus.initiative);
  if (focus.seat) q.set("seat", focus.seat);
  const res = await fetch(`/api/org-work-graph?${q}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "org work graph failed");
  return data.graph;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- server/org-work-graph-query.test.ts src/jarvis/org-work-graph.test.ts`

Expected: PASS. Then `npm run typecheck` — fix `SituationRoom.tsx` `fetchOrgWorkGraph()` call to `fetchOrgWorkGraph({ scope: "agency" })` if the default still typechecks (it should).

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/server/org-work-graph-query.ts tools/org-command-center/server/org-work-graph-query.test.ts tools/org-command-center/server/api.ts tools/org-command-center/src/api/client.ts tools/org-command-center/src/jarvis/SituationRoom.tsx
git commit -m "feat(org-graph): serve four graph scopes and reject skips"
```

---

### Task 8: Vault MOC writer

**Files:**
- Create: `tools/org-command-center/server/obsidian/vault-graph-sync.ts`
- Test: `tools/org-command-center/server/obsidian/vault-graph-sync.test.ts`

**Interfaces:**
- Consumes: `OrgWorkGraph`, `initiativeMocTitle`, `GraphFocus` names
- Produces: `writeGraphMocs(repoRoot, input)`, `seatMocTitle(seatTitle, initiativeTitle)`

- [ ] **Step 1: Write the failing test**

```ts
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { seatMocTitle, writeGraphMocs } from "./vault-graph-sync";

describe("writeGraphMocs", () => {
  it("writes agency, customer, initiative, and per-initiative seat notes", () => {
    const root = mkdtempSync(join(tmpdir(), "vault-graph-"));
    writeGraphMocs(root, {
      orgName: "Velocity Agency",
      customers: [
        {
          name: "Blacksage Kennels",
          initiatives: [
            {
              title: "Sieger Show Secretary",
              seats: [{ title: "CEO / Strategist", links: ["[[1-manager-ceo-strategist]]"] }],
            },
            {
              title: "Blacksage Kennels · Main",
              seats: [{ title: "CEO / Strategist", links: [] }],
            },
          ],
        },
      ],
    });
    const agency = readFileSync(join(root, "memorybank/org/GRAPH/Velocity Agency.md"), "utf8");
    expect(agency).toContain("[[Blacksage Kennels]]");
    const siegerSeat = readFileSync(
      join(root, "memorybank/org/GRAPH/seats/CEO / Strategist — Sieger Show Secretary.md"),
      "utf8",
    );
    expect(siegerSeat).toContain("[[1-manager-ceo-strategist]]");
    const mainSeat = readFileSync(
      join(root, "memorybank/org/GRAPH/seats/CEO / Strategist — Blacksage Kennels · Main.md"),
      "utf8",
    );
    expect(mainSeat).not.toContain("[[1-manager-ceo-strategist]]");
    expect(seatMocTitle("CEO / Strategist", "Sieger Show Secretary")).toBe(
      "CEO / Strategist — Sieger Show Secretary",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- server/obsidian/vault-graph-sync.test.ts`

Expected: FAIL — module not found

- [ ] **Step 3: Write minimal implementation**

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function seatMocTitle(seatTitle: string, initiativeTitle: string): string {
  return `${seatTitle} — ${initiativeTitle}`;
}

export type MocSeat = { title: string; links: string[] };
export type MocInitiative = { title: string; seats: MocSeat[] };
export type MocCustomer = { name: string; initiatives: MocInitiative[] };
export type MocInput = { orgName: string; customers: MocCustomer[] };

function writeNote(abs: string, body: string) {
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body.endsWith("\n") ? body : `${body}\n`);
}

export function writeGraphMocs(repoRoot: string, input: MocInput) {
  const base = join(repoRoot, "memorybank/org/GRAPH");
  writeNote(
    join(base, `${input.orgName}.md`),
    `# ${input.orgName}\n\n## Customers\n\n${input.customers.map((c) => `- [[${c.name}]]`).join("\n")}\n`,
  );
  for (const c of input.customers) {
    writeNote(
      join(base, `${c.name}.md`),
      `# ${c.name}\n\n## Initiatives\n\n${c.initiatives.map((i) => `- [[${i.title}]]`).join("\n")}\n`,
    );
    for (const i of c.initiatives) {
      writeNote(
        join(base, `${i.title}.md`),
        `# ${i.title}\n\n## Seats\n\n${i.seats.map((s) => `- [[${seatMocTitle(s.title, i.title)}]]`).join("\n")}\n`,
      );
      for (const s of i.seats) {
        writeNote(
          join(base, "seats", `${seatMocTitle(s.title, i.title)}.md`),
          `# ${seatMocTitle(s.title, i.title)}\n\n${s.links.map((l) => `- ${l}`).join("\n")}\n`,
        );
      }
    }
  }
}
```

Also write `skills/<slug>.md` and `phases/Phase <n> — <initiativeTitle>.md` when `MocInput` is later extended in Task 9. For this task, seats + hierarchy is enough.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- server/obsidian/vault-graph-sync.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/server/obsidian/vault-graph-sync.ts tools/org-command-center/server/obsidian/vault-graph-sync.test.ts
git commit -m "feat(org-graph): write per-initiative vault graph MOCs"
```

---

### Task 9: Work-note footers (idempotent)

**Files:**
- Modify: `tools/org-command-center/server/obsidian/vault-graph-sync.ts`
- Test: `tools/org-command-center/server/obsidian/vault-graph-sync.test.ts`

**Interfaces:**
- Consumes: file contents, wiki-link list
- Produces: `upsertGraphFooter(markdown, links: string[]): string`, `FOOTER_START`, `FOOTER_END`

- [ ] **Step 1: Write the failing test**

```ts
import { upsertGraphFooter } from "./vault-graph-sync";

describe("upsertGraphFooter", () => {
  it("appends a footer and is idempotent", () => {
    const body = "---\nphase: \"1\"\n---\n# Brief\n\nHello\n";
    const links = [
      "[[Sieger Show Secretary]]",
      "[[CEO / Strategist — Sieger Show Secretary]]",
    ];
    const once = upsertGraphFooter(body, links);
    const twice = upsertGraphFooter(once, links);
    expect(once).toContain("<!-- graph:start -->");
    expect(once).toContain("[[Sieger Show Secretary]]");
    expect(twice).toBe(once);
    expect(once.startsWith("---\nphase:")).toBe(true);
  });

  it("replaces an existing footer when links change", () => {
    const first = upsertGraphFooter("# A\n", ["[[Old]]"]);
    const next = upsertGraphFooter(first, ["[[New]]"]);
    expect(next).toContain("[[New]]");
    expect(next).not.toContain("[[Old]]");
    expect(next.split("<!-- graph:start -->")).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- server/obsidian/vault-graph-sync.test.ts`

Expected: FAIL — `upsertGraphFooter` not exported

- [ ] **Step 3: Write minimal implementation**

```ts
export const FOOTER_START = "<!-- graph:start -->";
export const FOOTER_END = "<!-- graph:end -->";

export function upsertGraphFooter(markdown: string, links: string[]): string {
  const block = `${FOOTER_START}\n${links.join(" · ")}\n${FOOTER_END}\n`;
  const re = new RegExp(
    `${FOOTER_START.replace(/[<>!-]/g, "\\$&")}[\\s\\S]*?${FOOTER_END.replace(/[<>!-]/g, "\\$&")}\\n?`,
  );
  if (re.test(markdown)) return markdown.replace(re, block);
  const trimmed = markdown.endsWith("\n") ? markdown : `${markdown}\n`;
  return `${trimmed}\n${block}`;
}
```

Add `applyFooters(repoRoot, files: { abs: string; links: string[] }[])` that `readFileSync` / `writeFileSync` each existing file and skips missing paths.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- server/obsidian/vault-graph-sync.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/server/obsidian/vault-graph-sync.ts tools/org-command-center/server/obsidian/vault-graph-sync.test.ts
git commit -m "feat(org-graph): upsert idempotent wiki-link footers on work notes"
```

---

### Task 10: Control Center drill-down UI

**Files:**
- Modify: `tools/org-command-center/src/jarvis/hud/OrgWorkGraphView.tsx`
- Modify: `tools/org-command-center/src/jarvis/hud/theme.css` (breadcrumb + zoom)
- Modify: `tools/org-command-center/src/jarvis/SituationRoom.tsx` (`openGraph`, drawer)
- Test: `tools/org-command-center/src/jarvis/hud/OrgWorkGraphView.test.ts` — test a extracted `labelKindsForScope(scope)` plus reuse `nextGraphFocus` (do not require a full React RTL harness if the project has none). If `vitest` + `@testing-library/react` is already a dependency, render the breadcrumb; otherwise keep the helper test.

**Interfaces:**
- Consumes: `GraphFocus`, `nextGraphFocus`, `breadcrumbTrail`, `fetchOrgWorkGraph(focus)`
- Produces: clickable breadcrumb; node click calls `onFocus` or `onOpenWork`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { labelKindsForScope } from "./graph-labels";

describe("labelKindsForScope", () => {
  it("labels customers and initiatives on agency", () => {
    expect(labelKindsForScope("agency")).toEqual(["agency", "customer", "initiative"]);
  });
  it("labels seats on initiative", () => {
    expect(labelKindsForScope("initiative")).toContain("seat");
  });
});
```

Create `graph-labels.ts` in the same folder in Step 3.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- src/jarvis/hud/graph-labels.test.ts`

Expected: FAIL — module not found

- [ ] **Step 3: Implement labels + view + SituationRoom**

`graph-labels.ts`:

```ts
import type { GraphScope } from "../graph-scope";
import type { OrgWorkNodeKind } from "../org-work-graph";

export function labelKindsForScope(scope: GraphScope): OrgWorkNodeKind[] {
  if (scope === "agency") return ["agency", "customer", "initiative"];
  if (scope === "customer") return ["customer", "initiative", "seat"];
  if (scope === "initiative") return ["initiative", "seat"];
  return ["seat", "handoff", "run", "deliverable", "skill", "phase"];
}
```

`OrgWorkGraphView` props become:

```ts
{
  graph: OrgWorkGraph;
  focus: GraphFocus;
  crumbs: BreadcrumbCrumb[];
  onFocus: (focus: GraphFocus) => void;
  onOpenWork?: (slug?: string) => void;
}
```

On node click: `const next = nextGraphFocus(focus, n); if (next === "open-work") onOpenWork?.(n.slug); else if (next) onFocus(next);`

Render crumbs as buttons. Label a node when `labelKindsForScope(focus.scope).includes(n.kind)`.

Zoom/pan: keep it CSS-simple — wrap the SVG in `div.j-org-work-viewport` with `overflow: auto; max-height: 620px` and set SVG `width={width * 1.4}` on customer/initiative so the user can scroll. No extra library.

`SituationRoom`:

```ts
const [graphFocus, setGraphFocus] = useState<GraphFocus>({ scope: "agency" });

async function openGraph() {
  setDrawer("graph");
  setGraphFocus({ scope: "agency" });
  setOrgWorkGraph(await fetchOrgWorkGraph({ scope: "agency" }));
}

async function onGraphFocus(next: GraphFocus) {
  setGraphFocus(next);
  setOrgWorkGraph(await fetchOrgWorkGraph(next));
}
```

Pass `crumbs={breadcrumbTrail(graphFocus, { orgName, customerName, initiativeName, seatTitle })}` using names already on `customers` / roster in SituationRoom state.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd tools/org-command-center && npm test -- src/jarvis/hud/graph-labels.test.ts src/jarvis/graph-scope.test.ts && npm run typecheck`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/src/jarvis/hud/OrgWorkGraphView.tsx tools/org-command-center/src/jarvis/hud/graph-labels.ts tools/org-command-center/src/jarvis/hud/graph-labels.test.ts tools/org-command-center/src/jarvis/hud/theme.css tools/org-command-center/src/jarvis/SituationRoom.tsx
git commit -m "feat(org-graph): drill Knowledge graph agency to seat"
```

---

### Task 11: Hook vault sync + README

**Files:**
- Modify: `tools/org-command-center/server/obsidian/vault-graph-sync.ts` — add `syncVaultGraph(repoRoot, graph, meta)`
- Modify: `tools/org-command-center/server/obsidian/index.ts` — export `syncVaultGraph`
- Modify: `tools/org-command-center/server/api.ts` — fire-and-forget after GET
- Modify: `tools/org-command-center/server/jarvis/tools-exec.ts` — after successful `obsidian.sync`, call `syncVaultGraph`
- Modify: `tools/org-command-center/README.md` — Knowledge graph paragraph
- Test: extend `vault-graph-sync.test.ts` with `syncVaultGraph` writing one footer on a real temp handoff path

**Interfaces:**
- Consumes: `writeGraphMocs`, `upsertGraphFooter`, `OrgWorkGraph`
- Produces: `syncVaultGraph(repoRoot, graph, meta): { mocCount: number; footers: number; skipped: string[] }`

- [ ] **Step 1: Write the failing test**

```ts
it("syncVaultGraph writes MOCs and a footer on an existing handoff", () => {
  const root = mkdtempSync(join(tmpdir(), "vault-sync-"));
  const handoffAbs = join(
    root,
    "memorybank/org/velocity-agency/c/i/HANDOFFS/1-manager-ceo-strategist.md",
  );
  mkdirSync(dirname(handoffAbs), { recursive: true });
  writeFileSync(handoffAbs, "# Brief\n");
  const result = syncVaultGraph(
    root,
    {
      nodes: [
        {
          id: "handoff:1-manager-ceo-strategist.md",
          kind: "handoff",
          label: "1-manager-ceo-strategist",
          slug: "ceo-strategist",
          x: 0,
          y: 0,
        },
      ],
      edges: [],
      legend: [],
      stats: { seatCount: 0, workCount: 1, edgeCount: 0 },
    },
    {
      orgName: "Velocity Agency",
      customers: [
        {
          name: "C",
          initiatives: [
            {
              title: "I",
              seats: [
                {
                  title: "CEO / Strategist",
                  links: ["[[1-manager-ceo-strategist]]"],
                  handoffAbsPaths: [handoffAbs],
                },
              ],
            },
          ],
        },
      ],
    },
  );
  expect(result.footers).toBe(1);
  expect(readFileSync(handoffAbs, "utf8")).toContain("<!-- graph:start -->");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd tools/org-command-center && npm test -- server/obsidian/vault-graph-sync.test.ts`

Expected: FAIL — `syncVaultGraph` not found

- [ ] **Step 3: Implement `syncVaultGraph` and hook it**

`syncVaultGraph` calls `writeGraphMocs` then `applyFooters` for each `handoffAbsPaths` (skip if `!existsSync`). Never throw to the caller — collect `skipped`.

In `api.ts` after building the graph (any scope):

```ts
void syncVaultGraph(repoRoot, graph, mocMetaFromRegistry(reg, graph)).catch((err) => {
  console.warn("[vault-graph-sync]", err);
});
```

Build `mocMetaFromRegistry` in `vault-graph-sync.ts` from registry + graph nodes (map seat slugs to titles via `snap.org.roster`).

In `tools-exec.ts` `case "obsidian.sync"`: after SoT link, call `syncVaultGraph` with a freshly built agency graph (or skip graph build and only refresh MOCs from registry structure). Prefer: load registry + `buildScopedOrgGraph({ scope: "agency", ... })` so Obsidian always has the agency tree even if OCC was not opened.

README: replace the Knowledge graph / Graphify sentence with:

```md
Knowledge graph (Intelligence menu) is the live org graph: Agency → Customer → Initiative → Seat.
Obsidian edges come from generated `memorybank/org/GRAPH/` notes plus work-note footers.
Graphify (`graph.html`) remains the code/AST map for Jarvis `graph.*` tools.
```

- [ ] **Step 4: Run tests**

Run: `cd tools/org-command-center && npm test -- server/obsidian/vault-graph-sync.test.ts server/org-work-graph-query.test.ts src/jarvis/org-work-graph.test.ts src/jarvis/graph-scope.test.ts && npm run typecheck`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tools/org-command-center/server/obsidian/vault-graph-sync.ts tools/org-command-center/server/obsidian/vault-graph-sync.test.ts tools/org-command-center/server/obsidian/index.ts tools/org-command-center/server/api.ts tools/org-command-center/server/jarvis/tools-exec.ts tools/org-command-center/README.md
git commit -m "feat(org-graph): sync vault MOCs when the graph loads"
```

---

## Self-review (spec coverage)

| Spec requirement | Task |
|------------------|------|
| Four scopes, open at agency | 1, 4, 7, 10 |
| Strict 1→2→3→4, breadcrumb up | 1, 10 |
| Agency has no work nodes | 4 |
| Customer = all that org’s work | 5, 7 |
| Initiative clustered by seat | 5 |
| Seat ego-network edge set | 6 |
| No same-phase peers / no cross-initiative | 6 |
| API 404s / no `portfolio` default | 7 |
| `skill` node kind + new edges | 4, 6 |
| Per-initiative seat MOCs | 8 |
| Unique `Main` titles | 1, 8 |
| Footer markers only | 9 |
| Sync on GET (non-blocking) + `obsidian.sync` | 11 |
| Graphify unchanged | 11 (README) |
| Zoom/pan on large customer/initiative | 10 (scroll viewport) |
| Labels at current level | 10 |
| Superpatch not a v1 holding root | 7 (active org only) |

No TBD placeholders. Types: `GraphFocus.scope` is `GraphScope`; initiative node `slug` is always `customer/initiative`; `HandoffRecord.icsSpawned` is the only new handoff field.
