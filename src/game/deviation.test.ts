import { describe, expect, it } from "vitest";
import {
  calculateDeviation,
  calculateStepImpact,
  getDeviationStage,
} from "./deviation";
import type { DecisionChapter } from "./timelinePlan";

describe("deterministic historical deviation", () => {
  it("applies the fixed impact table and chapter multipliers", () => {
    expect(calculateStepImpact("nudge", 1)).toBe(0);
    expect(calculateStepImpact("reform", 2)).toBe(14);
    expect(calculateStepImpact("rupture", 4)).toBe(48);
  });

  it("keeps all four decisions finite and progressively weightier", () => {
    const impacts = Array.from({ length: 4 }, (_, index) =>
      calculateStepImpact("reform", (index + 1) as DecisionChapter),
    );

    expect(impacts.every(Number.isFinite)).toBe(true);
    expect(impacts).toEqual([...impacts].sort((left, right) => left - right));
    expect(calculateDeviation(48, "rupture", 4).nextDeviation).toBeGreaterThan(48);
  });

  it("compounds impact instead of adding scores", () => {
    expect(calculateDeviation(10, "reform", 2)).toEqual({
      stepImpact: 14,
      nextDeviation: 23,
    });
    expect(calculateDeviation(0, "nudge", 1)).toEqual({
      stepImpact: 0,
      nextDeviation: 0,
    });
    expect(calculateDeviation(48, "nudge", 4)).toEqual({
      stepImpact: 0,
      nextDeviation: 48,
    });
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
