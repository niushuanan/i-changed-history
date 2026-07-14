import { z } from "zod";
import { CHAPTER_NAMES, JUMP_LABELS, type DecisionChapter, type LifeStage } from "./timelinePlan";

const requiredString = z.string().trim().min(1);
const boundedString = (max: number) => requiredString.max(max);
const chapterSchema = z.number().int().min(1).max(12).transform((value) => value as DecisionChapter);
const causalChapterSchema = z.number().int().min(0).max(12);
const chapterNameSchema = z.enum([
  "历史现场", "三日余波", "六周震荡", "立足之年", "声名渐起", "执掌一方",
  "生涯转折", "盛年危局", "守成之争", "暮年抉择", "最后布局", "生命终章",
]);
const lifeStageSchema = z.enum(JUMP_LABELS);
const deviationClassSchema = z.enum(["nudge", "reform", "rupture"]);
const visualToneSchema = z.enum([
  "ancient",
  "exchange",
  "print",
  "revolution",
  "industry",
  "war",
  "space",
  "digital",
]);
const generationSourceSchema = z.enum(["fixed", "deepseek"]);

const echoSchema = z.object({
  directResult: boundedString(80),
  unexpectedCost: boundedString(32),
  beneficiary: boundedString(32),
  payer: boundedString(32),
});

const GENERIC_ACTION_PATTERN = /保留现有安排|修正最紧迫|重写规则|废除旧约束|新的联盟|加强管理|稳步推进|优化安排|灵活处理|综合施策|视情况而定/;
const INCOMPLETE_CHOICE_END_PATTERN = /(?:的|并|同时|随后|转而|改为|通过|试图|准备|意图|而非|而非中|试图平衡|是应急|出资补|[，,](?:向|对|把|将|让|以|从|与|和|及|但|且))$/;
const ALTERNATE_TIMELINE_IN_BASELINE_PATTERN = /当前(?:时间)?线|本线|架空线|改变后|玩家(?:的)?选择|你(?:的)?决定/;
const PRE_MODERN_LOCATION_PATTERN = /议事厅|会议室|办公室|指挥中心|新闻中心|发布厅|报告厅|展览厅|作战室|控制室|调度室/;
const preModernLocationSchema = z.object({
  location: z.string().refine(
    (location) => !PRE_MODERN_LOCATION_PATTERN.test(location),
    "地点称谓与时代不符，请改用当时真实存在的空间称谓",
  ),
});

const actionSpecSchema = z.object({
  actor: boundedString(20),
  action: boundedString(28),
  target: boundedString(28),
  deadline: boundedString(20),
});

const customActionResolutionObjectSchema = z.object({
  declaredOutcome: z.string().trim().min(2).max(80),
  canonStatus: z.literal("玩家钦定"),
  causalMechanism: boundedString(56),
  deviationClass: deviationClassSchema,
  instantEcho: echoSchema,
});

export const customActionResolutionSchema = z.preprocess(
  normalizeCustomActionResolutionCandidate,
  customActionResolutionObjectSchema,
);

const choiceLabelSchema = boundedString(36).refine((label) => {
  const withoutPunctuation = label.replace(/[。！？!?]+$/g, "").trim();
  return !INCOMPLETE_CHOICE_END_PATTERN.test(withoutPunctuation);
}, "行动必须是完整句，不能停在连接词、意图或缺少对象的动词上");

const choiceFields = {
  label: choiceLabelSchema,
  intent: boundedString(40),
  deviationClass: deviationClassSchema,
  instantEcho: echoSchema,
  usesModernKnowledge: z.boolean(),
  actionSpec: actionSpecSchema,
} as const;

const choicesSchema = z.tuple([
  z.object({ id: z.literal("A"), ...choiceFields }),
  z.object({ id: z.literal("B"), ...choiceFields }),
  z.object({ id: z.literal("C"), ...choiceFields }),
]);

const causalLedgerEntrySchema = z.object({
  fact: requiredString,
  causedByChapter: causalChapterSchema,
  mustAffect: requiredString,
});

const richNarrativeSchema = requiredString
  .max(160)
  .refine((narrative) => [...narrative].length >= 80, {
    message: "现场前情至少需要 80 字",
  })
  .refine((narrative) => {
    const sentenceCount = narrative.match(/[。！？!?]/g)?.length ?? 0;
    return sentenceCount >= 2 && sentenceCount <= 7;
  }, {
    message: "现场前情需要至少两句完整叙事，并避免堆叠碎句",
  });

