import type { GameScenario } from "./reducer";
import {
  buildContinuationMessages,
  buildRerollMessages,
  buildCustomActionMessages,
  buildBiographyMessages,
  buildContextualJsonRepairMessages,
  buildWorldReportMessages,
  getPlayedTurnChoiceText,
  type ChatMessage,
  type JsonRepairDetails,
  type PlayedTurn,
} from "./prompts";
import {
  parseAlternatePresent,
  parseBiographyReport,
  parseChoiceSet,
  parseCustomActionResolution,
  extractFirstJsonObject,
  parseTimelineTurn,
  parseWorldReport,
  type AlternatePresent,
  type BiographyReport,
  type ChoiceSet,
  type CustomActionResolution,
  type TimelineTurn,
} from "./schema";
import {
  DeepSeekError,
  requestCompletion,
  type CompletionOptions,
  type DeepSeekPartialDraft,
  type DeepSeekProgressStage,
  type DeepSeekRequestKind,
  type DeepSeekRequestMetrics,
  type DeepSeekReasoning,
} from "../services/deepseek";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { createFallbackCustomActionResolution } from "./fallbackTurn";
import { buildCanonicalCustomResolution } from "./customCanon";
import { consequenceContradictsCanon } from "./worldCanon";
import { buildNarrativeContext, type NarrativeContext } from "./narrativeContext";
import { formatHistoricalYear } from "../data/historicalYear";
import type { PowerId } from "./powers";

type RepairTarget = "timeline_turn" | "choice_set" | "biography_report" | "world_report" | "custom_action";
type Parser<T> = (raw: string) => T;

export type GenerationOptions = {
  signal?: AbortSignal;
  onProgress?: (stage: DeepSeekProgressStage) => void;
  onDiagnostic?: (diagnostic: GenerationDiagnostic) => void;
  onPartial?: (draft: DeepSeekPartialDraft) => void;
  onMetrics?: (metrics: DeepSeekRequestMetrics) => void;
};

export type NextTurnGenerationOptions = GenerationOptions & {
  assignedPowerIds?: readonly [PowerId, PowerId];
};
export type RerollGenerationOptions = GenerationOptions & {
  assignedPowerId?: PowerId;
};

export type GenerationDiagnostic = Readonly<{
  target: RepairTarget;
  stage:
    | "primary_invalid"
    | "repair_invalid"
    | "recovery_started"
    | "recovery_succeeded"
    | "recovery_invalid"
    | "custom_fallback";
  errors: readonly string[];
  repairFields?: readonly string[];
}>;

type EngineCompletionOptions = CompletionOptions & Pick<GenerationOptions, "onDiagnostic">;

class FieldValidationError extends Error {
  readonly issues: Array<{ path: [string]; message: string }>;

  constructor(fields: readonly string[], message: string) {
    super(message);
    this.name = "FieldValidationError";
    this.issues = fields.map((field) => ({ path: [field], message }));
  }
}

const DEFAULT_TURN_POWER_IDS = ["blink-self", "stop-time"] as const;
const DEFAULT_ROLL_POWER_ID = "teleport-crowd" as const;

function assertAssignedPowerChoice(
  choices: TimelineTurn["choices"],
  expectedPowerId: PowerId,
  field: string,
) {
  const powerChoice = choices[2];
  const invalidFields = [
    ...(choices.slice(0, 2).some((choice) => choice.powerId !== undefined) ? [field] : []),
    ...(powerChoice.powerId !== expectedPowerId ? [field] : []),
    ...(powerChoice.actionSpec.actor !== "你" ? [field] : []),
  ];
  if (invalidFields.length > 0) {
    throw new FieldValidationError(
      invalidFields,
      `${field} 的 C 牌必须由“你”发动客户端指定能力 ${expectedPowerId}，A/B 不得携带能力`,
    );
  }
}

export class StructuredGenerationError extends Error {
  readonly name = "StructuredGenerationError";
  readonly code = "invalid_structure";

