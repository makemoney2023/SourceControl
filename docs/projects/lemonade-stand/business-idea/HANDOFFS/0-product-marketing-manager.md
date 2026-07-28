---
phase: "0"
position: product-marketing-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: true
tool_status: unavailable
---

# Handoff — Phase 0 customer, positioning & channel assumptions → CMO

**Run context:** 2026-07-20 CMO peer brief (Wave 1 roundtable)

## Goal (from context packet)

Phase 0 peer support for CMO. From `00-intake.md` and `MEMORY/context.md` only, draft customer (ICP), channel, and positioning **assumptions** for a seasonal event-based lemonade stand (fresh-squeezed, ice-cold). IC handoff only — no intake rewrite, no `product-marketing.md`, no GTM plans, no phase completion, no manager brief.

### In plain English

This is a pop-up lemonade stand at events — not a store, not packaged goods. The product promise is simple: **lemonade squeezed from real lemons, served ice-cold, at the event you're already at.** Season-one marketing is almost entirely **physical**: get a booth slot, show the squeeze, keep the line moving, and make cold obvious. We have **no research sources** yet; everything below is labeled assumption or inference. Paid ads and SEO stay off the table until unit economics are proven (per intake).

### What we found

| Kind | Finding |
|------|---------|
| **Fact** | Operator wants seasonal/event footprint with freshly squeezed, ice-cold lemonade (`MEMORY/context.md`, `00-intake.md`) |
| **Fact** | No uploaded sources (`SOURCES/INDEX.md` empty); explore mode, light depth |
| **Fact** | Intake skips Phase 19 (paid ads) and defers SEO/content engine until economics proven |
| **Inference** | Primary buyer is an **event attendee** making an impulse thirst/treat decision; secondary channel partner is the **event organizer** who books vendors |
| **Assumption** | Local/regional warm-weather events (festivals, markets, sports days) are the first venue types — geography not confirmed |
| **Assumption** | Positioning wedge vs fountain/bottled options is **visible freshness + cold serve + occasion**, not health claims or brand gloss |

### Next steps

1. **CMO merge:** Carry these labeled assumptions into the peer brief; do not promote working line or ICP to "confirmed" until operator answers geography, pricing, and brand ambition.
2. **Operator blockers:** Geography/first events, pricing/pack, brand ambition fork (side hustle vs multi-event brand), labor model, permit status — all from intake open questions.
3. **Cross-peer flags:** Align with COO on **live-squeeze theater vs throughput**; with FP&A on volume-at-booth economics before any paid/SEO investment.
4. **Defer:** `product-marketing.md`, Phase 6 GTM, Phase 13 copy hierarchy until at least one anchor event and price band are confirmed.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-product-marketing-manager.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | yes — Task harness only offers `composer-2.5-fast`; MODEL-REGISTRY preferred `composer-2.5` |
| tool_status | unavailable — `parallel-research` not invoked; no external evidence added |

---

## 1. Customer assumptions (ICP)

**Evidence status:** `SOURCES/INDEX.md` is empty. Segments below are **assumptions** from intake and operator note unless labeled otherwise.

### Primary ICP — Event attendee (B2C, impulse buyer)

| Dimension | Assumption |
|-----------|------------|
| **Who** | Adults and families at warm-weather community events — festivals, farmers markets, sports days, school fairs, outdoor concerts (**assumption** — geography unspecified; default local/regional per intake) |
| **Context** | Hot day, walking between activities, browsing vendor row or waiting in line; child or self wants a treat |
| **JTBD** | (1) **Cool down fast** with a cold drink that feels worth the price; (2) **Small indulgence** — "real lemonade" vs fountain soda or bottled options; (3) **Trust the product** — visible freshness beats anonymous bulk dispensers (**assumption**) |
| **Decision drivers** | Heat, thirst, smell/sight of lemons being squeezed, queue proximity, kid request, visible price on menu board (**assumption**) |
| **Willingness to pay** | Premium over fountain/bottled if freshness and cold serve are obvious — exact price band **unknown** (**assumption**: event pricing tolerance higher than daily convenience store) |
| **Failed alternatives (avatar lens)** | Bottled lemonade (not cold enough / not fresh), fountain drinks (too sweet / generic), water (functional but not a treat), skipping drink (still thirsty) (**assumption**) |

### Secondary ICP — Event organizer / vendor coordinator (B2B-lite channel partner)

| Dimension | Assumption |
|-----------|------------|
| **Who** | Market managers, festival ops, school/sports boosters, fair boards booking food vendors (**assumption**) |
| **JTBD** | (1) Fill a beverage slot with **low operational complexity**; (2) Offer a **crowd-pleasing, family-safe** option; (3) Vendor shows up permitted, reliable, and visually appealing on the row (**assumption**) |
| **What they are not buying** | National brand partnership, exclusive pour rights, or custom co-marketing — season one is **slot + reliability** (**assumption**) |
| **Selection criteria (assumed)** | Permit readiness, simple footprint, clear menu, punctual setup, no drama (**assumption**) |

