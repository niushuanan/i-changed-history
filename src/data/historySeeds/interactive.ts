import type { HistorySeed } from "../../game/types";
import apollo11 from "./scripts/apollo-11-1969";
import galileo from "./scripts/galileo-1610";
import gutenberg from "./scripts/gutenberg-bible-1455";

export const INTERACTIVE_REVIEW_HISTORY_IDS = [
  "gutenberg-bible-1455",
  "galileo-1610",
  "apollo-11-1969",
] as const;

export const HISTORY_SEEDS: readonly HistorySeed[] = [
  gutenberg,
  galileo,
  apollo11,
];

export function browseHistorySeeds(): HistorySeed[] {
  return [...HISTORY_SEEDS].sort((left, right) => left.year - right.year || left.eventName.localeCompare(right.eventName, "zh-CN"));
}
