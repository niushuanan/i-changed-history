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

export function buildWorldCanon(playedTurns: readonly CanonicalPlayedTurn[]): WorldCanon {
  const immutableFacts = playedTurns.map(toImmutableFact);
  const activeMandates = playedTurns.map((turn) => ({
    sourceChapter: turn.turn.chapter,
    sourceText: turn.selectedChoiceLabel,
    playerAuthored: isPlayerAuthored(turn),
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

const CONTRADICTION_PATTERN = /并未发生|从未发生|没有成功|最终失败|其实未死|其实没有|仍然在世|毫发无伤|只是一场误会|只是计划|只是尝试|未能实现|并未成为/;

export function endingConsequencePreservesCanon(sourceText: string, consequence: string): boolean {
  if (!consequence.includes(sourceText)) return false;
  return !CONTRADICTION_PATTERN.test(consequence.replace(sourceText, ""));
}
