# GitHub Copilot Instructions

All high-level project context — including tooling decisions, architecture constraints, spec-kit workflow, and the interaction log — is maintained in:

👉 **[README.md](../README.md)**

Read README.md at the start of every session to orient yourself before taking action. The spec-kit artifacts in `.spec-kit/` (constitution, spec, plan, tasks) flow from and must stay consistent with that document.

## Spec-Kit Slash Commands (Copilot)

These prompt files are available in `.github/prompts/`:

| Command | Purpose |
|---|---|
| `/speckit.constitution` | Establish project governing principles |
| `/speckit.specify` | Define what to build (requirements + user stories) |
| `/speckit.plan` | Create technical implementation plan |
| `/speckit.tasks` | Generate actionable task list |
| `/speckit.implement` | Execute implementation |
| `/speckit.converge` | Assess codebase vs spec and append remaining tasks |
| `/speckit.clarify` | De-risk ambiguous areas before planning |
| `/speckit.analyze` | Cross-artifact consistency report |
| `/speckit.checklist` | Quality checklists for requirements |
