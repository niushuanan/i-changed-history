export type LongRunSoakCase = Readonly<{
  id: string;
  seedId: string;
  rollChapters: readonly number[];
}>;

export const LONG_RUN_SOAK_CASES: readonly LongRunSoakCase[] = [
  { id: "china-red-cliffs", seedId: "red-cliffs-208", rollChapters: [1, 2, 3, 4] },
  { id: "china-xuanwu-gate", seedId: "xuanwu-gate-626", rollChapters: [1, 2, 3, 4] },
  { id: "china-jingkang", seedId: "jingkang-1127", rollChapters: [1, 2, 3, 4] },
  { id: "china-zheng-he", seedId: "zheng-he-1405", rollChapters: [1, 2, 3, 4] },
  { id: "china-shanhai-pass", seedId: "shanhai-pass-1644", rollChapters: [1, 2, 3, 4] },
  { id: "world-rome-fire", seedId: "great-fire-rome-64", rollChapters: [1, 2, 3, 4] },
  { id: "world-columbus", seedId: "columbus-1492", rollChapters: [1, 2, 3, 4] },
  { id: "world-sarajevo", seedId: "sarajevo-1914", rollChapters: [1, 2, 3, 4] },
  { id: "world-poland", seedId: "hitler-poland-1939", rollChapters: [1, 2, 3, 4] },
  { id: "world-apollo", seedId: "apollo-11-1969", rollChapters: [1, 2, 3, 4] },
] as const;

const ALL_ROLL_CHAPTERS = [1, 2, 3, 4] as const;

export function selectLongRunSoakCases({
  caseIds = [],
  limit = LONG_RUN_SOAK_CASES.length,
  allRoll = false,
}: {
  caseIds?: readonly string[];
  limit?: number;
  allRoll?: boolean;
} = {}): LongRunSoakCase[] {
  const candidates = caseIds.length > 0
    ? caseIds.map((id) => {
        const match = LONG_RUN_SOAK_CASES.find((item) => item.id === id);
        if (!match) throw new Error(`Unknown soak case: ${id}`);
        return match;
      })
    : [...LONG_RUN_SOAK_CASES];
  const boundedLimit = Math.max(1, Math.min(candidates.length, limit));
  return candidates.slice(0, boundedLimit).map((item) => ({
    ...item,
    ...(allRoll ? { rollChapters: ALL_ROLL_CHAPTERS } : {}),
  }));
}
