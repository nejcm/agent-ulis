import { afterEach, describe, expect, it } from "bun:test";
import { cpSync, existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
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

  it("throws on validation errors and still writes no generated output", () => {
    const root = createTempRoot();
    const sourceDir = join(root, ".ulis");
    cpSync(fixturesDir, sourceDir, { recursive: true });

    const duplicateSkillDir = join(sourceDir, "skills", "duplicate-skill");
    mkdirSync(duplicateSkillDir, { recursive: true });
    writeFileSync(
      join(duplicateSkillDir, "SKILL.md"),
      `---
name: my-skill
description: A minimal test skill duplicate
custom_agent_hint: keep-me
allowImplicitInvocation: false
platforms:
  codex:
    model: gpt-5.4
---

Duplicate skill for test.`,
    );

    // This path intentionally exercises the failing analysis path; parse or validation
    // failures are both acceptable so long as no generated files are written.
    expect(() => analyzeProject({ sourceDir, logger: silentLogger })).toThrow("No files written.");
    expect(existsSync(join(sourceDir, "generated"))).toBe(false);
  });
});
