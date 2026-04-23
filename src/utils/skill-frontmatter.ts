import matter from "gray-matter";

export const ULIS_SKILL_FRONTMATTER_KEYS = new Set([
  "key",
  "argumentHint",
  "userInvocable",
  "allowModelInvocation",
  "allowImplicitInvocation",
  "effort",
  "isolation",
  "tools",
  "hooks",
  "paths",
  "platforms",
]);

/**
 * Preserve non-ULIS frontmatter and strip ULIS-only control keys.
 */
export function toPlatformSkillMarkdown(rawSkillMd: string): string {
  const parsed = matter(rawSkillMd);
  const filteredFrontmatter = Object.fromEntries(
    Object.entries(parsed.data).filter(([key]) => !ULIS_SKILL_FRONTMATTER_KEYS.has(key)),
  );
  const body = parsed.content.trim();
  if (Object.keys(filteredFrontmatter).length === 0) {
    return body;
  }
  return matter.stringify(body, filteredFrontmatter).trim();
}
