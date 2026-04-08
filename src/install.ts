import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";

import { runBuild, type Logger } from "./build.js";
import { PLATFORMS, PLATFORM_LABELS, type Platform, uniquePlatforms } from "./platforms.js";
import { deepMerge } from "./utils/build-config.js";

export interface InstallOptions {
  readonly platforms?: readonly Platform[];
  readonly backup?: boolean;
  readonly rebuild?: boolean;
  readonly rootDir?: string;
  readonly logger?: Logger;
}

export function loadDotEnv(rootDir: string, env: NodeJS.ProcessEnv = process.env): void {
  const envPath = join(rootDir, ".env");
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/u);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    if (!key || key in env) {
      continue;
    }

    env[key] = rawValue.replace(/^['"]|['"]$/gu, "");
  }
}

export function runInstall(options: InstallOptions = {}): readonly Platform[] {
  const logger = options.logger;
  const rootDir = options.rootDir ?? resolve(join(import.meta.dirname, ".."));
  const generatedDir = join(rootDir, "generated");
  const platforms = options.platforms ? uniquePlatforms(options.platforms) : [...PLATFORMS];
  const backup = options.backup ?? false;
  const rebuild = options.rebuild ?? false;

  loadDotEnv(rootDir);
  ensurePrerequisite("bun", "bun is required (https://bun.sh)");
  ensurePrerequisite("git", "git is required");

  logHeader(logger, `AI Config Installer (${process.platform === "win32" ? "Windows" : "Linux/macOS"})`);
  logInfo(logger, `Source: ${generatedDir}`);
  logInfo(logger, `Platforms: ${platforms.join(", ")}`);

  if (platforms.length === 0) {
    logWarn(logger, "No platforms selected. Nothing to install.");
    return [];
  }

  const missingBuildOutputs = platforms.some((platform) => !existsSync(join(generatedDir, platform)));
  if (rebuild || missingBuildOutputs) {
    logWarn(
      logger,
      rebuild ? "Rebuilding generated configs before install." : "Missing generated output. Running build.",
    );
    runBuild({
      targets: platforms,
      rootDir,
      logger,
    });
  }

  const timestamp = makeTimestamp();
  for (const platform of platforms) {
    switch (platform) {
      case "opencode":
        installOpencode({ generatedDir, backup, timestamp, logger });
        break;
      case "claude":
        installClaude({ generatedDir, backup, timestamp, logger });
        break;
      case "codex":
        installCodex({ generatedDir, backup, timestamp, logger });
        break;
      case "cursor":
        installCursor({ generatedDir, backup, timestamp, logger });
        break;
    }
  }

  logHeader(logger, "Installation Complete");
  logInfo(logger, "Required environment variables:");
  logInfo(logger, "  GITHUB_PAT       GitHub Personal Access Token");
  logInfo(logger, "  CONTEXT7_API_KEY Context7 API Key");
  logInfo(logger, "  LINEAR_API_KEY   Linear API Key");
  return platforms;
}

interface InstallContext {
  readonly generatedDir: string;
  readonly backup: boolean;
  readonly timestamp: string;
  readonly logger?: Logger;
}

function installOpencode(context: InstallContext): void {
  const targetDir = process.env.OPENCODE_CONFIG || join(homedir(), ".opencode");
  logHeader(context.logger, `Installing ${PLATFORM_LABELS.opencode}`);
  backupDirectory(targetDir, context);

  rmSync(targetDir, { recursive: true, force: true });
  cpSync(join(context.generatedDir, "opencode"), targetDir, { recursive: true });
  chmodOpenCodeScripts(targetDir);
  logSuccess(context.logger, `OpenCode -> ${targetDir}`);
}

function installClaude(context: InstallContext): void {
  const targetDir = join(homedir(), ".claude");
  const sourceDir = join(context.generatedDir, "claude");
  const generatedSettings = join(sourceDir, "settings.json");
  const targetSettings = join(targetDir, "settings.json");

  logHeader(context.logger, `Installing ${PLATFORM_LABELS.claude}`);
  backupDirectory(targetDir, context);
  ensureDir(targetDir);

  if (existsSync(generatedSettings)) {
    if (existsSync(targetSettings)) {
      const merged = mergeSettingsJson(targetSettings, generatedSettings);
      writeJson(targetSettings, merged);
      logSuccess(context.logger, "settings.json (merged)");
    } else {
      cpSync(generatedSettings, targetSettings);
      logSuccess(context.logger, "settings.json (copied)");
    }
  }

  copyPlatformContents(sourceDir, targetDir, context.logger, new Set(["settings.json"]));
  installClaudeMarketplacePlugin(context.logger);
}

function installCodex(context: InstallContext): void {
  const targetDir = join(homedir(), ".codex");
  logHeader(context.logger, `Installing ${PLATFORM_LABELS.codex}`);
  backupDirectory(targetDir, context);
  ensureDir(targetDir);
  copyPlatformContents(join(context.generatedDir, "codex"), targetDir, context.logger);
}

