import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { parseTimelineTurn } from "./schema";
import { createFallbackCustomActionResolution, createFallbackTurn } from "./fallbackTurn";
import { turnFixture } from "../test/fixtures";
import { buildTravelerProfile } from "./profile";
import { buildPivotalBrief, pivotalSceneMatches } from "./worldCanon";

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
    expect(turn.turningPointStakes).toBeTruthy();
    expect(turn.worldStateChange).toContain(previous.choices[1].label);
    expect(turn.divergenceProof).toContain("真实历史");
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

  it("turns an emperor declaration into a regime succession crisis instead of a generic office scene", () => {
    const previous = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{
      turn: previous,
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: "我成为新皇帝",
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: {
        directResult: "我成为新皇帝",
        unexpectedCost: "旧贵族联合反对新朝",
        beneficiary: "拥护新朝的军民",
        payer: "失去继承权的旧宗室",
      },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "登基诏书通过宫门与官署进入社会",
    }];
    const brief = buildPivotalBrief(scenario, played, 4);
    const turn = createFallbackTurn(scenario, played, 4);

    expect(turn.turningPointStakes).toMatch(/政权|继承|合法/);
    expect(turn.worldStateChange).toContain("我成为新皇帝");
    expect(turn.causalLedger.map((entry) => entry.causedByChapter)).toContain(1);
    expect(pivotalSceneMatches(brief, turn)).toBe(true);
    expect(`${turn.role}${turn.location}${turn.headline}`).not.toMatch(/记录员|配给员|统计员|普通/);
  });

  it("keeps earlier player canon visible after an intervening ordinary choice", () => {
    const previous = parseTimelineTurn(JSON.stringify(turnFixture));
    const custom = {
      turn: previous,
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: "我大力发展科技",
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: {
        directResult: "我大力发展科技",
        unexpectedCost: "旧官署抵制新预算",
        beneficiary: "工匠与学生",
        payer: "旧技术垄断者",
      },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "国家工坊与学校开始执行",
    };
    const ordinary = {
      turn: { ...previous, chapter: 2 as const, chapterName: "一日余波" as const, previousEcho: custom.resolvedEcho },
      selectedChoiceId: "A" as const,
      selectedChoiceLabel: "先核对地方粮册",
      selectedDeviationClass: "nudge" as const,
      resolvedEcho: previous.choices[0].instantEcho,
    };

    const turn = createFallbackTurn(scenario, [custom, ordinary], 3);

    expect(turn.worldStateChange).toContain("我大力发展科技");
    expect(turn.turningPointStakes).toMatch(/技术|人才|生产/);
    expect(turn.causalLedger).toContainEqual(expect.objectContaining({
      causedByChapter: 1,
      fact: "我大力发展科技",
    }));
  });

  it("shows every overlapping player-authored fact in fallback continuity", () => {
    const previous = parseTimelineTurn(JSON.stringify(turnFixture));
    const first = {
      turn: previous,
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: "我建立国家科学院",
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: { ...previous.choices[2].instantEcho, directResult: "我建立国家科学院" },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "建院诏书进入官署",
    };
    const second = {
      turn: { ...previous, chapter: 2 as const, chapterName: "一日余波" as const, previousEcho: first.resolvedEcho },
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: "我发行全国通用纸币",
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: { ...previous.choices[2].instantEcho, directResult: "我发行全国通用纸币" },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "纸币进入市场",
    };

    const turn = createFallbackTurn(scenario, [first, second], 3);

    expect(turn.worldStateChange).toContain("我建立国家科学院");
    expect(turn.worldStateChange).toContain("我发行全国通用纸币");
    expect(turn.causalLedger.map((entry) => entry.fact)).toEqual(expect.arrayContaining([
      "我建立国家科学院",
      "我发行全国通用纸币",
    ]));
  });
});
