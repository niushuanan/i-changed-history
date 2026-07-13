import { describe, expect, it } from "vitest";
import { browseHistorySeeds, HISTORY_SEEDS, recommendHistorySeeds } from "./historySeeds";
import type { TravelerProfile } from "../game/types";
import { buildTravelerProfile } from "../game/profile";
import { historyAssetForSeed } from "./visualAssets";

const profile: TravelerProfile = buildTravelerProfile({ energy: "E", perception: "N", judgment: "F", tactics: "J" });

describe("famous historical moment deck", () => {
  it("contains exactly thirty Chinese and twenty world AD moments", () => {
    expect(HISTORY_SEEDS).toHaveLength(50);
    expect(new Set(HISTORY_SEEDS.map((seed) => seed.id)).size).toBe(50);
    expect(HISTORY_SEEDS.every((seed) => seed.year > 0)).toBe(true);
    expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "china")).toHaveLength(30);
    expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "world")).toHaveLength(20);

    for (const seed of HISTORY_SEEDS) {
      expect(seed.baselineFacts).toHaveLength(3);
      expect(seed.dateLabel.trim()).not.toBe("");
      expect(seed.eventName.trim()).not.toBe("");
      expect(seed.role.trim()).not.toBe("");
      expect(seed.decision.trim()).not.toBe("");
      expect(seed.urgency.trim()).not.toBe("");
      expect(seed.historicalOutcome.trim()).not.toBe("");
      expect(seed.strengthTags.length).toBeGreaterThan(0);
      expect(historyAssetForSeed(seed)).toBe(`/assets/history/${seed.id}.webp`);
    }
  });

  it("keeps Chinese moments before 1840 and includes globally famous pivot points", () => {
    expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "china" && seed.year >= 1840))
      .toEqual([]);
    expect(HISTORY_SEEDS.map((seed) => seed.id)).toEqual(expect.arrayContaining([
      "red-cliffs-208",
      "dong-zhuo-lu-bu-190",
      "guandu-wuchao-200",
      "jieting-228",
      "xuanwu-gate-626",
      "tumu-crisis-1449",
      "newton-principia-1687",
      "sarajevo-1914",
      "roosevelt-bank-holiday-1933",
      "cuban-missile-1962",
      "apollo-11-1969",
      "berlin-wall-1989",
    ]));
  });

  it("replaces specialist western entries with familiar public-history anchors", () => {
    const ids = HISTORY_SEEDS.map((seed) => seed.id);

    expect(ids).toEqual(expect.arrayContaining([
      "lincoln-emancipation-1862",
      "october-revolution-1917",
      "hitler-poland-1939",
      "stalin-moscow-1941",
      "normandy-1944",
    ]));
    expect(ids).not.toEqual(expect.arrayContaining([
      "teutoburg-9",
      "clermont-1095",
      "fourth-crusade-1204",
      "sekigahara-1600",
      "vienna-1683",
    ]));
  });

  it("anchors Sarajevo to a concrete role, route decision, and actual outcome", () => {
    expect(HISTORY_SEEDS.find((seed) => seed.id === "sarajevo-1914")).toMatchObject({
      dateLabel: "1914年6月28日",
      location: "萨拉热窝，拉丁桥附近",
      role: "塞尔维亚总理大臣帕希奇的特别联络员",
      decision: "是否立即拦下车队，阻止其再次驶入刚刚发生未遂爆炸的街区",
      historicalOutcome: "车队按错误路线驶近拉丁桥，普林西普枪杀斐迪南大公夫妇，危机在一个月内演变为第一次世界大战。",
    });
  });

  it("recommends a stable five-card set with China and world balance", () => {
    const first = recommendHistorySeeds(profile);
    const second = recommendHistorySeeds(profile);

    expect(first.map((seed) => seed.id)).toEqual(second.map((seed) => seed.id));
    expect(first).toHaveLength(5);
    expect(first.filter((seed) => seed.perspective === "china").length).toBeGreaterThanOrEqual(2);
    expect(first.filter((seed) => seed.perspective === "world").length).toBeGreaterThanOrEqual(2);
  });

  it("changes recommendations when modern strengths change", () => {
    const technical: TravelerProfile = {
      ...profile,
      occupation: "engineering",
      strengths: ["technology", "strategy"],
    };

    expect(recommendHistorySeeds(technical).map((seed) => seed.id))
      .not.toEqual(recommendHistorySeeds(profile).map((seed) => seed.id));
  });

  it("keeps every moment available regardless of traveler profile", () => {
    const technical: TravelerProfile = buildTravelerProfile({ energy: "I", perception: "S", judgment: "T", tactics: "J" });

    expect(browseHistorySeeds(profile).map((seed) => seed.id).sort())
      .toEqual(browseHistorySeeds(technical).map((seed) => seed.id).sort());
    expect(browseHistorySeeds(profile)).toHaveLength(50);
  });
});
