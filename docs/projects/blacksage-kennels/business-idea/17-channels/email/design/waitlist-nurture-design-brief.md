# Design brief — Waitlist nurture (Package B)

**Craft source:** `17-channels/email/waitlist-nurture.md` (Emails 1–4)  
**Brand tokens:** `11-brand-system.md` (Working-Dog Cinema)  
**Status:** locked for production HTML  
**Shell:** [`../html/_shell/README.md`](../html/_shell/README.md)

## Packs cited

| Pack | Decision applied |
|------|------------------|
| `skills/community/inference-sh/email-design/` | 600px single column; inverted pyramid; bulletproof CTA; body ≥14px; preview text; transactional-calm tone |
| `skills/org/packs/production-artifacts/` | Design before HTML; lease `email/html/` |
| `skills/community/marketingskills/emails/` | Milestone cadence locked in MD |

## Look & feel (brand tokens)

| Token | Value |
|-------|-------|
| Outer bg | `#070707` (void) |
| Email card | `#121212` (elevated) |
| Text primary | `#F3EFE6` |
| Text muted | `#A8A49C` |
| CTA education | `#2c3e2d` + white (Emails 1, 3, 4) |
| CTA conversion | `#C4A35A` + `#070707` (Email 2 → `/inquire`) |
| Display | Georgia / serif headline |
| Body | Arial/Helvetica ≥16px, line-height ~1.55 |
| Width | max-width 600px |
| Mood | Mutual-fit process clarity; timeline honesty; zero FOMO |

## Journey HTML map

| # | Subject (craft) | HTML | CTA |
|---|-----------------|------|-----|
| 1 | What we review in a Blacksage inquiry | `waitlist-nurture-1-what-we-review.html` | Our placement process (forest) |
| 2 | Waitlist consideration — next step for your Blacksage inquiry | `waitlist-nurture-2-consideration-invite.html` | Begin your inquiry (tan) |
| 3 | Honest timeline expectations — Blacksage waitlist | `waitlist-nurture-3-timeline-honesty.html` | Review placement process (forest) |
| 4 | Blacksage program update — [brief factual headline] | `waitlist-nurture-4-program-update.html` | View our dogs (forest) |

## Layout

Shared shell + header image with alt. Email 4 is operator-gated: keep placeholder headline/body blocks for verified facts only — never invent litter dates in design or HTML.

## Production notes

- No dollar amounts, deposit figures, or “you are approved” automation
- Assumption language for category timelines must stay labeled
- Header still shared with other journeys (`../assets/blacksage-email-header-1200x400.png`)
