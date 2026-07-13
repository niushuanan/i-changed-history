import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { parseTimelineTurn } from "./schema";
import { createFallbackCustomActionResolution } from "./fallbackTurn";
import { turnFixture } from "../test/fixtures";

const scenario = {
  seed: HISTORY_SEEDS[0],
};

describe("deterministic player canon receipt", () => {
  it("preserves a declared successful result when the model receipt drifts", () => {
    const resolution = createFallbackCustomActionResolution(
      scenario,
      parseTimelineTurn(JSON.stringify(turnFixture)),
      "我暗杀了皇帝且成功",
    );
    expect(resolution).toMatchObject({
      declaredOutcome: "我暗杀了皇帝且成功",
      canonStatus: "玩家钦定",
      deviationClass: "rupture",
    });
    expect(JSON.stringify(resolution)).not.toContain("失败");
  });
});
