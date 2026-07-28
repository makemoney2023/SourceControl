# IC Handoff Template

Copy to `docs/projects/<active>/business-idea/HANDOFFS/<phase>-<slug>.md` before returning to your manager.

## Merge gate (managers / orchestrator — hard)

**Reject or send back for revision** if any of the following fail on creative, eng, CRO, brand, or web handoffs:

1. YAML frontmatter includes `status` and `verdict_for_manager`.
2. **Packs used** is a table (or bullets) with **repo-relative pack paths**.
3. Every listed pack has **one concrete decision** tied to it (not just a name-drop).
4. `write_lease` artifact table is present (paths actually written).
5. Risks / blockers and Do-not sections present.
6. Handoff is not a ≤20-line stub when the phase changed user-visible craft.

Exception: pure skip handoffs (e.g. Phase 15 skip) may be short if they only record the skip reason.

```markdown
---
phase: "<id>"
position: "<slug>"
reports_to: "<manager-slug>"
status: done | blocked | needs_input
verdict_for_manager: ready_to_merge | needs_revision | escalate
llm_tier: "<from MODEL-REGISTRY>"
llm_model: "<Cursor model ID actually used>"
generation_profile: none | brand-stills | hero-video | ad-creative
generation_used: none | "<provider/model e.g. fal/veo-3.1>"
fallback_applied: false
---

# Handoff — <Title> → <Manager>

## Goal (from context packet)
…

## Artifacts written (write_lease only)
| Path | Notes |
|------|-------|
| `docs/projects/<active>/business-idea/…` | |

## Model routing
| Field | Value |
|-------|-------|
| llm_tier | … |
| llm_model | … |
| generation_profile | … |
| generation_used | … |
| fallback_applied | yes/no — why if yes |

## Decisions
- …

## Asks for manager (`ask_manager`)
- Peer help needed: `<slug>` for `<why>` | none
- Clarification needed: … | none

## Risks / blockers
- …

## Packs used
| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/…` | One decision this pack caused |

## Do not
- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
- Name-drop packs without a decision row
```
