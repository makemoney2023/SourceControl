---
phase: "12"
position: web-designer
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
design_brief_path: docs/projects/telltail/business-idea/12-web-design.md#design-brief-required-before-production
photoreal_qa: ""
license_basis: ""
wire_owner: none
wire_checklist_path: ""
wire_notes: "No live site. No DNS. No empty design-system/telltail/ folder created."
skip_reason: "explore · outlines only · no store"
---

# Handoff — Phase 12 Web Designer → Creative Director

## Operator brief (plain English)

Folded the founder lock: the product is **one thread**, not the capture-dashboard-plus-chat-lane I had first. PRD areas A–G are now message/card types inside that thread; marketing may still be Home / How it works / Pricing. No lesson map, no card grid. Layer B still skipped (explore · outlines only · no store) — I did not mkdir `design-system/telltail/`. Ready for your merge. I did not write the manager brief and I did not mark the phase complete.

## What we found

- Founder lock (2026-08-21) tightens US-21: chat **is** the product chrome. Capture, refuse, moment, and paywall-after-Lite-complete happen in-thread. **[F]**
- Marketing trio allowed: Home / How it works / Pricing. `/vs-dog-translator` and `/science` stay later, not home. **[F]/[I]**
- First draft’s `/capture`, `/card/:id`, `/refuse/:id` as primary destinations are superseded. History (Should) is prior threads, not a lesson grid. **[F]** this rewrite
- Tokens unchanged: Sign `#B5522A` as shadcn primary. Holding line unchanged. **[F]** Phase 11
- Layer B still not rendered; no DS folder; no 3D. **[F]**

## Next steps

1. **Creative Director** — merge into the Phase 12 manager brief. I will not write that file.
2. **Later persist pass** — copy the embedded Design brief into repo-root `design-system/telltail/` only when Layer B is leased. Thread is the shell to persist, not a dashboard kit.
3. **Later Phase 9** — implement **one thread**. Phase 9 is not open now.

## Goal (from context packet)

Lock Telltail IA + web outline in `12-web-design.md`. Honest Layer B skip. Then supersede: product surface = one thread. Report to creative-director. Do not spawn. Do not write the manager brief. Do not mark the phase complete.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/12-web-design.md` | Rewritten app IA around the thread; marketing trio; templates; tokens; embedded Design brief; skip status |
| `docs/projects/telltail/business-idea/HANDOFFS/12-web-designer.md` | This handoff (updated after founder lock) |
| `docs/projects/telltail/business-idea/design-system/telltail/` | **Not created** |
| `design-system/telltail/` (repo root) | **Not created** |

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
| design_brief_path | `docs/projects/telltail/business-idea/12-web-design.md` → `## Design brief (required before production)` |
| photoreal_qa | *(empty)* |
| wire_owner | none |
| wire_notes | No site. No Figma export. No DS files. |
| skip_reason | explore · outlines only · no store |

Read `skills/org/packs/production-artifacts/SKILL.md` before claiming complete. This is an honest skip, not a hidden complete.

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Product chrome = one thread. A–G are in-thread objects. Chat is not a side lane.
- Marketing v1 nav = Home / How it works / Pricing (founder lock). Not a lesson catalog.
- shadcn `primary` = Sign `#B5522A`. No `--color-success`.
- Did not mkdir either `design-system/telltail/` path.
- 3D skipped: no product ref; no 3D dog.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none — A5 remains founder-owned; not re-asked

## Risks / blockers

- A later persist pass that ships a dashboard kit “around” the thread will violate the founder lock.
- Default shadcn green / a “success” confidence bar would invert Sign.
- Promoting `/vs-dog-translator` to home reopens the translator shelf.
- Phase 9 scoped eval must not be read as “MVP is open — implement tabs.”

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/org/packs/production-artifacts/` | Craft + embedded Design brief; Layer B skipped with the three-part reason; `wire_owner: none`; no empty DS folder |
| `skills/org/HANDOFF-TEMPLATE.md` | This file’s YAML + operator brief / found / next / packs table |
| `skills/org/MODEL-REGISTRY.md` | Plane A `composer-2.5`; profile `brand-stills`; `generation_used: none`; `fallback_applied: false` |
| `skills/community/ui-ux-pro-max-skill/design-system/` | Primitive → semantic → component; Thread is the first component to persist later |
| `skills/community/openmontage/.agents/skills/web-design-guidelines/` | Labeled composer + attach; live region when a card lands in-thread; no zoom-lock |
| `skills/community/openmontage/.agents/skills/tailwind-design-system/` | Tailwind v4 `@theme` maps `--color-primary` to Sign, not a green scale |

## Do not

- Mark the phase complete
- Write `HANDOFFS/12-manager-creative-director.md`
- Write outside write_lease
- Spawn other positions
- Inherit a parent model (tier is strong-general / composer-2.5)
- Name-drop packs without a decision row
- Render UI stills or treat Cursor gen as complete
- Create an empty `design-system/telltail/` and call it done
- Invent a lesson map, interviews, TAM, a named training voice, or a live URL
