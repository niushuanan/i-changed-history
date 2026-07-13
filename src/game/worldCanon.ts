import type { PlayedTurn } from "./prompts";
import type { GameScenario } from "./reducer";
import type { RippleLens } from "./rippleRouter";
import type { DecisionChapter } from "./timelinePlan";

export const PIVOT_KINDS = [
  "power",
  "technology",
  "institution",
  "war",
  "trade",
  "knowledge",
  "livelihood",
] as const;

export type PivotKind = (typeof PIVOT_KINDS)[number];
export type PivotalScale = "scene" | "regime" | "nation" | "civilization" | "world";

export type CanonicalPlayedTurn = PlayedTurn & {
  playerAuthored?: boolean;
  canonStatus?: "玩家钦定";
  causalMechanism?: string;
};

export type ImmutableFact = {
  chapter: number;
  text: string;
  playerAuthored: boolean;
  canonStatus?: "玩家钦定";
  causalMechanism?: string;
};

export type ActiveMandate = {
  kind: PivotKind;
  sourceChapter: number;
  sourceText: string;
  playerAuthored: boolean;
  activeThroughChapter: number;
  requiredEvidence: readonly string[];
};

export type HistoricalDebt = {
  causedByChapter: number;
  directResult: string;
  unexpectedCost: string;
  beneficiary: string;
  payer: string;
};

export type WorldCanon = {
  immutableFacts: readonly ImmutableFact[];
  activeMandates: readonly ActiveMandate[];
  latestDecision: ImmutableFact | null;
  recentCustomCanon: ImmutableFact | null;
  historicalDebt: HistoricalDebt | null;
};

export type PivotalBrief = {
  scale: PivotalScale;
  pivotKind: PivotKind;
  rippleLens: Exclude<RippleLens, "origin">;
  activeMandates: readonly {
    kind: PivotKind;
    label: string;
    sourceChapter: number;
    sourceText: string;
    playerAuthored: boolean;
    requiredEvidence: readonly string[];
  }[];
  activeCustomCanon: readonly {
    sourceChapter: number;
    sourceText: string;
    claimGroups: readonly (readonly string[])[];
  }[];
  significanceRequirement: string;
  mustPreserve: readonly string[];
  mustPayOffNow: string;
  continuityMandate: string | null;
  requiredCausalChapters: readonly number[];
  forbiddenPattern: readonly string[];
  requiredEvidence: readonly string[];
};

type MandateDefinition = {
  label: string;
  evidence: readonly string[];
  significance: string;
};

const MANDATES: Record<PivotKind, MandateDefinition> = {
  power: {
    label: "权力与继承",
    evidence: ["继承", "政权", "册立", "宫门"],
    significance: "必须决定继承、联盟或政权合法性这一不可逆秩序。",
  },
  technology: {
    label: "技术与生产",
    evidence: ["工坊", "学校", "工艺", "生产", "人才"],
    significance: "必须决定国家如何把技术投入转成机构、人才、工艺或生产能力。",
  },
  institution: {
    label: "法令与制度",
    evidence: ["法令", "制度", "官署", "执行", "授权", "掌控", "考核", "裁决", "取缔", "收回"],
    significance: "必须决定一项法令、官署或制度如何不可逆地重排权利与责任。",
  },
  war: {
    label: "战争与联盟",
    evidence: ["军队", "会战", "盟约", "边境"],
    significance: "必须决定战争、联盟或军事动员的胜负条件与承担者。",
  },
  trade: {
    label: "财政与贸易",
    evidence: ["税", "贸易", "货币", "市场", "账簿"],
    significance: "必须决定税制、货币、商路或财政分配的长期规则。",
  },
  knowledge: {
    label: "知识与传播",
    evidence: ["出版", "学校", "新闻", "思想", "抄本"],
    significance: "必须决定知识、教育或传播网络由谁掌握并如何扩散。",
  },
  livelihood: {
    label: "人口与生计",
    evidence: ["土地", "粮食", "住房", "医疗", "劳动"],
    significance: "必须决定人口、生计或公共资源如何长期分配。",
  },
};

const FORBIDDEN_PATTERNS = [
  "普通工作汇报",
  "泛化民生切片",
  "无名机构",
  "与上一决定无直接关系的随机换题",
] as const;

