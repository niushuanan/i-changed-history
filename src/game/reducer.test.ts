import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import { createInitialGameState, gameReducer } from "./reducer";
import { CHAPTER_NAMES } from "./timelinePlan";
const turn = parseTimelineTurn(JSON.stringify(turnFixture));
const secondTurn = parseTimelineTurn(JSON.stringify({
  ...turnFixture,
  chapter: 2,
  chapterName: CHAPTER_NAMES[2],
  previousEcho: turnFixture.choices[0].instantEcho,
}));
const twelfthTurn = parseTimelineTurn(JSON.stringify({
  ...turnFixture,
  chapter: 12,
  chapterName: "生命终章",
  protagonistAge: 70,
  lifeStage: "生命终章",
  previousEcho: turnFixture.choices[0].instantEcho,
}));

describe("single-life choice-only game reducer", () => {
  it("opens the fixed first turn immediately without requesting DeepSeek", () => {
    const initial = createInitialGameState();
    expect(initial.phase).toBe("selecting");
    const started = gameReducer(initial, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    expect(started.scenario?.seed).toEqual(HISTORY_SEEDS[0]);
    expect(started.phase).toBe("event");
    expect(started.currentTurn).toMatchObject({
      chapter: 1,
      generationSource: "fixed",
      location: HISTORY_SEEDS[0].location,
      role: HISTORY_SEEDS[0].role,
    });
    expect(started.request).toBeNull();
  });

  it("records only the player's chosen history", () => {
    const selecting = createInitialGameState();
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const chosen = gameReducer(started, { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    expect(chosen.playedTurns).toHaveLength(1);
    expect(chosen.playedTurns[0].selectedChoiceId).toBe("A");
    expect(chosen).not.toHaveProperty("instinctPlayedTurns");
    expect(chosen.playedTurns[0]).not.toHaveProperty("customIntervention");
  });

  it("records the full canonical AI choice instead of its compact display label", () => {
    const canonical = "召集所有仍然忠于朝廷的边军将领公开核验军令来源并要求他们在日落之前重新宣誓效忠";
    const longChoiceTurn = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 0 ? {
        ...choice,
        label: canonical,
        actionSpec: { actor: "你", action: "公开核验军令", target: "边军将领", deadline: "日落前" },
      } : choice),
    }));
    const state = {
      ...createInitialGameState(),
      phase: "event" as const,
      scenario: { seed: HISTORY_SEEDS[0] },
      currentTurn: longChoiceTurn,
    };

    const chosen = gameReducer(state, { type: "COMMIT_AI_CHOICE", choiceId: "A" });

    expect(longChoiceTurn.choices[0].displayLabel).toBe("公开核验军令：边军将领");
    expect(chosen.playedTurns[0].selectedChoiceLabel).toBe(canonical);
    expect(chosen.echo?.choiceLabel).toBe(canonical);
  });

  it("restarts at the complete historical filmstrip", () => {
    const selecting = createInitialGameState();
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const restarted = gameReducer(started, { type: "RESTART" });
    expect(restarted.phase).toBe("selecting");
    expect(restarted.scenario).toBeNull();
  });

  it("requests the posthumous 2026 report only after the twelfth player decision", () => {
    const state = {
      ...createInitialGameState(),
      phase: "event" as const,
      scenario: { seed: HISTORY_SEEDS[0] },
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

  it("writes a player-declared outcome into canon and starts the next turn without adjudication", () => {
    const selecting = createInitialGameState();
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const resolved = gameReducer(started, { type: "SUBMIT_CUSTOM_ACTION", action: "我暗杀了皇帝且成功" });

    expect(resolved.customActionsUsed).toBe(1);
    expect(resolved.playedTurns[0]).toMatchObject({
      selectedChoiceId: "custom",
      selectedChoiceLabel: "我暗杀了皇帝且成功",
      playerAuthored: true,
      canonStatus: "玩家钦定",
      causalMechanism: expect.stringContaining("宫门口令"),
      resolvedEcho: expect.objectContaining({ directResult: "我暗杀了皇帝且成功" }),
      selectedDeviationClass: "rupture",
    });
    expect(resolved.phase).toBe("generating");
    expect(resolved.echo).toBeNull();
    expect(resolved.request).toMatchObject({ kind: "next-turn", targetChapter: 2 });
    expect(JSON.stringify(resolved)).not.toContain("custom-action");
  });

  it("keeps a validated scene behind an explicit player reveal", () => {
    const selecting = createInitialGameState();
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const generating = gameReducer(started, { type: "SUBMIT_CUSTOM_ACTION", action: "我已夺取宫门并控制诏书" });
    const ready = gameReducer(generating, {
      type: "TURN_RESOLVED",
      requestId: generating.request!.id,
      turn: secondTurn,
    });

    expect(ready).toMatchObject({
      phase: "generating",
      currentTurn: { chapter: 1 },
      pendingTurn: { chapter: 2 },
      request: null,
    });

    const revealed = gameReducer(ready, { type: "REVEAL_GENERATED_TURN" } as never);
    expect(revealed).toMatchObject({
      phase: "event",
      currentTurn: { chapter: 2 },
      pendingTurn: null,
    });
  });

  it("keeps a prefetched A/B/C continuation behind the same explicit reveal", () => {
    const selecting = createInitialGameState();
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const echo = gameReducer(started, { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    const prefetched = gameReducer(echo, {
      type: "TURN_RESOLVED",
      requestId: echo.request!.id,
      turn: secondTurn,
    });

    const ready = gameReducer(prefetched, { type: "CONTINUE_TIMELINE" });
    expect(ready).toMatchObject({
      phase: "generating",
      currentTurn: { chapter: 1 },
      pendingTurn: { chapter: 2 },
      request: null,
      echo: null,
    });

    const revealed = gameReducer(ready, { type: "REVEAL_GENERATED_TURN" });
    expect(revealed).toMatchObject({
      phase: "event",
      currentTurn: { chapter: 2 },
      pendingTurn: null,
    });
  });

  it("allows a fourth custom rewrite", () => {
    const state = {
      ...createInitialGameState(),
      phase: "event" as const,
      scenario: { seed: HISTORY_SEEDS[0] },
      currentTurn: turn,
      customActionsUsed: 3,
    };
    expect(gameReducer(state, { type: "SUBMIT_CUSTOM_ACTION", action: "再改一次" })).toMatchObject({
      phase: "generating",
      customActionsUsed: 4,
      request: { kind: "next-turn", targetChapter: 2 },
    });
  });

  it("commits a twelfth-node rewrite before requesting the ending", () => {
    const state = {
      ...createInitialGameState(),
      phase: "event" as const,
      scenario: { seed: HISTORY_SEEDS[0] },
      currentTurn: twelfthTurn,
      playedTurns: Array.from({ length: 11 }, () => ({
        turn,
        selectedChoiceId: "A" as const,
        selectedChoiceLabel: turn.choices[0].label,
        selectedDeviationClass: "nudge" as const,
        resolvedEcho: turn.choices[0].instantEcho,
      })),
    };

    const resolved = gameReducer(state, { type: "SUBMIT_CUSTOM_ACTION", action: "我宣布停战且双方已经签字" });
    expect(resolved).toMatchObject({
      phase: "ending",
      customActionsUsed: 1,
      request: { kind: "ending" },
    });
    expect(resolved.playedTurns.at(-1)?.selectedChoiceLabel).toBe("我宣布停战且双方已经签字");
  });
});
