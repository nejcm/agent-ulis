# Commands

OpenCode slash commands — executable workflows that run directly inside OpenCode sessions. Commands are copied as-is to the generated OpenCode config.

## File Format

Each command is a Markdown file with YAML frontmatter:

```markdown
---
description: "What this command does"
---

[Step-by-step instructions for the command]
```

Invoke in OpenCode with `/command-name`.

## Available Commands

| Command                   | Description                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| `commit-all`              | Stage all changes, generate a conventional commit message, and commit |
| `review`                  | Run a full code review on recent changes                              |
| `format-then-lint`        | Format code then run the linter                                       |
| `create-worktrees`        | Set up multiple git worktrees for parallel development                |
| `create-branch-worktree`  | Create a new git worktree for a specific branch                       |
| `cleanup-stale-worktrees` | Remove merged or abandoned worktrees                                  |
| `update-docs`             | Regenerate documentation for changed files                            |

## How It's Used

The build system copies `commands/` directly into `generated/opencode/commands/` at the repo root. No transformation is applied — the files are used as-is by OpenCode.

## Adding a New Command

1. Create `.ai/commands/<name>.md` with a `description` in the frontmatter
2. Write the step-by-step instructions in the body
3. Run `bun run build` from the repo root — the command will be included automatically
4. Invoke it in OpenCode with `/<name>`
