---
phase: "0"
position: legal-counsel
reports_to: coo
status: needs_input
verdict_for_manager: ready_to_merge
llm_tier: frontier-reasoning
llm_model: grok-4.5
generation_profile: none
generation_used: none
fallback_applied: false
---

# Handoff — Legal Counsel (Phase 0 compliance flags) → COO

> **Disclaimer:** Checklist guidance for internal planning only. **Not** formal legal advice, not jurisdiction-specific counsel, and not a substitute for a licensed attorney, local health department, tax authority, or insurance broker.

### In plain English

This is a seasonal event lemonade stand selling **open, freshly squeezed** drinks. That puts you in temporary food-vendor / health-permit territory almost everywhere — not a casual “kids on the sidewalk” exemption by default. **We do not know the city/region yet**, so we cannot name the real permit or tax path. Do not sell at events until geography, permits, and insurance/COI line up with the first organizer’s rules.

### What we found

- **Fact:** Idea is seasonal, event-based F&B with ice-cold, freshly squeezed lemonade (intake + operator note).
- **Fact:** No permits, entity, insurance, brand, or sources documented (`SOURCES/INDEX.md` empty; intake: working stand/permits = none).
- **Assumption:** Local/regional U.S.-style event circuit until operator says otherwise.
- **Blocker:** Geography unknown → permit, sales tax, and COI requirements stay generic flags only.
- **Risk skew:** Fresh open beverage + possible home prep often **fails** cottage-food shortcuts; expect health-dept scrutiny higher than sealed packaged drinks.
- **Explore / light depth:** Enough for Phase 0 peer planning; not a Phase 8 ops/legal pack.

### Next steps

1. COO: get operator answers on geography, first events, prep location, entity, insurance, labor (see §7).
2. Before any go-live date is treated as real: jurisdiction checklist (temp food permit + food-handler if required + GL/COI matching booth contract + sales-tax registration if applicable).
3. Defer full Phase 8 contracts/ops legal work until a named venue/vendor packet exists.

## Goal (from context packet)

Phase 0 peer IC brief — legal/compliance flags for Lemonade Stand for COO. Cover geography blocker, temp food/health permits, cottage-food/home-prep risks, insurance/COI, entity/sales tax/DBA, event contract/indemnity, and open questions. Explore mode, light depth. Write only this handoff. Do not rewrite intake, mark phase complete, spawn peers, write manager brief, or write `08-operations.md`.

## Artifacts written (write_lease only)

| Path | Notes |
|------|-------|
| `docs/projects/lemonade-stand/business-idea/HANDOFFS/0-legal-counsel.md` | Phase 0 LEGAL / COMPLIANCE FLAGS only |

## Model routing

| Field | Value |
|-------|-------|
| llm_tier | frontier-reasoning |
| llm_model | grok-4.5 |
| generation_profile | none |
| generation_used | none |
| fallback_applied | no — preferred pin used |

## Decisions

- **Explore-mode OK** for Phase 0 peer roundtable (matches intake: explore / light / Service).
- **Do not operate / sell** until jurisdiction-specific permit + insurance checklist is cleared for the first venue.
- Geography **UNKNOWN** → hard blocker for compliance clearance; all items below are **generic flags**.
- Depth stays **light**. Full Phase 8 deferred until geography + first-event packet exist.
- Greenfield compliance posture assumed (no entity/permits/insurance on file).

## Fact vs assumption (labels used below)

| Kind | Statement |
|------|-----------|
| **Fact** | Operator wants seasonal event lemonade, ice-cold, freshly squeezed; intake confirmed; no permits/entity/insurance documented; sources empty |
| **Inference** | Physical open-beverage F&B at events → temporary food vendor / health rules typically apply |
| **Assumption** | Local/regional U.S. event circuit; bootstrapped sole-prop start; first season is test, not multi-state brand |

---

## 1. Geography unknown — blocker for permit / tax path

