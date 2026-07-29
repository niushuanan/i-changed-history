import {
  HISTORY_GROUPS,
  historyGroupById,
  historyGroupForSeed,
} from "../data/historyGroups";
import { HISTORY_SEEDS } from "../data/historySeeds";

export const UNLOCK_PROGRESS_STORAGE_KEY = "i-changed-history:unlock-progress:v1";
const UNLOCK_PROGRESS_VERSION = 1;
const ACTIVE_SEED_IDS = new Set(HISTORY_SEEDS.map((seed) => seed.id));
const ACTIVE_GROUP_IDS = new Set(HISTORY_GROUPS.map((group) => group.id));

export type UnlockProgress = {
  unlockedGroups: string[];
  completedSeeds: string[];
  tokens: number;
};

export type UnlockProgressChange = {
  progress: UnlockProgress;
  changed: boolean;
};

export type UnlockProgressStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const EMPTY_PROGRESS: UnlockProgress = {
  unlockedGroups: [],
  completedSeeds: [],
  tokens: 0,
};

function uniqueValidStrings(value: unknown, validValues: ReadonlySet<string>): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(
    (entry): entry is string => typeof entry === "string" && validValues.has(entry),
  ))];
}

function safeTokens(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.min(HISTORY_SEEDS.length, Math.max(0, Math.floor(value)));
}

function sanitizeProgress(value: unknown): UnlockProgress {
  const candidate = value && typeof value === "object"
    ? value as Partial<UnlockProgress>
    : EMPTY_PROGRESS;
  const completedSeeds = uniqueValidStrings(candidate.completedSeeds, ACTIVE_SEED_IDS);
  const completedSeedSet = new Set(completedSeeds);
  const unlockedGroups = uniqueValidStrings(candidate.unlockedGroups, ACTIVE_GROUP_IDS);
  const unlockedSet = new Set(unlockedGroups);

  for (const group of HISTORY_GROUPS) {
    if (group.seedIds.some((seedId) => completedSeedSet.has(seedId)) && !unlockedSet.has(group.id)) {
      unlockedSet.add(group.id);
      unlockedGroups.push(group.id);
    }
  }

  return {
    unlockedGroups,
    completedSeeds,
    tokens: safeTokens(candidate.tokens),
  };
}

export function persistUnlockProgress(
  progress: UnlockProgress,
  storage: UnlockProgressStorage = localStorage,
): boolean {
  try {
    const sanitized = sanitizeProgress(progress);
    storage.setItem(UNLOCK_PROGRESS_STORAGE_KEY, JSON.stringify({
      version: UNLOCK_PROGRESS_VERSION,
      progress: sanitized,
    }));
    return true;
  } catch {
    return false;
  }
}

export function loadUnlockProgress(
  storage: UnlockProgressStorage = localStorage,
  legacyCompletedSeedIds: readonly string[] = [],
): UnlockProgress {
  try {
    const stored = storage.getItem(UNLOCK_PROGRESS_STORAGE_KEY);
    if (stored) {
      const envelope = JSON.parse(stored) as { version?: unknown; progress?: unknown };
      const progress = envelope.version === UNLOCK_PROGRESS_VERSION
        ? sanitizeProgress(envelope.progress)
        : sanitizeProgress(EMPTY_PROGRESS);
      persistUnlockProgress(progress, storage);
      return progress;
    }
  } catch {
    // Fall through to a clean, migration-aware envelope.
  }

  const completedSeeds = uniqueValidStrings(legacyCompletedSeedIds, ACTIVE_SEED_IDS);
  const progress = sanitizeProgress({
    completedSeeds,
    unlockedGroups: [],
    tokens: completedSeeds.length,
  });
  persistUnlockProgress(progress, storage);
  return progress;
}

export function canUnlockHistoryGroup(progress: UnlockProgress, groupId: string): boolean {
  if (!historyGroupById(groupId) || progress.unlockedGroups.includes(groupId)) return false;
  return progress.unlockedGroups.length === 0 || progress.tokens > 0;
}

export function unlockHistoryGroup(
  progress: UnlockProgress,
  groupId: string,
): UnlockProgressChange {
  if (!canUnlockHistoryGroup(progress, groupId)) {
    return { progress, changed: false };
  }
  const firstGroupIsFree = progress.unlockedGroups.length === 0;
  return {
    changed: true,
    progress: {
      ...progress,
      unlockedGroups: [...progress.unlockedGroups, groupId],
      tokens: firstGroupIsFree ? progress.tokens : progress.tokens - 1,
    },
  };
}

export function completeHistorySeed(
  progress: UnlockProgress,
  seedId: string,
): UnlockProgressChange {
  if (!ACTIVE_SEED_IDS.has(seedId) || progress.completedSeeds.includes(seedId)) {
    return { progress, changed: false };
  }
  const group = historyGroupForSeed(seedId);
  const unlockedGroups = group && !progress.unlockedGroups.includes(group.id)
    ? [...progress.unlockedGroups, group.id]
    : progress.unlockedGroups;

  return {
    changed: true,
    progress: {
      unlockedGroups,
      completedSeeds: [...progress.completedSeeds, seedId],
      tokens: Math.min(HISTORY_SEEDS.length, progress.tokens + 1),
    },
  };
}
