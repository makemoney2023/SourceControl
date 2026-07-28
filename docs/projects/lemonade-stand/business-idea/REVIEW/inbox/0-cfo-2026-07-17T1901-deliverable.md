---
status: approved
position: cfo
phase: "0"
goal: "Phase 0 peer brief (CFO). Read 00-intake.md and MEMORY/context.md. Write ONLY HANDOFFS/0-manager-cfo.md with unit-economics, budget, and capital assumptions for this intake classification. Do not rewrite intake. Do not mark phase complete. Do not spawn peer managers."
created: 2026-07-17T19:01:44.372Z
runId: 1784314904392-cfo
---

# Phase 0 peer brief — CFO deliverable

**Run:** `1784314904392-cfo`  
**Verdict for operator:** Light-depth unit economics and bootstrapped capital assumptions ready for roundtable (not phase-complete).

## Classification (from intake — not rewritten)

| Field | Value |
|-------|-------|
| Type | **Service** — seasonal event F&B / experiential vendor |
| Mode | **explore** |
| Depth | **light** |
| Funding | Bootstrapped (assumption) — **4B skipped** |

## Economics snapshot (assumptions unless noted)

| Metric | Range / mid |
|--------|-------------|
| Startup cash need | **$535 – $2,550** |
| Season-one cash out (8–12 events) | **~$2.4k – $6.7k** |
| COGS / cup | **$0.83 – $2.03** (mid **$1.30**) |
| Price sensitivity | **$4 / $5 / $6** (unconfirmed) |
| Mid break-even @ $5 | **~61 cups/event** (~$225 fixed) |

## Capital stance

- Self-funded prove/kill over **8–12 events**.
- Reopen capital/4B only if multi-stand, hired labor circuit, trailer/commissary, packaged retail, or large deposit float.

## Artifacts written

| Path | Role |
|------|------|
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-manager-cfo.md` | Manager peer brief |
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-fpa-analyst.md` | IC unit-economics detail |

## Model audit

| Seat | llm_tier | llm_model | generation_profile | generation_used | fallback_applied |
|------|----------|-----------|--------------------|-----------------|------------------|
| cfo | frontier-reasoning | grok-4.5 | none | none | false |
| fpa-analyst | strong-general | composer-2.5-fast | none | none | true (preferred `composer-2.5`) |

## ICs / peers

- **ICs spawned:** `fpa-analyst` (write lease: `HANDOFFS/0-fpa-analyst.md`)
- **Not spawned:** `fundraising-lead` (bootstrapped; 4B skipped)
- **Peer managers:** not spawned — orchestrator owns roundtable seats

## Open questions for operator

1. Geography / first events (booth fee + permit tier)  
2. Pricing & pack sizes  
3. Permits / temp food vendor path  
4. Labor model (solo vs helpers)  
5. Brand ambition + acceptable return on operator time  

## Asks

- Do **not** mark Phase 0 ✅ yet  
- Merge with other peer briefs → CEO → `HANDOFFS/0-csuite-review.md`
