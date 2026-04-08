export const PLATFORMS = ["opencode", "claude", "codex", "cursor"] as const;

export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  opencode: "OpenCode",
  claude: "Claude Code",
  codex: "Codex",
  cursor: "Cursor",
};

export const PLATFORM_DESCRIPTIONS: Record<Platform, string> = {
  opencode: "Generate the OpenCode workspace config and optional runtime files.",
  claude: "Generate Claude Code agents, commands, rules, and settings.",
  codex: "Generate Codex config, agents, and skill metadata.",
  cursor: "Generate Cursor agents, MCP config, and skill directories.",
};

export function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value);
}

export function uniquePlatforms(values: readonly Platform[]): Platform[] {
  const selected = new Set(values);
  return PLATFORMS.filter((platform) => selected.has(platform));
}

export function parsePlatformList(rawValues: readonly string[]): Platform[] {
  const parsedValues = rawValues.flatMap((value) =>
    value
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean),
  );

  const invalid = parsedValues.filter((value) => !isPlatform(value));
  if (invalid.length > 0) {
    throw new Error(`Unknown platform(s): ${invalid.join(", ")}`);
  }

  return uniquePlatforms(parsedValues as Platform[]);
}
