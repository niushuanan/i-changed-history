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
  return clauses[clauses.length - 1] ?? fallback;
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
      displayLabel: compactCompleteClause(action, 14, "照史推进原定命令"),
      intent: "依照真实历史的既有路径推进",
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
      label: `抢在各方反应前夺取${factKey}的现场解释权`,
      displayLabel: "夺取现场解释权",
      intent: "用强硬手段显著改写历史走向",
      deviationClass: "reform",
      usesModernKnowledge: true,
      actionSpec: { actor: "你与可靠见证人", action: "抢先控制证据并重发命令", target: clip(fact, 28), deadline },
      instantEcho: {
        directResult: "关键证据与命令解释权被你同时控制",
        unexpectedCost: "旧有权力立即把你视为威胁",
        beneficiary: "愿意追随新命令的人",
        payer: "依赖原有秩序的执行者",
      },
    },
    {
      id: "C",
      label: `召来钢铁巨兽，以轰鸣逼迫${eventKey}各方立即停手`,
      displayLabel: "召来钢铁巨兽",
      intent: "以超越时代常识的力量撕开历史",
      deviationClass: "rupture",
      usesModernKnowledge: true,
      actionSpec: { actor: "你与突然降临的钢铁巨兽", action: "以装甲与轰鸣封锁现场", target: clip(event, 28), deadline },
      instantEcho: {
        directResult: clip(`${eventKey}各方因钢铁巨兽当场停手`, 80),
        unexpectedCost: "所有阵营开始争夺异物",
        beneficiary: "被原定冲突卷入的人",
        payer: "无法解释神迹的旧权威",
      },
    },
  ];
}

function rollChoices(seed: HistorySeed): TimelineTurn["rollChoices"] {
  const event = clean(seed.eventName);
  const eventKey = compactCompleteClause(event, 18, "这一历史现场");
  const deadline = clip(clean(seed.urgency), 20);
  const originalAction = compactCompleteClause(
    decisionAction(seed),
    28,
    `执行改变${eventKey}走向的关键命令`,
  );
  return [
    {
      id: "A",
      label: `封存争议情报，在最后时限照既有方案执行${originalAction}`,
      displayLabel: "压到最后一刻",
      intent: "更谨慎地保护真实历史的既有轨迹",
      deviationClass: "nudge",
      usesModernKnowledge: false,
      actionSpec: { actor: "你与原定执行者", action: "封存争议信息后照原令行动", target: clip(event, 28), deadline },
      instantEcho: {
        directResult: "原定行动在最后时限照常发生",
        unexpectedCost: "被压住的争议留下长期裂痕",
        beneficiary: "依赖原计划的人",
        payer: "要求立刻改变的人",
      },
    },
    {
      id: "B",
      label: `当众撕毁原令，联合反对者接管${eventKey}的执行权`,
      displayLabel: "撕令夺权",
      intent: "把一次决定升级为公开的权力更替",
      deviationClass: "reform",
      usesModernKnowledge: false,
      actionSpec: { actor: "你与现场反对者", action: "撕毁原令并夺取执行权", target: clip(event, 28), deadline },
      instantEcho: {
        directResult: "原定执行链被你当众截断",
        unexpectedCost: "现场立刻分裂为两套权力",
        beneficiary: "被旧命令压制的人",
        payer: "仍效忠原令的执行者",
      },
    },
    {
      id: "C",
      label: `召来山海异兽驮走${eventKey}的关键器物，让全场改奉兽谕`,
      displayLabel: "请神兽改写诏令",
      intent: "让神话实体直接进入历史因果链",
      deviationClass: "rupture",
      usesModernKnowledge: false,
      actionSpec: { actor: "你与降临现场的山海异兽", action: "驮走关键器物并颁下兽谕", target: clip(event, 28), deadline },
      instantEcho: {
        directResult: "关键器物被异兽带离现场",
        unexpectedCost: "民众开始把神迹凌驾于制度",
        beneficiary: "借神谕摆脱旧令的人",
        payer: "依靠文书与礼法的权威",
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
    rollChoices: rollChoices(seed),
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
