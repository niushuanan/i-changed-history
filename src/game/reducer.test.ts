import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import { createInitialGameState, gameReducer } from "./reducer";
import type { TravelerProfile } from "./types";
import { buildTravelerProfile } from "./profile";

const profile: TravelerProfile = buildTravelerProfile({ energy: "I", perception: "N", judgment: "T", tactics: "P" });
const turn = parseTimelineTurn(JSON.stringify(turnFixture));
const twelfthTurn = parseTimelineTurn(JSON.stringify({
  ...turnFixture,
  chapter: 12,
  chapterName: "生命终章",
  protagonistAge: 70,
  lifeStage: "生命终章",
  previousEcho: turnFixture.choices[0].instantEcho,
}));

describe("profile-first choice-only game reducer", () => {
  const customResolution = {
    declaredOutcome: "我暗杀了皇帝且成功",
    canonStatus: "玩家钦定" as const,
    personalityLens: "INTP 因果侦探优先看见制度连锁",
    causalMechanism: "死讯通过禁军口令传入摄政会议",
    deviationClass: "rupture" as const,
    instantEcho: {
      directResult: "李渊提前收到宫变消息",
      unexpectedCost: "两宫禁军开始互扣使者",
      beneficiary: "忠于皇帝的宿卫",
      payer: "玄武门低阶军士",
    },
  };

  it("starts in profiling and requires a profile before a historical moment", () => {
    const initial = createInitialGameState();
    expect(initial.phase).toBe("profiling");

    const ignored = gameReducer(initial, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    expect(ignored).toBe(initial);

    const selecting = gameReducer(initial, { type: "SET_PROFILE", profile });
    expect(selecting.phase).toBe("selecting");
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    expect(started.scenario).toEqual({ profile, seed: HISTORY_SEEDS[0] });
    expect(started.request?.kind).toBe("opening");
  });

  it("records only one of the generated choices", () => {
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(started, {
      type: "OPENING_RESOLVED",
      requestId: started.request!.id,
      turn,
    });
    const chosen = gameReducer(event, { type: "COMMIT_AI_CHOICE", choiceId: "B" });
    expect(chosen.playedTurns).toHaveLength(1);
    expect(chosen.playedTurns[0].selectedChoiceId).toBe("B");
    expect(chosen.playedTurns[0]).not.toHaveProperty("customIntervention");
  });

  it("restarts with the same profile and can explicitly change traveler", () => {
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const restarted = gameReducer(started, { type: "RESTART" });
    expect(restarted.phase).toBe("selecting");
    expect(restarted.profile).toEqual(profile);

    const changed = gameReducer(restarted, { type: "CHANGE_PROFILE" });
    expect(changed.phase).toBe("profiling");
    expect(changed.profile).toBeNull();
  });

  it("requests the posthumous 2026 report only after the twelfth player decision", () => {
    const state = {
      ...createInitialGameState(),
      phase: "event" as const,
      profile,
      scenario: { profile, seed: HISTORY_SEEDS[0] },
      currentTurn: twelfthTurn,
      playedTurns: Array.from({ length: 11 }, () => ({
        turn,
        selectedChoiceId: "A" as const,
        selectedChoiceLabel: turn.choices[0].label,
        selectedDeviationClass: "nudge" as const,
        resolvedEcho: turn.choices[0].instantEcho,
      })),
    };

    const chosen = gameReducer(state, { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    expect(chosen.playedTurns).toHaveLength(12);
    expect(chosen.request).toMatchObject({ kind: "ending" });
  });

  it("writes one of three player-declared outcomes into canonical history", () => {
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(started, { type: "OPENING_RESOLVED", requestId: started.request!.id, turn });
    const adjudicating = gameReducer(event, { type: "SUBMIT_CUSTOM_ACTION", action: "我暗杀了皇帝且成功" });

    expect(adjudicating).toMatchObject({
      phase: "adjudicating",
      customActionsUsed: 0,
      request: { kind: "custom-action", action: "我暗杀了皇帝且成功" },
    });

    const resolved = gameReducer(adjudicating, {
      type: "CUSTOM_ACTION_RESOLVED",
      requestId: adjudicating.request!.id,
      resolution: {
        ...customResolution,
        declaredOutcome: "模型擅自改写的结果",
        causalMechanism: "模型声称共和国并未成立",
        instantEcho: {
          directResult: "模型声称暗杀失败",
          unexpectedCost: "皇帝其实幸存",
          beneficiary: "挫败刺杀的人",
          payer: "失败的刺客",
        },
      },
    });
    expect(resolved.customActionsUsed).toBe(1);
    expect(resolved.playedTurns[0]).toMatchObject({
      selectedChoiceId: "custom",
      selectedChoiceLabel: "我暗杀了皇帝且成功",
      playerAuthored: true,
      canonStatus: "玩家钦定",
      causalMechanism: expect.stringContaining("宫门口令"),
      resolvedEcho: expect.objectContaining({ directResult: "我暗杀了皇帝且成功" }),
    });
    expect(resolved.echo).toMatchObject({ source: "custom_action", choiceLabel: "我暗杀了皇帝且成功", directResult: "我暗杀了皇帝且成功", canonStatus: "玩家钦定" });
    expect(resolved.echo?.causalMechanism).toContain("宫门口令");
    expect(JSON.stringify(resolved.echo)).not.toMatch(/模型擅自|模型声称|其实幸存|挫败刺杀|失败的刺客/);
  });

  it("does not allow a fourth custom rewrite", () => {
    const state = {
      ...createInitialGameState(),
      phase: "event" as const,
      profile,
      scenario: { profile, seed: HISTORY_SEEDS[0] },
      currentTurn: turn,
      customActionsUsed: 3,
    };
    expect(gameReducer(state, { type: "SUBMIT_CUSTOM_ACTION", action: "再改一次" })).toBe(state);
  });

  it("does not spend a custom rewrite when adjudication fails and retries", () => {
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(started, { type: "OPENING_RESOLVED", requestId: started.request!.id, turn });
    const adjudicating = gameReducer(event, { type: "SUBMIT_CUSTOM_ACTION", action: "先扣下军令" });
    const failed = gameReducer(adjudicating, {
      type: "REQUEST_FAILED",
      requestId: adjudicating.request!.id,
      code: "network",
      message: "网络中断",
    });
    expect(failed).toMatchObject({ customActionsUsed: 0, phase: "error", error: { retry: { kind: "custom-action", action: "先扣下军令" } } });
    expect(gameReducer(failed, { type: "RETRY" })).toMatchObject({ customActionsUsed: 0, phase: "adjudicating", request: { kind: "custom-action", action: "先扣下军令" } });
  });
});
