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

  it("keeps all 150 opening choices as complete clauses instead of slicing at 32 characters", () => {
    const openings = HISTORY_SEEDS.map(getFixedOpening);
    const labels = openings.flatMap((opening) => opening.choices.map((choice) => choice.label));
    const apollo = openings[HISTORY_SEEDS.findIndex((seed) => seed.id === "apollo-11-1969")];

    expect(labels).toHaveLength(150);
    expect(labels.every((label) => [...label].length <= 36)).toBe(true);
    expect(labels.filter((label) => /(?:的|并|，以|而非中|出资补)$/.test(label))).toEqual([]);
    expect(apollo.choices[0].label).toContain("中止登月的口令");
  });
});
