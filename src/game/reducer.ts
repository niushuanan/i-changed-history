import { calculateDeviation } from "./deviation";
import type { PlayedTurn } from "./prompts";
import type { AlternatePresent, CustomActionResolution, TimelineTurn } from "./schema";
import type { HistorySeed, TravelerProfile } from "./types";
import type { DecisionChapter } from "./timelinePlan";

export type GamePhase = "profiling" | "selecting" | "generating" | "adjudicating" | "event" | "echo" | "ending" | "result" | "error";
export type GameScenario = { profile: TravelerProfile; seed: HistorySeed };
export type RetryIntent =
  | { kind: "opening" }
  | { kind: "next-turn"; targetChapter: Exclude<DecisionChapter, 1> }
  | { kind: "custom-action"; action: string }
  | { kind: "ending" };
export type RequestIntent = RetryIntent & { id: number };

export type EchoState = {
  source: "ai_choice" | "custom_action";
  choiceLabel: string;
  directResult: string;
  unexpectedCost: string;
  beneficiary: string;
  payer: string;
  stepImpact: number;
  nextDeviation: number;
  ruling?: CustomActionResolution["ruling"];
  personalityLeverage?: string;
  constraintApplied?: string;
};

export type GameErrorState = { code: string; message: string; retry: RetryIntent };

export type GameState = {
  phase: GamePhase;
  profile: TravelerProfile | null;
  scenario: GameScenario | null;
  currentTurn: TimelineTurn | null;
  playedTurns: PlayedTurn[];
  deviation: number;
  lastImpact: number;
  customActionsUsed: number;
  echo: EchoState | null;
  request: RequestIntent | null;
  pendingTurn: TimelineTurn | null;
  pendingEnding: AlternatePresent | null;
  result: AlternatePresent | null;
  error: GameErrorState | null;
  nextRequestId: number;
};

export type GameAction =
  | { type: "SET_PROFILE"; profile: TravelerProfile }
  | { type: "CHANGE_PROFILE" }
  | { type: "START_SCENARIO"; seed: HistorySeed }
  | { type: "OPENING_RESOLVED"; requestId: number; turn: TimelineTurn }
  | { type: "COMMIT_AI_CHOICE"; choiceId: "A" | "B" | "C" }
  | { type: "SUBMIT_CUSTOM_ACTION"; action: string }
  | { type: "CUSTOM_ACTION_RESOLVED"; requestId: number; resolution: CustomActionResolution }
  | { type: "TURN_RESOLVED"; requestId: number; turn: TimelineTurn }
  | { type: "ENDING_RESOLVED"; requestId: number; ending: AlternatePresent }
  | { type: "CONTINUE_TIMELINE" }
  | { type: "REQUEST_FAILED"; requestId: number; code: string; message: string }
  | { type: "RETRY" }
  | { type: "RESTART" };

export function createInitialGameState(nextRequestId = 1): GameState {
  return {
    phase: "profiling", profile: null, scenario: null, currentTurn: null, playedTurns: [],
    deviation: 0, lastImpact: 0, customActionsUsed: 0, echo: null, request: null, pendingTurn: null,
    pendingEnding: null, result: null, error: null, nextRequestId,
  };
}

function withRequest(state: GameState, intent: RetryIntent) {
  return { request: { ...intent, id: state.nextRequestId } as RequestIntent, nextRequestId: state.nextRequestId + 1 };
}

function cleanSession(state: GameState): GameState {
  return {
    ...createInitialGameState(state.nextRequestId),
    profile: state.profile,
    phase: state.profile ? "selecting" : "profiling",
  };
}

