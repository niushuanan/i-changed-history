import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "./historySeeds";
import {
  getFixedOpening,
  getFixedOpeningPowerIds,
  getFixedPowerChoicePool,
} from "./fixedOpenings";
import { FIXED_OPENING_CHOICES } from "./fixedOpeningChoices.generated";
import {
  containsInternalPlayerCopy,
  localizeInternalPlayerCopy,
} from "../game/playerFacingText";

const removedProtagonistPattern = /(?:你|玩家|主角)(?!的).{0,8}(?:被|遭).{0,8}(?:处死|斩首|杀死|击毙|杀害)|(?:你|玩家|主角)(?!的)(?:本人)?(?:当场|随后|最终|立即|会|将)?(?:死亡|身亡|丧命|殒命|自尽|失去意识|终身监禁|终身囚禁)|(?:处死|斩首|杀死|击毙)(?:了)?(?:你|玩家|主角)(?!的)/;

function clean(value: string): string {
  return localizeInternalPlayerCopy(value)
    .replace(/[。！？!?；;]+/g, "，")
    .replace(/，+/g, "，")
    .replace(/^，|，$/g, "")
    .trim();
}

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
      expect(opening.narrative.match(/[。！？!?]/g)?.length).toBeGreaterThanOrEqual(5);
      expect(opening.narrative).not.toMatch(/[，、的并以而于]。$/);
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

  it("keeps every AI-authored trajectory complete instead of clipping its final command", () => {
    for (const seed of HISTORY_SEEDS) {
      const entry = FIXED_OPENING_CHOICES[seed.id as keyof typeof FIXED_OPENING_CHOICES];
      expect(getFixedOpening(seed).immediateObjective).toBe(clean(entry.trajectory.historicalPath));
    }
  });

  it("keeps all opening card details as complete canonical clauses", () => {
    const openings = HISTORY_SEEDS.map((seed) => getFixedOpening(seed));
    const labels = openings.flatMap((opening) => opening.choices.map((choice) => choice.label));
    const allChoices = openings.flatMap((opening) => [...opening.choices, ...opening.rollChoices]);

    expect(labels).toHaveLength(300);
    expect(labels.every((label) => label.trim().length > 0)).toBe(true);
    expect(labels.filter((label) => /(?:的|并|，以|而非中|出资补)$/.test(label))).toEqual([]);
    expect(allChoices.every((choice) => [...choice.displayLabel].length >= 4 && [...choice.displayLabel].length <= 16)).toBe(true);
    expect(allChoices.filter((choice) => /夺取现场解释权|照史推进原定命令|压到最后一刻|撕令夺权/.test(
      `${choice.displayLabel}${choice.label}`,
    ))).toEqual([]);
  });

  it("never exposes schema labels or English power IDs in fixed player copy", () => {
    for (const seed of HISTORY_SEEDS) {
      const opening = getFixedOpening(seed);
      const visibleCopy = [
        opening.headline,
        opening.narrative,
        opening.immediateObjective,
        opening.timePressure,
        opening.baselineAnchor,
        ...opening.historicalAnchors,
        ...[...opening.choices, ...opening.rollChoices].flatMap((choice) => [
          choice.displayLabel,
          choice.label,
          choice.actionSpec.actor,
          choice.actionSpec.action,
          choice.actionSpec.target,
          choice.actionSpec.deadline,
          choice.instantEcho.directResult,
          choice.instantEcho.unexpectedCost,
          choice.instantEcho.beneficiary,
          choice.instantEcho.payer,
        ]),
      ];

      expect(visibleCopy.filter(containsInternalPlayerCopy)).toEqual([]);
    }
  });

  it("makes A preserve actual history, B change it, and both act through the player", () => {
    for (const seed of HISTORY_SEEDS) {
      const entry = FIXED_OPENING_CHOICES[seed.id as keyof typeof FIXED_OPENING_CHOICES];
      const [firstA, firstB] = entry.choices;
      const [rolledA, rolledB] = entry.rollChoices;

      expect(entry.trajectory.preservedResult).toBe(seed.historicalOutcome);
      expect([firstA.id, firstB.id, rolledA.id, rolledB.id]).toEqual(["A", "B", "A", "B"]);
      expect([firstA.deviationClass, firstB.deviationClass, rolledA.deviationClass, rolledB.deviationClass])
        .toEqual(["nudge", "reform", "nudge", "reform"]);
      expect([firstA, firstB, rolledA, rolledB].every(
        (choice) => choice.actionSpec.actor === "你" && !("powerId" in choice),
      )).toBe(true);
      expect(firstA.label).not.toBe(rolledA.label);
      expect(firstB.label).not.toBe(rolledB.label);
      expect([firstA, firstB, rolledA, rolledB].filter((choice) => removedProtagonistPattern.test(
        [
          choice.instantEcho.directResult,
          choice.instantEcho.unexpectedCost,
          choice.instantEcho.payer,
        ].join("；"),
      ))).toEqual([]);
    }
  });

  it("regresses the two clearest trajectory traps: Shanhai Pass and Apollo 11", () => {
    const shanhai = getFixedOpening(
      HISTORY_SEEDS.find((candidate) => candidate.id === "shanhai-pass-1644")!,
    );
    const apollo = getFixedOpening(
      HISTORY_SEEDS.find((candidate) => candidate.id === "apollo-11-1969")!,
    );

    expect(`${shanhai.choices[0].label}${shanhai.choices[0].instantEcho.directResult}`)
      .toMatch(/吴三桂|多尔衮/);
    expect(`${shanhai.choices[0].label}${shanhai.choices[0].instantEcho.directResult}`)
      .toMatch(/清军.*入关|入关.*清军/);
    expect(`${shanhai.choices[1].label}${shanhai.choices[1].instantEcho.directResult}`)
      .toMatch(/拒绝清军|拒关外|不得入关|不准入关/);
    expect(`${apollo.choices[0].label}${apollo.choices[0].instantEcho.directResult}`)
      .toMatch(/1202/);
    expect(`${apollo.choices[0].label}${apollo.choices[0].instantEcho.directResult}`)
      .toMatch(/继续下降|成功着陆|完成.*登月/);
    expect(`${apollo.choices[1].label}${apollo.choices[1].instantEcho.directResult}`)
      .not.toBe(`${apollo.choices[0].label}${apollo.choices[0].instantEcho.directResult}`);
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
