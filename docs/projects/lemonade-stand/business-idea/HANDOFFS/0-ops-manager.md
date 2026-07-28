---
phase: "0"
position: ops-manager
reports_to: coo
status: done
verdict_for_manager: ready_to_merge
llm_tier: fast-ops
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: true
---

# Handoff — Phase 0 ops & delivery flags → COO

### In plain English

This is a pop-up lemonade stand at events — not a permanent shop. The hard part is not the recipe; it is running a legal, cold, fast line when crowds spike. Fresh squeeze is slow, ice melts, and one missing permit can shut the booth. For a first pilot, plan on two people, shade, extra ice, and a single half-day event before scaling.

### What we found

- **Operating model:** Made-to-order squeeze → mix → ice → serve fits the “fresh + ice-cold” promise but caps throughput; peak queue is the main delivery risk.
- **MVP kit:** Table/cart, canopy, juicer(s), segregated coolers, handwash/sanitize, cups, and a large ice buffer are enough to test — no standing vendors or volume forecast documented yet.
- **Labor:** Solo works only at low volume (~40–60 cups); operator + one helper is the sensible MVP for fresh-squeeze positioning.
- **Reliability:** Ice/heat, fresh-squeeze speed, weather, and **permits (blocking)** are the top flags; geography and expected cups/event are still unknown.
- **Sources:** Intake only — `SOURCES/INDEX.md` empty; flags are assumption-based until operator names region and first event.

### Next steps

1. COO/operator answer blocking intake questions: geography, first event, permits, cups/event target, labor model.
2. Size MVP equipment and ice/lemon order from a **single pilot event** assumption (half-day, conservative volume).
3. Route permit/health questions to legal once geography is fixed; defer `08-operations.md` and vendor SOPs until post-pilot debrief.

## Goal (from context packet)

