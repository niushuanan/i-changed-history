import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import { buildContinuationMessages, buildCustomActionMessages, buildEndingMessages, buildOpeningMessages } from "./prompts";
import type { GameScenario } from "./reducer";

const scenario: GameScenario = {
  seed: HISTORY_SEEDS.find((seed) => seed.id === "sarajevo-1914")!,
};

describe("modern traveler AI prompt contract", () => {
  it("grounds the opening without a personality profile", () => {
    const body = buildOpeningMessages(scenario).at(-1)!.content;
    expect(body).toContain("萨拉热窝刺杀");
    expect(body).toContain("塞尔维亚总理大臣帕希奇的特别联络员");
    expect(body).toContain("距离车队再次经过拉丁桥约 8 分钟");
    expect(body).not.toContain('"dimensions"');
    expect(body).not.toContain("INTP");
    expect(body).not.toContain("因果侦探");
    expect(body).toContain("没有固定人格");
    expect(body).toContain("role");
    expect(body).toContain("immediateObjective");
    expect(body).toContain("timePressure");
  });

  it("serializes only generated choices in continuation and ending", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 8).at(-1)!.content;
    const ending = buildEndingMessages(scenario, Array(12).fill(played[0])).at(-1)!.content;
    expect(continuation).not.toContain("customIntervention");
    expect(ending).not.toContain("customIntervention");
    expect(continuation).toContain(turnFixture.choices[0].label);
    expect(continuation).toContain("盛年危局");
    expect(continuation).toContain("1927");
    expect(ending).toContain("十二次选择");
  });

  it("forces one aging protagonist through butterfly-effect topic changes", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 8).at(-1)!.content;

    expect(continuation).toContain("authoritativeProtagonist.name 本人");
    expect(continuation).toContain("禁止换身体、转生、意识接力");
    expect(continuation).toContain("原始历史事件不得继续作为本幕主题");
    expect(continuation).toContain("不要从预设类别、通用模板或固定章节槽中选题");
    expect(continuation).toContain("一阶、二阶和三阶后果");
    expect(continuation).toContain("identityBridge");
    expect(continuation).toContain("modernAdvantage");
    expect(continuation).toContain("usesModernKnowledge");
    expect(continuation).toContain("完整 JSON 可到 1800 个汉字");
    expect(continuation).not.toContain("authoritativePivotalBrief");
    expect(continuation).toContain("historicalAnchors");
    expect(continuation).toContain("actionSpec");
    expect(continuation).toContain("rippleLens");
    expect(continuation).toContain("causalBridge");
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
    const continuation = buildContinuationMessages(scenario, played, 2).at(-1)!.content;

    expect(continuation).toContain("不可撤销正史");
    expect(continuation).toContain("我成为新皇帝，并设立国家科学院大力发展科技");
    expect(continuation).toContain("重大转折点");
    expect(continuation).toContain("turningPointStakes");
    expect(continuation).toContain("worldStateChange");
    expect(continuation).toContain("divergenceProof");
    expect(continuation).toContain("自行选择其中最意外、最重大");
    expect(continuation).toContain("不得否认、降级、反转");
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
    const body = buildOpeningMessages(scenario).at(-1)!.content;
    expect(body).toContain("完整 JSON 可到 1800 个汉字");
    expect(body).toContain("60 个汉字以内");
    expect(body).toContain("每个 label 22 字以内");
  });

  it("makes a player-declared result canon instead of judging whether it succeeds", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const body = buildCustomActionMessages(scenario, [], parsedTurn, "我暗杀了皇帝且成功").at(-1)!.content;

    expect(body).toContain("我暗杀了皇帝且成功");
    expect(body).toContain(parsedTurn.role);
    expect(body).toContain("既成事实");
    expect(body).toContain("不得改变它写明的成功或失败");
    expect(body).toContain("declaredOutcome");
    expect(body).toContain("canonStatus");
    expect(body).not.toContain("受限执行");
  });
});
