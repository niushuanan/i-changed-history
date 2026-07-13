import { describe, expect, it } from "vitest";
import { parseTimelineTurn } from "./schema";
import { buildWorldCanon, endingConsequencePreservesCanon } from "./worldCanon";
import { turnFixture } from "../test/fixtures";

const turn = parseTimelineTurn(JSON.stringify(turnFixture));

describe("open causal canon", () => {
  it("stores decisions as facts without assigning a plot category", () => {
    const canon = buildWorldCanon([{
      turn,
      selectedChoiceId: "A",
      selectedChoiceLabel: "提前放出火船",
      selectedDeviationClass: "nudge",
      resolvedEcho: turn.choices[0].instantEcho,
    }]);
    expect(canon.activeMandates[0]).toMatchObject({ sourceText: "提前放出火船", directResult: "曹军左翼提前起火" });
    expect(canon.activeMandates[0]).not.toHaveProperty("kind");
    expect(canon.activeMandates[0]).not.toHaveProperty("requiredEvidence");
  });

  it("keeps a direct rewrite exact and active for the next three nodes", () => {
    const canon = buildWorldCanon([{
      turn,
      selectedChoiceId: "custom",
      selectedChoiceLabel: "我成为新皇帝",
      selectedDeviationClass: "rupture",
      resolvedEcho: { ...turn.choices[2].instantEcho, directResult: "我成为新皇帝" },
      playerAuthored: true,
      canonStatus: "玩家钦定",
      causalMechanism: "登基诏书进入官署",
    }]);
    expect(canon.immutableFacts[0]).toMatchObject({ text: "我成为新皇帝", canonStatus: "玩家钦定" });
    expect(canon.activeMandates[0]).toMatchObject({ activeThroughChapter: 4, propagationMechanism: "登基诏书进入官署" });
  });

  it("accepts later overthrow but rejects retroactive failure", () => {
    expect(endingConsequencePreservesCanon("我成为新皇帝", "我成为新皇帝，三年后被联军推翻")).toBe(true);
    expect(endingConsequencePreservesCanon("我成为新皇帝", "我成为新皇帝，但其实并未成为皇帝")).toBe(false);
  });
});
