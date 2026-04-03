export const BUILD_CONFIG = {
  opencode: {
    defaultModel: "sonnet",
    smallModel: "opencode/kimi-k2.5-free",
    schema: "https://opencode.ai/config.json",
    /** Map canonical model names to OpenCode model identifiers */
    modelMap: {
      opus: "anthropic/claude-opus-4-6",
      sonnet: "sonnet",
      haiku: "haiku",
    } as Record<string, string>,
    /** Map canonical agent names to OpenCode agent names (when they differ) */
    agentNameMap: {
      debugger: "debug",
      devops: "devops-engineer",
      architect: "code-architect",
    } as Record<string, string>,
  },
  codex: {
    model: "gpt-5.4",
    modelReasoningEffort: "high",
    sandbox: "elevated",
    trustedProjects: {
      "C:\\Work\\Personal\\spendwise": "trusted",
    } as Record<string, string>,
  },
  envVarSyntax: {
    opencode_env: (name: string) => `\${${name}}`,
    opencode_header: (name: string) => `{env:${name}}`,
    codex: (name: string) => `\${${name}}`,
    cursor: (name: string) => `\${${name}}`,
  },
} as const;
