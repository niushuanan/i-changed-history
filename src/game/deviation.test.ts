import { describe, expect, it } from "vitest";
import {
  calculateDeviation,
  calculateStepImpact,
  getDeviationStage,
} from "./deviation";

describe("deterministic historical deviation", () => {
  it("applies the fixed impact table and chapter multipliers", () => {
    expect(calculateStepImpact("nudge", 1)).toBe(3);
    expect(calculateStepImpact("reform", 2)).toBe(12);
    expect(calculateStepImpact("rupture", 5)).toBe(35);
  });

  it("keeps every one of the eleven decision nodes finite and progressively weightier", () => {
    const impacts = Array.from({ length: 11 }, (_, index) =>
      calculateStepImpact("reform", (index + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11),
    );

    expect(impacts.every(Number.isFinite)).toBe(true);
    expect(impacts).toEqual([...impacts].sort((left, right) => left - right));
    expect(calculateDeviation(48, "rupture", 11).nextDeviation).toBeGreaterThan(48);
  });

  it("compounds impact instead of adding scores", () => {
    expect(calculateDeviation(10, "reform", 2)).toEqual({
      stepImpact: 12,
      nextDeviation: 21,
    });
    expect(calculateDeviation(100, "nudge", 1).nextDeviation).toBe(100);
  });

  it.each([
    [0, "原史余波"],
    [9, "原史余波"],
    [10, "蝴蝶分岔"],
    [29, "蝴蝶分岔"],
    [30, "新世界线"],
    [54, "新世界线"],
    [55, "时代重写"],
    [79, "时代重写"],
    [80, "完全异史"],
    [100, "完全异史"],
  ] as const)("maps %i to %s", (value, label) => {
    expect(getDeviationStage(value).label).toBe(label);
  });
});
