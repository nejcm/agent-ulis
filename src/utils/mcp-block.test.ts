import { describe, it, expect } from "bun:test";

import type { McpConfig } from "../schema.js";
import { mcpServersFor, translateEnvMap } from "./mcp-block.js";

const mcp: McpConfig = {
  servers: {
    local_tool: {
      type: "local",
      command: "npx",
      args: ["-y", "my-mcp"],
      env: { TOKEN: "${MY_TOKEN}", OTHER: "plain" },
      targets: ["claude", "opencode"],
    },
    remote_tool: {
      type: "remote",
      url: "https://mcp.example.com",
      headers: { Authorization: "Bearer ${API_KEY}" },
      targets: ["cursor"],
    },
    multi_target: {
      type: "local",
      command: "bun",
      args: ["run", "mcp.ts"],
      targets: ["claude", "codex", "cursor"],
    },
    universal: {
      type: "local",
      command: "bun",
      args: ["run", "u.ts"],
      // targets omitted → applies to every platform
    },
    disabled: {
      type: "local",
      command: "bun",
      args: ["run", "d.ts"],
      targets: [],
    },
  },
};

describe("mcpServersFor", () => {
  it("yields only servers targeting the given platform", () => {
    const entries = [...mcpServersFor(mcp, "claude")];
    expect(entries.map(([name]) => name)).toEqual(["local_tool", "multi_target", "universal"]);
  });

  it("yields remote server for cursor", () => {
    const entries = [...mcpServersFor(mcp, "cursor")];
    expect(entries.map(([name]) => name)).toEqual(["remote_tool", "multi_target", "universal"]);
  });

  it("yields nothing when no servers target the platform", () => {
    const entries = [...mcpServersFor(mcp, "opencode")];
    expect(entries.map(([name]) => name)).toEqual(["local_tool", "universal"]);
  });

  it("treats omitted targets as applying to every platform", () => {
    const entries = [...mcpServersFor(mcp, "anything")];
    expect(entries.map(([name]) => name)).toEqual(["universal"]);
  });

  it("treats an empty targets array as disabled", () => {
    for (const t of ["claude", "codex", "cursor", "opencode"]) {
      const names = [...mcpServersFor(mcp, t)].map(([name]) => name);
      expect(names).not.toContain("disabled");
    }
  });

  it("yields the full server object", () => {
    const [[, server]] = [...mcpServersFor(mcp, "cursor")];
    expect(server.url).toBe("https://mcp.example.com");
  });
});

describe("translateEnvMap", () => {
  it("returns undefined for undefined input", () => {
    expect(translateEnvMap(undefined, "claude")).toBeUndefined();
  });

  it("passes through plain values unchanged", () => {
    expect(translateEnvMap({ KEY: "plain" }, "claude")).toEqual({ KEY: "plain" });
  });

  it("translates ${VAR} to shell syntax for claude/codex/cursor", () => {
    const result = translateEnvMap({ TOKEN: "${MY_TOKEN}" }, "claude");
    expect(result).toEqual({ TOKEN: "${MY_TOKEN}" });
  });

  it("keeps ${VAR} as shell syntax for opencode_env", () => {
    const result = translateEnvMap({ TOKEN: "${MY_TOKEN}" }, "opencode_env");
    expect(result).toEqual({ TOKEN: "${MY_TOKEN}" });
  });

  it("translates ${VAR} to {env:VAR} for opencode_header", () => {
    const result = translateEnvMap({ Auth: "Bearer ${API_KEY}" }, "opencode_header");
    expect(result).toEqual({ Auth: "Bearer {env:API_KEY}" });
  });

  it("translates multiple values in the same map", () => {
    const result = translateEnvMap({ A: "${X}", B: "${Y}", C: "static" }, "opencode_header");
    expect(result).toEqual({ A: "{env:X}", B: "{env:Y}", C: "static" });
  });

  it("extracts only the var name for codex_header", () => {
    const result = translateEnvMap({ Authorization: "${API_KEY}", Other: "static" }, "codex_header");
    expect(result).toEqual({ Authorization: "API_KEY", Other: "static" });
  });
});
