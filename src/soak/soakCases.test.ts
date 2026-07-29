import { describe, expect, it } from "vitest";
import {
  LONG_RUN_SOAK_CASES,
  selectLongRunSoakCases,
} from "./soakCases";

describe("roguelike four-decision soak cases", () => {
  it("covers ten distinct historical openings with every decision rolled", () => {
    expect(LONG_RUN_SOAK_CASES).toHaveLength(10);
    expect(new Set(LONG_RUN_SOAK_CASES.map((item) => item.seedId))).toHaveProperty("size", 10);
    LONG_RUN_SOAK_CASES.forEach((item) => {
      expect(item.rollChapters).toHaveLength(4);
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
      expect(item.rollChapters).toEqual([1, 2, 3, 4]);
    });
  });

  it("rejects unknown case ids instead of silently changing coverage", () => {
    expect(() => selectLongRunSoakCases({ caseIds: ["missing-case"] })).toThrow("Unknown soak case");
  });
});
