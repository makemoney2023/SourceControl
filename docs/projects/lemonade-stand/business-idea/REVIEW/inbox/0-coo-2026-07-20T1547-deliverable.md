---
status: pending_review
position: coo
phase: "0"
goal: "Phase 0 peer brief (COO) — ops, delivery, and legal/compliance flags"
created: 2026-07-20T15:47:41.547Z
runId: 1784562461561-coo
---

# Deliverable — Phase 0 COO peer brief

## In plain English
We reviewed how a seasonal lemonade booth would actually run day to day and what legal gates sit in front of a first sale. Fresh-squeezed, ice-cold lemonade at events is a simple product story, but permits, insurance, ice, and squeeze speed are the real constraints. Peer planning can continue. Do not schedule a real event sale as “cleared” until you name the city/region and clear a local permit + insurance checklist.

## What we found
- The idea is a seasonal event food booth (not a permanent shop) selling ice-cold lemonade from freshly squeezed lemons.
- A first pilot can stay low-cost (cart/table, canopy, juicer, coolers), but fresh squeeze slows the line — two people is the safer default above roughly 50 cups.
- Without a named city/region, we cannot confirm the temporary food-vendor permit or sales-tax path.
- Fresh open lemonade often does **not** qualify for cottage-food / “make it at home” shortcuts; expect health-department scrutiny.
- Most paid events will also want general liability insurance and a certificate naming the organizer — a homeowner policy usually is not enough.

## Next steps
1. **Operator** — answer the blocking questions below (especially geography and first events).
2. **CEO** — merge this COO brief with CFO/CMO/research peers into a fresh Phase 0 C-suite review.
3. **Orchestrator** — keep Phase 0 in progress; do not mark it complete on this brief alone.
4. **Ops (later)** — after geography is known, size a single half-day pilot kit and crew.
5. **Legal / local advisors (later)** — confirm temp food permit, food-handler rules, and insurance against the first organizer’s vendor packet (this brief is checklist guidance, not formal legal advice).

**Blocking questions the operator must answer before the next operating phase:**  
(1) Which city/region and first events? (2) Any temporary food / health permit already held or started? (3) Where will you prep (on-site only, home, or commissary kitchen)? (4) Do you have (or can you get) event liability insurance / COI? (5) Solo operator or helpers on event day?

## Classification alignment

| Field | Value |
|-------|-------|
| Type | Service — seasonal event F&B |
| Mode | explore |
| Depth | light |
| COO stance | Planning OK; **ops go-live gated** |

## Ops / delivery flags (short)

| Flag | Severity |
|------|----------|
| Fresh-squeeze throughput | High |
| Ice / cold chain / heat | High |
| Weather cancellation | High |
| Solo labor at volume | High |
| Permits / inspection | Blocking |

## Legal / compliance flags (short)

| Flag | Severity |
|------|----------|
| Geography unknown | Blocking |
| Temp food / health permit | Blocking for sale |
| Cottage-food / home-prep assumption | High risk |
| Insurance / COI | Blocking for most events |
| Entity / sales tax / DBA | Medium |

> Checklist guidance only — **not** formal legal advice.

## Artifacts written

| Path | Role |
|------|------|
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-ops-manager.md` | Ops/delivery IC flags |
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-legal-counsel.md` | Legal/compliance IC flags |
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-manager-coo.md` | COO manager brief |
| This inbox file | Operator review deliverable |

## Model audit

| Field | Value |
|-------|-------|
| llm_tier | frontier-reasoning |
| llm_model | grok-4.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false (manager); ops IC used composer-2.5-fast with fallback_applied true |

## ICs / peers

- **ICs spawned:** `ops-manager` (fast-ops), `legal-counsel` (frontier-reasoning)
- **Peer managers:** not spawned — orchestrator owns CFO/CMO/HoR
- **Phase complete:** not marked (constraint honored)

## Asks

- Do **not** mark Phase 0 ✅ yet  
- Fold into CEO merge → fresh `HANDOFFS/0-csuite-review.md` after remaining peers return  
- Unblock geography / permits / insurance before treating any pilot date as real
