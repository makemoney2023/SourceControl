---
phase: "11"
manager: creative-director
ics_spawned: [brand-designer]
status: ready_for_csuite
recommendation: approve
llm_tier: creative-language
llm_model: composer-2.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Brand System — Phase 11

## In plain English

Phase 11 fully replaces the rejected v1 brand system. Blacksage now reads as a calm, editorial kennel brand that leads with proof — health categories, dog profiles when available, and education — before asking anyone to inquire. The old cinematic scroll-3D dark hero is explicitly banned and listed as an anti-pattern. Colors, type, logo, voice, photography rules, and proof UI patterns are documented for Phase 12 web design. Image generation was skipped because no API keys are configured; placeholder and FLUX prompt rules are written instead. The brand is ready for C-suite yes/no before Phase 12 starts.

## What we found

- **v1 failure addressed holistically:** Old doc centered R3F scroll narrative, dark full-bleed black, `/apply`, and wordmark-only hero — all rejected in §10 with replacements.
- **Strategic locks encoded:** D2 trust-first, SD4 no 3D, locked IA, `/inquire` + "Begin your inquiry," Packages A–C — all present and traceable to Phase 10 checklist.
- **Prestige redefined:** Evidence density via proof summary band, OFA link cards, evidence grids, tier badges — not visual spectacle.
- **Light editorial default:** `#FAFAF8` paper background foregrounds real operator photography when Q6 delivers; charcoal is accent bands only.
- **Launch gates unchanged:** Operator photography (Q6), health inventory, Q1/Q7 remain content population gates — brand system uses Tier 1 defaults and honest placeholders.

## Next steps

1. **C-suite** — Review `11-brand-system.md` for approve / revise / escalate on hard locks (especially §10 anti-patterns and light-vs-dark default).
2. **Operator** — Schedule Q1/Q2/Q6/Q7 interview before Phase 14 content lock (photography drives Tier 2 Dogs hero).
3. **Phase 12 web-designer** — Implement §3 tokens, §4 type, §7 proof components, §14 handoff; do not port `apps/blacksage-kennels` without §10 review.
4. **Phase 14 brand-designer** — Run §12 FLUX prompts when API keys available; replace placeholders with operator photos per §6.

## Summary

- Full replace of v1 cinematic 3D brand with trust-first editorial system
- §10 anti-pattern table blocks R3F/WebGL/dark-default regression
- Proof UI vocabulary defined for Health/Dogs modules
- IC handoff merged; recommend **approve** for C-suite

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `brand-designer` | `HANDOFFS/11-brand-designer.md` | done | strong-general | none (no API keys) |

## Model routing check

- [x] IC packet had `llm_tier: strong-general`
- [x] `generation_profile: brand-stills` with skip reason documented (no FAL_KEY / INFSH_API_KEY)
- [x] Manager used `creative-language` / composer-2.5; no fallback

## Conflicts resolved

- **Dark vs light default:** IC chose editorial light for photography-forward trust; creative-director confirms — aligns with PRD V2/V3 and v1 failure on spectacle-without-authentic-media.
- **Tagline:** "Power with nobility" demoted to optional; primary framing is "Evidence-led prestige" — consistent with Phase 3 PMM direction.
- **Typography:** Cormorant (v1) replaced with Libre Baskerville — editorial credibility on light paper; approved.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/11-brand-system.md` | D2 ✓ · SD4 ✓ · IA ✓ · `/inquire` ✓ · Packages A–C ✓ · §10 anti-patterns ✓ · proof UI ✓ · no Tier 3 visuals ✓ |

## Escalation tags

- none

## Asks for C-suite

- Confirm **approve** to unlock Phase 12 web design against this brand system.
- Flag if operator prefers retaining dark-mode-first aesthetic — would contradict SD4/SD8 evidence-density direction and Phase 10 GO brief.

## Recommendation

**approve** — ship Phase 11 artifacts as-is. Brand system satisfies Phase 10 proceed-to-creative checklist items 1–7 and 9–10. No upstream revision required. Phase not marked complete per orchestrator protocol — C-suite gate pending.

---

## How v2 differs from rejected v1 (executive summary)

| Dimension | v1 (rejected) | v2 (Phase 11) |
|-----------|---------------|---------------|
| Brand hook | Cinematic scroll-3D spectacle | Evidence density / proof-first |
| UI default | Full-bleed black `#0A0A0B` | Editorial light paper `#FAFAF8` |
| Hero | Wordmark + R3F camera narrative | Proof summary band + positioning |
| Tech | R3F, WebGL, scroll-jacking | Static-first; 3D banned v1 |
| Route | `/apply` culmination | `/inquire` after trust nav |
| IA story | Heritage → Apply scroll arc | Home → Dogs → Health → About → Inquire |
| Prestige signal | Visual wow without photos | OFA cards, evidence grids, real photography |
| Motion | Scroll-linked camera beats | Minimal functional transitions only |
