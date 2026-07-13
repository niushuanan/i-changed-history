import type { GameScenario } from "./reducer";
import {
  buildContinuationMessages,
  buildCustomActionMessages,
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
  parseCustomActionResolution,
  parseTimelineTurn,
  type AlternatePresent,
  type CustomActionResolution,
  type TimelineTurn,
} from "./schema";
import { DeepSeekError, requestCompletion, type CompletionOptions } from "../services/deepseek";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { createFallbackCustomActionResolution } from "./fallbackTurn";
import { buildCanonicalCustomResolution } from "./customCanon";
import {
  endingConsequencePreservesCanon,
} from "./worldCanon";

type RepairTarget = "timeline_turn" | "alternate_present" | "custom_action";
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
        : target === "custom_action"
          ? "AI 没有完成这次自由改命裁决，请重试。"
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
  expectedProtagonist?: { name?: string; age: number; lifeStage: TimelineTurn["lifeStage"] },
  openingContext?: { eventName: string; role: string },
  customCanon: readonly PlayedTurn[] = [],
): Parser<TimelineTurn> {
  return (raw) => {
    const turn = parseTimelineTurn(raw, {
      expectedChapter,
      expectedYearLabel,
      expectedPreviousEcho,
      expectedProtagonistName: expectedProtagonist?.name,
      expectedProtagonistAge: expectedProtagonist?.age,
      expectedLifeStage: expectedProtagonist?.lifeStage,
    });
    if (turn.chapter !== expectedChapter) {
      throw new Error(`模型返回了第 ${turn.chapter} 幕，而不是第 ${expectedChapter} 幕。`);
    }
    if (expectedChapter >= 4 && openingContext) {
      const currentPlot = `${turn.headline}；${turn.immediateObjective}；${turn.narrative}`;
      if (turn.role === openingContext.role || currentPlot.includes(openingContext.eventName)) {
        throw new Error("第四幕以后不能继续把开场事件或开场职位当作当前主线");
      }
    }
    if (expectedChapter === 12 && /已经死|闭上眼|咽气|去世|生命结束/.test(turn.narrative)) {
      throw new Error("第十二幕必须先让玩家完成最后一次选择，不能提前写死主角");
    }
    for (const canon of customCanon) {
      const exactLedger = turn.causalLedger.some((entry) => entry.causedByChapter === canon.turn.chapter && entry.fact === canon.selectedChoiceLabel);
      if (!exactLedger) throw new Error(`本幕因果账本遗漏不可撤销正史第 ${canon.turn.chapter} 节点`);
      if (!endingConsequencePreservesCanon(canon.selectedChoiceLabel, JSON.stringify(turn))) {
        throw new Error(`本幕否定了玩家钦定正史「${canon.selectedChoiceLabel}」`);
      }
    }
    return turn;
  };
}

function expectedYearLabel(scenario: GameScenario, chapter: DecisionChapter): string {
  const node = getTimelineNode(chapter, scenario.seed.year);
  if (chapter === 1) return `${scenario.seed.dateLabel} · ${node.protagonistAge}岁`;
  if (chapter === 2) return `${scenario.seed.year}年 · 三日后 · ${node.protagonistAge}岁`;
  if (chapter === 3) return `${scenario.seed.year}年 · 六周后 · ${node.protagonistAge}岁`;
  return `${node.targetYear}年 · ${node.protagonistAge}岁`;
}

function expectedPreviousEcho(
  playedTurns: readonly PlayedTurn[],
): NonNullable<TimelineTurn["previousEcho"]> | undefined {
  const previous = playedTurns.at(-1);
  if (!previous) return undefined;
  return previous.resolvedEcho;
}

export async function adjudicateCustomAction(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  turn: TimelineTurn,
  action: string,
  options: GenerationOptions = {},
): Promise<CustomActionResolution> {
  const messages = buildCustomActionMessages(scenario, playedTurns, turn, action);
  const parseForPersonality = (raw: string) => {
    const resolution = parseCustomActionResolution(raw);
    if (resolution.declaredOutcome !== action.trim()) {
      throw new Error("declaredOutcome 必须逐字保留玩家钦定结果");
    }
    return buildCanonicalCustomResolution(scenario.profile, turn, action, resolution.deviationClass);
  };
  try {
    return await requestValidated(
      messages,
      { phase: "turn", signal: options.signal },
      "custom_action",
      parseForPersonality,
    );
  } catch (error) {
    if (error instanceof StructuredGenerationError) {
      return createFallbackCustomActionResolution(scenario, turn, action);
    }
    throw error;
  }
}