function requestAfterChoice(state: GameState) {
  const chapter = state.currentTurn?.chapter;
  if (chapter === 11) return withRequest(state, { kind: "ending" });
  if (!chapter) return { request: null, nextRequestId: state.nextRequestId };
  return withRequest(state, { kind: "next-turn", targetChapter: (chapter + 1) as Exclude<DecisionChapter, 1> });
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PROFILE":
      if (state.phase !== "profiling") return state;
      return { ...cleanSession(state), profile: action.profile, phase: "selecting" };
    case "CHANGE_PROFILE":
      return createInitialGameState(state.nextRequestId);
    case "START_SCENARIO":
      if (state.phase !== "selecting" || !state.profile) return state;
      return {
        ...state,
        phase: "generating",
        scenario: { profile: state.profile, seed: action.seed },
        ...withRequest(state, { kind: "opening" }),
        error: null,
      };
    case "OPENING_RESOLVED":
      if (state.request?.id !== action.requestId || state.request.kind !== "opening") return state;
      return { ...state, phase: "event", currentTurn: action.turn, request: null, error: null };
    case "COMMIT_AI_CHOICE": { 
      if (state.phase !== "event" || !state.currentTurn) return state;
      const choice = state.currentTurn.choices.find((candidate) => candidate.id === action.choiceId);
      if (!choice) return state;
      const impact = calculateDeviation(state.deviation, choice.deviationClass, state.currentTurn.chapter);
      const playedTurn: PlayedTurn = {
        turn: state.currentTurn,
        selectedChoiceId: choice.id,
        selectedChoiceLabel: choice.label,
        selectedDeviationClass: choice.deviationClass,
        resolvedEcho: choice.instantEcho,
      };
      return {
        ...state,
        phase: "echo",
        playedTurns: [...state.playedTurns, playedTurn],
        deviation: impact.nextDeviation,
        lastImpact: impact.stepImpact,
        echo: { source: "ai_choice", choiceLabel: choice.label, ...choice.instantEcho, ...impact },
        ...requestAfterChoice(state),
        pendingTurn: null,
        pendingEnding: null,
        error: null,
      };
    }
    case "SUBMIT_CUSTOM_ACTION": {
      const customAction = action.action.trim();
      if (state.phase !== "event" || !state.currentTurn || state.customActionsUsed >= 3) return state;
      if ([...customAction].length < 2 || [...customAction].length > 56) return state;
      return {
        ...state,
        phase: "adjudicating",
        ...withRequest(state, { kind: "custom-action", action: customAction }),
        error: null,
      };
    }
    case "CUSTOM_ACTION_RESOLVED": {
      if (state.request?.id !== action.requestId || state.request.kind !== "custom-action" || !state.currentTurn) return state;
      const impact = calculateDeviation(state.deviation, action.resolution.deviationClass, state.currentTurn.chapter);
      const playedTurn: PlayedTurn = {
        turn: state.currentTurn,
        selectedChoiceId: "custom",
        selectedChoiceLabel: action.resolution.normalizedAction,
        selectedDeviationClass: action.resolution.deviationClass,
        resolvedEcho: action.resolution.instantEcho,
      };
      return {
        ...state,
        phase: "echo",
        playedTurns: [...state.playedTurns, playedTurn],
        deviation: impact.nextDeviation,
        lastImpact: impact.stepImpact,
        customActionsUsed: Math.min(3, state.customActionsUsed + 1),
        echo: {
          source: "custom_action",
          choiceLabel: action.resolution.normalizedAction,
          ruling: action.resolution.ruling,
          personalityLeverage: action.resolution.personalityLeverage,
          constraintApplied: action.resolution.constraintApplied,
          ...action.resolution.instantEcho,
          ...impact,
        },
        ...requestAfterChoice(state),
        pendingTurn: null,
        pendingEnding: null,
        error: null,
      };
    }
    case "TURN_RESOLVED":
      if (state.request?.id !== action.requestId || state.request.kind !== "next-turn") return state;
      if (state.phase === "echo") return { ...state, pendingTurn: action.turn, request: null };
      if (state.phase !== "generating") return state;
      return { ...state, phase: "event", currentTurn: action.turn, request: null, pendingTurn: null, error: null };
    case "ENDING_RESOLVED":
      if (state.request?.id !== action.requestId || state.request.kind !== "ending") return state;
      if (state.phase === "echo") return { ...state, pendingEnding: action.ending, request: null };
      if (state.phase !== "ending") return state;
      return { ...state, phase: "result", result: action.ending, request: null, pendingEnding: null, error: null };
    case "CONTINUE_TIMELINE":
      if (state.phase !== "echo") return state;
      if (state.error) return { ...state, phase: "error", echo: null };
      if (state.pendingTurn) return { ...state, phase: "event", currentTurn: state.pendingTurn, pendingTurn: null, echo: null };
      if (state.pendingEnding) return { ...state, phase: "result", result: state.pendingEnding, pendingEnding: null, echo: null };
      if (state.request?.kind === "ending") return { ...state, phase: "ending", echo: null };
      return { ...state, phase: "generating", echo: null };
    case "REQUEST_FAILED":
      if (state.request?.id !== action.requestId) return state;
      return {
        ...state,
        error: {
          code: action.code,
          message: action.message,
          retry: state.request.kind === "next-turn"
            ? { kind: "next-turn", targetChapter: state.request.targetChapter }
            : state.request.kind === "custom-action"
              ? { kind: "custom-action", action: state.request.action }
              : { kind: state.request.kind },
        },
        request: null,
        phase: state.phase === "echo" ? "echo" : "error",
      };
    case "RETRY":
      if (state.phase !== "error" || !state.error) return state;
      return {
        ...state,
        phase: state.error.retry.kind === "ending"
          ? "ending"
          : state.error.retry.kind === "custom-action"
            ? "adjudicating"
            : "generating",
        ...withRequest(state, state.error.retry),
        error: null,
      };
    case "RESTART":
      return cleanSession(state);
    default:
      return state;
  }
}
