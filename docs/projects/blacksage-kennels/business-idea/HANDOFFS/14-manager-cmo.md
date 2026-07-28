---
phase: "14"
manager: cmo
ics_spawned:
  - copy-chief
  - seo-manager
  - content-strategist
status: ready_for_csuite
recommendation: approve
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
fallback_applied: false
redo: true
supersedes: v1 Phase 14 (homepage.md + apply.md two-route set)
---

# Manager brief — Page content REDO — Phase 14

**Label:** Phase 14 **REDO** — supersedes v1 Phase 14 manager brief and two-route page set.

## In plain English

We replaced the obsolete v1 landing+apply scroll copy with a full multi-page set: Home (proof band), Dogs, Health/Education, About, and Inquire. Every Must page now has body copy and SEO meta. `apply.md` is deprecated in favor of `inquire.md`. Placeholders stay bracketed — no invented location, prices, or FOMO. Ready for C-suite yes/no; the runbook phase is **not** marked complete.

## What we found

- Multi-page IA from Phases 12–13 is encoded: Home proof pathway → Dogs/Health → Inquire; no scroll narrative.
- Inquire carries Package A (interest list) and Package B (waitlist) form copy; Package C lives as education on `/health#placement`.
- SEO meta is proof/inquiry language only — no Apply titles, no invented geography, no prices.
- Content-strategist scorecard: **5/5 Pass** on Must routes after REDO audit.
- v1 files `homepage.md` and `apply.md` are deprecated stubs with redirect notes for build.

## Next steps

1. **C-suite (CEO + peers)** — Approve or revise Phase 14 REDO page artifacts at the hard gate.
2. **Orchestrator** — On approve, advance runbook; do **not** mark Phase 14 ✅ until C-suite gate passes.
3. **Operator** — Supply `[LOCATION]`, `[CONTACT]`/`[CONTACT_EMAIL]`, `[OPERATOR_STORY]`, `[HEALTH_TESTS]`, `[RESPONSE_EXPECTATION]` before launch contact/schema (not blocking this copy gate).

## Summary (5 bullets max)

- Must pages `home` / `dogs` / `health` / `about` / `inquire` ship with **body ✅ + meta ✅**.
- CTA lock held: **Begin your inquiry**; `/apply` → 301 `/inquire`.
- Claims guardrails held: placeholders only; no prices, FOMO, or aggression tropes.
- IC REDO handoffs overwritten; v1 two-route audit discarded.
- collaborates_with: creative-director informed for Phase 9 visual/build (no spawn this phase).

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `copy-chief` | `HANDOFFS/14-copy-chief.md` | done (REDO) | creative-language | none |
| `seo-manager` | `HANDOFFS/14-seo-manager.md` | done (REDO) | fast-ops | none |
| `content-strategist` | `HANDOFFS/14-content-strategist.md` | done (REDO) | strong-general | none |

## Model routing check

- [x] Every IC packet had `llm_tier`
- [x] Creative ICs used correct `generation_profile` (`none` — text only)
- [x] Fallbacks recorded — none applied; ICs used `composer-2.5-fast` per orchestrator packet (registry preferred `composer-2.5`; packet pin honored)

## Conflicts resolved

- **v1 vs REDO handoffs:** First IC wave left obsolete v1 homepage/apply handoffs on disk; CMO re-spawned/resumed once; REDO handoffs overwrite v1.
- **Meta ownership:** copy-chief left stubs; SEO delivered five-route table; CMO merged ★ strings into all Must page files + README status.
- **Route naming:** `/apply` rejected; primary conversion file is `inquire.md`; deprecated stubs retained for clarity.
- **README inventory:** Updated from two-route MVP to five Must routes with deprecation table.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `14-pages/home.md` | Body ✅ · Meta ✅ · Proof band ✅ · Tertiary inquire ✅ |
| `14-pages/dogs.md` | Body ✅ · Meta ✅ · Empty state ✅ |
| `14-pages/health.md` | Body ✅ · Meta ✅ · 4 anchors ✅ · Packages A/B/C ✅ |
| `14-pages/about.md` | Body ✅ · Meta ✅ · Operator gap ✅ · Principles ✅ |
| `14-pages/inquire.md` | Body ✅ · Meta ✅ · Package A/B ✅ · Form + states ✅ |
| `14-pages/README.md` | Multi-page index ✅ · apply.md deprecated note ✅ |
| `14-pages/apply.md` | Deprecated stub ✅ (superseded by inquire.md) |
| `14-pages/homepage.md` | Deprecated stub ✅ (superseded by home.md) |
| `HANDOFFS/14-copy-chief.md` | REDO IC handoff ✅ |
| `HANDOFFS/14-seo-manager.md` | REDO meta + redirect notes ✅ |
| `HANDOFFS/14-content-strategist.md` | REDO IA scorecard 5/5 ✅ |
| `HANDOFFS/14-manager-cmo.md` | This REDO brief ✅ |

## Scorecard self-check (Must pages)

| Must page | Body | Meta title | Meta description | Pass? |
|-----------|:----:|:----------:|:----------------:|:-----:|
| `home.md` | ✅ | ✅ | ✅ | ✅ |
| `dogs.md` | ✅ | ✅ | ✅ | ✅ |
| `health.md` | ✅ | ✅ | ✅ | ✅ |
| `about.md` | ✅ | ✅ | ✅ | ✅ |
| `inquire.md` | ✅ | ✅ | ✅ | ✅ |
| README notes apply→inquire | ✅ | — | — | ✅ |

**Scorecard result:** ALL listed Must pages have body + meta. **Ready for C-suite: YES.**

## Escalation tags

- none

## Asks for C-suite

- Approve Phase 14 REDO page content for hard gate, or return revise notes.
- Confirm build will use `home.md` / `inquire.md` (not v1 stubs) and 301 `/apply` → `/inquire`.
- Operator placeholders remain open items — not blocking copy approve.

## Recommendation

**approve** — ship Phase 14 REDO artifacts as-is for C-suite hard-gate yes/no.
