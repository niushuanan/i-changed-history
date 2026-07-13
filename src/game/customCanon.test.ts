import { describe, expect, it } from "vitest";
import { buildTravelerProfile } from "./profile";
import { buildCanonicalCustomResolution } from "./customCanon";
import { parseTimelineTurn } from "./schema";
import { turnFixture } from "../test/fixtures";

const profile = buildTravelerProfile({ energy: "I", perception: "N", judgment: "T", tactics: "P" });
const turn = parseTimelineTurn(JSON.stringify(turnFixture));

describe("player-authored canonical history", () => {
  it.each([
    "皇帝被我毒死",
    "我建立了共和国",
    "改革成功，但未能惠及乡村",
    "政变失败",
  ])("never interprets or changes the declared result: %s", (outcome) => {
    const result = buildCanonicalCustomResolution(profile, turn, outcome, "rupture");
    expect(result.declaredOutcome).toBe(outcome);
    expect(result.instantEcho.directResult).toBe(outcome);
    expect(result.canonStatus).toBe("玩家钦定");
    expect(result.personalityLens).toContain("INTP");
  });
});
