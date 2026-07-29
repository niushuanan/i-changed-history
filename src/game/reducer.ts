import { calculateDeviation } from "./deviation";
import type { PlayedTurn } from "./prompts";
import type { AlternatePresent, CustomActionResolution, TimelineTurn } from "./schema";
import type { HistorySeed } from "./types";
import type { DecisionChapter } from "./timelinePlan";
import { buildCanonicalCustomResolution } from "./customCanon";
import { getFixedOpening } from "../data/fixedOpenings";
import { CUSTOM_ACTION_MAX_LENGTH } from "./limits";

export type GamePhase = "selecting" | "generating" | "event" | "echo" | "ending" | "result" | "error";
export type GameScenario = { seed: HistorySeed };
export type RetryIntent =
  | { kind: "next-turn"; targetChapter: Exclude<DecisionChapter, 1> }
  | { kind: "ending" };
export type RequestIntent =
  | (RetryIntent & { id: number })
  | { kind: "roll-choices"; rollNumber: 2 | 3; id: number };
type RequestWithoutId = RetryIntent | { kind: "roll-choices"; rollNumber: 2 | 3 };

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
  causalMechanism?: string;
};

export type GameErrorState = { code: string; message: string; retry: RetryIntent };

export type GameState = {
  phase: GamePhase;
  scenario: GameScenario | null;
  currentTurn: TimelineTurn | null;
  playedTurns: PlayedTurn[];
  deviation: number;
  lastImpact: number;
  customActionsUsed: number;
  rollCount: number;
  dynamicChoices: TimelineTurn["choices"] | null;
  rollLoading: boolean;
  rollError: string | null;
  unlockedSeedIds: string[];
  echo: EchoState | null;
  request: RequestIntent | null;
  pendingTurn: TimelineTurn | null;
  pendingEnding: AlternatePresent | null;
  result: AlternatePresent | null;
  error: GameErrorState | null;
  nextRequestId: number;
};

export type GameAction =
  | { type: "START_SCENARIO"; seed: HistorySeed }
  | { type: "ROLL_CHOICES" }
  | { type: "ROLL_CHOICES_RESOLVED"; requestId: number; choices: TimelineTurn["choices"] }
  | { type: "ROLL_CHOICES_FAILED"; requestId: number; message: string }
  | { type: "COMMIT_AI_CHOICE"; choiceId: "A" | "B" | "C" }
  | { type: "SUBMIT_CUSTOM_ACTION"; action: string }
  | { type: "TURN_RESOLVED"; requestId: number; turn: TimelineTurn }
  | { type: "ENDING_RESOLVED"; requestId: number; ending: AlternatePresent }
  | { type: "CONTINUE_TIMELINE" }
  | { type: "REVEAL_GENERATED_TURN" }
  | { type: "REQUEST_FAILED"; requestId: number; code: string; message: string }
  | { type: "RETRY" }
  | { type: "RESTART" };

export function createInitialGameState(nextRequestId = 1): GameState {
  return {
    phase: "selecting", scenario: null, currentTurn: null, playedTurns: [],
    deviation: 0, lastImpact: 0, customActionsUsed: 0,
    rollCount: 0, dynamicChoices: null, rollLoading: false, rollError: null, unlockedSeedIds: [],
    echo: null, request: null,
    pendingTurn: null, pendingEnding: null, result: null, error: null, nextRequestId,
  };
}

function withRequest(state: GameState, intent: RequestWithoutId) {
  return { request: { ...intent, id: state.nextRequestId } as RequestIntent, nextRequestId: state.nextRequestId + 1 };
}

function cleanSession(state: GameState): GameState {
  return {
    ...createInitialGameState(state.nextRequestId),
    unlockedSeedIds: state.unlockedSeedIds,
  };
}

function unlockCurrentScenario(state: GameState): string[] {
  const seedId = state.scenario?.seed.id;
  if (!seedId || state.unlockedSeedIds.includes(seedId)) return state.unlockedSeedIds;
  return [...state.unlockedSeedIds, seedId];
}