function installCursor(context: InstallContext): void {
  const targetDir = join(homedir(), ".cursor");
  const sourceDir = join(context.generatedDir, "cursor");
  const generatedMcp = join(sourceDir, "mcp.json");
  const targetMcp = join(targetDir, "mcp.json");

  logHeader(context.logger, `Installing ${PLATFORM_LABELS.cursor}`);
  backupDirectory(targetDir, context);
  ensureDir(targetDir);

  if (existsSync(generatedMcp)) {
    if (existsSync(targetMcp)) {
      const merged = mergeCursorMcpJson(targetMcp, generatedMcp);
      writeJson(targetMcp, merged);
      logSuccess(context.logger, "mcp.json (merged)");
    } else {
      cpSync(generatedMcp, targetMcp);
      logSuccess(context.logger, "mcp.json (copied)");
    }
  }

  copyPlatformContents(sourceDir, targetDir, context.logger, new Set(["mcp.json"]));
}

function copyPlatformContents(
  sourceDir: string,
  targetDir: string,
  logger?: Logger,
  skipNames: ReadonlySet<string> = new Set(),
): void {
  ensureDir(targetDir);
  for (const entry of readdirSync(sourceDir)) {
    if (skipNames.has(entry)) {
      continue;
    }

    const sourcePath = join(sourceDir, entry);
    const targetPath = join(targetDir, entry);
    rmSync(targetPath, { recursive: true, force: true });
    cpSync(sourcePath, targetPath, { recursive: true });
    logSuccess(logger, entry);
  }
}

function mergeSettingsJson(existingPath: string, generatedPath: string): Record<string, unknown> {
  const existing = readJson(existingPath);
  const generated = readJson(generatedPath);
  return deepMerge(existing, generated);
}

function mergeCursorMcpJson(existingPath: string, generatedPath: string): Record<string, unknown> {
  const existing = readJson(existingPath);
  const generated = readJson(generatedPath);
  const existingServers = isPlainObject(existing.mcpServers) ? existing.mcpServers : {};
  const generatedServers = isPlainObject(generated.mcpServers) ? generated.mcpServers : {};

  return {
    ...existing,
    mcpServers: {
      ...existingServers,
      ...generatedServers,
    },
  };
}

function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

function writeJson(filePath: string, value: Record<string, unknown>): void {
  ensureDir(dirnameOf(filePath));
  writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function backupDirectory(targetDir: string, context: InstallContext): void {
  if (!context.backup || !existsSync(targetDir)) {
    return;
  }

  const backupPath = `${targetDir}.${context.timestamp}.backup`;
  cpSync(targetDir, backupPath, { recursive: true });
  logInfo(context.logger, `[backup] ${targetDir} -> ${backupPath}`);
}

function chmodOpenCodeScripts(targetDir: string): void {
  if (process.platform === "win32") {
    return;
  }

  const scriptsDir = join(targetDir, "scripts");
  if (!existsSync(scriptsDir)) {
    return;
  }

  for (const entry of readdirSync(scriptsDir)) {
    const scriptPath = join(scriptsDir, entry);
    if (statSync(scriptPath).isFile() && entry.endsWith(".sh")) {
      chmodSync(scriptPath, 0o755);
    }
  }
}

function installClaudeMarketplacePlugin(logger?: Logger): void {
  if (!commandExists("claude")) {
    logWarn(logger, "claude CLI not found - install marketplace plugins manually.");
    return;
  }

  const result = spawnSync("claude", ["plugin", "add", "--from", "affaan-m/everything-claude-code"], {
    stdio: "ignore",
  });

  if (result.status === 0) {
    logSuccess(logger, "Marketplace plugins");
  } else {
    logWarn(logger, "Failed to install everything-claude-code marketplace plugin.");
  }
}

function ensurePrerequisite(command: string, message: string): void {
  if (!commandExists(command)) {
    throw new Error(message);
  }
}

function commandExists(command: string): boolean {
  const lookupCommand = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(lookupCommand, [command], { stdio: "ignore" });
  return result.status === 0;
}

function ensureDir(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}

function dirnameOf(filePath: string): string {
  return filePath.slice(0, filePath.length - basename(filePath).length).replace(/[\\/]$/u, "");
}

function makeTimestamp(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(
    now.getMinutes(),
  )}${pad(now.getSeconds())}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function logHeader(logger: Logger | undefined, message: string): void {
  logger?.header(message);
}

function logInfo(logger: Logger | undefined, message: string): void {
  logger?.info(message);
}

function logSuccess(logger: Logger | undefined, message: string): void {
  logger?.success(message);
}

function logWarn(logger: Logger | undefined, message: string): void {
  logger?.warn(message);
}
