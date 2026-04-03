import { readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { SkillFrontmatterSchema, type SkillFrontmatter } from "../schema.js";
import { readFile, fileExists } from "../utils/fs.js";

export interface ParsedSkill {
  name: string; // directory name
  dir: string; // absolute path to skill directory
  frontmatter: SkillFrontmatter;
  body: string; // SKILL.md content after frontmatter
}

export function parseSkills(skillsDir: string): readonly ParsedSkill[] {
  if (!fileExists(skillsDir)) return [];
  const entries = readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  const skills: ParsedSkill[] = [];
  for (const entry of entries) {
    const skillDir = join(skillsDir, entry.name);
    const skillFile = join(skillDir, "SKILL.md");
    if (!fileExists(skillFile)) continue;
    const raw = readFile(skillFile);
    const { data, content } = matter(raw);
    const frontmatter = SkillFrontmatterSchema.parse(data);
    skills.push({
      name: entry.name,
      dir: skillDir,
      frontmatter,
      body: content.trim(),
    });
  }
  return skills;
}
