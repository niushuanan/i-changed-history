import { describe, expect, it } from "vitest";
import { HISTORY_GROUPS } from "../data/historyGroups";
import {
  UNLOCK_PROGRESS_STORAGE_KEY,
  canUnlockHistoryGroup,
  completeHistorySeed,
  loadUnlockProgress,
  unlockHistoryGroup,
} from "./unlockProgress";

function memoryStorage(initial?: Record<string, string>) {
  const data = new Map(Object.entries(initial ?? {}));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
    removeItem: (key: string) => { data.delete(key); },
  };
}

describe("group unlock progress", () => {
  it("persists an explicit empty marker and lets the player choose the first group for free", () => {
    const storage = memoryStorage();
    const progress = loadUnlockProgress(storage);
    const firstGroupId = HISTORY_GROUPS[2].id;

    expect(progress).toEqual({
      unlockedGroups: [],
      completedSeeds: [],
      tokens: 0,
    });
    expect(storage.getItem(UNLOCK_PROGRESS_STORAGE_KEY)).toContain('"version":1');
    expect(canUnlockHistoryGroup(progress, firstGroupId)).toBe(true);

    const unlocked = unlockHistoryGroup(progress, firstGroupId);
    expect(unlocked.changed).toBe(true);
    expect(unlocked.progress).toEqual({
      unlockedGroups: [firstGroupId],
      completedSeeds: [],
      tokens: 0,
    });
  });

  it("awards exactly one token for a first completion and never rewards a replay", () => {
    const seedId = HISTORY_GROUPS[2].seedIds[0];
    const initial = {
      unlockedGroups: [HISTORY_GROUPS[2].id],
      completedSeeds: [],
      tokens: 0,
    };

    const firstCompletion = completeHistorySeed(initial, seedId);
    expect(firstCompletion.changed).toBe(true);
    expect(firstCompletion.progress.tokens).toBe(1);
    expect(firstCompletion.progress.completedSeeds).toEqual([seedId]);

    const replay = completeHistorySeed(firstCompletion.progress, seedId);
    expect(replay.changed).toBe(false);
    expect(replay.progress).toEqual(firstCompletion.progress);
  });

  it("spends one token for later groups and refuses a locked group without currency", () => {
    const firstGroupId = HISTORY_GROUPS[0].id;
    const nextGroupId = HISTORY_GROUPS[1].id;
    const withoutToken = {
      unlockedGroups: [firstGroupId],
      completedSeeds: [],
      tokens: 0,
    };

    expect(canUnlockHistoryGroup(withoutToken, nextGroupId)).toBe(false);
    expect(unlockHistoryGroup(withoutToken, nextGroupId)).toEqual({
      changed: false,
      progress: withoutToken,
    });

    const withToken = { ...withoutToken, tokens: 1 };
    const unlocked = unlockHistoryGroup(withToken, nextGroupId);
    expect(unlocked.changed).toBe(true);
    expect(unlocked.progress.unlockedGroups).toEqual([firstGroupId, nextGroupId]);
    expect(unlocked.progress.tokens).toBe(0);
  });

  it("migrates completed archives without losing their groups or earned currency", () => {
    const storage = memoryStorage();
    const legacySeeds = [
      HISTORY_GROUPS[0].seedIds[0],
      HISTORY_GROUPS[2].seedIds[0],
      HISTORY_GROUPS[2].seedIds[0],
      "retired-history",
    ];

    const progress = loadUnlockProgress(storage, legacySeeds);

    expect(progress.completedSeeds).toEqual([
      HISTORY_GROUPS[0].seedIds[0],
      HISTORY_GROUPS[2].seedIds[0],
    ]);
    expect(progress.unlockedGroups).toEqual([
      HISTORY_GROUPS[0].id,
      HISTORY_GROUPS[2].id,
    ]);
    expect(progress.tokens).toBe(2);
  });

  it("sanitizes corrupted storage and preserves valid completed histories", () => {
    const storage = memoryStorage({
      [UNLOCK_PROGRESS_STORAGE_KEY]: JSON.stringify({
        version: 1,
        progress: {
          unlockedGroups: [HISTORY_GROUPS[0].id, HISTORY_GROUPS[0].id, "unknown"],
          completedSeeds: [HISTORY_GROUPS[2].seedIds[0], "retired-history"],
          tokens: -9,
        },
      }),
    });

    expect(loadUnlockProgress(storage)).toEqual({
      unlockedGroups: [HISTORY_GROUPS[0].id, HISTORY_GROUPS[2].id],
      completedSeeds: [HISTORY_GROUPS[2].seedIds[0]],
      tokens: 0,
    });
  });

  it("keeps earning first-completion tokens after every group is open", () => {
    const progress = {
      unlockedGroups: HISTORY_GROUPS.map((group) => group.id),
      completedSeeds: [],
      tokens: 7,
    };

    const completed = completeHistorySeed(progress, HISTORY_GROUPS[0].seedIds[0]);
    expect(completed.progress.tokens).toBe(8);
    expect(HISTORY_GROUPS.every((group) => (
      !canUnlockHistoryGroup(completed.progress, group.id)
    ))).toBe(true);
  });
});