const timelineTurnFields = {
    chapter: chapterSchema,
    chapterName: chapterNameSchema,
    protagonistName: boundedString(16),
    protagonistAge: z.number().int().min(14).max(90),
    lifeStage: lifeStageSchema,
    yearLabel: requiredString,
    location: boundedString(28),
    role: boundedString(32),
    causalBridge: boundedString(48),
    worldStateChange: boundedString(48),
    divergenceProof: boundedString(64),
    immediateObjective: boundedString(40),
    timePressure: boundedString(36),
    headline: boundedString(22),
    baselineAnchor: boundedString(54),
    historicalAnchors: z.array(boundedString(40)).min(2).max(4),
    previousEcho: echoSchema.nullable(),
    choices: choicesSchema,
    memorySummary: requiredString,
    causalLedger: z.array(causalLedgerEntrySchema).max(3),
    visualTone: visualToneSchema,
    generationSource: generationSourceSchema,
} as const;

const timelineTurnObjectSchema = z.object({
  ...timelineTurnFields,
  narrative: richNarrativeSchema,
});

const compatibleStoredTimelineTurnObjectSchema = z.object({
  ...timelineTurnFields,
  narrative: requiredString.max(160),
});

type TimelineTurnCandidate = z.infer<typeof timelineTurnObjectSchema>;

function validateTimelineTurn(
  turn: TimelineTurnCandidate,
  context: z.RefinementCtx,
) {
    if (turn.chapterName !== CHAPTER_NAMES[turn.chapter]) {
      context.addIssue({
        code: "custom",
        path: ["chapterName"],
        message: "幕次名称与章节不匹配",
      });
    }

    if (turn.chapter === 1 && turn.previousEcho !== null) {
      context.addIssue({
        code: "custom",
        path: ["previousEcho"],
        message: "第一幕不能包含上次选择回响",
      });
    }

    if (turn.chapter > 1 && turn.previousEcho === null) {
      context.addIssue({
        code: "custom",
        path: ["previousEcho"],
        message: "第二幕起必须包含上次选择回响",
      });
    }

    const classes = new Set(turn.choices.map((choice) => choice.deviationClass));
    if (classes.size !== 3) {
      context.addIssue({
        code: "custom",
        path: ["choices"],
        message: "三个选择必须恰好覆盖 nudge、reform 和 rupture",
      });
    }

    if (turn.choices.filter((choice) => choice.usesModernKnowledge).length !== 1) {
      context.addIssue({
        code: "custom",
        path: ["choices"],
        message: "三个选择中必须恰好一个使用现代知识",
      });
    }

    if (ALTERNATE_TIMELINE_IN_BASELINE_PATTERN.test(turn.divergenceProof)) {
      context.addIssue({
        code: "custom",
        path: ["divergenceProof"],
        message: "真实历史对照不能混入当前架空时间线",
      });
    }

    turn.choices.forEach((choice, index) => {
      if (GENERIC_ACTION_PATTERN.test(`${choice.label} ${choice.intent} ${choice.actionSpec.action}`)) {
        context.addIssue({
          code: "custom",
          path: ["choices", index, "label"],
          message: "行动过于抽象，必须写明谁在期限内对什么对象做什么",
        });
      }
      const specificity = `${choice.label}${choice.actionSpec.actor}${choice.actionSpec.action}${choice.actionSpec.target}${choice.actionSpec.deadline}`;
      if (specificity.length < 18) {
        context.addIssue({
          code: "custom",
          path: ["choices", index, "actionSpec"],
          message: "行动缺少足够具体的执行信息",
        });
      }
    });
}

const strictTimelineTurnSchema = timelineTurnObjectSchema.superRefine((turn, context) => {
  validateTimelineTurn(turn, context);
});

const compatibleStoredTimelineTurnSchema = compatibleStoredTimelineTurnObjectSchema.superRefine((turn, context) => {
  validateTimelineTurn(turn, context);
});

const DEVIATION_CLASSES = ["nudge", "reform", "rupture"] as const;
const CHOICE_IDS = ["A", "B", "C"] as const;
const VISUAL_TONES = [
  "ancient",
  "exchange",
  "print",
  "revolution",
  "industry",
  "war",
  "space",
  "digital",
] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function joinStringArray(value: unknown): unknown {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value.join("；")
    : value;
}

