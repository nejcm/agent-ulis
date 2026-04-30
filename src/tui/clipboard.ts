import { spawnSync, type SpawnSyncReturns } from "node:child_process";

interface ClipboardCommand {
  readonly command: string;
  readonly args: readonly string[];
}

interface RuntimeDependencies {
  readonly platform: NodeJS.Platform;
  readonly spawnSync: typeof spawnSync;
}

const DEFAULT_RUNTIME_DEPENDENCIES: RuntimeDependencies = {
  platform: process.platform,
  spawnSync,
};

let runtimeDependencies = DEFAULT_RUNTIME_DEPENDENCIES;

export function readClipboardText(): string {
  for (const command of clipboardCommands(runtimeDependencies.platform)) {
    const result = runtimeDependencies.spawnSync(command.command, [...command.args], {
      encoding: "utf8",
      timeout: 1_000,
      windowsHide: true,
    });
    const text = spawnOutput(result).replace(/\r?\n$/, "");
    if (result.status === 0 && text.length > 0) return text;
  }
  return "";
}

function clipboardCommands(platform: NodeJS.Platform): readonly ClipboardCommand[] {
  if (platform === "win32") {
    return [{ command: "powershell.exe", args: ["-NoProfile", "-Command", "Get-Clipboard -Raw"] }];
  }

  if (platform === "darwin") {
    return [{ command: "pbpaste", args: [] }];
  }

  return [
    { command: "wl-paste", args: ["--no-newline"] },
    { command: "xclip", args: ["-selection", "clipboard", "-out"] },
    { command: "xsel", args: ["--clipboard", "--output"] },
  ];
}

function spawnOutput(result: SpawnSyncReturns<string | Buffer>): string {
  return typeof result.stdout === "string" ? result.stdout : result.stdout.toString("utf8");
}

export const __test = {
  setRuntimeDependencies(overrides: Partial<RuntimeDependencies>): void {
    runtimeDependencies = { ...runtimeDependencies, ...overrides };
  },
  resetRuntimeDependencies(): void {
    runtimeDependencies = DEFAULT_RUNTIME_DEPENDENCIES;
  },
};
