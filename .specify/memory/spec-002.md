# Feature Specification: Game 2 — Persistence

**Spec ID**: SPEC-002
**Parent Spec**: SPEC-001
**Created**: 2026-07-05
**Status**: Draft

---

## Overview

Game 2: Persistence teaches the value of Work in Process (WIP) limits and priority-ordered delivery through a simulated two-week sprint. The player manages a Kanban board of randomised User Stories and Tasks, experiencing first-hand how context switching slows delivery and how completing high-priority work first minimises the impact of changing requirements.

The game reinforces three linked agile principles:
1. **Stop Starting, Start Finishing** — WIP limits speed up overall throughput.
2. **Prioritise ruthlessly** — requirement changes hurt less when high-priority work ships first.
3. **Test early** — TDD eliminates late-discovered bugs; testing after coding adds rework.

---

## Screens & Flow

### Screen 1 — Intro
- Title (`Game 2: Persistence`) centred at top with **Start** button top-right (matching platform nav bar pattern).
- Body of `public/content/game-2.md` rendered as the game description/rules.
- Player reads the rules then presses **Start**.

### Screen 2 — Get Ready Countdown
- The Sprint Board renders immediately behind the countdown so the player can study the stories and plan their approach before play begins.
- A semi-transparent dark overlay sits above the board with `GET READY` above a large animated countdown: **5 → 4 → 3 → 2 → 1 → GO!**
- Countdown uses 1 real second per digit.
- On **GO!** the overlay fades out, the board becomes interactive, and the simulation timer starts.

### Screen 3 — Sprint Board (active game)

#### Layout (top to bottom)
1. **Title bar** — game title left, sprint day indicator right (e.g. `Day 3 / 10`).
2. **Timeline** — a horizontal 10-segment bar (Mon–Fri, Week 1 then Week 2) with an animated marker that advances in real time (1 real second = 1 simulated hour = 1/8 of a day segment). Each day segment is visually separated.
3. **Kanban Board** — columns: **To Do | In Progress | Blocked | Done**.
   - User Stories render as horizontal swim-lane rows spanning all columns.
   - Each story card header (spanning full width) shows: priority badge, title, story points, business value ($).
   - Task cards sit in the column matching their current state, grouped within their parent story's swim lane.

#### Task Card
- Displays: task name, estimated hours.
- Progress bar: green fill showing how much of the estimated hours has been consumed.
- Button: **Start** (To Do), **Pause** (In Progress), **Resume** (Blocked).
- Task auto-completes (moves to Done) when progress reaches 100%.
- On completion: task card border and tint change to **green**.
- `CHANGED` badge appears on a task when a disruption event resets it.

#### User Story Card Header
- Priority badge (P1 / P2 / P3), title, story points (Fibonacci), business value ($).
- When all tasks for a story reach Done: story header border and tint change to **green**.
- Business value is only counted in results if the story is fully green (all tasks Done) when the sprint timer expires.

---

## Game Data (Randomised Each Game)

### User Stories
- Always **3 User Stories** per game.
- Priority assigned: P1, P2, P3.
- Story points use the Fibonacci sequence (1, 2, 3, 5, 8) and must sum to **13**. Valid combinations: `{8, 3, 2}` or `{5, 5, 3}` (order assigned randomly to stories).
- Business value: three values randomly generated in **$1,000–$3,500** range (multiples of $100). The highest value is assigned to P1, middle to P2, lowest to P3.

### Tasks
- Each story has **2 or 3 Tasks** (randomised), including exactly **one "Write Tests" task**.
- Total task hours across all stories = **80 hours** (= 10 working days × 8 hours).
- Minimum task duration: **6 hours**.
- Task hours are randomly generated respecting the minimum and the total constraint.

### Task Names
- "Write Tests" is always one task per story.
- Other tasks are drawn from a pool of plausible agile software task names (e.g. "Design API", "Build UI", "Review & Merge", "Deploy to Staging") — randomised per game.

---

## Simulation Mechanics

