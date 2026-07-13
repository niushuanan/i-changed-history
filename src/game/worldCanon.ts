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

export function endingConsequencePreservesCanon(sourceText: string, consequence: string): boolean {
  if (!consequence.includes(sourceText)) return false;
  return !consequenceContradictsCanon(sourceText, consequence.replace(sourceText, ""));
}
