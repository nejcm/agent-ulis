/**
 * Translate canonical ${VAR} syntax to tool-specific format.
 */
export function translateEnvVar(
  value: string,
  target: "opencode_env" | "opencode_header" | "codex" | "cursor" | "claude",
): string {
  return value.replace(/\$\{(\w+)\}/g, (_match, varName) => {
    switch (target) {
      case "opencode_header":
        return `{env:${varName}}`;
      case "opencode_env":
      case "codex":
      case "cursor":
      case "claude":
        return `\${${varName}}`;
      default:
        return `\${${varName}}`;
    }
  });
}
