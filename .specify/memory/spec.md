# Feature Specification: Agile Games — High-Level Platform

**Spec ID**: SPEC-001

**Created**: 2026-07-05

**Status**: Draft

## Overview

Agile Games is a collection of browser-based simulation games that teach core agile principles by letting individuals experience the impact of different delivery approaches first-hand. Each game is a self-contained Lab. Players are individual agile practitioners — developers, testers, product managers, or anyone involved in software or digital product delivery.

### Labs

| ID | Title | Agile Principle |
|---|---|---|
| Game 1 | Alignment | Shared understanding and goal alignment |
| Game 2 | Persistence | Consistency and commitment over time |
| Game 3 | Teamwork | Collaboration and cross-functional delivery |
| Game 4 | Improvement | Inspect and adapt / continuous improvement |
| Game 5 | Delivery | Iterative delivery and value flow |

## User Scenarios & Testing

### User Story 1 — Navigate to a Game via Deep Link (Priority: P1)

A player receives a shared link to a specific game (e.g. `https://timothystokes.github.io/agile-games/#game-1`) and lands directly in that game without needing to navigate from a home page.

**Why this priority**: Deep linking is the primary sharing mechanism. It must work before anything else.

**Independent Test**: Open the URL with a hash fragment — the correct game renders immediately.

**Acceptance Scenarios**:

1. **Given** a URL with a valid hash (e.g. `#game-1`), **When** the player opens it, **Then** Game 1 renders immediately
2. **Given** a URL with no hash or an unknown hash, **When** the player opens it, **Then** a home/menu screen listing all five games is shown
3. **Given** the player is in a game, **When** they copy the URL, **Then** the URL contains the correct hash for that game

---

### User Story 2 — Browse All Games from Home (Priority: P2)

A player arrives at the root URL and sees all five games listed with their titles and a brief description of the agile principle each teaches.

**Why this priority**: The home screen is the fallback entry point and the discovery surface.

**Independent Test**: Navigate to the root URL — a list of all five games renders with titles, descriptions, and links.

**Acceptance Scenarios**:

1. **Given** the player is on the home screen, **When** they view the page, **Then** all five games are listed with title and agile principle
2. **Given** the player clicks a game on the home screen, **When** the navigation completes, **Then** the hash updates and the game renders
3. **Given** the player uses the browser back button from a game, **When** navigation resolves, **Then** the home screen is shown

---

### User Story 3 — Play a Game to Completion (Priority: P1)

A player works through a game Lab from start to finish, making choices that influence the outcome, and sees a results screen reflecting the agile principle demonstrated.

**Why this priority**: Core product value — the game must be playable end-to-end.

**Independent Test**: Play any single Lab from the first interaction to the results screen without error.

**Acceptance Scenarios**:

1. **Given** a player starts a game, **When** they complete all interactions, **Then** a results/outcome screen is shown
2. **Given** a player sees the results screen, **When** they view it, **Then** the outcome reflects the choices made during the game
3. **Given** a player wants to restart, **When** they trigger a restart, **Then** the game resets to its initial state with no carry-over from the previous session

---

### User Story 4 — Animated Card Interactions (Priority: P2)

Cards and game elements move with smooth animations so the experience feels polished and the cause-and-effect of decisions is visually clear.

**Why this priority**: Animations reinforce learning by making outcomes tangible and satisfying.

**Independent Test**: Trigger a card move action — the card animates smoothly to its destination.

**Acceptance Scenarios**:

1. **Given** a game state change occurs, **When** cards reposition, **Then** movement is animated (not instant jump)
2. **Given** a positive outcome, **When** it is displayed, **Then** it uses the bright green status colour with a distinct animation
3. **Given** a negative outcome, **When** it is displayed, **Then** it uses the bright red status colour with a distinct animation

---

### Edge Cases

- What happens when the hash references a game ID that does not exist? → Home screen is shown
- What happens if the player resizes the browser mid-game? → Layout adapts responsively
- What happens if the player navigates away mid-game and returns? → Game resets (no persistence)

## Requirements

### Functional Requirements

- **FR-001**: The application MUST render as a single-page application with no server-side rendering
- **FR-002**: Hash-based routing MUST map `#game-1` through `#game-5` to their respective Lab components
- **FR-003**: An empty or unrecognised hash MUST render the home/menu screen listing all five games
- **FR-004**: Each game MUST be independently reachable via a shareable URL containing its hash
- **FR-005**: Each game MUST reset to its initial state on every page load or explicit restart — no session persistence
- **FR-006**: The UI MUST apply the defined design system: dark mode, near-black background, white text, rounded corners, accent palette (pink, yellow, blue, cyan, orange), status colours (green/red) reserved for game outcomes
- **FR-007**: Card/panel tinting MUST match the border accent colour; nested cards MUST use a brighter tint to appear elevated
- **FR-008**: All card movement and state transitions MUST use smooth CSS or JS animations
- **FR-009**: Fonts MUST be loaded from Google Fonts: Righteous for titles/headings, Gelasio for body/data text
- **FR-010**: The application MUST meet WCAG Level A accessibility compliance
- **FR-011**: Keyboard navigation MUST be supported throughout
- **FR-012**: Colour MUST NOT be the sole indicator of any state or outcome
- **FR-013**: Game card content on the home screen (title, agile principle, description) MUST be loaded from markdown files in a `/content` folder (e.g. `content/game-1.md`)
- **FR-014**: Markdown content files MUST be the single source of truth for game metadata — no hardcoded strings in components

### Key Entities

- **Game / Lab**: A self-contained simulation identified by an ID (game-1 through game-5) with a title, agile principle, and a sequence of interactions leading to an outcome
- **Game State**: Ephemeral in-memory state for the current session — choices made, current step, outcome — discarded on reset or navigation away
- **Home Screen**: The default view listing all Labs with title and principle description

## Non-Functional Requirements

- **NF-001**: Stack — Vite + React, vanilla JS, pure functions only, no class components
- **NF-002**: Testing — Jest, TDD mandatory, all logic covered by tests before implementation
- **NF-003**: Linting — ESLint enforced in CI; no lint errors on `main`
- **NF-004**: CI/CD — GitHub Actions pipeline runs lint + tests on every push; deploys to GitHub Pages on `main` passing build
- **NF-005**: Hosting — GitHub Pages, served from root path `/`
- **NF-006**: Browser support — modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- **NF-007**: No analytics, no tracking, no telemetry
- **NF-008**: English only — no i18n required
- **NF-009**: No backend, no database, no authentication
- **NF-010**: No software licence

## Success Criteria

- **SC-001**: All five games are reachable via deep link hash URLs
- **SC-002**: A player can complete any game from start to results screen without encountering an error
- **SC-003**: Every UI interaction covered by a Jest test; CI passes on `main`
- **SC-004**: The site is live and accessible on GitHub Pages at the root path
- **SC-005**: WCAG Level A audit passes on the home screen and each game screen

## Assumptions

- Game mechanics per Lab are defined in subsequent Lab-specific specs (SPEC-002 onwards)
- No facilitator or admin role is required at this stage
- No user accounts or profiles are needed
- The five game titles and agile principles listed are fixed for v1