function requestAfterChoice(state: GameState) {
  const chapter = state.currentTurn?.chapter;
  if (chapter === 4) return withRequest(state, { kind: "ending" });
  if (!chapter) return { request: null, nextRequestId: state.nextRequestId };
  return withRequest(state, { kind: "next-turn", targetChapter: (chapter + 1) as Exclude<DecisionChapter, 1> });
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_SCENARIO":
      if (state.phase !== "selecting") return state;
      return {
        ...state,
        phase: "event",
        scenario: { seed: action.seed },
        currentTurn: getFixedOpening(action.seed),
        rollCount: 0,
        dynamicChoices: null,
        rollLoading: false,
        rollError: null,
        request: null,
        error: null,
      };
    case "ROLL_CHOICES":
      if (state.phase !== "event" || !state.currentTurn || state.rollLoading || state.rollCount >= 3) return state;
      if (state.rollCount === 0) {
        return {
          ...state,
          rollCount: 1,
          dynamicChoices: null,
          rollError: null,
        };
      }
      return {
        ...state,
        rollLoading: true,
        rollError: null,
        ...withRequest(state, {
          kind: "roll-choices",
          rollNumber: (state.rollCount + 1) as 2 | 3,
        }),
      };
    case "ROLL_CHOICES_RESOLVED":
      if (
        state.phase !== "event"
        || state.request?.kind !== "roll-choices"
        || state.request.id !== action.requestId
      ) return state;
      return {
        ...state,
        rollCount: state.request.rollNumber,
        dynamicChoices: action.choices,
        rollLoading: false,
        rollError: null,
        request: null,
      };
    case "ROLL_CHOICES_FAILED":
      if (
        state.phase !== "event"
        || state.request?.kind !== "roll-choices"
        || state.request.id !== action.requestId
      ) return state;
      return {
        ...state,
        rollLoading: false,
        rollError: action.message,
        request: null,
      };
    case "COMMIT_AI_CHOICE": {
      if (state.phase !== "event" || !state.currentTurn || state.rollLoading) return state;
      const visibleChoices = state.rollCount === 0
        ? state.currentTurn.choices
        : state.rollCount === 1
          ? state.currentTurn.rollChoices
          : state.dynamicChoices;
      if (!visibleChoices) return state;
      const choice = visibleChoices.find((candidate) => candidate.id === action.choiceId);
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
        unlockedSeedIds: state.currentTurn.chapter === 4
          ? unlockCurrentScenario(state)
          : state.unlockedSeedIds,
        echo: { source: "ai_choice", choiceLabel: choice.label, ...choice.instantEcho, ...impact },
        ...requestAfterChoice(state),
        pendingTurn: null,
        pendingEnding: null,
        error: null,
      };
    }
    case "SUBMIT_CUSTOM_ACTION": {
      const customAction = action.action.trim();
      if (state.phase !== "event" || !state.currentTurn) return state;
      if ([...customAction].length < 2 || [...customAction].length > CUSTOM_ACTION_MAX_LENGTH) return state;
      const canonicalResolution = buildCanonicalCustomResolution(
        state.currentTurn,
        customAction,
        "rupture",
      );
      const canonicalOutcome = canonicalResolution.declaredOutcome;
      const canonicalEcho = canonicalResolution.instantEcho;
      const playedTurn: PlayedTurn = {
        turn: state.currentTurn,
        selectedChoiceId: "custom",
        selectedChoiceLabel: canonicalOutcome,
        selectedDeviationClass: "rupture",
        resolvedEcho: canonicalEcho,
        playerAuthored: true,
        canonStatus: canonicalResolution.canonStatus,
        causalMechanism: canonicalResolution.causalMechanism,
      };
      const impact = calculateDeviation(state.deviation, "rupture", state.currentTurn.chapter);
      return {
        ...state,
        phase: state.currentTurn.chapter === 4 ? "ending" : "generating",
        playedTurns: [...state.playedTurns, playedTurn],
        deviation: impact.nextDeviation,
        lastImpact: impact.stepImpact,
        customActionsUsed: state.customActionsUsed + 1,
        unlockedSeedIds: state.currentTurn.chapter === 4
          ? unlockCurrentScenario(state)
          : state.unlockedSeedIds,
        echo: null,
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
      return { ...state, pendingTurn: action.turn, request: null, error: null };
    case "ENDING_RESOLVED":
      if (state.request?.id !== action.requestId || state.request.kind !== "ending") return state;
      const unlockedSeedIds = unlockCurrentScenario(state);
      if (state.phase === "echo") return { ...state, pendingEnding: action.ending, request: null, unlockedSeedIds };
      if (state.phase !== "ending") return state;
      return {
        ...state,
        phase: "result",
        result: action.ending,
        request: null,
        pendingEnding: null,
        error: null,
        unlockedSeedIds,
      };
    case "CONTINUE_TIMELINE":
      if (state.phase !== "echo") return state;
      if (state.error) return { ...state, phase: "error", echo: null };
      if (state.pendingTurn) return { ...state, phase: "generating", echo: null };
      if (state.pendingEnding) return { ...state, phase: "result", result: state.pendingEnding, pendingEnding: null, echo: null };
      if (state.request?.kind === "ending") return { ...state, phase: "ending", echo: null };
      return { ...state, phase: "generating", echo: null };
    case "REVEAL_GENERATED_TURN":
      if (state.phase !== "generating" || !state.pendingTurn) return state;
      return {
        ...state,
        phase: "event",
        currentTurn: state.pendingTurn,
        rollCount: 0,
        dynamicChoices: null,
        rollLoading: false,
        rollError: null,
        pendingTurn: null,
        error: null,
      };
    case "REQUEST_FAILED":
      if (state.request?.id !== action.requestId) return state;
      if (state.request.kind === "roll-choices") {
        return {
          ...state,
          rollLoading: false,
          rollError: action.message,
          request: null,
        };
      }
      return {
        ...state,
        error: {
          code: action.code,
          message: action.message,
          retry: state.request.kind === "next-turn"
            ? { kind: "next-turn", targetChapter: state.request.targetChapter }
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
