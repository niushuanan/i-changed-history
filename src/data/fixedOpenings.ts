import { parseTimelineTurn, type TimelineTurn } from "../game/schema";
import { getTimelineNode } from "../game/timelinePlan";
import type { HistorySeed } from "../game/types";
import { formatHistoricalYear } from "./historicalYear";

const PROTAGONIST_NAMES = [
  "沈砚", "陈潜", "顾衡", "陆昭", "谢临", "韩策", "程骁", "周砺", "许闻", "林澈",
  "苏谨", "杜衡", "裴简", "温岐", "梁朔", "江屿", "范宁", "秦川", "楚安", "孟舟",
  "赵潜", "袁简", "卫宁", "罗执", "唐砺", "宋临", "叶衡", "何远", "徐策", "白砚",
  "马库斯", "尤利安", "阿列克谢", "迭戈", "马丁", "伽利略", "埃德蒙", "朱利安", "亚瑟", "查尔斯",
  "塞缪尔", "米洛什", "伊万", "艾琳", "卡尔", "尼古拉", "罗伯特", "丹尼尔", "迈克尔", "安娜",
] as const;

function clean(value: string): string {
  return value.replace(/[。！？!?；;]+/g, "，").replace(/，+/g, "，").replace(/^，|，$/g, "").trim();
}

function clip(value: string, max: number): string {
  return [...value].slice(0, max).join("");
}

const DANGLING_CLAUSE_END_PATTERN = /(?:的|并|同时|随后|转而|改为|通过|试图|准备|意图|而非|而非中|试图平衡|是应急|出资补|[，,](?:向|对|把|将|让|以|从|与|和|及|但|且))$/;

function compactCompleteClause(value: string, max: number, fallback: string): string {
  const normalized = clean(value);
  if ([...normalized].length <= max && !DANGLING_CLAUSE_END_PATTERN.test(normalized)) {
    return normalized;
  }

  const clauses = normalized
    .split(/[，,。！？!?；;]/)
    .map((clause) => clause.trim())
    .filter((clause) => (
      [...clause].length >= 6
      && [...clause].length <= max
      && !DANGLING_CLAUSE_END_PATTERN.test(clause)
    ));
  return clauses.at(-1) ?? fallback;
}

function decisionAction(seed: HistorySeed): string {
  return clean(seed.decision).replace(/^是否/, "");
}

function fixedNarrative(seed: HistorySeed): string {
  const first = `${clip(clean(seed.baselineFacts[0]), 30)}，${clip(clean(seed.baselineFacts[1]), 28)}。`;
  const second = `${clip(clean(seed.baselineFacts[2]), 30)}，你以${clip(clean(seed.role), 22)}的身份抵达现场。`;
  let thirdBody = `${clip(clean(seed.urgency), 30)}，你必须决定是否${clip(decisionAction(seed), 40)}`;
  let narrative = `${first}${second}${thirdBody}。`;
  if ([...narrative].length < 96) {
    thirdBody += "，在场各方都会依照你的命令改变行动";
    narrative = `${first}${second}${thirdBody}。`;
  }
  return clip(narrative, 159).replace(/[，、]$/, "") + (clip(narrative, 159).endsWith("。") ? "" : "。");
}

function choices(seed: HistorySeed): TimelineTurn["choices"] {
  const originalAction = decisionAction(seed);
  const fact = clean(seed.baselineFacts[0]);
  const event = clean(seed.eventName);
  const eventKey = compactCompleteClause(event, 18, "这一历史现场");
  const action = compactCompleteClause(
    originalAction,
    28,
    `执行改变${eventKey}走向的关键命令`,
  );
  const factKey = compactCompleteClause(fact, 18, eventKey);
  const deadline = clip(clean(seed.urgency), 20);
  return [
    {
      id: "A",
      label: action,
      displayLabel: action,
      intent: "立即执行眼前的关键决定",
      deviationClass: "nudge",
      usesModernKnowledge: false,
      actionSpec: { actor: "你与现场执行者", action, target: clip(event, 28), deadline },
      instantEcho: {
        directResult: clip(`你决定${action}，现场立即照办`, 80),
        unexpectedCost: "原有矛盾提前爆发",
        beneficiary: "支持这道命令的人",
        payer: "承担现场风险的人",
      },
    },
    {
      id: "B",
      label: `核验${factKey}后，再决定是否执行原令`,
      displayLabel: `核验${factKey}后，再决定是否执行原令`,
      intent: "用现代核验方法降低误判",
      deviationClass: "reform",
      usesModernKnowledge: true,
      actionSpec: { actor: "你与可靠见证人", action: "交叉核验情报后重发命令", target: clip(fact, 28), deadline },
      instantEcho: {
        directResult: "关键情报被重新核验，命令随证据调整",
        unexpectedCost: "核验耗掉最后的行动窗口",
        beneficiary: "掌握可靠证据的人",
        payer: "等待命令的前线人员",
      },
    },
    {
      id: "C",
      label: `公开拒绝并阻止${action}`,
      displayLabel: `公开拒绝并阻止${action}`,
      intent: "让真实历史的关键动作无法发生",
      deviationClass: "rupture",
      usesModernKnowledge: false,
      actionSpec: { actor: "你与直属人手", action: "扣住原令并公开阻止原定行动", target: clip(action, 28), deadline },
      instantEcho: {
        directResult: clip(`${action}被你当场阻止`, 80),
        unexpectedCost: "旧秩序立即把你视为敌人",
        beneficiary: "原本会被牺牲的人",
        payer: "依赖既定计划的人",
      },
    },
  ];
}

export function getFixedOpening(seed: HistorySeed): TimelineTurn {
  const node = getTimelineNode(1, seed.year);
  const openingDateLabel = seed.year < 0
    ? formatHistoricalYear(seed.year)
    : seed.dateLabel.trim() || formatHistoricalYear(seed.year);
  const nameHash = Math.abs(seed.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0));
  const protagonistName = seed.perspective === "china"
    ? PROTAGONIST_NAMES[nameHash % 30]
    : PROTAGONIST_NAMES[30 + (nameHash % 20)];
  const opening = {
    chapter: 1,
    chapterName: "历史现场",
    protagonistName,
    protagonistAge: node.protagonistAge,
    lifeStage: node.lifeStage,
    yearLabel: `${openingDateLabel} · ${node.protagonistAge}岁`,
    location: clip(seed.location, 28),
    role: clip(seed.role, 24),
    causalBridge: "你此刻的命令将成为整条时间线的源头",
    worldStateChange: "历史尚未改变，决定权已经落到你手中",
    divergenceProof: clip(clean(seed.historicalOutcome), 48),
    immediateObjective: clip(decisionAction(seed), 40),
    timePressure: clip(clean(seed.urgency), 36),
    headline: clip(seed.eventName, 22),
    narrative: fixedNarrative(seed),
    baselineAnchor: clip(clean(seed.historicalOutcome), 54),
    historicalAnchors: seed.baselineFacts.map((fact) => clip(clean(fact), 32)),
    previousEcho: null,
    choices: choices(seed),
    memorySummary: clip(`你在${seed.eventName}现场获得改变真实历史的决定权`, 54),
    causalLedger: [],
    visualTone: seed.visualTone,
    generationSource: "fixed",
  };

  return parseTimelineTurn(JSON.stringify(opening), {
    expectedChapter: 1,
    expectedYearLabel: opening.yearLabel,
    expectedProtagonistAge: node.protagonistAge,
    expectedLifeStage: node.lifeStage,
    expectedGenerationSource: "fixed",
  });
}
