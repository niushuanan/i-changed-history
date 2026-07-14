import type { HistorySeed } from "../game/types";
import { formatHistoricalYear } from "./historicalYear";

export type HistoryBrowseMode = "filmstrip" | "grid";
export type HistoryPeriod = "all" | "bce" | "before-500" | "500-1499" | "1500-1899" | "after-1900";
export type HistoryRegion = "all" | "china" | "world";
export type HistoryTheme = "all" | "military" | "politics" | "economy" | "technology" | "culture";

export type HistoryFilters = {
  search: string;
  period: HistoryPeriod;
  region: HistoryRegion;
  theme: HistoryTheme;
};

export const EMPTY_FILTERS: HistoryFilters = {
  search: "",
  period: "all",
  region: "all",
  theme: "all",
};

type SelectableHistoryTheme = Exclude<HistoryTheme, "all">;

const THEMES_BY_DOMAIN: Record<string, SelectableHistoryTheme> = {
  兵变: "military",
  内战: "military",
  军令: "military",
  国防: "military",
  围城: "military",
  守城: "military",
  战争: "military",
  战役: "military",
  攻城: "military",
  海战: "military",
  登陆: "military",

  加冕: "politics",
  变法: "politics",
  国际: "politics",
  外交: "politics",
  建国: "politics",
  改革: "politics",
  政变: "politics",
  政权: "politics",
  政治: "politics",
  暗杀: "politics",
  法治: "politics",
  独立: "politics",
  统一: "politics",
  继承: "politics",
  联盟: "politics",
  解放: "politics",
  起义: "politics",
  迁都: "politics",
  革命: "politics",

  工业: "economy",
  能源: "economy",
  航海: "economy",
  贸易: "economy",
  金融: "economy",

  医学: "technology",
  技术: "technology",
  核事故: "technology",
  核危机: "technology",
  水利: "technology",
  疫病: "technology",
  科学: "technology",
  航天: "technology",
  航空: "technology",

  印刷: "culture",
  城市: "culture",
  宗教: "culture",
  文化: "culture",
  运动: "culture",
};

const FALLBACK_THEME_BY_TONE: Record<HistorySeed["visualTone"], SelectableHistoryTheme> = {
  ancient: "culture",
  exchange: "economy",
  print: "culture",
  revolution: "politics",
  industry: "technology",
  war: "military",
  space: "technology",
  digital: "technology",
};

export function themeForSeed(seed: HistorySeed): SelectableHistoryTheme {
  return THEMES_BY_DOMAIN[seed.domain] ?? FALLBACK_THEME_BY_TONE[seed.visualTone];
}

function matchesPeriod(year: number, period: HistoryPeriod): boolean {
  switch (period) {
    case "all": return true;
    case "bce": return year < 0;
    case "before-500": return year >= 0 && year < 500;
    case "500-1499": return year >= 500 && year <= 1499;
    case "1500-1899": return year >= 1500 && year <= 1899;
    case "after-1900": return year >= 1900;
  }
}

function normalizeSearch(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("zh-CN").replace(/\s+/g, "");
}

function searchableText(seed: HistorySeed): string {
  return [
    seed.eventName,
    formatHistoricalYear(seed.year),
    seed.dateLabel,
    seed.location,
    seed.role,
    seed.domain,
    seed.historicalOutcome,
    ...seed.baselineFacts,
  ].join("\n");
}

export function filterHistorySeeds(
  seeds: readonly HistorySeed[],
  filters: HistoryFilters,
): HistorySeed[] {
  const search = normalizeSearch(filters.search.trim());

  return seeds
    .filter((seed) => (
      matchesPeriod(seed.year, filters.period)
      && (filters.region === "all" || seed.perspective === filters.region)
      && (filters.theme === "all" || themeForSeed(seed) === filters.theme)
      && (!search || normalizeSearch(searchableText(seed)).includes(search))
    ))
    .sort((left, right) => left.year - right.year);
}
