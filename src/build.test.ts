import { afterEach, describe, expect, it } from "bun:test";
import { cpSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { analyzeProject } from "./build.js";

const fixturesDir = resolve(join(import.meta.dirname, "../tests/fixtures"));
const tmpRoots: string[] = [];
const silentLogger = {
  header: () => {},
  info: () => {},
  success: () => {},
  warn: () => {},
  error: () => {},
  dim: () => {},
};

function createTempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "ulis-build-"));
  tmpRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tmpRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("analyzeProject", () => {
  it("validates a source tree without writing generated files", () => {
    const root = createTempRoot();
    const sourceDir = join(root, ".ulis");
    cpSync(fixturesDir, sourceDir, { recursive: true });

    const analysis = analyzeProject({ sourceDir, logger: silentLogger });

    expect(analysis.errorCount).toBe(0);
    expect(analysis.project.agents.length).toBe(1);
    expect(existsSync(join(sourceDir, "generated"))).toBe(false);
  });
});
