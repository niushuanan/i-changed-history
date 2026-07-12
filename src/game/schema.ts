import { z } from "zod";

const requiredString = z.string().trim().min(1);
const chapterSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
const causalChapterSchema = z.union([z.literal(0), chapterSchema]);
const chapterNameSchema = z.enum(["裂缝", "余震", "新秩序", "世界线", "此刻"]);
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

const echoSchema = z.strictObject({
  directResult: requiredString,
  unexpectedCost: requiredString,
  beneficiary: requiredString,
  payer: requiredString,
});

const choiceFields = {
  label: requiredString,
  intent: requiredString,
  deviationClass: deviationClassSchema,
  instantEcho: echoSchema,
} as const;

const choicesSchema = z.tuple([
  z.strictObject({ id: z.literal("A"), ...choiceFields }),
  z.strictObject({ id: z.literal("B"), ...choiceFields }),
  z.strictObject({ id: z.literal("C"), ...choiceFields }),
]);

const clampedMetricSchema = z.number().finite().transform((value) =>
  Math.min(100, Math.max(0, Math.round(value))),
);

const metricsSchema = z.strictObject({
  stability: clampedMetricSchema,
  prosperity: clampedMetricSchema,
  freedom: clampedMetricSchema,
  cost: clampedMetricSchema,
});

const metricDeltasSchema = z.strictObject({
  stability: z.number().finite(),
  prosperity: z.number().finite(),
  freedom: z.number().finite(),
  cost: z.number().finite(),
});

const causalLedgerEntrySchema = z.strictObject({
  fact: requiredString,
  causedByChapter: causalChapterSchema,
  mustAffect: requiredString,
});

const chapterNames = {
  1: "裂缝",
  2: "余震",
  3: "新秩序",
  4: "世界线",
  5: "此刻",
} as const;

const strictTimelineTurnSchema = z
  .strictObject({
    timelineName: requiredString,
    chapter: chapterSchema,
    chapterName: chapterNameSchema,
    yearLabel: requiredString,
    location: requiredString,
    role: requiredString,
    immediateObjective: requiredString,
    timePressure: requiredString,
    headline: requiredString,
    narrative: requiredString.max(150),
    baselineAnchor: requiredString,
    previousEcho: echoSchema.nullable(),
    choices: choicesSchema,
    memorySummary: requiredString,
    metrics: metricsSchema,
    metricDeltas: metricDeltasSchema,
    causalLedger: z.array(causalLedgerEntrySchema),
    callbackUsed: requiredString.nullable(),
    visualTone: visualToneSchema,
  })
  .superRefine((turn, context) => {
    if (turn.chapterName !== chapterNames[turn.chapter]) {
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

  return {
    ...choice,
    id: choice.id ?? expectedId,
    label,
    intent: intentWasClass ? label : choice.intent,
    deviationClass: choice.deviationClass ?? (intentWasClass ? choice.intent : undefined),
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

const historyTimelineItemSchema = z.strictObject({
  chapter: chapterSchema,
  yearLabel: requiredString,
  playerChoice: requiredString,
  consequence: requiredString,
});

const causalChainSchema = z.strictObject({
  origin: requiredString,
  transformation: requiredString,
  payoff: requiredString,
});

export const alternatePresentSchema = z
  .strictObject({
    worldName: requiredString,
    frontPageHeadline: requiredString,
    historyTimeline: z.array(historyTimelineItemSchema).length(5),
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
          message: "结局时间线必须按第一幕到第五幕排列",
        });
      }
    });
  });

export type TimelineTurn = z.infer<typeof timelineTurnSchema>;
export type AlternatePresent = z.infer<typeof alternatePresentSchema>;
export type DeviationClass = z.infer<typeof deviationClassSchema>;
export type TimelineTurnParseOptions = {
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
  return timelineTurnSchema.parse(
    candidate && options.expectedPreviousEcho
      ? { ...candidate, previousEcho: options.expectedPreviousEcho }
      : parsed,
  );
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
