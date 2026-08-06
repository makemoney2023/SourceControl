# Superpatch Income Stack Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold Superpatch agency portfolio and ship a mobile-first animated Income Stack presentation with on-slide copy over the provided concept frames.

**Architecture:** Peer org `superpatch` → customer `affiliates` → initiative `income-stack-deck`. Vite/React app at `apps/superpatch-income-stack` drives 15 scroll slides from `slides.ts`, animates concept PNGs with GSAP ScrollTrigger, and overlays trimmed source copy. Optional hero videos later.

**Tech Stack:** TypeScript, Vite, React 19, Tailwind v4, GSAP + ScrollTrigger, Vitest, portfolio registry (`projects/registry.json` v2)

## Global Constraints

- Do not change provided compensation numbers or stack definitions
- Do not nest under `blacksage-kennels` / Velocity customers
- Every slide: eyebrow + headline + body (30–50 words) + disclosure on money slides
- Hybrid motion: GSAP on all plates; AI video optional later for ≤5 heroes
- Spec: `docs/superpowers/specs/2026-08-06-superpatch-income-stack-deck-design.md`
- Branch: `feature/superpatch-income-stack-deck`

## File map

| Path | Responsibility |
|------|----------------|
| `tools/org-command-center/server/create-org.ts` | Create peer agency in registry |
| `tools/org-command-center/server/create-org.test.ts` | TDD for createOrg |
| `projects/registry.json` | Register superpatch / affiliates / income-stack-deck |
| `docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/**` | Initiative workspace + concept assets |
| `apps/superpatch-income-stack/**` | Animated deck app |
| `apps/superpatch-income-stack/src/data/slides.ts` | Copy + media SSOT |
| `apps/superpatch-income-stack/src/data/slides.test.ts` | Copy/disclosure tests |

---

### Task 1: createOrg + portfolio scaffold

**Files:**
- Create: `tools/org-command-center/server/create-org.ts`
- Create: `tools/org-command-center/server/create-org.test.ts`
- Modify: `projects/registry.json` (via createOrg + createCustomer + createInitiative)
- Create: initiative workspace under `docs/orgs/superpatch/...`
- Copy: `income-stack-deck/*` → initiative `business-idea/assets/concepts/`

**Interfaces:**
- Produces: `createOrg(repoRoot, { name, slug?, activate? }) => { org, name, active }`
- Produces: registry entry `orgs.superpatch` with customer `affiliates` initiative `income-stack-deck`

- [ ] **Step 1: Failing test for createOrg**

```ts
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { createOrg } from "./create-org";
import { loadRegistry } from "./paths";

function miniRepo() {
  const root = mkdtempSync(join(tmpdir(), "create-org-"));
  mkdirSync(join(root, "projects"), { recursive: true });
  writeFileSync(
    join(root, "projects/registry.json"),
    JSON.stringify({
      version: 2,
      active: { org: "velocity-agency", customer: "demo", initiative: "main" },
      orgs: {
        "velocity-agency": {
          name: "Velocity Agency",
          customers: {
            demo: {
              name: "Demo",
              initiatives: {
                main: {
                  name: "Main",
                  businessIdea: "docs/projects/demo/business-idea",
                  memory: "docs/projects/demo/MEMORY",
                },
              },
            },
          },
        },
      },
    }),
  );
  return root;
}

describe("createOrg", () => {
  it("adds a peer agency without removing velocity-agency", () => {
    const root = miniRepo();
    const result = createOrg(root, { name: "Superpatch", slug: "superpatch", activate: false });
    expect(result.org).toBe("superpatch");
    const reg = loadRegistry(root);
    expect(reg.orgs["velocity-agency"]).toBeTruthy();
    expect(reg.orgs.superpatch.name).toBe("Superpatch");
    expect(reg.orgs.superpatch.customers).toEqual({});
    expect(reg.active.org).toBe("velocity-agency");
  });
});
```

- [ ] **Step 2: Run test — expect FAIL (module missing)**

```bash
cd tools/org-command-center && npx vitest run server/create-org.test.ts
```

- [ ] **Step 3: Implement createOrg**

Mirror `create-customer.ts` patterns: `ensureDefaultOrg(loadRegistry)`, validate slug, reject duplicate org, save with empty `customers`, optional activate (if activate, set active.org but keep customer/initiative only if valid — for empty org, activate should set org and leave customer empty OR require follow-up). Prefer: `activate: true` sets `{ org, customer: "", initiative: "" }` only if ActiveRef allows empty — check type. Safer: activate only after customer exists; createOrg always `activate: false` by default.

```ts
export function createOrg(repoRoot: string, input: { name: string; slug?: string; activate?: boolean }) {
  // validate, ensureDefaultOrg, add orgs[slug] = { name, customers: {} }, saveRegistry
}
```

- [ ] **Step 4: Tests pass**

- [ ] **Step 5: Scaffold live portfolio via node one-liner using createOrg → createCustomer(org:superpatch, slug:affiliates, activate:false) → createInitiative(org, customer:affiliates, slug:income-stack-deck, activate:true)**

Then copy concepts:

```bash
mkdir -p docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/concepts
cp income-stack-deck/*.png income-stack-deck/README.md \
  docs/orgs/superpatch/customers/affiliates/initiatives/income-stack-deck/business-idea/assets/concepts/
```

- [ ] **Step 6: Commit**

```bash
git add tools/org-command-center/server/create-org.ts tools/org-command-center/server/create-org.test.ts \
  projects/registry.json docs/orgs/superpatch
git commit -m "feat(occ): add createOrg and Superpatch Income Stack portfolio"
```

---

### Task 2: Vite app scaffold + slides data (TDD)

