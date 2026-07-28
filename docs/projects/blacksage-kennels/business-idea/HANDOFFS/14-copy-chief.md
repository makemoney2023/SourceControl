---
phase: "14"
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

# Handoff — Copy Chief → CMO (Phase 14 REDO)

## Goal (from context packet)

Phase 14 **REDO**: replace obsolete v1 two-route page set (`homepage.md`, `apply.md`) with complete multi-page body copy under `14-pages/` for all Must routes. Use ★ picks and frameworks from `13-copy-foundation.md`. Include stub META sections for CMO + SEO merge. Deprecate `apply.md`; primary inquire route is `inquire.md`. Update README as multi-page index.

**This REDO supersedes** any prior Phase 14 IC deliverable that shipped v1 scroll-IA homepage copy and `/apply` form copy only.

## Artifacts written (write_lease only)

### Phase 14 REDO — Must route page bodies

| Path | Route | Notes |
|------|-------|-------|
| `docs/projects/blacksage-kennels/business-idea/14-pages/home.md` | `/` | ★ H1 "German / ADRK-aligned Rottweilers" + subhead; proof summary band (4 cells); positioning prose; education + about teasers; tertiary inquire band. No scroll IA. No CTA above fold except proof-band links. |
| `docs/projects/blacksage-kennels/business-idea/14-pages/dogs.md` | `/dogs` | ★ "Breeding stock"; Tier 1 empty state (required); Tier 2 populated intro swap-in; DogCard microcopy notes. |
| `docs/projects/blacksage-kennels/business-idea/14-pages/health.md` | `/health` | ★ "Health & education"; anchors `#standards` `#testing` `#temperament` `#placement` with full body copy; evidence grid (5 categories); Package A/B/C prose at `#placement`; ADRK/OFA outbound line. |
| `docs/projects/blacksage-kennels/business-idea/14-pages/about.md` | `/about` | ★ "About Blacksage Kennels"; operator gap copy; program principles; contact placeholders; tertiary inquire CTA. |
| `docs/projects/blacksage-kennels/business-idea/14-pages/inquire.md` | `/inquire` | Package A + Package B locked language (foundation §4–7); shared fields + B extras; validation/success; trust footer. Not `apply.md`. |

### Phase 14 REDO — index and v1 deprecation

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/14-pages/README.md` | Multi-page index (Phase 14 REDO); body + meta stub status per route; v1 supersession notes. |
| `docs/projects/blacksage-kennels/business-idea/14-pages/apply.md` | **Deprecated stub** — superseded by `inquire.md`; `/apply` → `/inquire` redirect in build. |
| `docs/projects/blacksage-kennels/business-idea/14-pages/homepage.md` | **Deprecated stub** — superseded by `home.md`; v1 scroll narrative rejected. |
| `docs/projects/blacksage-kennels/business-idea/HANDOFFS/14-copy-chief.md` | This handoff. |

### Explicitly NOT in scope (unchanged / deferred)

| Item | Status |
|------|--------|
| Page body rewrites | Not required — bodies verified on disk |
| `/dogs/[slug]` detail bios | Operator Tier 2 — framework only in `dogs.md` |
| `/litters` route copy | Q1-gated — deferred |
| META final merge | Stub placeholders — SEO manager + CMO |
| Phase complete flag | **Not set** — orchestrator + C-suite gate |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | creative-language |
| llm_model | composer-2.5-fast |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

- **IA lock:** Home → Dogs → Health/Education → About → Inquire (multi-page, not scroll narrative).
- **Home:** ★ A h1/subhead from foundation §4; proof band ★ bodies locked; rejected v1 Heritage/Structure/Temperament/Trust/Apply scroll sections.
- **CTA:** **Begin your inquiry** only — never Buy / Apply now / Reserve; tertiary on Home, primary submit on `/inquire` only.
- **Dogs:** Tier 1 empty state is launch default; Tier 2 populated intro documented as operator swap-in.
- **Health:** Full section bodies at all four anchors; Package A/B/C prose at `#placement`; no on-site payment UX.
- **Inquire:** Both Package A (interest list) and Package B (waitlist) copy sets included; build selects via Q1 flag.
- **META:** All five Must pages use `[STUB — seo-manager]` title/description — ready for SEO merge.
- **Deprecation:** `apply.md` and `homepage.md` retained as short stubs (not deleted) for git history and explicit redirect guidance.

## Asks for manager (`ask_manager`)

- Peer help needed: `seo-manager` to merge META title/description into page files | none blocking IC delivery
- Clarification needed: none

## Risks / blockers

- Operator placeholders remain bracketed: `[LOCATION]`, `[CONTACT]`, `[OPERATOR_STORY]`, `[OPERATOR_NAME]`, `[DOG_COUNT]`, `[HEALTH_TESTS]`, `[CLUB_AFFILIATIONS]`, `[RESPONSE_EXPECTATION]`.
- Q1 program maturity determines Package A vs B active mode on `/inquire` — both copy sets documented.
- `/dogs/[slug]` per-dog bios require operator Tier 2 inventory.

## Packs used

- `skills/org/positions/copy-chief/SKILL.md`
- `skills/org/HANDOFF-TEMPLATE.md`
- `skills/org/MODEL-REGISTRY.md`
- `skills/community/marketingskills/copywriting/SKILL.md`
- `skills/user/natural-human-voice/SKILL.md`

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Inherit parent model when MODEL-REGISTRY pins a different tier (esp. creative/legal)
