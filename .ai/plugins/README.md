# Plugins

OpenCode TypeScript plugins that hook into the tool lifecycle. Plugins run inside the OpenCode runtime and have access to tool execution events.

## File Format

Each plugin is a `.ts` file that exports a default plugin object:

```typescript
export default {
  name: "plugin-name",
  version: "1.0.0",
  hooks: {
    "tool.execute.after": async ({ tool, result }) => {
      // runs after every tool call
    },
  },
};
```

## Available Plugins

| Plugin               | Trigger            | Description                                                                                     |
| -------------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `format-on-write.ts` | After write/edit   | Runs `bun run format` on modified files. Silent on failure — never blocks the agent.            |
| `git-worktree.ts`    | Manual / lifecycle | Manages git worktree lifecycle (create, track, clean up). Used alongside the worktree commands. |

## Registration

Plugins are referenced in `.ai/plugins.json` and included in the generated OpenCode config:

```json
{
  "opencode": {
    "plugins": ["./plugins/git-worktree.ts", "./plugins/format-on-write.ts"]
  }
}
```

The build system copies plugins to `generated/opencode/plugins/` at the repo root and adds them to `opencode.json`.

## Adding a New Plugin

1. Create `.ai/plugins/<name>.ts`
2. Export a default plugin object with `name`, `version`, and `hooks`
3. Add the path to `.ai/plugins.json` under `opencode.plugins`
4. Run `bun run build` from the repo root
