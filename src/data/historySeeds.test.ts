import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS, dealHistorySeeds } from "./historySeeds";

const eras = ["ancient", "medieval", "early-modern", "industrial", "modern"] as const;

describe("historical seed deck", () => {
  it("contains fifty balanced and complete seeds", () => {
    expect(HISTORY_SEEDS).toHaveLength(50);

    for (const era of eras) {
      expect(HISTORY_SEEDS.filter((seed) => seed.era === era)).toHaveLength(10);
    }

    expect(HISTORY_SEEDS.every((seed) => seed.baselineFacts.length === 3)).toBe(true);
    expect(new Set(HISTORY_SEEDS.map((seed) => seed.id)).size).toBe(50);
  });

  it("contains no China-related card from 1840 onward", () => {
    const forbidden = HISTORY_SEEDS.filter((seed) => seed.chinaRelated && seed.year >= 1840);
    expect(forbidden).toEqual([]);
  });

  it("anchors the 1973 OAPEC embargo decision in Kuwait", () => {
    expect(HISTORY_SEEDS.find((seed) => seed.id === "oapec-oil-embargo")).toMatchObject({
      year: 1973,
      location: "科威特城，科威特",
      baselineFacts: [
        "1973年10月OAPEC部长在科威特城举行会议",
        "与会国决定立即削减石油产量",
        "会议声明以供应限制施压支持以色列的国家",
      ],
    });
  });

  it("anchors Asante state consolidation around the 1701 Kumasi turning point", () => {
    expect(HISTORY_SEEDS.find((seed) => seed.id === "asante-confederacy")).toMatchObject({
      year: 1701,
      location: "库马西，今加纳",
      baselineFacts: [
        "奥塞图图将阿散蒂诸邦组织为联盟",
        "阿散蒂在1701年击败登基拉并扩大影响",
        "库马西成为联盟的政治中心",
      ],
    });
  });

  it("deals one card from every era without immediate repeats", () => {
    const first = dealHistorySeeds([], () => 0.25);
    const second = dealHistorySeeds(first.map((seed) => seed.id), () => 0.25);

    expect(first).toHaveLength(5);
    expect(new Set(first.map((seed) => seed.era))).toEqual(new Set(eras));
    expect(second.some((seed) => first.some((prior) => prior.id === seed.id))).toBe(false);
  });

  it("does not mutate the source deck while dealing", () => {
    const originalIds = HISTORY_SEEDS.map((seed) => seed.id);

    dealHistorySeeds([], () => 0.75);

    expect(HISTORY_SEEDS.map((seed) => seed.id)).toEqual(originalIds);
  });
});
