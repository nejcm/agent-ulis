import { readdirSync } from "node:fs";
import { join, basename } from "node:path";

import matter from "gray-matter";

import { CommandFrontmatterSchema, type CommandFrontmatter } from "../schema.js";
import { readFile } from "../utils/fs.js";

export interface ParsedCommand {
  name: string; // filename without .md
  filename: string; // full filename including .md
  frontmatter: CommandFrontmatter;
  body: string;
}

export function parseCommands(commandsDir: string): readonly ParsedCommand[] {
  const files = readdirSync(commandsDir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  return files.map((file) => {
    const raw = readFile(join(commandsDir, file));
    const { data, content } = matter(raw);
    const frontmatter = CommandFrontmatterSchema.parse(data);
    return {
      name: basename(file, ".md"),
      filename: file,
      frontmatter,
      body: content.trim(),
    };
  });
}
