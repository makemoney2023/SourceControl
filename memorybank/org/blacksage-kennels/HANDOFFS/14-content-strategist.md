---
phase: "14"
position: content-strategist
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — IA Completeness Checklist (Phase 14 REDO) → CMO

## Goal (from context packet)

Produce IA completeness checklist for Phase 14 **Must multi-page set** (Home, Dogs, Health/Education, About, Inquire). Verify pillar→route mapping, awareness journey, empty states, Package A/B/C, proof pathway, CTA hierarchy, and that v1 scroll/`/apply` IA is fully superseded. Deliver scorecard for CMO merge — no blog calendar unless foundation requires it.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/14-content-strategist.md` | This handoff — Must-route scorecard, pillar map, journey audit, v1 supersession check |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Audit scope (REDO — multi-page)

| Source | Role |
|--------|------|
| `12-web-design.md` | Multi-page IA REDO — proof band, 5 Must routes, Package A/B/C |
| `13-copy-foundation.md` | Pillars §2, journey §3, section frameworks §4–§6, Package locks |
| `05-prd.md` | Must pages, trust-first nav, form spec |
| `14-pages/` | Copy-chief deliverables (audited 2026-07-27 REDO) |

**Inventory on disk (current):**

| File | Route | Status |
|------|-------|--------|
| `home.md` | `/` | ✅ Multi-page proof-band home |
| `dogs.md` | `/dogs` | ✅ Empty state + Tier 2 framework |
| `health.md` | `/health` | ✅ Four anchors + Package A/B/C on `#placement` |
| `about.md` | `/about` | ✅ Operator gap + principles + tertiary CTA |
| `inquire.md` | `/inquire` | ✅ Package A/B + form spec + success states |
| `homepage.md` | — | ⚠️ Deprecated — superseded by `home.md` |
| `apply.md` | — | ⚠️ Deprecated — superseded by `inquire.md` |
| `README.md` | index | ✅ Updated for v2 Must set |

**Prior handoff (v1 scroll + `/apply` audit) is obsolete.** This scorecard applies to the multi-page Must set only.

---

## 1. Must-route scorecard checklist

**Pass criteria for CMO merge / C-suite gate:** each Must page needs **body + meta** after merge. Meta may be stub until SEO merge — note status. Body must match Phase 12/13 **multi-page** IA (no scroll narrative, no `/apply`).

### Home (`/` — `home.md`)

| Criterion | Status | Notes |
|-----------|--------|-------|
| Body present | **Pass** | Page hero, proof summary band (4 cells), positioning prose, education/about teasers, inquire band |
| Meta present | **Pass (stub)** | `[STUB — seo-manager]` title + description — final merge deferred to SEO |
| Proof pathway / awareness stage | **Pass** | Four cells route to `/health#standards`, `/health#testing`, `/dogs`, `/health#placement` |
| Empty states | **N/A** | — |
| CTA hierarchy (Begin your inquiry tertiary) | **Pass** | No CTA in first viewport; inquire band uses outline/text link only; rejects scroll hint |
| Multi-page home framework (§5) | **Pass** | Matches §6 Home framework — no Heritage→Apply scroll sections |
| No scroll IA | **Pass** | Explicit rejection of v1 scroll sections; proof-band architecture only |

**Home verdict:** **Pass**

---

### Dogs (`/dogs` — `dogs.md`)

| Criterion | Status | Notes |
|-----------|--------|-------|
| Body present | **Pass** | Page hero, Tier 1 empty state, Tier 2 populated intro, DogCard notes, detail framework |
| Meta present | **Pass (stub)** | `[STUB — seo-manager]` |
| Proof pathway / awareness stage | **Pass** | Solution → Product stage; competence signal via honest empty state |
| Empty state (Tier 1 required) | **Pass** | "Breeding stock profiles are coming soon." + body + primary `/health` + tertiary `/inquire` |
| CTA hierarchy | **Pass** | Secondary = tertiary Begin your inquiry → `/inquire` |
| No scroll IA | **Pass** | Single-page index — no scroll narrative |

**Dogs verdict:** **Pass**

