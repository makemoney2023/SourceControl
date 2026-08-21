---
phase: "11"
position: brand-designer
reports_to: creative-director
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: brand-stills
generation_used: none
fallback_applied: false
production_status: skipped
production_paths: []
design_brief_path: docs/projects/telltail/business-idea/11-brand/design/telltail-design-brief.md
photoreal_qa: ""
license_basis: ""
wire_owner: none
wire_checklist_path: ""
wire_notes: "No brand kit to ship. Explore outlines only."
skip_reason: "explore · outlines only · no store / no paid"
---

# Handoff — Phase 11 Brand Designer → Creative Director

## Operator brief (plain English)

Locked Layer A tokens and motifs so Phase 12 can draw without inventing a second palette. Sign is burnt sienna, refuse is oxblood — no safety green, no kennel gold. Design brief has FLUX-positive hero prose; stills are skipped (explore, outlines only, no store / no paid). Ready for your merge. I did not write the manager brief and I did not mark the phase complete.

## What we found

- CD look holds: telltale *signs*, photoreal kitchen / doorway / visitor, moment card + visible refuse, dry competence. **[F]** packet
- Kids leftover is a product refuse, not a family-exclusion brand — stills may show a household; they must not coach a child-in-frame clip. **[F]** Phase 10 / CD
- Working SKU on any price surface is **$12/mo / $99/yr**, 60 + credits; never $9.99; never unlimited. **[F]**
- A5 stays OPEN — no named voice, no Cesar, no PetGPT face on a card. **[F]**
- Layer B was not rendered; Cursor gen was not used as a complete. **[F]** this pass

## Next steps

1. **Creative Director** — merge into the Phase 11 manager brief. I will not write that file.
2. **Phase 12 web-designer** — consume `11-brand-system.md` + this design brief for DS tokens and the two card motifs.
3. **Later brand-stills lease** — render from the brief’s FLUX bank only; run photoreal QA before `production_status: complete`.

## Goal (from context packet)

Document Telltail brand system (Layer A) + design brief. Honest stills skip this pass. Report to creative-director. Do not spawn. Do not write the manager brief. Do not mark the phase complete.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/11-brand-system.md` | Essence, tokens, imagery/3D, voice, motifs, FLUX bank, anti-patterns, skip status, F/I/A, Phase 12 handoff |
| `docs/projects/telltail/business-idea/11-brand/design/telltail-design-brief.md` | Look/feel, hex, type, style_prompt_full, five FLUX-positive heroes |
| `docs/projects/telltail/business-idea/HANDOFFS/11-brand-designer.md` | This handoff |
| `docs/projects/telltail/business-idea/11-brand/assets/` | Directory only — empty on purpose |

Local Mac only (`/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/`). Not OneDrive.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | brand-stills |
| generation_used | none |
| fallback_applied | no |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| design_brief_path | `docs/projects/telltail/business-idea/11-brand/design/telltail-design-brief.md` |
| photoreal_qa | *(empty)* |
| wire_owner | none |
| wire_notes | No kit to upload. No Figma export this pass. |
| skip_reason | explore · outlines only · no store / no paid |

Read `skills/org/packs/production-artifacts/SKILL.md` before claiming complete. This is an honest skip, not a hidden complete.

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Palette roles locked: Ink `#1A1814` / Paper `#F6F2E9` / Sign `#B5522A` / Refuse `#6B2C28`. Distinct from Blacksage void+tan and from safety green.
- Display = Newsreader; UI = IBM Plex Sans; meter/confidence = IBM Plex Mono.
- Wordmark tick is a Sign hairline, not a tail and not a speech bubble.
- No 3D dog. Phone still-life only if 12 needs a product ref.
- Five FLUX heroes banked; zero rendered.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — A5 remains founder-owned; not re-asked

## Risks / blockers

- Shoppers still compare 60 to unlimited Gemini at ~$10; brand surfaces must not paper that with “serious apps meter.”
- If a later pass renders without the brief, photoreal QA will fail (green gel, sticker UI, kennel grade).
- Name collision (Telltail Dog Training / USPTO) is founder risk-accept — lockup must stay competence-coded and disambiguated.
- K1 / Flash-refuse still kills Plus; brand cannot illustrate a “relaxed” chip to soothe it.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/org/packs/production-artifacts/` | Craft + design brief this pass; Layer B skipped with the three-part reason; `wire_owner: none` |
| `skills/org/packs/photoreal-stills/` | Prompts use camera/lens/film + positive-only; `photoreal_qa` left empty because nothing was rendered |
| `skills/org/HANDOFF-TEMPLATE.md` | This file’s YAML + operator brief / found / next / packs table |
| `skills/org/MODEL-REGISTRY.md` | Plane A `composer-2.5`; profile `brand-stills`; `generation_used: none`; `fallback_applied: false` |
| `skills/community/ui-ux-pro-max-skill/brand/` | Hex + type + logo don’ts written as roles, not a mood paragraph |
| `skills/community/openmontage/.claude/skills/visual-style/` | `style_prompt_full` in the design brief so Phase 12 can consume one portable look |

## Do not

- Mark the phase complete
- Write `HANDOFFS/11-manager-creative-director.md`
- Write outside write_lease
- Spawn other positions
- Inherit a parent model (tier is strong-general / composer-2.5)
- Name-drop packs without a decision row
- Render stills or treat Cursor gen as complete
- Invent interviews, TAM, or a named training voice
