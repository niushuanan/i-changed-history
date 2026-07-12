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
import { DeepSeekError, requestCompletion, type CompletionOptions } from "../services/deepseek";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { createFallbackEnding, createFallbackTurn } from "./fallbackTurn";

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
  const complete = async (requestMessages: ChatMessage[]) => {
    try {
      return await requestCompletion(requestMessages, requestOptions);
    } catch (error) {
      if (error instanceof DeepSeekError && error.code === "invalid_response") {
        throw new StructuredGenerationError(target, error);
      }
      throw error;
    }
  };
  const raw = await complete(messages);

  try {
    return parse(raw);
  } catch (validationError) {
    const repairedRaw = await complete(
      buildContextualJsonRepairMessages(messages, raw, target, {
        ...repairDetails,
        validationErrors: summarizeValidationError(validationError),
      }),
    );
    try {
      return parse(repairedRaw);
    } catch (repairError) {
      const regeneratedRaw = await complete(messages);
      try {
        return parse(regeneratedRaw);
      } catch (error) {
        throw new StructuredGenerationError(target, { validationError, repairError, error });
      }
    }
  }
}

function parseRequestedTurn(
  expectedChapter: TimelineTurn["chapter"],
  expectedYearLabel: string,
  expectedPreviousEcho?: NonNullable<TimelineTurn["previousEcho"]>,
): Parser<TimelineTurn> {
  return (raw) => {
    const turn = parseTimelineTurn(raw, { expectedChapter, expectedYearLabel, expectedPreviousEcho });
    if (turn.chapter !== expectedChapter) {
      throw new Error(`模型返回了第 ${turn.chapter} 幕，而不是第 ${expectedChapter} 幕。`);
    }
    return turn;
  };
}

function expectedYearLabel(scenario: GameScenario, chapter: DecisionChapter): string {
  if (chapter === 1) return scenario.seed.dateLabel;
  if (chapter === 2) return `${scenario.seed.year}年 · 一天后`;
  if (chapter === 3) return `${scenario.seed.year}年 · 一个月后`;
  return `${getTimelineNode(chapter, scenario.seed.year).targetYear}年`;
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
      throw new Error("结局时间线没有按顺序保留玩家的十一次真实选择。");
    }
    return ending;
  };
}

export async function generateOpening(
  scenario: GameScenario,
  options: GenerationOptions = {},
): Promise<TimelineTurn> {
  const messages = buildOpeningMessages(scenario);

  try {
    return await requestValidated(messages, { phase: "turn", signal: options.signal }, "timeline_turn", parseRequestedTurn(1, expectedYearLabel(scenario, 1)), { expectedChapter: 1 });
  } catch (error) {
    if (error instanceof StructuredGenerationError) return createFallbackTurn(scenario, [], 1);
    throw error;
  }
}

export async function generateNextTurn(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: Exclude<DecisionChapter, 1>,
  options: NextTurnGenerationOptions = {},
): Promise<TimelineTurn> {
  const messages = buildContinuationMessages(scenario, playedTurns, chapter);

  try {
    return await requestValidated(messages, { phase: "turn", signal: options.signal }, "timeline_turn", parseRequestedTurn(chapter, expectedYearLabel(scenario, chapter), expectedPreviousEcho(playedTurns)), { expectedChapter: chapter });
  } catch (error) {
    if (error instanceof StructuredGenerationError) return createFallbackTurn(scenario, playedTurns, chapter);
    throw error;
  }
}

export async function generateEnding(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  options: GenerationOptions = {},
): Promise<AlternatePresent> {
  const expectedHistoryTimeline = playedTurns.map((playedTurn) => ({
    yearLabel: playedTurn.turn.yearLabel,
    playerChoice: getPlayedTurnChoiceText(playedTurn),
  }));
  try {
    return await requestValidated(buildEndingMessages(scenario, playedTurns), { phase: "ending", signal: options.signal }, "alternate_present", parseExpectedEnding(expectedHistoryTimeline), {});
  } catch (error) {
    if (error instanceof StructuredGenerationError) return createFallbackEnding(scenario, playedTurns);
    throw error;
  }
}
