---
venture: telltail
org: Velocity Agency
phase: "11"
title: Design brief — brand stills (prompts only)
owner: brand-designer
reports_to: creative-director
status: brief written — stills not rendered
date: 2026-08-21
llm_tier: strong-general
llm_model: composer-2.5
generation_profile: brand-stills
generation_used: none
fallback_applied: false
production_status: skipped
skip_reason: explore · outlines only · no store / no paid
photoreal_qa: ""
wire_owner: none
---

# Design brief — Telltail brand stills

**Write this before any render.** Phase 12 (and any later brand-stills lease) generates **from this file**, not from memory. This pass does **not** render Layer B. `generation_used: none`. Cursor built-in image gen is draft-only and is **not** a complete.

Canonical: `/Users/cbsuperpatch/Desktop/ClaudeSkills/docs/projects/telltail/business-idea/11-brand/design/telltail-design-brief.md`

SSOT tokens: `docs/projects/telltail/business-idea/11-brand-system.md`

---

## Packs cited (read before pixels)

| Pack | Why it is in this brief |
|------|-------------------------|
| `skills/community/ui-ux-pro-max-skill/brand/` | Hex roles, type stack, logo don’ts |
| `skills/community/openmontage/.claude/skills/visual-style/` | `style_prompt_full` as the portable look |
| `skills/org/packs/photoreal-stills/` | Camera/lens skeleton, positive-only, reject checklist (run when rendering) |
| `skills/org/packs/production-artifacts/` | Design → Production → Wire; stills land in `11-brand/assets/` as `<slug>-<w>x<h>.{png,webp,jpg}` |
| `skills/community/openmontage/.claude/skills/flux-best-practices/` | FLUX.2 T2I, hex, no negatives (apply on the render pass) |

---

## Look & feel

**One sentence:** Photoreal household rooms; the brand is the *sign you notice* and the card that tells you the next minute — or tells you to stop.

| Token | Value |
|-------|-------|
| Ground | Paper `#F6F2E9` |
| Ink | `#1A1814` |
| Telltale | Sign `#B5522A` (practical lamp / CTA / tick) — never safety green |
| Stop | Refuse `#6B2C28` on refuse surfaces only |
| Type | Newsreader (holding line / wordmark) + IBM Plex Sans (actions) + IBM Plex Mono (60 / confidence) |
| Light | Real kitchen / doorway. One key. Window or overhead. No gel wash. |
| Motion (later UI) | None in stills. If UI moves: 180–240ms ease, no bounce, no sticker pop. |
| Mobile | Hero 16:9 crops to 4:5 without losing the dog’s weight-shift or the phone. CTA-safe right/bottom third. |

**Kids:** Brand may show a household. Do **not** make a “no children in any frame” campaign. Do **not** hero a child as the coaching subject. Kids-in-frame is a product refuse, not a family-exclusion look.

**Store (if it ever exists):** Lifestyle + Education. Never Entertainment.

**Price (if it appears in a still):** `$12/mo` / `$99/yr` · 60 Flash + credits. Never `$9.99`. Never unlimited.

**A5:** No named trainer. No Cesar. No PetGPT avatar.

---

## Component plan (what a still may include)

1. **Hero environment** — kitchen or doorway / visitor. One dog, one adult. Observable body.
2. **Moment card** (optional overlay or device screen) — signals, confidence in Mono/Slate, 1–3 actions, stop-rule. Sign tick. No quote sticker.
3. **Refuse card** — first-class. Oxblood rule. “We will not coach this clip” / stop + escalate. Not a toast.
4. **Wordmark still** — type on Paper, Sign hairline tick, no tail graphic.

Do not composite a speech bubble onto a dog. Do not add a green badge.

---

## style_prompt_full

Portable look for any later generator (visual-style pack). If a tool reads one field, it reads this.

```text
Telltail is dry, quiet, a little literary. Photoreal US/CA household interiors — kitchen at night, doorway in afternoon — documentary color close to paper #F6F2E9 and ink #1A1814, with a single burnt-sienna #B5522A practical as the telltale. People and dogs have real fur and skin, observable weight and mouth and threshold, not cartoon empathy. Typography in frame is a literary serif for the line “See the signal. Do the next right thing — and know when to stop.” and a grotesque for short actions. A refuse, when shown, is an oxblood #6B2C28 rule on a paper card, never a green safety light. No speech-bubble dog, no translator sticker, no celebrity trainer, no kennel void, no show-ring gold, no CGI poster look.
```

---

## Generation prompts (FLUX-positive)

Copy into Plane B as-is. Append the shared suffix. One job per image. No negative-prompt list (FLUX has none — describe the empty scene you want).

**Shared suffix**

