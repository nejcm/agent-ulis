import { z } from "zod";

export const ClaudePluginSchema = z.object({
  name: z.string(),
  source: z.string(),
  repo: z.string().optional(),
});

export const GlobalSkillSchema = z.object({
  name: z.string(),
  args: z.array(z.string()).optional(),
});

const sharedPluginsSchema = z.object({
  plugins: z.array(ClaudePluginSchema).default([]),
  skills: z.array(GlobalSkillSchema).default([]),
});

export const PluginsConfigSchema = z.object({
  "*": sharedPluginsSchema.optional(),
  claude: sharedPluginsSchema.optional(),
  opencode: sharedPluginsSchema.optional(),
  codex: sharedPluginsSchema.optional(),
  cursor: sharedPluginsSchema.optional(),
});

export type PluginsConfig = z.infer<typeof PluginsConfigSchema>;
export type GlobalSkill = z.infer<typeof GlobalSkillSchema>;
