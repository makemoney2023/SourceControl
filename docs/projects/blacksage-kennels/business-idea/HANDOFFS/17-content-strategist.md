---
phase: "17"
position: "content-strategist"
reports_to: "cmo"
status: done
verdict_for_manager: ready_to_merge
llm_tier: "strong-general"
llm_model: "composer-2.5"
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Social Channel Plan → CMO

## Goal (from context packet)

Produce social calendar themes + channel map for Blacksage Kennels. Credibility and education over litter drops. Optional rented social (FB/IG) per GTM — recommend start with one platform or skip if no capacity.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/17-channels/social/README.md` | Social index, cadence, capacity gate |
| `docs/projects/blacksage-kennels/business-idea/17-channels/social/channel-map.md` | ORB map; FB-first; skip conditions; never-post list |
| `docs/projects/blacksage-kennels/business-idea/17-channels/social/content-pillars.md` | 5 pillars → site routes + Phase 16 SEO themes |
| `docs/projects/blacksage-kennels/business-idea/17-channels/social/calendar-90-day.md` | 12-week themes; draft posts Weeks 1–2, 4, 8, 12 |
| `docs/projects/blacksage-kennels/business-idea/17-channels/social/posting-rules.md` | Do/don't, CTA rules, Q6 gate, litter rare-only |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | false |

## Decisions

- **Default posture:** Skip rented social at Tier 1 OR Facebook only at **3 posts/month** (2–4 range per GTM) — education support, not proof surface.
- **Start-with-one:** Facebook preferred first if any platform; Instagram Q6-gated; TikTok/X/Pinterest skipped v1.
- **Pillar mix:** P2 health transparency highest share (~30%); litter/availability **not a pillar** — rare operator-verified exception only.
- **CTA discipline:** **Begin your inquiry** / **Join our interest list** only; max ~2 inquire CTAs in 90-day calendar; ≥3 education posts between conversion posts.
- **Paid social:** Explicitly skipped (Phase 19 deferred) — no ad accounts in Phase 17.
- **Placeholders:** `[CONTACT_EMAIL]` and `[LOCATION]` referenced in profile checklist only — omit from posts until Q2 verified.
- **Tier 1 default** in calendar unless Q1 = active program; Tier 2 add-ons documented separately.

## Asks for manager (`ask_manager`)

- Peer help needed: **lifecycle-marketer** for **week-level dedup** against email nurture themes before operator executes calendar | none blocking merge
- Clarification needed: **Operator Q1 tier at launch** (Package A vs B) to finalize Week 8/12 CTA variant in calendar | default Tier 1 documented

## Risks / blockers

- **Capacity:** Operator may lack 2–4 hrs/month — recommended skip is correct default; shelfware risk if forced.
- **Q6 gate:** Without verified photography, Instagram should be skipped or text-only — stock dogs prohibited.
- **E1–E8 gate:** Social must not drive traffic if site education stubs remain (GTM lock).
- **Q7:** Bio links to `/inquire` require live inquiry routing before public social launch.

## Packs used

- `skills/community/marketingskills/content-strategy/`
- `skills/community/notfair-seo/content-planner/` (theme scheduling methodology; no GSC data available)

## Do not

- Mark the phase complete
- Write outside write_lease (email/, root `17-channels/README.md`, manager brief)
- Spawn other positions