const SCALE_REQUIREMENTS: Record<PivotalScale, string> = {
  scene: "必须形成不可撤销的命令、任命、宣告或战场结果，而不是普通善后。",
  regime: "必须决定政权、继承、联盟或核心制度的存亡。",
  nation: "必须重排全国财政、军队、生产、法律或人口秩序。",
  civilization: "必须改变跨世代知识、技术、贸易或文明竞争路径。",
  world: "必须决定世界联盟、战争、工业体系或全球规则。",
};

const PIVOT_RIPPLE_LENS: Record<PivotKind, Exclude<RippleLens, "origin">> = {
  power: "power",
  technology: "technology",
  institution: "power",
  war: "diplomacy",
  trade: "trade",
  knowledge: "knowledge",
  livelihood: "livelihood",
};

const CANON_CLAIM_TERMS: Record<PivotKind, readonly string[]> = {
  power: ["皇帝", "称帝", "登基", "继承", "政权", "摄政", "君主"],
  technology: ["科学院", "科技", "科学", "工业", "机器", "工坊", "工艺"],
  institution: ["法律", "法令", "改革", "废除", "制度", "官署"],
  war: ["战争", "军队", "刺杀", "征服", "会战", "起兵"],
  trade: ["贸易", "货币", "税", "市场", "商路", "财政"],
  knowledge: ["出版", "学校", "新闻", "思想", "传播", "学堂", "教育"],
  livelihood: ["土地", "粮食", "住房", "医疗", "劳动", "人口"],
};

function isPlayerAuthored(turn: CanonicalPlayedTurn): boolean {
  return turn.playerAuthored === true || turn.selectedChoiceId === "custom";
}

function classifyPivotKinds(text: string, fallback: CanonicalPlayedTurn["selectedDeviationClass"]): readonly PivotKind[] {
  const matched: PivotKind[] = [];
  const technologyText = text.replaceAll("科学院", "");
  const foundsAcademy = /(?:建立|设立|创办|建设|扩建|成立).{0,8}科学院|科学院.{0,8}(?:建立|设立|创办|建设|扩建|成立)/.test(text);
  if (/皇帝|称帝|夺权|继承|政变|君主|登基/.test(text)) matched.push("power");
  if (foundsAcademy || /科技|科学|工业|机器|教育|工艺/.test(technologyText)) matched.push("technology");
  if (/战争|军队|刺杀|征服|会战|军/.test(text)) matched.push("war");
  if (/贸易|货币|税|市场|商路|财政/.test(text)) matched.push("trade");
  if (/出版|学校|新闻|思想|传播|学堂/.test(text)) matched.push("knowledge");
  if (/土地|粮食|住房|医疗|劳动|人口/.test(text)) matched.push("livelihood");
  if (/法律|法令|改革|废除|制度|官署/.test(text)) matched.push("institution");
  if (matched.length > 0) return matched;
  return [fallback === "rupture" ? "war" : fallback === "reform" ? "institution" : "livelihood"];
}

function toImmutableFact(turn: CanonicalPlayedTurn): ImmutableFact {
  const playerAuthored = isPlayerAuthored(turn);
  return {
    chapter: turn.turn.chapter,
    text: turn.selectedChoiceLabel,
    playerAuthored,
    ...(playerAuthored ? { canonStatus: turn.canonStatus ?? "玩家钦定" } : {}),
    ...(turn.causalMechanism ? { causalMechanism: turn.causalMechanism } : {}),
  };
}

function scaleFor(chapter: DecisionChapter): PivotalScale {
  if (chapter <= 3) return "scene";
  if (chapter <= 5) return "regime";
  if (chapter <= 7) return "nation";
  if (chapter <= 9) return "civilization";
  return "world";
}

function activeMandatesForChapter(
  mandates: readonly ActiveMandate[],
  chapter: DecisionChapter,
): readonly ActiveMandate[] {
  return mandates.filter((mandate) => mandate.sourceChapter < chapter && chapter <= mandate.activeThroughChapter);
}

