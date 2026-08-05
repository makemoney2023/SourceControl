# Email Layer B — production inventory

**Venture:** Blacksage Kennels  
**Layer:** B (HTML under `email/html/`)  
**Shell notes:** [`html/_shell/README.md`](./html/_shell/README.md)  
**Header asset:** `email/assets/blacksage-email-header-1200x400.png`

Filenames follow `<journey>-<n>-<slug>.html` in craft email order.

---

## Summary

| Journey | Craft source | Expected HTML | Status |
|---------|--------------|---------------|--------|
| Inquiry welcome | `inquiry-welcome.md` | 4 | Complete |
| Interest nurture | `interest-nurture.md` | 5 | Complete |
| Waitlist nurture | `waitlist-nurture.md` | 4 | Complete |
| Tier 2 program update | `tier2-program-update.md` | 2 | Complete |
| **Total** | | **15** | **15 / 15** |

---

## inquiry-welcome.md (4)

| # | Craft name | HTML file |
|---|------------|-----------|
| 1 | Package A — auto-acknowledgment | `html/inquiry-welcome-1-interest-ack.html` |
| 2 | Package B — auto-acknowledgment | `html/inquiry-welcome-2-waitlist-ack.html` |
| 3 | Initial inquiry response | `html/inquiry-welcome-3-initial-response.html` |
| 4 | Package A — interest list confirmation | `html/inquiry-welcome-4-interest-confirm.html` |

**Design brief:** [`design/inquiry-welcome-design-brief.md`](./design/inquiry-welcome-design-brief.md)

---

## interest-nurture.md (5)

| # | Craft name | HTML file |
|---|------------|-----------|
| 1 | Why we publish before we sell | `html/interest-nurture-1-publish-before-sell.html` |
| 2 | Standards-aligned type | `html/interest-nurture-2-standards-aligned.html` |
| 3 | Health transparency | `html/interest-nurture-3-health-transparency.html` |
| 4 | Temperament within ADRK bounds | `html/interest-nurture-4-temperament.html` |
| 5 | Selective placement | `html/interest-nurture-5-selective-placement.html` |

**Design brief:** [`design/interest-nurture-design-brief.md`](./design/interest-nurture-design-brief.md)

---

## waitlist-nurture.md (4)

| # | Craft name | HTML file |
|---|------------|-----------|
| 1 | After review — what we look for | `html/waitlist-nurture-1-what-we-review.html` |
| 2 | Waitlist consideration invitation | `html/waitlist-nurture-2-consideration-invite.html` |
| 3 | Timeline honesty | `html/waitlist-nurture-3-timeline-honesty.html` |
| 4 | Program update (verified facts only) | `html/waitlist-nurture-4-program-update.html` |

**Design brief:** [`design/waitlist-nurture-design-brief.md`](./design/waitlist-nurture-design-brief.md)

---

## tier2-program-update.md (2)

| # | Craft name | HTML file |
|---|------------|-----------|
| 1 | Program milestone — waitlist consideration open | `html/tier2-program-update-1-waitlist-open.html` |
| 2 | Reminder for engaged non-responders | `html/tier2-program-update-2-engaged-reminder.html` |

**Design brief:** [`design/tier2-program-update-design-brief.md`](./design/tier2-program-update-design-brief.md)

---

## Lint gates

Each HTML file must satisfy OCC `email-html-lint`:

- `max-width:600px` (or `width="600"`)
- At least one `<a href`
- `<img>` has `alt` when present
- No `<script>` tags

Shared shell: void `#070707`, elevated `#121212`, header image with alt, bulletproof CTA table (forest `#2c3e2d` or tan `#C4A35A`).
