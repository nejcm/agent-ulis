# Scripts

Bash utility scripts.

## Available Scripts

| Script | Description |
| ------ | ----------- |
| ``     |             |

## Usage

Scripts can be invoked directly in a shell or referenced from LLM skills and workflows:

```bash
# Check if API budget is within limits
bash .ai/global/scripts/check-budget.sh

# Run full health check
bash .ai/global/scripts/health-check.sh

# Analyze costs for current session
bash .ai/global/scripts/cost-analyzer.sh
```

## How It's Used

The build system copies `scripts/` directly into `generated/[PLATFORM]/scripts/` at the repo root. No transformation is applied.

## Adding a New Script

1. Create `.ai/global/scripts/<name>.sh`
2. Make it executable: `chmod +x .ai/global/scripts/<name>.sh`
3. Add a comment header describing what it does and any required env vars
4. Run `bun run build` from the repo root — it will be included automatically
