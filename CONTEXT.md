# ULIS Context

## Glossary

- **Source**: The canonical ULIS config tree read by build, validate, install, and the TUI. It can be project-local (`./.ulis/`), global (`~/.ulis/`), or an explicit custom path.
- **Destination**: The base directory where generated platform configs are installed. A project destination writes under the current project; a global destination writes under the user's home directory.
- **Platform**: A supported AI tool target: Claude Code, Codex, Cursor, OpenCode, or ForgeCode.
- **Preset**: A reusable ULIS source tree applied before the base source. Presets are resolved from user-global or bundled preset directories; the base source wins conflicts.
- **Build**: Parse, validate, and generate native platform config files under `<source>/generated/<platform>/`.
- **Validate**: Parse and validate a source plus selected presets without writing generated files.
- **Install**: Deploy generated platform configs to a destination, optionally rebuilding first.
- **Backup**: A TUI and CLI install option that copies existing target config files or directories before replacing or merging them.
