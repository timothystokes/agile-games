# Implementation Plan: Platform Scaffold — Home Screen & Hash Routing

**Plan ID**: PLAN-001

**Spec**: SPEC-001

**Date**: 2026-07-05

**Status**: Approved

## Summary

Scaffold the Agile Games platform as a Vite + React SPA deployed to GitHub Pages via GitHub Actions. The home screen renders five game cards whose content is loaded from markdown files in `/content`. Hash-based routing (`#game-1` through `#game-5`) navigates to per-game placeholder views. Design system (dark mode, accent palette, typography, animations) is applied as part of each vertical slice — never as a separate CSS pass at the end.

## Technical Context

**Language**: JavaScript (ES2022+), no TypeScript

**Framework**: React 18 (functional components, hooks only — no classes)

**Bundler**: Vite 5

**Testing**: Jest + React Testing Library (TDD mandatory)

**Linting**: ESLint with React plugin

**Hosting**: GitHub Pages, root path `/`

**CI/CD**: GitHub Actions — lint + test on every push; deploy on `main` passing

**Fonts**: Google Fonts (Righteous, Gelasio) — loaded via `<link>` in `index.html`

**Markdown parsing**: `marked` (lightweight, no dependencies) — parses frontmatter + body from `/content/*.md` files fetched at runtime via `fetch()`

**Animations**: CSS transitions + `@keyframes`; no animation library

**Storage**: None

**Performance**: No hard targets; animations must be smooth (no jank)

**Browser support**: Modern evergreen (Chrome, Firefox, Safari, Edge)

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Test-First | ✅ | Jest tests written before implementation in every task |
| II. Pure Functions Only | ✅ | No class components; all logic as pure functions |
| III. Spec-Driven | ✅ | Flows from SPEC-001 |
| IV. Simplicity | ✅ | Vite + React + vanilla JS; `marked` is the only added dep |
| V. CI/Quality Gates | ✅ | GitHub Actions pipeline defined in Phase 1 |
| VI. Accessibility | ✅ | WCAG Level A applied per slice |

## Project Structure

```text
agile-games/
├── public/                        # Static assets (favicon etc.)
├── content/                       # Markdown content files (source of truth)
│   ├── game-1.md                  # Game 1: Alignment
│   ├── game-2.md                  # Game 2: Persistence
│   ├── game-3.md                  # Game 3: Teamwork
│   ├── game-4.md                  # Game 4: Improvement
│   └── game-5.md                  # Game 5: Delivery
├── src/
│   ├── main.jsx                   # React entry point
│   ├── App.jsx                    # Root component — hash router
│   ├── styles/
│   │   └── global.css             # Design system tokens + base styles
│   ├── components/
│   │   ├── HomeScreen.jsx         # Home screen — renders GameCard list
│   │   ├── GameCard.jsx           # Individual game card
│   │   ├── GamePlaceholder.jsx    # Placeholder view for each game
│   │   └── NavBar.jsx             # Top nav with home link
│   └── utils/
│       ├── router.js              # Hash routing logic (pure functions)
│       └── content.js             # Markdown fetch + parse (pure functions)
├── src/__tests__/
│   ├── router.test.js
│   ├── content.test.js
│   ├── App.test.jsx
│   ├── HomeScreen.test.jsx
│   ├── GameCard.test.jsx
│   └── GamePlaceholder.test.jsx
├── .github/
│   └── workflows/
│       └── ci.yml                 # Lint + test + deploy pipeline
├── index.html
├── vite.config.js
├── jest.config.js
├── .eslintrc.cjs
└── package.json
```

## Implementation Strategy

Work is delivered in **vertical slices**. Each slice produces a fully working end-to-end thread visible in the browser. CSS and design system tokens are applied within the slice that introduces the UI — never deferred to a later task. TDD: tests are written and confirmed failing before implementation code is added.

### Slice order

1. **Slice 1 — Deployable shell**: Vite+React scaffold + CI/CD pipeline → bare page deploys to GitHub Pages
2. **Slice 2 — Home screen with content from markdown**: `/content/*.md` files → parsed → five game cards rendered on home screen with full design system styling
3. **Slice 3 — Hash routing to game placeholders**: `#game-1` etc. routes to a styled game placeholder; empty/unknown hash shows home
4. **Slice 4 — Animated transitions**: Smooth page transitions between home and game views

## Markdown Content Format

Each `content/game-N.md` file uses YAML frontmatter:

```markdown
---
id: game-1
title: "Game 1: Alignment"
principle: "Alignment"
accentColour: "pink"
description: "One sentence describing the agile principle taught."
---

Optional longer body content for future use.
```

The `accentColour` field maps to a design system token that determines the card border/tint colour.

## Design System Tokens (global.css)

```css
:root {
  --color-bg: #0d0d0d;
  --color-text: #ffffff;
  --color-pink: #ff2d78;
  --color-yellow: #ffd600;
  --color-blue: #2979ff;
  --color-cyan: #00e5ff;
  --color-orange: #ff6d00;
  --color-green: #00e676;   /* positive outcome only */
  --color-red: #ff1744;     /* negative outcome only */
  --radius: 12px;
  --font-title: 'Righteous', sans-serif;
  --font-body: 'Gelasio', serif;
}
```

Card tint: `background: color-mix(in srgb, var(--color-{accent}) 12%, var(--color-bg))` for top-level cards; `20%` mix for nested/elevated panels.
