---
phase: "6"
position: pr-manager
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: creative-language
llm_model: composer-2.5
generation_profile: none
generation_used: none
fallback_applied: false
tool_status: "parallel-research MCP unavailable; firecrawl unavailable; used existing Phase 0/2 citations + live web search 2026-08-21. No journalist contacted."
production_status: skipped
production_paths: []
design_brief_path: ""
skip_reason: "Phase 6 PR sidecar is stance-only explore craft, not a shippable Layer B artifact."
wire_owner: none
wire_checklist_path: ""
wire_notes: "No wire. Explore only."
---

# Handoff — Phase 6 PR Manager → CMO

## Operator brief (plain English)

Wrote the explore-only reputation sidecar. Public stance is honesty / refuse / trainer-not-toy; the first clip is banned if it answers the Kinship Traini piece. Kill switch is K1 — if Flash cannot refuse we withdraw the paywall, we do not PR our way out. No pitches, no embargo, no journalists, no launch date, no named voice. Ready for your merge; I did not write `06-gtm-plan.md`.

## What we found

- Kinship + Adopt-a-Pet (Eloise, 16 Apr 2026) still live; Easterbrook “gimmick” / “potentially dangerous” is the article we must not answer. **[F]**
- Sci Rep (Martvel et al., 21 Nov 2025) is the honest hostile-Q: agree, then point at refuse — never a competing %. **[F]**
- Telltail Dog Training (Little Rock, Elizabeth Silverstein) is a live competence-coded collision; Telltale Games is a misspell; do not buy `telltail.com`. **[F]**
- PR pack says skip when the only story is “we exist.” That is this pass. **[I]**
- AC-04.1 must be in the press brief: freeze / whale-eye / stare are gate inputs, not auto-refuse. **[F]**

## Next steps

1. **CMO** — merge this sidecar into `06-gtm-plan.md`. I will not write that file.
2. **Product / CTO** — K1 (Flash-refuse eval) remains yours. Comms cannot close it.
3. **Founder** — A5 named voice before any public authority. No new operator question from this seat.

## Goal (from context packet)

Reputation, launch-comms stance, and claims we will not make. Explore only. Report to CMO. Do not spawn. Do not mark the phase complete. Do not write the manager brief. Do not write `06-gtm-plan.md`. Do not write PMM channels or the 90-day content calendar.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/06-gtm/03-pr-reputation.md` | Thesis, later rooms vs avoid, explore launch outline + K1, claims-we-will-not-make, hostile-Q, F/I/A |
| `docs/projects/telltail/business-idea/HANDOFFS/6-pr-manager.md` | This handoff |

Local Mac only (`/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/`). Not OneDrive.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | creative-language |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | No release drafted for send. Outline in sidecar is explicitly NOT SENT. |
| skip_reason | Explore stance sidecar; Phase 6 Layer B not required this pass |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Skip live PR this pass (pack rule: no story beyond existence).
- Later rooms: trainers + Kinship-class pet media + Sci Rep follow. Avoid: collar-gimmick roundups, translator listicles, Traini/PettiChat newsjacks, “we exist” startup launch.
- One sentence stays the holding line. Press paraphrase is not issued.
- K1 is the product kill. We withdraw the paywall; we do not reframe as a toy.
- Headlines inherit PMM Tier 3. Footers do not un-say a headline.
- Would-be release = inverted-pyramid outline only. No dateline, no quotes, no wire. A5 unnamed → no expert quote.
- Directories, consumer referrals, and a community deferred until a product and A5 exist.
- Name: disambiguate Little Rock if asked; do not squat; Telltale Games is not a story.

## Asks for manager (`ask_manager`)

- Peer help needed: none
- Clarification needed: none

## Risks / blockers

- K1 OPEN. Any public sentence that assumes refuse works is a lie until Product/CTO close the eval.
- A5 OPEN. Interview demand for a credentialed voice cannot be met.
- Name collisions will land in the first Google/journalist pass. Counsel line is COO’s, not this seat.
- First clip that looks like Traini re-triggers Kinship. That is a comms kill (K2), not a debate.
- WTP / film-the-scare still OPEN. Not PR’s to close.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/marketingskills/public-relations/` | Skip live PR: pre-launch, no story beyond “we exist,” no destination. Later mix is trainers + Kinship-class pet media, not tech-launch spray. No newsjack of Traini/PettiChat. |
| `skills/community/inference-sh/press-release-writing/` | Inverted-pyramid outline only. No superlatives, no invented quotes, no dateline, no wire. A5 unnamed blocks an expert quote. |
| `skills/community/marketingskills/co-marketing/` | Later partners = force-free trainers / rescue homework (same audience, different budget). Never collar or translator brands. |
| `skills/community/marketingskills/referrals/` | Defer consumer referral loops. Later shape is trainer → client homework, not “make the dog talk.” |
| `skills/community/marketingskills/community-marketing/` | Later identity = owners who want the next right thing + trainers who will not be embarrassed. No talking-dog community. |
| `skills/community/marketingskills/directory-submissions/` | Rule 1: no live landing page, no pricing page, no product. Defer every directory, including Product Hunt. |
| `skills/org/packs/standing-context/content-persuasion/` | Inverted pyramid + loss aversion (avoided wrong move). Authority only after A5 is named — no fake expert social proof. No numbers we do not have. |

## Do not

- Mark the phase complete
- Write outside write_lease (`06-gtm-plan.md` stays with CMO)
- Spawn other positions
- Inherit a non-creative-language tier
- Name-drop packs without a decision row
- Contact journalists, set an embargo, or invent a launch date
- Copy artifacts to OneDrive / iCloud / Google Drive
