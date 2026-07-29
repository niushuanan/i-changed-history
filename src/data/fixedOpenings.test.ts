import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "./historySeeds";
import {
  getFixedOpening,
  getFixedOpeningPowerIds,
  getFixedPowerChoicePool,
} from "./fixedOpenings";

describe("fixed first turns", () => {
  it("provides one playable, schema-valid opening for every history card", () => {
    const openings = HISTORY_SEEDS.map((seed) => getFixedOpening(seed));

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
      expect(opening.rollChoices.map((choice) => choice.id)).toEqual(["A", "B", "C"]);
      expect(opening.rollChoices.map((choice) => choice.deviationClass)).toEqual(["nudge", "reform", "rupture"]);
      expect([...opening.choices, ...opening.rollChoices]).toHaveLength(6);
      expect([...opening.choices, ...opening.rollChoices].every(
        (choice) => [...choice.displayLabel].length <= 16,
      )).toBe(true);
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

  it("keeps all opening card details as complete canonical clauses", () => {
    const openings = HISTORY_SEEDS.map((seed) => getFixedOpening(seed));
    const labels = openings.flatMap((opening) => opening.choices.map((choice) => choice.label));
    const allChoices = openings.flatMap((opening) => [...opening.choices, ...opening.rollChoices]);
    const apollo = openings[HISTORY_SEEDS.findIndex((seed) => seed.id === "apollo-11-1969")];

    expect(labels).toHaveLength(300);
    expect(labels.every((label) => label.trim().length > 0)).toBe(true);
    expect(labels.filter((label) => /(?:的|并|，以|而非中|出资补)$/.test(label))).toEqual([]);
    expect(allChoices.every((choice) => [...choice.displayLabel].length >= 4 && [...choice.displayLabel].length <= 16)).toBe(true);
    expect(allChoices.filter((choice) => /夺取现场解释权|照史推进原定命令|压到最后一刻|撕令夺权/.test(
      `${choice.displayLabel}${choice.label}`,
    ))).toEqual([]);
    expect(apollo.choices[0].label).toContain("中止登月的口令");
  });

  it("grounds every fixed opening card in the assigned historical role instead of generic followers", () => {
    const wu = HISTORY_SEEDS.find((candidate) => candidate.id === "wu-zetian-690")!;
    const opening = getFixedOpening(wu);
    const allChoices = [...opening.choices, ...opening.rollChoices];

    expect(allChoices.filter((choice) => choice.id !== "C").every(
      (choice) => choice.actionSpec.actor.includes(opening.role.slice(0, 18)),
    )).toBe(true);
    expect(allChoices.filter((choice) => choice.id === "C").every(
      (choice) => choice.actionSpec.actor === "你" && Boolean(choice.powerId),
    )).toBe(true);
    expect(allChoices.map((choice) => choice.actionSpec.actor).join(" ")).not.toMatch(
      /你与负责执行的人|你与愿意跟随的人|你与两名现场见证人|你与支持改令的人/,
    );
    expect(opening.choices[1].label).toContain("武则天称帝");
    expect(opening.rollChoices[0].label).toContain("武则天称帝");
    expect(opening.rollChoices[1].label).toContain("武则天称帝");
    expect([
      opening.choices[1].displayLabel,
      opening.rollChoices[0].displayLabel,
      opening.rollChoices[1].displayLabel,
    ].every((label) => /武则天|称帝/.test(label))).toBe(true);
    expect(opening.choices[2].label).toMatch(/武则天|武后|洛阳|神都|则天|李旦/);
  });

  it("owns six distinct, concrete AI-authored power choices for every fixed history snapshot", () => {
    for (const seed of HISTORY_SEEDS) {
      const pool = getFixedPowerChoicePool(seed);
      const powerIds = getFixedOpeningPowerIds(seed);

      expect(pool).toHaveLength(6);
      expect(new Set(powerIds)).toHaveProperty("size", 6);
      expect(pool.every((choice) => (
        choice.id === "C"
        && choice.deviationClass === "rupture"
        && choice.actionSpec.actor === "你"
        && Boolean(choice.powerId)
      ))).toBe(true);
      expect(pool.map((choice) => `${choice.displayLabel}${choice.label}`).join(" ")).not.toMatch(
        /让谎言现形|历史现场|被迫说真话|唤醒器物作证|改变历史走向|重塑秩序/,
      );
      powerIds.forEach((powerId, index) => {
        const pairedPowerId = powerIds[(index + 1) % powerIds.length];
        expect(() => getFixedOpening(seed, [powerId, pairedPowerId])).not.toThrow();
      });
    }
  });

  it("builds the opening with the exact two client-assigned powers", () => {
    const seed = HISTORY_SEEDS.find((candidate) => candidate.id === "apollo-11-1969")!;
    const candidateIds = getFixedOpeningPowerIds(seed);
    const assigned = [candidateIds[4], candidateIds[2]] as const;
    const opening = getFixedOpening(seed, assigned);

    expect(opening.choices[2].powerId).toBe(assigned[0]);
    expect(opening.rollChoices[2].powerId).toBe(assigned[1]);
    expect(opening.choices[2].actionSpec.actor).toBe("你");
    expect(opening.rollChoices[2].actionSpec.actor).toBe("你");
  });
});
