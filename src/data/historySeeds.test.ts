import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { browseHistorySeeds, HISTORY_SEEDS } from "./historySeeds";
import { historyAssetForSeed } from "./visualAssets";


describe("famous historical moment deck", () => {
  it("contains exactly sixty Chinese and forty world moments across BCE and CE", () => {
    expect(HISTORY_SEEDS).toHaveLength(100);
    expect(new Set(HISTORY_SEEDS.map((seed) => seed.id)).size).toBe(100);
    expect(HISTORY_SEEDS.some((seed) => seed.year < 0)).toBe(true);
    expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "china")).toHaveLength(60);
    expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "world")).toHaveLength(40);

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
      expect(existsSync(join(process.cwd(), "public/assets/history", `${seed.id}.webp`))).toBe(true);
    }
  });

  it("includes famous Chinese and global pivot points from antiquity to the modern era", () => {
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
      "qin-unification-221bc",
      "wuchang-1911",
      "marathon-490bc",
      "soviet-dissolution-1991",
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

  it("keeps reviewed historical anchors precise instead of importing later institutions", () => {
    expect(HISTORY_SEEDS.find((seed) => seed.id === "shang-yang-356bc")).toMatchObject({
      decision: expect.stringContaining("什伍连坐与军功授爵"),
    });
    expect(HISTORY_SEEDS.find((seed) => seed.id === "shang-yang-356bc")?.decision).not.toContain("县制");

    const blackDeath = HISTORY_SEEDS.find((seed) => seed.id === "black-death-1347");
    expect(`${blackDeath?.location}${blackDeath?.role}${blackDeath?.decision}`).not.toMatch(/检疫|隔离制度|港务会/);
    expect(blackDeath?.historicalOutcome).toContain("驱逐");

    const oilCrisis = HISTORY_SEEDS.find((seed) => seed.id === "oil-crisis-1973");
    expect(oilCrisis?.decision).toContain("减产5%");
    expect(oilCrisis?.decision).not.toContain("禁运");
    expect(oilCrisis?.historicalOutcome).toMatch(/10月17日.*减产.*随后.*禁运/);
  });

  it("gives ceremonial and technical milestones a consequential immediate lever", () => {
    expect(HISTORY_SEEDS.find((seed) => seed.id === "prc-founded-1949")?.decision).toMatch(/带实弹|迎击/);
    expect(HISTORY_SEEDS.find((seed) => seed.id === "circumnavigation-1522")?.decision).toMatch(/抛弃.*香料|减轻吃水/);
    expect(HISTORY_SEEDS.find((seed) => seed.id === "un-charter-1945")?.decision).toMatch(/否决权.*拒绝签署|拒绝.*否决权/);
    expect(HISTORY_SEEDS.find((seed) => seed.id === "sputnik-1957")?.decision).toMatch(/延长.*燃烧|稳定轨道/);
  });

  it("always exposes all one hundred moments in chronological order", () => {
    const moments = browseHistorySeeds();
    expect(moments).toHaveLength(100);
    expect(moments.map((seed) => seed.year)).toEqual([...moments.map((seed) => seed.year)].sort((a, b) => a - b));
  });
});
