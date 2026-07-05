# Tasks: Platform Scaffold — Home Screen & Hash Routing

**Tasks ID**: TASKS-001

**Plan**: PLAN-001 | **Spec**: SPEC-001

**Date**: 2026-07-05

**Implementation rule**: Each task is a vertical slice — it delivers a working end-to-end thread. CSS/design system is applied within the task that introduces the UI. Tests are written and confirmed failing before implementation code is added.

---

## Slice 1 — Deployable Shell (FR-001, NF-001, NF-003, NF-004, NF-005)

**Goal**: A bare Vite + React page deploys successfully to GitHub Pages via GitHub Actions. ESLint and Jest are wired up and passing in CI. This is the foundation every subsequent slice builds on.

**Independent test**: Push to `main` → CI pipeline passes → page is live at `https://timothystokes.github.io/agile-games/`

- [ ] T001 Scaffold Vite + React project at repo root: `npm create vite@latest . -- --template react`, install deps, confirm `npm run dev` serves locally
- [ ] T002 Add Jest + React Testing Library: install `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom`; add `jest.config.js`; write and confirm a smoke test (`App renders without crashing`) fails then passes
- [ ] T003 Add ESLint: install `eslint`, `eslint-plugin-react`; add `.eslintrc.cjs`; confirm `npm run lint` runs clean
- [ ] T004 Add GitHub Actions CI workflow at `.github/workflows/ci.yml`: triggers on push to all branches; runs `npm ci`, `npm run lint`, `npm test`; on `main` only — deploys to GitHub Pages using `actions/deploy-pages`
- [ ] T005 Configure `vite.config.js` base path to `/agile-games/` for GitHub Pages compatibility; confirm build output is correct

**Checkpoint**: Push to `main` → CI green → site live at root URL showing bare React app.

---

## Slice 2 — Home Screen with Game Cards from Markdown (FR-002, FR-003, FR-006, FR-007, FR-009, FR-013, FR-014)

**Goal**: The home screen renders five styled game cards. Card content (title, principle, description, accent colour) is parsed from `/content/game-N.md` frontmatter. The full design system (dark mode, typography, card tinting, rounded corners) is applied here.

**Independent test**: Open root URL → five game cards render with correct titles, principles, and accent-coloured borders/tints loaded from markdown files.

- [ ] T006 Create `/content/game-1.md` through `/content/game-5.md` with YAML frontmatter (`id`, `title`, `principle`, `accentColour`, `description`) — one file per game with real placeholder content for each agile principle
- [ ] T007 Write tests for `src/utils/content.js` — `fetchGameContent(id)` fetches and parses frontmatter from a markdown file, returns a plain object; tests mock `fetch`; confirm tests fail
- [ ] T008 Implement `src/utils/content.js` — pure function `fetchGameContent(id)` that fetches `content/game-{id}.md` and parses YAML frontmatter using `marked`; confirm T007 tests pass
- [ ] T009 Write tests for `src/components/GameCard.jsx` — renders `title`, `principle`, `description`; applies correct accent colour CSS class; confirm tests fail
- [ ] T010 Implement `src/components/GameCard.jsx` with design system styling: accent-coloured border, card background tinted to match accent (12% mix), Righteous font for title, Gelasio for description, rounded corners, white text; confirm T009 tests pass
- [ ] T011 Write tests for `src/components/HomeScreen.jsx` — renders five `GameCard` components when given an array of game content objects; confirm tests fail
- [ ] T012 Implement `src/components/HomeScreen.jsx` — fetches all five game content files on mount, renders a `GameCard` for each; add `src/styles/global.css` with design system tokens (CSS custom properties for colours, fonts, radius); apply dark background to page; confirm T011 tests pass

**Checkpoint**: Root URL shows five styled game cards with correct content and design system applied. No hardcoded strings in components.

---

## Slice 3 — Hash Routing to Game Placeholders (FR-002, FR-003, FR-004, FR-010, FR-011)

**Goal**: Navigating to `#game-1` through `#game-5` renders a styled game placeholder view for that game. An empty or unknown hash shows the home screen. The browser back button returns to home. All routing logic is accessible (keyboard navigable, semantic HTML).

**Independent test**: Paste `#game-3` in the URL bar → Game 3 placeholder renders. Remove hash → home screen renders.

- [ ] T013 Write tests for `src/utils/router.js` — pure functions: `parseHash(hash)` returns a valid game ID or `null`; `isValidGameId(id)` returns true for `game-1` through `game-5`; confirm tests fail
- [ ] T014 Implement `src/utils/router.js` — `parseHash` and `isValidGameId` as pure functions; confirm T013 tests pass
- [ ] T015 Write tests for `src/components/GamePlaceholder.jsx` — renders game title and a "Back to Home" link; confirm tests fail
- [ ] T016 Implement `src/components/GamePlaceholder.jsx` — styled placeholder view showing game title, principle name, and a visible "Back to Home" `<a href="#" />` link; apply design system (dark, accent colour matching the game, Righteous heading); confirm T015 tests pass
- [ ] T017 Write tests for `src/App.jsx` — renders `HomeScreen` when hash is empty or invalid; renders `GamePlaceholder` with correct game ID when hash is `#game-1` through `#game-5`; listens to `hashchange` events and re-renders correctly; confirm tests fail
- [ ] T018 Implement `src/App.jsx` — hash router using `window.location.hash` and `hashchange` event listener; renders `HomeScreen` or `GamePlaceholder` based on parsed hash; confirm T017 tests pass
- [ ] T019 Wire `GameCard` click/keyboard action to update `window.location.hash` to the game's ID; confirm keyboard navigation (Enter/Space on card) triggers navigation

**Checkpoint**: Full hash routing works. Home ↔ game placeholder navigation via clicks, keyboard, and direct URL entry.

---

## Slice 4 — Animated Page Transitions (FR-008)

**Goal**: Navigating between home and a game view is animated — the incoming view fades/slides in, the outgoing view fades out. Card state changes within a game also animate smoothly.

**Independent test**: Click a game card → transition animation plays before game placeholder appears. Click "Back to Home" → transition back.

- [ ] T020 Write tests for transition animation state in `App.jsx` — verify that a `transitioning` flag is set during navigation and cleared after; confirm tests fail
- [ ] T021 Implement CSS transition classes in `global.css`: `.page-enter` (fade+slide in), `.page-exit` (fade out); apply via React state in `App.jsx`; confirm T020 tests pass and transitions are visible in the browser

**Checkpoint**: Navigation between home and game views is visibly animated. No jank.

---

## Dependencies & Execution Order

- **Slice 1** has no dependencies — start here
- **Slice 2** depends on Slice 1 (project scaffold must exist)
- **Slice 3** depends on Slice 2 (home screen must exist to navigate away from)
- **Slice 4** depends on Slice 3 (routing must work before animating transitions)
- Within each slice: write tests → confirm failing → implement → confirm passing → commit

---

## Notes

- Every task that introduces UI MUST include design system styling in the same task — no CSS-later tasks
- Commit after each slice checkpoint (or sooner if a task is self-contained)
- Commit messages reference TASKS-001 and the relevant task ID (e.g. `feat(TASKS-001/T006): add game content markdown files`)
- `marked` is the only added runtime dependency beyond React/Vite — justify any additional deps before adding
