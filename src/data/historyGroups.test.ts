import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "./historySeeds";
import {
  HISTORY_GROUPS,
  historyGroupForSeed,
  seedsForHistoryGroup,
} from "./historyGroups";

describe("history group catalogue", () => {
  it("covers all one hundred histories exactly once across thirteen groups", () => {
    const groupedSeedIds = HISTORY_GROUPS.flatMap((group) => group.seedIds);

    expect(HISTORY_GROUPS).toHaveLength(13);
    expect(HISTORY_GROUPS.filter((group) => group.region === "china")).toHaveLength(9);
    expect(HISTORY_GROUPS.filter((group) => group.region === "world")).toHaveLength(4);
    expect(groupedSeedIds).toHaveLength(100);
    expect(new Set(groupedSeedIds).size).toBe(100);
    expect([...groupedSeedIds].sort()).toEqual(
      HISTORY_SEEDS.map((seed) => seed.id).sort(),
    );
  });

  it("places both spec remainder histories into the Cold War group", () => {
    expect(historyGroupForSeed("sputnik-1957")?.id).toBe("cold-war-contemporary");
    expect(historyGroupForSeed("web-public-domain-1993")?.id).toBe("cold-war-contemporary");
  });

  it("resolves each group to its intentionally ordered seed records", () => {
    const threeKingdoms = HISTORY_GROUPS.find((group) => group.id === "three-kingdoms");

    expect(threeKingdoms).toBeDefined();
    expect(seedsForHistoryGroup(threeKingdoms!).map((seed) => seed.id)).toEqual(
      threeKingdoms!.seedIds,
    );
  });
});
