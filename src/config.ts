/**
 * Default names for user-controlled source and output directories.
 */
export const ULIS_SOURCE_DIRNAME = ".ulis" as const;
export const ULIS_GENERATED_DIRNAME = "generated" as const;

/**
 * Resolved build configuration shape loaded from `<sourceDir>/build.config.*`.
 */
export interface BuildConfig {
  readonly platforms: {
    readonly claude: {
      readonly toolNames: {
        readonly read: readonly string[];
        readonly write: readonly string[];
        readonly edit: readonly string[];
        readonly bash: readonly string[];
        readonly search: readonly string[];
        readonly browser: readonly string[];
      };
    };
    readonly opencode: {
      readonly defaultModel: string;
      readonly smallModel: string;
      readonly schema: string;
      readonly agentNameMap: Readonly<Record<string, string>>;
    };
    readonly codex: {
      readonly model: string;
      readonly modelReasoningEffort: string;
      readonly sandbox: string;
      readonly trustedProjects: Readonly<Record<string, string>>;
      readonly mcpStartupTimeoutSec: number;
    };
    readonly cursor: {
      readonly toolNames: {
        readonly read: readonly string[];
        readonly write: readonly string[];
        readonly edit: readonly string[];
        readonly bash: readonly string[];
        readonly search: readonly string[];
        readonly browser: readonly string[];
      };
    };
    readonly forgecode: {
      readonly toolNames: {
        readonly read: readonly string[];
        readonly write: readonly string[];
        readonly edit: readonly string[];
        readonly bash: readonly string[];
        readonly search: readonly string[];
        readonly browser: readonly string[];
      };
    };
  };
}
