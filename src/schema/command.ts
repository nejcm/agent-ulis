import { z } from "zod";

import { ALL_MODELS, OPENCODE_MODELS } from "../models.js";

export const CommandFrontmatterSchema = z
  .object({
    description: z.string(),
    model: z.enum(ALL_MODELS).optional(),
    // Which agent executes this command (opencode)
    agent: z.string().optional(),
    // Force subagent invocation (opencode)
    subtask: z.boolean().optional(),
    platforms: z
      .object({
        opencode: z
          .object({
            enabled: z.boolean().default(true),
            model: z.enum(OPENCODE_MODELS).optional(),
            agent: z.string().optional(),
            subtask: z.boolean().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .passthrough();

export type CommandFrontmatter = z.infer<typeof CommandFrontmatterSchema>;
