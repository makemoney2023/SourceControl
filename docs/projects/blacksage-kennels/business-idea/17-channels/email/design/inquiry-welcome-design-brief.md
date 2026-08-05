# Design brief — Inquiry welcome (full journey)

**Craft source:** `17-channels/email/inquiry-welcome.md` (Emails 1–4)  
**Brand tokens:** `11-brand-system.md` (Working-Dog Cinema)  
**Status:** locked for production HTML + shared header still  
**Shell:** [`../html/_shell/README.md`](../html/_shell/README.md)

## Packs cited

| Pack | Decision applied |
|------|------------------|
| `skills/community/inference-sh/email-design/` | 600px single column; inverted pyramid; bulletproof CTA table; body ≥14px; intentional preview text; header 600×~250–400 |
| `skills/org/packs/production-artifacts/` | Design before HTML/stills; lease `email/html/` + `email/assets/` |
| `skills/org/packs/photoreal-stills/` | Header prompt uses camera/lens + brand hex; draft Cursor gen until FAL |
| `skills/community/marketingskills/emails/` | Journey craft already locked in MD |

## Look & feel (brand tokens)

| Token | Value |
|-------|-------|
| Outer bg | `#070707` (void) |
| Email card | `#121212` (elevated) |
| Text primary | `#F3EFE6` |
| Text muted | `#A8A49C` |
| CTA fill (education) | `#2c3e2d` (forest) + white label — Emails 1–4 primary CTAs |
| CTA fill (conversion alt) | `#C4A35A` (tan key) + `#070707` text — reserved if inquire CTA appears |
| Display | Georgia / serif for headline |
| Body | Arial/Helvetica ≥16px, line-height ~1.55 |
| Width | max-width 600px, single column |
| Mood | Documentary calm; prestige kennel — not promo scarcity |

## Journey HTML map

| # | Subject (craft) | HTML | CTA |
|---|-----------------|------|-----|
| 1 | Thank you — Blacksage Kennels interest list | `inquiry-welcome-1-interest-ack.html` | Health & education → `/health` (forest) |
| 2 | Thank you — Blacksage Kennels inquiry received | `inquiry-welcome-2-waitlist-ack.html` | Our placement process → `/health#placement` (forest) |
| 3 | Your Blacksage Kennels inquiry — next steps | `inquiry-welcome-3-initial-response.html` | Health & education → `/health` (forest) |
| 4 | You're on the Blacksage interest list | `inquiry-welcome-4-interest-confirm.html` | Explore health & education → `/health` (forest) |

## Layout (email-design inverted pyramid)

1. **Header image** — full-bleed 600px wide photoreal Rottweiler (Working-Dog Cinema)
2. **Headline** — subject-aligned thank-you / next-steps
3. **Preview support** — one muted line (inbox preview intent)
4. **Body** — short paragraphs + expectation-setting bullets
5. **Primary CTA** — bulletproof table button
6. **Footer** — unsubscribe / contact placeholders

## Header still — generation prompt (locked)

```text
Photorealistic wide email header banner photograph, cinematic horizontal crop of a Rottweiler head and shoulders three-quarter profile facing right against near-black void #070707, warm #C4A35A key and rim light on muzzle cheek and eyebrow markings, generous dark negative space on the right third of frame, natural fur detail and wet nose, shot on Leica SL2 with 90mm APO Summicron at f/2.8, Kodak Portra 400 look, low-key documentary prestige, photoreal not illustration, no typography no logos no watermarks no people
```

**Aspect:** 16:9 delivery cropped for ~600×200–400 email header  
**Output path:** `17-channels/email/assets/blacksage-email-header-1200x400.png`  
**Alt text:** `Blacksage Kennels — ADRK-aligned Rottweiler`

## HTML production notes

- Match craft subject/preview/CTA; keep merge placeholders (`[DOMAIN]`, `[CONTACT_EMAIL]`, etc.)
- No price, no reservation, no FOMO language
- Local preview: relative `../assets/…`; ESP Wire needs hosted image URL (operator)
- Email 1 may retain earlier body contrast choices; Emails 2–4 follow cream-on-void tokens above

## Production targets

| Artifact | Path |
|----------|------|
| Design brief | `17-channels/email/design/inquiry-welcome-design-brief.md` (this file) |
| HTML ×4 | `17-channels/email/html/inquiry-welcome-{1..4}-*.html` |
| Header still | `17-channels/email/assets/blacksage-email-header-1200x400.png` |
| Inventory | `17-channels/email/PRODUCTION-INVENTORY.md` |
