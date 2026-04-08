import { mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

export function ensureDir(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}

export function writeFile(filePath: string, content: string): void {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content, "utf-8");
}

export function readFile(filePath: string): string {
  return readFileSync(filePath, "utf-8");
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

export function copyDir(src: string, dest: string): void {
  ensureDir(dest);
  cpSync(src, dest, { recursive: true });
}

export function cleanDir(dirPath: string): void {
  if (existsSync(dirPath)) {
    rmSync(dirPath, { recursive: true, force: true });
  }
  ensureDir(dirPath);
}

/**
 * Copy each skill's source directory into `outSkillsDir/<skill.name>`.
 * Used by generators that emit Agent Skills as plain directory copies
 * (OpenCode, Cursor).
 */
export function copySkillDirs(
  skills: ReadonlyArray<{ readonly name: string; readonly dir: string }>,
  outSkillsDir: string,
): void {
  for (const skill of skills) {
    copyDir(skill.dir, join(outSkillsDir, skill.name));
  }
}
