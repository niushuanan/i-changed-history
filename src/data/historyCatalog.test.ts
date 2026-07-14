import { describe, expect, it } from "vitest";
import type { HistorySeed } from "../game/types";
import { HISTORY_SEEDS } from "./historySeeds";
import {
  EMPTY_FILTERS,
  filterHistorySeeds,
  themeForSeed,
  type HistoryFilters,
  type HistoryPeriod,
  type HistoryRegion,
  type HistoryTheme,
} from "./historyCatalog";

const seed = (overrides: Partial<HistorySeed>): HistorySeed => ({
  ...HISTORY_SEEDS[0],
  id: overrides.id ?? crypto.randomUUID(),
  ...overrides,
});

describe("historyCatalog", () => {
  it("exposes empty filters for the complete catalog", () => {
    expect(EMPTY_FILTERS).toEqual({
      search: "",
      period: "all",
      region: "all",
      theme: "all",
    } satisfies HistoryFilters);
  });

  it.each<[{ period: HistoryPeriod; year: number }, boolean]>([
    [{ period: "bce", year: -1 }, true],
    [{ period: "bce", year: 1 }, false],
    [{ period: "before-500", year: 0 }, true],
    [{ period: "before-500", year: 499 }, true],
    [{ period: "before-500", year: 500 }, false],
    [{ period: "500-1499", year: 500 }, true],
    [{ period: "500-1499", year: 1499 }, true],
    [{ period: "500-1499", year: 1500 }, false],
    [{ period: "1500-1899", year: 1500 }, true],
    [{ period: "1500-1899", year: 1899 }, true],
    [{ period: "1500-1899", year: 1900 }, false],
    [{ period: "after-1900", year: 1900 }, true],
    [{ period: "after-1900", year: 2026 }, true],
    [{ period: "after-1900", year: 1899 }, false],
  ])("filters period $period at year $year", ({ period, year }, included) => {
    const candidate = seed({ id: `${period}-${year}`, year });

    expect(filterHistorySeeds([candidate], { ...EMPTY_FILTERS, period })).toHaveLength(included ? 1 : 0);
  });

  it.each<[{ region: HistoryRegion; perspective: HistorySeed["perspective"] }, boolean]>([
    [{ region: "china", perspective: "china" }, true],
    [{ region: "china", perspective: "world" }, false],
    [{ region: "world", perspective: "world" }, true],
    [{ region: "world", perspective: "china" }, false],
  ])("filters region $region against $perspective seeds", ({ region, perspective }, included) => {
    const candidate = seed({ perspective, chinaRelated: perspective === "china" });

    expect(filterHistorySeeds([candidate], { ...EMPTY_FILTERS, region })).toHaveLength(included ? 1 : 0);
  });

  it.each([
    ["event name", "赤壁火攻前夜", { eventName: "赤壁火攻前夜" }],
    ["formatted year", "公元前 221 年", { year: -221 }],
    ["date", "1900年仲夏", { dateLabel: "1900年仲夏" }],
    ["location", "杭州西湖", { location: "杭州西湖" }],
    ["role", "NASA Flight Director", { role: "NASA Flight Director" }],
    ["domain", "Industrial Policy", { domain: "Industrial Policy" }],
    ["historical outcome", "蒸汽机改变了生产", { historicalOutcome: "蒸汽机改变了生产" }],
    ["baseline facts", "活字排印", { baselineFacts: ["事实一", "活字排印", "事实三"] }],
  ] as const)("searches the %s field", (_label, query, overrides) => {
    const match = seed({ id: "match", ...overrides });
    const miss = seed({
      id: "miss",
      eventName: "无关事件",
      year: 123,
      dateLabel: "某日",
      location: "别处",
      role: "无关角色",
      domain: "无关领域",
      historicalOutcome: "无关结果",
      baselineFacts: ["甲", "乙", "丙"],
    });

    expect(filterHistorySeeds([miss, match], { ...EMPTY_FILTERS, search: query })).toEqual([match]);
  });

  it("trims search and compares Latin text case-insensitively", () => {
    const match = seed({ role: "NASA Flight Director" });

    expect(filterHistorySeeds([match], { ...EMPTY_FILTERS, search: "  nasa flight  " })).toEqual([match]);
  });

  it("combines search, period, region, and theme with AND", () => {
    const match = seed({ id: "match", year: 208, perspective: "china", chinaRelated: true, eventName: "赤壁火攻", domain: "战争" });
    const wrongRegion = seed({ id: "wrong-region", year: 208, perspective: "world", chinaRelated: false, eventName: "赤壁火攻", domain: "战争" });
    const wrongPeriod = seed({ id: "wrong-period", year: 1908, perspective: "china", chinaRelated: true, eventName: "赤壁火攻", domain: "战争" });
    const wrongTheme = seed({ id: "wrong-theme", year: 208, perspective: "china", chinaRelated: true, eventName: "赤壁火攻", domain: "科学" });

    expect(filterHistorySeeds([wrongTheme, wrongPeriod, wrongRegion, match], {
      search: "赤壁",
      period: "before-500",
      region: "china",
      theme: "military",
    })).toEqual([match]);
  });

  it("returns a new chronological array without modifying its input", () => {
    const later = seed({ id: "later", year: 1900 });
    const earlier = seed({ id: "earlier", year: -100 });
    const input = [later, earlier];

    const result = filterHistorySeeds(input, EMPTY_FILTERS);

    expect(result).toEqual([earlier, later]);
    expect(result).not.toBe(input);
    expect(input).toEqual([later, earlier]);
  });

  it("maps all 100 history nodes to a selectable theme", () => {
    const selectableThemes: readonly HistoryTheme[] = ["military", "politics", "economy", "technology", "culture"];

    expect(HISTORY_SEEDS).toHaveLength(100);
    for (const candidate of HISTORY_SEEDS) {
      expect(selectableThemes, candidate.id).toContain(themeForSeed(candidate));
    }
  });
});
