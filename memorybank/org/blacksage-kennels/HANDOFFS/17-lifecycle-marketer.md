---
phase: "17"
position: lifecycle-marketer
reports_to: cmo
status: done
verdict_for_manager: ready_to_merge
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: none
generation_used: cursor-draft
fallback_applied: false
production_status: complete
production_paths:
  - docs/projects/blacksage-kennels/business-idea/17-channels/email/html/inquiry-welcome-1-interest-ack.html
  - docs/projects/blacksage-kennels/business-idea/17-channels/email/html/inquiry-welcome-2-waitlist-ack.html
  - docs/projects/blacksage-kennels/business-idea/17-channels/email/html/inquiry-welcome-3-initial-response.html
  - docs/projects/blacksage-kennels/business-idea/17-channels/email/html/inquiry-welcome-4-interest-confirm.html
  - docs/projects/blacksage-kennels/business-idea/17-channels/email/PRODUCTION-INVENTORY.md
  - docs/projects/blacksage-kennels/business-idea/17-channels/email/assets/blacksage-email-header-1200x400.png
design_brief_path: docs/projects/blacksage-kennels/business-idea/17-channels/email/design/inquiry-welcome-design-brief.md
photoreal_qa: draft
skip_reason: "cursor-draft header until HF_TOKEN local FLUX.2-dev or FAL_KEY re-render"
wire_owner: operator
wire_checklist_path: docs/projects/blacksage-kennels/business-idea/WIRE/phase-17-email.md
wire_notes: "ESP import + merge tags. Host header via publish-blacksage-assets.sh. Full inventory 15 HTML — see PRODUCTION-INVENTORY.md."
---

# Handoff — Lifecycle Marketer → CMO

## Goal (from context packet)
Produce Layer B HTML for one send-ready inquiry welcome email from existing craft (Blacksage proof; no stills/video).

## Artifacts written (write_lease only)
| Path | Notes |
|------|-------|
| `docs/projects/blacksage-kennels/business-idea/17-channels/email/design/inquiry-welcome-design-brief.md` | email-design + brand tokens → look/feel + header prompt |
| `docs/projects/blacksage-kennels/business-idea/17-channels/email/html/inquiry-welcome-1-interest-ack.html` | Built from design brief |
| `docs/projects/blacksage-kennels/business-idea/17-channels/email/assets/blacksage-email-header-1200x400.png` | From brief header prompt |

## Model routing
| Field | Value |
|-------|-------|
| llm_tier | strong-general |
| llm_model | composer-2.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no |

## Production (shippable phases — required)
| Field | Value |
|-------|-------|
| production_status | complete |
| production_paths | HTML above |
| wire_owner | operator |
| wire_notes | ESP import remaining |
| skip_reason | n/a — HTML + header from design brief |

## Packs used
| Pack path | Decision |
|-----------|----------|
| `skills/org/packs/production-artifacts/` | Lease `email/html/`; Wire = operator |
| `skills/community/inference-sh/email-design/` | Design brief: inverted pyramid, 600px, bulletproof CTA, header rules |
| `skills/org/packs/photoreal-stills/` | Header prompt locked in design brief before gen |
| `skills/community/marketingskills/emails/` | Craft already in `inquiry-welcome.md` |

## Email HTML QA
- [x] File under `17-channels/email/html/`
- [x] Max-width ~600px, single column
- [x] Primary CTA bulletproof table button
- [x] Header image with alt text (from design brief prompt)
- [x] Unsubscribe placeholder present
- [x] Body font 16px
- [x] Matches craft subject/preview/CTA intent

## Asks for manager (`ask_manager`)
- None for this proof.

## Risks / blockers
- Placeholders `[DOMAIN]`, `[CONTACT_EMAIL]`, `[RESPONSE_SLA]` still operator-owned (known soft-launch blockers).
- Header still is Cursor draft until FAL key enables FLUX.2 finals.

## Do not
- Quote price or imply reservation/approval in email.
- Generate Layer B without a design brief citing email-design.
