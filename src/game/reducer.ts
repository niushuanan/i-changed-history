import { calculateDeviation } from "./deviation";
import type { PlayedTurn } from "./prompts";
import type { AlternatePresent, CustomActionResolution, TimelineTurn } from "./schema";
import type { HistorySeed, TravelerProfile } from "./types";
import type { DecisionChapter } from "./timelinePlan";
import { buildCanonicalCustomResolution } from "./customCanon";
import { commitInstinctTurn } from "./instinctTimeline";

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
  canonStatus?: CustomActionResolution["canonStatus"];
  personalityLens?: string;
  causalMechanism?: string;
};

export type GameErrorState = { code: string; message: string; retry: RetryIntent };

export type GameState = {
  phase: GamePhase;
  profile: TravelerProfile | null;
  scenario: GameScenario | null;
  currentTurn: TimelineTurn | null;
  playedTurns: PlayedTurn[];
  instinctCurrentTurn: TimelineTurn | null;
  instinctPlayedTurns: PlayedTurn[];
  deviation: number;
  instinctDeviation: number;
  lastImpact: number;
  customActionsUsed: number;
  echo: EchoState | null;
  request: RequestIntent | null;
  pendingTurn: TimelineTurn | null;
  pendingInstinctTurn: TimelineTurn | null;
  pendingEnding: AlternatePresent | null;
  pendingInstinctEnding: AlternatePresent | null;
  result: AlternatePresent | null;
  instinctResult: AlternatePresent | null;
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
  | { type: "TURN_PAIR_RESOLVED"; requestId: number; turn: TimelineTurn; instinctTurn: TimelineTurn }
  | { type: "ENDING_PAIR_RESOLVED"; requestId: number; ending: AlternatePresent; instinctEnding: AlternatePresent }
  | { type: "CONTINUE_TIMELINE" }
  | { type: "REQUEST_FAILED"; requestId: number; code: string; message: string }
  | { type: "RETRY" }
  | { type: "RESTART" };

export function createInitialGameState(nextRequestId = 1): GameState {
  return {
    phase: "profiling", profile: null, scenario: null, currentTurn: null, playedTurns: [],
    instinctCurrentTurn: null, instinctPlayedTurns: [], deviation: 0, instinctDeviation: 0,
    lastImpact: 0, customActionsUsed: 0, echo: null, request: null, pendingTurn: null,
    pendingInstinctTurn: null, pendingEnding: null, pendingInstinctEnding: null,
    result: null, instinctResult: null, error: null, nextRequestId,
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
  if (chapter === 12) return withRequest(state, { kind: "ending" });
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
      return { ...state, phase: "event", currentTurn: action.turn, instinctCurrentTurn: action.turn, request: null, error: null };
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
      const instinctPlayedTurn = commitInstinctTurn(state.instinctCurrentTurn ?? state.currentTurn);
      const instinctImpact = calculateDeviation(state.instinctDeviation, instinctPlayedTurn.selectedDeviationClass, state.currentTurn.chapter);
      return {
        ...state,
        phase: "echo",
        playedTurns: [...state.playedTurns, playedTurn],
        instinctPlayedTurns: [...state.instinctPlayedTurns, instinctPlayedTurn],
        deviation: impact.nextDeviation,
        instinctDeviation: instinctImpact.nextDeviation,
        lastImpact: impact.stepImpact,
        echo: { source: "ai_choice", choiceLabel: choice.label, ...choice.instantEcho, ...impact },
        ...requestAfterChoice(state),
        pendingTurn: null,
        pendingInstinctTurn: null,
        pendingEnding: null,
        pendingInstinctEnding: null,
        error: null,
      };
    }
    case "SUBMIT_CUSTOM_ACTION": {
      const customAction = action.action.trim();
      if (state.phase !== "event" || !state.currentTurn || state.customActionsUsed >= 3) return state;
      if ([...customAction].length < 2 || [...customAction].length > 80) return state;
      return {
        ...state,
        phase: "adjudicating",
        ...withRequest(state, { kind: "custom-action", action: customAction }),
        error: null,
      };
    }
    case "CUSTOM_ACTION_RESOLVED": {
      if (state.request?.id !== action.requestId || state.request.kind !== "custom-action" || !state.currentTurn || !state.profile) return state;
      const impact = calculateDeviation(state.deviation, action.resolution.deviationClass, state.currentTurn.chapter);
      const canonicalResolution = buildCanonicalCustomResolution(state.profile, state.currentTurn, state.request.action, action.resolution.deviationClass);
      const canonicalOutcome = canonicalResolution.declaredOutcome;
      const canonicalEcho = canonicalResolution.instantEcho;
      const playedTurn: PlayedTurn = {
        turn: state.currentTurn,
        selectedChoiceId: "custom",
        selectedChoiceLabel: canonicalOutcome,
        selectedDeviationClass: action.resolution.deviationClass,
        resolvedEcho: canonicalEcho,
        playerAuthored: true,
        canonStatus: canonicalResolution.canonStatus,
        causalMechanism: canonicalResolution.causalMechanism,
      };
      const instinctPlayedTurn = commitInstinctTurn(state.instinctCurrentTurn ?? state.currentTurn);
      const instinctImpact = calculateDeviation(state.instinctDeviation, instinctPlayedTurn.selectedDeviationClass, state.currentTurn.chapter);
      return {
        ...state,
        phase: "echo",
        playedTurns: [...state.playedTurns, playedTurn],
        instinctPlayedTurns: [...state.instinctPlayedTurns, instinctPlayedTurn],
        deviation: impact.nextDeviation,
        instinctDeviation: instinctImpact.nextDeviation,
        lastImpact: impact.stepImpact,
        customActionsUsed: Math.min(3, state.customActionsUsed + 1),
        echo: {
          source: "custom_action",
          choiceLabel: canonicalOutcome,
          canonStatus: canonicalResolution.canonStatus,
          personalityLens: canonicalResolution.personalityLens,
          causalMechanism: canonicalResolution.causalMechanism,
          ...canonicalEcho,
          ...impact,
        },
        ...requestAfterChoice(state),
        pendingTurn: null,
        pendingInstinctTurn: null,
        pendingEnding: null,
        pendingInstinctEnding: null,
        error: null,
      };
    }
    case "TURN_PAIR_RESOLVED":
      if (state.request?.id !== action.requestId || state.request.kind !== "next-turn") return state;
      if (state.phase === "echo") return { ...state, pendingTurn: action.turn, pendingInstinctTurn: action.instinctTurn, request: null };
      if (state.phase !== "generating") return state;
      return { ...state, phase: "event", currentTurn: action.turn, instinctCurrentTurn: action.instinctTurn, request: null, pendingTurn: null, pendingInstinctTurn: null, error: null };
    case "ENDING_PAIR_RESOLVED":
      if (state.request?.id !== action.requestId || state.request.kind !== "ending") return state;
      if (state.phase === "echo") return { ...state, pendingEnding: action.ending, pendingInstinctEnding: action.instinctEnding, request: null };
      if (state.phase !== "ending") return state;
      return { ...state, phase: "result", result: action.ending, instinctResult: action.instinctEnding, request: null, pendingEnding: null, pendingInstinctEnding: null, error: null };
    case "CONTINUE_TIMELINE":
      if (state.phase !== "echo") return state;
      if (state.error) return { ...state, phase: "error", echo: null };
      if (state.pendingTurn && state.pendingInstinctTurn) return { ...state, phase: "event", currentTurn: state.pendingTurn, instinctCurrentTurn: state.pendingInstinctTurn, pendingTurn: null, pendingInstinctTurn: null, echo: null };
      if (state.pendingEnding && state.pendingInstinctEnding) return { ...state, phase: "result", result: state.pendingEnding, instinctResult: state.pendingInstinctEnding, pendingEnding: null, pendingInstinctEnding: null, echo: null };
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
