import { describe, expect, it } from "vitest";
import { getFixedOpening } from "../data/fixedOpenings";
import { browseHistorySeeds } from "../data/historySeeds";
import { buildSoakCustomOutcome, LONG_RUN_SOAK_CASES } from "./soakCases";

describe("soak custom outcomes", () => {
  it("never treats a random place anchor as a person, army, or ally", () => {
    const seed = browseHistorySeeds().find((candidate) => candidate.id === "xuanwu-gate-626")!;
    const turn = {
      ...getFixedOpening(seed),
      historicalAnchors: ["朱雀大街", "太极宫"],
    };

    const outcomes = Array.from({ length: 10 }, (_, customIndex) => buildSoakCustomOutcome(
      LONG_RUN_SOAK_CASES[0],
      0,
      customIndex,
      turn,
      seed,
    ));

    expect(outcomes.join("\n")).not.toMatch(/控制朱雀大街|解除朱雀大街的武装|与朱雀大街正式结盟/);
    expect(new Set(outcomes)).toHaveLength(10);
  });
});
