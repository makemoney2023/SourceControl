# All-on-4 Total Solutions Care Plan — patient brochure

Two-page US Letter brochure for Renew Implant Centre (Tom Szarski, Orléans). Walks a patient through the six-step All-on-4 plan and introduces the team (Dr. Hassan G. Moghadam, Tom Szarski).

**Deliverable:** `All-on-4-Total-Solutions-Care-Plan.pdf`

## Files

| Path | Purpose |
|---|---|
| `brochure.html` | Single source of truth — layout, copy, styles |
| `assets/fonts/` | DM Serif Display + Plus Jakarta Sans (Google Fonts, OFL), referenced by `fonts.css` |
| `assets/img/` | Team photos (Tom cropped from the testimonial thumbnail; Dr. Moghadam headshot) |
| `build.sh` | Renders the PDF with headless Google Chrome and writes `preview/page-*.png` |
| `preview/` | 110 dpi PNG proofs of each page |

## Brand

Colour tokens and type are lifted from `renewimplants.vercel.app`:

- Aqua `#009ce3` / deep `#006ca6` / light `#85d4f2` / pale `#bfebf6`
- Lime accent `#8dc41d` / deep `#5f8a0e` / light `#d8f0a6`
- Carbon `#1a1a1a`, ink-soft `#5b6670`, surface-alt `#eaf7fd`, radius `1.75rem`
- Headlines: DM Serif Display · Body: Plus Jakarta Sans

## Rebuild

```bash
./build.sh
```

Requires Google Chrome (`/Applications/Google Chrome.app`) and `pdftoppm` (`brew install poppler`). Edit copy in `brochure.html`, rebuild, check `preview/` for overflow — each `.page` is a fixed 8.5 × 11 in box with `overflow: hidden`, so anything that no longer fits is clipped rather than spilling onto a third page.