| Status | Detail |
|--------|--------|
| **Fact** | Intake lists geography as unspecified; open question #1 is city/region + first events |
| **Blocker** | Without city/county/state (or country), cannot identify: health department, temporary food vendor form, business license, sales-tax registration, or which event organizer packet governs |
| **Assumption until answered** | Local/regional events near operator — **do not** treat as validated jurisdiction |

**COO implication:** No go/no-go on “permits ready” until geography + named first event exist. Planning artifacts may continue; **operating clearance may not**.

---

## 2. Temporary food vendor / health permit flags

**Geography-dependent.** Typical U.S.-style flags for seasonal event lemonade (fresh-squeezed, open drink):

| Flag | Why it matters | Label |
|------|----------------|-------|
| Temporary / special-event food vendor permit | Most jurisdictions require health-dept approval for on-site prep/serve at festivals, markets, sports events | Assumption (common pattern) |
| Mobile / cart / booth classification | Rules differ for pushcart vs tent vs trailer; equipment specs may apply | Assumption |
| Handwashing / warewashing / potable water | Event setups often need dedicated handwash, sanitizer, approved water | Assumption |
| Ice as food | Approved-source bagged ice; ice contacting product often treated as food | Assumption |
| Person-in-charge / food handler cards | Operator and helpers may need food-handler or manager certs | Assumption |
| Event organizer + local health dual approval | Organizer permit proof ≠ health permit; usually need both | Assumption |
| Cross-jurisdiction travel | New county/city can require new or reciprocal permits | Assumption |

**Related food-safety flags (light):** washed produce, clean juicer, cold-holding for ice-cold serve, allergen/cross-contact if flavored add-ons, factual claims only (“freshly squeezed” OK; avoid therapeutic claims), gray-water disposal at events.

---

## 3. Cottage-food / home-prep risks (fresh lemonade)

| Risk | Guidance | Label |
|------|----------|-------|
| Cottage-food / home-kitchen exemptions | Fresh lemonade sold to the public as an **open beverage** often **does not** fit cottage-food lists (many regimes limit non-TCS / sealed / low-risk items). **Do not assume** home prep is legal | Assumption (pattern) + Inference (product type) |
| On-site vs home batching | Squeezing/mixing at home for event sale may trigger commissary or approved-kitchen rules | Assumption |
| Commissary / shared commercial kitchen | Some locales require prep in a permitted kitchen, not backyard/garage | Assumption |
| Cut fruit / mixed product hold time | Time/temperature controls may apply once lemons are cut or drink is mixed | Assumption |

**Bottom line for COO:** Treat “I’ll just make it at home” as a **compliance red flag** until the local health department confirms the prep model for this product.

---

## 4. Insurance / COI flags for event vendors

| Flag | Notes | Label |
|------|-------|-------|
| General liability (GL) | Slip/trip, on-site injury — organizers often require ~$1M/occurrence (verify locally) | Assumption (common ask) |
| Product liability | Illness/injury alleged from beverage — GL endorsement or separate; ask broker | Assumption |
| Additional insured / COI | Event contracts almost always want Certificate of Insurance naming organizer/venue, often with short deadlines | Assumption |
| Workers’ compensation | May trigger if paid helpers/employees (thresholds vary) | Assumption |
| Auto / cargo | Personal auto may exclude business transport of equipment/product | Assumption |
| Homeowner / renter policy | Usually **does not** cover business food sales | Assumption |
| Customer waivers | Rarely cure foodborne-illness claims; not a substitute for permits + insurance | Assumption |

**Fact:** No insurance documented → treat as open risk before first paid event.

---

## 5. Entity / sales tax / DBA (light checklist)

| Topic | Flag | Label |
|-------|------|-------|
| Entity | Sole prop common for first events; LLC can help liability separation but **does not** replace permits/insurance | Assumption |
| DBA / assumed name | May be required to contract/bank under a trade name | Assumption |
| Business license | City/county license often required even for seasonal vendors | Assumption |
| Sales tax | Prepared food/beverage often taxable; register before collecting if required | Assumption |
| Income tax / books | Track per-event revenue, COGS, booth fees, mileage | Assumption (good practice) |
| Helpers vs employees | Paid day labor can create payroll tax / wage / workers’-comp duties | Assumption |
| Multi-jurisdiction | Nexus and local food taxes vary — geography blocker applies | Fact (blocker) + Assumption (complexity) |