function parseExpectedEnding(
  expectedHistoryTimeline: readonly { yearLabel: string; playerChoice: string; playerAuthored: boolean }[],
  protagonist: { name: string; deathYearLabel: string; deathAge: number },
): Parser<AlternatePresent> {
  return (raw) => {
    const ending = parseAlternatePresent(raw, {
      expectedHistoryTimeline,
      expectedProtagonistName: protagonist.name,
      expectedDeathYearLabel: protagonist.deathYearLabel,
      expectedDeathAge: protagonist.deathAge,
    });
    const choicesMatch = ending.historyTimeline.every(
      (item, index) => item.playerChoice === expectedHistoryTimeline[index]?.playerChoice,
    );
    if (!choicesMatch || ending.historyTimeline.length !== expectedHistoryTimeline.length) {
      throw new Error("结局时间线没有按顺序保留玩家的十二次真实选择。");
    }
    const contradictedCanon = expectedHistoryTimeline.find((expected, index) =>
      expected.playerAuthored && !endingConsequencePreservesCanon(
        expected.playerChoice,
        ending.historyTimeline[index]?.consequence ?? "",
      ),
    );
    if (contradictedCanon) {
      throw new Error(`结局否定或遗漏玩家钦定正史「${contradictedCanon.playerChoice}」`);
    }
    return ending;
  };
}

export async function generateOpening(
  scenario: GameScenario,
  options: GenerationOptions = {},
): Promise<TimelineTurn> {
  const messages = buildOpeningMessages(scenario);

  const node = getTimelineNode(1, scenario.seed.year);
  return requestValidated(messages, { phase: "turn", signal: options.signal }, "timeline_turn", parseRequestedTurn(1, expectedYearLabel(scenario, 1), undefined, { age: node.protagonistAge, lifeStage: node.lifeStage }), { expectedChapter: 1 });
}

export async function generateNextTurn(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: Exclude<DecisionChapter, 1>,
  options: NextTurnGenerationOptions = {},
): Promise<TimelineTurn> {
  const messages = buildContinuationMessages(scenario, playedTurns, chapter);
  const node = getTimelineNode(chapter, scenario.seed.year);
  const protagonistName = playedTurns[0]?.turn.protagonistName;
  const customCanon = playedTurns.filter((turn) => turn.playerAuthored);
  return requestValidated(messages, { phase: "turn", signal: options.signal }, "timeline_turn", parseRequestedTurn(chapter, expectedYearLabel(scenario, chapter), expectedPreviousEcho(playedTurns), { name: protagonistName, age: node.protagonistAge, lifeStage: node.lifeStage }, { eventName: scenario.seed.eventName, role: scenario.seed.role }, customCanon), { expectedChapter: chapter });
}

export async function generateEnding(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  options: GenerationOptions = {},
): Promise<AlternatePresent> {
  const expectedHistoryTimeline = playedTurns.map((playedTurn) => ({
    yearLabel: playedTurn.turn.yearLabel,
    playerChoice: getPlayedTurnChoiceText(playedTurn),
    playerAuthored: playedTurn.playerAuthored === true || playedTurn.selectedChoiceId === "custom",
  }));
  const firstTurn = playedTurns[0]?.turn;
  const finalTurn = playedTurns.at(-1)?.turn;
  if (!firstTurn || !finalTurn || playedTurns.length !== 12) {
    throw new StructuredGenerationError("alternate_present", new Error("结局需要完整的十二次决定"));
  }
  return requestValidated(buildEndingMessages(scenario, playedTurns), { phase: "ending", signal: options.signal }, "alternate_present", parseExpectedEnding(expectedHistoryTimeline, { name: firstTurn.protagonistName, deathYearLabel: finalTurn.yearLabel, deathAge: finalTurn.protagonistAge }), {});
}
