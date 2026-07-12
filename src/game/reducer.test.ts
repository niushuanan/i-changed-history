import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { endingFixture, turnFixture } from "../test/fixtures";
import { parseAlternatePresent, parseTimelineTurn, type TimelineTurn } from "./schema";
import { createInitialGameState, gameReducer } from "./reducer";

const chapterNames = ["裂缝", "余震", "新秩序", "世界线", "此刻"] as const;
const seed = HISTORY_SEEDS[0];
const ending = parseAlternatePresent(JSON.stringify(endingFixture));

function turnFor(chapter: 1 | 2 | 3 | 4 | 5): TimelineTurn {
  return parseTimelineTurn(JSON.stringify({
    ...turnFixture,
    chapter,
    chapterName: chapterNames[chapter - 1],
    yearLabel: `第${chapter}幕`,
    previousEcho: chapter === 1 ? null : turnFixture.choices[0].instantEcho,
  }));
}

function openGame() {
  const started = gameReducer(createInitialGameState(), { type: "START_SCENARIO", scenario: seed });
  return gameReducer(started, {
    type: "OPENING_RESOLVED",
    requestId: started.request?.id ?? -1,
    turn: turnFor(1),
  });
}

describe("five-turn game reducer", () => {
  it("starts and resolves a curated opening", () => {
    const started = gameReducer(createInitialGameState(), { type: "START_SCENARIO", scenario: seed });
    expect(started).toMatchObject({ phase: "generating", scenario: seed });
    expect(started.request).toMatchObject({ kind: "opening", id: 1 });

    const opened = gameReducer(started, {
      type: "OPENING_RESOLVED",
      requestId: 1,
      turn: turnFor(1),
    });
    expect(opened).toMatchObject({ phase: "event", currentTurn: { chapter: 1 }, request: null });
  });

  it("commits an AI choice once and shows its echo immediately", () => {
    const event = openGame();
    const chosen = gameReducer(event, { type: "COMMIT_AI_CHOICE", choiceId: "B" });

    expect(chosen.phase).toBe("echo");
    expect(chosen.echo).toMatchObject({
      source: "ai_choice",
      directResult: turnFixture.choices[1].instantEcho.directResult,
      stepImpact: 10,
      nextDeviation: 10,
    });
    expect(chosen.playedTurns).toHaveLength(1);
    expect(chosen.request).toMatchObject({ kind: "next-turn", targetChapter: 2 });

    expect(gameReducer(chosen, { type: "COMMIT_AI_CHOICE", choiceId: "C" })).toBe(chosen);
  });

  it("holds an early response until the player continues", () => {
    const chosen = gameReducer(openGame(), { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    const resolved = gameReducer(chosen, {
      type: "TURN_RESOLVED",
      requestId: chosen.request?.id ?? -1,
      turn: turnFor(2),
    });
    expect(resolved).toMatchObject({ phase: "echo", pendingTurn: { chapter: 2 }, request: null });

    const continued = gameReducer(resolved, { type: "CONTINUE_TIMELINE" });
    expect(continued).toMatchObject({ phase: "event", currentTurn: { chapter: 2 }, pendingTurn: null });
  });

  it("shows generating when the player continues before the response", () => {
    const chosen = gameReducer(openGame(), { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    const waiting = gameReducer(chosen, { type: "CONTINUE_TIMELINE" });
    expect(waiting.phase).toBe("generating");

    const resolved = gameReducer(waiting, {
      type: "TURN_RESOLVED",
      requestId: waiting.request?.id ?? -1,
      turn: turnFor(2),
    });
    expect(resolved).toMatchObject({ phase: "event", currentTurn: { chapter: 2 } });
  });

  it("records a free intervention as untrusted player data", () => {
    const event = openGame();
    const chosen = gameReducer(event, {
      type: "COMMIT_INTERVENTION",
      text: "让各地城市共同保管道路税",
      deviationClass: "reform",
    });

    expect(chosen.playedTurns[0]).toMatchObject({
      selectedChoiceId: "custom",
      selectionSource: "custom_intervention",
      customIntervention: "让各地城市共同保管道路税",
      selectedDeviationClass: "reform",
    });
    expect(chosen.echo).toMatchObject({ source: "custom_intervention", stepImpact: 10 });
    expect(chosen.request).toMatchObject({
      kind: "next-turn",
      intervention: { text: "让各地城市共同保管道路税", deviationClass: "reform" },
    });
  });

  it("requests and reveals the ending after the fifth choice", () => {
    const fifthEvent = {
      ...openGame(),
      currentTurn: turnFor(5),
      playedTurns: [],
    };
    const chosen = gameReducer(fifthEvent, { type: "COMMIT_AI_CHOICE", choiceId: "C" });
    expect(chosen.request).toMatchObject({ kind: "ending" });

    const resolved = gameReducer(chosen, {
      type: "ENDING_RESOLVED",
      requestId: chosen.request?.id ?? -1,
      ending,
    });
    expect(resolved.phase).toBe("echo");
    expect(gameReducer(resolved, { type: "CONTINUE_TIMELINE" })).toMatchObject({
      phase: "result",
      result: ending,
    });
  });

  it("ignores stale results and preserves progress through retry and restart", () => {
    const chosen = gameReducer(openGame(), { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    expect(gameReducer(chosen, {
      type: "TURN_RESOLVED",
      requestId: 999,
      turn: turnFor(2),
    })).toBe(chosen);

    const failedDuringEcho = gameReducer(chosen, {
      type: "REQUEST_FAILED",
      requestId: chosen.request?.id ?? -1,
      code: "network",
      message: "网络中断",
    });
    expect(failedDuringEcho).toMatchObject({ phase: "echo", request: null, error: { code: "network" } });

    const failed = gameReducer(failedDuringEcho, { type: "CONTINUE_TIMELINE" });
    expect(failed.phase).toBe("error");
    expect(failed.playedTurns).toHaveLength(1);

    const retried = gameReducer(failed, { type: "RETRY" });
    expect(retried).toMatchObject({ phase: "generating", request: { kind: "next-turn" }, error: null });
    expect(retried.request?.id).not.toBe(chosen.request?.id);

    const restarted = gameReducer(retried, { type: "RESTART" });
    expect(restarted).toMatchObject({ phase: "selecting", scenario: null, playedTurns: [] });
    expect(gameReducer(restarted, {
      type: "TURN_RESOLVED",
      requestId: retried.request?.id ?? -1,
      turn: turnFor(2),
    })).toBe(restarted);
  });
});
