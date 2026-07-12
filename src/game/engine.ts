import type { HistorySeed } from "./types";
import {
  buildContinuationMessages,
  buildCustomContinuationMessages,
  buildCustomOpeningMessages,
  buildEndingMessages,
  buildJsonRepairMessages,
  buildOpeningMessages,
  type ChatMessage,
  type PlayedTurn,
} from "./prompts";
import {
  parseAlternatePresent,
  parseTimelineTurn,
  type AlternatePresent,
  type DeviationClass,
  type TimelineTurn,
} from "./schema";
import { requestCompletion, type CompletionOptions } from "../services/deepseek";

type RepairTarget = "timeline_turn" | "alternate_present";
type Parser<T> = (raw: string) => T;

export type GenerationOptions = {
  signal?: AbortSignal;
};

export type NextTurnGenerationOptions = GenerationOptions & {
  intervention?: {
    text: string;
    deviationClass: DeviationClass;
  };
};

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

async function requestValidated<T>(
  messages: ChatMessage[],
  requestOptions: CompletionOptions,
  target: RepairTarget,
  parse: Parser<T>,
): Promise<T> {
  const raw = await requestCompletion(messages, requestOptions);

  try {
    return parse(raw);
  } catch {
    const repairedRaw = await requestCompletion(buildJsonRepairMessages(raw, target), requestOptions);
    try {
      return parse(repairedRaw);
    } catch (error) {
      throw new StructuredGenerationError(target, error);
    }
  }
}

function parseRequestedTurn(expectedChapter: TimelineTurn["chapter"]): Parser<TimelineTurn> {
  return (raw) => {
    const turn = parseTimelineTurn(raw);
    if (turn.chapter !== expectedChapter) {
      throw new Error(`模型返回了第 ${turn.chapter} 幕，而不是第 ${expectedChapter} 幕。`);
    }
    return turn;
  };
}

export function generateOpening(
  seedOrPremise: HistorySeed | string,
  options: GenerationOptions = {},
): Promise<TimelineTurn> {
  const messages =
    typeof seedOrPremise === "string"
      ? buildCustomOpeningMessages(seedOrPremise)
      : buildOpeningMessages(seedOrPremise);

  return requestValidated(
    messages,
    { phase: "turn", signal: options.signal },
    "timeline_turn",
    parseRequestedTurn(1),
  );
}

export function generateNextTurn(
  seed: HistorySeed,
  playedTurns: readonly PlayedTurn[],
  chapter: 2 | 3 | 4 | 5,
  options: NextTurnGenerationOptions = {},
): Promise<TimelineTurn> {
  const messages = options.intervention
    ? buildCustomContinuationMessages(
        seed,
        playedTurns,
        chapter,
        options.intervention.text,
        options.intervention.deviationClass,
      )
    : buildContinuationMessages(seed, playedTurns, chapter);

  return requestValidated(
    messages,
    { phase: "turn", signal: options.signal },
    "timeline_turn",
    parseRequestedTurn(chapter),
  );
}

export function generateEnding(
  seed: HistorySeed,
  playedTurns: readonly PlayedTurn[],
  options: GenerationOptions = {},
): Promise<AlternatePresent> {
  return requestValidated(
    buildEndingMessages(seed, playedTurns),
    { phase: "ending", signal: options.signal },
    "alternate_present",
    parseAlternatePresent,
  );
}
