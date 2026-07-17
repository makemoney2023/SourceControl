# ClaudeSkills

A portable library of **generic** Cursor agent skills and rules — reusable across any project. No company-specific or project-specific content.

**Last updated:** July 16, 2026  
**Total:** 749 skills · 15 rules · ~135 MB (includes OpenMontage ~88 MB; +37 org; +18 integrations)

## Directory Structure

```
ClaudeSkills/
├── skills/
│   ├── cursor-managed/       # Built-in Cursor IDE skills (19)
│   ├── user/                 # Custom generic skills (2)
│   ├── plugins/              # Plugin-provided skills (74)
│   │   ├── figma/            # Design-to-code, code-connect, motion
│   │   ├── vercel/           # Next.js, AI SDK, auth, shadcn, deploy
│   │   ├── superpowers/      # TDD, debugging, planning, verification
│   │   ├── supabase/         # Database, Postgres best practices
│   │   ├── stripe/           # Payments integration
│   │   ├── parallel/         # Web search, research, extraction
│   │   ├── firecrawl/        # Web scraping
│   │   └── context7/         # Library docs lookup
│   ├── community/            # Third-party open-source skills
│   │   ├── academic-research-skills/  # Deep research pipelines (4) — CC BY-NC-SA
│   │   ├── text-to-cad/            # CAD, robotics, fabrication skills (11) — MIT
│   │   ├── notfair-seo/      # NotFair SEO skills (10) — MIT
│   │   ├── ui-ux-pro-max-skill/  # UI/UX Pro Max design skills (7) — MIT
│   │   ├── remotion/         # Remotion video skills (48) — special license
│   │   ├── marketingskills/  # Marketing skills (47) — MIT
│   │   ├── advertising-skills/  # Kim Barrett DR advertising (12) — MIT
│   │   ├── visual-skills/      # AI image/video prompting (2) — MIT
│   │   ├── openmontage/        # Agentic video production system — AGPL-3.0
│   │   ├── business-analysis-skills/  # BA skills (53) — MIT
│   │   ├── awesome-claude-corporate-skills/  # Corporate skills (166) — MIT
│   │   └── inference-sh/           # inference.sh AI media skills (85) — MIT
│   ├── org/                  # Virtual company positions + orchestrator (37)
│   ├── integrations/         # API/MCP skills for digital workers (18)
│   └── context-engineering/  # Agent context engineering patterns (16)
├── rules/
│   └── shared/               # Generic rules for any project (15)
└── templates/
    ├── business-idea/        # Runbook tracker + artifact stubs
    └── org/agents/           # Cursor subagent defs (36) → .cursor/agents/
```

---

## Skills

### Cursor-Managed (19)

Built-in Cursor workflow skills:

| Skill | Purpose |
|-------|---------|
| `automate` | Create Cursor Automations |
| `babysit` | Keep PRs merge-ready |
| `canvas` | Live React analytical artifacts |
| `create-hook` / `create-rule` / `create-skill` / `create-subagent` | Create Cursor primitives |
| `loop` | Run prompts in a loop |
| `migrate-to-skills` | Migrate rules to skills |
| `onboard` | Onboarding workflows |
| `review` / `review-bugbot` / `review-security` | Code review |
| `sdk` | Cursor SDK guidance |
| `shell` | Shell command execution |
| `split-to-prs` | Split work into PRs |
| `statusline` | Custom status line |
| `update-cli-config` / `update-cursor-settings` | Config management |

### User Custom (2)

| Skill | Purpose |
|-------|---------|
| `figma-implement-design` | Translate Figma designs into code |
| `natural-human-voice` | Natural, concise writing voice |

### Plugin Skills (74)

