---
phase: "0"
manager: cfo
ics_spawned: []
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
runId: 1784562461556-cfo
tool_status:
  obsidian-secrets: unavailable
  stripe: unavailable
---

# Manager brief — Lemonade Stand — Phase 0 (CFO)

## In plain English
Finance reviewed the lemonade-stand intake as a seasonal event drink business, not a software or fundraising story. The money question is whether each cup and each event day can cover ingredients, booth fees, and labor after a small cash buy-in for cart, cooler, and juicer. Under labeled mid-case assumptions the model can work at modest volume if booth fees stay reasonable; high-fee events or under-pricing are the kill cases. This peer brief is ready for C-suite merge. Phase 0 is not closed, and these ranges are not a committed plan until you set price, geography, and labor.

## What we found
- Classification (from intake, not rewritten): **Service** — seasonal event F&B; mode **explore**; depth **light**; funding **bootstrapped** (assumption).
- Unit of economics (inference): primary = **cup sold**; secondary = **event day** — not ARR/LTV/CAC.
- Startup cash need (assumption): **~$535–$2,550** CapEx + working capital (cart/table, cooler, juicer, first supplies).
- Mid-case unit economics (assumptions): ~**$1.30** COGS/cup, **$5** price → ~**$3.70** contribution/cup; mid-festival break-even ~**61 cups/day** at ~$225 fixed cost.
- Season-one cash out (assumption): **~$2.4k–$6.7k** for **8–12** event days — proves/kills without opening Phase **4B**.

## Next steps
1. **Operator** — answer blocking money questions below (price/pack, geography/events for booth-fee tier, labor model, acceptable $/hr or seasonal profit).
2. **CEO (merge wave)** — fold this brief with CMO/COO/HoR into a fresh `HANDOFFS/0-csuite-review.md`; do not reuse the 2026-07-17 merge as the close for this roundtable.
3. **CFO / Phase 4 (later)** — tighten per-event P&L once price, fees, and cups/hour are known; carry $4–$10 price sensitivity as labeled ranges (do not lock a plan price now).
4. **COO alignment (later)** — cups/hour throughput caps revenue before margin math matters; permit/insurance gate before any sale.
5. **Orchestrator** — do **not** mark Phase 0 ✅ on this brief alone; await peer set + CEO merge.

**Blocking questions for the operator:** (1) Pricing & pack (sizes, price, add-ons)? (2) Geography / first events (drives booth fee + permit cost)? (3) Labor model (solo vs paid helpers)? (4) Acceptable return on your time ($/hr or seasonal profit target)? (5) Brand ambition (side hustle vs multi-event brand — changes CapEx/capital triggers)?

## Summary (5 bullets max)
- Peer brief for intake **Service** / explore / light: numbers framed as **per-cup + per-event** contribution.
- Bootstrapped capital holds: startup **~$535–$2,550**; season-one all-in **~$2.4k–$6.7k** for 8–12 event days — **skip 4B**.
- Mid-case (assumptions): ~$1.30 COGS/cup @ **$5** → ~$3.70 contrib/cup; mid-festival BE ~**61 cups/day**.
- No ICs spawned: write lease is only `HANDOFFS/0-manager-cfo.md`; Phase 0 peer craft is manager-owned (ORG-REGISTRY Jarvis roundtable). Did **not** spawn `fundraising-lead`.
- Do **not** treat mid-case as a plan — operator answers above before tighter P&L.

## IC handoffs merged
| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| — | — | n/a (none spawned this run) | — | — |

Prior supporting detail (read-only, outside this run’s lease): `HANDOFFS/0-fpa-analyst.md` from 2026-07-17 — ranges below remain consistent with that light model; not re-leased or rewritten.

## Model routing check
- [x] Every IC packet had `llm_tier` — n/a (no ICs)
- [x] Creative ICs used correct `generation_profile` (or skip reason) — n/a (`generation_profile: none`)
- [x] Fallbacks recorded when Max Mode / plan blocked preferred model — none; manager used `grok-4.5`

## Conflicts resolved
- none (peer tensions deferred to CEO merge; soft prior tension with HoR $6–$10 street band vs CFO $4–$6 sensitivity — carry both as labeled ranges into Phase 4, not a CFO revise)

---

