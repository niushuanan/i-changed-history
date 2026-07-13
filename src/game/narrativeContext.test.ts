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
    narrative: `这是第${chapter}幕不应进入下轮上下文的现场正文。`,
    previousEcho: chapter === 1 ? null : turnFixture.choices[0].instantEcho,
    causalLedger: [{ fact: `第${chapter}幕仍生效的事实`, causedByChapter: chapter, mustAffect: `第${chapter + 1}幕` }],
  }));
  const selectedChoiceLabel = custom && chapter === 2 ? "我成为新皇帝，且登基诏已颁布" : `第${chapter}幕决定`;
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
      sourceText: "我成为新皇帝，且登基诏已颁布",
      propagationMechanism: "登基诏通过驿站与官署进入全国",
    }]);
    expect(context.latestDecision?.decision).toBe("第4幕决定");
    expect(context.persistentLedger).toEqual(turns[3].turn.causalLedger);
    expect(context.recentScenes).toHaveLength(3);
  });
});