function pivotalMandateForChapter(
  mandates: readonly ActiveMandate[],
  chapter: DecisionChapter,
): ActiveMandate | null {
  const active = activeMandatesForChapter(mandates, chapter);
  if (active.length === 0) return null;
  const custom = active.filter((mandate) => mandate.playerAuthored);
  const priorityPool = custom.length > 0 ? custom : active;
  const latestSource = Math.max(...priorityPool.map((mandate) => mandate.sourceChapter));
  const latest = priorityPool.filter((mandate) => mandate.sourceChapter === latestSource);
  return latest[(chapter - latestSource - 1) % latest.length] ?? latest[0] ?? null;
}

function claimTermsFor(sourceText: string, kind: PivotKind): readonly string[] {
  const matched = CANON_CLAIM_TERMS[kind].filter((term) => sourceText.includes(term));
  return matched.length > 0 ? matched : MANDATES[kind].evidence.slice(0, 2);
}

function regexEscape(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasNegatedClaims(sourceText: string, text: string): boolean {
  if (/失败|未能|没有成功|放弃|取消/.test(sourceText)) return false;
  const kinds = classifyPivotKinds(sourceText, "rupture");
  return kinds.some((kind) => claimTermsFor(sourceText, kind).some((term) => {
    const escaped = regexEscape(term);
    return new RegExp(`(?:并未|未能|没有|从未|其实未|失败|取消|未成立).{0,10}${escaped}|${escaped}.{0,12}(?:失败|未能|并未|没有|未成立|其实未死|仍然在世|幸存|毫发无伤|只是一场误会|只是计划|只是尝试)`).test(text);
  }));
}

export function buildWorldCanon(playedTurns: readonly CanonicalPlayedTurn[]): WorldCanon {
  const immutableFacts = playedTurns.map(toImmutableFact);
  const activeMandates = playedTurns.flatMap((turn) =>
    classifyPivotKinds(turn.selectedChoiceLabel, turn.selectedDeviationClass).map((kind) => ({
      kind,
      sourceChapter: turn.turn.chapter,
      sourceText: turn.selectedChoiceLabel,
      playerAuthored: isPlayerAuthored(turn),
      activeThroughChapter: Math.min(11, turn.turn.chapter + 3),
      requiredEvidence: MANDATES[kind].evidence,
    })),
  );
  const latestTurn = playedTurns.at(-1);
  const latestDecision = immutableFacts.at(-1) ?? null;
  const recentCustomCanon = immutableFacts.filter((fact) => fact.playerAuthored).at(-1) ?? null;

  return {
    immutableFacts,
    activeMandates,
    latestDecision,
    recentCustomCanon,
    historicalDebt: latestTurn
      ? {
        causedByChapter: latestTurn.turn.chapter,
        directResult: latestTurn.resolvedEcho.directResult,
        unexpectedCost: latestTurn.resolvedEcho.unexpectedCost,
        beneficiary: latestTurn.resolvedEcho.beneficiary,
        payer: latestTurn.resolvedEcho.payer,
      }
      : null,
  };
}

export function buildPivotalBrief(
  scenario: GameScenario,
  playedTurns: readonly CanonicalPlayedTurn[],
  chapter: Exclude<DecisionChapter, 1>,
): PivotalBrief {
  const canon = buildWorldCanon(playedTurns);
  const latestTurn = playedTurns.at(-1);
  const activeMandates = activeMandatesForChapter(canon.activeMandates, chapter);
  const continuity = activeMandates.filter((mandate) => mandate.playerAuthored);
  const pivot = pivotalMandateForChapter(canon.activeMandates, chapter)
    ?? (latestTurn
      ? {
        kind: classifyPivotKinds(latestTurn.selectedChoiceLabel, latestTurn.selectedDeviationClass)[0],
        sourceChapter: latestTurn.turn.chapter,
        sourceText: latestTurn.selectedChoiceLabel,
        playerAuthored: isPlayerAuthored(latestTurn),
        activeThroughChapter: latestTurn.turn.chapter,
        requiredEvidence: MANDATES[classifyPivotKinds(latestTurn.selectedChoiceLabel, latestTurn.selectedDeviationClass)[0]].evidence,
      }
      : null);
  const pivotKind = pivot?.kind ?? "institution";
  const latestText = canon.latestDecision?.text ?? scenario.seed.eventName;
  const scale = scaleFor(chapter);
  const requiredCausalChapters = Array.from(new Set([
    ...activeMandates
      .filter((mandate) => mandate.playerAuthored)
      .map((mandate) => mandate.sourceChapter),
    ...(canon.latestDecision ? [canon.latestDecision.chapter] : []),
  ])).sort((left, right) => left - right);

  return {
    scale,
    pivotKind,
    rippleLens: PIVOT_RIPPLE_LENS[pivotKind],
    activeMandates: activeMandates.map((mandate) => ({
      kind: mandate.kind,
      label: MANDATES[mandate.kind].label,
      sourceChapter: mandate.sourceChapter,
      sourceText: mandate.sourceText,
      playerAuthored: mandate.playerAuthored,
      requiredEvidence: mandate.requiredEvidence,
    })),
    activeCustomCanon: canon.immutableFacts
      .filter((fact) => fact.playerAuthored && activeMandates.some((mandate) => mandate.sourceChapter === fact.chapter))
      .map((fact) => ({
        sourceChapter: fact.chapter,
        sourceText: fact.text,
        claimGroups: activeMandates
          .filter((mandate) => mandate.playerAuthored && mandate.sourceChapter === fact.chapter)
          .map((mandate) => claimTermsFor(fact.text, mandate.kind)),
      })),
    significanceRequirement: `${SCALE_REQUIREMENTS[scale]}${MANDATES[pivotKind].significance}`,
    mustPreserve: canon.immutableFacts.map((fact) => fact.text),
    mustPayOffNow: `上一决定「${latestText}」已经成为世界事实，必须展示其直接结果与当前代价。`,
    continuityMandate: continuity.length > 0
      ? `玩家钦定正史仍在生效：${Array.from(new Set(continuity.map((mandate) => `「${mandate.sourceText}」的${MANDATES[mandate.kind].label}`))).join("、")}。`
      : null,
    requiredCausalChapters,
    forbiddenPattern: FORBIDDEN_PATTERNS,
    requiredEvidence: pivot?.requiredEvidence ?? MANDATES[pivotKind].evidence,
  };
}

type PivotalSceneText = {
  role: string;
  location: string;
  headline: string;
  narrative: string;
  causalBridge: string;
  immediateObjective: string;
  turningPointStakes: string;
  worldStateChange: string;
  divergenceProof: string;
};

export function pivotalSceneMatches(brief: PivotalBrief, scene: PivotalSceneText): boolean {
  const text = [
    scene.role,
    scene.location,
    scene.headline,
    scene.narrative,
    scene.causalBridge,
    scene.immediateObjective,
    scene.turningPointStakes,
    scene.worldStateChange,
    scene.divergenceProof,
  ].join("；");
  return brief.requiredEvidence.filter((keyword) => text.includes(keyword)).length >= 2;
}

type CausalLedgerFact = {
  fact: string;
  causedByChapter: number;
  mustAffect: string;
};

export function pivotalScenePreservesCanon(
  brief: PivotalBrief,
  scene: PivotalSceneText,
  causalLedger: readonly CausalLedgerFact[],
): boolean {
  const visibleCurrentState = [
    scene.role,
    scene.location,
    scene.headline,
    scene.narrative,
    scene.causalBridge,
    scene.immediateObjective,
    scene.turningPointStakes,
    scene.worldStateChange,
    scene.divergenceProof.split("当前线").at(-1) ?? "",
  ].join("；");

  return brief.activeCustomCanon.every((fact) => {
    const exactLedgerFact = causalLedger.some(
      (entry) => entry.causedByChapter === fact.sourceChapter && entry.fact === fact.sourceText,
    );
    const everyClaimVisible = fact.claimGroups.every((group) => group.some((term) => visibleCurrentState.includes(term)));
    return exactLedgerFact && everyClaimVisible && !hasNegatedClaims(fact.sourceText, visibleCurrentState);
  });
}

export function endingConsequencePreservesCanon(sourceText: string, consequence: string): boolean {
  if (!consequence.includes(sourceText)) return false;
  return !hasNegatedClaims(sourceText, consequence.replace(sourceText, ""));
}
