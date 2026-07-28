---
status: pending_review
position: head-of-research
phase: 2
goal: "resolve the blocker"
created: 2026-07-17T17:25:47.797Z
runId: 1784309147792-head-of-research
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Phase 2 deliverable — head-of-research

**Run:** 1784309147792-head-of-research  
**Goal:** resolve the blocker  
**Verdict for C-suite:** ready_for_csuite — recommend **approve** with evidence-gap flags

---

## Blocker resolution

| Blocker | Status | Action taken |
|---------|--------|--------------|
| IC handoffs complete but unmerged | ✅ Resolved | Merged `2-market-research-analyst.md` + `2-competitive-intelligence-analyst.md` |
| Missing `02-evidence-base.md` | ✅ Resolved | Written — deep-research quick brief + evidence-gap review |
| Missing manager brief | ✅ Resolved | `HANDOFFS/2-manager-head-of-research.md` |
| Phase 2 not marked complete | ✅ Preserved | Awaiting C-suite verdict — runbook stays 🔄 |

Prior runs queued "resolve the blocker" repeatedly because IC artifacts landed (~17:20 UTC) without manager merge or evidence base.

---

## Executive summary

Passive-grid's **grid-down passive sorbent harvester** targets a validated white-space: no commercial **portable + zero-power + cartridge** SKU exists, while refrigeration AWGs dominate (>99% revenue) and fail below ~20–30% RH. SOURCE proves sorbent low-RH viability at fixed-install scale; passive-grid differentiates on expeditionary form factor and sub-$500 preparedness positioning.

**Market:** Global AWG USD 2.9B–3.7B (2026); sorbent sub-segment USD 15M–55M. Canada SAM for ICP **USD 35M–120M (Low confidence)**; bootstrapped SOM **USD 0.1M–0.8M** Y1–3.

**Top risks:** (1) no primary customer research, (2) zeolite yield unproven in Ontario RH, (3) AirJoule Core AWG Q4 2026, (4) category-education burden for sorbent <1.5% share.

---

## Artifacts delivered

| Artifact | Path |
|----------|------|
| Evidence base | `02-evidence-base.md` |
| Market research | `02-market-research.md` (IC) |
| Competitive landscape | `02-competitive-landscape.md` (IC) |
| Sources index | `SOURCES/INDEX.md` (IC, 25 sources) |
| Manager brief | `HANDOFFS/2-manager-head-of-research.md` |
| IC handoffs | `HANDOFFS/2-market-research-analyst.md`, `HANDOFFS/2-competitive-intelligence-analyst.md` |

---

## Key evidence (12 findings)

1. Refrigeration AWGs >99% of market; RH floor ~20–30% — **High confidence**
2. Sorbent/wet-desiccation ~0.5–1.5% share, ~7–8% CAGR — **Medium**
3. SOURCE: sorbent + solar at ~10% RH, $4.5K–6.5K fixed install — **High**
4. No passive portable cartridge harvester at scale — **Medium–High**
5. AirJoule Core AWG residential Q4 2026 — monitor — **Medium**
6. Ontario cottage/rural beachhead credible (~400K+ rec properties) — **Medium**
7. Resilience WTP: solar $25K–80K, entry AWG $799–1,770 — **Medium**
8. Mass market rejects AWG vs tap cost-per-litre — **Medium**
9. MOF-303 patent-locked; zeolite/SAPO-34 pivot — **High**
10. Passive yield: mL–few L/day at expeditionary scale — **Medium**
11. **A1 zeolite Ontario yield — unvalidated** — **Low until 9B**
12. Health Canada / NSF path unscoped — **Low**

Full matrix: `02-evidence-base.md`

---

## Assumption status (Phase 1 → 2)

| ID | Assumption | Phase 2 verdict |
|----|------------|-----------------|
| A1 | Zeolite yield in Ontario | ❌ Unvalidated — Phase 9B gate |
| A2 | BOM $561–638 | ⚠️ Plausible, re-verify for passive BOM |
| A3 | Pi 5 kiosk stack | ✅ Supported (powered variant only) |
| A4 | MOF not for prototype | ✅ Confirmed |
| A5 | Premium WTP | ⚠️ Partial — resilience segment only |
| A6 | Purification chain perception | ⚠️ Mechanism sound; passive SKU TBD |

---

## IC delegation record

| IC | Spawned this run | Handoff | Write lease used |
|----|------------------|---------|------------------|
| market-research-analyst | No (prior run) | `2-market-research-analyst.md` | `02-market-research.md`, `SOURCES/INDEX.md` |
| competitive-intelligence-analyst | No (prior run) | `2-competitive-intelligence-analyst.md` | `02-competitive-landscape.md` |

Delegate budget remaining: 3 (unused — ICs pre-completed).

---

## Open questions for Phase 3

1. Primary interviews: 10–15 Ontario cottage/off-grid owners
2. Yield proof: zeolite MVP at summer vs winter RH
3. Regulatory: Health Canada / NSF scoping timeline
4. Monitor AirJoule Core AWG consumer pricing (Q4 2026)
5. Channel: DTC vs cottage installer vs prep retail
6. Danny's role (operator — non-blocking)

---

## Recommendation

**Approve** Phase 2 artifacts for C-suite review and Phase 3 strategy kickoff. Preserve Low-confidence labels on SAM sizing. **Do not** mark Phase 2 complete in `RUNBOOK-TRACKER.md` until `2-csuite-review.md` records verdict.

**Escalation tags:** `evidence`, `scope` (regulatory)