```text
Photorealistic documentary photography, natural fur and skin micro-texture, plausible catchlights, consistent shadow from one key. Shot as a still from a real household, not an illustration, not CGI, not a poster. Color grade stays close to paper #F6F2E9 and ink #1A1814; any warm accent reads as burnt sienna #B5522A from a practical lamp, not a safety-green gel.
```

### telltail-1920x1080 — Kitchen moment

- Aspect 16:9 · long edge ≥1920 · `11-brand/assets/telltail-1920x1080.webp`
- Camera: Canon EOS R6, 35mm, f/2.8, Portra 400

```text
An adult in a real US kitchen at night, standing still a few feet from a medium mixed-breed dog whose weight is shifted back, mouth closed, eyes on the person's hands. Linoleum and oak cabinets, a ceiling fixture and a leftover dinner plate on the counter. The person holds an iPhone at chest height as if they just started filming. Observable body language only; no caption on the dog. Shot on a Canon EOS R6, 35mm at f/2.8, Kodak Portra 400, three-quarter doorway-to-kitchen framing, shallow depth on the dog's shoulders, background readable as a kitchen.
```

### telltail-1080x1350 — Doorway / visitor

- Aspect 4:5 · `11-brand/assets/telltail-1080x1350.webp`
- Camera: Leica Q2, 28mm, f/2.8

```text
A front doorway from inside a modest house, afternoon window light. A dog stands at the jamb, body sideways, watching a visitor's shoes on the porch; the owner is a half-step back, one hand on the door, phone in the other. No child in the coaching foreground. Wood trim, storm door glass, a coat hook. Shot on a Leica Q2, 28mm at f/2.8, documentary color, deep enough DOF to read the threshold and the dog's weight shift.
```

### telltail-1440x960 — Visible refuse (device)

- Aspect 3:2 · `11-brand/assets/telltail-1440x960.webp`
- Camera: iPhone 15 Pro, 24mm equivalent

```text
Over-the-shoulder of an iPhone in a kitchen, the screen showing a quiet paper-colored card with a thin oxblood #6B2C28 rule and short instructional type, the card clearly a stop / we-will-not-coach surface, not a cartoon quote. The dog is out of focus beyond the phone, still in the room. Shot on an iPhone 15 Pro, 24mm equivalent, available overhead light, photoreal device glass and fingerprints, no sticker UI, no green badge.
```

### telltail-1080x1350-calm — Calm under a scare

- Aspect 4:5 · `11-brand/assets/telltail-1080x1350-calm.webp`
- Camera: Nikon Zf, 50mm, f/2, Portra 400

```text
Same kitchen as the night kitchen hero, a beat later: the adult has taken one step back, hands empty and low, the dog has space, nobody is hugging the dog's face. Quiet competence, not panic, not a posed smile. Shot on a Nikon Zf, 50mm at f/2, Portra 400, medium shot, natural grain, paper-warm whites #F6F2E9 in the walls.
```

### telltail-1024x1024-mark — Wordmark on Paper

- Aspect 1:1 · `11-brand/assets/telltail-1024x1024-mark.webp`
- Camera: Fuji GFX 50R, 80mm, f/5.6

```text
A printed paper page #F6F2E9 on a wood kitchen table, the word Telltail set in a literary serif in ink #1A1814, a single burnt-sienna #B5522A hairline tick beside the word, no dog illustration, no tail graphic. Soft window light from the left, shot on a Fuji GFX 50R, 80mm at f/5.6, product-still documentary, sharp type, no mock browser chrome.
```

---

## Render routing (later pass — do not run now)

| Stage | Use | Do not |
|-------|-----|--------|
| Ideation | FLUX.2 klein or Cursor gen | Claim complete |
| Mac final | FLUX.2-dev local (`generation_used: local/flux-2-dev`) + `license_basis: bfl-self-hosted-commercial` if commercial | Unspecified “AI art” |
| API final | fal FLUX.2 max/pro | Cursor draft as Layer B |
| Upscale | image-upscaling pack | Stretch in CSS |

`photoreal_qa: pass` only after the photoreal-stills reject checklist at 100% zoom.

---

## Reject before complete (later)

From `photoreal-stills`: photograph not CGI; no plastic fur; plausible eyes; anatomy; one key; DOF matches aperture; no text/logo glitches; no purple glow / terracotta default; no safety green; markings hold if refs exist; hero long edge ≥1920 or upscaled.

Brand-specific fails: quote sticker, talking-tail, Cesar face, kennel void, show-ring, “safe/won’t bite” chip, $9.99, unlimited.

---

## This pass

| | |
|--|--|
| Design brief | **Written** |
| Layer B files | **None** |
| Why | explore · outlines only · no store / no paid |
| wire_owner | none |
