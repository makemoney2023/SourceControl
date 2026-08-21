---
phase: "2"
position: competitive-intelligence-analyst
reports_to: head-of-research
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
production_status: skipped
production_paths: []
design_brief_path: ""
photoreal_qa: ""
license_basis: ""
wire_owner: none
wire_checklist_path: ""
wire_notes: ""
skip_reason: "Phase 2 research craft; not a shippable production phase (not 4B/9/9B/11/12/14/15/17/19/21)."
delegate_budget: 0
tool_status:
  parallel-research: unavailable
  firecrawl: unavailable
  playwright-browser: unavailable
  parallel-cli: not_installed
desk_research: web_search_and_webfetch_2026-08-21
---

# Handoff — Phase 2 competitive landscape → Head of Research

## Operator brief (plain English)

Re-opened the locked KEEP set today. Two products (Pawfessor, Tailo) still disclose Gemini as the video backend — same LVLM class Sci Rep found near-chance on elicited dog faces. The instruction wedge is not empty: Tailo already sells “what to try next,” PetSignalAI already triages relax/monitor/call-a-pro, Pawfessor already meters credits on iOS. What nobody publishes is iOS + 60-second cards + refuse-first + non-translator ASO + a 60-read meter that cannot skip bite-risk. Traini remains the only named app with real public ratings (3.89/295 iOS; Play 5M+ bucket) and it is still the toy pole. Merge this into the market doc; do not treat paid vision-app demand as proven.

## What we found

- Gemini-wrapper twins confirmed this pass: Pawfessor FAQ names Google Gemini multimodal; Tailo terms (updated 2026-08-21) say videos are processed by Google’s Gemini AI. Sci Rep 21 Nov 2025 (Nature page opened): LVLMs drop to near-chance on experimentally elicited Labrador faces; authors say current LVLMs are not yet suitable for reliable canine emotion recognition.
- Meter split is real. Credits/episode: Pawfessor $0.99/$3.99/$7.99 analysis credits; PetSignalAI $4.99 Episode Report. Unlimited inside/near $9–13: Tailo Pro £8.99/mo unlimited analyses; Aplexity $9.99/mo; PN1 $1.99/wk. LunaDogAI is $35/mo unlimited — trainer-substitute ARPU, not Plus.
- Store bands (display only): vision KEEP apps still 0 App Store ratings except Traini 3.89/295. Tailo Play 10+; Dog Advise Play 50+; Traini Play 5M+. Zeros and buckets are not MAU.
- PN1 still ships What to Do *and* Dog Quote (hybrid canary). Play Dog Advise and Aplexity still buy “Translator” ASO. Kinship 16 Apr 2026 re-opened: trainers already named false-confident “relaxed” as the harm.
- Substitutes (not vision peers): Zigzag Premium £9.99/mo or £39.99/yr for 24/7 human behaviourists; Pupford Academy+ lifetime $99.99 on-page (monthly $9.99 reported elsewhere, not re-SKU’d here). Same wallet, zero vision COGS.

## Next steps

1. **Head of Research** — merge this landscape into `02-market-research.md` / evidence base as you lease; do not mark Phase 2 complete. CIA does not write those files.
2. **HoR → COO (via you)** — claims: Como 78% vs-vet ticker and Tailo “trained on thousands of dogs” are unevidenced marketing; Telltail cannot match them on a Flash stack.
3. **Install pass** still blocked (playwright unavailable). Highest-value remaining CIA work is session observation on Pawfessor, Tailo, PetSignalAI, PN1, Traini — ask when a device/tool exists. No new Open founder question.

## Goal (from context packet)

