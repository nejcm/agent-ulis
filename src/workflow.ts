import { PLATFORMS, type Platform, uniquePlatforms } from "./platforms.js";

export interface WorkflowPlan {
  readonly buildTargets: readonly Platform[];
  readonly installTargets: readonly Platform[];
}

export function resolveWorkflowPlan(
  generateTargets: readonly Platform[],
  installTargets: readonly Platform[],
): WorkflowPlan {
  return {
    buildTargets: uniquePlatforms([...generateTargets, ...installTargets]),
    installTargets: uniquePlatforms(installTargets),
  };
}

export function togglePlatformSelection(selected: readonly Platform[], platform: Platform): Platform[] {
  const next = new Set(selected);
  if (next.has(platform)) {
    next.delete(platform);
  } else {
    next.add(platform);
  }

  return uniquePlatforms([...next]);
}

export function toggleAllPlatformSelections(selected: readonly Platform[]): Platform[] {
  return selected.length === PLATFORMS.length ? [] : [...PLATFORMS];
}
