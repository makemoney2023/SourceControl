# Design: Agency → Customer → Initiative Portfolio

**Date:** 2026-08-06  
**Status:** Active  
**Approach:** Nested portfolio registry + wrap-in-place migration + portfolio Knowledge graph  
**App:** `tools/org-command-center/`  
**Related:** [Multi-venture projects](./2026-07-16-multi-venture-projects-design.md), [Venture sources](./2026-07-17-venture-sources-context-design.md)

## Jobs to be done

| Job | Outcome |
|-----|---------|
| Run Velocity Agency as the org | One agency owns many customers |
| Run many initiatives per customer | Each initiative has isolated business-idea + MEMORY |
| Add initiative under a customer | Situation Room **Add initiative** with Sources reuse |
| See the organization as a whole | Knowledge graph: agency → customers → initiatives → work |

## Hierarchy

| Layer | Example | Owns |
|-------|---------|------|
| Agency (org) | Velocity Agency | Seat roster (`skills/org`), agency identity |
| Customer | Blacksage Kennels | Customer profile; children initiatives |
| Initiative | `main`, `web-design` | Full workspace: DISPATCH, HANDOFFS, tracker, SOURCES, MEMORY |

Active context is a triple: `{ org, customer, initiative }`.

## Registry SSOT

Path: `projects/registry.json` (version 2)

```json
{
  "version": 2,
  "active": {
    "org": "velocity-agency",
    "customer": "blacksage-kennels",
    "initiative": "main"
  },
  "orgs": {
    "velocity-agency": {
      "name": "Velocity Agency",
      "customers": {
        "blacksage-kennels": {
          "name": "Blacksage Kennels",
          "initiatives": {
            "main": {
              "name": "Main",
              "businessIdea": "docs/projects/blacksage-kennels/business-idea",
              "memory": "docs/projects/blacksage-kennels/MEMORY"
            }
          }
        }
      }
    }
  }
}
```

### Migration (wrap-in-place)

Flat v1 `{ active: string, projects: { slug: { name, businessIdea, memory } } }` loads as:

- Org `velocity-agency` / "Velocity Agency"
- Each project → customer with initiative `main` pointing at existing paths
- Active triple: org + former active slug + `main`
- Persist v2 on first successful load/save cycle

No big-bang move of `docs/projects/*` or `memorybank/org/<customer>/`.

### New initiative paths

```
docs/orgs/<org>/customers/<customer>/initiatives/<initiative>/{business-idea,MEMORY}
memorybank/org/<org>/<customer>/<initiative>/
```

## Create flows

- **Add customer** → customer + default initiative `main` (nested paths for brand-new customers)
- **Add initiative** → full workspace under selected customer; optional context note + Sources (activate then upload)
- Legacy `POST /api/project/create` / `createVenture` → customer create

## Path resolution

All former “active venture” helpers resolve via the active **initiative** entry. Compat:

- `activeProjectSlug()` → customer slug
- `businessIdeaRel(repo, slug?)` when `slug` is a customer slug → that customer’s `main` (or active initiative if same customer)
- Write allowlist includes `docs/orgs/...` and nested vault SoT

## Portfolio Knowledge graph

Surface: Situation Room → Intelligence → Knowledge graph (`OrgWorkGraphView`).

Not Graphify (code/docs RAG) and not OrgTheater (3D seats).

| Scope | Behavior |
|-------|----------|
| `portfolio` (default) | Agency → all customers → initiatives → work |
| `initiative` | Current single-active work graph (compat) |

New node kinds: `agency`, `customer`, `initiative`. New edges: `serves`, `owns`, `runs`. Work nodes namespaced by initiative. Non-active initiative work collapsed to count badges by default. Click initiative switches active triple.

## Non-goals (v1)

- Multi-agency UI beyond Velocity Agency
- Relocating wrapped `docs/projects/*` trees
- Cross-initiative shared DISPATCH
- Customer-level source library inheritance
- Merging Graphify into Knowledge graph
- Portfolio layout in 3D OrgTheater

## Compatibility

- Flat registry auto-migrates on load
- Legacy switch `{ active: customerSlug }` → that customer’s `main`
- In-flight packets under wrapped `main` paths unchanged
