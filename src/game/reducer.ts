import type { HistorySeed } from "./types";
import type { AlternatePresent, DeviationClass, TimelineTurn } from "./schema";
import type { PlayedTurn } from "./prompts";
import { calculateDeviation } from "./deviation";

export type GamePhase =
  | "selecting"
  | "generating"
  | "event"
  | "echo"
  | "ending"
  | "result"
  | "error";

export type GameScenario = HistorySeed | string;

export type Intervention = {
  text: string;
  deviationClass: DeviationClass;
};

export type RetryIntent =
  | { kind: "opening" }
  | { kind: "next-turn"; targetChapter: 2 | 3 | 4 | 5; intervention?: Intervention }
  | { kind: "ending" };

export type RequestIntent = RetryIntent & { id: number };

export type EchoState = {
  source: "ai_choice" | "custom_intervention";
  choiceLabel: string;
  directResult: string;
  unexpectedCost: string;
  beneficiary: string;
  payer: string;
  stepImpact: number;
  nextDeviation: number;
};

export type GameErrorState = {
  code: string;
  message: string;
  retry: RetryIntent;
};

export type GameState = {
  phase: GamePhase;
  scenario: GameScenario | null;
  currentTurn: TimelineTurn | null;
  playedTurns: PlayedTurn[];
  deviation: number;
  lastImpact: number;
  echo: EchoState | null;
  request: RequestIntent | null;
  pendingTurn: TimelineTurn | null;
  pendingEnding: AlternatePresent | null;
  result: AlternatePresent | null;
  error: GameErrorState | null;
  nextRequestId: number;
};

export type GameAction =
  | { type: "START_SCENARIO"; scenario: GameScenario }
  | { type: "OPENING_RESOLVED"; requestId: number; turn: TimelineTurn }
  | { type: "COMMIT_AI_CHOICE"; choiceId: "A" | "B" | "C" }
  | { type: "COMMIT_INTERVENTION"; text: string; deviationClass: DeviationClass }
  | { type: "TURN_RESOLVED"; requestId: number; turn: TimelineTurn }
  | { type: "ENDING_RESOLVED"; requestId: number; ending: AlternatePresent }
  | { type: "CONTINUE_TIMELINE" }
  | { type: "REQUEST_FAILED"; requestId: number; code: string; message: string }
  | { type: "RETRY" }
  | { type: "RESTART" };

export function createInitialGameState(nextRequestId = 1): GameState {
  return {
    phase: "selecting",
    scenario: null,
    currentTurn: null,
    playedTurns: [],
    deviation: 0,
    lastImpact: 0,
    echo: null,
    request: null,
    pendingTurn: null,
    pendingEnding: null,
    result: null,
    error: null,
    nextRequestId,
  };
}

function withoutId(request: RequestIntent): RetryIntent {
  if (request.kind === "next-turn") {
    return {
      kind: request.kind,
      targetChapter: request.targetChapter,
      ...(request.intervention ? { intervention: request.intervention } : {}),
    };
  }
  return { kind: request.kind };
}

function withRequest(state: GameState, intent: RetryIntent): Pick<GameState, "request" | "nextRequestId"> {
  return {
    request: { ...intent, id: state.nextRequestId } as RequestIntent,
    nextRequestId: state.nextRequestId + 1,
  };
}

function requestAfterChoice(
  state: GameState,
  intervention?: Intervention,
): Pick<GameState, "request" | "nextRequestId"> {
  const chapter = state.currentTurn?.chapter;
  if (chapter === 5) return withRequest(state, { kind: "ending" });
  if (chapter === undefined) return { request: null, nextRequestId: state.nextRequestId };

  return withRequest(state, {
    kind: "next-turn",
    targetChapter: (chapter + 1) as 2 | 3 | 4 | 5,
    ...(intervention ? { intervention } : {}),
  });
}