### Timer
- Sprint duration: **80 simulated hours** = **80 real seconds**.
- Timer runs continuously from GO! regardless of whether tasks are active.
- 1 real second = 1 simulated hour.
- Timeline marker advances proportionally (1 segment = 8 real seconds = 8 simulated hours = 1 working day).

### WIP Speed Multiplier
Progress rate per tick (1 tick = 1 real second = 1 simulated hour):

| Tasks In Progress (N) | Effect | Progress earned per tick per task |
|---|---|---|
| 0 | No active work | 0h |
| 1 | Focus bonus | `hours / (estimatedHours × 0.9)` — completes in 90% of estimate |
| 2 | Context switch penalty | Each task burns at `1 / (estimatedHours × 1.10)` — takes 10% longer |
| 3+ | Compounding penalty | Each task burns at `1 / (estimatedHours × (1 + 0.05 × N))` — takes N×5% longer |

In summary: N=1 → ×0.9 effective duration; N>1 → ×(1 + 0.05×N) effective duration per task.

### Disruption Events (Requirement Changes)
Two disruption events fire during the sprint, each targeting one task in Stories 2 and 3.

**Story 2 disruption:**
- Fires at a random moment within the simulated time window `[0, sum of Story 1 task hours]` — the window when an ideal player would be completing Story 1's tasks.
- Targeted task: one randomly chosen non-"Write Tests" task in Story 2.
- If the task is in **To Do** at the time of the event → no effect (player has not started it; the change is absorbed).
- If the task is in **In Progress**, **Blocked**, or **Done** → it is moved back to **To Do**, its progress resets to 0, and a `CHANGED` badge is shown on the card. If the story was green (all done), it reverts to its accent colour.

**Story 3 disruption:**
- Fires at a random moment within `[0, sum of Story 1 task hours + sum of Story 2 task hours]`.
- Same mechanic as above but targeting one randomly chosen non-"Write Tests" task in Story 3.

### TDD / Write Tests Mechanic
Within each User Story:
- A **Bug** task is spawned if any non-bug task in the story completes **before** Write Tests has been completed for that story.
  - This covers: completing other tasks while Write Tests is still in progress or todo, OR completing Write Tests after other tasks are already done.
  - Maximum **one bug per story** — once triggered for a story, no further bugs are spawned for it.
  - Bug task appears in **To Do** for that story at a random remaining time before the sprint ends.
  - Bug task duration: randomly between **6–12 hours**.
  - Bug task is labelled `🐛 Bug Fix` and is visually distinct (red tint on card).
- If **Write Tests** is the first task to complete in a story → no bug is spawned for that story.

---

## Results Screen

Shown when the sprint timer reaches 0 (or all stories complete early).

### Metrics
| Metric | Calculation |
|---|---|
| **Value Delivered ($)** | Sum of business value for fully completed stories |
| **Potential Value ($)** | Sum of business value for all 3 stories |
| **Stories Completed** | Count of stories with all tasks Done at time-up |
| **Stories Incomplete** | Count of stories with at least one task not Done |
| **Throughput** | Value Delivered ÷ 10 days (average $ per day, completed stories only) |
| **Cycle Time** | Average elapsed sprint time to complete each fully-done story |

### Learning Tip
A context-sensitive tip is shown based on the player's outcome:
- All stories complete: "Great focus! Delivering everything in priority order maximises value."
- Partial completion, WIP > 1 often: "Context switching slowed you down. Try completing one story at a time."
- Bug(s) spawned: "Late testing created rework. Write your tests first next time."
- Change event impacted work: "Completing high-priority work first shields you from requirement changes."

### Actions
- **Play Again** — resets the game with a new set of randomised stories.
- **Back to Home** — navigates to the home screen (`#`).

---

## Functional Requirements

