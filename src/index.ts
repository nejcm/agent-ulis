import { join, resolve } from "node:path";
import { parseAgents } from "./parsers/agent.js";
import { parseSkills } from "./parsers/skill.js";
import { parseMcpConfig } from "./parsers/mcp.js";
import { parsePluginsConfig } from "./parsers/plugins.js";
import { generateOpencode } from "./generators/opencode.js";
import { generateClaude } from "./generators/claude.js";
import { generateCodex } from "./generators/codex.js";
import { generateCursor } from "./generators/cursor.js";
import { log } from "./utils/logger.js";

const args = process.argv.slice(2);
const targetIdx = args.indexOf("--target");
const targetFilter = targetIdx !== -1 ? args[targetIdx + 1] : undefined;

const aiDir = resolve(join(import.meta.dirname, "..", ".ai"));
const generatedDir = resolve(join(import.meta.dirname, "..", "generated"));

log.header("AI Config Build System");
log.info(`Source: ${aiDir}`);
log.info(`Output: ${generatedDir}`);
if (targetFilter) log.info(`Target: ${targetFilter}`);

// Parse canonical sources
log.header("Parsing");

const agents = parseAgents(join(aiDir, "agents"));
log.success(`Parsed ${agents.length} agents`);

const skills = parseSkills(join(aiDir, "skills"));
log.success(`Parsed ${skills.length} skills`);

const mcp = parseMcpConfig(join(aiDir, "mcp.json"));
log.success(`Parsed ${Object.keys(mcp.servers).length} MCP servers`);

const plugins = parsePluginsConfig(join(aiDir, "plugins.json"));
log.success(`Parsed plugins config`);

// Generate per-tool configs
const targets = ["opencode", "claude", "codex", "cursor"];
const activeTargets = targetFilter ? targets.filter((t) => t === targetFilter) : targets;

for (const target of activeTargets) {
  const outDir = join(generatedDir, target);
  switch (target) {
    case "opencode":
      generateOpencode(agents, skills, mcp, plugins, aiDir, outDir);
      break;
    case "claude":
      generateClaude(agents, skills, mcp, plugins, aiDir, outDir);
      break;
    case "codex":
      generateCodex(agents, skills, mcp, aiDir, outDir);
      break;
    case "cursor":
      generateCursor(agents, skills, mcp, outDir);
      break;
  }
}

log.header("Build Complete");
log.success(`Generated configs for: ${activeTargets.join(", ")}`);
