import type { BuildConfig } from "../config.js";
import { loadRequiredConfigFile } from "./config-loader.js";

/**
 * Load required `build.config.{yaml,yml,json}` from the source tree.
 * All build-time platform constants are user-owned and must live in this file.
 */
export function loadBuildConfig(sourceDir: string): BuildConfig {
  const parsed = loadRequiredConfigFile(sourceDir, "build.config");

  if (!isPlainObject(parsed)) {
    throw new Error(`build.config must be an object`);
  }
  if (!isPlainObject(parsed.platforms)) {
    throw new Error(`build.config.platforms must be an object`);
  }

  return parsed as unknown as BuildConfig;
}

/**
 * Recursive immutable deep merge. Plain objects are merged key-by-key,
 * everything else (arrays, primitives, functions) is replaced wholesale.
 *
 * Crucially, the inputs are never mutated; every container is a fresh copy.
 */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined ? base : (override as T);
  }

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}
