import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { generateEnding, generateNextTurn, generateOpening } from "../game/engine";
import {
  createInitialGameState,
  gameReducer,
  type GameState,
} from "../game/reducer";
import { getDeviationStage } from "../game/deviation";
import type { HistorySeed, TravelerProfile } from "../game/types";
import { createEpicAudioController, type EpicAudioController } from "../services/audio";
import { loadGameSnapshot, saveGameSnapshot } from "../services/storage";

export type UseGameDependencies = {
  generateOpening: typeof generateOpening;
  generateNextTurn: typeof generateNextTurn;
  generateEnding: typeof generateEnding;
  loadSnapshot: () => GameState | null;
  saveSnapshot: (state: GameState) => boolean;
  audio: EpicAudioController;
};

function resolveDependencies(overrides: Partial<UseGameDependencies>): UseGameDependencies {
  return {
    generateOpening,
    generateNextTurn,
    generateEnding,
    loadSnapshot: () => loadGameSnapshot(),
    saveSnapshot: (state) => saveGameSnapshot(state),
    audio: createEpicAudioController(),
    ...overrides,
  };
}

function errorDetails(error: unknown): { code: string; message: string } {
  if (typeof error === "object" && error !== null) {
    const value = error as { code?: unknown; message?: unknown };
    return {
      code: typeof value.code === "string" ? value.code : "request_failed",
      message: typeof value.message === "string" ? value.message : "这一幕推演失败，请重试。",
    };
  }
  return { code: "request_failed", message: "这一幕推演失败，请重试。" };
}

export function useGame(overrides: Partial<UseGameDependencies> = {}) {
  const dependenciesRef = useRef<UseGameDependencies | null>(null);
  if (dependenciesRef.current === null) dependenciesRef.current = resolveDependencies(overrides);
  const dependencies = dependenciesRef.current;

  const initialStateRef = useRef<GameState | null>(null);
  if (initialStateRef.current === null) {
    initialStateRef.current = dependencies.loadSnapshot() ?? createInitialGameState();
  }
  const [state, dispatch] = useReducer(gameReducer, initialStateRef.current);
  const requestControllerRef = useRef<AbortController | null>(null);
  const [muted, setMutedState] = useState(() => dependencies.audio.isMuted());

  useLayoutEffect(() => {
    dependencies.saveSnapshot(state);
  }, [dependencies, state]);

  useEffect(() => {
    if (state.phase === "result") {
      dependencies.audio.setChapter("result");
    } else if (state.currentTurn) {
      dependencies.audio.setChapter(state.currentTurn.chapter);
    }
  }, [dependencies, state.currentTurn?.chapter, state.phase]);

  useEffect(() => {
    const request = state.request;
    const scenario = state.scenario;
    if (!request || !scenario) return undefined;

    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    let active = true;

    const run = async () => {
      try {
        if (request.kind === "opening") {
          const turn = await dependencies.generateOpening(scenario, { signal: controller.signal });
          if (active) dispatch({ type: "OPENING_RESOLVED", requestId: request.id, turn });
          return;
        }

        if (request.kind === "next-turn") {
          const turn = await dependencies.generateNextTurn(
            scenario,
            state.playedTurns,
            request.targetChapter,
            {
              signal: controller.signal,
            },
          );
          if (active) dispatch({ type: "TURN_RESOLVED", requestId: request.id, turn });
          return;
        }

        const ending = await dependencies.generateEnding(scenario, state.playedTurns, {
          signal: controller.signal,
        });
        if (active) dispatch({ type: "ENDING_RESOLVED", requestId: request.id, ending });
      } catch (error) {
        if (!active) return;
        dispatch({ type: "REQUEST_FAILED", requestId: request.id, ...errorDetails(error) });
      }
    };

    void run();
    return () => {
      active = false;
      controller.abort();
      if (requestControllerRef.current === controller) requestControllerRef.current = null;
    };
  }, [dependencies, state.request?.id]);

  useEffect(() => () => {
    requestControllerRef.current?.abort();
    dependencies.audio.dispose();
  }, [dependencies]);

  const selectSeed = useCallback((seed: HistorySeed) => {
    void dependencies.audio.start();
    dispatch({ type: "START_SCENARIO", seed });
  }, [dependencies]);

  const setProfile = useCallback((profile: TravelerProfile) => dispatch({ type: "SET_PROFILE", profile }), []);
  const changeProfile = useCallback(() => dispatch({ type: "CHANGE_PROFILE" }), []);

  const choose = useCallback((choiceId: "A" | "B" | "C") => {
    dispatch({ type: "COMMIT_AI_CHOICE", choiceId });
  }, []);

  const continueTimeline = useCallback(() => dispatch({ type: "CONTINUE_TIMELINE" }), []);
  const retry = useCallback(() => dispatch({ type: "RETRY" }), []);
  const restart = useCallback(() => {
    requestControllerRef.current?.abort();
    dependencies.audio.stop();
    dispatch({ type: "RESTART" });
  }, [dependencies]);
  const toggleMute = useCallback(() => {
    const next = dependencies.audio.toggleMuted();
    setMutedState(next);
    return next;
  }, [dependencies]);

  return {
    state,
    deviationStage: getDeviationStage(state.deviation),
    muted,
    setProfile,
    changeProfile,
    selectSeed,
    choose,
    continueTimeline,
    retry,
    restart,
    toggleMute,
  };
}
