# Design brief — Inquiry welcome (Package A Email 1)

**Craft source:** `17-channels/email/inquiry-welcome.md` (Email 1)  
**Brand tokens:** `11-brand-system.md` (Working-Dog Cinema)  
**Status:** locked for production HTML + header still

## Packs cited

| Pack | Decision applied |
|------|------------------|
| `skills/community/inference-sh/email-design/` | 600px single column; inverted pyramid; bulletproof CTA table; body ≥14px; intentional preview text; header 600×~250–400 |
| `skills/org/packs/production-artifacts/` | Design before HTML/stills; lease `email/html/` + `email/assets/` |
| `skills/org/packs/photoreal-stills/` | Header prompt uses camera/lens + brand hex; draft Cursor gen until FAL |
| `skills/community/marketingskills/emails/` | Journey craft already locked in MD |

## Look & feel

| Token | Value |
|-------|-------|
| Outer bg | `#070707` (void) |
| Email card | `#121212` (elevated) |
| Text primary | `#F3EFE6` |
| Text muted | `#A8A49C` |
| CTA fill | `#C4A35A` (tan key) |
| CTA text | `#070707` |
| Display | Georgia / serif for headline |
| Body | Arial/Helvetica ≥16px, line-height ~1.55 |
| Width | max-width 600px, single column |
| Mood | Documentary calm; prestige kennel — not promo scarcity |

## Layout (email-design inverted pyramid)

1. **Header image** — full-bleed 600px wide photoreal Rottweiler (Working-Dog Cinema)
2. **Headline** — thank-you / interest list confirmation
3. **Preview support** — one muted line (inbox preview intent)
4. **Body** — short paragraphs + “What happens next” bullets
5. **Primary CTA** — bulletproof table button → Health & education
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

## Production targets

| Artifact | Path |
|----------|------|
| Design brief | `17-channels/email/design/inquiry-welcome-design-brief.md` (this file) |
| HTML | `17-channels/email/html/inquiry-welcome-1-interest-ack.html` |
| Header still | `17-channels/email/assets/blacksage-email-header-1200x400.png` |