function trimNarrative(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const characters = [...value];
  if (characters.length <= 160) return value;

  const candidate = characters.slice(0, 160).join("");
  const sentenceEnd = Math.max(
    candidate.lastIndexOf("。"),
    candidate.lastIndexOf("！"),
    candidate.lastIndexOf("？"),
  );
  return sentenceEnd >= 20 ? candidate.slice(0, sentenceEnd + 1) : candidate;
}

function trimBounded(value: unknown, max: number): unknown {
  return typeof value === "string" ? [...value].slice(0, max).join("") : value;
}

function compactAiAuthoredClause(value: unknown, max: number): unknown {
  if (typeof value !== "string" || [...value].length <= max) return value;

  const candidates = value
    .split(/[，,。！？!?；;：:（）()]/)
    .map((clause) => clause.trim())
    .filter((clause) => (
      [...clause].length >= 4
      && [...clause].length <= max
      && !INCOMPLETE_CHOICE_END_PATTERN.test(clause)
    ));
  const standalone = candidates.filter((clause) => !/^(?:并|但|而|且|以及|并且|同时|随后|然后|以)/.test(clause));
  const pool = standalone.length > 0 ? standalone : candidates;
  return [...pool].sort((left, right) => [...right].length - [...left].length)[0] ?? value;
}

function trimAtCompleteClause(value: unknown, max: number): unknown {
  if (typeof value !== "string") return value;
  const characters = [...value];
  if (characters.length <= max) return value;

  const candidate = characters.slice(0, max);
  let boundaryIndex = -1;
  for (let index = 0; index < candidate.length; index += 1) {
    if ("。！？!?；;，,".includes(candidate[index])) boundaryIndex = index;
  }
  if (boundaryIndex < Math.floor(max * 0.45)) return value;

  const boundary = candidate[boundaryIndex];
  if ("。！？!?".includes(boundary)) {
    return candidate.slice(0, boundaryIndex + 1).join("");
  }
  return `${candidate.slice(0, boundaryIndex).join("").trim()}。`;
}

function coerceDisplayString(value: unknown): unknown {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const record = asRecord(value);
  return record?.label ?? record?.value ?? value;
}

function normalizeBiographyReportCandidate(value: unknown): unknown {
  const report = asRecord(value);
  if (!report) return value;
  const deathScene = asRecord(report.deathScene);
  return {
    ...report,
    vernacularBiography: trimBounded(report.vernacularBiography, 720),
    classicalBiography: trimBounded(report.classicalBiography, 520),
    lifespanSummary: trimBounded(report.lifespanSummary, 180),
    deathScene: deathScene ? {
      ...deathScene,
      place: trimBounded(deathScene.place, 32),
      finalMoment: trimBounded(deathScene.finalMoment, 120),
      lastingLegacy: trimBounded(deathScene.lastingLegacy, 120),
    } : report.deathScene,
  };
}

function normalizeWorldReportCandidate(value: unknown): unknown {
  const report = asRecord(value);
  if (!report) return value;
  const plausibilityScore = typeof report.plausibilityScore === "string"
    && report.plausibilityScore.trim() !== ""
    ? Number(report.plausibilityScore)
    : report.plausibilityScore;
  return {
    ...report,
    rewriteLevel: coerceDisplayString(report.rewriteLevel),
    plausibilityScore,
  };
}

function normalizeAlternatePresentCandidate(value: unknown): unknown {
  return normalizeWorldReportCandidate(normalizeBiographyReportCandidate(value));
}

function normalizeDivergenceProof(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return trimAtCompleteClause(value.replace(/^\s*真实历史中\s*[，,:：]?\s*/, ""), 64);
}

function normalizeEcho(value: unknown): unknown {
  const echo = asRecord(value);
  if (!echo) return value;
  return {
    ...echo,
    directResult: trimBounded(echo.directResult, 80),
    unexpectedCost: trimBounded(echo.unexpectedCost, 32),
    beneficiary: trimBounded(echo.beneficiary, 24),
    payer: trimBounded(echo.payer, 24),
  };
}

