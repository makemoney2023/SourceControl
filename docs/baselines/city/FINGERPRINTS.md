# Fingerprints

Every site you build with **scrollcraft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|

| city-placeholder-flight | continuous world / worldflight | five clickable map stops | filmed terrace, live Era `h1`, no kinetic scrub template | one flight, 10 legs, ~11.8vh film, peak 2× via clip length | city holds; Join + disclosure stay in stage | plates-in-glass focus sharpen | neon city | 4500 |
| city-plates-in-flight-omni | continuous world / worldflight | five clickable map stops | filmed terrace, live Era `h1`, SuperPatch logo open first seconds | one flight, 18 legs, ~20.4vh film, peak 2× via skyline leg weight | city holds; Join + disclosure stay in stage | approved plates live inside the neon city film; sparse package accents on ledges | neon city | 4500 |

*(First registered build; future builds must clear both rows.)*

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- `city-placeholder-flight` claims continuous world/worldflight, five map
  stops, the 10-leg ~11.8vh shape, a held city close, and plates-in-glass focus
  sharpen. The registry was an empty seed, so there were no `descent` or
  `orrery` rows to compare for the 4-of-6 gate.
- `city-plates-in-flight-omni` claims the expanded 18-leg ~20.4vh flight, logo
  open on Era, in-world plate placement (glass removed), sparse package accents,
  and the signature move **approved plates live inside the neon city film**.
  Shares grammar, nav, close, and world with `city-placeholder-flight`; differs
  on act-sequence length, hero logo beat, and signature move.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scrollcraft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
