import { z } from "zod";

const requiredString = z.string().trim().min(1);
const chapterSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
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
  causedByChapter: chapterSchema,
  mustAffect: requiredString,
});

const chapterNames = {
  1: "裂缝",
  2: "余震",
  3: "新秩序",
  4: "世界线",
  5: "此刻",
} as const;

export const timelineTurnSchema = z
  .strictObject({
    timelineName: requiredString,
    chapter: chapterSchema,
    chapterName: chapterNameSchema,
    yearLabel: requiredString,
    location: requiredString,
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

export function parseTimelineTurn(raw: string): TimelineTurn {
  return timelineTurnSchema.parse(parseJsonObject(raw));
}

export function parseAlternatePresent(raw: string): AlternatePresent {
  return alternatePresentSchema.parse(parseJsonObject(raw));
}