function normalizeCustomActionResolutionCandidate(value: unknown): unknown {
  const resolution = asRecord(value);
  if (!resolution) return value;
  return {
    ...resolution,
    causalMechanism: trimBounded(resolution.causalMechanism, 56),
    instantEcho: normalizeEcho(resolution.instantEcho),
  };
}

function normalizeActionSpec(value: unknown): unknown {
  const spec = asRecord(value);
  if (!spec) return value;
  return {
    ...spec,
    actor: trimBounded(spec.actor, 20),
    action: trimBounded(spec.action, 28),
    target: trimBounded(spec.target, 28),
    deadline: trimBounded(spec.deadline, 20),
  };
}

function normalizeTimelineEcho(value: unknown): unknown {
  const echo = asRecord(value);
  if (!echo) return value;
  return {
    ...echo,
    directResult: compactAiAuthoredClause(echo.directResult, 80),
    unexpectedCost: compactAiAuthoredClause(echo.unexpectedCost, 32),
    beneficiary: compactAiAuthoredClause(echo.beneficiary, 32),
    payer: compactAiAuthoredClause(echo.payer, 32),
  };
}

function normalizeChoice(value: unknown, index: number): unknown {
  const choice = asRecord(value);
  const expectedId = CHOICE_IDS[index];
  if (!choice || !expectedId) return value;

  const intentWasClass = DEVIATION_CLASSES.includes(
    choice.intent as (typeof DEVIATION_CLASSES)[number],
  );
  const label =
    typeof choice.label === "string"
      ? choice.label.replace(new RegExp(`^\\s*${expectedId}[.\\u3001：:]\\s*`), "")
      : choice.label;
  const intent = typeof choice.intent === "string"
    ? choice.intent.replace(/\s*[（(](?:nudge|reform|rupture)[）)]\s*$/i, "").trim()
    : choice.intent;
  const normalizedIntent = intentWasClass
    ? label
    : typeof intent === "string" && intent.length > 0
      ? intent
      : label ?? asRecord(choice.actionSpec)?.action;

  return {
    ...choice,
    id: expectedId,
    // Visible choices must never be silently cut into a half sentence. An
    // oversized label is repaired as part of the model-owned choices field.
    label: compactAiAuthoredClause(typeof label === "string" ? label.trim() : label, 36),
    intent: trimBounded(normalizedIntent, 24),
    deviationClass: DEVIATION_CLASSES[index],
    usesModernKnowledge: choice.usesModernKnowledge,
    actionSpec: normalizeActionSpec(choice.actionSpec),
    instantEcho: normalizeTimelineEcho(choice.instantEcho),
  };
}

function normalizeTimelineTurnCandidate(value: unknown): unknown {
  const turn = asRecord(value);
  if (!turn) return value;

  const toneCandidates = Array.isArray(turn.visualTone)
    ? turn.visualTone
    : [turn.visualTone];
  const visualTone = toneCandidates.find(
    (tone): tone is (typeof VISUAL_TONES)[number] =>
      typeof tone === "string" && VISUAL_TONES.includes(tone as (typeof VISUAL_TONES)[number]),
  );

  const normalizedChoices = Array.isArray(turn.choices)
    ? turn.choices.map((choice, index) => normalizeChoice(choice, index))
    : turn.choices;
  const firstModernChoice = Array.isArray(normalizedChoices)
    ? normalizedChoices.findIndex((choice) => asRecord(choice)?.usesModernKnowledge === true)
    : -1;
  const authoritativeModernIndex = firstModernChoice >= 0 ? firstModernChoice : 1;
  const choiceRecords = Array.isArray(normalizedChoices)
    ? normalizedChoices.map((choice) => asRecord(choice))
    : [];
  const middleChoice = choiceRecords[1] ?? choiceRecords[0];
  const middleAction = asRecord(middleChoice?.actionSpec);
  const derivedObjective = middleChoice?.label;
  const derivedDeadline = middleAction?.deadline;
  const derivedBaseline = turn.divergenceProof;
  const derivedMemory = [turn.headline, turn.worldStateChange]
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .join("：");

  return {
    ...turn,
    generationSource: turn.generationSource === "fixed" ? "fixed" : "deepseek",
    protagonistName: turn.protagonistName,
    protagonistAge: turn.protagonistAge ?? 24,
    lifeStage: turn.lifeStage ?? JUMP_LABELS[Math.max(0, Number(turn.chapter ?? 1) - 1)],
    location: turn.location,
    role: compactAiAuthoredClause(turn.role, 32),
    immediateObjective: trimBounded(turn.immediateObjective ?? derivedObjective, 40),
    timePressure: turn.timePressure ?? derivedDeadline,
    headline: turn.headline,
    narrative: trimNarrative(turn.narrative),
    causalBridge: trimAtCompleteClause(turn.causalBridge, 48),
    worldStateChange: trimAtCompleteClause(turn.worldStateChange, 48),
    divergenceProof: normalizeDivergenceProof(turn.divergenceProof),
    baselineAnchor: trimBounded(joinStringArray(turn.baselineAnchor ?? derivedBaseline), 54),
    historicalAnchors: Array.isArray(turn.historicalAnchors)
      ? turn.historicalAnchors.map((anchor) => compactAiAuthoredClause(anchor, 40))
      : turn.historicalAnchors,
    previousEcho:
      turn.previousEcho == null && Number(turn.chapter ?? 1) === 1
        ? null
        : turn.previousEcho,
    choices: Array.isArray(normalizedChoices)
      ? normalizedChoices.map((choice, index) => ({ ...asRecord(choice), usesModernKnowledge: index === authoritativeModernIndex }))
      : normalizedChoices,
    memorySummary: joinStringArray(turn.memorySummary ?? derivedMemory),
    causalLedger: Array.isArray(turn.causalLedger) ? turn.causalLedger.slice(0, 3) : turn.causalLedger ?? [],
    visualTone: visualTone ?? turn.visualTone,
  };
}

