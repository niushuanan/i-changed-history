import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "./historySeeds";
import { getFixedOpening } from "./fixedOpenings";

describe("fixed first turns", () => {
  it("provides one playable, schema-valid opening for every history card", () => {
    const openings = HISTORY_SEEDS.map(getFixedOpening);

    expect(openings).toHaveLength(50);
    for (const [index, opening] of openings.entries()) {
      const seed = HISTORY_SEEDS[index];
      expect(opening).toMatchObject({
        chapter: 1,
        generationSource: "fixed",
        location: seed.location,
        role: seed.role,
        previousEcho: null,
      });
      expect(opening.choices.map((choice) => choice.id)).toEqual(["A", "B", "C"]);
      expect(opening.choices.map((choice) => choice.deviationClass)).toEqual(["nudge", "reform", "rupture"]);
      expect(opening.narrative.match(/[。！？!?]/g)).toHaveLength(3);
    }
  });

  it("returns stable copy for the same card", () => {
    expect(getFixedOpening(HISTORY_SEEDS[0])).toEqual(getFixedOpening(HISTORY_SEEDS[0]));
  });
});
