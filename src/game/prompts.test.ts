import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import {
  buildBiographyMessages,
  buildContinuationMessages,
  buildRerollMessages,
  buildWorldReportMessages,
} from "./prompts";
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
    expect(body).toContain("司机没有被清楚告知更改后的路线");
    expect(body).not.toContain('"dimensions"');
    expect(body).not.toContain("INTP");
    expect(body).not.toContain("因果侦探");
    expect(body).not.toContain("人格");
    expect(protocol).toContain("地点");
    expect(protocol).toContain("身份");
    expect(protocol).toContain("期限");
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
    expect(continuation[1].content).toContain('"shape"');
    expect(continuation[1].content).toContain('"example"');
    expect(continuation[2].content).not.toContain('"example"');
  });

  it("serializes one compact narrative context instead of duplicated histories", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuationMessages = buildContinuationMessages(scenario, played, 4);
    const continuation = continuationMessages.at(-1)!.content;
    const protocol = continuationMessages[1].content;
    const biography = buildBiographyMessages(scenario, Array(4).fill(played[0])).at(-1)!.content;
    const worldReport = buildWorldReportMessages(scenario, Array(4).fill(played[0])).at(-1)!.content;
    expect(continuation).toContain('"context"');
    expect(continuation).toContain('"life"');
    expect(continuation).toContain('"recentConsequences"');
    expect(continuation).toContain('"activeCanon"');
    expect(continuation).not.toContain('"playedHistory"');
    expect(continuation).not.toContain('"authoritativeWorldCanon"');
    expect(continuation).not.toContain('"playerCanon"');
    expect(biography).not.toContain("customIntervention");
    expect(worldReport).not.toContain("customIntervention");
    expect(continuation).toContain(turnFixture.choices[0].label);
    expect(continuation).toContain("生命终章");
    expect(continuation).toContain(String(getTimelineNode(4, scenario.seed.year).targetYear));
    expect(biography).toContain("四次选择");
    expect(worldReport).toContain("2026");
  });

  it("gives the two concurrent ending writers disjoint output ownership", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = Array(4).fill({ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho });
    const biography = buildBiographyMessages(scenario, played).at(-1)!.content;
    const worldReport = buildWorldReportMessages(scenario, played).at(-1)!.content;

    expect(biography).toContain("必须以以下格式输出");
    expect(biography).toContain("一生纪事");
    expect(biography).toContain("自然普通话");
    expect(biography).toContain("纯地点（不含年份、年龄或分隔符）");
    expect(biography).not.toContain("文言列传");
    expect(biography).not.toContain("第一幕后果");
    expect(biography).not.toContain("ordinaryLife2026");
    expect(worldReport).toContain("必须以以下格式输出");
    expect(worldReport).toContain("生活句");
    expect(worldReport).toContain("时代叙事");
    expect(worldReport).toContain("时代叙事18-30字");
    expect(worldReport).toContain("继承结果10-18字");
    expect(worldReport).not.toContain('"b"');
    expect(worldReport).not.toContain("一生纪事");
  });

  it("asks for three concise complete ordinary-life sentences", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = Array(4).fill({ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho });
    const worldReport = buildWorldReportMessages(scenario, played).at(-1)!.content;

    expect(worldReport).toContain("o 恰好三项");
    expect(worldReport).toContain("每项10-24字");
    expect(worldReport).toContain("完整生活句");
    expect(worldReport).toContain("互不重复");
  });

  it("forces one aging protagonist through butterfly-effect topic changes", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuationMessages = buildContinuationMessages(scenario, played, 4);
    const continuation = continuationMessages.at(-1)!.content;
    const protocol = continuationMessages[1].content;

    const payload = JSON.parse(continuation);
    expect(payload.protagonist).toEqual(expect.objectContaining({ name: parsedTurn.protagonistName }));
    expect(payload.node).toMatchObject({ chapter: 4, age: 70, name: "生命终章" });
    expect(continuationMessages[0].content).toContain("不得换身体、转生或由后代接替");
    expect(continuation).toContain("第3幕起，开场事件只作因果源");
    expect(continuation).toContain("推演一阶到三阶影响");
    expect(protocol).toContain("只输出 s、c、r");
    expect(protocol).toContain("s 恰好九项");
    expect(continuation).not.toContain("authoritativePivotalBrief");
    expect(protocol).not.toContain("rippleLens");
    expect(protocol).not.toContain("timelineName");
    expect(protocol).not.toContain("identityBridge");
    expect(protocol).not.toContain("modernAdvantage");
    expect(protocol).not.toContain("metricDeltas");
    expect(protocol).not.toContain("callbackUsed");
    expect(protocol).toContain("因果桥");
    expect(protocol).toContain("地点≤20字且符合年代");
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

    expect(continuation).toContain("承认全部正史");
    expect(continuation).toContain("我成为新皇帝，并设立国家科学院大力发展科技");
    expect(continuation).toContain("重大历史冲突");
    expect(protocol).toContain("架空事实");
    expect(protocol).toContain("正史对照");
    const continuationPayload = JSON.parse(continuation);
    expect(continuationPayload.context.activeCanon[0]).toMatchObject({
      fact: "我成为新皇帝，并设立国家科学院大力发展科技",
      mechanism: "登基诏书和科学院预算进入官署执行",
    });
  });

  it("keeps all rewrites immutable but injects only three active mandates into the current turn", () => {
    const continuation = buildContinuationMessages(scenario, customHistory(3), 4);
    const payload = JSON.parse(continuation.at(-1)!.content);

    expect(payload.context.life).toHaveLength(3);
    expect(payload.context.activeCanon.map((item: { chapter: number }) => item.chapter))
      .toEqual([1, 2, 3]);
    expect(payload.task).toContain("activeCanon");
    expect(payload).not.toHaveProperty("latestPlayerFactForThisScene");
  });

  it("prefers familiar Chinese anchors without forcing a geographic jump", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 4).at(-1)!.content;

    const payload = JSON.parse(continuation);
    expect(payload.task).toContain("使用两个时代准确的具体锚点");
    expect(payload.context.recentScenes).toEqual([
      expect.objectContaining({ headline: parsedTurn.headline, location: parsedTurn.location }),
    ]);
    expect(continuation).not.toContain("必须跨国");
    expect(continuation).not.toContain("第 8 节点起优先跨地域或跨领域");
  });

  it("keeps every AI input inside an explicit compact budget", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = Array(4).fill({ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho });
    const lengths = {
      continuation: buildContinuationMessages(scenario, played.slice(0, 3), 4).reduce((sum, item) => sum + item.content.length, 0),
      reroll: buildRerollMessages(scenario, played.slice(0, 3), parsedTurn, 3, parsedTurn.rollChoices).reduce((sum, item) => sum + item.content.length, 0),
      biography: buildBiographyMessages(scenario, played).reduce((sum, item) => sum + item.content.length, 0),
      world: buildWorldReportMessages(scenario, played).reduce((sum, item) => sum + item.content.length, 0),
    };

    expect(lengths.continuation).toBeLessThanOrEqual(6_500);
    expect(lengths.reroll).toBeLessThanOrEqual(3_500);
    expect(lengths.biography).toBeLessThanOrEqual(2_000);
    expect(lengths.world).toBeLessThanOrEqual(2_200);
  });

  it("forbids reusing a recent scene headline", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 2).at(-1)!.content;

    const payload = JSON.parse(continuation);
    expect(payload.task).toContain("不得套模板或重复近三幕");
    expect(payload.context.recentScenes[0].headline).toBe(parsedTurn.headline);
    expect(payload.task).toContain("产生可见效果");
  });

  it("makes the second and third Rolls live, novel, and scene-preserving", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{
      turn: parsedTurn,
      selectedChoiceId: "A" as const,
      selectedChoiceLabel: parsedTurn.choices[0].label,
      selectedDeviationClass: "nudge" as const,
      resolvedEcho: parsedTurn.choices[0].instantEcho,
    }];
    const messages = buildRerollMessages(scenario, played, parsedTurn, 2, [
      ...parsedTurn.rollChoices,
    ]);
    const payload = JSON.parse(messages.at(-1)!.content);

    expect(payload.task).toContain("第2次 Roll");
    expect(payload.task).toContain("只输出 c");
    expect(payload.task).toContain("C 由你完整使用 assignedPower");
    expect(payload.task).toContain("不同现场杠杆");
    expect(payload.task).toContain("不得写抽象口号");
    expect(payload.assignedPower).toMatchObject({
      name: "百人迁跃",
    });
    expect(payload.assignedPower).not.toHaveProperty("powerId");
    expect(payload.outputContract).toContain("A循史、B破局、C天外");
    expect(payload.outputContract).toContain("actor=你");
    expect(payload.seenCards).toHaveLength(6);
    expect(payload.currentScene.headline).toBe(parsedTurn.headline);
  });

  it("treats the historical snapshot as the source of every generated choice without changing the protocol shape", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{
      turn: parsedTurn,
      selectedChoiceId: "A" as const,
      selectedChoiceLabel: parsedTurn.choices[0].label,
      selectedDeviationClass: "nudge" as const,
      resolvedEcho: parsedTurn.choices[0].instantEcho,
    }];
    const messages = buildContinuationMessages(scenario, played, 2);
    const protocol = messages[1].content;
    const payload = JSON.parse(messages.at(-1)!.content);

    expect(messages).toHaveLength(3);
    expect(protocol).toContain("每张使用不同的现场人物、器物、命令或程序");
    expect(protocol).toContain("两张 C 分别使用 assignedPowers 对应能力");
    expect(protocol).toContain("完整兑现 exactRule");
    expect(protocol).toContain('"shape"');
    expect(protocol).toContain("A循史、B破局、C天外");
    expect(messages[0].content).toContain("A 循史让既有结果按时落地");
    expect(messages[0].content).toContain("牌的结果与代价不得让主角死亡");
    expect(protocol).not.toContain("按原计划出兵");
    expect(protocol).not.toContain("复核后照办");
    expect(payload.task).toContain("选择最意外且主角能亲手介入的重大历史冲突");
    expect(payload.task).toContain("使用两个时代准确的具体锚点");
    expect(payload.assignedPowers.choicesC.name).toBe("带物瞬移");
    expect(payload.assignedPowers.rollChoicesC.name).toBe("停止时间");
    expect(payload.assignedPowers.choicesC).not.toHaveProperty("powerId");
    expect(payload).not.toHaveProperty("submissionChecklist");
    expect(payload).not.toHaveProperty("sceneTrajectoryContract");
  });

});
