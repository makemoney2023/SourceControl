# Digital Worker Integrations — Design

**Date:** 2026-07-16  
**Status:** Approved for implementation (user: execute)

## Goal

Give every digital worker a clear path from seat → tool → MCP/API skill, with deep Google Analytics / Search Console guidance and thin adapters for the rest of the tool surface.

## Decisions

| Decision | Choice |
|----------|--------|
| Scope | Full tool surface + 36-seat map |
| Layout | `skills/org/TOOL-REGISTRY.md` + portable `skills/integrations/` |
| Depth | Full: google-auth, google-analytics, google-search-console. Thin adapters elsewhere |
| Position wiring | All 36 seats + orchestrator get an Integrations section |

## Architecture

- **Craft packs** (`skills/community/*`) = what to produce  
- **Integration skills** (`skills/integrations/*`) = how to call tools  
- **TOOL-REGISTRY** = seat × tool × phase source of truth  
- Prefer MCP when connected; else REST/CLI fallback  
- Secrets: Obsidian MCP when available, else `.env.local` — never invent keys  
- Degrade: `tool_status: unavailable` on handoff; no fabricated metrics  

## Docs sources (Context7)

- `/googleanalytics/google-analytics-mcp` — official GA MCP  
- `/websites/developers_google_analytics_devguides_reporting_data_v1` — Data API  
- `/websites/developers_google_webmaster-tools_v1` — GSC API  
- `/ahonn/mcp-server-gsc` — GSC MCP pattern  

## Deliverables

1. `skills/org/TOOL-REGISTRY.md`  
2. Full Google skills (+ references)  
3. Thin adapter skills  
4. Integrations section on every position + orchestrator pointer  
5. README updates  

## Non-goals

- Building or hosting **per-seat / per-skill** MCP servers in this repo  
- Replacing community craft packs  
- Live API calls during skill authoring  

**Clarification (2026-07-20):** The optional proprietary **OCC Control MCP** (`occ-control`) for non-Jarvis clients is allowed under [`2026-07-20-mcp-posture-and-control-plane-design.md`](./2026-07-20-mcp-posture-and-control-plane-design.md). That exception does **not** authorize turning digital workers into MCP servers.  
