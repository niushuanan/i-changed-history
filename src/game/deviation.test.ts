import { describe, expect, it } from "vitest";
import {
  calculateDeviation,
  calculateStepImpact,
  getDeviationStage,
} from "./deviation";
import type { DecisionChapter } from "./timelinePlan";

describe("deterministic historical deviation", () => {
  it("applies the fixed impact table and chapter multipliers", () => {
    expect(calculateStepImpact("nudge", 1)).toBe(3);
    expect(calculateStepImpact("reform", 2)).toBe(12);
    expect(calculateStepImpact("rupture", 5)).toBe(35);
  });

  it("keeps every one of the twelve decision nodes finite and progressively weightier", () => {
    const impacts = Array.from({ length: 12 }, (_, index) =>
      calculateStepImpact("reform", (index + 1) as DecisionChapter),
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
    [0, "变化刚刚发生"],
    [9, "变化刚刚发生"],
    [10, "影响正在扩大"],
    [29, "影响正在扩大"],
    [30, "历史明显不同"],
    [54, "历史明显不同"],
    [55, "世界正在重塑"],
    [79, "世界正在重塑"],
    [80, "已是全新世界"],
    [100, "已是全新世界"],
  ] as const)("maps %i to %s", (value, label) => {
    expect(getDeviationStage(value).label).toBe(label);
  });
});
