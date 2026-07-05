# Tasks: Game 2 — Persistence

**Task List ID**: TASKS-002
**Plan**: PLAN-002
**Spec**: SPEC-002
**Date**: 2026-07-05
**Status**: Draft

---

## Slice A — Intro Screen

### T001 — Wire #game-2 route to Game2 component (TDD)
**Tests first:**
- `App.test.jsx`: navigating to `#game-2` renders `<Game2>` (not the placeholder)

**Implement:**
- Create `src/games/game2/Game2.jsx` stub (renders `<p>Game 2</p>`)
- Update `App.jsx` to import and render `<Game2>` for `game-2` route

**CSS:** no new styles needed (platform styles apply)

---

### T002 — Intro screen renders game-2.md content and Start button (TDD)
**Tests first:**
- `IntroScreen.test.jsx`: renders markdown body from fetched content
- `IntroScreen.test.jsx`: renders a Start button
- `IntroScreen.test.jsx`: clicking Start calls an `onStart` callback

**Implement:**
- `src/games/game2/components/IntroScreen.jsx` — fetches game-2.md via `fetchGameContent`, renders body text and Start button
- `src/games/game2/components/IntroScreen.module.css` — full-width, pink accent, title centred, body in Gelasio, Start button styled as primary action

**CSS:** Start button: bright pink border, tinted background, Righteous font, rounded corners, hover/focus states

---

## Slice B — Countdown + Board Skeleton

### T003 — Countdown overlay counts 5→1→GO then transitions to active phase (TDD)
**Tests first:**
- `CountdownOverlay.test.jsx`: renders GET READY text
- `CountdownOverlay.test.jsx`: displays current countdown value (prop-driven)
- `CountdownOverlay.test.jsx`: calls `onComplete` when countdown reaches 0

**Implement:**
- `src/games/game2/components/CountdownOverlay.jsx` — receives `value` prop (5→0); calls `onComplete` at 0; displays GET READY + large number
- `CountdownOverlay.module.css` — full-screen overlay (dark semi-transparent), Righteous font, large centred countdown, CSS fade-in/out animation
- `Game2.jsx`: `useEffect` drives countdown from 5→0 at 1s intervals; transitions `phase` from `countdown` → `active`

**CSS:** Overlay covers full viewport; countdown number animates scale pulse each digit

---

### T004 — Sprint board layout: timeline + empty story swim lanes (TDD)
**Tests first:**
- `SprintBoard.test.jsx`: renders four column headers (To Do, In Progress, Blocked, Done)
- `Timeline.test.jsx`: renders 10 day segments
- `Timeline.test.jsx`: marker position prop controls visual offset
- `StoryLane.test.jsx`: renders story title, priority badge, story points, and business value

**Implement:**
- `src/games/game2/components/SprintBoard.jsx` — four columns, accepts `stories` and `elapsedHours` props
- `src/games/game2/components/Timeline.jsx` — 10 segments (labelled M T W T F × 2 weeks); marker moves based on `elapsedHours / 80`
- `src/games/game2/components/StoryLane.jsx` — horizontal swim lane spanning all columns; renders story metadata in header; task slots per column
- Matching CSS modules — dark background, pink accent borders, timeline marker animated via CSS transform

**CSS:** Board uses CSS grid (4 columns); swim lanes are rows across the grid; timeline is a flex bar with 10 equal segments

---

### T005 — Game tick: timer advances elapsedHours each second (TDD)
**Tests first:**
- `Game2.test.jsx`: after phase is `active`, `elapsedHours` increments by 1 each second (use fake timers)
- `Game2.test.jsx`: timer stops when `elapsedHours` reaches 80
- `Game2.test.jsx`: timer stops when `phase` changes away from `active`

**Implement:**
- `Game2.jsx`: `useEffect` with `setInterval(1000)` when `phase === 'active'`; uses `Date.now()` delta to increment `elapsedHours`; clears interval on cleanup
- Timeline marker receives `elapsedHours` and animates position

---

## Slice C — Task Interaction & WIP Mechanic

