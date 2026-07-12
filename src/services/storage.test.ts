import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { createInitialGameState, gameReducer } from "../game/reducer";
import { GAME_STORAGE_KEY, loadGameSnapshot, saveGameSnapshot } from "./storage";

const profile = { name: "林舟", occupation: "product", strengths: ["negotiation", "strategy"], riskStyle: "balanced" } as const;
function memoryStorage(initial?: Record<string, string>) { const data = new Map(Object.entries(initial ?? {})); return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } }; }

describe("v2 profile-first storage", () => {
  it("persists a traveler profile and ignores old v1 sessions", () => {
    const storage = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    expect(saveGameSnapshot(selecting, storage)).toBe(true);
    expect(loadGameSnapshot(storage)).toMatchObject({ phase: "selecting", profile });

    const old = memoryStorage({ "i-changed-history:session:v1": JSON.stringify({ version: 1, state: {} }) });
    expect(loadGameSnapshot(old)).toBeNull();
  });

  it("turns an interrupted AI opening into a retryable error", () => {
    const storage = memoryStorage();
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const generating = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    saveGameSnapshot(generating, storage);
    expect(loadGameSnapshot(storage)).toMatchObject({ phase: "error", error: { retry: { kind: "opening" } } });
    expect(storage.getItem(GAME_STORAGE_KEY)).toContain('"version":2');
  });
});
