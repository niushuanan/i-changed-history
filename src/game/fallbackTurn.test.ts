import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { parseTimelineTurn } from "./schema";
import { createFallbackTurn } from "./fallbackTurn";
import { turnFixture } from "../test/fixtures";

const scenario = {
  profile: { name: "林舟", occupation: "product" as const, strengths: ["negotiation", "strategy"] as const, riskStyle: "balanced" as const },
  seed: HISTORY_SEEDS[0],
};

describe("deterministic fallback turn", () => {
  it("creates a schema-valid opening with three playable choices", () => {
    const turn = createFallbackTurn(scenario, [], 1);
    expect(() => parseTimelineTurn(JSON.stringify(turn))).not.toThrow();
    expect(turn).toMatchObject({ chapter: 1, chapterName: "历史现场", previousEcho: null });
    expect(turn.choices).toHaveLength(3);
  });

  it("carries the authoritative previous echo into a later time jump", () => {
    const previous = parseTimelineTurn(JSON.stringify(turnFixture));
    const played = [{ turn: previous, selectedChoiceId: "B" as const, selectedChoiceLabel: previous.choices[1].label, selectedDeviationClass: "reform" as const }];
    const turn = createFallbackTurn(scenario, played, 8);
    expect(turn).toMatchObject({ chapter: 8, chapterName: "百年分野", previousEcho: previous.choices[1].instantEcho });
    expect(turn.yearLabel).toContain("308");
  });
});
