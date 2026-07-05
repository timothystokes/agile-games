# Agile Games Constitution

## Core Principles

### I. Test-First (NON-NEGOTIABLE)
TDD is mandatory on every feature. Tests MUST be written and reviewed before implementation begins. The Red-Green-Refactor cycle is strictly enforced. Jest is the test runner. No implementation code ships without a corresponding passing test.

### II. Pure Functions Only
All logic MUST be expressed as pure functions — no classes, no side-effect-laden objects. Shared helpers MUST be stateless. State and side effects are owned by the top-level component or entry point, never by shared utilities. Tiny single-use helpers MUST be scoped inside the function that uses them rather than exposed as top-level utilities.

### III. Spec-Driven Development (NON-NEGOTIABLE)
All features MUST originate from a spec-kit specification. The workflow order is: constitution → specify → plan → tasks → implement. No code is written without a corresponding task in the task list. The spec is the source of truth; implementation serves the spec, not the other way around.

### IV. Simplicity & Minimal Dependencies
The solution MUST use the minimum number of dependencies to achieve the outcome. Vite + React + vanilla JS is the stack. No unnecessary abstractions. Route dispatch stays inline unless extraction adds genuine reuse. Single-use temporary values are inlined — no unnecessary local variables.

### V. Continuous Integration & Quality Gates
The `main` branch MUST always be deployable. Every push MUST pass linting and the full Jest test suite in CI before merging. GitHub Actions runs the CI pipeline. GitHub Pages deploys from `main` to the root path `/` on every passing build.

### VI. Accessibility
All UI MUST meet WCAG Level A compliance. Keyboard navigation MUST be supported. Colour is never the sole indicator of state.

## Technology Constraints

- **Frontend**: Vite + React, vanilla JS — no TypeScript, no class components
- **Rendering**: Single-page application with hash-based routing (`/#game-1`, `/#game-2`, etc.)
- **Backend**: None — fully client-side, no server, no database
- **State**: No persistence between sessions; each game starts fresh
- **Testing**: Jest (TDD, mandatory)
- **Linting**: ESLint, enforced in CI
- **Hosting**: GitHub Pages, root path `/`
- **Deployment**: GitHub Actions on push to `main`
- **Browsers**: Modern evergreen (Chrome, Firefox, Safari, Edge)
- **Fonts**: Google Fonts — Righteous (titles/headings), Gelasio (body/data)
- **Localisation**: English only
- **Analytics**: None
- **Licence**: None (private)

## Design System

- **Mode**: Dark throughout
- **Background**: Near-black canvas
- **Text**: White
- **Corners**: Rounded everywhere
- **Accent palette**: Bright pink, bright yellow, bright blue, bright cyan, bright orange
- **Status colours**: Bright green (positive outcome), bright red (negative outcome) — reserved for in-game feedback only
- **Cards**: Each card/panel is tinted to match its border accent colour. Nested/embedded cards use a brighter tint to appear elevated above their container
- **Animations**: Card movement and state transitions MUST use smooth CSS/JS animations

## Development Workflow

All development follows the spec-kit workflow. The agent-log (`agent-log.md`) records every interaction with a timestamp. A commit is made after every agent-log update. Commit messages MUST reference spec-kit artifact IDs (constitution, spec, plan, task IDs). Implementation decisions that deviate from the spec MUST be documented and the spec updated to match.

## Governance

This constitution supersedes all other practices and conventions. Amendments require: (1) a clear rationale, (2) updates to all dependent artifacts (spec, plan, tasks), and (3) a constitution version bump following semantic versioning. All code review MUST verify compliance with these principles. Complexity requires explicit justification. Refer to `README.md` as the runtime navigation guide.

**Version**: 1.0.0 | **Ratified**: 2026-07-05 | **Last Amended**: 2026-07-05
