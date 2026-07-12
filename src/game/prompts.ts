import type { GameScenario } from "./reducer";
import type { DeviationClass, TimelineTurn } from "./schema";
import { CHAPTER_NAMES, getTimelineNode, type DecisionChapter } from "./timelinePlan";

export type ChatMessage = Readonly<{ role: "system" | "user"; content: string }>;
export type PlayedTurn = {
  turn: TimelineTurn;
  selectedChoiceId: "A" | "B" | "C";
  selectedChoiceLabel: string;
  selectedDeviationClass: DeviationClass;
};
type ContinuationChapter = Exclude<DecisionChapter, 1>;
type RepairTarget = "timeline_turn" | "alternate_present";
export type JsonRepairDetails = { expectedChapter?: TimelineTurn["chapter"]; validationErrors?: readonly string[] };

export const TIMELINE_SYSTEM_PROMPT = [
  "你是《I！我改变了历史》的结构化即兴历史推演引擎。",
  "玩家是带着现代经验穿越到真实历史瞬间的中国人。使用第二人称、现在时，让玩家看到真实人物、地点、物件和迫近的时间限制。",
  "所有后果必须由历史事实或玩家真实选择推导；每幕同时呈现收益、代价、受益者与承担者。",
  "三个选项必须是当场能执行的具体动作，恰好覆盖 nudge、reform、rupture，至少一个要能使用穿越者画像中的能力。",
  "只输出一个可被 JSON.parse 解析的 JSON 对象，不要 Markdown、代码围栏、解释或思考过程。",
  "不得输出历史偏离度，客户端会自行计算。",
].join("\n");

const SYSTEM: ChatMessage = { role: "system", content: TIMELINE_SYSTEM_PROMPT };

function scenarioPayload(scenario: GameScenario) {
  return {
    traveler: scenario.profile,
    historyMoment: {
      id: scenario.seed.id,
      date: scenario.seed.dateLabel,
      eventName: scenario.seed.eventName,
      location: scenario.seed.location,
      assignedRole: scenario.seed.role,
      immediateDecision: scenario.seed.decision,
      urgency: scenario.seed.urgency,
      actualHistory: scenario.seed.historicalOutcome,
      verifiedFacts: scenario.seed.baselineFacts,
      visualTone: scenario.seed.visualTone,
    },
  };
}

