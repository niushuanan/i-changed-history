import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import { createInitialGameState, gameReducer } from "./reducer";
import type { TravelerProfile } from "./types";

const profile: TravelerProfile = {
  name: "林舟",
  occupation: "product",
  strengths: ["negotiation", "strategy"],
  riskStyle: "balanced",
};
const turn = parseTimelineTurn(JSON.stringify(turnFixture));
const eleventhTurn = parseTimelineTurn(JSON.stringify({
  ...turnFixture,
  chapter: 11,
  chapterName: "终局前夜",
  previousEcho: turnFixture.choices[0].instantEcho,
}));

describe("profile-first choice-only game reducer", () => {
  const customResolution = {
    normalizedAction: "先封锁宫门，再请李渊临朝",
    ruling: "受限执行" as const,
    constraintApplied: "只能调动玄武门宿卫",
    deviationClass: "reform" as const,
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

  it("requests the 2026 ending only after the eleventh player decision", () => {
    const state = {
      ...createInitialGameState(),
      phase: "event" as const,
      profile,
      scenario: { profile, seed: HISTORY_SEEDS[0] },
      currentTurn: eleventhTurn,
      playedTurns: Array.from({ length: 10 }, () => ({
        turn,
        selectedChoiceId: "A" as const,
        selectedChoiceLabel: turn.choices[0].label,
        selectedDeviationClass: "nudge" as const,
        resolvedEcho: turn.choices[0].instantEcho,
      })),
    };

    const chosen = gameReducer(state, { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    expect(chosen.playedTurns).toHaveLength(11);
    expect(chosen.request).toMatchObject({ kind: "ending" });
  });

  it("spends one of three custom rewrites only after a successful ruling", () => {
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(started, { type: "OPENING_RESOLVED", requestId: started.request!.id, turn });
    const adjudicating = gameReducer(event, { type: "SUBMIT_CUSTOM_ACTION", action: "调动全城军队包围皇宫" });

    expect(adjudicating).toMatchObject({
      phase: "adjudicating",
      customActionsUsed: 0,
      request: { kind: "custom-action", action: "调动全城军队包围皇宫" },
    });

    const resolved = gameReducer(adjudicating, {
      type: "CUSTOM_ACTION_RESOLVED",
      requestId: adjudicating.request!.id,
      resolution: customResolution,
    });
    expect(resolved.customActionsUsed).toBe(1);
    expect(resolved.playedTurns[0]).toMatchObject({
      selectedChoiceId: "custom",
      selectedChoiceLabel: customResolution.normalizedAction,
      resolvedEcho: customResolution.instantEcho,
    });
    expect(resolved.echo).toMatchObject({ source: "custom_action", ruling: "受限执行" });
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
