import { z } from "zod";
import { CHAPTER_NAMES, type DecisionChapter } from "./timelinePlan";

const requiredString = z.string().trim().min(1);
const boundedString = (max: number) => requiredString.max(max);
const chapterSchema = z.number().int().min(1).max(11).transform((value) => value as DecisionChapter);
const causalChapterSchema = z.number().int().min(0).max(11);
const chapterNameSchema = z.enum([
  "历史现场", "一日余波", "月度震荡", "年轮初成", "三年变局", "十年改写",
  "三十年秩序", "百年分野", "跨时代", "新世界", "终局前夜",
]);
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
const generationSourceSchema = z.enum(["deepseek", "fallback"]);

const echoSchema = z.object({
  directResult: boundedString(32),
  unexpectedCost: boundedString(32),
  beneficiary: boundedString(24),
  payer: boundedString(24),
});

export const customActionResolutionSchema = z.object({
  normalizedAction: z.string().trim().min(2).max(56),
  ruling: z.enum(["按原意执行", "受限执行"]),
  constraintApplied: boundedString(56),
  deviationClass: deviationClassSchema,
  instantEcho: echoSchema,
});

const choiceFields = {
  label: boundedString(36),
  intent: boundedString(40),
  deviationClass: deviationClassSchema,
  instantEcho: echoSchema,
  usesTravelerStrength: z.boolean(),
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
    yearLabel: requiredString,
    location: boundedString(28),
    role: boundedString(24),
    identityBridge: boundedString(54),
    profileAdvantage: boundedString(54),
    immediateObjective: boundedString(40),
    timePressure: boundedString(36),
    headline: boundedString(22),
    narrative: requiredString.max(72),
    baselineAnchor: boundedString(54),
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

    if (turn.choices.filter((choice) => choice.usesTravelerStrength).length !== 1) {
      context.addIssue({
        code: "custom",
        path: ["choices"],
        message: "三个选择中必须恰好一个使用穿越者优势",
      });
    }
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
  if (characters.length <= 72) return value;

  const candidate = characters.slice(0, 72).join("");
  const sentenceEnd = Math.max(
    candidate.lastIndexOf("。"),
    candidate.lastIndexOf("！"),
    candidate.lastIndexOf("？"),
  );
  return sentenceEnd >= 20 ? candidate.slice(0, sentenceEnd + 1) : candidate;
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
    id: choice.id ?? expectedId,
    label,
    intent: intentWasClass ? label : intent,
    deviationClass: choice.deviationClass ?? (intentWasClass ? choice.intent : undefined),
    usesTravelerStrength: choice.usesTravelerStrength ?? index === 1,
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

  return {
    ...turn,
    generationSource: turn.generationSource ?? "deepseek",
    identityBridge: turn.identityBridge ?? (
      turn.chapter === 1
        ? "你的现代意识在这一刻进入历史现场"
        : "上一代的选择留下线索，你在这个时代的新身份中接棒"
    ),
    profileAdvantage: turn.profileAdvantage ?? "现代知识与决策习惯仍可影响本代行动",
    narrative: trimNarrative(turn.narrative),
    baselineAnchor: joinStringArray(turn.baselineAnchor),
    choices: Array.isArray(turn.choices)
      ? turn.choices.map((choice, index) => normalizeChoice(choice, index))
      : turn.choices,
    memorySummary: joinStringArray(turn.memorySummary),
    callbackUsed:
      turn.callbackUsed === false
        ? null
        : turn.callbackUsed === true
          ? "已回收上一幕选择"
          : turn.callbackUsed,
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

export const alternatePresentSchema = z
  .object({
    worldName: requiredString,
    frontPageHeadline: requiredString,
    historyTimeline: z.array(historyTimelineItemSchema).length(11),
    causalChains: z.tuple([causalChainSchema, causalChainSchema, causalChainSchema]),
    ordinaryLife2026: z.tuple([requiredString, requiredString, requiredString]),
    greatestGain: requiredString,
    hiddenPrice: requiredString,
    strangestDetail: requiredString,
    biggestBeneficiary: requiredString,
    biggestLoser: requiredString,
    rewriteLevel: requiredString,
    plausibilityScore: z.number().finite().min(0).max(100),
    plausibilityReason: requiredString,
    shareLine: requiredString,
  })
  .superRefine((ending, context) => {
    ending.historyTimeline.forEach((item, index) => {
      if (item.chapter !== index + 1) {
        context.addIssue({
          code: "custom",
          path: ["historyTimeline", index, "chapter"],
          message: "结局时间线必须按第一节点到第十一节点排列",
        });
      }
    });
  });

export type TimelineTurn = z.infer<typeof timelineTurnSchema>;
export type AlternatePresent = z.infer<typeof alternatePresentSchema>;
export type DeviationClass = z.infer<typeof deviationClassSchema>;
export type CustomActionResolution = z.infer<typeof customActionResolutionSchema>;
export type TimelineTurnParseOptions = {
  expectedChapter?: DecisionChapter;
  expectedYearLabel?: string;
  expectedPreviousEcho?: NonNullable<TimelineTurn["previousEcho"]>;
};
export type ExpectedHistoryTimelineItem = {
  yearLabel: string;
  playerChoice: string;
};
export type AlternatePresentParseOptions = {
  expectedHistoryTimeline?: readonly ExpectedHistoryTimelineItem[];
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
  });
}

export function parseCustomActionResolution(raw: string): CustomActionResolution {
  return customActionResolutionSchema.parse(parseJsonObject(raw));
}

export function parseAlternatePresent(
  raw: string,
  options: AlternatePresentParseOptions = {},
): AlternatePresent {
  const parsed = parseJsonObject(raw);
  const candidate = asRecord(parsed);
  const expected = options.expectedHistoryTimeline;

  if (!candidate || !expected || !Array.isArray(candidate.historyTimeline)) {
    return alternatePresentSchema.parse(parsed);
  }

  const historyTimeline = candidate.historyTimeline.map((item, index) => {
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

  return alternatePresentSchema.parse({ ...candidate, historyTimeline });
}