**Fact:** No entity, EIN, DBA, or tax registration documented.

---

## 6. Event contract / indemnity flags

When booth agreements arrive, watch (general commercial patterns — no playbook on file):

| Clause cluster | Watch for |
|----------------|-----------|
| Insurance | Minimum limits, additional insured, primary/non-contributory, waiver of subrogation, COI deadlines |
| Indemnity | Broad “indemnify organizer for any claim from your booth” — seek carve-outs for organizer negligence where possible |
| Permits warranty | Vendor warrants health permits current — false warranty = breach + shutdown |
| Exclusivity / menu | Category exclusivity fees or forced limits |
| Cancellation / weather | Booth-fee refunds, force majeure |
| Load-in / safety | Tent weighting, fire extinguisher, propane bans, power fees |
| IP / branding | Organizer photo rights; use of event marks |
| Termination | Removal for health violation — ops must be able to comply |
| Governing law / venue | Especially if traveling |

**Assumption:** First season will use third-party organizer contracts; none on file yet.

---

## 7. Open questions for COO / operator

1. **Geography:** City, county, state/country for season one? (**Hard blocker**)
2. **First events:** Named venues/festivals, dates, organizer vendor packet?
3. **Permits today:** Any temporary food / health permit held or in progress?
4. **Prep location:** On-site squeeze only vs home vs commissary?
5. **Menu scope:** Plain lemonade only, or flavors / add-ons / bottled takeaway?
6. **Entity / DBA:** Sole prop, DBA, LLC? EIN?
7. **Insurance:** Any GL/product policy or broker?
8. **Labor:** Solo only, or paid helpers?
9. **Payment mix:** Cash only vs cards (tax/processor setup)?
10. **Claims / packaging:** Any nutrition/health claims or prepackaged bottles in season one?

---

## Recommendation

| Mode | Recommendation |
|------|----------------|
| Phase 0 explore / roundtable | **OK to continue** — this brief is enough for peer planning against confirmed intake |
| Operating / selling at events | **Do not operate** until jurisdiction checklist cleared for first venue |
| Phase 8 | Defer full contracts / ops legal pack until geography + first-event packet exist |

**COO ask:** Secure operator answers to §7 items **1–4** at minimum before any go-live planning date is treated as real.

## Asks for manager (`ask_manager`)

- Peer help needed: none (ops-manager may later own permit execution in Phase 8 — not requested now)
- Clarification needed: operator geography, first events, prep location, and current permit/insurance status (see §7)

## Risks / blockers

- **Geography UNKNOWN** — cannot validate health dept, temp vendor rules, or tax registrations
- **No permits / insurance / entity documented** — operating early risks shutdown, fines, personal liability, organizer breach
- **Fresh-squeezed open beverage** — higher scrutiny than sealed drinks; cottage-food assumptions unsafe without local confirmation
- **Event indemnity + insurance mismatch** — common first-vendor trap
- **Evidence gap** — empty sources index; flags are pattern-based, not jurisdiction-validated

## Packs used

- `skills/community/awesome-claude-corporate-skills/06-legal-compliance/legal-risk-assessment/` (severity / flag framing)
- Skim intent for `06-legal` family checklist framing per packet — not formal advice
- Intake (read-only): `docs/projects/lemonade-stand/business-idea/00-intake.md`, `MEMORY/context.md`, `SOURCES/INDEX.md` (empty)

## Do not

- Mark the phase complete
- Write outside write_lease
- Spawn other positions
- Rewrite `00-intake.md`
- Write `08-operations.md` or manager brief
- Inherit a weaker model tier
- Claim licensed attorney advice
