import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "../game/schema";
import { createInitialGameState, gameReducer } from "../game/reducer";
import { GAME_STORAGE_KEY, loadGameSnapshot, saveGameSnapshot } from "./storage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return Array.from(this.values.keys())[index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

function eventState() {
  const started = gameReducer(createInitialGameState(), {
    type: "START_SCENARIO",
    scenario: HISTORY_SEEDS[0],
  });
  return gameReducer(started, {
    type: "OPENING_RESOLVED",
    requestId: started.request?.id ?? -1,
    turn: parseTimelineTurn(JSON.stringify(turnFixture)),
  });
}

describe("versioned game storage", () => {
  it("round-trips a stable event without request-only state", () => {
    const storage = new MemoryStorage();
    expect(saveGameSnapshot(eventState(), storage)).toBe(true);
    expect(loadGameSnapshot(storage)).toMatchObject({ phase: "event", currentTurn: { chapter: 1 } });

    const raw = storage.getItem(GAME_STORAGE_KEY) ?? "";
    expect(raw).not.toContain("VITE_DEEPSEEK_API_KEY");
    expect(raw).not.toContain("AbortController");
    expect(raw).not.toContain('"request"');
  });

  it("turns an in-flight request into a recoverable retry snapshot", () => {
    const storage = new MemoryStorage();
    const chosen = gameReducer(eventState(), { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    expect(saveGameSnapshot(chosen, storage)).toBe(true);

    expect(loadGameSnapshot(storage)).toMatchObject({
      phase: "error",
      request: null,
      error: { retry: { kind: "next-turn", targetChapter: 2 } },
      playedTurns: [{ selectedChoiceId: "A" }],
    });
  });

  it("clears invalid JSON and unsupported versions", () => {
    const storage = new MemoryStorage();
    storage.setItem(GAME_STORAGE_KEY, "not json");
    expect(loadGameSnapshot(storage)).toBeNull();
    expect(storage.getItem(GAME_STORAGE_KEY)).toBeNull();

    storage.setItem(GAME_STORAGE_KEY, JSON.stringify({ version: 99, state: {} }));
    expect(loadGameSnapshot(storage)).toBeNull();
    expect(storage.getItem(GAME_STORAGE_KEY)).toBeNull();
  });
});
