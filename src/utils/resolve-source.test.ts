import { afterEach, describe, expect, it } from "bun:test";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

import { resolveSource } from "./resolve-source.js";

const tmpRoots: string[] = [];

function createTempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "ulis-resolve-"));
  tmpRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of tmpRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("resolveSource", () => {
  it("uses an explicit source while keeping global installs pointed at home", () => {
    const root = createTempRoot();
    const sourceDir = join(root, "example");
    mkdirSync(sourceDir, { recursive: true });

    expect(resolveSource({ cwd: root, source: "example", global: true })).toEqual({
      sourceDir,
      destBase: homedir(),
      mode: "global",
    });
  });

  it("installs alongside an explicit source when global mode is not set", () => {
    const root = createTempRoot();
    const sourceDir = join(root, "example");
    mkdirSync(sourceDir, { recursive: true });

    expect(resolveSource({ cwd: root, source: "example" })).toEqual({
      sourceDir,
      destBase: root,
      mode: "source",
    });
  });
});
