import { z } from "zod";
import { CHAPTER_NAMES, JUMP_LABELS, type DecisionChapter, type LifeStage } from "./timelinePlan";
import { CUSTOM_ACTION_MAX_LENGTH } from "./limits";
import { isPowerId, type PowerId } from "./powers";
import {
  containsInternalPlayerCopy,
  localizeInternalPlayerCopy,
} from "./playerFacingText";

const requiredString = z.string().trim().min(1);
const playerFacingString = requiredString.refine(
  (value) => !containsInternalPlayerCopy(value),
  "玩家可见文案必须使用自然中文，不能泄漏内部字段名或超能力 ID",
);
const boundedPlayerFacingString = (max: number) => playerFacingString.max(max);
const completeReportSentence = (max: number, label: string, min = 1) => z.string().trim().min(min).max(max).refine(
  (value) => !containsInternalPlayerCopy(value),
  `${label}不能泄漏内部字段名或超能力 ID`,
).refine(
  (value) => {
    if (!/[。！？!?](?:[”"』」）)])?$/.test(value)) return false;
    const withoutClosing = value.replace(/[”"』」）)]*$/, "").trim();
    const withoutTerminal = withoutClosing.replace(/[。！？!?]+$/, "").trim();
    return isCompleteReportSentenceBody(withoutTerminal);
  },
  `${label}必须以完整句结束，不能停在半句话中`,
);
const chapterSchema = z.number().int().min(1).max(4).transform((value) => value as DecisionChapter);
const causalChapterSchema = z.number().int().min(0).max(4);
const chapterNameSchema = z.enum([
  "历史现场", "三日余波", "人生转折", "生命终章",
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
  directResult: playerFacingString,
  unexpectedCost: playerFacingString,
  beneficiary: playerFacingString,
  payer: playerFacingString,
});

const GENERIC_ACTION_PATTERN = /保留现有安排|修正最紧迫|重写规则|废除旧约束|新的联盟|加强管理|稳步推进|优化安排|灵活处理|综合施策|视情况而定/;
const INCOMPLETE_CHOICE_END_PATTERN = /(?:的|同时|随后|转而|改为|试图|准备|意图|而非|而非中|试图平衡|是应急|出资补|[，,](?:向|对|把|将|让|以|从|与|和|及|但|且))$/;
const DEPENDENT_SENTENCE_START_PATTERN = /^(?:因为|由于|为了|为使|随着|如果|若(?:是|非)?|只要|除非|一旦|当(?!场|即|众|面)|待(?!命)|等到|尽管|虽然|即使|纵然)/;
const DEPENDENT_CLAUSE_START_PATTERN = /^(?:如果|若(?:是|非)?|只要|除非|一旦|当|待|等到|由于|因为|为了|为使|尽管|虽然|即使|纵然|随着|通过|凭借|依靠)/;
const LEADING_CONNECTOR_PATTERN = /^(?:并|但|而|且|以及|并且|同时|随后|然后|于是|因此|所以|从而|则|便|才|却)/;
const ALTERNATE_TIMELINE_IN_BASELINE_PATTERN = /当前(?:时间)?线|本线|架空线|改变后|玩家(?:的)?选择|你(?:的)?决定/;
const PRE_MODERN_LOCATION_PATTERN = /议事厅|会议室|办公室|指挥中心|新闻中心|发布厅|报告厅|展览厅|作战室|控制室|调度室/;
const DANGLING_GRAMMAR_WORDS = new Set([
  "把", "将", "向", "并", "因为", "由于", "为了", "为使", "以及", "并且", "随后", "然后", "于是", "因此", "所以", "从而",
]);
const MILITARY_RANK_PREFIXES = new Set(["上", "中", "少", "大", "名", "老", "武", "主", "副", "猛", "守", "宿", "儒", "飞"]);
const COMPOUND_BING_PREFIXES = new Set(["火", "合", "吞", "兼", "归"]);
const PREDICATE_EVIDENCE_PATTERN = /(?:公开|推广|推行|施行|实施|执行|改为|改成|改写|改造|改革|改变|变成|变为|成为|纳入|列入|写入|编入|交给|交由|移交|转交|送往|发给|分给|分配|封存|保存|保留|烧毁|销毁|焚毁|撤销|撤回|撤离|释放|处死|杀死|迁往|转为|置于|投入|用于|用作|作为|公布|颁布|重建|拆除|开放|关闭|控制|接管|交出|归还|归入|落实|固定|制度化|合法化|国有化|私有化|完成|停止|恢复|扩大|缩小|记录|抄写|推翻|拒绝|扣下|封锁|放弃|任命|罢免|调往|调离|调入|调出|征调|征收|征用|交付|带到|带入|带回|留在|留给|赐给|还给|拆成|划为|划入|划出|组织|改组|重组|建成|修成|迁入|迁出|传给|传入|传往|变作|化为|送入|交到|写成|定为|立为|设为|升为|降为|撤掉|打开|关上|铭记|统领|上涨|下跌|崩溃|稳定|改善|恶化|增长|减少|中断|延续|生效|失效|结束|爆发|形成|消失|出现|陷入|逆转|保住|失去|获得|拥有|维持|继续|[杀烧抓放送交给迁改写记封拆建修开关留撤废毁锁夺还罚赦编分卖买征用])/;

type WordSegmenter = {
  segment(value: string): Iterable<{ isWordLike?: boolean; segment: string }>;
};

type WordSegmenterConstructor = new (
  locale: string,
  options: { granularity: "word" },
) => WordSegmenter;

const WordSegmenterClass = Reflect.get(Intl, ["Seg", "menter"].join("")) as
  | WordSegmenterConstructor
  | undefined;
const WORD_SEGMENTER = typeof WordSegmenterClass === "function"
  ? new WordSegmenterClass("zh-CN", { granularity: "word" })
  : null;

function segmentWords(value: string): string[] {
  if (WORD_SEGMENTER) {
    return [...WORD_SEGMENTER.segment(value)]
      .filter((part) => part.isWordLike)
      .map((part) => part.segment);
  }
  return value.match(/[A-Za-z0-9]+|[\u3400-\u9fff]/g) ?? [];
}

function isLexicalizedMilitaryRank(words: readonly string[], index: number): boolean {
  return words[index] === "将" && MILITARY_RANK_PREFIXES.has(words[index - 1] ?? "");
}

function endsWithDanglingGrammar(value: string): boolean {
  const words = segmentWords(value);
  const last = words[words.length - 1] ?? "";
  if (last === "将" && isLexicalizedMilitaryRank(words, words.length - 1)) return false;
  if (last === "并" && COMPOUND_BING_PREFIXES.has(words[words.length - 2] ?? "")) return false;
  if (WORD_SEGMENTER) return DANGLING_GRAMMAR_WORDS.has(last);

  const dangling = [...DANGLING_GRAMMAR_WORDS]
    .sort((left, right) => right.length - left.length)
    .find((word) => value.endsWith(word));
  if (dangling === "把" && value.endsWith("火把")) return false;
  if (dangling === "向" && (value.endsWith("走向") || value.endsWith("志向"))) return false;
  return Boolean(dangling);
}

function hasDanglingDisposalStructure(value: string): boolean {
  const words = segmentWords(value);
  let markerIndex = -1;
  for (let index = 0; index < words.length; index += 1) {
    if (words[index] === "把") markerIndex = index;
    if (words[index] === "将" && !isLexicalizedMilitaryRank(words, index)) markerIndex = index;
  }
  if (markerIndex < 0) return false;
  const remainder = words.slice(markerIndex + 1);
  if (remainder.length === 0) return true;

  const marker = words[markerIndex];
  const predicateIndex = remainder.findIndex((word) => PREDICATE_EVIDENCE_PATTERN.test(word));
  if (!WORD_SEGMENTER) {
    return !PREDICATE_EVIDENCE_PATTERN.test(remainder.join(""));
  }
  if (marker === "把") {
    // A short 把 phrase needs an object followed by a predicate. Longer phrases
    // can contain open-ended historical verbs that a local lexicon cannot know.
    return remainder.length < 3 && predicateIndex < 1;
  }

  // 将 can be either a disposal marker or the future auxiliary "will". Reject
  // only the high-confidence bare nominal tail instead of guessing its grammar.
  return remainder.length === 1 && predicateIndex < 0;
}

function hasPredicateEvidence(value: string): boolean {
  return PREDICATE_EVIDENCE_PATTERN.test(value);
}

function finalClause(value: string): string {
  const clauses = value.split(/[，,；;：:]/).map((clause) => clause.trim()).filter(Boolean);
  return clauses[clauses.length - 1] ?? value;
}

function hasIndependentMainClause(value: string): boolean {
  const clauses = value.split(/[，,；;：:]/).map((clause) => clause.trim()).filter(Boolean);
  if (clauses.length < 2) return false;
  const mainClause = clauses[clauses.length - 1] ?? "";
  const mainWords = segmentWords(mainClause);
  return [...mainClause].length >= 4
    && !DEPENDENT_SENTENCE_START_PATTERN.test(mainClause)
    && !endsWithDanglingGrammar(mainClause)
    && !hasDanglingDisposalStructure(mainClause)
    && (hasPredicateEvidence(mainClause) || (WORD_SEGMENTER !== null && mainWords.length >= 5));
}

function isCompleteSentenceBody(value: string): boolean {
  if (DEPENDENT_SENTENCE_START_PATTERN.test(value) && !hasIndependentMainClause(value)) return false;
  const clause = finalClause(value);
  return !endsWithDanglingGrammar(clause) && !hasDanglingDisposalStructure(clause);
}

function isCompleteReportSentenceBody(value: string): boolean {
  if (!value || DEPENDENT_SENTENCE_START_PATTERN.test(value)) return false;
  return !endsWithDanglingGrammar(value) && !hasDanglingDisposalStructure(value);
}

function finalSentenceBody(value: string): string {
  const withoutClosing = value.replace(/[”"』」）)]*$/, "").trim();
  const withoutTerminal = withoutClosing.replace(/[。！？!?]+$/, "").trim();
  const sentences = withoutTerminal
    .split(/[。！？!?]/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return sentences[sentences.length - 1] ?? withoutTerminal;
}

function isCompleteActionLabel(value: string): boolean {
  if (INCOMPLETE_CHOICE_END_PATTERN.test(value)) return false;
  if (DEPENDENT_SENTENCE_START_PATTERN.test(value) && !hasIndependentMainClause(value)) return false;
  const clause = finalClause(value);
  return !endsWithDanglingGrammar(clause) && !hasDanglingDisposalStructure(clause);
}
const preModernLocationSchema = z.object({
  location: z.string().refine(
    (location) => !PRE_MODERN_LOCATION_PATTERN.test(location),
    "地点称谓与时代不符，请改用当时真实存在的空间称谓",
  ),
});

const actionSpecSchema = z.object({
  actor: playerFacingString,
  action: playerFacingString,
  target: playerFacingString,
  deadline: playerFacingString,
});

const customActionResolutionObjectSchema = z.object({
  declaredOutcome: z.string().trim().min(2).max(CUSTOM_ACTION_MAX_LENGTH),
  canonStatus: z.literal("玩家钦定"),
  causalMechanism: requiredString,
  deviationClass: deviationClassSchema,
  instantEcho: echoSchema,
});

export const customActionResolutionSchema = z.preprocess(
  normalizeCustomActionResolutionCandidate,
  customActionResolutionObjectSchema,
);

const choiceLabelSchema = playerFacingString.refine((label) => {
  const withoutPunctuation = label.replace(/[。！？!?]+$/g, "").trim();
  return isCompleteActionLabel(withoutPunctuation);
}, "行动必须是完整句，不能停在连接词、意图或缺少对象的动词上");

const choiceFields = {
  label: choiceLabelSchema,
  displayLabel: boundedPlayerFacingString(16),
  intent: playerFacingString,
  deviationClass: deviationClassSchema,
  powerId: z.custom<PowerId>(isPowerId, "未知超能力").optional(),
  instantEcho: echoSchema,
  usesModernKnowledge: z.boolean(),
  actionSpec: actionSpecSchema,
} as const;

const choicesSchema = z.tuple([
  z.object({ id: z.literal("A"), ...choiceFields }),
  z.object({ id: z.literal("B"), ...choiceFields }),
  z.object({ id: z.literal("C"), ...choiceFields }),
]);

const PREMATURE_PROTAGONIST_REMOVAL_PATTERN = /(?:你|玩家|主角)(?!的).{0,8}(?:被|遭).{0,8}(?:处死|斩首|杀死|击毙|杀害)|(?:你|玩家|主角)(?!的)(?:本人)?(?:当场|随后|最终|立即|会|将)?(?:死亡|身亡|丧命|殒命|自尽|失去意识|终身监禁|终身囚禁)|(?:处死|斩首|杀死|击毙)(?:了)?(?:你|玩家|主角)(?!的)/;

const causalLedgerEntrySchema = z.object({
  fact: playerFacingString,
  causedByChapter: causalChapterSchema,
  mustAffect: playerFacingString,
});

const narrativeTextSchema = playerFacingString;
const factualScanString = playerFacingString.refine(
  (value) => !DEPENDENT_SENTENCE_START_PATTERN.test(value),
  "字段必须直接陈述已经发生或明确迫近的事实，不能以条件从句开头",
);

const richNarrativeSchema = narrativeTextSchema
  .refine((narrative) => {
    const sentenceCount = narrative.match(/[。！？!?]/g)?.length ?? 0;
    return sentenceCount >= 2;
  }, {
    message: "现场前情需要至少两句完整叙事，并避免堆叠碎句",
  })
  .refine((narrative) => /[。！？!?](?:[”"』」）)])?$/.test(narrative), {
    message: "现场前情必须以完整句结束",
  })
  .refine((narrative) => isCompleteSentenceBody(finalSentenceBody(narrative)), {
    message: "现场前情最后一句必须语义完整",
  });

const timelineTurnFields = {
    chapter: chapterSchema,
    chapterName: chapterNameSchema,
    protagonistName: boundedPlayerFacingString(16),
    protagonistAge: z.number().int().min(14).max(90),
    lifeStage: lifeStageSchema,
    yearLabel: playerFacingString,
    location: playerFacingString,
    role: playerFacingString,
    causalBridge: factualScanString,
    worldStateChange: playerFacingString,
    divergenceProof: playerFacingString,
    immediateObjective: playerFacingString,
    timePressure: factualScanString,
    headline: playerFacingString,
    baselineAnchor: playerFacingString,
    historicalAnchors: z.array(playerFacingString).min(2).max(4),
    previousEcho: echoSchema.nullable(),
    choices: choicesSchema,
    rollChoices: choicesSchema,
    memorySummary: playerFacingString,
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
  narrative: narrativeTextSchema,
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

    (["choices", "rollChoices"] as const).forEach((field) => {
      const classes = new Set(turn[field].map((choice) => choice.deviationClass));
      if (classes.size !== 3) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: "每组三张牌必须恰好覆盖循史、破局和天外三种强度",
        });
      }
    });

    if (ALTERNATE_TIMELINE_IN_BASELINE_PATTERN.test(turn.divergenceProof)) {
      context.addIssue({
        code: "custom",
        path: ["divergenceProof"],
        message: "真实历史对照不能混入当前架空时间线",
      });
    }

    (["choices", "rollChoices"] as const).forEach((field) => {
      turn[field].forEach((choice, index) => {
        if (GENERIC_ACTION_PATTERN.test(`${choice.label} ${choice.intent} ${choice.actionSpec.action}`)) {
          context.addIssue({
            code: "custom",
            path: [field, index, "label"],
            message: "行动过于抽象，必须写明谁在期限内对什么对象做什么",
          });
        }
        const specificity = `${choice.label}${choice.actionSpec.actor}${choice.actionSpec.action}${choice.actionSpec.target}${choice.actionSpec.deadline}`;
        if (specificity.length < 18) {
          context.addIssue({
            code: "custom",
            path: [field, index, "actionSpec"],
            message: "行动缺少足够具体的执行信息",
          });
        }
        const playerConsequence = [
          choice.instantEcho.directResult,
          choice.instantEcho.unexpectedCost,
          choice.instantEcho.payer,
        ].join(" ");
        if (PREMATURE_PROTAGONIST_REMOVAL_PATTERN.test(playerConsequence)) {
          context.addIssue({
            code: "custom",
            path: [field, index, "instantEcho", "unexpectedCost"],
            message: "四幕主角不能在卡牌即时结果中死亡或永久退场",
          });
        }
      });
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

type CompactChoiceTuple = [
  displayLabel: unknown,
  label: unknown,
  actionSpecOrTarget: unknown,
  instantEchoOrDeadline: unknown,
  compactInstantEcho?: unknown,
];

function expandCompactChoice(
  value: unknown,
  index: number,
  expectedPowerId?: PowerId,
  inheritedDeadline?: unknown,
): unknown {
  const tuple = Array.isArray(value) ? value as CompactChoiceTuple : null;
  if (!tuple || tuple.length < 4) {
    const record = asRecord(value);
    if (!record) return value;
    return index === 2 && expectedPowerId
      ? { ...record, powerId: expectedPowerId }
      : record;
  }

  const isLowLatencyShape = !Array.isArray(tuple[2]);
  const action = Array.isArray(tuple[2]) ? tuple[2] : [];
  const echoSource = isLowLatencyShape
    ? (Array.isArray(tuple[3]) ? tuple[3] : tuple[4])
    : tuple[3];
  const echo = Array.isArray(echoSource) ? echoSource : [];
  const label = tuple[1];
  return {
    displayLabel: tuple[0],
    label,
    intent: label,
    usesModernKnowledge: false,
    actionSpec: {
      actor: isLowLatencyShape ? "你" : action[0],
      action: isLowLatencyShape ? label : action[1],
      target: isLowLatencyShape ? tuple[2] : action[2],
      deadline: isLowLatencyShape
        ? (Array.isArray(tuple[3]) ? inheritedDeadline : tuple[3])
        : action[3],
    },
    instantEcho: {
      directResult: echo[0],
      unexpectedCost: echo[1],
      beneficiary: echo[2],
      payer: echo[3],
    },
    ...(index === 2 && expectedPowerId ? { powerId: expectedPowerId } : {}),
  };
}

function expandCompactChoiceSet(
  value: unknown,
  expectedPowerId?: PowerId,
  inheritedDeadline?: unknown,
): unknown {
  return Array.isArray(value)
    ? value.map((choice, index) => expandCompactChoice(
        choice,
        index,
        expectedPowerId,
        inheritedDeadline,
      ))
    : value;
}

function expandCompactLedger(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((entry) => {
    if (!Array.isArray(entry)) return entry;
    return {
      fact: entry[0],
      causedByChapter: entry[1],
      mustAffect: entry[2],
    };
  });
}

function expandCompactTimelineTurn(
  value: unknown,
  expectedPowerIds?: readonly [PowerId, PowerId],
): unknown {
  const record = asRecord(value);
  if (!record) return value;
  const scene = Array.isArray(record.s) ? record.s : null;
  const compactChoices = record.c;
  const compactRollChoices = record.r;
  const compactLedger = record.g;
  const lowLatencyScene = scene?.length === 9;
  return {
    ...record,
    ...(scene ? {
      headline: scene[0],
      narrative: scene[1],
      location: scene[2],
      role: scene[3],
      timePressure: scene[4],
      causalBridge: scene[5],
      worldStateChange: scene[6],
      divergenceProof: scene[7],
      historicalAnchors: lowLatencyScene ? [scene[2], scene[3]] : scene[8],
      visualTone: lowLatencyScene ? scene[8] : scene[9],
      protagonistName: scene[10],
    } : {}),
    ...(compactChoices !== undefined ? {
      choices: expandCompactChoiceSet(compactChoices, expectedPowerIds?.[0], scene?.[4]),
    } : {}),
    ...(compactRollChoices !== undefined ? {
      rollChoices: expandCompactChoiceSet(compactRollChoices, expectedPowerIds?.[1], scene?.[4]),
    } : {}),
    ...(compactLedger !== undefined ? {
      causalLedger: expandCompactLedger(compactLedger),
    } : (scene || compactChoices !== undefined || compactRollChoices !== undefined)
      ? { causalLedger: [] }
      : {}),
  };
}

function joinStringArray(value: unknown): unknown {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value.join("；")
    : value;
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

function coerceDisplayString(value: unknown): unknown {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const record = asRecord(value);
  return record?.label ?? record?.value ?? value;
}

function normalizeBiographyReportCandidate(value: unknown): unknown {
  return value;
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

function expandCompactBiographyCandidate(value: unknown): unknown {
  const report = asRecord(value);
  if (!report || report.b === undefined) return value;
  const death = Array.isArray(report.d) ? report.d : [];
  const timeline = Array.isArray(report.t)
    ? report.t.map((item) => {
        const tuple = Array.isArray(item) ? item : [item];
        return { consequence: tuple[0] };
      })
    : report.t;
  return {
    ...report,
    vernacularBiography: report.vernacularBiography ?? report.b,
    classicalBiography: report.classicalBiography ?? report.c,
    lifespanSummary: report.lifespanSummary ?? report.s,
    deathScene: report.deathScene ?? {
      place: death[0],
      finalMoment: death[1],
      lastingLegacy: death[2],
    },
    historyTimeline: report.historyTimeline ?? timeline,
  };
}

function expandCompactWorldReportCandidate(value: unknown): unknown {
  const report = asRecord(value);
  if (!report || report.n === undefined) return value;
  const chronicles = Array.isArray(report.p)
    ? report.p.map((item) => {
        const tuple = Array.isArray(item) ? item : [];
        return {
          period: tuple[0],
          title: tuple[1],
          narrative: tuple[2],
          inheritedChange: tuple[3],
        };
      })
    : report.p;
  const chains = Array.isArray(report.c)
    ? report.c.map((item) => {
        const tuple = Array.isArray(item) ? item : [];
        return {
          origin: tuple[0],
          transformation: tuple[1],
          payoff: tuple[2],
        };
      })
    : report.c;
  return {
    ...report,
    worldName: report.worldName ?? report.n,
    frontPageHeadline: report.frontPageHeadline ?? report.h,
    posthumousChronicle: report.posthumousChronicle ?? chronicles,
    causalChains: report.causalChains ?? chains,
    ordinaryLife2026: report.ordinaryLife2026 ?? report.o,
    closingPassage: report.closingPassage ?? report.e,
    greatestGain: report.greatestGain ?? report.g,
    hiddenPrice: report.hiddenPrice ?? report.x,
    strangestDetail: report.strangestDetail ?? report.z,
    biggestBeneficiary: report.biggestBeneficiary ?? report.i,
    biggestLoser: report.biggestLoser ?? report.l,
    rewriteLevel: report.rewriteLevel ?? report.r,
    plausibilityScore: report.plausibilityScore ?? report.q,
    plausibilityReason: report.plausibilityReason ?? report.u,
    shareLine: report.shareLine ?? report.a,
  };
}

function normalizeAlternatePresentCandidate(value: unknown): unknown {
  return normalizeWorldReportCandidate(normalizeBiographyReportCandidate(value));
}

function normalizeDivergenceProof(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return value.replace(/^\s*真实历史中\s*[，,:：]?\s*/, "");
}

function normalizeCustomActionResolutionCandidate(value: unknown): unknown {
  return value;
}

function displayLabelForChoice(label: unknown, actionSpec: unknown): unknown {
  if (typeof label !== "string") return label;
  const canonical = label.trim();
  if ([...canonical].length <= 16) return canonical;

  const spec = asRecord(actionSpec);
  const action = typeof spec?.action === "string" ? spec.action.trim() : "";
  const target = typeof spec?.target === "string" ? spec.target.trim() : "";
  const structured = action && target ? `${action}：${target}` : "";
  if (
    [...structured].length >= 6
    && [...structured].length <= 16
    && !INCOMPLETE_CHOICE_END_PATTERN.test(structured)
  ) return structured;

  const clause = compactAiAuthoredClause(canonical, 16);
  if (
    typeof clause === "string"
    && [...clause].length <= 16
    && !DEPENDENT_CLAUSE_START_PATTERN.test(clause)
    && !LEADING_CONNECTOR_PATTERN.test(clause)
    && !INCOMPLETE_CHOICE_END_PATTERN.test(clause)
  ) return clause;

  const actionOnly = typeof spec?.action === "string" ? spec.action.trim() : "";
  if ([...actionOnly].length >= 4 && [...actionOnly].length <= 16) return actionOnly;
  return "执行关键行动";
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
  const providedDisplayLabel = typeof choice.displayLabel === "string"
    ? choice.displayLabel.trim()
    : "";
  const displayLabel = providedDisplayLabel.length >= 2
    && [...providedDisplayLabel].length <= 16
    && !INCOMPLETE_CHOICE_END_PATTERN.test(providedDisplayLabel)
      ? providedDisplayLabel
      : displayLabelForChoice(label, choice.actionSpec);

  return {
    ...choice,
    id: expectedId,
    // This exact text becomes player canon after selection, so an oversized
    // label is preserved while the compact derivative stays display-only.
    label: typeof label === "string" ? label.trim() : label,
    displayLabel,
    intent: typeof normalizedIntent === "string" ? normalizedIntent.trim() : normalizedIntent,
    deviationClass: DEVIATION_CLASSES[index],
    usesModernKnowledge: choice.usesModernKnowledge,
    actionSpec: choice.actionSpec,
    instantEcho: choice.instantEcho,
  };
}

function normalizeChoiceSet(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((choice, index) => normalizeChoice(choice, index));
}

function localizeStoredPlayerCopy(value: unknown, key = ""): unknown {
  if (typeof value === "string") {
    return /(?:^|selected)powerId$/i.test(key)
      ? value
      : localizeInternalPlayerCopy(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => localizeStoredPlayerCopy(item, key));
  }
  const record = asRecord(value);
  if (!record) return value;
  return Object.fromEntries(
    Object.entries(record).map(([childKey, childValue]) => [
      childKey,
      localizeStoredPlayerCopy(childValue, childKey),
    ]),
  );
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

  const normalizedChoices = normalizeChoiceSet(turn.choices);
  // Old local saves and test fixtures predate the one-free-Roll contract.
  // They remain readable, while live model responses can opt into the strict
  // requirement through TimelineTurnParseOptions.requireRollChoices.
  const normalizedRollChoices = normalizeChoiceSet(turn.rollChoices ?? turn.choices);
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
    role: turn.role,
    immediateObjective: turn.immediateObjective ?? derivedObjective,
    timePressure: turn.timePressure ?? derivedDeadline,
    headline: turn.headline,
    narrative: turn.narrative,
    causalBridge: turn.causalBridge,
    worldStateChange: turn.worldStateChange,
    divergenceProof: normalizeDivergenceProof(turn.divergenceProof),
    baselineAnchor: joinStringArray(turn.baselineAnchor ?? derivedBaseline),
    historicalAnchors: turn.historicalAnchors,
    previousEcho:
      turn.previousEcho == null && Number(turn.chapter ?? 1) === 1
        ? null
        : turn.previousEcho,
    choices: Array.isArray(normalizedChoices)
      ? normalizedChoices.map((choice, index) => ({ ...asRecord(choice), usesModernKnowledge: index === authoritativeModernIndex }))
      : normalizedChoices,
    rollChoices: Array.isArray(normalizedRollChoices)
      ? normalizedRollChoices.map((choice) => ({ ...asRecord(choice) }))
      : normalizedRollChoices,
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
  (value) => normalizeTimelineTurnCandidate(localizeStoredPlayerCopy(value)),
  compatibleStoredTimelineTurnSchema,
);

export const storedChoiceSetSchema = z.preprocess(
  (value) => normalizeChoiceSet(localizeStoredPlayerCopy(value)),
  choicesSchema,
);

const historyTimelineItemSchema = z.object({
  chapter: chapterSchema,
  yearLabel: playerFacingString,
  playerChoice: playerFacingString,
  consequence: completeReportSentence(120, "决定后果"),
});

const causalChainSchema = z.object({
  origin: playerFacingString,
  transformation: playerFacingString,
  payoff: playerFacingString,
});

const biographyFields = {
    vernacularBiography: completeReportSentence(960, "白话列传"),
    classicalBiography: completeReportSentence(720, "文言列传"),
    protagonistName: boundedPlayerFacingString(16),
    lifespanSummary: completeReportSentence(240, "一生总述"),
    deathScene: z.object({
      yearLabel: playerFacingString,
      age: z.number().int().min(14).max(100),
      place: boundedPlayerFacingString(32),
      finalMoment: completeReportSentence(180, "临终场景"),
      lastingLegacy: completeReportSentence(180, "身后遗产"),
    }),
    historyTimeline: z.array(historyTimelineItemSchema).length(4),
} as const;

const posthumousChronicleItemSchema = z.object({
  period: boundedPlayerFacingString(18),
  title: boundedPlayerFacingString(22),
  narrative: completeReportSentence(320, "身后时代叙事"),
  inheritedChange: completeReportSentence(240, "时代遗产结论"),
});

const worldReportFields = {
    worldName: playerFacingString,
    frontPageHeadline: playerFacingString,
    causalChains: z.tuple([causalChainSchema, causalChainSchema, causalChainSchema]),
    ordinaryLife2026: z.tuple([
      completeReportSentence(18, "2026生活细节", 12),
      completeReportSentence(18, "2026生活细节", 12),
      completeReportSentence(18, "2026生活细节", 12),
    ]),
    posthumousChronicle: z.tuple([
      posthumousChronicleItemSchema,
      posthumousChronicleItemSchema,
      posthumousChronicleItemSchema,
      posthumousChronicleItemSchema,
    ]),
    closingPassage: completeReportSentence(320, "小说尾声"),
    greatestGain: playerFacingString,
    hiddenPrice: playerFacingString,
    strangestDetail: playerFacingString,
    biggestBeneficiary: playerFacingString,
    biggestLoser: playerFacingString,
    rewriteLevel: playerFacingString,
    plausibilityScore: z.number().finite().min(0).max(100),
    plausibilityReason: completeReportSentence(180, "可信度说明"),
    shareLine: completeReportSentence(120, "分享语"),
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
          message: "结局时间线必须按第一节点到第四节点排列",
        });
      }
    });
  });

const compatibleStoredAlternatePresentObjectSchema = z
  .object({
    ...biographyFields,
    ...worldReportFields,
    vernacularBiography: playerFacingString.max(960),
    classicalBiography: playerFacingString.max(720),
    lifespanSummary: playerFacingString.max(240),
    deathScene: z.object({
      yearLabel: playerFacingString,
      age: z.number().int().min(14).max(100),
      place: boundedPlayerFacingString(32),
      finalMoment: playerFacingString.max(180),
      lastingLegacy: playerFacingString.max(180),
    }),
    historyTimeline: z.array(z.object({
      chapter: chapterSchema,
      yearLabel: playerFacingString,
      playerChoice: playerFacingString,
      consequence: playerFacingString,
    })).length(4),
    ordinaryLife2026: z.tuple([
      boundedPlayerFacingString(72),
      boundedPlayerFacingString(72),
      boundedPlayerFacingString(72),
    ]),
    posthumousChronicle: z.tuple([
      z.object({ period: boundedPlayerFacingString(18), title: boundedPlayerFacingString(22), narrative: boundedPlayerFacingString(128), inheritedChange: boundedPlayerFacingString(96) }),
      z.object({ period: boundedPlayerFacingString(18), title: boundedPlayerFacingString(22), narrative: boundedPlayerFacingString(128), inheritedChange: boundedPlayerFacingString(96) }),
      z.object({ period: boundedPlayerFacingString(18), title: boundedPlayerFacingString(22), narrative: boundedPlayerFacingString(128), inheritedChange: boundedPlayerFacingString(96) }),
      z.object({ period: boundedPlayerFacingString(18), title: boundedPlayerFacingString(22), narrative: boundedPlayerFacingString(128), inheritedChange: boundedPlayerFacingString(96) }),
    ]),
    closingPassage: playerFacingString.max(320),
    plausibilityReason: playerFacingString,
    shareLine: playerFacingString,
  })
  .superRefine((ending, context) => {
    ending.historyTimeline.forEach((item, index) => {
      if (item.chapter !== index + 1) {
        context.addIssue({
          code: "custom",
          path: ["historyTimeline", index, "chapter"],
          message: "结局时间线必须按第一节点到第四节点排列",
        });
      }
    });
  });

export const alternatePresentSchema = z.preprocess(
  normalizeAlternatePresentCandidate,
  alternatePresentObjectSchema,
);
export const storedAlternatePresentSchema = z.preprocess(
  (value) => normalizeAlternatePresentCandidate(localizeStoredPlayerCopy(value)),
  compatibleStoredAlternatePresentObjectSchema,
);

export type TimelineTurn = z.infer<typeof timelineTurnSchema>;
export type ChoiceSet = z.infer<typeof choicesSchema>;
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
  expectedPowerIds?: readonly [PowerId, PowerId];
  requireRollChoices?: boolean;
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
  const candidate = asRecord(expandCompactTimelineTurn(parsed, options.expectedPowerIds));
  if (options.requireRollChoices && !Array.isArray(candidate?.rollChoices)) {
    throw new Error("模型响应缺少预生成的第二组三张卡牌 rollChoices");
  }
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

export function parseChoiceSet(
  raw: string,
  expectedPowerId?: PowerId,
  expectedDeadline?: string,
): ChoiceSet {
  const parsed = parseJsonObject(raw);
  const candidate = asRecord(parsed);
  const compactCandidate = candidate?.c ?? candidate?.choices ?? parsed;
  const choices = choicesSchema.parse(normalizeChoiceSet(
    expandCompactChoiceSet(compactCandidate, expectedPowerId, expectedDeadline),
  ));
  if (new Set(choices.map((choice) => choice.deviationClass)).size !== 3) {
    throw new Error("现场发出的三张牌必须恰好覆盖循史、破局和天外三种强度");
  }
  return choices;
}

export function parseBiographyReport(
  raw: string,
  options: AlternatePresentParseOptions = {},
): BiographyReport {
  const parsed = expandCompactBiographyCandidate(parseJsonObject(raw));
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
          ...(record ?? { consequence: item }),
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
  return worldReportSchema.parse(
    normalizeWorldReportCandidate(expandCompactWorldReportCandidate(parseJsonObject(raw))),
  );
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
