---
phase: "13"
manager: "cmo"
label: REDO
supersedes: "v1 manager brief (scroll/heritage + /apply era)"
ics_spawned:
  - copy-chief
  - content-strategist
  - product-marketing-manager
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Copy Foundation REDO — Phase 13

## In plain English

We fully replaced the v1 copy system (cinematic one-page scroll + `/apply`) with a trust-first multi-page word system aligned to the Phase 12 web redesign. Home leads with a four-cell proof band; Dogs/Health/About have honest empty states; inquiry lives at `/inquire` with Package A/B language and the locked CTA **Begin your inquiry**. No Buy/Apply now, no heritage-scroll H2s. Ready for C-suite yes/no — phase not marked complete in the runbook.

## What we found

- **REDO replaces v1 entirely:** `13-copy-foundation.md` is a full overwrite — multi-page IA (`/`, `/dogs`, `/health`, `/about`, `/inquire`); v1 ★ scroll H2s ("Born of German standard." / "Built to standard." / etc.) explicitly rejected as site IA.
- **Proof before inquire:** Home ★ h1 "German / ADRK-aligned Rottweilers" + proof band (Standards / Health / Dogs / Process); tertiary **Begin your inquiry** below fold only.
- **Empty states locked:** Dogs — "Breeding stock profiles are coming soon."; About — honest operator-story gap; Health categories always Tier 1 publishable.
- **Package A/B distinct:** A "Join our interest list" (no deposit); B "Submit inquiry for waitlist consideration" (deposit-after-approval, no amount); C education-only on `/health#placement`.
- **Claims discipline:** Tier 1/2/3 + badges; placeholders for `[LOCATION]`, `[HEALTH_TESTS]`, `[OPERATOR_STORY]`, etc. — zero invented kennel facts.

## Next steps

1. **C-suite / CEO** — Review REDO `13-copy-foundation.md` + this brief; approve or revise.
2. **Orchestrator** — After approve, advance Phase 14 (pages) via `cmo`; do **not** treat prior v1 C-suite approve as still binding for scroll IA.
3. **Operator (non-blocking):** Q1 package mode, Q2 contact, health inventory, operator story, Q7 response SLA — placeholders ship until confirmed.
4. **Optional:** Refresh `.agents/product-marketing.md` conversion narrative to multi-page path (PMM note; not blocking).

## Summary (5 bullets max)

- Three ICs completed REDO handoffs; CMO merged into SSOT copy foundation; **RUNBOOK not marked ✅**.
- CTA lock holds: **Begin your inquiry** / Submit inquiry / Inquiry received — never Buy/Apply now/Reserve.
- Tagline "Power with nobility." demoted to optional footer; evidence-led Home h1 leads.
- Minimum trust path: Home → (`/dogs` or `/health`) → `/inquire`.
- Blog deferred; education hub is `/health`.

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `copy-chief` | `HANDOFFS/13-copy-chief.md` (REDO) | done | creative-language | none |
| `content-strategist` | `HANDOFFS/13-content-strategist.md` (REDO) | done | strong-general | none |
| `product-marketing-manager` | `HANDOFFS/13-product-marketing-manager.md` (REDO) | done | strong-general | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative IC (copy-chief) used `creative-language` / composer-2.5-fast; generation `none`
- [x] Content-strategist + PMM used `strong-general` / composer-2.5-fast
- [x] CMO merge used `frontier-reasoning` / grok-4.5
- [x] No fallbacks applied

## Conflicts resolved

- **v1 vs REDO on disk:** Prior foundation + handoffs were scroll/`/apply` era — **fully superseded** by IC REDO writes + CMO merge. Do not merge from `13-content-strategist-notes.md` / `13-pmm-notes.md` (v1 artifacts).
- **Tagline as hero vs evidence-led:** Adopted PMM + brand Phase 11 — Home h1 evidence-led; "Power with nobility." optional supporting/footer only.
- **Package A/B microcopy variants:** Adopted **PMM locked strings** for PackageModeHeader / expectation / deposit addendum; copy-chief ★ headlines retained where they matched.
- **Pillar→scroll vs pillar→route:** Adopted content-strategist compound route map; nav order unchanged from Phase 12.
- **v1 ★ H2 scroll picks:** Banned as IA; listed only as rejected examples — not restored as section system.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/13-copy-foundation.md` | REDO SSOT — voice, multi-page pillars, Schwartz routes, ★ headlines, proof band, Package A/B, empty states, CTA, claims, objections |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/13-manager-cmo.md` | This REDO brief |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/13-copy-chief.md` | IC REDO audit |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/13-content-strategist.md` | IC REDO audit |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/13-product-marketing-manager.md` | IC REDO audit |

## Escalation tags

- none

## Asks for C-suite

- **Approve** Phase 13 Copy foundation REDO for Phase 14 pages work.
- Confirm prior v1 Phase 13 approve is **superseded** (scroll IA no longer authoritative).
- Operator gaps may ship as placeholders — not a revise reason unless C-suite wants hard gate on Q1/Q2 first.

## Recommendation

**approve** — ship REDO artifacts for C-suite gate. Do **not** mark RUNBOOK-TRACKER ✅ until orchestrator + C-suite complete. Do **not** write csuite-review from this seat.
