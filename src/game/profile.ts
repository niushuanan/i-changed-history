import type {
  TravelerOccupation,
  TravelerPersonalityDimensions,
  TravelerProfile,
  TravelerRiskStyle,
  TravelerStrength,
} from "./types";

type DimensionKey = keyof TravelerPersonalityDimensions;
type DimensionValue = TravelerPersonalityDimensions[DimensionKey];

export type PersonalityQuestion = {
  dimension: DimensionKey;
  marker: string;
  situation: string;
  context: string;
  options: readonly [
    { value: DimensionValue; code: string; title: string; detail: string },
    { value: DimensionValue; code: string; title: string; detail: string },
  ];
};

export const PERSONALITY_QUESTIONS: readonly PersonalityQuestion[] = [
  {
    dimension: "energy",
    marker: "情报如何流动",
    situation: "你截获了一封会改变王朝命运的密信。天亮前，你先做什么？",
    context: "没有正确答案。你选择的是这局历史里最自然的第一反应。",
    options: [
      { value: "I", code: "I", title: "独自核实", detail: "隔绝干扰，先把每个细节推演到能自证" },
      { value: "E", code: "E", title: "结成同盟", detail: "立即寻找关键人物，让情报开始在人群中生效" },
    ],
  },
  {
    dimension: "perception",
    marker: "你相信什么",
    situation: "正史说城门从未打开，但你亲眼看见一队人消失在门后。",
    context: "你只有半个时辰决定该追哪条线索。",
    options: [
      { value: "S", code: "S", title: "锁定现场证据", detail: "找守门人、车辙和名册，只相信能被核实的事实" },
      { value: "N", code: "N", title: "追踪隐藏模式", detail: "把异常连起来，推断是谁在改写整件事的规则" },
    ],
  },
  {
    dimension: "judgment",
    marker: "代价由谁承担",
    situation: "一项改革能让国家再稳定十年，却会让眼前一座城断粮。",
    context: "命令正在等你签字，任何选择都会留下受益者和承担者。",
    options: [
      { value: "T", code: "T", title: "计算结构后果", detail: "比较长期秩序与总体代价，选择可持续的制度" },
      { value: "F", code: "F", title: "先保住具体的人", detail: "拒绝把眼前的人变成数字，再承担制度震荡" },
    ],
  },
  {
    dimension: "tactics",
    marker: "计划突然失效",
    situation: "你准备了三个月的方案，在行动前一刻被一个意外彻底打乱。",
    context: "门外的脚步声越来越近，你必须立刻行动。",
    options: [
      { value: "J", code: "J", title: "重建行动秩序", detail: "迅速排出先后次序，把失控局面重新纳入计划" },
      { value: "P", code: "P", title: "临场变招", detail: "利用意外暴露的新机会，边行动边重写方案" },
    ],
  },
] as const;

const ARCHETYPES: Record<string, string> = {
  ISTJ: "史实校准者", ISFJ: "微光守夜人", INFJ: "长线预言者", INTJ: "制度设计者",
  ISTP: "现场拆解者", ISFP: "乱世护送者", INFP: "价值点火者", INTP: "因果侦探",
  ESTP: "破局行动派", ESFP: "人群点燃者", ENFP: "可能性煽动者", ENTP: "规则黑客",
  ESTJ: "秩序推进者", ESFJ: "联盟组织者", ENFJ: "共识建造者", ENTJ: "权力棋手",
};

const DIMENSION_LABELS: Record<string, string> = {
  I: "独处推演", E: "联盟动员", S: "现场取证", N: "模式推理",
  T: "结构裁决", F: "人心感知", J: "秩序推进", P: "临场变招",
};