Map 5–10 relevant competitors with cited sources, positioning map, gaps, threats, metering vs unlimited-at-$9–13, vision+instruction vs sticker vs not-vision split. Write only leased paths. Do not spawn. Do not mark the phase complete. Do not write the manager brief. Do not do customer-segment work.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/telltail/business-idea/02-competitive-landscape.md` | Created. Table + 12 profiles (9 KEEP + Traini pole + Pupford/Zigzag neighbors). Positioning map, metering, Gemini twins, Sci Rep, gaps, threats, sources per claim. |
| `docs/projects/telltail/business-idea/HANDOFFS/2-competitive-intelligence-analyst.md` | This file. |

Not written (out of lease): `02-market-research.md`, `02-evidence-base.md`, `02-keyword-demand.md`, `SOURCES/INDEX.md`, manager brief.

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general (packet) |
| llm_model | grok-4.5 (this seat’s runtime; position skill prefers composer-2.5) |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false — did not step down the MODEL-REGISTRY ladder; Plane B unused |

## Production (shippable phases — required)

| Field | Value |
|-------|-------|
| production_status | skipped |
| production_paths | none |
| wire_owner | none |
| wire_notes | none |
| skip_reason | Phase 2 research craft; not a shippable production phase |

## SDK correlation (optional)

| Field | Value |
|-------|-------|
| sdk_runtime | n/a |
| sdk_agent_id | n/a |
| sdk_run_id | n/a |
| sdk_request_id | n/a |

## Decisions

- Comparison set = locked KEEP nine + Traini as volume toy pole + Pupford/Zigzag as substitutes. Did not profile Iterica, PupScan, Dogly, GoodPup, ChatGPT (noise vs 5–10 rule).
- Split every profile vision+instruction vs sticker/empathy vs not-vision.
- Store 0 ratings and Play 10+/50+/5M+ treated as display bands only.
- Como $261B / 500M / 78% ticker and Traini “1,000,000 dog lovers” unused as TAM/users.
- Primary pages re-opened; Phase 0 brief used as a lead list, not as copied evidence. Aplexity US listing this pass did **not** repeat the Phase 0 “doesn’t translate barks” line — not carried forward.
- Pawfessor App Store page fetch timed out; IAP credit prices taken from the indexed App Store IAP widget + homepage/release-notes credit language.
- Neighbor SKU pass (same day): Pupford monthly **$9.99** now first-party (catalog + US IAP id1476456602). Lifetime **disagrees** (web $99.99 vs IAP $199.99). Zigzag Play **500K+** bucket; GB IAP missing monthly £9.99 vs own blog. Conclusion unchanged (not-vision substitutes). GoodPup still unpriced / not added to KEEP.
- Late page pass after first merge: **Aplexity terms name Google Gemini API** (third wrapper, not twins). TM listing has the anti-toy “doesn’t translate barks” block the US page omits. PetSignal analyser pre-bite list now cited. Traini Play **3.6** / IAP **$4.99–$119.99** per item. Como legal entity **16873944 CANADA INC. / COMO Lab**. HoR had already merged; this is a correction note, not new phase work.

## Asks for manager (`ask_manager`)

- Peer help needed: none to spawn. Optional later: **seo-manager** already on Phase 2 for translator-ASO (not requested as a new spawn). **coo / legal-counsel** for Como 78% and refuse-first claims language — only if you want a claims pass this phase.
- Clarification needed: none. Founder locks in the packet were sufficient without `01-problem-framing.md`.

## Risks / blockers

- No installs → refuse UX, Quote-vs-What-to-Do usage, and Gemini refusal behavior unverified (C1/C2).
- Playwright / Firecrawl / parallel-research unavailable; desk WebFetch only. PetSignalAI analyser URL timed out.
- Sci Rep + Gemini twins: shipping confident emotion labels on Flash is an ethical/claims risk, not just a positioning choice.
- Tailo Pro unlimited at £8.99 is a market-education threat to a honest 60-read meter.

## Packs used

| Pack | Decision tied to pack |
|------|------------------------|
| `skills/community/marketingskills/competitor-profiling/` | Same template per competitor (job, stack, price/meter, store band, strengths/weaknesses, sources). Facts over invented traction. |
| `skills/community/awesome-claude-corporate-skills/01-executive-leadership/competitive-analysis/` | 2x2 (vision vs not-vision × competence vs sticker); gaps and threats as strategy, not a feature checklist. |
| `skills/community/marketingskills/competitors/` | Honest strengths (PetSignalAI gates, Tailo next-step, Pawfessor iOS+credits). No “we are better” operator claims. |
| `skills/org/HANDOFF-TEMPLATE.md` | This handoff shape, including operator brief + packs table + model audit. |
| `skills/org/packs/production-artifacts/` | `production_status: skipped` with reason; Phase 2 is not in the shippable matrix. |

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Invent TAM / MAU / attach rates
- Treat Play buckets or 0 ratings as traction
- Copy Phase 0 blindly (Aplexity anti-toy line was dropped when the US page did not repeat it)
- Do customer-segment work (MRA)

<!-- graph:start -->
[[Telltail · Main]] · [[Competitive Intelligence Analyst — Telltail · Main]] · [[Phase 2 — Telltail · Main]]
<!-- graph:end -->