**Files:**
- Create: `apps/superpatch-income-stack/` (package.json, vite.config.ts, tsconfig, index.html, src/main.tsx, src/App.tsx, src/styles/tokens.css)
- Create: `apps/superpatch-income-stack/src/data/slides.ts`
- Create: `apps/superpatch-income-stack/src/data/slides.test.ts`
- Create: `apps/superpatch-income-stack/public/concepts/` (copy PNGs)

**Interfaces:**
- Produces:

```ts
export type SlideAccent = "blue" | "green" | "orange" | "violet" | "multi" | "cool" | "red";
export type Slide = {
  id: string;
  conceptSrc: string;
  heroVideoSrc?: string;
  accent: SlideAccent;
  eyebrow: string;
  headline: string;
  body: string;
  disclosure?: string;
  flywheelArc?: "product" | "brand" | "income" | "development" | "all";
  motionPreset: string;
  requiresDisclosure: boolean;
};
export const SLIDES: Slide[];
export function wordCount(text: string): number;
export function assertSlidesValid(slides: Slide[]): void;
```

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { SLIDES, wordCount, assertSlidesValid } from "./slides";

describe("SLIDES", () => {
  it("has 15 slides with copy fields", () => {
    expect(SLIDES).toHaveLength(15);
    for (const s of SLIDES) {
      expect(s.eyebrow.length).toBeGreaterThan(0);
      expect(s.headline.length).toBeGreaterThan(0);
      expect(wordCount(s.body)).toBeGreaterThanOrEqual(30);
      expect(wordCount(s.body)).toBeLessThanOrEqual(50);
    }
  });

  it("requires disclosure on money slides 07-14", () => {
    const money = SLIDES.filter((s) => s.requiresDisclosure);
    expect(money.length).toBeGreaterThanOrEqual(8);
    for (const s of money) {
      expect(s.disclosure && s.disclosure.length).toBeGreaterThan(10);
    }
  });

  it("assertSlidesValid passes for SLIDES", () => {
    expect(() => assertSlidesValid(SLIDES)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run — FAIL**

```bash
cd apps/superpatch-income-stack && npm test
```

- [ ] **Step 3: Implement slides.ts with full 15 entries** — trim provided outline to 30–50 words each; include exact figures; disclosure: `"Income is not guaranteed. Results vary. See the Super Patch Income Disclosure."` on stacks 1–10 / money slides.

- [ ] **Step 4: Tests pass; copy PNGs to public/concepts**

- [ ] **Step 5: Commit**

```bash
git add apps/superpatch-income-stack
git commit -m "feat(income-stack): add Vite app scaffold and validated slide copy"
```

---

### Task 3: DeckShell + Slide UI with copy overlay

**Files:**
- Create: `apps/superpatch-income-stack/src/components/DeckShell.tsx`
- Create: `apps/superpatch-income-stack/src/components/Slide.tsx`
- Create: `apps/superpatch-income-stack/src/components/Flywheel.tsx`
- Modify: `App.tsx` to render DeckShell
- Test: component smoke via vitest + @testing-library/react (or minimal render test)

- [ ] **Step 1: Failing test** — render DeckShell, expect 15 `[data-slide]` and first headline text

- [ ] **Step 2: Implement Slide** — full-viewport section, concept `<img>` (or video if heroVideoSrc), gradient scrim, eyebrow/headline/body/disclosure, accent CSS var, optional Flywheel corner

- [ ] **Step 3: Implement DeckShell** — map SLIDES, progress bar, `data-reduced-motion` from matchMedia

- [ ] **Step 4: Tokens** — `#05070F`, accent vars, Montserrat via Google fonts link in index.html

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(income-stack): render scroll deck with on-slide copy"
```

---

### Task 4: GSAP hybrid motion

**Files:**
- Create: `apps/superpatch-income-stack/src/motion/useDeckMotion.ts`
- Modify: DeckShell / Slide to attach refs
- Dependency: `gsap`

- [ ] **Step 1: Install gsap**

- [ ] **Step 2: useDeckMotion** — for each slide, ScrollTrigger scrub: image scale/y Ken Burns; copy fade/slide up; flywheel arc highlight when `flywheelArc` set; skip when reduced motion

- [ ] **Step 3: Manual verify** `npm run dev` — scroll mobile width 390px

- [ ] **Step 4: Commit**

```bash
git commit -m "feat(income-stack): add GSAP ScrollTrigger plate animations"
```

---

### Task 5: Initiative docs + design status

**Files:**
- Create: `docs/orgs/superpatch/.../business-idea/assets/copy/SLIDES.md` (export from slides.ts headlines)
- Create: `apps/superpatch-income-stack/README.md`
- Modify: spec status → Active / implemented (in progress → complete when done)
- Modify: initiative RUNBOOK-TRACKER note for creative production

- [ ] **Step 1: README** with `npm install && npm run dev`, portfolio paths, copy rules

- [ ] **Step 2: SLIDES.md mirror for creative seats**

- [ ] **Step 3: Commit**

```bash
git commit -m "docs(income-stack): add app README and slide copy mirror"
```

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Peer org superpatch | 1 |
| Customer affiliates / initiative income-stack-deck | 1 |
| Concept assets preserved | 1, 2 |
| App apps/superpatch-income-stack | 2–4 |
| On-slide copy 30–50 words | 2, 3 |
| Disclosure on money slides | 2 |
| GSAP hybrid motion | 4 |
| Flywheel motif | 3–4 |
| Creative-seat docs | 5 |
| Hero AI video | Deferred (hooks via `heroVideoSrc?` in slides) |

## Execution note

Operator requested **execute** after design approval — run this plan inline with executing-plans (or subagent-driven if preferred mid-flight).