| Plugin | Key Skills |
|--------|------------|
| **figma** | design-to-code, code-connect, generate-design, generate-library, implement-motion |
| **vercel** | nextjs, ai-sdk, ai-gateway, auth, shadcn, turbopack, vercel-functions, deployments-cicd |
| **superpowers** | brainstorming, TDD, systematic-debugging, writing-plans, subagent-driven-development |
| **supabase** | supabase, postgres-best-practices |
| **stripe** | stripe-best-practices, connect-recommend |
| **parallel** | web-search, web-extract, deep-research, data-enrichment |
| **firecrawl** | Web scraping and search |
| **context7** | Library documentation lookup |

### Context Engineering (16)

Agent architecture and context management patterns:

- `context-fundamentals`, `context-compression`, `context-degradation`, `context-optimization`
- `filesystem-context`, `memory-systems`, `multi-agent-patterns`
- `tool-design`, `evaluation`, `advanced-evaluation`
- `bdi-mental-states`, `project-development`

### Community — NotFair SEO (10)

From [nowork-studio/NotFair](https://github.com/nowork-studio/NotFair/tree/main/seo) (MIT). Full SEO toolkit for AI agents — keyword research through schema markup and GSC analysis.

| Skill | Purpose |
|-------|---------|
| `broken-link-checker` | Find and report broken links |
| `content-planner` | SEO content planning |
| `content-writer` | SEO-optimized content writing |
| `geo-optimizer` | Generative engine optimization |
| `keyword-research` | Keyword research and prioritization |
| `meta-tags-optimizer` | Title tags, meta descriptions, social tags |
| `schema-markup-generator` | JSON-LD structured data for rich results |
| `seo-analysis` | GSC analysis, PageSpeed, CMS integrations |
| `seo-page` | Full-page SEO optimization |
| `setup-cms` | CMS setup for SEO workflows |

Includes `shared/` preamble and best-practices docs. See [skills/community/notfair-seo/README.md](skills/community/notfair-seo/README.md).

### Community — UI UX Pro Max (7)

From [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (MIT). Design intelligence for web and mobile — searchable database of styles, palettes, typography, UX guidelines, and stack-specific recommendations.

| Skill | Purpose |
|-------|---------|
| `ui-ux-pro-max` | Core design intelligence (84 styles, 192 palettes, 22 stacks) |
| `design-system` | Token architecture, component specs, slides |
| `design` | Logo, icon, CIP design |
| `brand` | Brand voice, visual identity, messaging |
| `ui-styling` | UI styling and canvas fonts |
| `slides` | Presentation layout and copywriting |
| `banner-design` | Banner design workflows |

See [skills/community/ui-ux-pro-max-skill/README.md](skills/community/ui-ux-pro-max-skill/README.md).

### Community — Remotion (48)

From [remotion-dev/remotion](https://github.com/remotion-dev/remotion). Programmatic video creation with React.

**Video skills (8)** — copy for any Remotion project:

| Skill | Purpose |
|-------|---------|
| `remotion-create` | Scaffold new projects |
| `remotion-markup` | React video markup, effects, layout |
| `remotion-interactivity` | Studio Visual Mode editing |
| `remotion-captions` | Captions and subtitles |
| `remotion-render` | Render pipeline |
| `remotion-saas` | Remotion-powered SaaS apps |
| `remotion-best-practices` | Skill router / hub |
| `mediabunny` | Mediabunny integration |

**Maintainer skills (40)** — for contributing to the Remotion monorepo (PRs, releases, studio, docs).

See [skills/community/remotion/README.md](skills/community/remotion/README.md). Note: Remotion has a [special license](https://www.remotion.dev/docs/license).

### Community — Marketing Skills (47)

From [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT). CRO, copywriting, SEO, analytics, paid ads, and growth engineering for AI agents.

**Foundation:** `product-marketing` — read by all other skills first.

**Categories:** SEO (`seo-audit`, `ai-seo`, `programmatic-seo`), CRO (`cro`, `signup`, `popups`), copy (`copywriting`, `copy-editing`), paid (`ads`, `ad-creative`), growth (`launch`, `referrals`, `marketing-loops`), sales (`cold-email`, `sales-enablement`), strategy (`marketing-plan`, `pricing`, `competitors`).

See [skills/community/marketingskills/README.md](skills/community/marketingskills/README.md).

### Community — Advertising Skills (12)

From [realkimbarrett/advertising-skills](https://github.com/realkimbarrett/advertising-skills) (MIT in skill frontmatter). Direct-response advertising by Kim Barrett — avatar, offer, Schwartz awareness, mechanism, headlines, objections, ad angles, creative, funnel path, campaign orchestration, and QA.

| Category | Skills | Examples |
|----------|--------|----------|
| Foundations | 2 | `avatar-extraction`, `offer-extraction` |
| Copy Chief | 4 | `schwartz-awareness-mapper`, `mechanism-builder`, `headline-matrix` |
| Operator OS | 4 | `ad-angle-multiplier`, `scroll-stopping-creative`, `conversion-path-builder` |
| Orchestrators | 1 | `full-funnel-campaign-orchestrator` |
| QA | 1 | `generic-language-killer` |

Wired across runbook Phases **2, 4, 13, 18, 19, 22**. See [skills/community/advertising-skills/README.md](skills/community/advertising-skills/README.md).

### Community — Visual Skills (2)

From [smixs/visual-skills](https://github.com/smixs/visual-skills) (MIT). Production-grade **prompting** for AI image and video (Nano Banana, GPT Image 2, Seedance, Kling, Veo). Pair with `inference-sh` to render.

| Skill | Purpose |
|-------|---------|
| `image` | Image prompts — product, ads, UI, storyboards, edits |
| `video` | Video prompts — shot lists, multi-shot, dialogue / lip-sync |

Global runbook rule + Phases **11, 14, 15, 19**. See [skills/community/visual-skills/README.md](skills/community/visual-skills/README.md).

### Org — Virtual company positions (36 + orchestrator)

Portable **position skills** so the business-idea runbook can spin up a full company as Cursor subagents. Each seat has purpose, reports-to, delegates-to, skill packs, and I/O contracts.

| Piece | Path |
|-------|------|
| Registry | [`skills/org/ORG-REGISTRY.md`](skills/org/ORG-REGISTRY.md) |
| Tool registry | [`skills/org/TOOL-REGISTRY.md`](skills/org/TOOL-REGISTRY.md) — seat → API/MCP |
| Integrations | [`skills/integrations/`](skills/integrations/) — GA4, GSC, adapters |
| Orchestrator | [`skills/org/orchestrator/`](skills/org/orchestrator/) |
| Positions | [`skills/org/positions/<slug>/`](skills/org/positions/) |
| Cursor agents | [`templates/org/agents/`](templates/org/agents/) → copy to `.cursor/agents/` |

Install:

```bash
mkdir -p /path/to/project/.cursor/skills/org /path/to/project/.cursor/skills/integrations \
  /path/to/project/.cursor/agents
cp -r skills/org/positions skills/org/orchestrator skills/org/ORG-REGISTRY.md \
  skills/org/MODEL-REGISTRY.md skills/org/TOOL-REGISTRY.md \
  /path/to/project/.cursor/skills/org/
cp -r skills/integrations /path/to/project/.cursor/skills/
cp templates/org/agents/*.md /path/to/project/.cursor/agents/
```

Runbook principle #9: orchestrator spawns **managers only**; ICs report via `HANDOFFS/`; C-suite must `approve` before phase ✅. See [skills/org/README.md](skills/org/README.md).

### Integrations — API / MCP adapters (18)

Portable skills for live tools digital workers call. Deep skills: `google-auth`, `google-analytics`, `google-search-console`. Thin adapters: Firecrawl, Parallel, Context7, Figma, Supabase, Vercel, GitHub, Stripe, fal, ElevenLabs, PageSpeed, Google Ads, Playwright, shadcn, Obsidian secrets.

| Piece | Path |
|-------|------|
| Catalog + seat map | [`skills/org/TOOL-REGISTRY.md`](skills/org/TOOL-REGISTRY.md) |
| Skills | [`skills/integrations/<tool>/`](skills/integrations/) |

Spec: [`docs/superpowers/specs/2026-07-16-digital-worker-integrations-design.md`](docs/superpowers/specs/2026-07-16-digital-worker-integrations-design.md).

### Community — OpenMontage (video production system)

From [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage) (**AGPL-3.0**). Full agentic video studio: 12+ pipelines, tool registry, stage-director skills, Remotion/HyperFrames composition, Backlot storyboard. Counted as one **system**, not +N individual ClaudeSkills entries.

**Rule Zero:** every video production goes through `pipeline_defs/` — read [AGENT_GUIDE.md](skills/community/openmontage/AGENT_GUIDE.md) first. Requires `make setup` (Python 3.10+, FFmpeg, Node 18+).

Primary runbook path for **video** (global principle + Phase **15**; Phase **19** when paid needs video). See [skills/community/openmontage/README.md](skills/community/openmontage/README.md).

### Community — Business Analysis Skills (53)

From [45ck/business-analysis-skills](https://github.com/45ck/business-analysis-skills) (MIT). Requirements, elicitation, stakeholder analysis, process modelling, prioritization, and quality checks.

| Track | Skills | Examples |
|-------|--------|----------|
| **Workflows** | 7 | `business-problem-framing`, `requirements-elicitation`, `requirements-packager` |
| **Atomic** | 17 | `swot-prioritisation`, `porters-five-forces`, `raci-matrix`, `moscow-prioritisation` |
| **Requirements** | 14 | `acceptance-criteria-writer`, `requirements-interrogator`, `ambiguity-hunter` |
| **Elicitation** | 10 | `as-is-process-investigator`, `to-be-process-designer`, `business-rule-extractor` |
| **Quality** | 5 | `requirements-quality-check`, `evidence-gap-review`, `deliverable-consistency-check` |

Includes 11 BA templates (RACI, traceability matrix, acceptance criteria, etc.). See [skills/community/business-analysis-skills/README.md](skills/community/business-analysis-skills/README.md).

### Community — Academic Research Skills (4)

**Source:** [imbad0202/academic-research-skills](https://github.com/imbad0202/academic-research-skills) — CC BY-NC-SA 4.0 (non-commercial)

| Skill | Purpose |
|-------|---------|
| `deep-research` | 13-agent research team — full research, quick brief, fact-check, lit-review, systematic review, Socratic mode |
| `academic-paper` | Academic paper writing pipeline |
| `academic-paper-reviewer` | Structured peer review |
| `academic-pipeline` | Research-to-publication orchestration |

Requires the sibling `shared/` directory. `deep-research` opens runbook Phase 2 (evidence base) and re-runs in Phase 10 (fact-check). See [skills/community/academic-research-skills/README.md](skills/community/academic-research-skills/README.md).

### Community — Text-to-CAD (11)

**Source:** [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad) — MIT

| Skill | Purpose |
|-------|---------|
| `cad` | STEP-first parametric CAD from natural language or images |
| `cad-viewer` | Browser preview for CAD, G-code, URDF |
| `step-parts` | Off-the-shelf STEP parts lookup |
| `dxf` | 2D fabrication drawings |
| `urdf` / `srdf` / `sdf` | Robot description and simulation files |
| `gcode` / `bambu-labs` | FDM slicing and Bambu Lab printing |
| `sendcutsend` | CNC/sheet-metal upload validation |
| `implicit-cad` | Experimental implicit SDF CAD |

`text-to-cad` skills run in runbook **Phase 9B** for hardware/robotics businesses. See [skills/community/text-to-cad/README.md](skills/community/text-to-cad/README.md).

### Community — Awesome Claude Corporate Skills (166)

From [w95/awesome-claude-corporate-skills](https://github.com/w95/awesome-claude-corporate-skills) (MIT). Production-ready skills by corporate role — executive, finance, HR, marketing, sales, legal, ops, engineering, product, data, CS, procurement, documents.

| Department | Skills | Examples |
|------------|--------|----------|
| Executive | 12 | `strategic-planning`, `board-meeting-prep`, `ma-due-diligence` |
| Finance | 42 | `dcf-model`, `lbo-model`, `pitch-deck`, `comps-analysis` |
| Marketing | 15 | `seo-content-optimizer`, `campaign-planner`, `brand-guidelines` |
| Sales | 16 | `call-prep`, `compose-outreach`, `account-research` |
| Engineering | 14 | `code-review`, `system-design`, `test-driven-development` |
| Product | 10 | `prd-writer`, `roadmap-builder`, `feature-spec` |
| + 8 more depts | 57 | HR, legal, ops, data, CS, procurement, documents, meta |

See [skills/community/awesome-claude-corporate-skills/README.md](skills/community/awesome-claude-corporate-skills/README.md).

### Community — inference.sh (85)

From [inference-sh/skills](https://github.com/inference-sh/skills) (MIT). AI media generation via the [inference.sh](https://inference.sh) CLI (`belt`) — images, video, audio, LLMs, web search, and content production guides.

| Category | Skills | Examples |
|----------|--------|----------|
| Audio & Speech | 13 | `text-to-speech`, `ai-music-generation`, `elevenlabs-tts` |
| Image | 10 | `ai-image-generation`, `flux-image`, `gpt-image` |
| Video | 9 | `ai-video-generation`, `google-veo`, `seedance` |
| LLM & Search | 3 | `llm-models`, `web-search`, `ai-rag-pipeline` |
| Platform & SDK | 8 | `infsh-cli`, `python-sdk`, `javascript-sdk` |
| UI | 4 | `agent-ui`, `chat-ui`, `tools-ui` |
| Guides | 38 | `ai-podcast-creation`, `prompt-engineering`, `landing-page-design` |

Podcast production stack: `ai-podcast-creation` + `text-to-speech` + `ai-music-generation` + `llm-models` + `infsh-cli`. Requires `belt login`. See [skills/community/inference-sh/README.md](skills/community/inference-sh/README.md).

---

## Rules (`rules/shared/`)

Generic rules applicable to any project. Session rules work together as a chain:

```
startup-session (always)
  → readme-first-session (docs)
  → project-context (template — copy & fill per project)
  → baseline-verification (globs — only when code files in context)
  → engineering-workflow (dev loop)
  → business-idea-runbook (virtual business team: intake → launch → operate)
```

| Rule | Apply | Purpose |
|------|-------|---------|
| `business-idea-runbook.mdc` | on demand | **Virtual business team runbook** — 11 roles (CEO, CFO, CMO, CTO…) execute strategy → funding → build → hiring → brand → web → content → SEO → launch → ongoing operations |
| `startup-session.mdc` | always | Orchestrates session ritual: scope, git, plan |
| `readme-first-session.mdc` | always | Doc-reading checklist (invoked by startup) |
| `project-context.mdc` | template | Copy per project — stack, layout, commands, gaps |
| `baseline-verification.mdc` | globs | Test/lint baseline before code edits |
| `engineering-workflow.mdc` | always | Task-driven, TDD, end-to-end workflow |
| `no-scaffold-code.mdc` | always | No dead code — everything must be wired |
| `testing-tdd.mdc` | always | Test-driven development policy |
| `post-plan-deep-review.mdc` | always | End-to-end review after multi-step plans |
| `documentation-maintenance.mdc` | always | Keep docs in sync with code |
| `cursor_rules.mdc` | always | How to write effective Cursor rules |
| `self_improve.mdc` | always | Self-improving rule patterns |
| `taskmaster/*` | always | TaskMaster AI workflow rules |

---

## Usage

### Add skills to a new project

```bash
# Copy a single skill
cp -r skills/plugins/vercel/nextjs /path/to/project/.cursor/skills/

# Copy a category of workflow skills
cp -r skills/plugins/superpowers/test-driven-development /path/to/project/.cursor/skills/
```

### Add rules to a new project

```bash
# Copy the full shared ruleset
cp -r rules/shared/* /path/to/project/.cursor/rules/

# Or pick individual rules
cp rules/shared/no-scaffold-code.mdc /path/to/project/.cursor/rules/
cp rules/shared/testing-tdd.mdc /path/to/project/.cursor/rules/
```

### Recommended starter set

For a new full-stack project:

```bash
# Core session + workflow rules
cp rules/shared/{startup-session,readme-first-session,baseline-verification,engineering-workflow,no-scaffold-code,testing-tdd,post-plan-deep-review,documentation-maintenance}.mdc /path/to/project/.cursor/rules/

# Project context template — fill in placeholders, then set alwaysApply: true
cp rules/shared/project-context.mdc /path/to/project/.cursor/rules/

# Business idea execution runbook (virtual business team, continuous)
cp rules/shared/business-idea-runbook.mdc /path/to/project/.cursor/rules/
# Prefer: scripts/new-venture.sh <slug> "<Name>"
cp -r templates/business-idea/* docs/projects/<slug>/business-idea/
```

And these skills based on your stack:

```bash
# Next.js + Vercel
cp -r skills/plugins/vercel/{nextjs,shadcn,auth} /path/to/project/.cursor/skills/

# Supabase backend
cp -r skills/plugins/supabase/supabase /path/to/project/.cursor/skills/

# General development workflow
cp -r skills/plugins/superpowers/{test-driven-development,systematic-debugging,verification-before-completion} /path/to/project/.cursor/skills/

# SEO (NotFair)
cp -r skills/community/notfair-seo/schema-markup-generator /path/to/project/.cursor/skills/
# Or copy the full SEO suite:
cp -r skills/community/notfair-seo/{schema-markup-generator,meta-tags-optimizer,keyword-research} /path/to/project/.cursor/skills/

# UI/UX design intelligence
cp -r skills/community/ui-ux-pro-max-skill/ui-ux-pro-max /path/to/project/.cursor/skills/

# Remotion video creation (copy full video/ folder — skills cross-reference)
cp -r skills/community/remotion/video/* /path/to/project/.cursor/skills/

# Marketing (start with product-marketing foundation)
cp -r skills/community/marketingskills/{product-marketing,copywriting,cro,seo-audit} /path/to/project/.cursor/skills/

# Kim Barrett advertising (direct response / paid)
cp -r skills/community/advertising-skills/skills/* /path/to/project/.cursor/skills/

# AI image/video prompting (keep references/ folders)
cp -r skills/community/visual-skills/{image,video} /path/to/project/.cursor/skills/

# OpenMontage — run in place (do not strip to single skills)
# cd skills/community/openmontage && make setup

# Business analysis
cp -r skills/community/business-analysis-skills/skills/{business-problem-framing,requirements-elicitation,requirements-packager} /path/to/project/.cursor/skills/

# Corporate marketing
cp -r skills/community/awesome-claude-corporate-skills/04-marketing/seo-content-optimizer /path/to/project/.cursor/skills/

# Deep research (shared/ must come along — skills depend on it)
cp -r skills/community/academic-research-skills/{deep-research,shared} /path/to/project/.cursor/skills/

# CAD / hardware prototyping
cp -r skills/community/text-to-cad/{cad,cad-viewer,step-parts} /path/to/project/.cursor/skills/

# AI podcast / audio content (requires belt CLI)
cp -r skills/community/inference-sh/{ai-podcast-creation,text-to-speech,ai-music-generation,llm-models,infsh-cli} /path/to/project/.cursor/skills/
```

---

## What Was Removed

All company-specific and project-specific content has been stripped:

- SuperPatch content skills, brand voice, design system rules
- Sales enablement skills and rules
- PIRX, OTTARI, jai, Medical Questionairre, and other project-specific skills
- Project-specific agent instruction files (AGENTS.md, CLAUDE.md)

Only portable, framework-agnostic patterns remain.
