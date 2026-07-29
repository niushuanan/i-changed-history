import { describe, expect, it } from "vitest";
import {
  POWER_CATALOGUE,
  createPowerRun,
  createScenarioPowerRun,
  drawPowerIds,
  getPowerDefinition,
  powerPrompt,
} from "./powers";

describe("superpower catalogue", () => {
  it("owns exactly fifty concrete and distinct powers", () => {
    expect(POWER_CATALOGUE).toHaveLength(50);
    expect(new Set(POWER_CATALOGUE.map((power) => power.id))).toHaveProperty("size", 50);
    expect(new Set(POWER_CATALOGUE.map((power) => power.name))).toHaveProperty("size", 50);
    expect(new Set(POWER_CATALOGUE.map((power) => power.rule))).toHaveProperty("size", 50);
    POWER_CATALOGUE.forEach((power) => {
      expect(power.rule.length).toBeGreaterThanOrEqual(12);
      expect(`${power.name}${power.rule}`).not.toMatch(/让谎言现形|唤醒器物作证|改变历史走向|重塑秩序/);
    });
  });

  it("draws without replacement and can be replayed from persisted deck state", () => {
    const run = createPowerRun(() => 0.42);
    const first = drawPowerIds(run.remainingPowerIds, 2);
    const second = drawPowerIds(first.remainingPowerIds, 1);

    expect(first.drawnPowerIds).toHaveLength(2);
    expect(second.drawnPowerIds).toHaveLength(1);
    expect(new Set([...first.drawnPowerIds, ...second.drawnPowerIds])).toHaveProperty("size", 3);
    expect(second.remainingPowerIds).toHaveLength(47);
    expect(getPowerDefinition(first.drawnPowerIds[0]).id).toBe(first.drawnPowerIds[0]);
  });

  it("draws the first two powers from the scene pool and removes them from the run deck", () => {
    const candidates = POWER_CATALOGUE.slice(0, 6).map((power) => power.id);
    const run = createScenarioPowerRun(candidates, () => 0.25);

    expect(run.openingPowerIds).toHaveLength(2);
    expect(run.openingPowerIds.every((powerId) => candidates.includes(powerId))).toBe(true);
    expect(new Set(run.openingPowerIds)).toHaveProperty("size", 2);
    expect(run.usedPowerIds).toEqual(run.openingPowerIds);
    expect(run.remainingPowerIds).toHaveLength(48);
    expect(run.remainingPowerIds).not.toContain(run.openingPowerIds[0]);
    expect(run.remainingPowerIds).not.toContain(run.openingPowerIds[1]);
  });

  it("tells the model to make the impossible effect itself decisive", () => {
    expect(getPowerDefinition("extinguish-fire").rule).toContain("方圆十里");
    expect(
      POWER_CATALOGUE.find((power) => power.id === "extinguish-fire"),
    ).toBeDefined();
    expect(powerPrompt("extinguish-fire").instruction).toContain(
      "决定胜负的核心动作必须就是普通人绝不可能做到的能力效果",
    );
  });
});
