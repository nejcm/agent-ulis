# Agent instructions

## About this repository

This repo is the single source of truth for AI tool configs (Claude Code, Codex, OpenCode, Cursor). Edit canonical input under [`.ai/global/`](.ai/global/) (agents, skills, MCP, plugins, etc.); do not hand-edit [`generated/`](generated/)—regenerate with the build. Stack: TypeScript on Bun (`package.json` scripts). Specs: [`docs/SPEC.md`](docs/SPEC.md); field reference: [`docs/REFERENCE.md`](docs/REFERENCE.md).

## Where to find configuration documentation

Use these official sources when you need tool-specific configuration behavior and information (file formats, env vars, MCP syntax, etc.):

| Tool            | Documentation                            |
| --------------- | ---------------------------------------- |
| **Claude Code** | https://code.claude.com/docs/en/overview |
| **Codex**       | https://developers.openai.com/codex      |
| **OpenCode**    | https://opencode.ai/docs                 |
| **Cursor**      | https://cursor.com/docs                  |

## This repository

Canonical definitions live under [`.ai/global/`](.ai/global/); the TypeScript build emits per-tool output under [`generated/`](generated/).
See [`README.md`](README.md) for layout, scripts, install targets, and build-system details.

## Before completing a task

Run from the repo root (in order):

1. `bun run format` — format with oxfmt.
2. `bun run lint` — TypeScript check (`tsc --noEmit`).
3. `bun run test` — unit tests.

If you changed generators, schema, or canonical sources that affect output, also run `bun run build` and commit updated `generated/` when appropriate.
