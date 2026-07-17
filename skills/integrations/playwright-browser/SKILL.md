---
name: playwright-browser
description: >-
  Use when automating or inspecting web pages via Playwright or Cursor browser MCP for QA, competitive checks, or SEO verification.
---

# Playwright / Browser

Thin adapter for digital workers. See `skills/org/TOOL-REGISTRY.md`.

## Preferred access
Playwright MCP or cursor-ide-browser

## Env / secrets
—

Resolve via `skills/integrations/obsidian-secrets/` then `.env.local`.

## MCP
`user-playwright`, `cursor-ide-browser`

## Primary ops
1. Snapshot before click; unlock when done
2. Use for live page checks, not bulk crawl (prefer firecrawl)
3. Stop after repeated blockers (login/captcha) and report

## Fallback
firecrawl scrape of public HTML

## Common failures
Login walls → escalate to human; do not bypass captchas
