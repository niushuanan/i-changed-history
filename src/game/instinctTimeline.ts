import type { PlayedTurn } from "./prompts";
import type { TimelineTurn } from "./schema";

export function selectInstinctChoice(turn: TimelineTurn) {
  return turn.choices.find((choice) => choice.usesTravelerStrength) ?? turn.choices[1];
}

export function commitInstinctTurn(turn: TimelineTurn): PlayedTurn {
  const choice = selectInstinctChoice(turn);
  return {
    turn,
    selectedChoiceId: choice.id,
    selectedChoiceLabel: choice.label,
    selectedDeviationClass: choice.deviationClass,
    resolvedEcho: choice.instantEcho,
  };
}
