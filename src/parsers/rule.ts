import { existsSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

import matter from "gray-matter";

import { RuleFrontmatterSchema, type RuleFrontmatter } from "../schema.js";
import { readFile } from "../utils/fs.js";

export interface ParsedRule {
  /** Stem of the file relative to the rules dir, normalized to forward slashes. E.g. "code-style" or "backend/api". */
  name: string;
  /** Relative path including extension. E.g. "code-style.md" or "backend/api.md". */
  filename: string;
  frontmatter: RuleFrontmatter;
  body: string;
}

export type RulePlatform = "claude" | "opencode" | "codex" | "cursor" | "forgecode";

/** Filter rules not explicitly disabled for the given platform. */
export function enabledRulesFor(rules: readonly ParsedRule[], platform: RulePlatform): readonly ParsedRule[] {
  return rules.filter((r) => r.frontmatter.platforms?.[platform]?.enabled !== false);
}

export function parseRules(rulesDir: string): readonly ParsedRule[] {
  if (!existsSync(rulesDir)) return [];

  const entries = readdirSync(rulesDir, { recursive: true }) as string[];
  const mdFiles = entries
    .map((f) => f.replace(/\\/g, "/"))
    .filter((f) => f.endsWith(".md") && basename(f).toLowerCase() !== "readme.md");

  return mdFiles.map((relPath) => {
    const raw = readFile(join(rulesDir, relPath));
    const { data, content } = matter(raw);
    const frontmatter = RuleFrontmatterSchema.parse(data);
    return {
      name: relPath.replace(/\.md$/, ""),
      filename: relPath,
      frontmatter,
      body: content.trim(),
    };
  });
}