- **FR-G2-001**: The intro screen MUST display the body content from `public/content/game-2.md` and a Start button.
- **FR-G2-002**: Pressing Start MUST render the Sprint Board immediately, then display a semi-transparent countdown overlay (GET READY → 5 → 4 → 3 → 2 → 1 → GO!) so the player can study the board before play begins. The board becomes interactive only after GO!.
- **FR-G2-003**: The Kanban board MUST have four columns: To Do, In Progress, Blocked, Done.
- **FR-G2-004**: User Stories MUST render as swim lanes spanning all columns; Task cards MUST be positioned in the column matching their current state.
- **FR-G2-005**: Each game MUST generate 3 randomised User Stories with story points summing to 13 (Fibonacci), total task hours summing to 80, and minimum task duration of 6 hours.
- **FR-G2-006**: Business value MUST be randomised per story ($1,000–$3,500 in $100 increments), with the highest value assigned to P1, middle to P2, lowest to P3.
- **FR-G2-007**: The simulation timer MUST run at 1 real second = 1 simulated hour; the sprint runs for 80 real seconds continuously once started.
- **FR-G2-008**: The timeline MUST display 10 segments (one per working day) with an animated progress marker driven by the simulation timer.
- **FR-G2-009**: Task progress MUST apply the WIP speed multiplier: N=1 → 0.9× duration; N>1 → (1 + 0.05×N)× duration.
- **FR-G2-010**: Start/Pause/Resume buttons on task cards MUST move tasks between To Do, In Progress, and Blocked.
- **FR-G2-011**: A task MUST auto-complete (move to Done) when its progress reaches 100%. Its card MUST turn green.
- **FR-G2-012**: A User Story MUST turn green when all its tasks reach Done.
- **FR-G2-013**: Two disruption events (one for Story 2, one for Story 3) MUST fire within their respective time windows, resetting affected tasks to To Do with a CHANGED badge if they have been started.
- **FR-G2-014**: If "Write Tests" completes after any other task in the same story, a Bug task MUST be spawned at a random remaining time before sprint end.
- **FR-G2-015**: The results screen MUST display: value delivered, potential value, stories completed/incomplete, throughput, cycle time, and a context-sensitive learning tip.
- **FR-G2-016**: Play Again MUST reset all game state and generate new randomised stories.
- **FR-G2-017**: The game MUST apply the platform design system: dark mode, pink accent (Game 2 colour), white text, rounded corners, green for positive outcomes, red for bug tasks.

## Non-Functional Requirements

- **NF-G2-001**: All game logic (story generation, WIP calculation, timer, disruption events, TDD mechanic) MUST be implemented as pure functions, tested with Jest before implementation.
- **NF-G2-002**: Animations MUST be used for: countdown overlay, timeline marker movement, task card state transitions (column moves), task completion (green flash), results screen entry.
- **NF-G2-003**: The game MUST meet WCAG Level A — all interactive elements keyboard-accessible, colour never the sole indicator of state.
- **NF-G2-004**: Game state MUST NOT persist between sessions; Play Again generates fresh data.
- **NF-G2-005**: All story/task generation randomisation MUST be seeded from `Math.random()` with no external dependency.

## Success Criteria

- **SC-G2-001**: A player can start the game, manage tasks on the board, and reach the results screen without error.
- **SC-G2-002**: The WIP mechanic demonstrably changes task completion speed in the simulation.
- **SC-G2-003**: The disruption event correctly has no impact when the player works in strict priority order.
- **SC-G2-004**: The TDD mechanic correctly spawns a bug only when Write Tests is done last.
- **SC-G2-005**: All game logic is covered by passing Jest tests before implementation begins.
- **SC-G2-006**: Results screen metrics are mathematically correct for all tested scenarios.

## Key Entities

| Entity | Description |
|---|---|
| `Story` | A User Story with id, priority, title, storyPoints, businessValue, tasks[], startedAt, completedAt |
| `Task` | A task with id, storyId, name, estimatedHours, progressHours, status (todo/inProgress/blocked/done), changed (bool), isBug (bool), isWriteTests (bool) |
| `SprintState` | Sprint-level state: stories[], elapsedSeconds, phase (intro/countdown/active/results) |
| `SprintConfig` | Immutable generated config: stories with tasks, disruptionEvents[], bugThresholds[] |
| `DisruptionEvent` | { targetTaskId, firesAt (simulated hour), triggered (bool) } |
| `Results` | { valueDelivered, potentialValue, storiesCompleted, storiesIncomplete, throughput, cycleTime, tip } |
