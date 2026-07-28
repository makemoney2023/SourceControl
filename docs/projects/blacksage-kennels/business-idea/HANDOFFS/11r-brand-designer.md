---
phase: "11r"
position: brand-designer
reports_to: creative-director
status: done
verdict_for_manager: ready_to_merge
llm_tier: creative-language
llm_model: composer-2.5-fast
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Brand Designer → Creative Director (Phase 11-R Skill-Max)

## Goal (from context packet)

Elevate brand expression for Territory **B Working-Dog Cinema** within ADRK black/tan family. Supersede flat Option B editorial tokens with void cinema system. Document skills used with decisions tied to packs.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/11-brand-system.md` | 11-R Working-Dog Cinema SSOT |
| `apps/blacksage-kennels/design-system/blacksage-kennels/MASTER.md` | Persisted design-system override |
| `apps/blacksage-kennels/lib/site-config.ts` | Theme tokens void/tan |
| `apps/blacksage-kennels/app/globals.css` | Token CSS variables |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | creative-language |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — no FLUX stills until Q6 photography / operator brief |

## Decisions

- Void ground `#070707` + tan `#C4A35A` (ADRK marking metaphor) — not cream paper, not purple.
- Display **Fraunces** / body **Manrope** for cinema titles without newspaper broadsheet cliché.
- Photography-first hero stills; FLUX packs loaded for direction rules when assets generate later.
- CTA fill = tan, text = void black.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — Q6 photography remains operator gate

## Risks / blockers

- No licensed hero photograph yet — silhouette / documentary plate until Q6.
- FLUX generation deferred (no fake kennel dogs).

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/ui-ux-pro-max-skill/brand/` | Cinema brand essence + anti-AI-default rules |
| `skills/community/ui-ux-pro-max-skill/ui-ux-pro-max/` | design-system persist / MASTER override |
| `skills/community/openmontage/.claude/skills/flux-best-practices/` | No negatives; hex+name; prose prompts when generating |
| `skills/community/openmontage/.claude/skills/visual-style/` | Territory B mood constraints |
| `skills/community/visual-skills/image/` | Hero still direction without fake stock dogs |
| `skills/community/awesome-claude-corporate-skills/04-marketing/brand-guidelines/` | Voice/visual consistency checklist |

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Invent operator photography or dog claims
