# Org work graph (replaces Graphify UI)

## Goal

Replace Intelligence → Knowledge graph (Graphify code communities) with a live **org work graph**: every roster seat, work performed, and relations.

## Scope

- **In:** seats (full roster), handoffs, runs, REVIEW inbox deliverables, artifacts referenced by handoffs; edges for reports-to, authored, executed, produced/delivered, for-phase.
- **Out:** Graphify AST/code map in this drawer. Graphify CLI + Jarvis `graph.*` tools remain for code intelligence.

## Data

Built from `loadSnapshot()` (+ review inbox). **Every** `org.seats` entry is a node even if idle.

## UX

- Same menu entry: Knowledge graph.
- Legend: seat titles + work types (handoff / run / deliverable / artifact / phase).
- Click seat → select slug + open seat console/report path as today.
- Live with snapshot/SSE freshness.

## API

`GET /api/org-work-graph` → `{ nodes, edges, stats }`.
