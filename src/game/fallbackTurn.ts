import type { GameScenario } from "./reducer";
import { customActionResolutionSchema, type CustomActionResolution, type TimelineTurn } from "./schema";
import { buildCanonicalCustomResolution } from "./customCanon";
import { CUSTOM_ACTION_MAX_LENGTH } from "./limits";

// A direct rewrite is player-owned canon. This local receipt never invents a scene;
// it only preserves the player's exact completed result if the model response drifts.
export function createFallbackCustomActionResolution(
  _scenario: GameScenario,
  turn: TimelineTurn,
  action: string,
): CustomActionResolution {
  const declaredOutcome = [...action.trim()].slice(0, CUSTOM_ACTION_MAX_LENGTH).join("");
  const deviationClass = /废除|杀|炸|焚|夺权|起兵|成功|全部/.test(declaredOutcome)
    ? "rupture"
    : /公开|谈判|组织|制度|规则|联合|请愿/.test(declaredOutcome)
      ? "reform"
      : "nudge";
  return customActionResolutionSchema.parse(
    buildCanonicalCustomResolution(turn, declaredOutcome, deviationClass),
  );
}