### T006 — Story + task generation: pure function (TDD)
**Tests first:**
- `generate.test.js`: `generateSprint()` returns 3 stories
- `generate.test.js`: story points sum to 13 and each is a Fibonacci number
- `generate.test.js`: total task hours sum to 80 ±1 (rounding tolerance)
- `generate.test.js`: every task has `estimatedHours >= 6`
- `generate.test.js`: each story has exactly one `isWriteTests: true` task
- `generate.test.js`: business values are in $1000–$3500 range, highest assigned to P1
- `generate.test.js`: disruption events have `firesAt` within correct windows

**Implement:**
- `src/games/game2/logic/generate.js`: `generateSprint()` returns `{ stories, disruptionEvents }`
- Stories have: id, priority, title (from pool), storyPoints, businessValue, tasks[]
- Tasks have: id, storyId, name (from pool), estimatedHours, progressHours (0), status ('todo'), isWriteTests, isBug (false), changed (false)

---

### T007 — WIP speed multiplier: pure function (TDD)
**Tests first:**
- `wip.test.js`: `countActiveTasks(stories)` returns number of in-progress tasks
- `wip.test.js`: `hoursPerTick(n)` returns 1/0.9 for n=1 (focus boost)
- `wip.test.js`: `hoursPerTick(n)` returns 1/1.10 for n=2
- `wip.test.js`: `hoursPerTick(n)` returns 1/1.15 for n=3
- `wip.test.js`: `hoursPerTick(0)` returns 0
- `wip.test.js`: `advanceTick(stories)` applies correct progress to all in-progress tasks

**Implement:**
- `src/games/game2/logic/wip.js`: `countActiveTasks`, `hoursPerTick`, `advanceTick(stories)` → returns updated stories with new `progressHours` values; marks task as done when `progressHours >= estimatedHours`

---

### T008 — Task cards: Start / Pause / Resume buttons drive column placement (TDD)
**Tests first:**
- `TaskCard.test.jsx`: renders task name, estimated hours, progress bar
- `TaskCard.test.jsx`: shows Start button when status is `todo`
- `TaskCard.test.jsx`: shows Pause button when status is `inProgress`
- `TaskCard.test.jsx`: shows Resume button when status is `blocked`
- `TaskCard.test.jsx`: clicking Start/Pause/Resume calls `onAction(taskId, action)` callback
- `StoryLane.test.jsx`: task card appears in the correct column slot based on status

**Implement:**
- `TaskCard.jsx` — renders progress bar (green fill = `progressHours / estimatedHours * 100%`), action button
- `TaskCard.module.css` — card with pink accent by default; green border/tint when done; red tint for bug tasks; CHANGED badge style; animated progress bar fill
- `Game2.jsx`: reducer handles `START_TASK`, `PAUSE_TASK`, `RESUME_TASK` actions → updates task status

**CSS:** Progress bar: full-width, green fill, smooth CSS transition on width change; task card transitions between column slots animate via CSS

---

### T009 — WIP mechanic wired to game tick (TDD)
**Tests first:**
- `Game2.test.jsx`: with 1 task in progress, task progress increases by ~1.11h per tick (fake timers)
- `Game2.test.jsx`: with 2 tasks in progress, each increases by ~0.91h per tick
- `Game2.test.jsx`: task auto-moves to Done when progressHours >= estimatedHours

**Implement:**
- Wire `advanceTick` from `wip.js` into the game tick `useEffect` in `Game2.jsx`
- Task completion check: if `progressHours >= estimatedHours` → set status `done`, record `completedAt`
- Story completion check: if all tasks done → set story `completedAt`

**CSS:** Task card turns green (border + tint) on done; story lane header turns green when all tasks done; brief CSS pulse animation on completion

---

## Slice D — Disruption & TDD Events

### T010 — Disruption events: pure function (TDD)
**Tests first:**
- `disruption.test.js`: `checkDisruptions(stories, disruptionEvents, elapsedHours)` returns unchanged stories if no events should fire yet
- `disruption.test.js`: fires event when `elapsedHours >= event.firesAt` and `event.triggered === false`
- `disruption.test.js`: targeted task in `todo` status → event fires but task unchanged (already at To Do)
- `disruption.test.js`: targeted task in `inProgress` → moved to `todo`, `progressHours` reset to 0, `changed: true`
- `disruption.test.js`: targeted task in `done` → moved to `todo`, `progressHours` reset, `changed: true`
- `disruption.test.js`: event sets `triggered: true` (fires only once)

