---
phase: "14r"
position: copy-chief
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: creative-language
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Copy Chief → CMO (Phase 14-R Skill-Max copy restore)

## Goal (from context packet)

Restore Phase 14 kennel substance on home chapters after cinema craft introduced film-metaphor placeholders (“Feature Presentation”, “The cast”, “filmed with intent”). Align `HOME_SCROLL_CHAPTERS` to `14-pages/home.md`.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `apps/blacksage-kennels/lib/home-scroll-story.ts` | Phase 14 titles/bodies/kickers/links |
| `apps/blacksage-kennels/lib/home-scroll-story.test.ts` | Anti-film-jargon regression test |
| `apps/blacksage-kennels/lib/constants.ts` | Proof band dogs cell → “Profiles coming soon” |
| `apps/blacksage-kennels/components/home/CinemaDocumentaryHome.tsx` | Kickers; remove Feature Presentation / End title |
| `docs/projects/blacksage-kennels/business-idea/14-pages/README.md` | Hybrid note (via SSOT freeze) |
| `docs/projects/blacksage-kennels/business-idea/14-pages/home-scroll-chapters.md` | Chapter copy SSOT (if present — keep aligned) |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | creative-language |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

- Hero subhead = foundation ★: “Evidence-led breeding — health transparency…”
- Inquire chapter title = “Ready after reviewing our program?”
- Dogs title = “Breeding stock” (not “The cast”)
- Cinema chrome may use film *layout*; copy must stay kennel-specific.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none

## Risks / blockers

- Operator placeholders in footer/constants still bracketed — not copy inventable.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/org/positions/copy-chief/SKILL.md` | Role ownership of page voice |
| `skills/community/marketingskills/copywriting/SKILL.md` | Evidence-led kennel claims |
| `skills/user/natural-human-voice/SKILL.md` | Cut film preamble; lead with substance |
| `docs/projects/blacksage-kennels/business-idea/13-copy-foundation.md` | ★ H1/subhead + CTA locks |
| `docs/projects/blacksage-kennels/business-idea/14-pages/home.md` | Canonical home section copy |

## Do not

- Mark the phase complete
- Invent contact/NAP/dog bios
- Restore Heritage→Apply v1 scroll section titles
