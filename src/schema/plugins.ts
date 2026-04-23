import { z } from "zod";

export const PLuginSchema = z.object({
  name: z.string(),
  source: z.string(),
  repo: z.string().optional(),
});

const perPlatformPluginsSchema = z.object({
  plugins: z.array(PLuginSchema).default([]).optional(),
});

export const PluginsConfigSchema = z.object({
  "*": perPlatformPluginsSchema.optional(),
  claude: perPlatformPluginsSchema.optional(),
  opencode: perPlatformPluginsSchema.optional(),
  codex: perPlatformPluginsSchema.optional(),
  cursor: perPlatformPluginsSchema.optional(),
}).optional();

export type PluginsConfig = z.infer<typeof PluginsConfigSchema>;
