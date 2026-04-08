# Agent instructions

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
