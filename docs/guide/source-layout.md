---
title: Source Layout
---

# Source Layout

The canonical source tree lives in `.ulis/` (or `~/.ulis/` in global mode).

```text
.ulis/
├── config.yaml
├── mcp.yaml
├── permissions.yaml
├── plugins.yaml
├── skills.yaml
├── agents/
├── skills/
├── commands/
└── raw/
```

## Core files

- `config.yaml`: source version and project name.
- `mcp.yaml`: MCP server definitions and optional target restrictions.
- `permissions.yaml`: per-platform access policies.
- `plugins.yaml`: Claude plugin installs.
- `skills.yaml`: external skill installs per platform.

## Content directories

- `agents/`: Markdown files with frontmatter and prompt body.
- `skills/`: one directory per skill with `SKILL.md` and optional assets.
- `commands/`: slash command content copied into generated output.
- `raw/`: platform-specific fragments copied verbatim.

## Generated output

`ulis build` writes generated native configs into:

```text
<source>/generated/<platform>/
```

`ulis install` then deploys those files to local or home-level tool directories.
