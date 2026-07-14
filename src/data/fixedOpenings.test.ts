import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "./historySeeds";
import { getFixedOpening } from "./fixedOpenings";

describe("fixed first turns", () => {
  it("provides one playable, schema-valid opening for every history card", () => {
    const openings = HISTORY_SEEDS.map(getFixedOpening);

    expect(openings).toHaveLength(100);
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

  it("formats BCE opening years without exposing a negative number", () => {
    const seed = HISTORY_SEEDS.find((candidate) => candidate.id === "qin-unification-221bc");
    expect(seed).toBeDefined();
    expect(getFixedOpening(seed!).yearLabel).toContain("公元前 221 年");
    expect(getFixedOpening(seed!).yearLabel).not.toContain("-221");
  });

  it("returns stable copy for the same card", () => {
    expect(getFixedOpening(HISTORY_SEEDS[0])).toEqual(getFixedOpening(HISTORY_SEEDS[0]));
  });

  it("keeps the CERN opening objective and primary action complete through same-day publication", () => {
    const seed = HISTORY_SEEDS.find((candidate) => candidate.id === "web-public-domain-1993");
    const opening = getFixedOpening(seed!);
    const completeAction = "把万维网免费开放条款送交两位主任共同签署并当日发布";

    expect(opening.immediateObjective).toBe(completeAction);
    expect(opening.choices[0].label).toBe(completeAction);
    expect(opening.immediateObjective).toMatch(/万维网免费开放条款.*两位主任共同签署.*当日发布$/);
    expect(opening.choices[0].label).toMatch(/万维网免费开放条款.*两位主任共同签署.*当日发布$/);
  });

  it("保留苏伊士固定开场的广播同步接管命令", () => {
    const seed = HISTORY_SEEDS.find((candidate) => candidate.id === "suez-nationalization-1956");
    const opening = getFixedOpening(seed!);
    const completeAction = "在纳赛尔广播时同步发出运河公司立即接管密令";

    expect(opening.immediateObjective).toBe(completeAction);
    expect(opening.choices[0].label).toBe(completeAction);
  });

  it("keeps all 150 opening choices as complete clauses instead of slicing at 32 characters", () => {
    const openings = HISTORY_SEEDS.map(getFixedOpening);
    const labels = openings.flatMap((opening) => opening.choices.map((choice) => choice.label));
    const apollo = openings[HISTORY_SEEDS.findIndex((seed) => seed.id === "apollo-11-1969")];

    expect(labels).toHaveLength(300);
    expect(labels.every((label) => [...label].length <= 36)).toBe(true);
    expect(labels.filter((label) => /(?:的|并|，以|而非中|出资补)$/.test(label))).toEqual([]);
    expect(apollo.choices[0].label).toContain("中止登月的口令");
  });
});
