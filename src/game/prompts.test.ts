import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import { buildContinuationMessages, buildEndingMessages, buildOpeningMessages } from "./prompts";
import type { GameScenario } from "./reducer";

const scenario: GameScenario = {
  profile: { name: "林舟", occupation: "product", strengths: ["negotiation", "strategy"], riskStyle: "balanced" },
  seed: HISTORY_SEEDS.find((seed) => seed.id === "sarajevo-1914")!,
};

describe("modern traveler AI prompt contract", () => {
  it("grounds the opening in a concrete role, objective, clock and modern strengths", () => {
    const body = buildOpeningMessages(scenario).at(-1)!.content;
    expect(body).toContain("萨拉热窝刺杀");
    expect(body).toContain("塞尔维亚总理大臣帕希奇的特别联络员");
    expect(body).toContain("距离车队再次经过拉丁桥约 8 分钟");
    expect(body).toContain("negotiation");
    expect(body).toContain("role");
    expect(body).toContain("immediateObjective");
    expect(body).toContain("timePressure");
  });

  it("serializes only generated choices in continuation and ending", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const }];
    const continuation = buildContinuationMessages(scenario, played, 8).at(-1)!.content;
    const ending = buildEndingMessages(scenario, Array(11).fill(played[0])).at(-1)!.content;
    expect(continuation).not.toContain("customIntervention");
    expect(ending).not.toContain("customIntervention");
    expect(continuation).toContain(turnFixture.choices[0].label);
    expect(continuation).toContain("百年分野");
    expect(continuation).toContain("1959");
    expect(ending).toContain("十一项");
  });

  it("forces generational identity relay and butterfly-effect topic jumps", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const }];
    const continuation = buildContinuationMessages(scenario, played, 8).at(-1)!.content;

    expect(continuation).toContain("不得把玩家写成长生不老");
    expect(continuation).toContain("原始历史事件不得继续作为本幕主题");
    expect(continuation).toContain("社会载体、核心矛盾、制度场景、主要受影响人群");
    expect(continuation).toContain("identityBridge");
    expect(continuation).toContain("profileAdvantage");
    expect(continuation).toContain("usesTravelerStrength");
    expect(continuation).toContain("总输出控制在 1200 个汉字以内");
  });

  it("prefers familiar Chinese anchors without forcing a geographic jump", () => {
    const parsedTurn = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: parsedTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: parsedTurn.choices[0].label, selectedDeviationClass: "nudge" as const }];
    const continuation = buildContinuationMessages(scenario, played, 8).at(-1)!.content;

    expect(continuation).toContain("不强制跨国或跨洲");
    expect(continuation).toContain("可以继续留在中国");
    expect(continuation).toContain("中国玩家熟悉");
    expect(continuation).toContain("至少更换其中两项");
    expect(continuation).not.toContain("第 8 节点起优先跨地域或跨领域");
  });
});