function turnContract(chapter: TimelineTurn["chapter"]) {
  return {
    requiredFields: ["timelineName", "chapter", "chapterName", "yearLabel", "location", "role", "immediateObjective", "timePressure", "headline", "narrative", "baselineAnchor", "previousEcho", "choices", "memorySummary", "metrics", "metricDeltas", "causalLedger", "callbackUsed", "visualTone"],
    rules: {
      chapter,
      chapterName: CHAPTER_NAMES[chapter],
      narrative: "100 个汉字以内；第二人称现在时；出现至少一个真实人物和一个可见物件",
      headline: "22 个汉字以内",
      location: "28 个汉字以内",
      role: "24 个汉字以内；玩家此刻被历史人物认可的具体身份",
      immediateObjective: "40 个汉字以内；这一幕必须在现场完成的单一目标",
      timePressure: "36 个汉字以内；可感知的分钟、小时、天数或迫近事件",
      baselineAnchor: "54 个汉字以内的真实历史锚点",
      choices: "严格三个对象 A/B/C，分别使用 nudge/reform/rupture；每个 label 36 字以内、intent 40 字以内；含 deviationClass、instantEcho",
      instantEcho: "含 directResult、unexpectedCost、beneficiary、payer",
      previousEcho: chapter === 1 ? "必须为 null" : "完整承接上一选择即时回响",
      metrics: "stability、prosperity、freedom、cost，均为 0-100 数值",
      metricDeltas: "与 metrics 相同四键的数值变化",
      causalLedger: "数组，每项含 fact、causedByChapter、mustAffect",
      callbackUsed: "null 或字符串",
      visualTone: "ancient/exchange/print/revolution/industry/war/space/digital 之一",
    },
    exactShapeExample: {
      timelineName: "示例线名", chapter, chapterName: CHAPTER_NAMES[chapter], yearLabel: "具体年月日", location: "具体地点",
      role: "具体角色", immediateObjective: "当场目标", timePressure: "倒计时",
      headline: "本幕标题", narrative: "第二人称现场叙事", baselineAnchor: "真实历史锚点",
      previousEcho: chapter === 1 ? null : { directResult: "上次直接结果", unexpectedCost: "上次意外代价", beneficiary: "受益者", payer: "承担者" },
      choices: [
        { id: "A", label: "具体行动", intent: "怎样行动", deviationClass: "nudge", instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
        { id: "B", label: "具体行动", intent: "怎样行动", deviationClass: "reform", instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
        { id: "C", label: "具体行动", intent: "怎样行动", deviationClass: "rupture", instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
      ],
      memorySummary: "本幕摘要", metrics: { stability: 50, prosperity: 50, freedom: 50, cost: 50 },
      metricDeltas: { stability: 0, prosperity: 0, freedom: 0, cost: 0 },
      causalLedger: [{ fact: "因果事实", causedByChapter: 0, mustAffect: "后续对象" }], callbackUsed: null, visualTone: "war",
    },
  };
}

function selectedHistory(playedTurns: readonly PlayedTurn[]) {
  return playedTurns.map(({ turn, selectedChoiceId, selectedChoiceLabel, selectedDeviationClass }) => ({
    chapter: turn.chapter,
    yearLabel: turn.yearLabel,
    selectedChoiceId,
    selectedChoiceLabel,
    selectedDeviationClass,
    instantEcho: turn.choices.find((choice) => choice.id === selectedChoiceId)?.instantEcho,
    memorySummary: turn.memorySummary,
    causalLedger: turn.causalLedger,
    metrics: turn.metrics,
  }));
}

function messages(payload: unknown): ChatMessage[] {
  return [SYSTEM, { role: "user", content: JSON.stringify(payload) }];
}

export function buildOpeningMessages(scenario: GameScenario): ChatMessage[] {
  return messages({ task: "生成第一节点。玩家刚穿越落地，必须立即理解自己是谁、身处哪个著名历史瞬间、这一分钟要阻止或促成什么。", ...scenarioPayload(scenario), authoritativeTimelineNode: getTimelineNode(1, scenario.seed.year), outputContract: turnContract(1) });
}

export function buildContinuationMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[], chapter: ContinuationChapter): ChatMessage[] {
  return messages({ task: `生成第 ${chapter} 节点，只承接已发生的玩家选择，不得替换玩家行为。yearLabel 必须匹配权威目标年份和时间尺度。`, ...scenarioPayload(scenario), authoritativeTimelineNode: getTimelineNode(chapter, scenario.seed.year), playedHistory: selectedHistory(playedTurns), outputContract: turnContract(chapter) });
}

export function buildEndingMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): ChatMessage[] {
  return messages({
    task: "根据十一项真实选择生成第十二节点：平行世界 2026 年头版总结。不得加入此前没有因果来源的决定性发明、战争或人物。",
    ...scenarioPayload(scenario), playedHistory: selectedHistory(playedTurns),
    outputContract: {
      requiredFields: ["worldName", "frontPageHeadline", "historyTimeline", "causalChains", "ordinaryLife2026", "greatestGain", "hiddenPrice", "strangestDetail", "biggestBeneficiary", "biggestLoser", "rewriteLevel", "plausibilityScore", "plausibilityReason", "shareLine"],
      historyTimeline: "恰好十一项，每项含 chapter、yearLabel、playerChoice、consequence",
      causalChains: "恰好三项，每项含 origin、transformation、payoff",
      ordinaryLife2026: "恰好三个具体生活细节",
      plausibilityScore: "0-100 数值",
    },
  });
}

export function getPlayedTurnChoiceText(turn: PlayedTurn): string { return turn.selectedChoiceLabel; }

export function buildJsonRepairMessages(raw: string, target: RepairTarget, details: JsonRepairDetails = {}): ChatMessage[] {
  return messages({ task: "修复下面的模型输出，只修正 JSON 结构与字段类型，不改变事实和玩家选择。", target, details, invalidOutput: raw });
}

export function buildContextualJsonRepairMessages(original: readonly ChatMessage[], raw: string, target: RepairTarget, details: JsonRepairDetails = {}): ChatMessage[] {
  return [...original, { role: "user", content: JSON.stringify({ task: "上一输出校验失败。请按原 outputContract 修复并只返回 JSON。", target, details, invalidOutput: raw }) }];
}
