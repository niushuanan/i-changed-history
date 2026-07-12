import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { createInitialGameState, gameReducer } from "../game/reducer";
import { GAME_STORAGE_KEY, loadGameSnapshot, saveGameSnapshot } from "./storage";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "../game/schema";
import { CHAPTER_NAMES, type DecisionChapter } from "../game/timelinePlan";

const profile = { name: "林舟", occupation: "product", strengths: ["negotiation", "strategy"], riskStyle: "balanced" } as const;
function memoryStorage(initial?: Record<string, string>) { const data = new Map(Object.entries(initial ?? {})); return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } }; }

describe("v4 resumable twelve-node storage", () => {
  it("persists a traveler profile and ignores old v1 sessions", () => {
    const storage = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    expect(saveGameSnapshot(selecting, storage)).toBe(true);
    expect(loadGameSnapshot(storage)).toMatchObject({ phase: "selecting", profile });

    const old = memoryStorage({ "i-changed-history:session:v1": JSON.stringify({ version: 1, state: {} }) });
    expect(loadGameSnapshot(old)).toBeNull();
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
    expect(storage.getItem(GAME_STORAGE_KEY)).toContain('"version":4');
  });

  it("automatically resumes the 2026 ending without losing eleven decisions", () => {
    const playedTurns = Array.from({ length: 11 }, (_, index) => ({
      turn: parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: index + 1, chapterName: CHAPTER_NAMES[(index + 1) as DecisionChapter], previousEcho: index === 0 ? null : turnFixture.choices[0].instantEcho })),
      selectedChoiceId: "A" as const,
      selectedChoiceLabel: turnFixture.choices[0].label,
      selectedDeviationClass: "nudge" as const,
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
    }));
    const storage = memoryStorage();
    const state = { ...createInitialGameState(), phase: "event" as const, profile, scenario: { profile, seed: HISTORY_SEEDS[0] }, currentTurn: playedTurns[10].turn, playedTurns };
    expect(saveGameSnapshot(state as never, storage)).toBe(true);
    expect(loadGameSnapshot(storage)?.playedTurns).toHaveLength(11);
  });
});
