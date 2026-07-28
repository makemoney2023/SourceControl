# Optional Brand Film — Script & Storyboard

**Phase:** 15  
**Working title:** *Evidence in the Details*  
**Duration:** ~45 seconds (30–60s range)  
**Purpose:** Optional trust-first mood piece — **not** v1 Home hero, **not** program proof  
**Status:** Planning only — production deferred until operator photography exists or abstract-only path approved

---

## Production posture

| Rule | Detail |
|------|--------|
| **Not v1 launch blocker** | Home ships with proof band + optional still hero (Q6) — no autoplay video hero |
| **No AI dogs as proof** | Do not generate synthetic Rottweilers labeled or implied as Blacksage stock |
| **Preferred footage** | Operator stills + B-roll from `photography-shot-list.md` (BR01–BR05) |
| **If AI-generated** | Abstract/environment only — empty yard, sage still life, paper texture — labeled **mood / brand** not "our dogs" |
| **CTA** | End card super only: **Begin your inquiry** — no VO hard sell |
| **No FOMO** | No countdown, "limited litter," urgency SFX, or guard-dog tropes |

---

## Creative brief

**One line:** Calm editorial film that mirrors the site — light, evidence-minded, deliberate — without inventing kennel facts.

**Emotional arc:** Quiet confidence → standards literacy → invitation to research → soft inquire prompt.

**Visual motif:** Paper light, sage green, charcoal type, tan accent — **photography-forward cuts**, not cinematic black.

**Audio:** Minimal — optional gentle piano or ambient room tone; no trailer stingers; no VO required. If VO added later, single calm female or male read, Grade 8–10 language.

---

## Script (VO optional — supers carry story if silent)

> **Note:** Bracketed lines are on-screen text only. No invented location, litter, or health claims.

| Time | VO (optional) | On-screen super | Visual |
|------|---------------|-----------------|--------|
| 0:00–0:06 | *(silent or ambient)* | — | Fade in: sage stem on paper-warm field, soft window light |
| 0:06–0:14 | "German Rottweilers. Deliberately bred." | `German Rottweilers. Deliberately bred.` | Cut to empty kennel yard morning light — **no dogs** |
| 0:14–0:24 | "Structure. Temperament. Health clearances that inform every pairing." | `Structure · Temperament · Health` | Slow pan across clean fence line / training space; or operator still montage |
| 0:24–0:34 | "We publish our standards so you can verify before you reach out." | `Verify before you inquire` | Quick calm cuts: breed standard diagram (labeled reference), hands on leash clip, paper texture |
| 0:34–0:42 | *(silent)* | `ADRK / FCI Standard No. 147 aligned breeding` | Optional: approved dog structure shot **only if operator asset exists** |
| 0:42–0:45 | — | `Begin your inquiry` + wordmark | Hold on paper field; tan CTA text; fade out |

**Rejected lines (do not use):** "Limited availability," "Protect your family," "Best lines in the country," "Apply now."

---

## Storyboard

| Beat | Time | Shot | Camera | Light | Function |
|------|------|------|--------|-------|----------|
| 1 | 0:00–0:06 | Sage still life | Static, shallow DOF | Soft window left | Brand warmth — matches Prompt C direction |
| 2 | 0:06–0:14 | Empty program environment | Slow pan R→L or static wide | Morning, natural color | Credibility without fake dogs |
| 3 | 0:14–0:20 | Architecture detail (wood/charcoal gate) | Static medium | Same session | Material honesty |
| 4 | 0:20–0:24 | Standard diagram card | Static | Even | Education anchor — labeled reference |
| 5 | 0:24–0:28 | Hands + leash hardware | Close static | Neutral | Human care signal — no face required |
| 6 | 0:28–0:34 | Paper / typography texture | Static | Flat | Editorial bridge |
| 7 | 0:34–0:42 | Operator dog structure *(conditional)* | Eye-level full body | Overcast | **Only with Tier 2 approval** |
| 8 | 0:42–0:45 | End card | Static | — | CTA + wordmark |

**Edit rhythm:** 4–6s holds; no strobe; no whip cuts; total ~45s.

---

## Audio plan

| Layer | Spec |
|-------|------|
| Music | Optional: solo piano or ambient pad, 60–70 BPM, no drop |
| VO | Optional single voice; if used, ElevenLabs or operator record — calm, precise |
| SFX | Subtle room tone only — no barks as hype |
| Captions | Burn-in supers listed above; full captions for accessibility if published |

---

## Format & delivery specs

| Platform | Aspect | Length | Notes |
|----------|--------|--------|-------|
| Website embed (future) | 16:9 | ≤60s | **Not** Home autoplay hero v1 — About or Health support only |
| Social-later | 9:16 crop from 16:9 | 30–45s | Phase 19+ if ever — not launch |
| File | H.264 MP4 + WebM optional | ≤15MB web | Poster frame required |

---

## Production paths (ranked)

1. **Operator-led (preferred):** Edit stills + BR01–BR05 in DaVinci / FCP; supers in Resolve or Remotion typography card — no AI dogs.
2. **OpenMontage still-led (if keys used later):** `cinematic` or `hybrid` pipeline; FLUX keyframes for B1/B2 only; **skip** video generation of dogs; compose with Remotion text cards.
3. **OpenMontage abstract mood (fallback):** Veo 3.1 via fal for empty environment clips only — explicit `generation_used` label as non-proof mood; store under `15-media/openmontage/` if executed.

**Phase 15 decision:** Path 1 planned; paths 2–3 not executed (see README `skip_reason`).

---

## OpenMontage preflight notes (if manager approves later)

- Pipeline: `cinematic` or `hybrid` — **not** scroll-3D, not character-animation
- Required tools: `FAL_KEY` (available), `ELEVENLABS_API_KEY` (available)
- Human approval gates: script + scene_plan before any paid generation
- Project workspace: `projects/blacksage-evidence-details/` per AGENT_GUIDE Rule Zero

---

## Acceptance criteria (if produced)

- [ ] Zero AI/synthetic dogs implied as Blacksage program stock
- [ ] No invented Tier 2/3 claims in VO or supers
- [ ] CTA reads **Begin your inquiry** only
- [ ] No FOMO audio or copy
- [ ] Captions / supers readable on paper-light palette
- [ ] `prefers-reduced-motion` respected if embedded on site (no essential info motion-only)
