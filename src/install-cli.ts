import { runInstall } from "./install.js";
import { PLATFORMS, parsePlatformList } from "./platforms.js";
import { log } from "./utils/logger.js";

export interface InstallCliOptions {
  readonly platforms: readonly (typeof PLATFORMS)[number][];
  readonly backup: boolean;
  readonly rebuild: boolean;
}

export function parseInstallCliArgs(args: readonly string[]): InstallCliOptions {
  const platformArgs: string[] = [];
  let backup = false;
  let rebuild = false;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--backup") {
      backup = true;
      continue;
    }
    if (arg === "--rebuild") {
      rebuild = true;
      continue;
    }
    if (arg === "--platform" || arg === "--platforms" || arg === "--target" || arg === "--targets") {
      const value = args[index + 1];
      if (!value) {
        throw new Error(`${arg} requires a value`);
      }
      platformArgs.push(value);
      index++;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    platforms: platformArgs.length > 0 ? parsePlatformList(platformArgs) : [...PLATFORMS],
    backup,
    rebuild,
  };
}

export function main(args: readonly string[] = process.argv.slice(2)): void {
  const options = parseInstallCliArgs(args);
  runInstall({
    platforms: options.platforms,
    backup: options.backup,
    rebuild: options.rebuild,
    logger: log,
  });
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}