## Unit economics (intake classification)

**Model type (inference):** Transaction / event retail — primary unit = **cup sold**; secondary unit = **event day**.

SaaS metrics (ARR, LTV:CAC, NDR) do **not** apply at this classification.

### Per-cup COGS & contribution (all assumptions)

| | Low | Mid | High |
|---|-----|-----|------|
| COGS / cup | $0.83 | $1.30 | $2.03 |
| Contribution @ $4 | $3.17 | $2.70 | $1.97 |
| Contribution @ $5 | $4.17 | $3.70 | $2.97 |
| Contribution @ $6 | $5.17 | $4.70 | $3.97 |
| Contribution @ $8 | $7.17 | $6.70 | $5.97 |
| Contribution @ $10 | $9.17 | $8.70 | $7.97 |

COGS stack (assumption): lemons (fresh-squeeze driver), sweetener, ice, cup/lid/straw, misc. **Fact:** no operator price/pack confirmed — $4–$10 are sensitivity only (wider band includes prior research street-price hypothesis).

### Per-event break-even (assumption: $5 price, $1.30 COGS → $3.70 contrib/cup)

| Scenario | Event fixed | Break-even cups |
|----------|-------------|-----------------|
| Low-fee local (solo) | ~$100 | ~27 |
| Mid festival | ~$225 | ~61 |
| High-fee / helper | ~$500 | ~135 |
| Premium + helper | ~$790 | ~214 |

**Inference:** Viable at modest volume if booth fees stay low; high-fee events need **100+ cups/day** or **$6+** pricing. Fresh-squeeze COGS is the margin risk — under-pricing or low volume is the primary kill case.

---

## Budget envelope (season one)

| Bucket | Low | High | Label |
|--------|-----|------|-------|
| Startup CapEx + WC | $535 | $2,550 | Assumption |
| Event fixed (8 days × $100–$300) | $800 | $2,400 | Assumption |
| Variable COGS (8 × 80–120 cups × ~$1.30) | $830 | $1,250 | Assumption |
| Replenishment / misc | $200 | $500 | Assumption |
| **Season-one cash out** | **~$2,400** | **~$6,700** | Assumption |

Aligned with intake: **explore / light / bootstrapped**; Phase **19** (paid ads) out of scope until event economics proven.

---

## Capital assumptions

| Topic | Stance |
|-------|--------|
| Funding | **Bootstrapped / self-funded** (intake assumption) — **4B skipped** |
| Prove/kill runway | Operator funds **$2.5k–$7k** for **8–12 events**, then go/no-go on cumulative cash contribution |
| Capital trigger (would reopen 4B or debt) | Multi-stand/multi-city; hired labor every event; branded trailer/commissary; packaged retail; large deposit float |
| Return hurdle | **Open** — operator $/hr or seasonal profit target not stated |

---

## Artifacts for C-suite review
| Path | Scorecard check |
|------|-----------------|
| `HANDOFFS/0-manager-cfo.md` | CFO peer brief: unit economics, budget, capital (this file) |
| `00-intake.md` | Read-only — classification Service / explore / light (not rewritten) |
| `HANDOFFS/0-fpa-analyst.md` | Prior IC detail (2026-07-17); not re-written this run |

## Escalation tags
- evidence — SOURCES empty; pricing/fees still assumed (not a Phase 0 fail)
- spend — none requested; stay bootstrapped

## Asks for C-suite
- Carry **labeled ranges** into Wave 2 merge; do not present mid-case as committed plan.
- Operator: answer geography/first events, pricing & pack, permits, labor model, brand ambition (and acceptable $/hr yield).
- Align later with COO on **cups/hour throughput** (caps revenue before margin matters).
- **Do not open 4B** unless a capital trigger above clears.
- Do **not** mark Phase 0 ✅ until fresh `HANDOFFS/0-csuite-review.md` for this roundtable.

## Recommendation
**approve** — ship CFO Phase 0 peer brief (light-depth unit economics + bootstrapped capital stance) for roundtable merge; revise only if peers surface conflicting fee/permit facts that break the break-even bands.

## Next action for orchestrator
Await remaining peer briefs → CEO merge → fresh `HANDOFFS/0-csuite-review.md`. Do not advance phase on this brief alone.
