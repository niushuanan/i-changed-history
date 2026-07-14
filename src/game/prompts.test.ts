import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import { buildBiographyMessages, buildContinuationMessages, buildWorldReportMessages } from "./prompts";
import type { PlayedTurn } from "./prompts";
import type { GameScenario } from "./reducer";
import { CHAPTER_NAMES, getTimelineNode, type DecisionChapter } from "./timelinePlan";

const scenario: GameScenario = {
  seed: HISTORY_SEEDS.find((seed) => seed.id === "sarajevo-1914")!,
};

function customHistory(count: number): PlayedTurn[] {
  return Array.from({ length: count }, (_, index) => {
    const chapter = (index + 1) as DecisionChapter;
    const node = getTimelineNode(chapter, scenario.seed.year);
    const chapterTurn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter,
      chapterName: CHAPTER_NAMES[chapter],
      protagonistAge: node.protagonistAge,
      lifeStage: node.lifeStage,
      previousEcho: chapter === 1 ? null : turnFixture.choices[0].instantEcho,
    }));
    const result = `第${chapter}幕玩家改写已经成为正史`;
    return {
      turn: chapterTurn,
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: result,
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: { ...chapterTurn.choices[2].instantEcho, directResult: result },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: `第${chapter}幕命令经驿站进入官署`,
    };
  });
}

