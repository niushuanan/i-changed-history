import { describe, expect, it } from "vitest";
import { DECISION_NODE_COUNT, TOTAL_NODE_COUNT, getTimelinePlan } from "./timelinePlan";

describe("authoritative single-life twelve-node timeline", () => {
  it("contains twelve decisions and keeps 2026 outside the playable timeline", () => {
    const plan = getTimelinePlan(208);
    expect(TOTAL_NODE_COUNT).toBe(12);
    expect(DECISION_NODE_COUNT).toBe(12);
    expect(plan).toHaveLength(12);
    expect(plan.every((node) => node.kind === "decision")).toBe(true);
    expect(plan.at(-1)).toMatchObject({ chapter: 12, chapterName: "生命终章", lifeStage: "生命终章" });
    expect(plan.at(-1)?.targetYear).toBeLessThan(2026);
  });

  it("starts with tight feedback and ages one protagonist through a complete life", () => {
    const plan = getTimelinePlan(1600);
    expect(plan.slice(0, 3).map((node) => node.jumpLabel)).toEqual(["命运当日", "三日后", "六周后"]);
    expect(plan.slice(0, 3).map((node) => node.targetYear)).toEqual([1600, 1600, 1600]);
    expect(plan[0].protagonistAge).toBe(24);
    expect(plan.at(-1)?.protagonistAge).toBe(70);
    expect(plan.every((node, index) => index === 0 || node.protagonistAge >= plan[index - 1].protagonistAge)).toBe(true);
    expect(plan.every((node, index) => index === 0 || node.targetYear >= plan[index - 1].targetYear)).toBe(true);
  });

  it("compresses a modern life so death still precedes the 2026 report", () => {
    const plan = getTimelinePlan(1989);
    expect(plan[0].protagonistAge).toBe(34);
    expect(plan.at(-1)).toMatchObject({ targetYear: 2025, protagonistAge: 70 });
    expect(plan.every((node) => node.targetYear <= 2025)).toBe(true);
  });
});