export const timelineTurnSchema = z.preprocess(
  normalizeTimelineTurnCandidate,
  strictTimelineTurnSchema,
);

export const storedTimelineTurnSchema = z.preprocess(
  normalizeTimelineTurnCandidate,
  compatibleStoredTimelineTurnSchema,
);

const historyTimelineItemSchema = z.object({
  chapter: chapterSchema,
  yearLabel: requiredString,
  playerChoice: requiredString,
  consequence: requiredString,
});

const causalChainSchema = z.object({
  origin: requiredString,
  transformation: requiredString,
  payoff: requiredString,
});

const completeReportSentence = (max: number) => requiredString.max(max).refine((value) => {
  const withoutPunctuation = value.replace(/[。！？!?]+$/g, "").trim();
  return !INCOMPLETE_CHOICE_END_PATTERN.test(withoutPunctuation);
}, "报告文案必须是完整句，不能停在连接词或未完成的动作上");

const biographyFields = {
    vernacularBiography: requiredString.max(720),
    classicalBiography: requiredString.max(520),
    protagonistName: boundedString(16),
    lifespanSummary: requiredString.max(180),
    deathScene: z.object({
      yearLabel: requiredString,
      age: z.number().int().min(14).max(100),
      place: boundedString(32),
      finalMoment: requiredString.max(120),
      lastingLegacy: requiredString.max(120),
    }),
    historyTimeline: z.array(historyTimelineItemSchema).length(12),
} as const;

const worldReportFields = {
    worldName: requiredString,
    frontPageHeadline: requiredString,
    causalChains: z.tuple([causalChainSchema, causalChainSchema, causalChainSchema]),
    ordinaryLife2026: z.tuple([completeReportSentence(48), completeReportSentence(48), completeReportSentence(48)]),
    posthumousChronicle: z.tuple([
      z.object({ period: boundedString(24), title: boundedString(32), narrative: completeReportSentence(84), inheritedChange: completeReportSentence(64) }),
      z.object({ period: boundedString(24), title: boundedString(32), narrative: completeReportSentence(84), inheritedChange: completeReportSentence(64) }),
      z.object({ period: boundedString(24), title: boundedString(32), narrative: completeReportSentence(84), inheritedChange: completeReportSentence(64) }),
      z.object({ period: boundedString(24), title: boundedString(32), narrative: completeReportSentence(84), inheritedChange: completeReportSentence(64) }),
    ]),
    closingPassage: completeReportSentence(240),
    greatestGain: requiredString,
    hiddenPrice: requiredString,
    strangestDetail: requiredString,
    biggestBeneficiary: requiredString,
    biggestLoser: requiredString,
    rewriteLevel: requiredString,
    plausibilityScore: z.number().finite().min(0).max(100),
    plausibilityReason: requiredString,
    shareLine: requiredString,
} as const;