Phase 0 peer IC brief for Lemonade Stand. Read confirmed `00-intake.md` and `MEMORY/context.md`. Flag ops and delivery assumptions for a seasonal, event-based lemonade stand (ice-cold, freshly squeezed). Cover event-day operating model, MVP equipment/supply checklist, labor model options and risks, delivery/reliability flags, and open questions for COO/operator. Explore mode, light depth. Do not rewrite intake, mark phase complete, or spawn peers.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-ops-manager.md` | Phase 0 ops/delivery flags only — not `08-operations.md` |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | fast-ops |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | yes — harness routed to `composer-2.5-fast` instead of preferred `composer-2.5` per MODEL-REGISTRY |

---

## 1. Event-day operating model assumptions

**Confirmed from intake:** seasonal/event footprint (not permanent retail); freshly squeezed lemons; ice-cold serve; bootstrapped explore mode; operator + helpers TBD.

**Assumed footprint:** pop-up cart or table at temporary events (festival, fair, sports/community). Typical service window **3–6 hours** per event.

| Phase | Assumption | Ops note |
|-------|------------|----------|
| **Pre-event (T-24 to T-1)** | Buy lemons, sugar, cups; plan ice; batch simple syrup if used | No documented vendor or prep SOP; first event will be ad hoc |
| **Setup (T-60 to T-0)** | 60–90 min: position cart/canopy, load coolers, set handwash/sanitize station, test juicer, stage cash/POS | Permit rules may mandate layout (handwash within X ft of prep); **geography unknown** blocks layout design |
| **Open / serve** | Made-to-order squeeze → mix → ice → serve | Fresh squeeze is **throughput-limited**; peak queue is the primary delivery constraint |
| **Cold chain** | Serve immediately over fresh ice or hold finished drinks on ice in closed cooler | “Ice-cold” is a product promise — requires ice reserve + shaded station; heat degrades ice and operator stamina |
| **Mid-event** | Restock ice/lemons/cups; empty waste; wipe surfaces | Solo operator cannot restock and serve simultaneously without closing the window |
| **Teardown (T+0 to T+30)** | Discard open product per health rules, drain melt water, pack out waste, sanitize equipment | Improper teardown = permit violation and spoilage risk on transport home |

**Default service flow (MVP):** order → squeeze (30–60 s/cup depending on juicer) → mix → cup + ice → lid → payment. Pre-cut lemon halves or pre-mixed base speeds service but must stay within local “fresh” and time-at-temperature rules once geography is known.

---

## 2. MVP equipment & supply checklist

**Equipment (CapEx — bootstrapped tier)**

| Item | Qty (MVP) | Purpose |
|------|-----------|---------|
| Folding table or small vendor cart | 1 | Prep + serve surface |
| Pop-up canopy + weights | 1 | Weather/sun; often required at outdoor events |
| Manual citrus press or entry electric juicer | 1–2 | Throughput; second unit reduces bottleneck if 2+ staff |
| Insulated coolers (separate zones) | 2+ | Raw lemons / ice / staged product |
| Food-grade squeeze bottles or pitchers | 2–4 | Mixing; avoid cross-contamination |
| Cutting board + knife | 1 set | Lemon prep |
| Handwash setup (if not provided by venue) | 1 | Often permit-mandatory |
| Sanitizer spray + wipes + gloves | 1 kit | Surface and hand hygiene |
| Cash box or mobile POS | 1 | Event-dependent |
| Signage (menu/price) | 1 | Queue management + price-posting compliance |
| Waste + recycling bins | 2 | Event may require pack-out |

**Consumables (per event — volume TBD)**

| Supply | MVP notes |
|--------|-----------|
| Lemons | High weight/volume; plan cases per expected cups + **15–20% spoilage/waste buffer** |
| Ice | Often **1–2× expected drink volume** in pounds; melt rate drives mid-event runs |
| Cups, lids, straws (if offered) | Size drives COGS and pour yield |
| Sugar / simple syrup ingredients | Batch prep 24 h ahead reduces event-day friction |
| Water (for wash + dilution) | Gallons for cleaning; potable for recipe |
| Napkins, trash bags | Low cost, easy to forget |

**Supply chain flags:** no standing vendor relationships, no event-volume forecast, and no cold-storage at home/base documented. First pilot should assume **same-day or day-before** lemon pickup and **on-site ice purchase** unless operator confirms bulk ice delivery.

---

## 3. Labor model options + risks

| Model | Fit | Risks |
|-------|-----|-------|
| **Solo operator** | Lowest cost; viable only at low volume (< ~40–60 cups/event) | Cannot serve + squeeze + restock concurrently; no breaks; single point of failure; long queues |
| **Operator + 1 helper (paid or family)** | Recommended MVP for fresh-squeeze positioning | Helper training, food-handler cert requirements (jurisdiction-specific), split roles unclear without brief SOP |
| **Operator + 2 helpers** | Higher-throughput events | Scheduling, wage cost, overstaff risk on slow days |
| **Rotating volunteer crew** | Possible for community events | Inconsistent quality, hygiene slips, no accountability |

**Role split (if 2-person):** Person A — squeeze/prep; Person B — mix, ice, cash, customer interface. Without this split, average service time likely exceeds what festival crowds tolerate.

**Labor risks for COO:** labor model is **blocking** in intake; food-handler certification lead time can delay first legal service; unpaid “friends” still create liability if permits name an operator of record.

---

## 4. Delivery / reliability flags

| Flag | Severity (explore) | Mitigation direction (not Phase 8 SOP) |
|------|-------------------|----------------------------------------|
| **Fresh-squeeze throughput** | High | Second juicer, pre-cut lemon halves, or limited menu (one size); cap hourly sales |
| **Ice melt / heat** | High | Shade, extra cooler, mid-event ice run, insulated cup sleeves |
| **Lemon spoilage** | Medium | Buy 2–3 days before event max; refrigerated transport; discard bruised fruit |
| **Weather** | High | Rain = zero revenue but sunk setup/labor; wind affects canopy; need go/no-go rule |
| **Queue abandonment** | Medium–High | Visible menu, sample policy (if permitted), line signage, peak staffing |
| **Over-prep waste** | Medium | Start conservative on syrup and pre-cut lemons; track cups sold vs planned |
| **Permit / inspection failure** | **Blocking** | Cannot operate legally until geography + temp vendor rules known |
| **Power** | Low–Medium | Electric juicer needs outlet or generator; manual press avoids dependency |
| **Payment / cash handling** | Low | Event POS connectivity varies; cash float + reconciliation |
| **Water access** | Medium | Some venues lack hookups; plan jerry cans for handwash |

**Reliability thesis (explore mode):** unit economics and customer promise both hinge on **ice + squeeze speed + permit clearance**. A single failed dimension (no ice, slow line, closed by inspector) zeros the event — acceptable for a pilot if treated as a learning event, not revenue-dependent.

---

## 5. Open questions for COO / operator

1. **Geography & first event:** Which city/region and named event(s)? Drives permit type, ice sourcing, and weather assumptions.
2. **Permits & health rules:** Temporary food vendor license? Commissary kitchen required? Handwash mandate? Pre-approval inspection?
3. **Expected volume:** Cups/event target (e.g. 50 vs 300) — sets lemons, ice, labor, and equipment count.
4. **Labor model:** Solo vs paid helper; food-handler certs in place?
5. **Recipe & pack:** Cup sizes, sweetness, add-ons — affects prep batch sizes and squeeze rate.
6. **Base of operations:** Home kitchen approval for syrup prep? Vehicle for transport? Refrigeration between events?
7. **Event contract:** Who provides power, water, waste, and vendor spacing?
8. **Brand ambition:** One-off side hustle vs repeat circuit — affects whether MVP equipment is disposable or reusable across seasons.

---

## Decisions

- Treat ops as **pop-up F&B with made-to-order fresh squeeze** — optimize for learnings, not scale, in explore mode.
- **Minimum viable crew = 2 people** for any event targeting > ~50 cups or > 3 h service unless electric juicer + pre-cut workflow is proven.
- **Separate raw / ice / finished zones** in coolers from day one — low-cost habit that reduces cross-contamination findings.
- Defer vendor contracts, detailed SOPs, and `08-operations.md` until operator answers blocking intake questions and COO confirms pilot event.

## Asks for manager (`ask_manager`)

- Peer help needed: `legal-counsel` (or COO to route) for **temp food vendor / health permit** requirements once geography is known | none until geography fixed
- Clarification needed: COO to confirm whether Phase 0 roundtable should assume **first pilot = single half-day event** for ops sizing | none blocking this handoff

## Risks / blockers

- **Blocking (for actual operation):** geography, permits, and labor model unknown — cannot size ice, staff, or legal setup.
- **High:** fresh-squeeze throughput vs event crowd expectations.
- **Medium:** weather cancellation policy and ice logistics untested.
- No uploaded sources (`SOURCES/INDEX.md` empty) — ops flags are assumption-based, not jurisdiction-specific.

## Phase 0 ops risk recommendation (explore mode)

**Acceptable to proceed in explore mode** with a **single controlled pilot event** after operator answers geography, permit path, and labor questions. CapEx and complexity are low relative to many ventures; failure modes are **localized and reversible** (spoiled lemons, wasted ice, one bad weather day).

**Not acceptable to treat as “ops-ready”** for multi-event circuit or brand build until: (1) one event completes with cups-sold / waste / ice-use / queue-time notes, and (2) permit-compliant setup is validated on site. Recommend COO gate next ops depth on **post-pilot debrief**, not Phase 0 alone.

## Packs used

- Skim only — no pack deep-read required for Phase 0 flags; `skills/org/positions/ops-manager/SKILL.md` and intake artifacts sufficient.

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Write `08-operations.md` (Phase 8 scope)
