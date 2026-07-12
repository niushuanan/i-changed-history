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

  it("rejects impossible phases and deeply corrupted played turns", () => {
    const storage = new MemoryStorage();
    saveGameSnapshot(eventState(), storage);
    const valid = JSON.parse(storage.getItem(GAME_STORAGE_KEY) ?? "{}");

    storage.setItem(GAME_STORAGE_KEY, JSON.stringify({
      ...valid,
      state: { ...valid.state, phase: "echo" },
    }));
    expect(loadGameSnapshot(storage)).toBeNull();

    saveGameSnapshot(eventState(), storage);
    const withPlayedTurn = JSON.parse(storage.getItem(GAME_STORAGE_KEY) ?? "{}");
    withPlayedTurn.state.playedTurns = [{
      turn: turnFixture,
      selectedChoiceId: "A",
      selectedChoiceLabel: 42,
    }];
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify(withPlayedTurn));
    expect(loadGameSnapshot(storage)).toBeNull();
  });

  it("rejects malformed retry data and numeric state", () => {
    const storage = new MemoryStorage();
    const chosen = gameReducer(eventState(), { type: "COMMIT_AI_CHOICE", choiceId: "A" });
    saveGameSnapshot(chosen, storage);
    const snapshot = JSON.parse(storage.getItem(GAME_STORAGE_KEY) ?? "{}");
    snapshot.state.nextRequestId = -2;
    snapshot.state.error.message = 17;
    snapshot.state.error.retry.intervention = { text: "改写", deviationClass: "extreme" };
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify(snapshot));

    expect(loadGameSnapshot(storage)).toBeNull();
  });

  it("treats unavailable browser storage as an empty session", () => {
    const unavailable = {
      getItem() { throw new Error("blocked"); },
      setItem() { throw new Error("blocked"); },
      removeItem() { throw new Error("blocked"); },
    };
    expect(() => loadGameSnapshot(unavailable)).not.toThrow();
    expect(loadGameSnapshot(unavailable)).toBeNull();

    const removeBlocked = {
      getItem() { return "broken"; },
      setItem() {},
      removeItem() { throw new Error("blocked"); },
    };
    expect(() => loadGameSnapshot(removeBlocked)).not.toThrow();
    expect(loadGameSnapshot(removeBlocked)).toBeNull();
  });
});
