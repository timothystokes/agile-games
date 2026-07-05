# Agent Log

Chronological log of interactions between @timothystokes and GitHub Copilot CLI (Claude Sonnet 4.6).

---

## 2026-07-05T14:54 AEST

**Prompt:** Start a new solution. Point `.github/copilot-instructions.md` to README.md so high-level context is accessible and all in one place. Keep README.md up to date. Keep a log of interactions in `agent-log.md`. Document that we are using GitHub Copilot CLI with Claude Sonnet 4.6. Integrate `github/spec-kit` by following its Get Started guide. Then interview me about this solution following the spec-kit workflow.

**Actions:**
- Created `.github/copilot-instructions.md` — points the Copilot agent to README.md as the authoritative context source.
- Created `README.md` — documents tooling (GitHub Copilot CLI, Claude Sonnet 4.6, spec-kit v0.12.4) and architecture constraints.
- Created `agent-log.md` (this file).
- Installed `specify-cli` v0.12.4 via `uv tool install`.
- Ran `specify init` with the `copilot` integration to scaffold spec-kit prompt files.
- Began spec-kit workflow: next step is `/speckit.constitution` followed by `/speckit.specify` interview.

---

## 2026-07-05T14:58 AEST

**Prompt:** Remember to commit regularly after updating agent-log.md. Commit messages must reference spec-kit artifact IDs (spec, plan, task IDs).

**Actions:**
- Stored workflow rule as a repository memory.
- Committed initial scaffold (README.md, .github/copilot-instructions.md, agent-log.md, spec-kit init).
- Awaiting user response to begin constitution + specify interview.

---

## 2026-07-05T15:00 AEST — Specify Interview (Part 1)

**Prompt:** Continue with the interview. Ask about non-functionals rather than assuming.

**Q1 — The Problem**
> What is "Agile Games"?

**Answer:** A collection of games under the title "Agile Games". Each game teaches a core agile principle by showing the impact of various delivery approaches. Labs: Game 1: Alignment, Game 2: Persistence, Game 3: Teamwork, Game 4: Improvement, Game 5: Delivery.

**Q2 — Users & Context**
> Who plays these games and who facilitates?

**Answer:** Agile team members — anyone involved in software or digital product delivery. The player is typically an individual. No distinct facilitator role mentioned at this stage.

**Q3 — Game Mechanics**
> How does a game work at a high level?

**Answer:** Format varies per Lab. Once the high-level solution is established, we will dive into one specific Lab in detail.

**Q4 — Platform & Access**
> Where do players access these games?

**Answer:** A single-page static website. Hash-based URIs render each game (e.g. `#game-1`). Deep links are shareable. No backend.

**Q5 — Progress & State**
> Does progress need to persist between sessions?

**Answer:** No — each game is a fresh self-contained session.

**Q6 — Hosting & Deployment**
> Where will this be hosted?

**Answer:** GitHub Pages, deployed via GitHub Actions workflow, served from root path `/`.

**Q7 — Tech Stack**
> Frontend tech stack preference?

**Answer:** Vite + React. Pure functions only — no complex classes. Vanilla JS.

**Q8 — Visual Design**
> Visual style?

**Answer:** Dark mode throughout. Near-black background. White text. Rounded corners everywhere. Accent palette: bright pink, bright yellow, bright blue, bright cyan, bright orange. Status colours: bright green (positive outcome), bright red (negative outcome) — reserved for in-game feedback only. Cards/panels tinted to match border accent; nested cards use brighter tint to appear elevated. Google Fonts: Righteous (titles/headings), Gelasio (body/data). Animations on card movement.

**Q9 — Non-Functionals: Performance**
> Specific performance requirements?

**Answer:** No hard requirements, but smooth animations on card movement are desired.

**Q10 — Non-Functionals: Accessibility + Other NFRs**
> Accessibility requirements and other non-functionals?

**Answer:** WCAG Level A. TDD with Jest is non-negotiable. Spec-kit workflow is mandatory. Linting enforced. CI/CD on main branch.

**Q11 — Browser Support**
> Which browsers?

**Answer:** Modern evergreen browsers only (Chrome, Firefox, Safari, Edge).

**Q12 — Internationalisation**
> Multiple languages?

**Answer:** No — English only.

**Q13 — Analytics**
> Usage tracking or analytics?

**Answer:** None.

**Q14 — Licensing**
> Open source / licence?

**Answer:** None — private.

**Actions:**
- Wrote `.specify/memory/constitution.md` (v1.0.0) covering 6 principles: Test-First, Pure Functions, Spec-Driven, Simplicity, CI/Quality Gates, Accessibility; plus Technology Constraints, Design System, Workflow, and Governance sections.
- Created `.specify/memory/spec.md` (SPEC-001) — high-level platform spec covering all 5 Labs, 4 user stories, FR-001–FR-012, NF-001–NF-010, SC-001–SC-005.
