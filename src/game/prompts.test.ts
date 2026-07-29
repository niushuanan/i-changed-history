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
    const continuationMessages = buildContinuationMessages(scenario, played, 4);
    const continuation = continuationMessages.at(-1)!.content;
    const protocol = continuationMessages[1].content;
    const biography = buildBiographyMessages(scenario, Array(4).fill(played[0])).at(-1)!.content;
    const worldReport = buildWorldReportMessages(scenario, Array(4).fill(played[0])).at(-1)!.content;
    expect(continuation).toContain('"narrativeContext"');
    expect(continuation).toContain('"lifeIndex"');
    expect(continuation).toContain('"activeConsequences"');
    expect(continuation).toContain('"playerCanon"');
    expect(continuation).not.toContain('"playedHistory"');
    expect(continuation).not.toContain('"authoritativeWorldCanon"');
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
    const played = Array(4).fill({ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho });
    const worldReport = buildWorldReportMessages(scenario, played).at(-1)!.content;

    expect(worldReport).toContain("恰好三个互不重复");
    expect(worldReport).toContain("每项 12—18 字");
    expect(worldReport).toContain("完整生活短句");
    expect(worldReport).toContain("优先写成 12—16 字");
    expect(worldReport).toContain("孩子每天用纸鹤支付早餐费。");
    expect(worldReport).toContain("身后时代 narrative 优先写成 35—88 字");
  });

  it("forces one aging protagonist through butterfly-effect topic changes", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuationMessages = buildContinuationMessages(scenario, played, 4);
    const continuation = continuationMessages.at(-1)!.content;
    const protocol = continuationMessages[1].content;

    expect(continuation).toContain("authoritativeProtagonist.name 本人");
    expect(continuation).toContain("禁止换身体、转生、意识接力");
    expect(continuation).toContain("原始历史事件不得继续作为本幕主题");
    expect(continuation).toContain("不要从预设类别、通用模板或固定章节槽中选题");
    expect(continuation).toContain("一阶、二阶和三阶后果");
    expect(protocol).toContain("usesModernKnowledge");
    expect(protocol).toContain("完整 JSON 控制在 1400 个汉字左右");
    expect(protocol).toContain('"rollChoices"');
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
    expect(continuation).toContain("submissionChecklist");
    expect(continuation).toContain('"choiceIds":["A","B","C"]');
    expect(continuation).toContain("最后一句拥有明确主语、动作与对象");
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
    const continuation = buildContinuationMessages(scenario, customHistory(3), 4);
    const payload = JSON.parse(continuation.at(-1)!.content);

    expect(payload.narrativeContext.playerCanon).toHaveLength(3);
    expect(payload.narrativeContext.activePlayerCanon.map((item: { chapter: number }) => item.chapter))
      .toEqual([1, 2, 3]);
    expect(payload.task).toContain("activePlayerCanon");
    expect(payload.task).not.toContain("对 narrativeContext.playerCanon 的每项玩家正史：causalLedger");
  });

  it("prefers familiar Chinese anchors without forcing a geographic jump", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 4).at(-1)!.content;

    expect(continuation).toContain("允许留在同一地区");
    expect(continuation).toContain("中国玩家；先给熟悉的真实历史锚点");
    expect(continuation).toContain("不能总围绕同一事件、同一敌人、同一任务");
    expect(continuation).not.toContain("第 8 节点起优先跨地域或跨领域");
  });

  it("keeps generated display copy concise without lowering transport headroom", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const protocol = buildContinuationMessages(scenario, played, 2)[1].content;
    expect(protocol).toContain("完整 JSON 控制在 1400 个汉字左右");
    expect(protocol).toContain("55-110 个汉字");
    expect(protocol).toContain("二至三句");
    expect(protocol).toContain("上一决定造成的局面");
    expect(protocol).toContain("一个可见历史锚点");
    expect(protocol).toContain("失败代价");
    expect(protocol).toContain("displayLabel 为牌面标题");
    expect(protocol).toContain("第一次 Roll 的预先准备结果");
    expect(protocol).toContain("经过洗牌动效后发出");
    expect(protocol).toContain("assignedPowers.choicesC");
    expect(protocol).toContain("actionSpec.actor 必须逐字为“你”");
    expect(protocol).toContain("只写真实历史的对应结果");
    expect(protocol).toContain('"causalBridge":"24-30 字的单个完整短句');
    expect(protocol).toContain("不要使用逗号或分号");
    expect(protocol).toContain('"worldStateChange":"30 字以内');
    expect(protocol).toContain('"divergenceProof":"42 字以内');
    expect(protocol).toContain("每个短字段必须以完整短句收尾");
    expect(protocol).toContain("目标年份仍在世、在任或确实存在");
    expect(protocol).toContain("label 为完整决定");
    expect(protocol).toContain("每张 displayLabel 为牌面标题，也是自然的动宾短语，4-12 个汉字");
    expect(protocol).toContain("所有字段值面向中国玩家，必须使用自然中文");
    expect(protocol).toContain("不得写 reverse-cause 等超能力 ID");
    expect(protocol).toContain('"intent"');
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

    expect(payload.task).toContain("第 2 次 Roll");
    expect(payload.task).toContain("只输出 choices");
    expect(payload.task).toContain("C 牌只能使用 assignedPower 指定的一项能力");
    expect(payload.task).toContain("像现场的人在说一个能立刻执行的主意");
    expect(payload.task).toContain("禁止“夺取解释权、推进既有轨迹");
    expect(payload.task).toContain("先在心里盘点 currentScene 与 historyMoment");
    expect(payload.task).toContain("三张牌必须使用三种不同的现场杠杆");
    expect(payload.task).toContain("逐字带出至少一个当前快照中的专名或实物");
    expect(payload.task).toContain("不要把循史写成等待");
    expect(payload.task).toContain("不要把破局写成泛化的接管现场");
    expect(payload.task).toContain("A 不得阻止、逆转、拖延、换掉掌权者或偷换结果");
    expect(payload.task).toContain("B 必须改变既有轨道的控制点、命令方向或结果");
    expect(payload.sceneTrajectoryContract.optionA).toContain("执行并完成当前既有轨道");
    expect(payload.task).toContain("powerId 必须逐字复制");
    expect(payload.task).toContain("actionSpec.actor 必须逐字为“你”");
    expect(payload.task).toContain("不能换能力、弱化成比喻");
    expect(payload.task).toContain("能力本身就是解决当前瓶颈的决胜动作");
    expect(payload.assignedPower).toMatchObject({
      powerId: "teleport-crowd",
      name: "百人迁跃",
    });
    expect(payload.outputContract.powerRule).toContain("A/B 不得输出 powerId");
    expect(payload.outputContract.playerFacingLanguage).toContain("字段值只写自然中文");
    expect(payload.outputContract.playerFacingLanguage).toContain("能力只写 assignedPower.name");
    expect(payload.task).toContain("不要输出盘点过程");
    expect(payload.outputContract.label).toContain("必须以具体的人、物、地点或已经发生的结果收尾");
    expect(payload.outputContract.displayLabel).toContain("自然动宾短语");
    expect(payload.allPreviouslySeenCards).toHaveLength(6);
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
    expect(protocol).toContain("历史快照不是背景资料，而是本幕所有行动的边界");
    expect(protocol).toContain("三张牌必须分别使用不同的具体杠杆");
    expect(protocol).toContain("每张牌至少逐字使用一个本幕已经出现的具体人物、机构、地点、器物、命令或程序");
    expect(protocol).toContain("只能使用 assignedPowers.choicesC 指定的超能力");
    expect(protocol).toContain("不能更换能力、把能力写成比喻");
    expect(protocol).toContain("必须以具体的人、物、地点或已经发生的结果收尾");
    expect(protocol).toContain("末尾不得是“的、同时、随后、转而、改为、试图、准备、意图、而非”");
    expect(protocol).toContain("先像当事人开口，再从这句话中提取");
    expect(protocol).toContain("原定方案、新方案、现场众人、愿意跟随的人");
    expect(protocol).toContain("exactShapeExample 只示意字段结构");
    expect(protocol).toContain("循史与温和程度无关");
    expect(protocol).toContain("A 不得阻止、逆转、拖延到期限后");
    expect(protocol).toContain("不得让主角死亡、被处死、失去意识、终身监禁");
    expect(protocol).not.toContain("按原计划出兵");
    expect(protocol).not.toContain("复核后照办");
    expect(payload.task).toContain("先在内部完成一次不输出的现场盘点");
    expect(payload.task).toContain("谁能被说服、什么东西能被拿走");
    expect(payload.task).toContain("六张牌至少覆盖六种不同的现场杠杆");
    expect(payload.task).toContain("两张天外牌分别严格使用 assignedPowers 指定的不同能力");
    expect(payload.assignedPowers.choicesC.powerId).toBe("blink-self");
    expect(payload.assignedPowers.rollChoicesC.powerId).toBe("stop-time");
    expect(payload.submissionChecklist.choices).toContain("不是同一动作换六种说法");
    expect(payload.submissionChecklist.choices).toContain("末尾不得停在连接词或待完成的动词");
    expect(payload.sceneTrajectoryContract.optionA).toContain("让这条既有轨道真正落地");
    expect(payload.sceneTrajectoryContract.optionB).toContain("改变既有轨道");
    expect(protocol).toContain("他必须能以同一身体继续完成下一幕");
  });

});
