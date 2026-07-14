import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { generateEnding, generateNextTurn } from "../game/engine";
import {
  createInitialGameState,
  gameReducer,
  type GameState,
} from "../game/reducer";
import { getDeviationStage } from "../game/deviation";
import type { HistorySeed } from "../game/types";
import { createEpicAudioController, type EpicAudioController } from "../services/audio";
import { loadGameSnapshot, saveGameSnapshot } from "../services/storage";
import type {
  DeepSeekPartialDraft,
  DeepSeekProgressStage,
  DeepSeekRequestMetrics,
} from "../services/deepseek";

export type UseGameDependencies = {
  generateNextTurn: typeof generateNextTurn;
  generateEnding: typeof generateEnding;
  loadSnapshot: () => GameState | null;
  saveSnapshot: (state: GameState) => boolean;
  audio: EpicAudioController;
};

const PROGRESS_RANK: Record<DeepSeekProgressStage, number> = {
  connected: 0,
  reasoning: 1,
  writing: 2,
  validating: 3,
  repairing: 4,
};

function resolveDependencies(overrides: Partial<UseGameDependencies>): UseGameDependencies {
  return {
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
  const audioUnlockRef = useRef(false);
  const [muted, setMutedState] = useState(() => dependencies.audio.isMuted());
  const [generationStage, setGenerationStage] = useState<DeepSeekProgressStage>("connected");
  const [generationDraft, setGenerationDraft] = useState<DeepSeekPartialDraft | null>(null);
  const [generationMetrics, setGenerationMetrics] = useState<readonly DeepSeekRequestMetrics[]>([]);
  const generationStageRef = useRef<DeepSeekProgressStage>("connected");

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
    generationStageRef.current = "connected";
    setGenerationStage("connected");
    setGenerationDraft(null);
    const onProgress = (stage: DeepSeekProgressStage) => {
      if (!active || PROGRESS_RANK[stage] < PROGRESS_RANK[generationStageRef.current]) return;
      generationStageRef.current = stage;
      setGenerationStage(stage);
    };
    const onPartial = (draft: DeepSeekPartialDraft) => {
      if (!active) return;
      setGenerationDraft((current) => ({ ...current, ...draft }));
    };
    const onMetrics = (metrics: DeepSeekRequestMetrics) => {
      if (!active) return;
      setGenerationMetrics((current) => [...current.slice(-49), metrics]);
    };

    const run = async () => {
      try {
        if (request.kind === "next-turn") {
          const turn = await dependencies.generateNextTurn(scenario, state.playedTurns, request.targetChapter, {
            signal: controller.signal,
            onProgress,
            onPartial,
            onMetrics,
          });
          if (active) dispatch({ type: "TURN_RESOLVED", requestId: request.id, turn });
          return;
        }

        const ending = await dependencies.generateEnding(scenario, state.playedTurns, {
          signal: controller.signal,
          onProgress,
          onMetrics,
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

  const startExperience = useCallback(async () => {
    if (audioUnlockRef.current) return true;
    audioUnlockRef.current = true;
    const started = await dependencies.audio.start();
    if (!started) audioUnlockRef.current = false;
    return started;
  }, [dependencies]);

  const selectSeed = useCallback((seed: HistorySeed) => {
    void startExperience();
    dispatch({ type: "START_SCENARIO", seed });
  }, [startExperience]);


  const choose = useCallback((choiceId: "A" | "B" | "C") => {
    dispatch({ type: "COMMIT_AI_CHOICE", choiceId });
  }, []);
  const submitCustomAction = useCallback((action: string) => {
    dispatch({ type: "SUBMIT_CUSTOM_ACTION", action });
  }, []);

  const continueTimeline = useCallback(() => dispatch({ type: "CONTINUE_TIMELINE" }), []);
  const revealGeneratedTurn = useCallback(() => dispatch({ type: "REVEAL_GENERATED_TURN" }), []);
  const retry = useCallback(() => dispatch({ type: "RETRY" }), []);
  const restart = useCallback(() => {
    requestControllerRef.current?.abort();
    dispatch({ type: "RESTART" });
  }, []);
  const toggleMute = useCallback(() => {
    const next = dependencies.audio.toggleMuted();
    setMutedState(next);
    if (!next) void startExperience();
    return next;
  }, [dependencies, startExperience]);

  return {
    state,
    deviationStage: getDeviationStage(state.deviation),
    muted,
    generationStage,
    generationDraft,
    generationMetrics,
    startExperience,
    selectSeed,
    choose,
    submitCustomAction,
    continueTimeline,
    revealGeneratedTurn,
    retry,
    restart,
    toggleMute,
  };
}
