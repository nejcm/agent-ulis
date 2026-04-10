import { join } from "node:path";

import { PermissionsConfigSchema, type PermissionsConfig } from "../schema.js";
import { fileExists, readFile } from "../utils/fs.js";

/**
 * Load and validate `.ai/global/permissions.json`.
 * Returns an empty object if the file does not exist.
 */
export function loadPermissions(aiDir: string): PermissionsConfig {
  const file = join(aiDir, "permissions.json");
  if (!fileExists(file)) return {};
  return PermissionsConfigSchema.parse(JSON.parse(readFile(file)));
}
