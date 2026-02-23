# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Studio Auralis portfolio — a premium French design agency site. Static HTML/CSS/JS with GSAP animations, canvas particles, and a custom cursor. No build system or framework.

## Development

**No build step.** Open `index.html` in a browser or serve with any HTTP server:
```bash
npx http-server . -p 8080
```

For Playwright testing, use HTTP (file:// is blocked). Close Chrome user sessions before running Playwright MCP on Windows.

The only npm dependency is `playwright` (for browser automation/testing).

## Architecture

### Main Site — 3 files
- **`index.html`** (~684 lines) — Single-page with 10 sections: Loader → Nav → Hero → Services → Projet Phare → Projets → À Propos → Process → Contact → Footer
- **`css/style.css`** (~2,113 lines) — All styles, CSS variables for design tokens, responsive breakpoints at 1024px and 768px
- **`js/main.js`** (~994 lines) — IIFE with ~15 `init*()` functions: loader, cursor, navbar, particles, hero parallax/animation, services, phare, projets, apropos, process, contact form, contact animation, decorations, smooth scroll

### Sub-pages (standalone, self-contained HTML)
- **`chatbot-demo.html`** — ChatWidget interactive demo
- **`workflow-demo.html`** — Workflow automation demo (React 18 via CDN + Babel)
- **`projets-agents.html`** — Agents IA project detail page
- **`projets-automatisation.html`** — Automatisation IA project detail page
- **`projets-dev.html`** — Développement project detail page
- **`agent-ia/public/`** — AI Strategy Engine demo (multi-agent orchestration UI with particle bg, form, PDF generation)

### External Dependencies (CDN only)
- GSAP 3.12.5 + ScrollTrigger (cdnjs)
- Google Fonts: Outfit, Instrument Serif, JetBrains Mono

### Assets
- `assets/screenshots/` — 7 project card images (PNG): motionup, amenagement, chatwidget, qualification-leads, ai-strategy, conflict-tracker, subtitlesai
- `assets/aurora-bg.png` — Hero background (~30MB)
- `assets/aurora-bg.jpg` — Hero background (compressed)

## Design System

### Color tokens (CSS variables prefixed `--gold-*` and `--noir-*`)
- Background: `#080B12` / Cards: `#0D1117` / Borders: `#2A3140`
- Turquoise accent: `#00E5CC` / bright: `#50FFEB` / dim: `#00BFA6`
- Text hierarchy: `#E8EAED` → `#C4C8CE` → `#5A6372` → `#3A4150`

### Typography conventions
- **Outfit** (200–900): display headings at weight 900, letter-spacing `-.03em`
- **Instrument Serif** (italic only): always turquoise, used for one emotional keyword per section title
- **JetBrains Mono**: tech labels, code-like elements

### Animation patterns
- Page load: GSAP timeline for staggered reveals
- Scroll: ScrollTrigger for viewport-triggered animations
- Continuous: CSS keyframe animations (aurora streaks, grain shift, orbit floats)
- Canvas 2D: constellation particles (55 nodes, mouse gravity, shooting stars) — disabled on mobile <768px
- `prefers-reduced-motion` is respected

## Content Rules

- All copy is in **French** with proper accents (é, è, ê, à, ç)
- Contact form is client-side only (builds a `mailto:` link, no server)
- Contact: `contact@studio-auralis.com`
