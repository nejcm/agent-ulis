import { McpConfigSchema, type McpConfig } from "../schema.js";
import { readFile } from "../utils/fs.js";

export function parseMcpConfig(filePath: string): McpConfig {
  const raw = JSON.parse(readFile(filePath));
  return McpConfigSchema.parse(raw);
}
