import { describe, expect, it } from "vitest";
import {
  LONG_RUN_SOAK_CASES,
  selectLongRunSoakCases,
} from "./soakCases";

describe("roguelike long-run soak cases", () => {
  it("covers ten distinct historical openings with four or five Rolls each", () => {
    expect(LONG_RUN_SOAK_CASES).toHaveLength(10);
    expect(new Set(LONG_RUN_SOAK_CASES.map((item) => item.seedId))).toHaveProperty("size", 10);
    LONG_RUN_SOAK_CASES.forEach((item) => {
      expect(item.rollChapters.length).toBeGreaterThanOrEqual(4);
      expect(item.rollChapters.length).toBeLessThanOrEqual(5);
      expect(new Set(item.rollChapters).size).toBe(item.rollChapters.length);
    });
  });

  it("can force every chapter through the prepared Roll trio", () => {
    const selected = selectLongRunSoakCases({
      caseIds: ["china-red-cliffs", "world-rome-fire", "world-apollo"],
      allRoll: true,
    });

    expect(selected).toHaveLength(3);
    selected.forEach((item) => {
      expect(item.rollChapters).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });
  });

  it("rejects unknown case ids instead of silently changing coverage", () => {
    expect(() => selectLongRunSoakCases({ caseIds: ["missing-case"] })).toThrow("Unknown soak case");
  });
});
