import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { createInitialGameState, gameReducer } from "../game/reducer";
import { GAME_STORAGE_KEY, loadGameSnapshot, saveGameSnapshot } from "./storage";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "../game/schema";
import { CHAPTER_NAMES, type DecisionChapter } from "../game/timelinePlan";
function memoryStorage(initial?: Record<string, string>) { const data = new Map(Object.entries(initial ?? {})); return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } }; }

describe("v13 fast-path single-history storage", () => {
  it("persists the historical picker and ignores old v1 sessions", () => {
    const storage = memoryStorage();
    const selecting = createInitialGameState();
    expect(saveGameSnapshot(selecting, storage)).toBe(true);
    expect(loadGameSnapshot(storage)).toMatchObject({ phase: "selecting" });

    const old = memoryStorage({ "i-changed-history:session:v1": JSON.stringify({ version: 1, state: {} }) });
    expect(loadGameSnapshot(old)).toBeNull();
  });

  it("returns an incompatible v4 run to a clean selection", () => {
    const current = memoryStorage();
    const selecting = createInitialGameState();
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    saveGameSnapshot(generating, current);
    const legacyEnvelope = JSON.parse(current.getItem(GAME_STORAGE_KEY)!);
    legacyEnvelope.version = 4;
    delete legacyEnvelope.state.customActionsUsed;
    const oldProfile = {
      name: "林舟",
      occupation: "product",
      strengths: ["negotiation", "strategy"],
      riskStyle: "balanced",
    };
    legacyEnvelope.state.profile = oldProfile;
    legacyEnvelope.state.scenario.profile = oldProfile;
    const legacy = memoryStorage({
      "i-changed-history:session:v4": JSON.stringify(legacyEnvelope),
    });

    expect(loadGameSnapshot(legacy)).toMatchObject({
      phase: "selecting",
      customActionsUsed: 0,
      request: null,
    });
  });

  it("returns an incompatible v5 run to selection instead of mixing engines", () => {
    const current = memoryStorage();
    const selecting = createInitialGameState();
    const event = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const adjudicating = gameReducer({ ...event, customActionsUsed: 2 }, {
      type: "SUBMIT_CUSTOM_ACTION",
      action: "先扣下军令，再请皇帝临朝",
    });
    saveGameSnapshot(adjudicating, current);
    const legacyEnvelope = JSON.parse(current.getItem(GAME_STORAGE_KEY)!);
    legacyEnvelope.version = 5;
    const oldProfile = {
      name: "林舟",
      occupation: "product",
      strengths: ["negotiation", "strategy"],
      riskStyle: "balanced",
    };
    legacyEnvelope.state.profile = oldProfile;
    legacyEnvelope.state.scenario.profile = oldProfile;
    const legacy = memoryStorage({
      "i-changed-history:session:v5": JSON.stringify(legacyEnvelope),
    });

    expect(loadGameSnapshot(legacy)).toMatchObject({
      phase: "selecting",
      scenario: null,
      currentTurn: null,
      customActionsUsed: 0,
      request: null,
    });
    expect(legacy.getItem(GAME_STORAGE_KEY)).toContain('"version":13');
    expect(legacy.getItem("i-changed-history:session:v5")).toBeNull();
  });

  it("persists the fixed opening without an interrupted model request", () => {
    const storage = memoryStorage();
    const selecting = createInitialGameState();
    const opening = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    saveGameSnapshot(opening, storage);
    expect(loadGameSnapshot(storage)).toMatchObject({
      phase: "event",
      currentTurn: { chapter: 1, generationSource: "fixed" },
      request: null,
      error: null,
    });
    expect(storage.getItem(GAME_STORAGE_KEY)).toContain('"version":13');
  });

  it("automatically resumes the posthumous report without losing twelve decisions", () => {
    const playedTurns = Array.from({ length: 12 }, (_, index) => ({
      turn: parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: index + 1, chapterName: CHAPTER_NAMES[(index + 1) as DecisionChapter], previousEcho: index === 0 ? null : turnFixture.choices[0].instantEcho })),
      selectedChoiceId: "A" as const,
      selectedChoiceLabel: turnFixture.choices[0].label,
      selectedDeviationClass: "nudge" as const,
      resolvedEcho: turnFixture.choices[0].instantEcho,
    }));
    const storage = memoryStorage();
    const state = {
      ...createInitialGameState(12),
      phase: "ending" as const,
      scenario: { seed: HISTORY_SEEDS[0] },
      currentTurn: playedTurns[11].turn,
      playedTurns,
      request: { kind: "ending" as const, id: 11 },
    };

    saveGameSnapshot(state, storage);
    expect(loadGameSnapshot(storage)).toMatchObject({
      phase: "ending",
      playedTurns: expect.arrayContaining([expect.objectContaining({ selectedChoiceId: "A" })]),
      request: { kind: "ending", id: 11 },
    });
    expect(loadGameSnapshot(storage)?.playedTurns).toHaveLength(12);
  });

  it("round-trips twelve completed decisions", () => {
    const playedTurns = Array.from({ length: 12 }, (_, index) => ({
      turn: parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: index + 1, chapterName: CHAPTER_NAMES[(index + 1) as DecisionChapter], previousEcho: index === 0 ? null : turnFixture.choices[0].instantEcho })),
      selectedChoiceId: "A" as const,
      selectedChoiceLabel: turnFixture.choices[0].label,
      selectedDeviationClass: "nudge" as const,
      resolvedEcho: turnFixture.choices[0].instantEcho,
    }));
    const storage = memoryStorage();
    const state = { ...createInitialGameState(), phase: "event" as const, scenario: { seed: HISTORY_SEEDS[0] }, currentTurn: playedTurns[11].turn, playedTurns };
    expect(saveGameSnapshot(state as never, storage)).toBe(true);
    expect(loadGameSnapshot(storage)?.playedTurns).toHaveLength(12);
  });

  it("preserves a current run whose narrative predates the richer three-sentence contract", () => {
    const storage = memoryStorage();
    const selecting = createInitialGameState();
    const event = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    saveGameSnapshot(event, storage);

    const envelope = JSON.parse(storage.getItem(GAME_STORAGE_KEY)!);
    envelope.state.currentTurn.narrative = "你坐在霞飞路咖啡馆二楼，窗外报童叫卖号外，日军潜艇封锁长江口。";
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify(envelope));

    expect(loadGameSnapshot(storage)).toMatchObject({
      phase: "event",
      currentTurn: {
        narrative: "你坐在霞飞路咖啡馆二楼，窗外报童叫卖号外，日军潜艇封锁长江口。",
      },
    });
  });

  it("persists an unlimited custom rewrite counter", () => {
    const storage = memoryStorage();
    const state = { ...createInitialGameState(), customActionsUsed: 9 };
    expect(saveGameSnapshot(state, storage)).toBe(true);
    expect(loadGameSnapshot(storage)).toMatchObject({ customActionsUsed: 9 });
  });

  it("resumes the next turn after a custom result was committed synchronously", () => {
    const storage = memoryStorage();
    const selecting = createInitialGameState();
    const event = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const generating = gameReducer(event, { type: "SUBMIT_CUSTOM_ACTION", action: "先扣下军令，再请皇帝临朝" });

    expect(saveGameSnapshot(generating, storage)).toBe(true);
    expect(loadGameSnapshot(storage)).toMatchObject({
      phase: "generating",
      customActionsUsed: 1,
      request: { kind: "next-turn", targetChapter: 2 },
      playedTurns: [expect.objectContaining({ selectedChoiceLabel: "先扣下军令，再请皇帝临朝" })],
    });
  });

  it("returns an incompatible v6 run to selection", () => {
    const current = memoryStorage();
    const selecting = createInitialGameState();
    const event = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    saveGameSnapshot(event, current);
    const legacyEnvelope = JSON.parse(current.getItem(GAME_STORAGE_KEY)!);
    legacyEnvelope.version = 6;
    delete legacyEnvelope.state.currentTurn.rippleLens;
    delete legacyEnvelope.state.currentTurn.causalBridge;
    legacyEnvelope.state.playedTurns = [{
      turn: { ...legacyEnvelope.state.currentTurn },
      selectedChoiceId: "A",
      selectedChoiceLabel: legacyEnvelope.state.currentTurn.choices[0].label,
      selectedDeviationClass: legacyEnvelope.state.currentTurn.choices[0].deviationClass,
      resolvedEcho: legacyEnvelope.state.currentTurn.choices[0].instantEcho,
    }];
    const legacy = memoryStorage({
      "i-changed-history:session:v6": JSON.stringify(legacyEnvelope),
    });

    expect(loadGameSnapshot(legacy)).toMatchObject({
      phase: "selecting",
      currentTurn: null,
      playedTurns: [],
    });
    expect(legacy.getItem(GAME_STORAGE_KEY)).toContain('"version":13');
    expect(legacy.getItem("i-changed-history:session:v6")).toBeNull();
  });

  it("round-trips player-authored canon metadata without weakening the declared result", () => {
    const storage = memoryStorage();
    const selecting = createInitialGameState();
    const event = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const resolved = gameReducer(event, { type: "SUBMIT_CUSTOM_ACTION", action: "我成为新皇帝" });

    expect(saveGameSnapshot(resolved, storage)).toBe(true);
    expect(loadGameSnapshot(storage)?.playedTurns[0]).toMatchObject({
      selectedChoiceLabel: "我成为新皇帝",
      playerAuthored: true,
      canonStatus: "玩家钦定",
      causalMechanism: expect.stringContaining("继承命令"),
    });
  });

  it("returns an incompatible v7 run to selection", () => {
    const selecting = createInitialGameState();
    const event = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const current = memoryStorage();
    saveGameSnapshot(event, current);
    const envelope = JSON.parse(current.getItem(GAME_STORAGE_KEY)!);
    envelope.version = 7;
    delete envelope.state.currentTurn.turningPointStakes;
    delete envelope.state.currentTurn.worldStateChange;
    delete envelope.state.currentTurn.divergenceProof;
    const legacy = memoryStorage({ "i-changed-history:session:v7": JSON.stringify(envelope) });

    expect(loadGameSnapshot(legacy)).toMatchObject({ phase: "selecting", currentTurn: null, playedTurns: [] });
  });

  it("returns an incompatible v8 run to selection", () => {
    const selecting = createInitialGameState();
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const current = memoryStorage();
    saveGameSnapshot(generating, current);
    const envelope = JSON.parse(current.getItem(GAME_STORAGE_KEY)!);
    envelope.version = 8;
    const legacy = memoryStorage({ "i-changed-history:session:v8": JSON.stringify(envelope) });

    expect(loadGameSnapshot(legacy)).toMatchObject({
      phase: "selecting",
      scenario: null,
      playedTurns: [],
      request: null,
    });
    expect(legacy.getItem("i-changed-history:session:v8")).toBeNull();
    expect(legacy.getItem(GAME_STORAGE_KEY)).toContain('"version":13');
  });
});
