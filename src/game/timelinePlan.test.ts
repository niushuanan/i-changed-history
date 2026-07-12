import { describe, expect, it } from "vitest";
import { DECISION_NODE_COUNT, TOTAL_NODE_COUNT, getTimelinePlan } from "./timelinePlan";

describe("authoritative twelve-node timeline", () => {
  it("contains eleven decisions followed by the 2026 summary", () => {
    const plan = getTimelinePlan(208);
    expect(TOTAL_NODE_COUNT).toBe(12);
    expect(DECISION_NODE_COUNT).toBe(11);
    expect(plan).toHaveLength(12);
    expect(plan.slice(0, 11).every((node) => node.kind === "decision")).toBe(true);
    expect(plan[11]).toMatchObject({ kind: "summary", targetYear: 2026, chapterName: "平行 2026" });
  });

  it("uses the requested expanding time scale", () => {
    const plan = getTimelinePlan(1600);
    expect(plan.map((node) => node.jumpLabel)).toEqual([
      "历史现场", "一天后", "一个月后", "一年后", "三年后", "十年后",
      "三十年后", "一百年后", "跨时代", "新世界", "2026 前夕", "2026",
    ]);
    expect(plan.slice(3).map((node) => node.targetYear)).toEqual(expect.arrayContaining([1601, 1603, 1610, 1630, 1700, 2026]));
    expect(plan.every((node, index) => index === 0 || node.targetYear >= plan[index - 1].targetYear)).toBe(true);
  });

  it("compresses modern timelines without passing 2026", () => {
    for (const startYear of [1914, 1962, 1989]) {
      const plan = getTimelinePlan(startYear);
      expect(plan.at(-1)?.targetYear).toBe(2026);
      expect(plan.every((node) => node.targetYear <= 2026)).toBe(true);
      expect(plan.every((node, index) => index === 0 || node.targetYear >= plan[index - 1].targetYear)).toBe(true);
      expect(plan[10].targetYear).toBeLessThan(2026);
    }
    expect(getTimelinePlan(1962)[7].targetYear).toBe(1988);
    expect(getTimelinePlan(1989)[7].targetYear).toBe(2004);
  });
});
