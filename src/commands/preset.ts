import { listPresets } from "../presets.js";
import { logger as log } from "../utils/logger.js";
import { userPresetsRoot } from "../utils/resolve-presets.js";

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

interface PresetListOptions {
  readonly presetsRoot?: string;
  readonly bundledPresetsRoot?: string;
}

export async function presetListCmd(options: PresetListOptions = {}): Promise<void> {
  const presetsRoot = userPresetsRoot(options.presetsRoot);
  const entries = listPresets(options);

  if (entries.length === 0) {
    log.info(`No user-global or bundled presets found.`);
    log.info(`Create it with: mkdir -p ${presetsRoot}/<preset-name>`);
    return;
  }

  log.header("Available Presets");

  for (const entry of entries) {
    const description = entry.description ? `  ${entry.description}` : "";
    const metaLabel = entry.displayName !== entry.name ? `${entry.displayName}, ${entry.source}` : entry.source;
    console.log(`  ${CYAN}${entry.name}${RESET} ${DIM}(${metaLabel})${RESET}${description}`);
  }
}
