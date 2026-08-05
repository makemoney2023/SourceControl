# Wire checklist — Phase 17 email (Blacksage)

**Owner:** operator  
**Status:** incomplete (Layer B HTML ready; ESP not live)

- [ ] ESP account selected (Klaviyo / Mailchimp / other)
- [ ] Import HTML from `17-channels/email/html/` (15 files per PRODUCTION-INVENTORY.md)
- [ ] Merge tags mapped: `[DOMAIN]`, `[CONTACT_EMAIL]`, `[RESPONSE_SLA]`, `[OPERATOR_NAME]`, `[First Name]`
- [ ] Host email header PNG (Vercel Blob or CDN) — update HTML `src` + `ASSETS.json` `hosted`
- [ ] DNS: SPF / DKIM / DMARC for sending domain
- [ ] Unsubscribe + preference center tested
- [ ] Analytics / UTM on primary CTAs
- [ ] Test send to Gmail + Apple Mail + Outlook

## Notes
Header local path: `17-channels/email/assets/blacksage-email-header-1200x400.png`  
Publish: `bash scripts/publish-blacksage-assets.sh` when `BLOB_READ_WRITE_TOKEN` is set.
