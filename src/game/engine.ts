import type { GameScenario } from "./reducer";
import {
  buildContinuationMessages,
  buildEndingMessages,
  buildContextualJsonRepairMessages,
  buildOpeningMessages,
  getPlayedTurnChoiceText,
  type ChatMessage,
  type JsonRepairDetails,
  type PlayedTurn,
} from "./prompts";
import {
  parseAlternatePresent,
  parseTimelineTurn,
  type AlternatePresent,
  type TimelineTurn,
} from "./schema";
import { requestCompletion, type CompletionOptions } from "../services/deepseek";
import type { DecisionChapter } from "./timelinePlan";

type RepairTarget = "timeline_turn" | "alternate_present";
type Parser<T> = (raw: string) => T;

export type GenerationOptions = {
  signal?: AbortSignal;
};

export type NextTurnGenerationOptions = GenerationOptions;

export class StructuredGenerationError extends Error {
  readonly name = "StructuredGenerationError";
  readonly code = "invalid_structure";

  constructor(target: RepairTarget, cause: unknown) {
    super(
      target === "timeline_turn"
        ? "AI 返回的幕次结构仍不完整，请重新推演这一幕。"
        : "AI 返回的结局结构仍不完整，请重新生成结局。",
      { cause },
    );
  }
}

function summarizeValidationError(error: unknown): string[] {
  if (
    typeof error === "object" &&
    error !== null &&
    "issues" in error &&
    Array.isArray(error.issues)
  ) {
    return error.issues.slice(0, 12).map((issue) => {
      if (typeof issue !== "object" || issue === null) return String(issue);
      const path =
        "path" in issue && Array.isArray(issue.path) ? issue.path.join(".") : "response";
      const message = "message" in issue ? String(issue.message) : "invalid value";
      return `${path || "response"}: ${message}`;
    });
  }

  return [error instanceof Error ? error.message : "Response did not match the required schema."];
}

async function requestValidated<T>(
  messages: ChatMessage[],
  requestOptions: CompletionOptions,
  target: RepairTarget,
  parse: Parser<T>,
  repairDetails: JsonRepairDetails = {},
): Promise<T> {
  const raw = await requestCompletion(messages, requestOptions);

  try {
    return parse(raw);
  } catch (validationError) {
    const repairedRaw = await requestCompletion(
      buildContextualJsonRepairMessages(messages, raw, target, {
        ...repairDetails,
        validationErrors: summarizeValidationError(validationError),
      }),
      requestOptions,
    );
    try {
      return parse(repairedRaw);
    } catch (error) {
      throw new StructuredGenerationError(target, error);
    }
  }
}

function parseRequestedTurn(
  expectedChapter: TimelineTurn["chapter"],
  expectedPreviousEcho?: NonNullable<TimelineTurn["previousEcho"]>,
): Parser<TimelineTurn> {
  return (raw) => {
    const turn = parseTimelineTurn(raw, { expectedPreviousEcho });
    if (turn.chapter !== expectedChapter) {
      throw new Error(`模型返回了第 ${turn.chapter} 幕，而不是第 ${expectedChapter} 幕。`);
    }
    return turn;
  };
}

function expectedPreviousEcho(
  playedTurns: readonly PlayedTurn[],
): NonNullable<TimelineTurn["previousEcho"]> | undefined {
  const previous = playedTurns.at(-1);
  if (!previous) return undefined;
  return previous.turn.choices.find((choice) => choice.id === previous.selectedChoiceId)
    ?.instantEcho;
}

function parseExpectedEnding(
  expectedHistoryTimeline: readonly { yearLabel: string; playerChoice: string }[],
): Parser<AlternatePresent> {
  return (raw) => {
    const ending = parseAlternatePresent(raw, { expectedHistoryTimeline });
    const choicesMatch = ending.historyTimeline.every(
      (item, index) => item.playerChoice === expectedHistoryTimeline[index]?.playerChoice,
    );
    if (!choicesMatch || ending.historyTimeline.length !== expectedHistoryTimeline.length) {
      throw new Error("结局时间线没有按顺序保留玩家的五次真实选择。");
    }
    return ending;
  };
}

export function generateOpening(
  scenario: GameScenario,
  options: GenerationOptions = {},
): Promise<TimelineTurn> {
  const messages = buildOpeningMessages(scenario);

  return requestValidated(
    messages,
    { phase: "turn", signal: options.signal },
    "timeline_turn",
    parseRequestedTurn(1),
    { expectedChapter: 1 },
  );
}

export function generateNextTurn(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: Exclude<DecisionChapter, 1>,
  options: NextTurnGenerationOptions = {},
): Promise<TimelineTurn> {
  const messages = buildContinuationMessages(scenario, playedTurns, chapter);

  return requestValidated(
    messages,
    { phase: "turn", signal: options.signal },
    "timeline_turn",
    parseRequestedTurn(chapter, expectedPreviousEcho(playedTurns)),
    { expectedChapter: chapter },
  );
}

export function generateEnding(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  options: GenerationOptions = {},
): Promise<AlternatePresent> {
  const expectedHistoryTimeline = playedTurns.map((playedTurn) => ({
    yearLabel: playedTurn.turn.yearLabel,
    playerChoice: getPlayedTurnChoiceText(playedTurn),
  }));
  return requestValidated(
    buildEndingMessages(scenario, playedTurns),
    { phase: "ending", signal: options.signal },
    "alternate_present",
    parseExpectedEnding(expectedHistoryTimeline),
    {},
  );
}
