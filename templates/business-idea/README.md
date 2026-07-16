# Business Idea Artifact Templates

Copy into your project before starting the runbook:

```bash
cp -r templates/business-idea/* /path/to/project/docs/business-idea/
cp rules/shared/business-idea-runbook.mdc /path/to/project/.cursor/rules/
```

The agent reads `RUNBOOK-TRACKER.md` at every session and continues until Phase 21 is ✅. After launch, sessions run the Phase 22 operating cadence.

## Artifact index

| File | Phase |
|------|-------|
| `RUNBOOK-TRACKER.md` | All — master progress |
| `00-intake.md` | 0 |
| `01-problem-framing.md` | 1 |
| `02-evidence-base.md` | 2 — deep-research report (runs first) |
| `02-market-research.md` | 2 |
| `03-strategy.md` | 3 |
| `.agents/product-marketing.md` | 3 (created by product-marketing skill) |
| `04-business-model.md` | 4 |
| `04b-funding.md` | 4B — skip if bootstrapped |
| `05-prd.md` | 5 |
| `06-gtm-plan.md` | 6 |
| `07-sales-playbook.md` | 7 |
| `08-operations.md` | 8 |
| `08b-people-plan.md` | 8B — skip if no hires |
| `09-build-log.md` | 9 — skip if no software |
| `09b-hardware-build.md` | 9B — skip if no physical product |
| `09b-hardware/` | 9B — STEP, DXF, URDF, gcode files |
| `10-strategy-review.md` | 10 |
| `11-brand-system.md` | 11 |
| `12-web-design.md` | 12 |
| `design-system/<slug>/MASTER.md` | 12 (from ui-ux-pro-max --persist) |
| `13-copy-foundation.md` | 13 |
| `14-pages/` | 14 — one file per page |
| `15-media/` | 15 — video scripts, storyboards |
| `16-seo.md` | 16 |
| `17-channels/` | 17 — email sequences, social calendar |
| `18-conversion.md` | 18 |
| `19-paid.md` | 19 |
| `20-analytics.md` | 20 |
| `21-executive-summary.md` | 21 |
| `22-operating-cadence.md` | 22 — recurring post-launch log |