  constructor(target: RepairTarget, cause: unknown) {
    super(
      target === "timeline_turn"
        ? "AI 返回的幕次结构仍不完整，请重新推演这一幕。"
        : target === "choice_set"
          ? "AI 没有发出完整的三张新牌，请再次 Roll。"
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

function repairableRootFields(error: unknown): string[] | null {
  if (
    typeof error !== "object" ||
    error === null ||
    !("issues" in error) ||
    !Array.isArray(error.issues) ||
    error.issues.length === 0
  ) {
    return null;
  }

  const fields = new Set<string>();
  for (const issue of error.issues) {
    if (typeof issue !== "object" || issue === null || !("path" in issue) || !Array.isArray(issue.path)) {
      return null;
    }
    const root = issue.path[0];
    if (typeof root !== "string" || root.length === 0) return null;
    fields.add(root);
  }
  return [...fields];
}

function mergeAiFieldPatch(originalRaw: string, patchRaw: string, fields: readonly string[]): string {
  const original: unknown = JSON.parse(extractFirstJsonObject(originalRaw));
  const patch: unknown = JSON.parse(extractFirstJsonObject(patchRaw));
  if (typeof original !== "object" || original === null || Array.isArray(original)) return patchRaw;
  if (typeof patch !== "object" || patch === null || Array.isArray(patch)) return patchRaw;

  const originalRecord = original as Record<string, unknown>;
  const patchRecord = patch as Record<string, unknown>;
  const acceptedPatch = Object.fromEntries(
    fields
      .filter((field) => Object.prototype.hasOwnProperty.call(patchRecord, field))
      .map((field) => [field, patchRecord[field]]),
  );
  return JSON.stringify({ ...originalRecord, ...acceptedPatch });
}

async function requestValidated<T>(
  messages: ChatMessage[],
  requestOptions: EngineCompletionOptions,
  target: RepairTarget,
  parse: Parser<T>,
  repairDetails: JsonRepairDetails = {},
): Promise<T> {
  const diagnose = (diagnostic: Omit<GenerationDiagnostic, "target">) => {
    try {
      requestOptions.onDiagnostic?.({ target, ...diagnostic });
    } catch {
      // Diagnostics must never interrupt generation.
    }
  };
  const complete = async (
    requestMessages: ChatMessage[],
    relayProgress = true,
    override?: { reasoning: DeepSeekReasoning; requestKind: DeepSeekRequestKind },
  ) => {
    try {
      return await requestCompletion(requestMessages, {
        ...requestOptions,
        ...override,
        onProgress: relayProgress ? requestOptions.onProgress : undefined,
        onPartial: relayProgress ? requestOptions.onPartial : undefined,
      });
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
    const repairFields = repairableRootFields(validationError);
    const patchOnly = repairFields !== null;
    diagnose({
      stage: "primary_invalid",
      errors: summarizeValidationError(validationError),
      ...(patchOnly ? { repairFields } : {}),
    });
    requestOptions.onProgress?.({ stage: "repairing" });
    const repairedRaw = await complete(
      buildContextualJsonRepairMessages(messages, raw, target, {
        ...repairDetails,
        validationErrors: summarizeValidationError(validationError),
        ...(patchOnly ? { patchOnly: true, repairFields } : {}),
      }),
      false,
      {
        reasoning: "fast",
        requestKind: target === "choice_set"
          ? "roll-repair"
          : requestOptions.phase === "ending"
            ? "ending-repair"
            : "turn-repair",
      },
    );
    let repairedCandidate = repairedRaw;
    try {
      repairedCandidate = patchOnly ? mergeAiFieldPatch(raw, repairedRaw, repairFields) : repairedRaw;
      return parse(repairedCandidate);
    } catch (repairError) {
      diagnose({ stage: "repair_invalid", errors: summarizeValidationError(repairError) });
      diagnose({ stage: "recovery_started", errors: summarizeValidationError(repairError) });
      requestOptions.onProgress?.({ stage: "repairing" });
      const recoveryRaw = await complete(
        buildContextualJsonRepairMessages(messages, repairedCandidate, target, {
          ...repairDetails,
          validationErrors: summarizeValidationError(repairError),
          patchOnly: false,
          repairFields: undefined,
        }),
        false,
        {
          reasoning: "high",
          requestKind: target === "choice_set"
            ? "roll-recovery"
            : requestOptions.phase === "ending"
              ? "ending-recovery"
              : "turn-recovery",
        },
      );
      try {
        const recovered = parse(recoveryRaw);
        diagnose({ stage: "recovery_succeeded", errors: [] });
        return recovered;
      } catch (recoveryError) {
        diagnose({ stage: "recovery_invalid", errors: summarizeValidationError(recoveryError) });
        throw new StructuredGenerationError(target, { validationError, repairError, recoveryError });
      }
    }
  }
}

function completionOptions(
  phase: CompletionOptions["phase"],
  options: GenerationOptions,
  reasoning: DeepSeekReasoning,
  requestKind: DeepSeekRequestKind,
): EngineCompletionOptions {
  return {
    phase,
    reasoning,
    requestKind,
    signal: options.signal,
    onDiagnostic: options.onDiagnostic,
    onPartial: options.onPartial,
    onMetrics: options.onMetrics,
    onProgress: options.onProgress
      ? ({ stage }) => options.onProgress?.(stage)
      : undefined,
  };
}

function parseRequestedTurn(
  expectedChapter: TimelineTurn["chapter"],
  expectedYearLabel: string,
  expectedPreviousEcho?: NonNullable<TimelineTurn["previousEcho"]>,
  expectedProtagonist?: { name?: string; age: number; lifeStage: TimelineTurn["lifeStage"] },
  openingContext?: { eventName: string; role: string },
  customCanon: readonly PlayedTurn[] = [],
  activePlayerCanon: NarrativeContext["activePlayerCanon"] = [],
  assignedPowerIds?: readonly [PowerId, PowerId],
): Parser<TimelineTurn> {
  return (raw) => {
    const authoritativeLedger = activePlayerCanon.map((canon) => ({
      fact: canon.sourceText,
      causedByChapter: canon.chapter,
      mustAffect: canon.propagationMechanism,
    }));
    const turn = parseTimelineTurn(raw, {
      expectedChapter,
      expectedYearLabel,
      expectedPreviousEcho,
      expectedProtagonistName: expectedProtagonist?.name,
      expectedProtagonistAge: expectedProtagonist?.age,
      expectedLifeStage: expectedProtagonist?.lifeStage,
      expectedCausalLedger: authoritativeLedger,
      requireRollChoices: true,
    });
    if (turn.chapter !== expectedChapter) {
      throw new Error(`模型返回了第 ${turn.chapter} 幕，而不是第 ${expectedChapter} 幕。`);
    }
    if (assignedPowerIds) {
      assertAssignedPowerChoice(turn.choices, assignedPowerIds[0], "choices");
      assertAssignedPowerChoice(turn.rollChoices, assignedPowerIds[1], "rollChoices");
    }
    if (expectedChapter >= 3 && openingContext) {
      const headlineKeepsOpeningPlot = turn.headline.includes(openingContext.eventName);
      const objectiveKeepsOpeningPlot = turn.immediateObjective.includes(openingContext.eventName)
        || [...turn.choices, ...turn.rollChoices].some((choice) => choice.label.includes(openingContext.eventName));
      const narrativeKeepsOpeningPlot = turn.narrative.includes(openingContext.eventName)
        && (headlineKeepsOpeningPlot || objectiveKeepsOpeningPlot);
      const staleFields = [
        ...(turn.role === openingContext.role ? ["role"] : []),
        ...(headlineKeepsOpeningPlot ? ["headline"] : []),
        ...(narrativeKeepsOpeningPlot ? ["narrative"] : []),
        ...(objectiveKeepsOpeningPlot ? ["choices"] : []),
      ];
      if (staleFields.length > 0) {
        throw new FieldValidationError(
          staleFields,
          "第三幕以后不能继续把开场事件或开场职位当作当前主线",
        );
      }
    }
    if (expectedChapter === 4 && /已经死|闭上眼|咽气|去世|生命结束/.test(turn.narrative)) {
      throw new Error("第四幕必须先让玩家完成最后一次选择，不能提前写死主角");
    }
    const visibleCurrentHistory = [
      turn.headline,
      turn.narrative,
      turn.causalBridge,
      turn.worldStateChange,
      turn.immediateObjective,
      turn.memorySummary,
    ].join("；");
    for (const canon of customCanon) {
      if (consequenceContradictsCanon(canon.selectedChoiceLabel, visibleCurrentHistory)) {
        throw new FieldValidationError(
          ["narrative", "worldStateChange", "causalBridge"],
          `本幕否定了玩家钦定正史「${canon.selectedChoiceLabel}」`,
        );
      }
    }
    return turn;
  };
}

function expectedYearLabel(scenario: GameScenario, chapter: DecisionChapter): string {
  const node = getTimelineNode(chapter, scenario.seed.year);
  if (chapter === 1) return `${scenario.seed.dateLabel} · ${node.protagonistAge}岁`;
  if (chapter === 2) return `${formatHistoricalYear(scenario.seed.year)} · 三日后 · ${node.protagonistAge}岁`;
  return `${formatHistoricalYear(node.targetYear)} · ${node.protagonistAge}岁`;
}

function expectedPreviousEcho(
  playedTurns: readonly PlayedTurn[],
): NonNullable<TimelineTurn["previousEcho"]> | undefined {
  const previous = playedTurns[playedTurns.length - 1];
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
  const parseCanonicalResult = (raw: string) => {
    const resolution = parseCustomActionResolution(raw);
    if (resolution.declaredOutcome !== action.trim()) {
      throw new Error("declaredOutcome 必须逐字保留玩家钦定结果");
    }
    return buildCanonicalCustomResolution(turn, action, resolution.deviationClass, resolution);
  };
  try {
    return await requestValidated(
      messages,
      completionOptions("turn", options, "high", "turn-primary"),
      "custom_action",
      parseCanonicalResult,
    );
  } catch (error) {
    if (error instanceof StructuredGenerationError) {
      try {
        options.onDiagnostic?.({
          target: "custom_action",
          stage: "custom_fallback",
          errors: summarizeValidationError(error.cause),
        });
      } catch {
        // Diagnostics must never interrupt the canonical player result.
      }
      return createFallbackCustomActionResolution(scenario, turn, action);
    }
    throw error;
  }
}

function parseExpectedBiography(
  expectedHistoryTimeline: readonly { yearLabel: string; playerChoice: string; playerAuthored: boolean }[],
  protagonist: { name: string; deathYearLabel: string; deathAge: number },
): Parser<BiographyReport> {
  return (raw) => {
    const biography = parseBiographyReport(raw, {
      expectedHistoryTimeline,
      expectedProtagonistName: protagonist.name,
      expectedDeathYearLabel: protagonist.deathYearLabel,
      expectedDeathAge: protagonist.deathAge,
    });
    const choicesMatch = biography.historyTimeline.every(
      (item, index) => item.playerChoice === expectedHistoryTimeline[index]?.playerChoice,
    );
    if (!choicesMatch || biography.historyTimeline.length !== expectedHistoryTimeline.length) {
      throw new Error("结局时间线没有按顺序保留玩家的四次真实选择。");
    }
    const contradictedCanon = expectedHistoryTimeline.find((expected, index) =>
      expected.playerAuthored && consequenceContradictsCanon(
        expected.playerChoice,
        biography.historyTimeline[index]?.consequence ?? "",
      ),
    );
    if (contradictedCanon) {
      throw new Error(`结局否定或遗漏玩家钦定正史「${contradictedCanon.playerChoice}」`);
    }
    return biography;
  };
}

export async function generateNextTurn(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: Exclude<DecisionChapter, 1>,
  options: NextTurnGenerationOptions = {},
): Promise<TimelineTurn> {
  const messages = buildContinuationMessages(
    scenario,
    playedTurns,
    chapter,
    options.assignedPowerIds ?? DEFAULT_TURN_POWER_IDS,
  );
  const node = getTimelineNode(chapter, scenario.seed.year);
  const protagonistName = playedTurns[0]?.turn.protagonistName;
  const customCanon = playedTurns.filter((turn) => turn.playerAuthored);
  const activePlayerCanon = buildNarrativeContext(playedTurns, chapter).activePlayerCanon;
  return requestValidated(messages, completionOptions("turn", options, "fast", "turn-primary"), "timeline_turn", parseRequestedTurn(chapter, expectedYearLabel(scenario, chapter), expectedPreviousEcho(playedTurns), { name: protagonistName, age: node.protagonistAge, lifeStage: node.lifeStage }, { eventName: scenario.seed.eventName, role: scenario.seed.role }, customCanon, activePlayerCanon, options.assignedPowerIds), { expectedChapter: chapter });
}

export async function generateRerolledChoices(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  turn: TimelineTurn,
  rollNumber: 2 | 3,
  previousChoices: TimelineTurn["choices"],
  options: RerollGenerationOptions = {},
): Promise<ChoiceSet> {
  const assignedPowerId = options.assignedPowerId ?? DEFAULT_ROLL_POWER_ID;
  return requestValidated(
    buildRerollMessages(scenario, playedTurns, turn, rollNumber, previousChoices, assignedPowerId),
    completionOptions("turn", options, "fast", "roll-primary"),
    "choice_set",
    (raw) => {
      const choices = parseChoiceSet(raw);
      if (options.assignedPowerId) {
        assertAssignedPowerChoice(choices, assignedPowerId, "choices");
      }
      return choices;
    },
  );
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
  const finalTurn = playedTurns[playedTurns.length - 1]?.turn;
  if (!firstTurn || !finalTurn || playedTurns.length !== 4) {
    throw new StructuredGenerationError("biography_report", new Error("结局需要完整的四次决定"));
  }
  const biographyPromise = requestValidated(
    buildBiographyMessages(scenario, playedTurns),
    completionOptions("ending", options, "high", "ending-primary"),
    "biography_report",
    parseExpectedBiography(expectedHistoryTimeline, { name: firstTurn.protagonistName, deathYearLabel: finalTurn.yearLabel, deathAge: finalTurn.protagonistAge }),
    {},
  );
  const worldReportPromise = requestValidated(
    buildWorldReportMessages(scenario, playedTurns),
    completionOptions("ending", options, "high", "ending-primary"),
    "world_report",
    parseWorldReport,
    {},
  );
  const [biography, worldReport] = await Promise.all([biographyPromise, worldReportPromise]);
  return parseAlternatePresent(JSON.stringify({ ...biography, ...worldReport }), {
    expectedHistoryTimeline,
    expectedProtagonistName: firstTurn.protagonistName,
    expectedDeathYearLabel: finalTurn.yearLabel,
    expectedDeathAge: finalTurn.protagonistAge,
  });
}
