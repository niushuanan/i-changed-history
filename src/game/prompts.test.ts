import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import { buildTravelerProfile } from "./profile";
import { buildContinuationMessages, buildCustomActionMessages, buildEndingMessages, buildOpeningMessages } from "./prompts";
import type { GameScenario } from "./reducer";
import { buildPivotalBrief } from "./worldCanon";

const scenario: GameScenario = {
  profile: buildTravelerProfile({ energy: "I", perception: "N", judgment: "T", tactics: "P" }),
  seed: HISTORY_SEEDS.find((seed) => seed.id === "sarajevo-1914")!,
};

describe("modern traveler AI prompt contract", () => {
  it("grounds the opening in a concrete role, objective, clock and modern strengths", () => {
    const body = buildOpeningMessages(scenario).at(-1)!.content;
    expect(body).toContain("萨拉热窝刺杀");
    expect(body).toContain("塞尔维亚总理大臣帕希奇的特别联络员");
    expect(body).toContain("距离车队再次经过拉丁桥约 8 分钟");
    expect(body).toContain("strategy");
    expect(body).toContain("INTP");
    expect(body).toContain("因果侦探");
    expect(body).toContain("三次直接改写");
    expect(body).toContain("结果立即成为正史");
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
    const brief = buildPivotalBrief(scenario, played, 8);

    expect(continuation).toContain("authoritativeProtagonist.name 本人");
    expect(continuation).toContain("禁止换身体、转生、意识接力");
    expect(continuation).toContain("原始历史事件不得继续作为本幕主题");
    expect(continuation).toContain("社会载体、核心矛盾、制度场景、主要受影响人群");
    expect(continuation).toContain("identityBridge");
    expect(continuation).toContain("profileAdvantage");
    expect(continuation).toContain("usesTravelerStrength");
    expect(continuation).toContain("总输出控制在 700 个汉字以内");
    expect(continuation).toContain(brief.rippleLens);
    expect(continuation).toContain(brief.significanceRequirement);
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
    expect(continuation).toContain("权力与继承");
    expect(continuation).toContain("技术与生产");
  });

  it("prefers familiar Chinese anchors without forcing a geographic jump", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: parsedTurn.choices[0].instantEcho }];
    const continuation = buildContinuationMessages(scenario, played, 8).at(-1)!.content;

    expect(continuation).toContain("不强制跨国或跨洲");
    expect(continuation).toContain("可以继续留在中国");
    expect(continuation).toContain("中国玩家熟悉");
    expect(continuation).toContain("至少更换其中两项");
    expect(continuation).not.toContain("第 8 节点起优先跨地域或跨领域");
  });

  it("keeps generated display copy concise without lowering transport headroom", () => {
    const body = buildOpeningMessages(scenario).at(-1)!.content;
    expect(body).toContain("总输出控制在 700 个汉字以内");
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
