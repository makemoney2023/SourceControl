# Design: Hierarchical Org Graph (OCC + Obsidian)

**Date:** 2026-08-14  
**Status:** Approved for planning  
**Approach:** Shared graph SSOT + four scoped views + generated vault MOCs  
**App:** `tools/org-command-center/`  
**Related:** [Org work graph](./2026-08-06-org-work-graph-design.md), [Agency → Customer → Initiative](./2026-08-06-agency-customer-initiative-design.md)

## Jobs to be done

| Job | Outcome |
|-----|---------|
| See Velocity Agency as a whole | Agency graph: customers and initiatives, with edges |
| See one customer/org | All of that customer’s initiatives and all their work |
| See one initiative | All work clustered by seat |
| See one seat’s work | Ego-network: that seat’s work plus the seats, handoffs, skills, and phase it actually touched |
| Same story in Obsidian | Native graph view shows the same hierarchy and seat edges via `[[wiki links]]` |

## Problem

Obsidian’s graph shows isolated nodes because vault notes have no wiki links. The Control Center Knowledge graph already builds nodes and edges, but the UI is a static SVG: it always loads the portfolio dump, expands only the active initiative, has no breadcrumb drill-down, and click always opens a seat. Graphify (`graph.html`) stays a code/AST map and is out of this feature.

## Hierarchy (strict 1 → 2 → 3 → 4)

| Level | Scope | Visible nodes | Click |
|-------|-------|---------------|-------|
| 1 | Agency | Agency, customers, initiatives | Customer → level 2 |
| 2 | Customer | That customer, its initiatives, all work under those initiatives | Initiative → level 3 |
| 3 | Initiative | That initiative, seats, that initiative’s work (clustered by seat) | Seat → level 4 |
| 4 | Seat | Ego-network around that seat (see Seat edges) | Work node → open note / seat console; scope stays 4 |

Breadcrumb is the only up-navigation (4 → 3 → 2 → 1). The UI and API refuse skips (Agency cannot open an initiative or seat). Knowledge graph always opens at level 1 for the active agency.

v1 ships the active agency only (Velocity Agency). There is no holding-company root above agencies. Superpatch uses this same four-level model when it is the active org; that is not a v1 deliverable.

## Surfaces (both first-class)

1. **Control Center** — Situation Room → Intelligence → Knowledge graph (`OrgWorkGraphView`).
2. **Obsidian** — vault at `memorybank/`. Generated notes under `memorybank/org/GRAPH/` plus work-note footers.

One builder produces the four scoped graphs. The same edge list is written as wiki links. Graphify CLI and Jarvis `graph.*` tools are unchanged.

## Seat edges (level 4 ego-network)

**Draw by default**

| Edge | From → to | Source |
|------|-----------|--------|
| `authored` / `executed` / `delivered` / `produced` | seat → its handoffs, runs, inbox items, artifacts | snapshot + review inbox |
| `spawned` | manager seat or manager handoff → IC seat | `ics_spawned` / merged IC table |
| `related_handoff` | manager brief ↔ spawned IC handoff | same initiative + phase + spawned list |
| `reports_to` | seat → manager seat | roster |
| `reviewed_by` | this seat’s packet → C-suite review | same initiative + same phase; file named `<phase>-csuite-review.md` (or `<phase><suffix>-csuite-review.md`) |
| `uses_skill` | seat or work → skill | position `skills/org/positions/<slug>/SKILL.md`, that file’s skill-pack table, and that run’s `must_read` |
| `for_phase` / `owns_phase` | work or owner → phase | frontmatter / `phaseOwners` |

**Do not draw by default**

- Every other handoff in the same phase (no “phase peers”)
- Every skill in the repo
- Work from another initiative (CEO on Sieger does not show Blacksage `main` packets)

A later optional query flag `peers=1` may add same-phase peers. It is not in v1.

Levels 1–3 use hierarchical edges only (`serves`, `owns`, `runs`, plus initiative-internal `authored` / `reports_to` at level 2–3). Skill and related-handoff cross-links appear at level 4.

## API

`GET /api/org-work-graph`

| Param | Values |
|-------|--------|
| `scope` | `agency` (default) · `customer` · `initiative` · `seat` |
| `customer` | required for `customer`, `initiative`, `seat` |
| `initiative` | required for `initiative`, `seat` |
| `seat` | required for `seat` |