function commitChoice(
  state: GameState,
  playedTurn: PlayedTurn,
  echo: Omit<EchoState, "stepImpact" | "nextDeviation">,
  deviationClass: DeviationClass,
  intervention?: Intervention,
): GameState {
  if (state.phase !== "event" || state.currentTurn === null) return state;

  const playedTurns = [...state.playedTurns, playedTurn];
  const deviation = calculateDeviation(state.deviation, deviationClass, state.currentTurn.chapter);
  const nextRequest = requestAfterChoice(state, intervention);

  return {
    ...state,
    phase: "echo",
    playedTurns,
    deviation: deviation.nextDeviation,
    lastImpact: deviation.stepImpact,
    echo: { ...echo, ...deviation },
    ...nextRequest,
    pendingTurn: null,
    pendingEnding: null,
    result: null,
    error: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_SCENARIO": {
      if (state.phase !== "selecting") return state;
      return {
        ...state,
        phase: "generating",
        scenario: action.scenario,
        ...withRequest(state, { kind: "opening" }),
        error: null,
      };
    }

    case "OPENING_RESOLVED": {
      if (state.request?.id !== action.requestId || state.request.kind !== "opening") return state;
      return {
        ...state,
        phase: "event",
        currentTurn: action.turn,
        request: null,
        error: null,
      };
    }

    case "COMMIT_AI_CHOICE": {
      if (state.phase !== "event" || state.currentTurn === null) return state;
      const choice = state.currentTurn.choices.find((candidate) => candidate.id === action.choiceId);
      if (!choice) return state;

      return commitChoice(
        state,
        {
          turn: state.currentTurn,
          selectedChoiceId: choice.id,
          selectedChoiceLabel: choice.label,
          selectedDeviationClass: choice.deviationClass,
          selectionSource: "ai_choice",
        },
        {
          source: "ai_choice",
          choiceLabel: choice.label,
          ...choice.instantEcho,
        },
        choice.deviationClass,
      );
    }

    case "COMMIT_INTERVENTION": {
      if (state.phase !== "event" || state.currentTurn === null) return state;
      const text = action.text.trim();
      if (!text) return state;
      const intervention = { text, deviationClass: action.deviationClass };

      return commitChoice(
        state,
        {
          turn: state.currentTurn,
          selectedChoiceId: "custom",
          selectedChoiceLabel: text,
          selectedDeviationClass: action.deviationClass,
          selectionSource: "custom_intervention",
          customIntervention: text,
        },
        {
          source: "custom_intervention",
          choiceLabel: text,
          directResult: "你的干预已写入时间线",
          unexpectedCost: "新的因果正在形成",
          beneficiary: "尚未揭晓",
          payer: "尚未揭晓",
        },
        action.deviationClass,
        intervention,
      );
    }

    case "TURN_RESOLVED": {
      if (state.request?.id !== action.requestId || state.request.kind !== "next-turn") return state;
      if (state.phase === "echo") {
        return { ...state, pendingTurn: action.turn, request: null };
      }
      if (state.phase !== "generating") return state;
      return {
        ...state,
        phase: "event",
        currentTurn: action.turn,
        request: null,
        pendingTurn: null,
        error: null,
      };
    }

    case "ENDING_RESOLVED": {
      if (state.request?.id !== action.requestId || state.request.kind !== "ending") return state;
      if (state.phase === "echo") {
        return { ...state, pendingEnding: action.ending, request: null };
      }
      if (state.phase !== "ending") return state;
      return {
        ...state,
        phase: "result",
        result: action.ending,
        request: null,
        pendingEnding: null,
        error: null,
      };
    }

    case "CONTINUE_TIMELINE": {
      if (state.phase !== "echo") return state;
      if (state.error) {
        return { ...state, phase: "error", echo: null };
      }
      if (state.pendingTurn) {
        return {
          ...state,
          phase: "event",
          currentTurn: state.pendingTurn,
          pendingTurn: null,
          echo: null,
        };
      }
      if (state.pendingEnding) {
        return {
          ...state,
          phase: "result",
          result: state.pendingEnding,
          pendingEnding: null,
          echo: null,
        };
      }
      if (state.request?.kind === "ending") return { ...state, phase: "ending", echo: null };
      if (state.request?.kind === "next-turn") return { ...state, phase: "generating", echo: null };
      return state;
    }

    case "REQUEST_FAILED": {
      if (state.request?.id !== action.requestId) return state;
      const error: GameErrorState = {
        code: action.code,
        message: action.message,
        retry: withoutId(state.request),
      };
      return {
        ...state,
        phase: state.phase === "echo" ? "echo" : "error",
        request: null,
        error,
      };
    }

    case "RETRY": {
      if (state.phase !== "error" || state.error === null) return state;
      const request = withRequest(state, state.error.retry);
      return {
        ...state,
        phase: state.error.retry.kind === "ending" ? "ending" : "generating",
        ...request,
        pendingTurn: null,
        pendingEnding: null,
        error: null,
      };
    }

    case "RESTART":
      return createInitialGameState(state.nextRequestId + 1);
  }
}