const LEGACY_BY_PAIR: Record<string, {
  occupation: TravelerOccupation;
  strengths: readonly [TravelerStrength, TravelerStrength];
}> = {
  ST: { occupation: "engineering", strengths: ["technology", "law"] },
  SF: { occupation: "public-service", strengths: ["medicine", "organization"] },
  NT: { occupation: "product", strengths: ["strategy", "technology"] },
  NF: { occupation: "creative", strengths: ["writing", "negotiation"] },
};

export type TravelerAbility = {
  typeCode: string;
  title: string;
  strengths: string;
  action: string;
  preview: string;
  previewMode: "system" | "people" | "evidence" | "care";
  customAction: string;
  style: string;
  promptDirective: string;
};

function typeCode(dimensions: TravelerPersonalityDimensions) {
  return `${dimensions.energy}${dimensions.perception}${dimensions.judgment}${dimensions.tactics}`;
}

export function buildTravelerProfile(dimensions: TravelerPersonalityDimensions): TravelerProfile {
  const code = typeCode(dimensions);
  const legacy = LEGACY_BY_PAIR[`${dimensions.perception}${dimensions.judgment}`];
  return {
    name: ARCHETYPES[code] ?? "时空破局者",
    typeCode: code,
    dimensions: { ...dimensions },
    occupation: legacy.occupation,
    strengths: legacy.strengths,
    riskStyle: dimensions.tactics === "P" ? "bold" : "balanced",
  };
}

export function getTravelerAbility(profile: TravelerProfile): TravelerAbility {
  const { dimensions } = profile;
  const preview = dimensions.perception === "N"
    ? dimensions.judgment === "T"
      ? "预判时优先看见长期连锁与制度代价"
      : "预判时优先看见长期连锁与被忽略的人"
    : dimensions.judgment === "T"
      ? "预判时优先看见即时证据与执行缺口"
      : "预判时优先看见眼前受益者与承担者";
  const leverage = dimensions.energy === "I" ? "独立推演" : "快速动员";
  const method = dimensions.tactics === "J" ? "重排资源与步骤" : "利用突发变量临场变招";
  const previewMode = dimensions.perception === "N"
    ? dimensions.judgment === "T" ? "system" : "people"
    : dimensions.judgment === "T" ? "evidence" : "care";
  return {
    typeCode: profile.typeCode,
    title: profile.name,
    strengths: Object.values(dimensions).map((value) => DIMENSION_LABELS[value]).join(" × "),
    action: `每幕三个行动中，有一个只按 ${profile.typeCode} 的本能生成`,
    preview,
    previewMode,
    customAction: `三次自由改命中，可先${leverage}，再${method}，但 AI 仍会结算历史约束与隐藏代价`,
    style: `${DIMENSION_LABELS[dimensions.energy]}，${DIMENSION_LABELS[dimensions.perception]}，${DIMENSION_LABELS[dimensions.judgment]}，${DIMENSION_LABELS[dimensions.tactics]}`,
    promptDirective: `${profile.typeCode}「${profile.name}」：专属行动必须体现${leverage}、${DIMENSION_LABELS[dimensions.perception]}、${DIMENSION_LABELS[dimensions.judgment]}与${method}；不得把人格写成超能力。`,
  };
}

type LegacyTravelerProfile = {
  name?: unknown;
  occupation?: unknown;
  strengths?: unknown;
  riskStyle?: unknown;
};

export function migrateLegacyTravelerProfile(profile: LegacyTravelerProfile): TravelerProfile {
  const strengths = Array.isArray(profile.strengths) ? profile.strengths : [];
  const energy = strengths.some((value) => ["negotiation", "organization", "writing"].includes(String(value))) ? "E" : "I";
  const perception = strengths.some((value) => ["strategy", "writing", "business"].includes(String(value))) ? "N" : "S";
  const judgment = strengths.some((value) => ["negotiation", "writing", "medicine", "organization"].includes(String(value))) ? "F" : "T";
  const tactics = profile.riskStyle === "bold" ? "P" : "J";
  return buildTravelerProfile({ energy, perception, judgment, tactics });
}
