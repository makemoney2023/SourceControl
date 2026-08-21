---
phase: "2"
position: seo-manager
reports_to: head-of-research
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: true
production_status: skipped
production_paths: []
design_brief_path: ""
photoreal_qa: ""
license_basis: ""
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
skip_reason: "Phase 2 keyword appendix is not a shippable Layer B production phase"
tool_status:
  ahrefs: unavailable
  google-search-console: unavailable
  app-store-connect: unavailable
  firecrawl: unavailable
  google-suggest-api: blocked_403
  bing-autocomplete: observed_2026-08-21
  itunes-search-api: observed_2026-08-21
---

# Handoff — SEO Manager Phase 2 → Head of Research

## Operator brief (plain English)

Translator is the loud store word and the wrong one: iTunes US search for “dog translator” is a wall of Entertainment/Games toys, while Google “dog body language” and “what to do when dog growls” are article SERPs with no vision app in the observed set. Autocomplete for “dog body language app” does not even offer “app” — people looking for competence are not looking for software. Telltail-the-name already navigates to an Arkansas force-free trainer and podcast; the App Store slug is empty of dog apps. Work can merge; Phase 14 should title Lifestyle + Education and never “translator.”

## What we found

- **[F]** iTunes US `dog translator` (2026-08-21): 14 software results, near-duplicate Entertainment/Games titles; several 10k–40k public ratings; vision+instruction comps (Pawfessor, PN1, Aplexity) absent from that list.
- **[F]** Google `dog body language` / `how to read…` / growling / resource-guarding: PetMD, AKC, Dogs Trust, ASPCA, Preventive Vet — authority articles, no apps in the observed top set.
- **[F]** Bing autocomplete: translator cluster = app/free/game/collar; body-language cluster = chart/guide/pdf; `telltail` → “telltail dog training.”
- **[F]** iTunes `telltail`: TellaTina (social) + an unrelated finance app. No dog listing. Web name is taken.
- **[I]** Primary organic bet is what-to-do-now long-tail + a body-language pillar — not the translator head term.

## Next steps

1. **Head of Research** — merge this appendix into the Phase 2 evidence/market docs. Do not mark the phase complete.
2. **CMO / Legal (via you)** — name collision with Telltail Dog Training (Little Rock) + podcast. Disambiguate; do not squat their exact phrase.
3. **Phase 14 (later)** — ASO: Lifestyle + Education; title words training / behavior / body language; one `/vs-dog-translator` harvest page only.

## Goal (from context packet)

Head vs long-tail; intent clusters (translator/toy vs trainer/body-language vs what-to-do-now); App Store vs Google crowding; map clusters to future routes. Qualitative only. No invented volumes.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/02-keyword-demand.md` | Keyword / search-demand appendix |
| `docs/projects/telltail/business-idea/HANDOFFS/2-seo-manager.md` | This handoff |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general (packet; position skill default is fast-ops) |
| llm_model | grok-4.5 (actually used) |
| generation_profile | none |
| generation_used | none |
| fallback_applied | true — MODEL-REGISTRY prefers `composer-2.5` for strong-general; this seat ran grok-4.5 |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | n/a |
| skip_reason | Phase 2 keyword appendix; not a shippable production phase |

## Decisions

- Do not target translator head terms as primary web or ASO keywords.
- Primary cluster = what-to-do-now; secondary pillar = dog body language.
- Store category lock (recommendation): Lifestyle + Education.
- No volumes recorded.

## Asks for manager (`ask_manager`)

- Peer help needed: `cmo` (or legal via COO) for Telltail name collision vs telltaildogtraining.com — **not spawned from this seat**.
- Clarification needed: none for this appendix.

## Risks / blockers

- No Ahrefs/GSC/Connect — qualitative crowding can be overwritten by a real export later.
- Google Suggest was 403; Bing used as substitute and labeled as such.
- Will-they-film-during-the-incident (HoR E3) is a demand-capture risk, not an SEO metric.
- Name collision is a brand/legal risk, not a ranking tactic.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/notfair-seo/keyword-research/` | Clustered by intent; skipped volume/opportunity scores because no tool export exists. |
| `skills/community/notfair-seo/seo-analysis/` | No site to audit; used only SERP/intent crowding. GSC/PageSpeed skipped (`tool_status: unavailable`). |
| `skills/community/marketingskills/aso/` | Lifestyle + Education; violently non-translator title/keywords; Entertainment/Games treated as gimmick tax. |
| `skills/community/marketingskills/ai-seo/` | Flagged B/C question clusters as GEO-relevant; forbade AI-only pages this phase. |
| `skills/org/HANDOFF-TEMPLATE.md` | This file follows the IC template. |

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Invent search volumes
- Name-drop packs without a decision row
