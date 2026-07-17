# Collaboration & RACI

Peers do **not** spawn each other. Cross-seat work goes through the **immediate manager**, who leases write paths and sequences or parallelizes ICs.

## Rules

1. IC needs a peer → `ask_manager` in handoff (never spawn peer).
2. Manager needs another desk (e.g. CMO needs Creative) → ask orchestrator/CEO to spawn that **manager**, or note `collaborates_with` in the manager brief.
3. Shared artifact → one write_lease owner at a time; others read-only until merge.
4. IC disagreement → manager decides; if still blocked → escalate to CEO with tag.

## Phase 14 — Pages (RACI)

| Artifact | Responsible | Accountable | Consulted | Informed |
|----------|-------------|-------------|-----------|----------|
| Body copy | `copy-chief` | `cmo` | `product-marketing-manager` | `ceo-strategist` |
| On-page SEO / meta / schema | `seo-manager` | `cmo` | `copy-chief` | |
| Blog calendar drafts | `content-strategist` | `cmo` | `seo-manager` | |
| Page imagery | `brand-designer` | `creative-director` | `cmo` | |
| Phase merge + brief | `cmo` | `cmo` | `creative-director` | `ceo-strategist` |

`collaborates_with`: `cmo` ↔ `creative-director` (imagery + brand consistency).

## Phase 15 — Video (RACI)

| Artifact | Responsible | Accountable | Consulted | Informed |
|----------|-------------|-------------|-----------|----------|
| OpenMontage production | `video-producer` | `creative-director` | `copy-chief` (script), `product-marketing-manager` | `cmo`, `ceo-strategist` |
| Channel strategy note | `video-producer` | `creative-director` | `cmo` | |
| Phase merge + brief | `creative-director` | `creative-director` | `cmo` | `ceo-strategist` |

## Phase 19 — Paid (RACI)

| Artifact | Responsible | Accountable | Consulted | Informed |
|----------|-------------|-------------|-----------|----------|
| Ad angles / funnel / stills | `paid-media-manager` | `cmo` | `copy-chief`, `brand-designer` | |
| Video ads | `video-producer` | `creative-director` | `paid-media-manager` | `cmo` |
| Budget overage | `paid-media-manager` | `cfo` (escalation) | `cmo` | `ceo-strategist` |
| Phase merge + brief | `cmo` | `cmo` | `creative-director` | `ceo-strategist` |

## Conflict protocol

1. Manager reads both IC handoffs.  
2. Picks a resolution; documents under “Conflicts resolved” in manager brief.  
3. If brand vs growth or spend vs plan → escalate per `ESCALATION.md`.  
4. Do not mark ready_for_csuite until conflicts are resolved or escalated.
