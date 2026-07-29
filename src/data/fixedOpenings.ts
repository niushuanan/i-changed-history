import { parseTimelineTurn, type TimelineTurn } from "../game/schema";
import { getTimelineNode } from "../game/timelinePlan";
import type { HistorySeed } from "../game/types";
import type { PowerId } from "../game/powers";
import { formatHistoricalYear } from "./historicalYear";
import {
  FIXED_OPENING_CHOICES,
  type FixedOpeningChoiceEntry,
} from "./fixedOpeningChoices.generated";
import { FIXED_POWER_CHOICES } from "./fixedPowerChoices.generated";

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

function fixedNarrative(
  seed: HistorySeed,
  trajectory: FixedOpeningChoiceEntry["trajectory"],
): string {
  return [
    clean(seed.baselineFacts[0]),
    clean(seed.baselineFacts[1]),
    `你是${clean(seed.role)}`,
    clean(seed.urgency),
    clean(trajectory.decisiveFork),
  ].map((sentence) => `${sentence}。`).join("");
}

function getFixedOpeningChoiceEntry(seed: HistorySeed): FixedOpeningChoiceEntry {
  const entry = (FIXED_OPENING_CHOICES as Record<string, FixedOpeningChoiceEntry>)[seed.id];
  if (!entry) {
    throw new Error(`Fixed opening choices are missing for ${seed.id}.`);
  }
  return entry;
}

export function getFixedPowerChoicePool(
  seed: HistorySeed,
): readonly TimelineTurn["choices"][2][] {
  const pool = (FIXED_POWER_CHOICES as Record<
    string,
    readonly TimelineTurn["choices"][2][]
  >)[seed.id];
  if (!pool || pool.length !== 6) {
    throw new Error(`Fixed power choices are missing for ${seed.id}.`);
  }
  return pool;
}

export function getFixedOpeningPowerIds(seed: HistorySeed): PowerId[] {
  return getFixedPowerChoicePool(seed).map((choice) => {
    if (!choice.powerId) throw new Error(`Fixed power choice is missing powerId for ${seed.id}.`);
    return choice.powerId;
  });
}

export function getFixedOpening(
  seed: HistorySeed,
  openingPowerIds?: readonly [PowerId, PowerId],
): TimelineTurn {
  const node = getTimelineNode(1, seed.year);
  const openingDateLabel = seed.year < 0
    ? formatHistoricalYear(seed.year)
    : seed.dateLabel.trim() || formatHistoricalYear(seed.year);
  const nameHash = Math.abs(seed.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0));
  const protagonistName = seed.perspective === "china"
    ? PROTAGONIST_NAMES[nameHash % 30]
    : PROTAGONIST_NAMES[30 + (nameHash % 20)];
  const fixedChoices = getFixedOpeningChoiceEntry(seed);
  const powerPool = getFixedPowerChoicePool(seed);
  const selectedPowerIds = Array.isArray(openingPowerIds)
    ? openingPowerIds
    : [
        powerPool[0].powerId,
        powerPool[1].powerId,
      ] as readonly [PowerId, PowerId];
  const selectedPowerChoices = selectedPowerIds.map((powerId) => {
    const choice = powerPool.find((candidate) => candidate.powerId === powerId);
    if (!choice) throw new Error(`Power ${powerId} is not prepared for ${seed.id}.`);
    return choice;
  }) as [TimelineTurn["choices"][2], TimelineTurn["choices"][2]];
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
    immediateObjective: clean(fixedChoices.trajectory.historicalPath),
    timePressure: clip(clean(seed.urgency), 36),
    headline: clip(seed.eventName, 22),
    narrative: fixedNarrative(seed, fixedChoices.trajectory),
    baselineAnchor: clip(clean(seed.historicalOutcome), 54),
    historicalAnchors: seed.baselineFacts.map((fact) => clip(clean(fact), 32)),
    previousEcho: null,
    choices: [
      fixedChoices.choices[0],
      fixedChoices.choices[1],
      selectedPowerChoices[0],
    ],
    rollChoices: [
      fixedChoices.rollChoices[0],
      fixedChoices.rollChoices[1],
      selectedPowerChoices[1],
    ],
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
