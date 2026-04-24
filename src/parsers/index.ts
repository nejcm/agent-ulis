import { join } from "node:path";

import type { McpConfig, PermissionsConfig, PluginsConfig, UlisConfig } from "../schema.js";
import { UlisConfigSchema } from "../schema.js";
import { loadConfigFile } from "../utils/config-loader.js";
import { AgentFrontmatterSchema } from "../schema.js";
import { RuleFrontmatterSchema } from "../schema.js";
import { readMarkdownDir, ParseError, ParseAggregateError } from "./_shared.js";
import { collectSkills } from "./skill.js";
import { loadMcp } from "./mcp.js";
import { loadPermissions } from "./permissions.js";
import { loadPlugins } from "./plugins.js";
import type { ParsedAgent } from "./agent.js";
import type { ParsedSkill } from "./skill.js";
import type { ParsedRule } from "./rule.js";

// Re-export individual parsers and types for callers that need them directly
export type { ParsedAgent, AgentPlatform } from "./agent.js";
export { parseAgents, enabledAgentsFor } from "./agent.js";
export type { ParsedSkill, SkillPlatform } from "./skill.js";
export { parseSkills, enabledSkillsFor } from "./skill.js";
export type { ParsedRule, RulePlatform } from "./rule.js";
export { parseRules, enabledRulesFor } from "./rule.js";
export type { ParsedCommand } from "./command.js";
export { parseCommands } from "./command.js";
export { ParseError, ParseAggregateError } from "./_shared.js";

export interface ParsedProject {
  readonly agents: readonly ParsedAgent[];
  readonly skills: readonly ParsedSkill[];
  readonly rules: readonly ParsedRule[];
  readonly mcp: McpConfig;
  readonly permissions: PermissionsConfig | undefined;
  readonly plugins: PluginsConfig | undefined;
  readonly ulisConfig: UlisConfig;
  readonly sourceDir: string;
}

/**
 * Parse all entity kinds from a ulis source directory in one call.
 * Collects every per-file error across agents, skills, and rules before
 * throwing, so users see all broken files at once instead of one at a time.
 */
export function parseProject(sourceDir: string): ParsedProject {
  const allErrors: ParseError[] = [];

  const agentsResult = readMarkdownDir(
    join(sourceDir, "agents"),
    AgentFrontmatterSchema,
    "agent",
    (name, frontmatter, body) => ({ name, frontmatter, body }),
  );
  allErrors.push(...agentsResult.errors);

  const skillsResult = collectSkills(join(sourceDir, "skills"));
  allErrors.push(...skillsResult.errors);

  const rulesResult = readMarkdownDir(
    join(sourceDir, "rules"),
    RuleFrontmatterSchema,
    "rule",
    (name, frontmatter, body, relFile) => ({ name, filename: relFile, frontmatter, body }),
    { recursive: true },
  );
  allErrors.push(...rulesResult.errors);

  if (allErrors.length > 0) throw new ParseAggregateError(allErrors);

  const rawConfig = loadConfigFile(sourceDir, "config");
  const ulisConfig = UlisConfigSchema.parse(rawConfig ?? UlisConfigSchema.parse({ version: 1, name: "ulis" }));

  return {
    agents: agentsResult.items,
    skills: skillsResult.items,
    rules: rulesResult.items,
    mcp: loadMcp(sourceDir),
    permissions: loadPermissions(sourceDir),
    plugins: loadPlugins(sourceDir),
    ulisConfig,
    sourceDir,
  };
}
