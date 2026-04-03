# Skills

OpenCode skill definitions — reusable, invocable capabilities that agents can call during a session. Each skill lives in its own subdirectory with a `SKILL.md` and optional `config/` or `references/` directories.

## Structure

```
skills/
  <skill-name>/
    SKILL.md          # Skill definition and instructions
    config/           # Tool configs used by the skill (optional)
    references/       # Reference documents the skill uses (optional)
```

## Available Skills

| Skill                           | Category      | Description                                                   |
| ------------------------------- | ------------- | ------------------------------------------------------------- |
| `api-validator`                 | testing       | OpenAPI schema validation, contract testing, Spectral linting |
| `audit-skills`                  | analysis      | Audit skill usage patterns and security practices             |
| `ci-status`                     | integration   | Check CI/CD pipeline status for current branch                |
| `code-quality`                  | testing       | Run linting, formatting, and static analysis checks           |
| `coverage-analyzer`             | testing       | Analyze code coverage and identify uncovered paths            |
| `dependency-check`              | analysis      | Scan dependencies for known vulnerabilities                   |
| `doc-generator`                 | documentation | Auto-generate API and module documentation                    |
| `explore-codebase`              | analysis      | Map codebase structure and summarize architecture             |
| `git-workflow`                  | vcs           | Git operations, branch management, conflict resolution        |
| `grill-me`                      | interview     | Interactive knowledge assessment and Q&A                      |
| `improve-codebase-architecture` | architecture  | Analyze and suggest architectural improvements                |
| `mutation-tester`               | testing       | Run mutation tests to verify test quality                     |
| `performance-profiler`          | performance   | Profile execution, identify bottlenecks                       |
| `run-tests`                     | testing       | Execute test suites and report results                        |
| `spec-validator`                | validation    | Validate implementation against specification                 |
| `token-efficiency`              | optimization  | Analyze and reduce LLM token usage                            |

## How It's Used

The build system copies `skills/` directly into `generated/opencode/skills/` at the repo root. No transformation is applied — files are used as-is by OpenCode.

## Adding a New Skill

1. Create `.ai/skills/<name>/SKILL.md` with the skill instructions
2. Add a `config/` directory if the skill uses tool-specific configuration files
3. Add a `references/` directory for any reference documents the skill reads
4. Run `bun run build` from the repo root — the skill will be included automatically
5. Invoke it in OpenCode with the skill name