---

### Health/Education (`/health` — `health.md`)

| Criterion | Status | Notes |
|-----------|--------|-------|
| Body present | **Pass** | Hero + `#standards`, `#testing`, `#temperament`, `#placement` |
| Meta present | **Pass (stub)** | `[STUB — seo-manager]` |
| Proof pathway / awareness stage | **Pass** | Problem → Product depth; pillars 1–5 distributed across anchors |
| Empty states | **N/A** | Education-first page — inventory gaps handled via prose, not empty-state block |
| Package C prose on `#placement` | **Pass** | Package A, B, and C blocks present; C is education-only (no form); A/B link Begin your inquiry → `/inquire` |
| Evidence grid (5 categories) | **Pass** | Hips, elbows, eyes, cardiac, JLPP Tier 1 one-liners |
| CTA Begin your inquiry | **Pass** | Text links on `#placement` Package A/B blocks |
| No scroll IA | **Pass** | Anchor-based single page — not scroll-jacked home narrative |

**Health verdict:** **Pass**

---

### About (`/about` — `about.md`)

| Criterion | Status | Notes |
|-----------|--------|-------|
| Body present | **Pass** | Hero, operator gap, program principles, Q2-gated contact, Tier 2 affiliations, inquire CTA |
| Meta present | **Pass (stub)** | `[STUB — seo-manager]` |
| Proof pathway / awareness stage | **Pass** | Product stage — operator identity + program principles |
| Empty state (operator gap) | **Pass** | "Our story is being prepared." + `[OPERATOR_STORY]` placeholder + Tier 1 principles |
| CTA hierarchy | **Pass** | Tertiary Begin your inquiry / Join our interest list at page bottom |
| Q2-gated contact | **Defer** | `[LOCATION]` · `[CONTACT]` — structure present; omit until operator confirms — not blocking IA |
| No scroll IA | **Pass** | — |

**About verdict:** **Pass**

---

### Inquire (`/inquire` — `inquire.md`)

| Criterion | Status | Notes |
|-----------|--------|-------|
| Body present | **Pass** | Shared intro, Package A, Package B, form fields, validation, success A vs B, trust footer |
| Meta present | **Pass (stub)** | `[STUB — seo-manager]`; route `/inquire` correct |
| Proof pathway / awareness stage | **Pass** | Most Aware — mutual qualification, not lead capture |
| Package A (Interest list) | **Pass** | Mode headline, expectation, no deposit mention, consent field |
| Package B (Waitlist) | **Pass** | Mode headline, deposit-after-approval addendum, B-only fields + consent |
| Package C on form | **Pass (absent by design)** | Package C lives on `/health#placement` only — correct per foundation lock |
| CTA hierarchy | **Pass** | Submit inquiry primary on form page — only place filled primary is default |
| Form vs PRD §7 / foundation §7 | **Pass** | Shared fields + B-only fields + validation/success microcopy aligned |
| Route `/inquire` not `/apply` | **Pass** | File at correct route; rejects v1 apply path |
| No scroll IA | **Pass** | — |

**Inquire verdict:** **Pass**

---

### Scorecard summary

| Route | Body | Meta | Proof / awareness | Empty states | Package A/B/C | CTA hierarchy | No scroll IA | **Overall** |
|-------|------|------|-------------------|--------------|---------------|---------------|--------------|-------------|
| `/` (`home.md`) | Pass | Pass (stub) | Pass | N/A | N/A | Pass | Pass | **Pass** |
| `/dogs` | Pass | Pass (stub) | Pass | Pass | N/A | Pass | Pass | **Pass** |
| `/health` | Pass | Pass (stub) | Pass | N/A | Pass (C on `#placement`) | Pass | Pass | **Pass** |
| `/about` | Pass | Pass (stub) | Pass | Pass | N/A | Pass | Pass | **Pass** |
| `/inquire` | Pass | Pass (stub) | Pass | N/A | Pass (A/B) | Pass | Pass | **Pass** |

**Must-set readiness for CMO merge:** **5/5 Pass** · **ready_to_merge**

---

