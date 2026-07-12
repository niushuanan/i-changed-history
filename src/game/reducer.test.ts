import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { parseTimelineTurn } from "./schema";
import { createInitialGameState, gameReducer } from "./reducer";
import type { TravelerProfile } from "./types";

const profile: TravelerProfile = {
  name: "林舟",
  occupation: "product",
  strengths: ["negotiation", "strategy"],
  riskStyle: "balanced",
};
const turn = parseTimelineTurn(JSON.stringify(turnFixture));

describe("profile-first choice-only game reducer", () => {
  it("starts in profiling and requires a profile before a historical moment", () => {
    const initial = createInitialGameState();
    expect(initial.phase).toBe("profiling");

    const ignored = gameReducer(initial, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    expect(ignored).toBe(initial);

    const selecting = gameReducer(initial, { type: "SET_PROFILE", profile });
    expect(selecting.phase).toBe("selecting");
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    expect(started.scenario).toEqual({ profile, seed: HISTORY_SEEDS[0] });
    expect(started.request?.kind).toBe("opening");
  });

  it("records only one of the generated choices", () => {
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const event = gameReducer(started, {
      type: "OPENING_RESOLVED",
      requestId: started.request!.id,
      turn,
    });
    const chosen = gameReducer(event, { type: "COMMIT_AI_CHOICE", choiceId: "B" });
    expect(chosen.playedTurns).toHaveLength(1);
    expect(chosen.playedTurns[0].selectedChoiceId).toBe("B");
    expect(chosen.playedTurns[0]).not.toHaveProperty("customIntervention");
  });

  it("restarts with the same profile and can explicitly change traveler", () => {
    const selecting = gameReducer(createInitialGameState(), { type: "SET_PROFILE", profile });
    const started = gameReducer(selecting, { type: "START_SCENARIO", seed: HISTORY_SEEDS[0] });
    const restarted = gameReducer(started, { type: "RESTART" });
    expect(restarted.phase).toBe("selecting");
    expect(restarted.profile).toEqual(profile);

    const changed = gameReducer(restarted, { type: "CHANGE_PROFILE" });
    expect(changed.phase).toBe("profiling");
    expect(changed.profile).toBeNull();
  });
});
