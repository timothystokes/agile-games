# Implementation Plan: Game 2 — Persistence

**Plan ID**: PLAN-002
**Spec**: SPEC-002
**Date**: 2026-07-05
**Status**: Draft

---

## Summary

Implement Game 2: Persistence as a self-contained Kanban sprint simulation. The player manages a randomised set of User Stories and Tasks across a 80-second simulated sprint, experiencing the impact of WIP limits, priority order, and TDD discipline on value delivery. All logic is pure functions tested before implementation; UI is vertically sliced so every slice produces a visible, working end-to-end thread.

---

## Technical Approach

### Component Hierarchy

```
App.jsx
└── Game2.jsx                  ← top-level orchestrator; owns all sprint state
    ├── IntroScreen.jsx         ← renders game-2.md body + Start button
    ├── CountdownOverlay.jsx    ← GET READY + 5→1 countdown
    ├── SprintBoard.jsx         ← timeline + kanban columns
    │   ├── Timeline.jsx        ← 10-day bar + animated marker
    │   └── StoryLane.jsx       ← swim lane per User Story (spans columns)
    │       └── TaskCard.jsx    ← task card with progress bar + buttons
    └── ResultsScreen.jsx       ← metrics + tip + actions
```

### State Shape (owned by Game2.jsx)

```js
{
  phase: 'intro' | 'countdown' | 'active' | 'results',
  config: SprintConfig,     // immutable — generated once per game
  stories: Story[],         // mutable — task statuses, progress, flags
  elapsedHours: number,     // 0–80, increments each second
  countdownValue: number,   // 5→0 during countdown phase
}
```

### Pure Function Modules

| Module | Responsibility |
|---|---|
| `src/games/game2/logic/generate.js` | Randomise stories, tasks, business values, disruption events |
| `src/games/game2/logic/wip.js` | Calculate WIP multiplier; advance task progress per tick |
| `src/games/game2/logic/disruption.js` | Check and apply disruption events on each tick |
| `src/games/game2/logic/tdd.js` | Detect write-tests-last condition; spawn bug tasks |
| `src/games/game2/logic/results.js` | Calculate throughput, cycle time, learning tip |

### File Layout

```
src/
  games/
    game2/
      Game2.jsx
      Game2.module.css
      components/
        IntroScreen.jsx + .module.css
        CountdownOverlay.jsx + .module.css
        SprintBoard.jsx + .module.css
        Timeline.jsx + .module.css
        StoryLane.jsx + .module.css
        TaskCard.jsx + .module.css
        ResultsScreen.jsx + .module.css
      logic/
        generate.js
        wip.js
        disruption.js
        tdd.js
        results.js
      __tests__/
        generate.test.js
        wip.test.js
        disruption.test.js
        tdd.test.js
        results.test.js
        TaskCard.test.jsx
        StoryLane.test.jsx
        ResultsScreen.test.jsx
```

### Integration into Platform

- `App.jsx` already routes `#game-2` to `<GamePlaceholder>`. Replace the placeholder import with `<Game2>` for the `game-2` case.
- `public/content/game-2.md` body is fetched by `IntroScreen` using the existing `fetchGameContent` utility.

---

## Vertical Slices

### Slice A — Intro Screen (end-to-end: route → content → Start button)
Navigating to `#game-2` shows the intro screen with game-2.md body content and a Start button. The board is not yet interactive. Proves the routing integration and content loading work.

### Slice B — Countdown + Board Skeleton (end-to-end: start → countdown → empty board + running timer)
Pressing Start triggers the GET READY countdown then reveals the Kanban board with the timeline marker moving and story swim lanes visible (tasks not yet interactive). Proves the timer loop, state machine phases, and layout work.

### Slice C — Task Interaction + WIP Mechanic (end-to-end: start/pause/resume → progress bars → auto-complete → WIP speed effect)
Task cards are interactive: Start/Pause/Resume moves them between columns and drives progress bars. The WIP multiplier applies in real time. Tasks auto-complete and turn green. User Stories turn green when all tasks done. Proves the core game mechanic works.

### Slice D — Disruption & TDD Events (end-to-end: events fire → CHANGED badge / Bug task appear → board updates)
Disruption events reset tasks with a CHANGED badge at the correct simulated-hour window. The TDD mechanic spawns a Bug task when Write Tests is done last. Proves the learning mechanics work.

### Slice E — Results Screen (end-to-end: timer expires → results with correct metrics → Play Again / Back to Home)
When the sprint timer hits 80 hours the results screen appears with all metrics calculated and a context-sensitive tip. Play Again resets to a new randomised game; Back to Home navigates to `#`. Proves the full game loop is complete.

---

## Key Design Decisions

1. **Game state in Game2.jsx, not a store** — all state lives in one `useReducer` hook in `Game2.jsx`; pure logic functions are called from the reducer. No external state library.

2. **`useInterval` hook for the game tick** — a single `setInterval` at 1000ms drives the whole simulation. Each tick: advance `elapsedHours`, advance task progress (via `wip.js`), fire disruption events (via `disruption.js`), check TDD condition (via `tdd.js`), check for sprint end.

3. **Progress as accumulated hours** — each task stores `progressHours` (0 → `estimatedHours`). The WIP multiplier determines how many hours are added per tick. This makes pausing, resuming, and the WIP effect simple arithmetic.

4. **Animations via CSS classes** — task card column transitions use `data-status` attribute on the card + CSS transitions. Countdown uses a CSS keyframe animation. Results screen fades in. No JS animation library.

5. **Story generation seeded fresh each Play Again** — `generateSprint()` is called with `Math.random()` on mount and on Play Again. No seed persistence.

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Timer drift over 80s | Use `Date.now()` delta on each tick rather than counting ticks |
| Task progress calculation complexity with variable N | Pure `advanceTick(stories, elapsedHours)` function; tested exhaustively |
| Disruption event timing feels unfair | Fix event windows to exact simulated-hour boundaries from generated config |
| Bug task spawned after sprint ends | Disruption/TDD checks guard against `elapsedHours >= 80` |
