import { alternatePresentSchema, timelineTurnSchema } from "../game/schema";
import type { GameErrorState, GamePhase, GameState, RetryIntent } from "../game/reducer";

export const GAME_STORAGE_KEY = "i-changed-history:session:v1";
const STORAGE_VERSION = 1;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

type StoredState = Omit<GameState, "request" | "pendingTurn" | "pendingEnding" | "echo">;

function retryWithoutId(request: NonNullable<GameState["request"]>): RetryIntent {
  if (request.kind === "next-turn") {
    return {
      kind: "next-turn",
      targetChapter: request.targetChapter,
      ...(request.intervention ? { intervention: request.intervention } : {}),
    };
  }
  return { kind: request.kind };
}

function storedBase(state: GameState): Omit<StoredState, "phase" | "error"> {
  return {
    scenario: state.scenario,
    currentTurn: state.currentTurn,
    playedTurns: state.playedTurns,
    deviation: state.deviation,
    lastImpact: state.lastImpact,
    result: state.result,
    nextRequestId: state.nextRequestId,
  };
}

function interruptedError(retry: RetryIntent): GameErrorState {
  return {
    code: "interrupted",
    message: "上次推演因页面刷新中断，可以从当前时间线继续。",
    retry,
  };
}

function toStoredState(state: GameState): StoredState | null {
  if (state.pendingTurn) {
    return {
      ...storedBase(state),
      phase: "event",
      currentTurn: state.pendingTurn,
      error: null,
    };
  }

  if (state.pendingEnding) {
    return {
      ...storedBase(state),
      phase: "result",
      result: state.pendingEnding,
      error: null,
    };
  }

  if (state.request) {
    return {
      ...storedBase(state),
      phase: "error",
      error: interruptedError(retryWithoutId(state.request)),
    };
  }

  if (state.phase === "echo" && state.error) {
    return { ...storedBase(state), phase: "error", error: state.error };
  }

  if (["selecting", "event", "result", "error"].includes(state.phase)) {
    return {
      ...storedBase(state),
      phase: state.phase,
      error: state.error,
    };
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPhase(value: unknown): value is GamePhase {
  return ["selecting", "generating", "event", "echo", "ending", "result", "error"].includes(
    String(value),
  );
}

function isRetryIntent(value: unknown): value is RetryIntent {
  if (!isRecord(value)) return false;
  if (value.kind === "opening" || value.kind === "ending") return true;
  return value.kind === "next-turn" && [2, 3, 4, 5].includes(Number(value.targetChapter));
}

function isStoredState(value: unknown): value is StoredState {
  if (!isRecord(value) || !isPhase(value.phase)) return false;
  if (!Array.isArray(value.playedTurns)) return false;
  if (!Number.isFinite(value.deviation) || !Number.isFinite(value.nextRequestId)) return false;
  if (value.currentTurn !== null && !timelineTurnSchema.safeParse(value.currentTurn).success) return false;
  if (value.result !== null && !alternatePresentSchema.safeParse(value.result).success) return false;

  if (value.phase === "event" && value.currentTurn === null) return false;
  if (value.phase === "result" && value.result === null) return false;
  if (value.phase === "error") {
    if (!isRecord(value.error) || !isRetryIntent(value.error.retry)) return false;
  }
  return true;
}

export function saveGameSnapshot(
  state: GameState,
  storage: StorageLike = localStorage,
): boolean {
  const stable = toStoredState(state);
  if (!stable) return false;

  try {
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state: stable }));
    return true;
  } catch {
    return false;
  }
}

export function loadGameSnapshot(storage: StorageLike = localStorage): GameState | null {
  const raw = storage.getItem(GAME_STORAGE_KEY);
  if (raw === null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== STORAGE_VERSION || !isStoredState(parsed.state)) {
      throw new Error("invalid snapshot");
    }

    return {
      ...parsed.state,
      request: null,
      pendingTurn: null,
      pendingEnding: null,
      echo: null,
    };
  } catch {
    storage.removeItem(GAME_STORAGE_KEY);
    return null;
  }
}