Response: `{ ok, scope, graph }` where `graph` is the existing `OrgWorkGraph` shape (`nodes`, `edges`, `legend`, `stats`) plus node kinds already on the type (`agency`, `customer`, `initiative`, `seat`, `handoff`, `run`, `deliverable`, `artifact`, `phase`) and new kinds `skill`. New edge kinds: `spawned`, `related_handoff`, `reviewed_by`, `uses_skill`.

Unknown customer / initiative / seat → `404` `{ ok: false, error }` ; UI stays on the last good scope.

Remove the current default of `scope=portfolio` that expands only the active initiative. `scope=initiative` without `customer`/`initiative` is invalid (404), not “active initiative compat.” Callers that need the active initiative pass those query params explicitly.

## Control Center UX

- Breadcrumb: `Velocity Agency / Blacksage Kennels / Sieger Show Secretary / CEO / Strategist`
- Labels on the current level’s primary nodes (not only seats)
- Zoom and pan on customer and initiative views (Blacksage `main` has 100+ handoffs)
- Legend filters remain
- Hover inspector unchanged
- Click rules as in the hierarchy table

## Vault sync

Directory: `memorybank/org/GRAPH/` (generated, safe to regenerate).

| File | Links |
|------|-------|
| `Velocity Agency.md` | customer MOCs |
| `<Customer Name>.md` | initiative MOCs for that customer |
| `<Initiative Name>.md` | per-initiative seat MOCs |
| `seats/<Seat Title> — <Initiative Name>.md` | that seat’s work + ego-network wiki links |
| `skills/<pack-or-position-slug>.md` | stub; title is the skill name |
| `phases/Phase <n> — <Initiative Name>.md` | work in that phase on that initiative |

Seat and phase MOCs are **per initiative** so `CEO — Sieger Show Secretary` ≠ `CEO — Blacksage Kennels · Main`.

Work notes (handoffs, reviews, inbox deliverables) get a generated footer only:

```markdown
<!-- graph:start -->
[[Sieger Show Secretary]] · [[CEO — Sieger Show Secretary]] · [[Phase 1 — Sieger Show Secretary]] · [[1-business-analyst]] · [[ceo-strategist]]
<!-- graph:end -->
```

Sync rewrites only that block. Handoff bodies are not edited. Missing files are skipped. If the vault is unwritable, OCC still returns the graph and sync reports failed paths.

Trigger: `obsidian.sync`, and `GET /api/org-work-graph` schedules vault sync with Next.js `after()` so opening the Knowledge graph refreshes MOCs without blocking the JSON response. Sync failures never fail the GET.

## Components

| Unit | Responsibility |
|------|----------------|
| `buildScopedOrgGraph` in `org-work-graph.ts` | Four scopes from registry + per-initiative snapshots |
| `OrgWorkGraphView` | Breadcrumb, click rules, zoom/pan, labels |
| `vault-graph-sync.ts` | Idempotent MOC + footer writes |
| `GET /api/org-work-graph` | Scope params, 404s, optional sync hook |

Per-initiative snapshots: for customer/initiative/seat scopes, load handoffs/runs/inbox from **that** initiative’s `businessIdea` paths, not only `loadSnapshot()` of the active triple. Agency scope does not load work.

## Testing

- Agency graph contains no `handoff` / `run` / `deliverable` / `artifact` nodes
- Customer graph includes every initiative under that customer and their work
- Initiative graph is clustered by seat and excludes other initiatives
- Seat graph includes spawned IC, related IC handoff, position skill, and phase; excludes unrelated same-phase seats
- Footer rewrite is idempotent (second sync is a no-op on content)
- Seat MOC filenames differ across initiatives for the same slug
- API 404s on missing scope keys and on Agency→Initiative skip (missing `customer` when `scope=initiative`)
- Click helper (pure function) only allows the next level down or breadcrumb up

## Non-goals (v1)

- Holding-company graph above Velocity Agency + Superpatch
- Graphify AST map inside the Knowledge graph drawer
- Injecting wiki links into handoff prose
- Obsidian Canvas export
- `peers=1` same-phase overlay
- 3D OrgTheater portfolio layout
- Relocating wrapped `docs/projects/*` trees

## Compatibility

- Existing `OrgWorkGraph` JSON shape stays; new kinds are additive
- `fetchOrgWorkGraph()` default becomes `agency`
- Graphify status/view endpoints unchanged
