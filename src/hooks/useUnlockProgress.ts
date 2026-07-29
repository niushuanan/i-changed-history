import { useCallback, useRef, useState } from "react";
import {
  canUnlockHistoryGroup,
  completeHistorySeed,
  loadUnlockProgress,
  persistUnlockProgress,
  unlockHistoryGroup,
  type UnlockProgress,
  type UnlockProgressStorage,
} from "../services/unlockProgress";

export function useUnlockProgress(
  legacyCompletedSeedIds: readonly string[],
  storage: UnlockProgressStorage = localStorage,
) {
  const storageRef = useRef(storage);
  const [progress, setProgress] = useState<UnlockProgress>(() => (
    loadUnlockProgress(storageRef.current, legacyCompletedSeedIds)
  ));
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const commit = useCallback((nextProgress: UnlockProgress) => {
    progressRef.current = nextProgress;
    setProgress(nextProgress);
    persistUnlockProgress(nextProgress, storageRef.current);
  }, []);

  const unlockGroup = useCallback((groupId: string) => {
    const change = unlockHistoryGroup(progressRef.current, groupId);
    if (change.changed) commit(change.progress);
    return change.changed;
  }, [commit]);

  const completeSeed = useCallback((seedId: string) => {
    const change = completeHistorySeed(progressRef.current, seedId);
    if (change.changed) commit(change.progress);
    return change.changed;
  }, [commit]);

  const canUnlock = useCallback((groupId: string) => (
    canUnlockHistoryGroup(progressRef.current, groupId)
  ), []);

  return {
    progress,
    unlockedGroups: progress.unlockedGroups,
    completedSeeds: progress.completedSeeds,
    tokens: progress.tokens,
    remainingTokens: progress.tokens,
    canUnlock,
    unlockGroup,
    completeSeed,
  };
}