### Non-customers (explicit exclusions for season one)

| Segment | Why out of scope |
|---------|------------------|
| Grocery / retail packaged buyers | No SKU, no shelf distribution — intake is event footprint only (**fact** from intake classification) |
| Subscription / delivery / app-order consumers | No software surface; not delivery-first (**fact** — Phase 9 skipped) |
| Year-round café / storefront patrons | Non-negotiable is seasonal/event-based, not permanent retail (**fact** from intake) |
| B2B bulk catering (weddings, corporate) | Possible future line; not assumed in explore/light season one (**assumption**) |
| Health-optimization / functional-beverage buyers | Product is indulgence + refreshment, not wellness positioning (**assumption**) |

---

## 2. Positioning assumptions

**Non-negotiables (fact from intake):** freshly squeezed lemons, ice-cold serve, seasonal/event-based footprint.

### Positioning pillars

| Pillar | Customer promise | Booth proof (assumed) | Guardrail |
|--------|------------------|----------------------|-----------|
| **Fresh** | Lemonade made from lemons squeezed on site (or visibly prepped fresh that day) | Live squeeze, lemon pile, "freshly squeezed" on menu — not concentrate-first story | Do not lead with "natural flavors," powder mix, or ambiguous "homemade" without squeeze proof |
| **Cold** | Drink arrives ice-cold — the relief is physical | Ice in view, cold cups, cooler discipline, pour-to-hand speed | Never serve warm or lukewarm — breaks the hero promise |
| **Occasion** | A seasonal treat **at the event** — part of the day out | Pop-up booth, event calendar, no permanent-store cues | Do not imply always-open retail or nationwide availability |
| **Honest simplicity** | One hero product done well | Short menu, clear price, fast line | Avoid menu complexity that slows throughput or dilutes "lemonade stand" clarity (**assumption**) |

### Working positioning line (assumption — not locked copy)

> **Ice-cold lemonade, squeezed fresh at the event.**

Alternate variants for CMO/copy to test later (**assumption**, not approved copy):

- *Fresh-squeezed. Ice-cold. Right here.*
- *The lemonade stand — actually squeezed.*

### Competitive frame (assumption — no research sources)

| Alternative at events | Their implied promise | Our wedge (assumed) |
|-----------------------|----------------------|---------------------|
| Fountain / bulk dispensers | Cheap, fast, familiar | Visible fresh squeeze + cold serve |
| Bottled / canned lemonade | Convenient | Colder, fresher, experiential |
| Other specialty drink booths | Variety (boba, smoothies) | Simple classic; kid-friendly; lower decision fatigue |
| Water / sports drinks | Hydration | Treat + refreshment; emotional "stand" nostalgia (**assumption**) |

### Brand ambition fork (assumption — operator has not chosen)

| Path | Positioning expression | Channel implication |
|------|------------------------|---------------------|
| **Side hustle** | Generic or minimal name; menu board carries the story | P0 booth + organizer only; P2 social optional |
| **Multi-event brand** | Repeatable name, simple visual identity, "where we'll be" calendar | Triggers Phase 11–14 after economics proof; simple web/social as schedule layer (**assumption**) |

### Positioning guardrails (do / don't)

| Do | Don't |
|----|-------|
| Lead with **fresh + cold + here** | Claim "best in city" without local proof |
| Show the squeeze or lemons | Imply concentrate while saying "fresh" |
| Match tone to **community / family event** context | Adopt glossy DTC beverage brand voice before first events |
| Keep claims literal and demonstrable at booth | Over-promise health, organic, or farm-origin without sourcing proof (**assumption**) |

---

## 3. Channel assumptions — season one

**Policy (fact from intake):** Phase 19 paid ads skipped; prove event economics first. SEO engine deferred — no content/SEO program assumed for explore/light path.

### Priority table (booth-first)

| Priority | Channel | Role | Effort (assumed) | Notes |
|----------|---------|------|------------------|-------|
| **P0** | **Physical booth @ booked events** | Primary demand capture — smell, sight, menu, queue | High (operator time) | Revenue and positioning proof live here (**assumption**) |
| **P0** | **Event organizer / market applications** | Supply-side "channel" — get on the calendar | Medium | Secondary ICP; permits + reliability matter (**assumption**) |
| **P1** | **On-site signage + menu board** | Price clarity, fresh/cold claims, line speed | Low–medium | Highest-ROI "creative" for season one (**assumption**) |
| **P1** | **Word of mouth / repeat attendees** | Organic return at same market or next local event | Low | Depends on product delivery (**assumption**) |
| **P2** | **Simple social (IG/FB) — schedule + photos** | "Where we'll be" + social proof after first pours | Low | Optional until brand ambition confirmed (**assumption**) |
| **P2** | **Local community boards / school/sports networks** | Find organizer contacts and event slots | Low | Bootstrapped outbound (**assumption**) |
| **Defer** | **Paid social / search / display (Phase 19)** | — | — | Intake skip until unit economics proven (**fact**) |
| **Defer** | **SEO / content engine** | — | — | No web product surface required for first events (**assumption** aligned with light depth) |
| **Defer** | **PR / influencer** | — | — | Overkill for explore; revisit if multi-event brand path chosen (**assumption**) |

