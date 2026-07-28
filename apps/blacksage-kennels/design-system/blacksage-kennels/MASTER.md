# Design System Master — Blacksage Kennels (Working-Dog Cinema)

> **Skill-Max override (2026-07-27):** ui-ux-pro-max CLI recommended Immersive + Modern Dark Cinema pattern/motion. **Rejected** its default cream/purple/Inter palette (violates ADRK black/tan + “no Inter / no purple AI default”). This file is the SSOT.

**Territory:** B — Working-Dog Cinema  
**Product:** Option C Hybrid (scroll-3D home + proof IA)  
**Asset path:** Photography-first LCP; WebGL upgrade when `hero-rottweiler.glb` present  

---

## Pattern (from ui-ux-pro-max — kept)

- **Immersive / Scroll-Triggered Storytelling** on `/`
- Full-bleed interactive stage → guided chapters → proof → climax inquire CTA
- Skip / reduced-motion: static stacked chapters
- Motion dial 8 · Density 4 · Variance 7

## Color (locked ADRK black/tan — cinematic)

| Role | Hex | Token |
|------|-----|-------|
| Ground / void | `#070707` | `--color-ground` |
| Elevated | `#121212` | `--color-elevated` |
| Lifted / glass | `#1A1A1A` | `--color-lifted` |
| Hero fog | `#050505` | `--color-hero-fog` |
| Tan key light | `#C4A35A` | `--color-tan` |
| Tan deep | `#A67C52` | `--color-tan-deep` |
| Tan soft | `#D4B87A` | `--color-tan-soft` |
| Text primary | `#F3EFE6` | `--color-text-primary` |
| Text secondary | `#A8A49C` | `--color-text-secondary` |
| Border | `#2C2C2C` | `--color-border` |
| CTA on tan | `#070707` | `--color-cta-text` |

**Forbidden:** purple accents, cream paper grounds, Inter/Roboto/Arial as display.

## Typography (cinema credit stack)

| Role | Family | Notes |
|------|--------|-------|
| Display / film titles | **Fraunces** | Soft optical serif; large tracking on overlines |
| UI / body | **Manrope** | Clean grotesque; 16px body, 1.55 lh |
| Chapter labels | Manrope 500 uppercase +0.22em | Credit-style |

## Effects (cinema)

- Letterbox bars (top/bottom ~4–6vh) on home scroll stage
- Subtle film grain overlay (CSS, `pointer-events: none`, opacity ~0.06)
- Vignette on WebGL clear color / fog
- Glass chapter cards: `bg-black/55` + `backdrop-blur-md` + tan hairline
- Scroll progress ticks (chapter index)
- Motion 150–400ms for UI; scroll narrative owns camera
- `prefers-reduced-motion`: no WebGL, no grain animation

## Anti-patterns

- Geometric box-dog as final hero identity (stand-in only until GLB)
- Overlay text covering proof-band hit targets
- Purple glow / neon
- Crowded first viewport (stats, chips, badge clusters)

## Pre-delivery (ui-ux-pro-max)

- [ ] Contrast AA+ on tan/text
- [ ] Focus rings visible
- [ ] 44px targets
- [ ] Reduced-motion path
- [ ] No emoji icons
- [ ] cursor-pointer on links
