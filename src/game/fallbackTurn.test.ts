import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { parseTimelineTurn } from "./schema";
import { createFallbackCustomActionResolution, createFallbackTurn } from "./fallbackTurn";
import { turnFixture } from "../test/fixtures";
import { buildTravelerProfile } from "./profile";
import { rippleLensLabel } from "./rippleRouter";

const scenario = {
  profile: buildTravelerProfile({ energy: "I", perception: "N", judgment: "T", tactics: "P" }),
  seed: HISTORY_SEEDS[0],
};

describe("deterministic fallback turn", () => {
  it("creates a schema-valid opening with three playable choices", () => {
    const turn = createFallbackTurn(scenario, [], 1);
    expect(() => parseTimelineTurn(JSON.stringify(turn))).not.toThrow();
    expect(turn).toMatchObject({ chapter: 1, chapterName: "历史现场", previousEcho: null });
    expect(turn.choices).toHaveLength(3);
    expect(turn.generationSource).toBe("fallback");
  });

  it("carries the authoritative previous echo into a later time jump", () => {
    const previous = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: previous, selectedChoiceId: "B" as const, selectedChoiceLabel: previous.choices[1].label, selectedDeviationClass: "reform" as const, resolvedEcho: previous.choices[1].instantEcho }];
    const turn = createFallbackTurn(scenario, played, 8);
    expect(turn).toMatchObject({ chapter: 8, chapterName: "百年分野", previousEcho: previous.choices[1].instantEcho });
    expect(turn.yearLabel).toContain("308");
    expect(turn.role).not.toContain(scenario.profile.name);
    expect(turn.location).not.toContain(scenario.seed.location);
    expect(turn.identityBridge).toContain("接棒");
    expect(turn.profileAdvantage).toContain("INTP");
    expect(turn.profileAdvantage).toContain("制度代价");
    expect(turn.causalBridge).toContain(rippleLensLabel(turn.rippleLens));
    expect(turn.choices.filter((choice) => choice.usesTravelerStrength)).toHaveLength(1);
  });

  it("keeps fallback relay labels aligned with the authoritative jump", () => {
    const previous = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: previous, selectedChoiceId: "B" as const, selectedChoiceLabel: previous.choices[1].label, selectedDeviationClass: "reform" as const, resolvedEcho: previous.choices[1].instantEcho }];
    expect(createFallbackTurn(scenario, played, 4).identityBridge).toContain("一年后");
    expect(createFallbackTurn(scenario, played, 6).identityBridge).toContain("十年后");
    expect(createFallbackTurn(scenario, played, 8).identityBridge).toContain("百年");
  });

  it("preserves a declared successful result even when the model falls back", () => {
    const resolution = createFallbackCustomActionResolution(scenario, parseTimelineTurn(JSON.stringify(turnFixture)), "我暗杀了皇帝且成功");
    expect(resolution).toMatchObject({
      declaredOutcome: "我暗杀了皇帝且成功",
      canonStatus: "玩家钦定",
      deviationClass: "rupture",
    });
    expect(JSON.stringify(resolution)).not.toContain("失败");
  });
});
