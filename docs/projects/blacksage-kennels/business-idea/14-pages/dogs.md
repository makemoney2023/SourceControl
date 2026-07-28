# Dogs

**Route:** `/dogs`  
**Phase:** 14 REDO

## Meta (merged from HANDOFFS/14-seo-manager.md)
- **Title:** Breeding stock — Blacksage Kennels
- **Description:** Sire and dam profiles with health clearances when verified. Honest program status while profiles develop — explore health and education resources.

## Document H1

Breeding stock

## Body

### Page hero

**H1:** Breeding stock

---

### Empty state (Tier 1 — required at launch)

**Headline:** Breeding stock profiles are coming soon.

**Body:** Our program is developing. Explore our health and education resources to understand our standards and approach before you inquire.

**Primary link:** [Health & testing →](/health)

**Secondary link:** [Begin your inquiry →](/inquire) *(tertiary styling)*

---

### Populated intro (Tier 2 — when operator inventory exists)

> Replace empty state with this block when `[DOG_COUNT]` and named dogs are verified.

**Intro:** Named sire and dam profiles with health clearances when verified. Structure and temperament inform every pairing in our program.

**Supporting line:** Meet the dogs behind our pairings. Health results link to registries when published.

---

### Dog grid

When populated, display a responsive grid of DogCards. No filters in v1. No price. No "Available" ribbon.

---

### DogCard microcopy notes

| Element | Copy |
|---------|------|
| Role label | Sire / Dam |
| Health link | Health clearances → *(links to detail section or registry when verified)* |
| Card action | View profile → `/dogs/[slug]` |

**Do not include:** Price, deposit amount, "Available now," "Reserve," or availability countdown.

---

### Dog detail (`/dogs/[slug]`) — Tier 2 only

> Full detail copy is operator-supplied. Framework below for Phase 14 reference.

| Element | Copy direction |
|---------|----------------|
| h1 | {Dog name} — operator-supplied |
| Role line | Sire / Dam |
| Health section h2 | Health clearances |
| Per-test rows | Omit entirely when data absent — never "Coming soon" per test on named dog |
| Back link | ← Back to dogs |

**Health section body (when verified):** [HEALTH_TESTS] — link each clearance to OFA or related registry when published.

---

## CTAs / internal links

| Context | Label | Target |
|---------|-------|--------|
| Empty state primary | Health & testing → | `/health` |
| Empty state secondary | Begin your inquiry → | `/inquire` |
| Populated grid | View profile → | `/dogs/[slug]` |
| Detail page | ← Back to dogs | `/dogs` |
