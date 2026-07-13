import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { createInitialGameState, gameReducer } from "../game/reducer";
import { GAME_STORAGE_KEY, loadGameSnapshot, saveGameSnapshot } from "./storage";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "../game/schema";
import { CHAPTER_NAMES, type DecisionChapter } from "../game/timelinePlan";
import { buildTravelerProfile } from "../game/profile";

const profile = buildTravelerProfile({ energy: "I", perception: "N", judgment: "T", tactics: "P" });
function memoryStorage(initial?: Record<string, string>) { const data = new Map(Object.entries(initial ?? {})); return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } }; }

describe("v8 resumable pivotal-history storage", () => {
  it("persists a traveler profile and ignores old v1 sessions", () => {
    const storage = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    expect(saveGameSnapshot(selecting, storage)).toBe(true);
    expect(loadGameSnapshot(storage)).toMatchObject({ phase: "selecting", profile });

    const old = memoryStorage({ "i-changed-history:session:v1": JSON.stringify({ version: 1, state: {} }) });
    expect(loadGameSnapshot(old)).toBeNull();
  });

  it("migrates a v4 session instead of discarding an in-progress game", () => {
    const current = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
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
      phase: "generating",
      profile: { typeCode: "ENFJ", name: "共识建造者" },
      customActionsUsed: 0,
      request: { kind: "opening", id: generating.request!.id },
    });
  });

  it("migrates an active v5 adjudication without losing its turn, request, or usage", () => {
    const current = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(generating, {
      type: "OPENING_RESOLVED",
      requestId: generating.request!.id,
      turn: parseTimelineTurn(JSON.stringify(turnFixture)),
    });
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
      phase: "adjudicating",
      profile: { typeCode: "ENFJ", name: "共识建造者" },
      scenario: { profile: { typeCode: "ENFJ" }, seed: { id: HISTORY_SEEDS[0].id } },
      currentTurn: { headline: turnFixture.headline },
      customActionsUsed: 2,
      request: { kind: "custom-action", action: "先扣下军令，再请皇帝临朝", id: adjudicating.request!.id },
    });
    expect(legacy.getItem(GAME_STORAGE_KEY)).toContain('"version":8');
    expect(legacy.getItem("i-changed-history:session:v5")).toBeNull();
  });

  it("automatically resumes an opening request interrupted by a refresh", () => {
    const storage = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    saveGameSnapshot(generating, storage);
    expect(loadGameSnapshot(storage)).toMatchObject({
      phase: "generating",
      request: { kind: "opening", id: generating.request?.id },
      error: null,
    });
    expect(storage.getItem(GAME_STORAGE_KEY)).toContain('"version":8');
  });

  it("automatically resumes the 2026 ending without losing eleven decisions", () => {
    const playedTurns = Array.from({ length: 11 }, (_, index) => ({
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
      profile,
      scenario: { profile, seed: HISTORY_SEEDS[0] },
      currentTurn: playedTurns[10].turn,
      playedTurns,
      request: { kind: "ending" as const, id: 11 },
    };

    saveGameSnapshot(state, storage);
    expect(loadGameSnapshot(storage)).toMatchObject({
      phase: "ending",
      playedTurns: expect.arrayContaining([expect.objectContaining({ selectedChoiceId: "A" })]),
      request: { kind: "ending", id: 11 },
    });
    expect(loadGameSnapshot(storage)?.playedTurns).toHaveLength(11);
  });

  it("round-trips eleven completed decisions", () => {
    const playedTurns = Array.from({ length: 11 }, (_, index) => ({
      turn: parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: index + 1, chapterName: CHAPTER_NAMES[(index + 1) as DecisionChapter], previousEcho: index === 0 ? null : turnFixture.choices[0].instantEcho })),
      selectedChoiceId: "A" as const,
      selectedChoiceLabel: turnFixture.choices[0].label,
      selectedDeviationClass: "nudge" as const,
      resolvedEcho: turnFixture.choices[0].instantEcho,
    }));
    const storage = memoryStorage();
    const state = { ...createInitialGameState(), phase: "event" as const, profile, scenario: { profile, seed: HISTORY_SEEDS[0] }, currentTurn: playedTurns[10].turn, playedTurns };
    expect(saveGameSnapshot(state as never, storage)).toBe(true);
    expect(loadGameSnapshot(storage)?.playedTurns).toHaveLength(11);
  });

  it("resumes a custom-action ruling without spending the chance early", () => {
    const storage = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(generating, {
      type: "OPENING_RESOLVED",
      requestId: generating.request!.id,
      turn: parseTimelineTurn(JSON.stringify(turnFixture)),
    });
    const adjudicating = gameReducer(event, { type: "SUBMIT_CUSTOM_ACTION", action: "先扣下军令，再请皇帝临朝" });

    expect(saveGameSnapshot(adjudicating, storage)).toBe(true);
    expect(loadGameSnapshot(storage)).toMatchObject({
      phase: "adjudicating",
      customActionsUsed: 0,
      request: { kind: "custom-action", action: "先扣下军令，再请皇帝临朝" },
    });
  });

  it("migrates a v6 active timeline by restoring ripple routing fields", () => {
    const current = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(generating, {
      type: "OPENING_RESOLVED",
      requestId: generating.request!.id,
      turn: parseTimelineTurn(JSON.stringify(turnFixture)),
    });
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
      phase: "event",
      currentTurn: {
        rippleLens: "origin",
        causalBridge: expect.stringContaining("旧时间线"),
      },
      playedTurns: [expect.objectContaining({
        turn: expect.objectContaining({ rippleLens: "origin", causalBridge: expect.stringContaining("旧时间线") }),
      })],
    });
    expect(legacy.getItem(GAME_STORAGE_KEY)).toContain('"version":8');
    expect(legacy.getItem("i-changed-history:session:v6")).toBeNull();
  });

  it("round-trips player-authored canon metadata without weakening the declared result", () => {
    const storage = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(generating, {
      type: "OPENING_RESOLVED",
      requestId: generating.request!.id,
      turn: parseTimelineTurn(JSON.stringify(turnFixture)),
    });
    const adjudicating = gameReducer(event, { type: "SUBMIT_CUSTOM_ACTION", action: "我成为新皇帝" });
    const resolved = gameReducer(adjudicating, {
      type: "CUSTOM_ACTION_RESOLVED",
      requestId: adjudicating.request!.id,
      resolution: {
        declaredOutcome: "我成为新皇帝",
        canonStatus: "玩家钦定",
        personalityLens: "INTP 优先看见制度连锁",
        causalMechanism: "登基诏书进入官署执行",
        deviationClass: "rupture",
        instantEcho: { directResult: "我成为新皇帝", unexpectedCost: "旧贵族反对", beneficiary: "新朝军民", payer: "旧宗室" },
      },
    });

    expect(saveGameSnapshot(resolved, storage)).toBe(true);
    expect(loadGameSnapshot(storage)?.playedTurns[0]).toMatchObject({
      selectedChoiceLabel: "我成为新皇帝",
      playerAuthored: true,
      canonStatus: "玩家钦定",
      causalMechanism: expect.stringContaining("宫门口令"),
    });
  });

  it("migrates a v7 active turn by supplying pivotal evidence fields", () => {
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(generating, {
      type: "OPENING_RESOLVED",
      requestId: generating.request!.id,
      turn: parseTimelineTurn(JSON.stringify(turnFixture)),
    });
    const current = memoryStorage();
    saveGameSnapshot(event, current);
    const envelope = JSON.parse(current.getItem(GAME_STORAGE_KEY)!);
    envelope.version = 7;
    delete envelope.state.currentTurn.turningPointStakes;
    delete envelope.state.currentTurn.worldStateChange;
    delete envelope.state.currentTurn.divergenceProof;
    const legacy = memoryStorage({ "i-changed-history:session:v7": JSON.stringify(envelope) });

    expect(loadGameSnapshot(legacy)?.currentTurn).toMatchObject({
      turningPointStakes: expect.stringContaining("重大"),
      worldStateChange: expect.stringContaining("旧时间线"),
      divergenceProof: expect.stringContaining("真实历史"),
    });
  });
});