## 2. Pillar → route map confirmation

Five messaging pillars from `13-copy-foundation.md` §2:

| Pillar | Primary route(s) | Secondary | Covered in `14-pages/`? |
|--------|------------------|-----------|-------------------------|
| **1 — Standards-aligned type** | `/health#standards` | Home proof cell Standards; `/dogs` when populated | **Yes** — home cell + health anchor |
| **2 — Temperament within ADRK bounds** | `/health#temperament` | About principles; Inquire household context | **Yes** — health anchor + about bullets + form field |
| **3 — Verifiable health transparency** | `/health#testing` | Home proof cell Health; `/dogs/[slug]` Tier 2 | **Yes** — home cell + evidence grid + dogs detail framework |
| **4 — Deliberate placement** | `/health#placement`, `/inquire` | Home proof cell Process; About | **Yes** — placement Package A/B/C + inquire form |
| **5 — Education before sale** | `/health` (full) | Home teaser; Dogs empty-state links | **Yes** — full health page + home education teaser + dogs→health link |

**Nav order lock (reflected in page cross-links):**

```
Home → Dogs → Health/Education → About → Inquire
```

**Pillar matrix (implemented):**

```
Home (proof band) ──→ Dogs ──→ Health/Education ──→ About ──→ Inquire
     │                  │            │                  │           │
  All 5 summary    Pillar 1+3    Pillars 1–5        Pillar 4+5   Pillar 4
```

**Confirmation:** Pillar→route map is **implemented** across the Must set. Pillars are no longer collapsed into scroll sections.

---

## 3. Journey completeness

**Minimum trust path (foundation §3):**

```
Home (proof band) → at least one of: /dogs OR /health → /inquire
```

| Journey element | Required | Current state |
|-----------------|----------|---------------|
| Home exposes proof pathway (4 cells + links) | Yes | **Pass** — proof summary band in `home.md` |
| `/dogs` OR `/health` reachable with substantive copy | Yes | **Pass** — both pages have full body copy |
| `/inquire` as conversion (not `/apply`) | Yes | **Pass** — `inquire.md` at `/inquire` |
| Ideal sequence supported by internal links | `/` → `/health` → `/dogs` → `/about` → `/health#placement` → `/inquire` | **Pass** — cross-links on all Must pages |
| Deep-link `/inquire` shows expectation + trust footer | Yes | **Pass** — Package headers + trust footer with `[RESPONSE_EXPECTATION]` |

**Schwartz multi-page journey:**

| Stage | Target route(s) | Status |
|-------|-----------------|--------|
| 1 Unaware | Home positioning, `/health#standards` | **Pass** |
| 2 Problem Aware | `/health#standards`, `#temperament` | **Pass** |
| 3 Solution Aware | `/health#testing`, `/dogs` | **Pass** |
| 4 Product Aware | `/dogs`, `/about`, `/health#placement` | **Pass** |
| 5 Most Aware | `/inquire` | **Pass** |

**Journey verdict:** **Complete** — minimum trust path is walkable with current artifacts.

---

## 4. Package A / B / C coverage

| Package | Where | Required content | Status |
|---------|-------|------------------|--------|
| **A — Interest list** (Q1 brand-first) | `/inquire` + prose on `/health#placement` | Mode headline; expectation; no deposit; consent | **Pass** |
| **B — Waitlist** (Q1 active) | `/inquire` + prose on `/health#placement` | Mode headline; deposit-after-approval addendum; B consent; extra fields | **Pass** |
| **C — Placement** (education only) | `/health#placement` | Prose on mutual fit / contract / no on-site payment; no form variant | **Pass** |

**Note:** Package A/B prose appears on both `/health#placement` (education context) and `/inquire` (form modes) — intentional per foundation. Package C does **not** appear as a form variant.

---

## 5. v1 supersession check