const biographyReportObjectSchema = z.object(biographyFields);
const worldReportObjectSchema = z.object(worldReportFields);

export const biographyReportSchema = z.preprocess(
  normalizeBiographyReportCandidate,
  biographyReportObjectSchema,
);
export const worldReportSchema = z.preprocess(
  normalizeWorldReportCandidate,
  worldReportObjectSchema,
);

const alternatePresentObjectSchema = z
  .object({ ...biographyFields, ...worldReportFields })
  .superRefine((ending, context) => {
    ending.historyTimeline.forEach((item, index) => {
      if (item.chapter !== index + 1) {
        context.addIssue({
          code: "custom",
          path: ["historyTimeline", index, "chapter"],
          message: "结局时间线必须按第一节点到第十二节点排列",
        });
      }
    });
  });

export const alternatePresentSchema = z.preprocess(
  normalizeAlternatePresentCandidate,
  alternatePresentObjectSchema,
);

export type TimelineTurn = z.infer<typeof timelineTurnSchema>;
export type AlternatePresent = z.infer<typeof alternatePresentSchema>;
export type BiographyReport = z.infer<typeof biographyReportSchema>;
export type WorldReport = z.infer<typeof worldReportSchema>;
export type DeviationClass = z.infer<typeof deviationClassSchema>;
export type CustomActionResolution = z.infer<typeof customActionResolutionSchema>;
export type TimelineTurnParseOptions = {
  expectedChapter?: DecisionChapter;
  expectedYearLabel?: string;
  expectedPreviousEcho?: NonNullable<TimelineTurn["previousEcho"]>;
  expectedProtagonistName?: string;
  expectedProtagonistAge?: number;
  expectedLifeStage?: LifeStage;
  expectedGenerationSource?: TimelineTurn["generationSource"];
  expectedCausalLedger?: TimelineTurn["causalLedger"];
};
export type ExpectedHistoryTimelineItem = {
  yearLabel: string;
  playerChoice: string;
};
export type AlternatePresentParseOptions = {
  expectedHistoryTimeline?: readonly ExpectedHistoryTimelineItem[];
  expectedProtagonistName?: string;
  expectedDeathYearLabel?: string;
  expectedDeathAge?: number;
};

function scanBalancedObject(raw: string, start: number): string | null {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < raw.length; index += 1) {
    const character = raw[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
    } else if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) return raw.slice(start, index + 1);
      if (depth < 0) return null;
    }
  }

  return null;
}

export function extractFirstJsonObject(raw: string): string {
  for (let start = raw.indexOf("{"); start !== -1; start = raw.indexOf("{", start + 1)) {
    const candidate = scanBalancedObject(raw, start);
    if (candidate === null) continue;

    try {
      const parsed: unknown = JSON.parse(candidate);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return candidate;
    } catch {
      // Keep scanning in case prose contained a brace before the JSON payload.
    }
  }

  throw new SyntaxError("模型响应中没有可解析的 JSON 对象。");
}

function parseJsonObject(raw: string): unknown {
  return JSON.parse(extractFirstJsonObject(raw));
}

function mergeAuthoritativeLedger(
  modelLedger: unknown,
  authoritativeLedger: TimelineTurn["causalLedger"],
): unknown[] {
  const authoritativeChapters = new Set(authoritativeLedger.map((entry) => entry.causedByChapter));
  const modelEntries = Array.isArray(modelLedger)
    ? modelLedger.filter((entry) => {
        const record = asRecord(entry);
        return record && !authoritativeChapters.has(Number(record.causedByChapter));
      })
    : [];
  return [...authoritativeLedger, ...modelEntries].slice(0, 3);
}

