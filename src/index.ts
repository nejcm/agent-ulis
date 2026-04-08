import { runBuild } from "./build.js";
import { parsePlatformList } from "./platforms.js";

function parseBuildArgs(args: readonly string[]) {
  const targetArgs: string[] = [];

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === "--target" || arg === "--targets") {
      const value = args[index + 1];
      if (!value) {
        throw new Error(`${arg} requires a value`);
      }
      targetArgs.push(value);
      index++;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    targets: targetArgs.length > 0 ? parsePlatformList(targetArgs) : undefined,
  };
}

try {
  const options = parseBuildArgs(process.argv.slice(2));
  runBuild(options);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
}
