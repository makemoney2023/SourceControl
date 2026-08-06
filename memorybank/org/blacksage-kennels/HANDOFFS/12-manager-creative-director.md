---
phase: "12"
manager: creative-director
ics_spawned: [web-designer]
status: ready_for_csuite
recommendation: approve
llm_tier: creative-language
llm_model: composer-2.5
generation_profile: none
fallback_applied: false
---

# Manager brief — Web Design & IA — Phase 12

## In plain English

Phase 12 fully replaces the rejected v1 web spec. Blacksage now ships as a **multi-page, editorial-light site** — Home, Dogs, Health/Education, About, and Inquire — with a **proof summary band** on the homepage instead of a scroll-3D canvas. The design system maps brand tokens to shadcn/ui and Tailwind for Phase 9 rebuild. A 15-row anti-pattern table explicitly bans porting `apps/blacksage-kennels` (R3F, `/apply`, dark cinematic hero). Optional `/litters` is documented as Q1-gated. Image generation was skipped — spec-only phase. Ready for C-suite yes/no; phase not marked complete.

## What we found

- **v1 architecture rejected holistically:** Two-route scroll landing + `/apply` replaced by five Must routes + conditional Litters; `/inquire` locked.
- **Evidence-first Home:** ProofSummaryBand (4 cells: Standards, Health, Dogs, Process) visible above fold on 1280×800 — satisfies PRD V2 and brand §7.1.
- **Component inventory complete:** DogCard, OfaLinkCard, EvidenceGrid, TierBadge, PlaceholderSlot, InquiryForm (Packages A/B), PackageModeHeader — all with props/variants for Phase 9.
- **Tech stack documented:** Next.js App Router file tree, shadcn install list, CSS/Tailwind token mapping, RSC vs client form island, static-first performance targets.
- **A11y & motion aligned:** WCAG 2.2 AA, skip link, 44px tap targets, `prefers-reduced-motion`; no 3D fallback needed because no 3D.

## Next steps

1. **C-suite** — Review `12-web-design.md` for approve / revise / escalate on route map, anti-patterns, and proof-band hero model.
2. **copy-chief (Phase 13)** — Wire copy to proof band cells, empty states, Package A/B headers per §Handoff notes.
3. **Phase 9 engineer** — New project per build checklist; do **not** extend `apps/blacksage-kennels`; TDD on inquire schema and `/apply` redirect.
4. **Operator** — Q1/Q6/Q7 remain launch gates; Tier 1 empty states are designed and honest.

## Summary

- Full replace of scroll-3D v1 with trust-first multi-page IA
- Proof band hero + editorial light shadcn system
- Explicit ban on R3F/WebGL port from prototype app
- IC handoff merged; recommend **approve** for C-suite

## IC handoffs merged

| IC | Handoff path | Status | llm_tier | generation_used |
|----|--------------|--------|----------|-----------------|
| `web-designer` | `HANDOFFS/12-web-designer.md` | done | strong-general | none (spec-only; no API keys) |

## Model routing check

- [x] IC packet had `llm_tier: strong-general`
- [x] `generation_profile: brand-stills` with skip reason documented (no FAL_KEY / INFSH_API_KEY)
- [x] Manager used `creative-language` / composer-2.5; no fallback

## Conflicts resolved

- **Route naming:** `/health` primary with optional `/education` redirect documented; nav label "Health/Education" per PRD — consistent with Phase 10 IA lock.
- **Litters:** Should-tier conditional route — nav omitted when Q1 brand-first; no orphan empty page.
- **Framer Motion:** v1 used scroll sync; v2 allows CSS-only transitions — no conflict with SD4.

## Artifacts for C-suite review

| Path | Scorecard check |
|------|-----------------|
| `docs/projects/blacksage-kennels/business-idea/12-web-design.md` | D2 ✓ · SD4 ✓ · IA ✓ · `/inquire` ✓ · Packages A–C ✓ · proof band ✓ · anti-patterns ✓ · shadcn/Tailwind ✓ · a11y ✓ · no 3D ✓ |

## Escalation tags

- none

## Asks for C-suite

- Confirm **approve** to unlock Phase 13 copy against this IA and component inventory.
- Flag if `/education` should be primary route instead of `/health` — currently `/health` with optional redirect.

## Recommendation

**approve** — ship Phase 12 artifacts as-is. Web design satisfies Phase 10 proceed-to-creative checklist items 1–7 and 9–10, plus PRD failure-layer E1–E5 and U1. Phase not marked complete per orchestrator protocol — C-suite gate pending.

---

## Route map summary (for C-suite)

| Route | Status | Nav | Notes |
|-------|--------|-----|-------|
| `/` | **Must** | Home | ProofSummaryBand hero; tertiary inquire CTA |
| `/dogs` | **Must** | Dogs | Index + `[slug]` detail; honest empty state |
| `/health` | **Must** | Health/Education | EvidenceGrid + education prose |
| `/about` | **Must** | About | Operator story; Q2 contact when confirmed |
| `/inquire` | **Must** | Inquire | Package A/B form; not `/apply` |
| `/litters` | **Should** | Litters | Q1 active only; nav omitted when brand-first |
| `/apply` | **Rejected** | — | Redirect to `/inquire` if legacy links |

**Nav order (locked):** Home → Dogs → Health/Education → About → Inquire
