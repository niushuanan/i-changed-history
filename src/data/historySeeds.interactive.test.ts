import { describe, expect, it } from "vitest";
import {
  browseHistorySeeds,
  HISTORY_SEEDS,
  INTERACTIVE_REVIEW_HISTORY_IDS,
} from "./historySeeds/interactive";

describe("Interactive Space review history catalogue", () => {
  it("contains only the three approved low-sensitivity scripts", () => {
    expect(INTERACTIVE_REVIEW_HISTORY_IDS).toEqual([
      "gutenberg-bible-1455",
      "galileo-1610",
      "apollo-11-1969",
    ]);
    expect(HISTORY_SEEDS.map(({ id }) => id)).toEqual(INTERACTIVE_REVIEW_HISTORY_IDS);
    expect(HISTORY_SEEDS.every(({ perspective }) => perspective === "world")).toBe(true);
  });

  it("keeps the review catalogue chronological", () => {
    expect(browseHistorySeeds().map(({ id }) => id)).toEqual(INTERACTIVE_REVIEW_HISTORY_IDS);
  });
});
