import { describe, expect, it } from "vitest";
import { getFixedOpening } from "../data/fixedOpenings";
import { browseHistorySeeds } from "../data/historySeeds";
import type { DecisionChapter } from "../game/timelinePlan";
import {
  buildSoakCustomOutcome,
  buildWildSoakCustomOutcome,
  LONG_RUN_SOAK_CASES,
  selectLongRunSoakCases,
} from "./soakCases";

describe("soak custom outcomes", () => {
  it("never treats a random place anchor as a person, army, or ally", () => {
    const seed = browseHistorySeeds().find((candidate) => candidate.id === "xuanwu-gate-626")!;
    const turn = {
      ...getFixedOpening(seed),
      historicalAnchors: ["朱雀大街", "太极宫"],
    };

    const outcomes = Array.from({ length: 10 }, (_, customIndex) => buildSoakCustomOutcome(
      LONG_RUN_SOAK_CASES[0],
      0,
      customIndex,
      turn,
      seed,
    ));

    expect(outcomes.join("\n")).not.toMatch(/控制朱雀大街|解除朱雀大街的武装|与朱雀大街正式结盟/);
    expect(new Set(outcomes)).toHaveLength(10);
  });

  it("selects named histories and makes all twelve chapters custom when requested", () => {
    const selected = selectLongRunSoakCases({
      caseIds: ["china-red-cliffs", "world-rome-fire", "world-apollo"],
      limit: 3,
      allCustom: true,
    });

    expect(selected.map((item) => item.id)).toEqual([
      "china-red-cliffs",
      "world-rome-fire",
      "world-apollo",
    ]);
    selected.forEach((item) => expect(item.customChapters).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
  });

  it("builds thirty-six distinct imaginative outcomes within the real client limit", () => {
    const selected = selectLongRunSoakCases({
      caseIds: ["china-red-cliffs", "world-rome-fire", "world-apollo"],
      limit: 3,
      allCustom: true,
    });
    const seeds = browseHistorySeeds();
    const outcomes = selected.flatMap((soakCase, runIndex) => {
      const seed = seeds.find((candidate) => candidate.id === soakCase.seedId)!;
      const opening = getFixedOpening(seed);
      return Array.from({ length: 12 }, (_, chapterIndex) => buildWildSoakCustomOutcome(
        soakCase,
        runIndex,
        chapterIndex,
        { ...opening, chapter: (chapterIndex + 1) as DecisionChapter },
        seed,
      ));
    });

    expect(outcomes).toHaveLength(36);
    expect(new Set(outcomes)).toHaveLength(36);
    expect(outcomes.every((outcome) => [...outcome].length >= 24 && [...outcome].length <= 160)).toBe(true);
    expect(outcomes.join("\n")).toMatch(/纸鹤|风筝|镜面|公民消防|开源|女兵|粮仓|移动医院/);
  });
});
