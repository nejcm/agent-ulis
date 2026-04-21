/**
 * Scaffold templates, inlined as string constants so they survive the tsup
 * bundle without asset copying. Source-of-truth for these lives in the
 * adjacent `.template.yaml` / `.template.md` files so the JSON schema refs
 * stay in sync — when editing, update both.
 */

const CONFIG_TEMPLATE = `# yaml-language-server: $schema={{schemaBase}}/config.schema.json

version: 1
name: {{name}}
`;

const BUILD_CONFIG_TEMPLATE = `# Build defaults consumed by ulis generators.
# Keep this file in your source config folder so platform tuning stays user-owned.
#
# YAML or JSON is supported: build.config.yaml / build.config.yml / build.config.json

platforms:
  claude:
    toolNames:
      read: ["Read", "Glob", "Grep"]
      write: ["Write"]
      edit: ["Edit"]
      bash: ["Bash"]
      search: ["WebSearch", "WebFetch"]
      browser: ["mcp__playwright__navigate", "mcp__playwright__screenshot"]

  opencode:
    defaultModel: anthropic/sonnet
    smallModel: opencode/kimi-k2.5-free
    schema: https://opencode.ai/config.json
    agentNameMap:
      debugger: debug
      devops: devops-engineer
      architect: code-architect

  codex:
    model: gpt-5.4
    modelReasoningEffort: high
    sandbox: elevated
    trustedProjects: {}
    mcpStartupTimeoutSec: 20

  cursor:
    toolNames:
      read: ["read_file", "list_directory", "search_files"]
      write: ["write_file"]
      edit: ["edit_file"]
      bash: ["run_terminal_command"]
      search: ["web_search"]
      browser: ["browser_action"]

  forgecode:
    toolNames:
      read: ["read"]
      write: ["write"]
      edit: ["patch"]
      bash: ["shell"]
      search: ["search", "fetch"]
      browser: ["mcp_*"]
`;

const MCP_TEMPLATE = `# yaml-language-server: $schema={{schemaBase}}/mcp.schema.json

# Declare MCP (Model Context Protocol) servers that agents can use.
# Example:
#
# servers:
#   github:
#     type: local
#     command: npx
#     args: ["-y", "@modelcontextprotocol/server-github"]
#     env:
#       GITHUB_PERSONAL_ACCESS_TOKEN: \${GITHUB_PAT}
#
#   context7:
#     type: remote
#     url: https://mcp.context7.com/mcp
#     headers:
#       CONTEXT7_API_KEY: \${CONTEXT7_API_KEY}

servers: {}
`;

const PERMISSIONS_TEMPLATE = `# yaml-language-server: $schema={{schemaBase}}/permissions.schema.json

# Per-platform permission rules (allow/deny/ask patterns, approval modes, etc.)
# Each section is optional — omitted platforms use their own defaults.
#
# Example:
#
# claude:
#   defaultMode: default
#   allow:
#     - "Bash(git status)"
#     - "Bash(git diff*)"
#   deny:
#     - "Bash(rm -rf *)"
#
# opencode:
#   permission:
#     edit: ask
#     bash: ask
#
# codex:
#   approvalMode: on-request
#   sandbox: workspace-write
#
# cursor:
#   mcpAllowlist: []
#   terminalAllowlist: []
`;

const PLUGINS_TEMPLATE = `# yaml-language-server: $schema={{schemaBase}}/plugins.schema.json

# Declarative Claude Code marketplace plugin installs.
# Only "claude" is meaningful here today — other platforms don't have a
# marketplace concept. Skills live in skills.yaml.
#
# Example:
#
# claude:
#   plugins:
#     - name: frontend-design
#       source: official
#     - name: everything-claude-code
#       source: github
#       repo: affaan-m/everything-claude-code
`;

const SKILLS_TEMPLATE = `# yaml-language-server: $schema={{schemaBase}}/skills.schema.json

# Declarative skill installs per platform (via the \`skills\` CLI).
# - "*"      applies to every platform
# - "claude" / "codex" / "cursor" / "opencode" scope to one platform
#
# Example:
#
# "*":
#   skills:
#     - name: mattpocock/skills/grill-me
#     - name: anthropics/skills
#       args: ["--skill", "pdf"]
#
# claude:
#   skills:
#     - name: anthropics/skills
#       args: ["--skill", "mcp-builder"]
`;

const GUARDRAILS_TEMPLATE = `# Guardrails

Operational guidelines for agents working in this project. Edit to match your
team's constraints — cost limits, rate limits, security policies, etc.

## Operational limits

- \`max_tool_calls_per_session\`: ...
- \`max_context_tokens\`: ...

## Security policies

- Blocked operations: ...
- Sensitive paths requiring review: ...
`;

export interface ScaffoldContext {
  readonly name: string;
  readonly schemaBase: string;
}

function substitute(content: string, context: ScaffoldContext): string {
  return content.replace(/\{\{name\}\}/g, context.name).replace(/\{\{schemaBase\}\}/g, context.schemaBase);
}

export function renderConfig(context: ScaffoldContext): string {
  return substitute(CONFIG_TEMPLATE, context);
}

export function renderBuildConfig(context: ScaffoldContext): string {
  return substitute(BUILD_CONFIG_TEMPLATE, context);
}

export function renderMcp(context: ScaffoldContext): string {
  return substitute(MCP_TEMPLATE, context);
}

export function renderPermissions(context: ScaffoldContext): string {
  return substitute(PERMISSIONS_TEMPLATE, context);
}

export function renderPlugins(context: ScaffoldContext): string {
  return substitute(PLUGINS_TEMPLATE, context);
}

export function renderSkills(context: ScaffoldContext): string {
  return substitute(SKILLS_TEMPLATE, context);
}

export function renderGuardrails(context: ScaffoldContext): string {
  return substitute(GUARDRAILS_TEMPLATE, context);
}

/** Default schema base URL when project-level templates reference local schemas. */
export const DEFAULT_SCHEMA_BASE = "./node_modules/@nejcm/ulis/dist/schemas";
