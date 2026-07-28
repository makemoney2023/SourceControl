# Operator launch blockers — Blacksage Kennels

**Status:** Open — agents must not invent these values  
**Last updated:** 2026-07-27  
**Owner:** Operator (Charles)  

Craft and runbook process fixes do **not** close these gates. Soft-launch waits on the soft-launch minimum below.

---

## Soft-launch minimum (required before any public URL)

| # | Item | Where to set | Example shape (do not invent) |
|---|------|--------------|-------------------------------|
| 1 | Monitored contact email | `apps/blacksage-kennels/lib/constants.ts` → `CONTACT_EMAIL` + env if used | real inbox you check daily |
| 2 | Production site URL | `NEXT_PUBLIC_SITE_URL` | `https://…` |
| 3 | Confirm Tier 1 + Package A | `NEXT_PUBLIC_INQUIRE_PACKAGE=A` (default) | unless Q1 says otherwise |

---

## Hard-launch / Tier 2 gates

| ID | Question | Affects |
|----|----------|---------|
| **Q1** | Program maturity — interest list vs active waitlist / litters? | Package A vs B; `/litters` |
| **Q2** | Geography + NAP (location, phone) | Footer, About, local SEO, JSON-LD |
| **Q6** | Real kennel photography timeline | Hero stills, dogs page, Instagram |
| **Q7** | CRM/ESP destination + response SLA | Replace mailto stub |

Also: Plausible (or override) domain key for analytics go-live.

---

## Optional craft upgrade

| Item | Path |
|------|------|
| Licensed undocked-tail Rottweiler GLB | `apps/blacksage-kennels/public/models/hero-rottweiler.glb` |

Until then, home stays photography/cinema documentary (no WebGL subject).

---

## Current placeholders (do not ship publicly)

From `apps/blacksage-kennels/lib/constants.ts`:

- `[CONTACT_EMAIL]`
- `[CONTACT_PHONE]`
- `[LOCATION]`
- `[HEALTH_TESTS]` / `[DOG_COUNT]` / `[OPERATOR_STORY]` / `[RESPONSE_EXPECTATION]` as applicable

Reply in chat or update MEMORY with real values to unblock soft-launch.
