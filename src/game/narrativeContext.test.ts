import { describe, expect, it } from "vitest";
import { turnFixture } from "../test/fixtures";
import { CHAPTER_NAMES, getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { parseTimelineTurn } from "./schema";
import type { PlayedTurn } from "./prompts";
import { buildNarrativeContext } from "./narrativeContext";

function played(chapter: DecisionChapter, custom = false): PlayedTurn {
  const node = getTimelineNode(chapter, 208);
  const turn = parseTimelineTurn(JSON.stringify({
    ...turnFixture,
    chapter,
    chapterName: CHAPTER_NAMES[chapter],
    protagonistAge: node.protagonistAge,
    lifeStage: node.lifeStage,
    yearLabel: `${node.targetYear}年 · ${node.protagonistAge}岁`,
    headline: `第${chapter}幕重大冲突`,
    narrative: `第${chapter}幕此前的决定已经沿驿站与官署扩散，各地守军因此改变了原有部署。真实人物与地方机构正围绕新命令争夺粮册、兵符和城门控制权。你握有本幕唯一有效的调令，必须在日落前决定交给哪一方，否则冲突会立即演变成兵变。`,
    previousEcho: chapter === 1 ? null : turnFixture.choices[0].instantEcho,
    causalLedger: [{ fact: `第${chapter}幕仍生效的事实`, causedByChapter: chapter, mustAffect: `第${chapter + 1}幕` }],
  }));
  const selectedChoiceLabel = custom ? `第${chapter}幕玩家钦定结果已经发生` : `第${chapter}幕决定`;
  return {
    turn,
    selectedChoiceId: custom ? "custom" : "A",
    selectedChoiceLabel,
    selectedDeviationClass: custom ? "rupture" : "nudge",
    resolvedEcho: {
      directResult: selectedChoiceLabel,
      unexpectedCost: `第${chapter}幕代价`,
      beneficiary: `第${chapter}幕受益者`,
      payer: `第${chapter}幕承担者`,
    },
    ...(custom ? {
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "登基诏通过驿站与官署进入全国",
    } : {}),
  };
}

describe("compact narrative context", () => {
  it("keeps every decision while detailing only the latest three consequences", () => {
    const turns = Array.from({ length: 8 }, (_, index) => played((index + 1) as DecisionChapter));
    const context = buildNarrativeContext(turns);

    expect(context.lifeIndex).toHaveLength(8);
    expect(context.lifeIndex.map((item) => item.decision)).toEqual(turns.map((item) => item.selectedChoiceLabel));
    expect(context.activeConsequences).toHaveLength(3);
    expect(context.activeConsequences.map((item) => item.chapter)).toEqual([6, 7, 8]);
    expect(JSON.stringify(context)).not.toContain(turns[0].turn.narrative);
  });

  it("preserves every direct rewrite verbatim and carries the latest persistent ledger", () => {
    const turns = [played(1), played(2, true), played(3), played(4)];
    const context = buildNarrativeContext(turns);

    expect(context.playerCanon).toEqual([{
      chapter: 2,
      sourceText: "第2幕玩家钦定结果已经发生",
      propagationMechanism: "登基诏通过驿站与官署进入全国",
    }]);
    expect(context.latestDecision?.decision).toBe("第4幕决定");
    expect(context.persistentLedger).toEqual(turns[3].turn.causalLedger);
    expect(context.recentScenes).toHaveLength(3);
  });

  it("injects only the previous three player rewrites as active current mandates", () => {
    const turns = [1, 2, 3, 4, 5].map((chapter) => played(chapter as DecisionChapter, true));
    const context = buildNarrativeContext(turns, 6);

    expect(context.playerCanon).toHaveLength(5);
    expect(context.activePlayerCanon.map((item) => item.chapter)).toEqual([3, 4, 5]);
    expect(context.activePlayerCanon.map((item) => item.sourceText)).toEqual([
      "第3幕玩家钦定结果已经发生",
      "第4幕玩家钦定结果已经发生",
      "第5幕玩家钦定结果已经发生",
    ]);
  });
});
