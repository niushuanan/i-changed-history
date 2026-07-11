import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS, dealHistorySeeds } from "./historySeeds";

const eras = ["ancient", "medieval", "early-modern", "industrial", "modern"] as const;

describe("historical seed deck", () => {
  it("contains fifty balanced and complete seeds", () => {
    expect(HISTORY_SEEDS).toHaveLength(50);

    for (const era of eras) {
      expect(HISTORY_SEEDS.filter((seed) => seed.era === era)).toHaveLength(10);
    }

    expect(HISTORY_SEEDS.every((seed) => seed.baselineFacts.length === 3)).toBe(true);
    expect(new Set(HISTORY_SEEDS.map((seed) => seed.id)).size).toBe(50);
  });

  it("contains no China-related card from 1840 onward", () => {
    const forbidden = HISTORY_SEEDS.filter((seed) => seed.chinaRelated && seed.year >= 1840);
    expect(forbidden).toEqual([]);
  });

  it("deals one card from every era without immediate repeats", () => {
    const first = dealHistorySeeds([], () => 0.25);
    const second = dealHistorySeeds(first.map((seed) => seed.id), () => 0.25);

    expect(first).toHaveLength(5);
    expect(new Set(first.map((seed) => seed.era))).toEqual(new Set(eras));
    expect(second.some((seed) => first.some((prior) => prior.id === seed.id))).toBe(false);
  });

  it("does not mutate the source deck while dealing", () => {
    const originalIds = HISTORY_SEEDS.map((seed) => seed.id);

    dealHistorySeeds([], () => 0.75);

    expect(HISTORY_SEEDS.map((seed) => seed.id)).toEqual(originalIds);
  });
});
