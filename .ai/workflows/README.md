# Workflows

Structured checklists and playbooks for recurring development processes. Workflows are copied as-is into the generated OpenCode config and can be invoked during sessions.

## Available Workflows

| Workflow                    | Description                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| `feature_implementation.md` | End-to-end feature development: Plan → Build → Test → Review → Release |
| `database_migration.md`     | Schema changes and data transformations with rollback planning         |
| `hotfix_workflow.md`        | Emergency production fixes with minimal blast radius                   |
| `incident_response.md`      | Incident triage, mitigation, communication, and post-mortem            |
| `pr_checklist.md`           | Pre-merge validation: tests, review, security, docs                    |
| `release_checklist.md`      | Release preparation: versioning, changelog, deployment, smoke tests    |
| `security_review.md`        | Security assessment: OWASP checks, secret scanning, auth review        |

## File Format

Each workflow is a Markdown checklist:

```markdown
# Workflow Name

## Phase 1: Description

- [ ] Step one
- [ ] Step two

## Phase 2: Description

- [ ] Step three
```

## How It's Used

The build system copies `workflows/` directly into `generated/opencode/workflows/` at the repo root. No transformation is applied.

## Adding a New Workflow

1. Create `.ai/workflows/<name>.md`
2. Structure it as phased checklists with `- [ ]` items
3. Run `bun run build` from the repo root — it will be included automatically