**Implement:**
- `src/games/game2/logic/disruption.js`: `checkDisruptions(stories, disruptionEvents, elapsedHours)` → returns `{ stories, disruptionEvents }`
- Wire into game tick in `Game2.jsx`

**CSS:** `CHANGED` badge on task card — bright yellow label, small Righteous text; task card reverts from green to accent colour if reset from done

---

### T011 — TDD / Write Tests mechanic: pure function (TDD)
**Tests first:**
- `tdd.test.js`: `checkTddCondition(story)` returns `false` if Write Tests not yet done
- `tdd.test.js`: returns `false` if Write Tests was done before any other task completed
- `tdd.test.js`: returns `true` if any other task completed before Write Tests
- `tdd.test.js`: `createBugTask(storyId, remainingHours)` returns a valid task with `isBug: true`, hours 6–12, status `todo`
- `tdd.test.js`: bug is not spawned if `remainingHours < 6` (not enough time left)

**Implement:**
- `src/games/game2/logic/tdd.js`: `checkTddCondition`, `createBugTask`
- `Game2.jsx`: on each tick, for each story without a bug, check TDD condition; if triggered, add bug task at a random remaining time (scheduled with `bugsToSpawn` list in state)

**CSS:** Bug task card: red tint + red border, `🐛 Bug Fix` label, otherwise same structure as regular task card

---

## Slice E — Results Screen

### T012 — Results calculations: pure function (TDD)
**Tests first:**
- `results.test.js`: `calculateResults(stories, elapsedHours)` returns correct `valueDelivered`
- `results.test.js`: only fully-completed stories contribute to `valueDelivered`
- `results.test.js`: `throughput` = valueDelivered / 10 (days)
- `results.test.js`: `cycleTime` = average `completedAt` across completed stories
- `results.test.js`: `selectTip(results)` returns the WIP tip when many tasks were run concurrently
- `results.test.js`: `selectTip(results)` returns the TDD tip when bugs were spawned
- `results.test.js`: `selectTip(results)` returns the change tip when disruptions impacted tasks
- `results.test.js`: `selectTip(results)` returns the success tip when all stories completed

**Implement:**
- `src/games/game2/logic/results.js`: `calculateResults(stories, elapsedHours)`, `selectTip(results)`
- Wire: when `elapsedHours >= 80`, compute results, transition `phase` to `results`

---

### T013 — Results screen component (TDD)
**Tests first:**
- `ResultsScreen.test.jsx`: renders value delivered and potential value
- `ResultsScreen.test.jsx`: renders throughput and cycle time
- `ResultsScreen.test.jsx`: renders the learning tip text
- `ResultsScreen.test.jsx`: Play Again button calls `onPlayAgain` callback
- `ResultsScreen.test.jsx`: Back to Home link navigates to `#`

**Implement:**
- `src/games/game2/components/ResultsScreen.jsx` — metrics grid + tip + action buttons
- `ResultsScreen.module.css` — pink accent panel, metrics in Gelasio, tip highlighted in yellow accent box, buttons styled to platform standard

**CSS:** Results screen fades in; metric values in large Righteous numerals; tip box in yellow tint with yellow border; Play Again button in pink; Back to Home as text link

---

### T014 — Play Again resets to new randomised game (TDD)
**Tests first:**
- `Game2.test.jsx`: clicking Play Again resets `phase` to `intro` and generates new `config`
- `Game2.test.jsx`: new config has different random values from previous (statistical, run twice)

**Implement:**
- `Game2.jsx`: `PLAY_AGAIN` action in reducer — calls `generateSprint()` and resets all state to `intro` phase

---

### T015 — Update agent-log, commit, and push
- Update `agent-log.md` with PLAN-002 and TASKS-002 session entry
- Commit referencing PLAN-002 / TASKS-002
- Push to trigger CI
