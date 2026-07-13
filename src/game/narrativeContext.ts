import type { PlayedTurn } from "./prompts";
import { buildWorldCanon } from "./worldCanon";

export type LifeIndexEntry = {
  chapter: number;
  yearLabel: string;
  protagonistAge: number;
  role: string;
  location: string;
  decision: string;
  directResult: string;
};

export type NarrativeContext = {
  lifeIndex: readonly LifeIndexEntry[];
  latestDecision: (LifeIndexEntry & {
    unexpectedCost: string;
    beneficiary: string;
    payer: string;
  }) | null;
  activeConsequences: ReadonlyArray<{
    chapter: number;
    decision: string;
    directResult: string;
    unexpectedCost: string;
    beneficiary: string;
    payer: string;
  }>;
  playerCanon: ReadonlyArray<{
    chapter: number;
    sourceText: string;
    propagationMechanism: string;
  }>;
  activePlayerCanon: ReadonlyArray<{
    chapter: number;
    sourceText: string;
    propagationMechanism: string;
    activeThroughChapter: number;
  }>;
  persistentLedger: PlayedTurn["turn"]["causalLedger"];
  recentScenes: ReadonlyArray<{
    chapter: number;
    headline: string;
    location: string;
    role: string;
    historicalAnchors: PlayedTurn["turn"]["historicalAnchors"];
  }>;
};

function lifeEntry(played: PlayedTurn): LifeIndexEntry {
  return {
    chapter: played.turn.chapter,
    yearLabel: played.turn.yearLabel,
    protagonistAge: played.turn.protagonistAge,
    role: played.turn.role,
    location: played.turn.location,
    decision: played.selectedChoiceLabel,
    directResult: played.resolvedEcho.directResult,
  };
}

export function buildNarrativeContext(
  playedTurns: readonly PlayedTurn[],
  targetChapter = (playedTurns.at(-1)?.turn.chapter ?? 0) + 1,
): NarrativeContext {
  const lifeIndex = playedTurns.map(lifeEntry);
  const latest = playedTurns.at(-1);
  const activePlayerCanon = buildWorldCanon(playedTurns, targetChapter).activeMandates.map((mandate) => ({
    chapter: mandate.sourceChapter,
    sourceText: mandate.sourceText,
    propagationMechanism: mandate.propagationMechanism,
    activeThroughChapter: mandate.activeThroughChapter,
  }));

  return {
    lifeIndex,
    latestDecision: latest
      ? {
          ...lifeEntry(latest),
          unexpectedCost: latest.resolvedEcho.unexpectedCost,
          beneficiary: latest.resolvedEcho.beneficiary,
          payer: latest.resolvedEcho.payer,
        }
      : null,
    activeConsequences: playedTurns.slice(-3).map((played) => ({
      chapter: played.turn.chapter,
      decision: played.selectedChoiceLabel,
      directResult: played.resolvedEcho.directResult,
      unexpectedCost: played.resolvedEcho.unexpectedCost,
      beneficiary: played.resolvedEcho.beneficiary,
      payer: played.resolvedEcho.payer,
    })),
    playerCanon: playedTurns
      .filter((played) => played.playerAuthored === true || played.selectedChoiceId === "custom")
      .map((played) => ({
        chapter: played.turn.chapter,
        sourceText: played.selectedChoiceLabel,
        propagationMechanism: played.causalMechanism ?? played.turn.causalBridge,
      })),
    activePlayerCanon,
    persistentLedger: latest?.turn.causalLedger ?? [],
    recentScenes: playedTurns.slice(-3).map((played) => ({
      chapter: played.turn.chapter,
      headline: played.turn.headline,
      location: played.turn.location,
      role: played.turn.role,
      historicalAnchors: played.turn.historicalAnchors,
    })),
  };
}
