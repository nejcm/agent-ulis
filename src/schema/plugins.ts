import { z } from "zod";

export const ClaudePluginSchema = z.object({
  name: z.string(),
  source: z.string(),
  repo: z.string().optional(),
});

const perPlatformPluginsSchema = z.object({
  plugins: z.array(ClaudePluginSchema).default([]),
});

export const PluginsConfigSchema = z.object({
  "*": perPlatformPluginsSchema.optional(),
  claude: perPlatformPluginsSchema.optional(),
  opencode: perPlatformPluginsSchema.optional(),
  codex: perPlatformPluginsSchema.optional(),
  cursor: perPlatformPluginsSchema.optional(),
});

export type PluginsConfig = z.infer<typeof PluginsConfigSchema>;
