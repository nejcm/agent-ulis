import { CommandFrontmatterSchema, type CommandFrontmatter } from "../schema.js";
import { readMarkdownDir, ParseError } from "./_shared.js";

export interface ParsedCommand {
  name: string; // filename without .md
  filename: string; // full filename including .md
  frontmatter: CommandFrontmatter;
  body: string;
}

export function parseCommands(commandsDir: string): readonly ParsedCommand[] {
  const { items, errors } = readMarkdownDir(
    commandsDir,
    CommandFrontmatterSchema,
    "command",
    (name, frontmatter, body, relFile) => ({ name, filename: relFile, frontmatter, body }),
  );
  if (errors.length > 0) throw errors[0] as ParseError;
  return items;
}