### Channel–message fit (assumption)

| Channel | Message emphasis |
|---------|------------------|
| Booth | Fresh squeeze in action + ice-cold pour |
| Menu board | Price, size, "freshly squeezed" / "ice-cold" |
| Organizer pitch | Reliable, permitted, simple setup, crowd-friendly |
| Social (if used) | Event dates, behind-the-squeeze photos, not brand manifesto |

---

## 4. Soft flags for CMO

| Flag | Severity | Detail |
|------|----------|--------|
| **Evidence thin** | High | Zero sourced comps, pricing, or attendee behavior data. ICP and competitive frame are logical inferences only — do not treat as market-validated. |
| **Live-squeeze vs throughput** | Medium | Live squeeze is the strongest positioning proof but caps cups/hour and creates queue risk. Marketing story ("watch it squeezed") can conflict with ops need for speed. Recommend CMO + COO align on whether theater is full visible squeeze, partial prep, or hybrid before locking hero messaging. |
| **Geography unknown** | Medium | Cannot sequence organizer outreach or local comp set until operator names region and anchor events. |
| **Brand ambition fork open** | Medium | P2 digital investment (social, simple web) stays optional until operator chooses side hustle vs multi-event brand path. |
| **Pricing unknown** | Medium | Premium-vs-value framing and menu board design blocked until cup sizes and price points confirmed. |
| **Permit credibility (B2B-lite)** | Low–medium | Organizer channel pitch depends on permit readiness — not marketing-owned but affects reliability narrative. |

---

## 5. Open questions for operator (via CMO merge)

Blocking tighter ICP, positioning, and channel plan (aligned with intake open questions):

1. **Geography / first events** — Which city/region and which 2–3 anchor events for season one?
2. **Pricing & pack** — Cup sizes and price points? Add-ons (flavors, refills, merch)?
3. **Brand ambition** — Side hustle (minimal name + board) vs multi-event brand (repeat identity, simple web, social calendar)?
4. **Labor model** — Solo vs helpers? (Affects throughput and whether "fast line" is a messaging pillar.)
5. **Permit status** — Known path for temp food vendor?
6. **Differentiation appetite** — Classic lemonade only, or flavored variants / pink lemonade?

---

## 6. Recommendation for CMO merge

**Verdict:** **Ready to merge** — assumptions are internally consistent with intake non-negotiables and sufficient for Phase 0 explore/light depth.

Suggested merge actions:

- **Carry labeled assumptions** — do not promote working line or ICP segments to "confirmed" until operator answers geography, pricing, and brand ambition.
- **Anchor GTM on P0 physical + organizer channels** — align with intake skip of Phase 19; season-one marketing = booth experience + slot acquisition, not paid/SEO engine.
- **Lock positioning pillars (Fresh / Cold / Occasion / Honest simplicity)** as the CMO narrative spine; defer Phase 6/13 copy hierarchy until after first event proof or operator upgrades depth.
- **Fork brand ambition** in merged brief: side hustle = signage-only; multi-event brand = trigger Phase 11–14 after economics proof.
- **Cross-peer alignment:** FP&A break-even logic implies **volume at booth** matters — positioning should not over-promise craft that slows line speed; COO throughput assumptions should inform "fast, cold, fresh" ops story.

**Do not** open full `product-marketing.md` or Phase 6 GTM until operator confirms at least one anchor event and pricing band.

---

## Decisions

- All customer, positioning, and channel claims labeled **assumption** where sources are empty.
- Season-one channel stack is **event-native**; paid ads and SEO explicitly deferred per intake.
- Working positioning line is a **placeholder** for CMO/copy — not approved customer-facing copy.
- No external research tools invoked (`tool_status: unavailable`).

## Asks for manager (`ask_manager`)

- Peer help needed: **none** for Phase 0 assumptions; **head-of-research** or **market-research-analyst** may later validate local comps/pricing if operator names geography (**future**, not blocking Phase 0).
- Clarification needed: **none from orchestrator** — operator-facing questions listed in §5 for CEO/CMO merge.

## Risks / blockers

- **Zero sourced evidence** — ICP and competitive frame are logical inferences only; local pricing and attendee behavior unverified.
- **Geography unknown** — channel priorities (which organizer types to pursue) cannot be sequenced.
- **Fresh-squeeze throughput vs theater** — live squeeze is positioning proof but may cap cups/hour; tension for ops + marketing story (flag for COO peer).
- **Under-defined brand ambition** — digital channel investment (P2) stays optional until operator chooses path.

## Packs used

- `skills/community/marketingskills/product-marketing/` (light — ICP / positioning section framing only; no `product-marketing.md` written)
- `skills/community/advertising-skills/skills/foundations/avatar-extraction/` (light — JTBD, pains, failed alternatives for primary attendee)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Rewrite `00-intake.md` or produce CMO manager brief