| v1 artifact | Location | Superseded? | Evidence |
|-------------|----------|-------------|----------|
| Scroll IA (Heritage → Structure → Temperament → Trust → Apply) | `homepage.md` | **Yes** | File marked DEPRECATED; body removed; points to `home.md` |
| Scroll hint "Scroll" | v1 `homepage.md` | **Yes** | Not present in `home.md`; explicit rejection note |
| ★ scroll H2s as site IA | v1 scroll sections | **Yes** | Not used as home scroll; health anchors use education H2s |
| `/apply` route + Apply nav | `apply.md` | **Yes** | File marked DEPRECATED; `inquire.md` is canonical; redirect noted |
| Primary inquire CTA above fold | v1 home | **Yes** | `home.md` states no primary CTA in first viewport |
| Two-route MVP README | `14-pages/README.md` | **Yes** | Reindexed 5 Must routes + deprecated table |
| Prior content-strategist handoff (scroll scorecard) | Obsolete `14-content-strategist.md` | **Yes** | Replaced by this REDO audit |

**v1 supersession verdict:** **Pass** — deprecated files retained with clear supersession banners; Must set uses multi-page IA only.

---

## 6. README freshness check

| README claim | Actual on disk | Status |
|--------------|----------------|--------|
| 5 Must routes listed | All 5 files present | **Pass** |
| `homepage.md` / `apply.md` deprecated | Both marked DEPRECATED with redirect notes | **Pass** |
| Home section map = proof band (no scroll) | Matches `home.md` structure | **Pass** |
| Health anchors documented | Matches `health.md` | **Pass** |
| Inquire Package A/B map | Matches `inquire.md` | **Pass** |
| Operator placeholders table | Aligns with page tokens | **Pass** |

**README verdict:** **Current** — not stale. No CMO action required on index unless merge adds new deferred items.

---

## 7. P1 merge QA (non-blocking)

| # | Item | Owner | Notes |
|---|------|-------|-------|
| 1 | Meta title/description final merge | seo-manager | All 5 routes use `[STUB — seo-manager]` — expected |
| 2 | Operator placeholders | CMO / operator | `[DOG_COUNT]`, `[OPERATOR_STORY]`, `[LOCATION]`, `[CONTACT]`, `[RESPONSE_EXPECTATION]`, `[CLUB_AFFILIATIONS]`, `[HEALTH_TESTS]` — do not invent |
| 3 | Q1 Package B enablement | operator | Copy present; build toggles Package B when Q1 active |
| 4 | Retire deprecated files in build | CMO / dev | Ensure build references `home.md`/`inquire.md` only; 301 `/apply` → `/inquire` |
| 5 | `/dogs/[slug]` detail bios | copy-chief / operator | Framework in `dogs.md`; Tier 2 when inventory verified — deferred, not Must gate |
| 6 | `/litters` route | deferred | Q1-gated — correctly absent from Must set |

---

## 8. Blog

**Deferred — not required for Phase 14 Must scorecard.**

Foundation and PRD treat optional articles on Health/Education as **Should**, not Must. No gap blocks IA gate.

---

## Decisions

1. **Scorecard method:** Pass only when body matches multi-page Phase 12/13 IA; stub meta counts as Pass for IC audit.
2. **File naming:** Canonical home is `home.md` (not `homepage.md`); canonical inquire is `inquire.md` (not `apply.md`).
3. **Deprecated files:** Retained with DEPRECATED banners — acceptable; build must not consume them.
4. **Verdict:** **ready_to_merge** — Must multi-page set is IA-complete for CMO merge; P1 items are SEO meta and operator tokens, not structural gaps.

## Asks for manager (`ask_manager`)

- Peer help needed: **none** — copy-chief Must set delivered
- Clarification needed: **none** — Q1 Package B enablement remains operator-gated; Package A is default for brand-first

## Risks / blockers

- **Operator placeholder drift:** CMO merge must preserve bracket tokens — do not fill with invented contact, story, or health data.
- **Build reference trap:** Phase 9 implementation must wire `home.md` not deprecated `homepage.md`; redirect `/apply` → `/inquire`.
- **Prior approve drift:** Any C-suite approve tied to v1 scroll IA is invalidated — this handoff is the active gate criteria.

## Packs used

- `skills/community/marketingskills/content-strategy/SKILL.md` (pillar / hub routing, journey mapping)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