export function parseTimelineTurn(
  raw: string,
  options: TimelineTurnParseOptions = {},
): TimelineTurn {
  const parsed = parseJsonObject(raw);
  const candidate = asRecord(parsed);
  const turn = timelineTurnSchema.parse(candidate ? {
    ...candidate,
    generationSource: options.expectedGenerationSource ?? "deepseek",
    ...(options.expectedChapter ? { chapter: options.expectedChapter, chapterName: CHAPTER_NAMES[options.expectedChapter] } : {}),
    ...(options.expectedYearLabel ? { yearLabel: options.expectedYearLabel } : {}),
    ...(options.expectedPreviousEcho ? { previousEcho: options.expectedPreviousEcho } : {}),
    ...(options.expectedProtagonistName ? { protagonistName: options.expectedProtagonistName } : {}),
    ...(options.expectedProtagonistAge !== undefined ? { protagonistAge: options.expectedProtagonistAge } : {}),
    ...(options.expectedLifeStage ? { lifeStage: options.expectedLifeStage } : {}),
    ...(options.expectedCausalLedger ? {
      causalLedger: mergeAuthoritativeLedger(candidate.causalLedger, options.expectedCausalLedger),
    } : {}),
  } : parsed);
  const expectedYear = Number(options.expectedYearLabel?.match(/\d+/)?.[0]);
  if (Number.isFinite(expectedYear) && expectedYear < 1900) {
    preModernLocationSchema.parse({ location: turn.location });
  }
  return turn;
}

export function parseCustomActionResolution(raw: string): CustomActionResolution {
  return customActionResolutionSchema.parse(parseJsonObject(raw));
}

export function parseBiographyReport(
  raw: string,
  options: AlternatePresentParseOptions = {},
): BiographyReport {
  const parsed = parseJsonObject(raw);
  const candidate = asRecord(parsed);
  if (!candidate) return biographyReportSchema.parse(parsed);
  const expected = options.expectedHistoryTimeline;
  const deathScene = asRecord(candidate.deathScene);
  const historyTimeline = expected && Array.isArray(candidate.historyTimeline)
    ? candidate.historyTimeline.map((item, index) => {
        const authoritative = expected[index];
        if (!authoritative) return item;
        const record = asRecord(item);
        return {
          ...(record ?? { consequence: typeof item === "string" ? item : "该决定继续改变后世" }),
          chapter: index + 1,
          yearLabel: authoritative.yearLabel,
          playerChoice: authoritative.playerChoice,
        };
      })
    : candidate.historyTimeline;

  return biographyReportSchema.parse({
    ...candidate,
    ...(options.expectedProtagonistName ? { protagonistName: options.expectedProtagonistName } : {}),
    ...(deathScene ? {
      deathScene: {
        ...deathScene,
        ...(options.expectedDeathYearLabel ? { yearLabel: options.expectedDeathYearLabel } : {}),
        ...(options.expectedDeathAge !== undefined ? { age: options.expectedDeathAge } : {}),
      },
    } : {}),
    historyTimeline,
  });
}

export function parseWorldReport(raw: string): WorldReport {
  return worldReportSchema.parse(parseJsonObject(raw));
}

export function parseAlternatePresent(
  raw: string,
  options: AlternatePresentParseOptions = {},
): AlternatePresent {
  const parsed = parseJsonObject(raw);
  const candidate = asRecord(parsed);
  const expected = options.expectedHistoryTimeline;
  const deathScene = candidate ? asRecord(candidate.deathScene) : null;
  const authoritativeCandidate: Record<string, unknown> | null = candidate ? {
    ...candidate,
    ...(options.expectedProtagonistName ? { protagonistName: options.expectedProtagonistName } : {}),
    ...(deathScene && (options.expectedDeathYearLabel || options.expectedDeathAge !== undefined) ? {
      deathScene: {
        ...deathScene,
        ...(options.expectedDeathYearLabel ? { yearLabel: options.expectedDeathYearLabel } : {}),
        ...(options.expectedDeathAge !== undefined ? { age: options.expectedDeathAge } : {}),
      },
    } : {}),
  } : null;

  if (!authoritativeCandidate || !expected || !Array.isArray(authoritativeCandidate.historyTimeline)) {
    return alternatePresentSchema.parse(authoritativeCandidate ?? parsed);
  }

  const historyTimeline = (authoritativeCandidate.historyTimeline as unknown[]).map((item, index) => {
    const authoritative = expected[index];
    if (!authoritative) return item;
    const chapter = index + 1;

    if (typeof item === "string") {
      return {
        chapter,
        yearLabel: authoritative.yearLabel,
        playerChoice: authoritative.playerChoice,
        consequence: item,
      };
    }

    const record = asRecord(item);
    return record
      ? {
          ...record,
          chapter,
          yearLabel: authoritative.yearLabel,
          playerChoice: authoritative.playerChoice,
        }
      : item;
  });

  return alternatePresentSchema.parse({ ...authoritativeCandidate, historyTimeline });
}
