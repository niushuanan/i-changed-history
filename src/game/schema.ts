import { z } from "zod";
import { CHAPTER_NAMES, JUMP_LABELS, type DecisionChapter, type LifeStage } from "./timelinePlan";
import type { RippleLens } from "./rippleRouter";

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
const generationSourceSchema = z.literal("deepseek");
const rippleLensSchema = z.enum(["origin", "power", "livelihood", "knowledge", "technology", "culture", "trade", "migration", "ecology", "diplomacy"]);

const echoSchema = z.object({
  directResult: boundedString(80),
  unexpectedCost: boundedString(32),
  beneficiary: boundedString(24),
  payer: boundedString(24),
});

const GENERIC_ACTION_PATTERN = /保留现有安排|修正最紧迫|重写规则|废除旧约束|新的联盟|加强管理|稳步推进|优化安排|灵活处理|综合施策|视情况而定/;

const actionSpecSchema = z.object({
  actor: boundedString(20),
  action: boundedString(28),
  target: boundedString(28),
  deadline: boundedString(20),
});

export const customActionResolutionSchema = z.object({
  declaredOutcome: z.string().trim().min(2).max(80),
  canonStatus: z.literal("玩家钦定"),
  causalMechanism: boundedString(56),
  deviationClass: deviationClassSchema,
  instantEcho: echoSchema,
});

