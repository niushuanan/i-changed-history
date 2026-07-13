import { describe, expect, it } from "vitest";
import { buildCanonicalCustomResolution } from "./customCanon";
import { parseTimelineTurn } from "./schema";
import { turnFixture } from "../test/fixtures";

const turn = parseTimelineTurn(JSON.stringify(turnFixture));

describe("player-authored canonical history", () => {
  it.each([
    "皇帝被我毒死",
    "我建立了共和国",
    "改革成功，但未能惠及乡村",
    "政变失败",
  ])("never interprets or changes the declared result: %s", (outcome) => {
    const result = buildCanonicalCustomResolution(turn, outcome, "rupture");
    expect(result.declaredOutcome).toBe(outcome);
    expect(result.instantEcho.directResult).toBe(outcome);
    expect(result.canonStatus).toBe("玩家钦定");
    expect(JSON.stringify(result)).not.toMatch(/人格|INTP|ENFP/);
  });

  it("keeps every major consequence channel in a compound declaration", () => {
    const result = buildCanonicalCustomResolution(
      turn,
      "我成为新皇帝，并设立国家科学院大力发展科技",
      "rupture",
    );

    expect(result.causalMechanism).toMatch(/登基|继承|宫门/);
    expect(result.causalMechanism).toMatch(/科学院|工坊|预算|技术/);
  });

  it("keeps concrete model consequences when they do not contradict the player's result", () => {
    const outcome = "我成为新皇帝";
    const modelResolution = {
      declaredOutcome: outcome,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "登基诏书由尚书台发往各州郡",
      deviationClass: "rupture" as const,
      instantEcho: {
        directResult: outcome,
        unexpectedCost: "边镇将领开始争夺新朝封赏",
        beneficiary: "支持新帝的禁军",
        payer: "失去封地的旧宗室",
      },
    };

    const result = buildCanonicalCustomResolution(turn, outcome, "rupture", modelResolution);

    expect(result.causalMechanism).toBe(modelResolution.causalMechanism);
    expect(result.instantEcho).toEqual(modelResolution.instantEcho);
  });
});
