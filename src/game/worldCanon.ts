import type { PlayedTurn } from "./prompts";

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
  sourceChapter: number;
  sourceText: string;
  playerAuthored: boolean;
  activeThroughChapter: number;
  propagationMechanism: string;
  directResult: string;
  unexpectedCost: string;
  beneficiary: string;
  payer: string;
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

function isPlayerAuthored(turn: CanonicalPlayedTurn): boolean {
  return turn.playerAuthored === true || turn.selectedChoiceId === "custom";
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

export function buildWorldCanon(
  playedTurns: readonly CanonicalPlayedTurn[],
  targetChapter = (playedTurns.at(-1)?.turn.chapter ?? 0) + 1,
): WorldCanon {
  const immutableFacts = playedTurns.map(toImmutableFact);
  const activeMandates = playedTurns
    .filter((turn) => {
      const sourceChapter = turn.turn.chapter;
      return isPlayerAuthored(turn) && targetChapter > sourceChapter && targetChapter <= sourceChapter + 3;
    })
    .map((turn) => ({
      sourceChapter: turn.turn.chapter,
      sourceText: turn.selectedChoiceLabel,
      playerAuthored: true,
      activeThroughChapter: Math.min(12, turn.turn.chapter + 3),
      propagationMechanism: turn.causalMechanism ?? turn.turn.causalBridge,
      directResult: turn.resolvedEcho.directResult,
      unexpectedCost: turn.resolvedEcho.unexpectedCost,
      beneficiary: turn.resolvedEcho.beneficiary,
      payer: turn.resolvedEcho.payer,
    }));
  const latestTurn = playedTurns.at(-1);

  return {
    immutableFacts,
    activeMandates,
    latestDecision: immutableFacts.at(-1) ?? null,
    recentCustomCanon: immutableFacts.filter((fact) => fact.playerAuthored).at(-1) ?? null,
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

const CONTRADICTION_PATTERNS = [
  /并未发生/g,
  /从未发生/g,
  /没有成功/g,
  /最终失败/g,
  /其实未死/g,
  /其实没有/g,
  /仍然在世/g,
  /毫发无伤/g,
  /只是一场误会/g,
  /只是计划/g,
  /只是尝试/g,
  /未能实现/g,
  /并未成为/g,
] as const;

const GENERIC_CANON_BIGRAMS = new Set([
  "已经", "立即", "从此", "结果", "决定", "完成", "发生", "成为", "正史", "玩家",
]);

const GENERIC_CANON_WORDS = new Set([
  "我们", "已经", "宣布", "完成", "新的", "各地", "生效", "公开", "背后", "全部",
  "军民", "官署", "当天", "共同", "确认", "事实", "建立", "制度", "任何", "无法",
  "开始", "执行", "当前", "现场", "相关", "所有", "此后", "正式", "取得", "最终",
  "获得", "决定", "结果", "史官", "称为",
]);

const CANON_CONCEPT_GROUPS = [
  { source: /军令|印信|兵符|调动|军权/, visible: /军令|印信|兵符|调兵|军权|指挥权|统兵|调度权/ },
  { source: /证据|真相|罪证/, visible: /证据|真相|罪证|实情|案卷|口供/ },
  { source: /粮税|军费|账目|账册|审计/, visible: /粮税|军费|税粮|账目|账册|财政|审计|清账/ },
  { source: /土地|地契|田亩|庄园/, visible: /土地|地契|田亩|庄园|分田|田契/ },
  { source: /消息网|驿站|传讯|通信/, visible: /消息网|驿站|情报网|传讯|通信|电报网|信使/ },
  { source: /工匠|识字|教育|考试|学堂/, visible: /工匠|识字|教育|考试|学堂|科举|技术人才/ },
  { source: /公产|军械|监督/, visible: /公产|军械|监督|公有|代表会议/ },
  { source: /盟约|裁决权|协议|契约/, visible: /盟约|裁决权|协议|契约|仲裁权/ },
  { source: /医院|防疫|隔离|治疗/, visible: /医院|防疫|隔离|治疗|医馆|疫病/ },
  { source: /世袭|特权|贵族|豪族|门阀/, visible: /世袭|特权|贵族|豪族|门阀|士族/ },
] as const;

function visibleCanonKeywords(sourceText: string): string[] {
  const source = sourceText.replace(/，?史官称为[“"].*$/u, "");
  const keywords = new Set<string>();
  if (typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
    for (const part of segmenter.segment(source)) {
      const word = part.segment.replace(/[^\u3400-\u9fffA-Za-z0-9]/g, "");
      if (part.isWordLike && [...word].length >= 2 && !GENERIC_CANON_WORDS.has(word)) {
        keywords.add(word);
      }
    }
  }
  if (keywords.size === 0) {
    canonAnchors(source).slice(0, 8).forEach((anchor) => keywords.add(anchor));
  }
  return [...keywords];
}

function canonAnchors(sourceText: string): string[] {
  const compact = sourceText
    .replace(/我|我们|已经|成功|且|并且|立即|从此|最终|亲自/g, "")
    .replace(/[^\u3400-\u9fffA-Za-z0-9]/g, "");
  const anchors = new Set<string>();
  for (let index = 0; index < compact.length - 1; index += 1) {
    const bigram = compact.slice(index, index + 2);
    if (!GENERIC_CANON_BIGRAMS.has(bigram)) anchors.add(bigram);
  }
  if (/成为.{0,4}皇帝|称帝|登基/.test(sourceText)) {
    anchors.add("称帝");
    anchors.add("登基");
    anchors.add("皇帝");
  }
  return [...anchors];
}

export function consequenceContradictsCanon(sourceText: string, consequence: string): boolean {
  const anchors = canonAnchors(sourceText);
  if (anchors.length === 0) return false;

  for (const pattern of CONTRADICTION_PATTERNS) {
    pattern.lastIndex = 0;
    let match = pattern.exec(consequence);
    while (match) {
      const start = Math.max(0, match.index - 18);
      const end = Math.min(consequence.length, match.index + match[0].length + 18);
      const window = consequence.slice(start, end);
      if (anchors.some((anchor) => window.includes(anchor))) return true;
      match = pattern.exec(consequence);
    }
  }
  return false;
}

export function consequenceAcknowledgesCanon(sourceText: string, consequence: string): boolean {
  const keywords = visibleCanonKeywords(sourceText);
  if (keywords.length === 0 || keywords.some((keyword) => consequence.includes(keyword))) return true;
  return CANON_CONCEPT_GROUPS.some(
    (group) => group.source.test(sourceText) && group.visible.test(consequence),
  );
}

export function endingConsequencePreservesCanon(sourceText: string, consequence: string): boolean {
  if (!consequence.includes(sourceText)) return false;
  return !consequenceContradictsCanon(sourceText, consequence.replace(sourceText, ""));
}
