# Blacksage Kennels — shared email HTML shell

**Layer:** B (production HTML)  
**Brand:** Working-Dog Cinema (`11-brand-system.md`)  
**Pack:** `skills/community/inference-sh/email-design/`

Shared layout notes for every journey HTML file under `email/html/`. Do not put scripts or interactive widgets in production emails.

---

## Shell contract

| Element | Spec |
|---------|------|
| Outer wrapper | Full-width table, `background-color:#070707` (void) |
| Email card | Nested table `width="600"` + `max-width:600px;width:100%`, `background-color:#121212` (elevated) |
| Header image | `../assets/blacksage-email-header-1200x400.png` — always include `alt` (e.g. `Blacksage Kennels — ADRK-aligned Rottweiler`); `style` must include `max-width:600px`; `display:block;width:100%;height:auto;border:0` |
| Headline | Georgia / Times New Roman serif, ~22px, `#F3EFE6` |
| Preview / muted | Arial/Helvetica, 14px, `#A8A49C` |
| Body | Arial/Helvetica ≥16px, line-height ~1.55, `#F3EFE6` (or `#E8E4DC`) |
| Links | Forest green `#2c3e2d` or tan `#C4A35A` — match CTA system below |
| Footer | 12px muted, top border `#333333`, unsubscribe + contact placeholders |
| Scripts | **None** — no `<script>` tags |

---

## CTA system (bulletproof table)

Primary CTA is always a nested presentation table (Outlook-safe), never a lone styled `<a>` or CSS button:

```html
<td align="center" style="padding:8px 32px 24px 32px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" bgcolor="#2c3e2d" style="border-radius:4px;">
        <a href="https://[DOMAIN]/…" target="_blank"
           style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.2;color:#ffffff;text-decoration:none;font-weight:bold;">
          CTA label
        </a>
      </td>
    </tr>
  </table>
</td>
```

| CTA fill | Text | Use when |
|----------|------|----------|
| `#2c3e2d` (forest green) | `#ffffff` | Education / health / placement (as in `inquiry-welcome-1`) |
| `#C4A35A` (tan key) | `#070707` | Conversion primary — **Begin your inquiry** |

One primary CTA button per email. Secondary text links may follow below the button.

---

## Lint gates (OCC `email-html-lint`)

Every production HTML file must pass:

1. `max-width:600px` (or `width="600"`) present  
2. At least one `<a href=…>`  
3. Every `<img>` has `alt`  
4. No `<script>` tags  

---

## Placeholders

Keep merge tokens from craft MD: `[First Name]`, `[OPERATOR_NAME]`, `[CONTACT_EMAIL]`, `[DOMAIN]`, `[RESPONSE_SLA]`.

Local preview uses relative header path; ESP Wire needs a hosted image URL (operator).

---

## Inverted pyramid (email-design)

1. Header image (full-bleed 600px)  
2. Headline (subject-aligned)  
3. Preview support line  
4. Body paragraphs / short lists  
5. Bulletproof primary CTA  
6. Footer unsubscribe  

Reference implementation: `../inquiry-welcome-1-interest-ack.html`