const choiceFields = {
  label: boundedString(36),
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

const clampedMetricSchema = z.number().finite().transform((value) =>
  Math.min(100, Math.max(0, Math.round(value))),
);

const metricsSchema = z.object({
  stability: clampedMetricSchema,
  prosperity: clampedMetricSchema,
  freedom: clampedMetricSchema,
  cost: clampedMetricSchema,
});

const metricDeltasSchema = z.object({
  stability: z.number().finite(),
  prosperity: z.number().finite(),
  freedom: z.number().finite(),
  cost: z.number().finite(),
});

const causalLedgerEntrySchema = z.object({
  fact: requiredString,
  causedByChapter: causalChapterSchema,
  mustAffect: requiredString,
});

const strictTimelineTurnSchema = z
  .object({
    timelineName: requiredString,
    chapter: chapterSchema,
    chapterName: chapterNameSchema,
    protagonistName: boundedString(16),
    protagonistAge: z.number().int().min(14).max(90),
    lifeStage: lifeStageSchema,
    yearLabel: requiredString,
    location: boundedString(28),
    role: boundedString(24),
    identityBridge: boundedString(54),
    modernAdvantage: boundedString(54),
    rippleLens: rippleLensSchema,
    causalBridge: boundedString(44),
    turningPointStakes: boundedString(44),
    worldStateChange: boundedString(44),
    divergenceProof: boundedString(56),
    immediateObjective: boundedString(40),
    timePressure: boundedString(36),
    headline: boundedString(22),
    narrative: requiredString.max(56),
    baselineAnchor: boundedString(54),
    historicalAnchors: z.array(boundedString(32)).min(2).max(4),
    previousEcho: echoSchema.nullable(),
    choices: choicesSchema,
    memorySummary: requiredString,
    metrics: metricsSchema,
    metricDeltas: metricDeltasSchema,
    causalLedger: z.array(causalLedgerEntrySchema),
    callbackUsed: requiredString.nullable(),
    visualTone: visualToneSchema,
    generationSource: generationSourceSchema,
  })
  .superRefine((turn, context) => {
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
  if (characters.length <= 56) return value;

  const candidate = characters.slice(0, 56).join("");
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

  return {
    ...choice,
    id: expectedId,
    label: trimBounded(label, 22),
    intent: trimBounded(intentWasClass ? label : intent, 24),
    deviationClass: DEVIATION_CLASSES[index],
    usesModernKnowledge: choice.usesModernKnowledge,
    actionSpec: normalizeActionSpec(choice.actionSpec),
    instantEcho: normalizeEcho(choice.instantEcho),
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

  return {
    ...turn,
    generationSource: "deepseek",
    timelineName: trimBounded(turn.timelineName, 24),
    protagonistName: turn.protagonistName,
    protagonistAge: turn.protagonistAge ?? 24,
    lifeStage: turn.lifeStage ?? JUMP_LABELS[Math.max(0, Number(turn.chapter ?? 1) - 1)],
    identityBridge: trimBounded(turn.identityBridge, 54),
    modernAdvantage: trimBounded(turn.modernAdvantage, 54),
    location: trimBounded(turn.location, 28),
    role: trimBounded(turn.role, 24),
    immediateObjective: trimBounded(turn.immediateObjective, 40),
    timePressure: trimBounded(turn.timePressure, 36),
    headline: trimBounded(turn.headline, 22),
    narrative: trimNarrative(turn.narrative),
    causalBridge: trimBounded(turn.causalBridge, 44),
    turningPointStakes: trimBounded(turn.turningPointStakes, 44),
    worldStateChange: trimBounded(turn.worldStateChange, 44),
    divergenceProof: trimBounded(turn.divergenceProof, 56),
    baselineAnchor: trimBounded(joinStringArray(turn.baselineAnchor), 54),
    historicalAnchors: Array.isArray(turn.historicalAnchors)
      ? turn.historicalAnchors.map((anchor) => trimBounded(anchor, 32))
      : turn.historicalAnchors,
    previousEcho:
      turn.previousEcho == null && Number(turn.chapter ?? 1) === 1
        ? null
        : normalizeEcho(turn.previousEcho),
    choices: Array.isArray(normalizedChoices)
      ? normalizedChoices.map((choice, index) => ({ ...asRecord(choice), usesModernKnowledge: index === authoritativeModernIndex }))
      : normalizedChoices,
    memorySummary: joinStringArray(turn.memorySummary),
    metrics: turn.metrics ?? { stability: 50, prosperity: 50, freedom: 50, cost: 50 },
    metricDeltas: turn.metricDeltas ?? { stability: 0, prosperity: 0, freedom: 0, cost: 0 },
    causalLedger: turn.causalLedger ?? [],
    callbackUsed:
      turn.callbackUsed === false
        ? null
        : turn.callbackUsed === true
          ? "已回收上一幕选择"
          : turn.callbackUsed ?? null,
    visualTone: visualTone ?? turn.visualTone,
  };
}

export const timelineTurnSchema = z.preprocess(
  normalizeTimelineTurnCandidate,
  strictTimelineTurnSchema,
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
    ordinaryLife2026: z.tuple([boundedString(36), boundedString(36), boundedString(36)]),
    posthumousChronicle: z.tuple([
      z.object({ period: boundedString(18), title: boundedString(22), narrative: boundedString(54), inheritedChange: boundedString(42) }),
      z.object({ period: boundedString(18), title: boundedString(22), narrative: boundedString(54), inheritedChange: boundedString(42) }),
      z.object({ period: boundedString(18), title: boundedString(22), narrative: boundedString(54), inheritedChange: boundedString(42) }),
      z.object({ period: boundedString(18), title: boundedString(22), narrative: boundedString(54), inheritedChange: boundedString(42) }),
    ]),
    closingPassage: requiredString.max(180),
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

export const biographyReportSchema = z.object(biographyFields);
export const worldReportSchema = z.object(worldReportFields);

export const alternatePresentSchema = z
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
  expectedRippleLens?: RippleLens;
  expectedProtagonistName?: string;
  expectedProtagonistAge?: number;
  expectedLifeStage?: LifeStage;
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

export function parseTimelineTurn(
  raw: string,
  options: TimelineTurnParseOptions = {},
): TimelineTurn {
  const parsed = parseJsonObject(raw);
  const candidate = asRecord(parsed);
  if (!candidate) return timelineTurnSchema.parse(parsed);
  return timelineTurnSchema.parse({
    ...candidate,
    ...(options.expectedChapter ? { chapter: options.expectedChapter, chapterName: CHAPTER_NAMES[options.expectedChapter] } : {}),
    ...(options.expectedYearLabel ? { yearLabel: options.expectedYearLabel } : {}),
    ...(options.expectedPreviousEcho ? { previousEcho: options.expectedPreviousEcho } : {}),
    ...(options.expectedRippleLens ? { rippleLens: options.expectedRippleLens } : {}),
    ...(options.expectedProtagonistName ? { protagonistName: options.expectedProtagonistName } : {}),
    ...(options.expectedProtagonistAge !== undefined ? { protagonistAge: options.expectedProtagonistAge } : {}),
    ...(options.expectedLifeStage ? { lifeStage: options.expectedLifeStage } : {}),
  });
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
