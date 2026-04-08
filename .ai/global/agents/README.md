# Agents

Canonical agent definitions shared across all AI tools. Each file is a Markdown document with YAML frontmatter that controls how the agent is configured per tool.

## File Format

```markdown
---
description: "One-line purpose"
model: opus | sonnet | haiku
temperature: 0.0–1.0
tools:
  read: true
  write: false
  edit: false
  bash: false
  search: true
tags: [core, read-only]

opencode:
  mode: subagent
  rate_limit_per_hour: 20
claude:
  mapping: rule | skill | skip
codex:
  mapping: instruction | skip
cursor:
  mapping: skip
---

[Full agent prompt — shared across all tools]
```

### Fields

| Field            | Values                    | Description                                                   |
| ---------------- | ------------------------- | ------------------------------------------------------------- |
| `model`          | `opus`, `sonnet`, `haiku` | Model tier (mapped to current model IDs at build time)        |
| `temperature`    | `0.0–1.0`                 | Lower = more deterministic. Use `0.0` for migrations/security |
| `tools.*`        | `true/false`              | Which tools this agent may use                                |
| `claude.mapping` | `rule`, `skill`, `skip`   | How the agent appears in Claude Code                          |
| `codex.mapping`  | `instruction`, `skip`     | How the agent appears in Codex                                |

## Agents

| Agent           | Model  | Read-only | Purpose                                                 |
| --------------- | ------ | --------- | ------------------------------------------------------- |
| `planner`       | haiku  | yes       | Task decomposition, spec artifacts, acceptance criteria |
| `builder`       | sonnet | no        | Feature implementation against specs                    |
| `tester`        | haiku  | no        | TDD, test writing, test execution                       |
| `reviewer`      | sonnet | yes       | Code review, quality assessment                         |
| `architect`     | sonnet | yes       | System design, ADRs, API contracts                      |
| `security`      | sonnet | yes       | Security audits, vulnerability analysis                 |
| `debugger`      | sonnet | no        | Root cause analysis, bug fixes                          |
| `refactor`      | sonnet | no        | Code cleanup, simplification                            |
| `performance`   | sonnet | yes       | Profiling, optimization recommendations                 |
| `documentation` | haiku  | yes       | API docs, technical writing                             |
| `release`       | haiku  | no        | Versioning, changelogs, release notes                   |
| `devops`        | sonnet | no        | CI/CD, Docker, infrastructure                           |
| `migration`     | sonnet | no        | Database schema changes, data migrations                |

## How It's Used

The build system reads these files and generates:

- **OpenCode** → agent blocks in `opencode.json` + copied to `generated/opencode/agents/`
- **Claude Code** → orchestration table in `generated/claude/rules/common/agents.md`
- **Codex** → embedded as instruction sections in `generated/codex/config.toml`
- **Cursor** → skipped (no native agent support)

## Adding a New Agent

1. Create `.ai/global/agents/<name>.md` with frontmatter and prompt content
2. Set `claude.mapping`, `codex.mapping` as appropriate
3. Run `bun run build` from the repo root to regenerate all tool configs
4. Run `bun run install:configs` to deploy
