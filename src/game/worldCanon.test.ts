import { describe, expect, it } from "vitest";
import { parseTimelineTurn } from "./schema";
import { buildWorldCanon, consequenceContradictsCanon, endingConsequencePreservesCanon } from "./worldCanon";
import { turnFixture } from "../test/fixtures";
import { CHAPTER_NAMES, getTimelineNode, type DecisionChapter } from "./timelinePlan";
import type { PlayedTurn } from "./prompts";

const turn = parseTimelineTurn(JSON.stringify(turnFixture));

function customPlayed(chapter: DecisionChapter): PlayedTurn {
  const node = getTimelineNode(chapter, 208);
  const chapterTurn = parseTimelineTurn(JSON.stringify({
    ...turnFixture,
    chapter,
    chapterName: CHAPTER_NAMES[chapter],
    protagonistAge: node.protagonistAge,
    lifeStage: node.lifeStage,
    previousEcho: chapter === 1 ? null : turnFixture.choices[0].instantEcho,
  }));
  const result = `第${chapter}幕玩家钦定结果已经发生`;
  return {
    turn: chapterTurn,
    selectedChoiceId: "custom",
    selectedChoiceLabel: result,
    selectedDeviationClass: "rupture",
    resolvedEcho: { ...chapterTurn.choices[2].instantEcho, directResult: result },
    playerAuthored: true,
    canonStatus: "玩家钦定",
    causalMechanism: `第${chapter}幕命令进入官署执行`,
  };
}

describe("open causal canon", () => {
  it("stores decisions as facts without assigning a plot category", () => {
    const canon = buildWorldCanon([{
      turn,
      selectedChoiceId: "A",
      selectedChoiceLabel: "提前放出火船",
      selectedDeviationClass: "nudge",
      resolvedEcho: turn.choices[0].instantEcho,
    }]);
    expect(canon.immutableFacts[0]).toMatchObject({ text: "提前放出火船", playerAuthored: false });
    expect(canon.immutableFacts[0]).not.toHaveProperty("kind");
    expect(canon.activeMandates).toEqual([]);
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

  it("keeps five rewrites immutable while activating at most the previous three", () => {
    const turns = [1, 2, 3, 4, 5].map((chapter) => customPlayed(chapter as DecisionChapter));
    const canon = buildWorldCanon(turns, 6);

    expect(canon.immutableFacts.map((fact) => fact.chapter)).toEqual([1, 2, 3, 4, 5]);
    expect(canon.activeMandates.map((mandate) => mandate.sourceChapter)).toEqual([3, 4, 5]);
    expect(canon.activeMandates).toHaveLength(3);
  });

  it("does not spend the player-authored mandate budget on ordinary choices", () => {
    const canon = buildWorldCanon([{
      turn,
      selectedChoiceId: "A",
      selectedChoiceLabel: "提前放出火船",
      selectedDeviationClass: "nudge",
      resolvedEcho: turn.choices[0].instantEcho,
    }], 2);

    expect(canon.activeMandates).toEqual([]);
  });

  it("accepts later overthrow but rejects retroactive failure", () => {
    expect(endingConsequencePreservesCanon("我成为新皇帝", "我成为新皇帝，三年后被联军推翻")).toBe(true);
    expect(endingConsequencePreservesCanon("我成为新皇帝", "我成为新皇帝，但其实并未成为皇帝")).toBe(false);
  });

  it("rejects an anchored contradiction without confusing an enemy failure for player failure", () => {
    expect(consequenceContradictsCanon("我成为新皇帝", "你并未成为皇帝，旧君仍在位")).toBe(true);
    expect(consequenceContradictsCanon("我成为新皇帝", "敌军的刺杀计划最终失败，新朝因此更稳固")).toBe(false);
  });
});