describe("modern traveler AI prompt contract", () => {
  it("grounds the continuation in the selected fixed opening without a personality profile", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 2);
    const body = continuation.at(-1)!.content;
    const protocol = continuation[1].content;
    expect(body).toContain("萨拉热窝刺杀");
    expect(body).toContain("塞尔维亚总理大臣帕希奇的特别联络员");
    expect(body).toContain("距离车队再次经过拉丁桥约 8 分钟");
    expect(body).not.toContain('"dimensions"');
    expect(body).not.toContain("INTP");
    expect(body).not.toContain("因果侦探");
    expect(body).toContain("没有固定人格");
    expect(protocol).toContain("role");
    expect(protocol).toContain("immediateObjective");
    expect(protocol).toContain("timePressure");
  });

  it("keeps one identical turn protocol prefix for DeepSeek context caching", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 2);
    const laterContinuation = buildContinuationMessages(scenario, played, 3);

    expect(continuation).toHaveLength(3);
    expect(laterContinuation).toHaveLength(3);
    expect(continuation[0]).toEqual(laterContinuation[0]);
    expect(continuation[1]).toEqual(laterContinuation[1]);
    expect(continuation[1].content).toContain("requiredFields");
    expect(continuation[2].content).not.toContain("exactShapeExample");
  });

  it("serializes one compact narrative context instead of duplicated histories", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuationMessages = buildContinuationMessages(scenario, played, 8);
    const continuation = continuationMessages.at(-1)!.content;
    const protocol = continuationMessages[1].content;
    const biography = buildBiographyMessages(scenario, Array(12).fill(played[0])).at(-1)!.content;
    const worldReport = buildWorldReportMessages(scenario, Array(12).fill(played[0])).at(-1)!.content;
    expect(continuation).toContain('"narrativeContext"');
    expect(continuation).toContain('"lifeIndex"');
    expect(continuation).toContain('"activeConsequences"');
    expect(continuation).toContain('"playerCanon"');
    expect(continuation).not.toContain('"playedHistory"');
    expect(continuation).not.toContain('"authoritativeWorldCanon"');
    expect(biography).not.toContain("customIntervention");
    expect(worldReport).not.toContain("customIntervention");
    expect(continuation).toContain(turnFixture.choices[0].label);
    expect(continuation).toContain("盛年危局");
    expect(continuation).toContain("1927");
    expect(biography).toContain("十二次选择");
    expect(worldReport).toContain("2026");
  });

  it("gives the two concurrent ending writers disjoint output ownership", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = Array(12).fill({ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho });
    const biography = buildBiographyMessages(scenario, played).at(-1)!.content;
    const worldReport = buildWorldReportMessages(scenario, played).at(-1)!.content;

    expect(biography).toContain("vernacularBiography");
    expect(biography).toContain("historyTimeline");
    expect(biography).not.toContain("ordinaryLife2026");
    expect(worldReport).toContain("ordinaryLife2026");
    expect(worldReport).toContain("posthumousChronicle");
    expect(worldReport).toContain("narrative 为 35-96 个汉字");
    expect(worldReport).toContain("inheritedChange 为 18-64 个汉字");
    expect(worldReport).toContain("不得截断句子来满足字数");
    expect(worldReport).not.toContain("vernacularBiography");
  });

  it("asks for three concise complete ordinary-life sentences", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = Array(12).fill({ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho });
    const worldReport = buildWorldReportMessages(scenario, played).at(-1)!.content;

    expect(worldReport).toContain("恰好三个互不重复");
    expect(worldReport).toContain("每项 12—18 字");
    expect(worldReport).toContain("完整生活短句");
  });

  it("forces one aging protagonist through butterfly-effect topic changes", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuationMessages = buildContinuationMessages(scenario, played, 8);
    const continuation = continuationMessages.at(-1)!.content;
    const protocol = continuationMessages[1].content;

    expect(continuation).toContain("authoritativeProtagonist.name 本人");
    expect(continuation).toContain("禁止换身体、转生、意识接力");
    expect(continuation).toContain("原始历史事件不得继续作为本幕主题");
    expect(continuation).toContain("不要从预设类别、通用模板或固定章节槽中选题");
    expect(continuation).toContain("一阶、二阶和三阶后果");
    expect(protocol).toContain("usesModernKnowledge");
    expect(protocol).toContain("完整 JSON 控制在 900 个汉字左右");
    expect(continuation).not.toContain("authoritativePivotalBrief");
    expect(protocol).toContain("historicalAnchors");
    expect(protocol).toContain("actionSpec");
    expect(protocol).not.toContain("rippleLens");
    expect(protocol).not.toContain("timelineName");
    expect(protocol).not.toContain("identityBridge");
    expect(protocol).not.toContain("modernAdvantage");
    expect(protocol).not.toContain("metricDeltas");
    expect(protocol).not.toContain("callbackUsed");
    expect(protocol).toContain("causalBridge");
    expect(protocol).toContain("议事厅");
    expect(protocol).toContain("时代真实称谓");
  });

  it("treats every continuation as a major turning point with a visible alternate-world payoff", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{
      turn: parsedTurn,
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: "我成为新皇帝，并设立国家科学院大力发展科技",
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: {
        directResult: "我成为新皇帝，并设立国家科学院大力发展科技",
        unexpectedCost: "旧贵族联合抵制新税",
        beneficiary: "进入科学院的工匠",
        payer: "失去垄断的世袭贵族",
      },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "登基诏书和科学院预算进入官署执行",
    }];
    const continuationMessages = buildContinuationMessages(scenario, played, 2);
    const continuation = continuationMessages.at(-1)!.content;
    const protocol = continuationMessages[1].content;

    expect(continuation).toContain("不可撤销正史");
    expect(continuation).toContain("我成为新皇帝，并设立国家科学院大力发展科技");
    expect(continuation).toContain("重大转折点");
    expect(protocol).toContain("worldStateChange");
    expect(protocol).toContain("divergenceProof");
    expect(continuation).toContain("自行选择其中最意外、最重大");
    expect(continuation).toContain("不得否认、降级、反转");
    expect(continuation).toContain("尤其不得遗漏 timePressure、historicalAnchors");
    const continuationPayload = JSON.parse(continuation);
    expect(continuationPayload.latestPlayerFactForThisScene).toMatchObject({
      status: "已经发生，不可否认或弱化",
      sourceText: "我成为新皇帝，并设立国家科学院大力发展科技",
    });
  });

  it("keeps all rewrites immutable but injects only three active mandates into the current turn", () => {
    const continuation = buildContinuationMessages(scenario, customHistory(5), 6);
    const payload = JSON.parse(continuation.at(-1)!.content);

    expect(payload.narrativeContext.playerCanon).toHaveLength(5);
    expect(payload.narrativeContext.activePlayerCanon.map((item: { chapter: number }) => item.chapter))
      .toEqual([3, 4, 5]);
    expect(payload.task).toContain("activePlayerCanon");
    expect(payload.task).not.toContain("对 narrativeContext.playerCanon 的每项玩家正史：causalLedger");
  });

  it("prefers familiar Chinese anchors without forcing a geographic jump", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 8).at(-1)!.content;

    expect(continuation).toContain("允许留在同一地区");
    expect(continuation).toContain("中国玩家；先给熟悉的真实历史锚点");
    expect(continuation).toContain("不能总围绕同一事件、同一敌人、同一任务");
    expect(continuation).not.toContain("第 8 节点起优先跨地域或跨领域");
  });

  it("keeps generated display copy concise without lowering transport headroom", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const protocol = buildContinuationMessages(scenario, played, 2)[1].content;
    expect(protocol).toContain("完整 JSON 控制在 900 个汉字左右");
    expect(protocol).toContain("80-180 个汉字");
    expect(protocol).toContain("绝不超过 180 字");
    expect(protocol).not.toContain("80-160 个汉字");
    expect(protocol).toContain("二至五句");
    expect(protocol).toContain("上一项决定如何造成当前局面");
    expect(protocol).toContain("真实人物、机构或阵营");
    expect(protocol).toContain("失败会立即失去什么");
    expect(protocol).toContain("只写真实历史的对应结果");
    expect(protocol).toContain('"causalBridge":"24-30 字的单个完整短句');
    expect(protocol).toContain("不要使用逗号或分号");
    expect(protocol).toContain('"worldStateChange":"30 字以内');
    expect(protocol).toContain('"divergenceProof":"42 字以内');
    expect(protocol).toContain("每个短字段必须以完整短句收尾");
    expect(protocol).toContain("目标年份仍在世、在任或确实存在");
    expect(protocol).toContain("每个 label 18-30 字");
    expect(protocol).toContain("禁止以“的、并、试图、计划、平衡、处理、推进”等悬空词结尾");
    expect(protocol).not.toContain('"intent"');
    expect(protocol).toContain("clientOwnedFields");
    expect(protocol).toContain("禁止输出");
  });

  it("forbids reusing a recent scene headline", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 2).at(-1)!.content;

    expect(continuation).toContain("本幕标题不得与 recentScenes 最近三幕中的任何标题逐字相同");
    expect(continuation).toContain("至少逐字写出一个核心人物、制度、地点、器物或动作名");
  });

});
