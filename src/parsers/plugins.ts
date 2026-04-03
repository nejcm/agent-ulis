import { PluginsConfigSchema, type PluginsConfig } from "../schema.js";
import { readFile } from "../utils/fs.js";

export function parsePluginsConfig(filePath: string): PluginsConfig {
  const raw = JSON.parse(readFile(filePath));
  return PluginsConfigSchema.parse(raw);
}
