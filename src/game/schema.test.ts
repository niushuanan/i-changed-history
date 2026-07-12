import { describe, expect, it } from "vitest";
import { endingFixture, turnFixture } from "../test/fixtures";
import { extractFirstJsonObject, parseAlternatePresent, parseTimelineTurn } from "./schema";

describe("structured timeline parsing", () => {
  it("extracts one JSON object through markdown noise and braces inside strings", () => {
    const raw = `答复如下\n\`\`\`json\n${JSON.stringify(turnFixture)}\n\`\`\`\n结束`;
    expect(JSON.parse(extractFirstJsonObject(raw))).toEqual(turnFixture);
  });

  it("parses a valid turn and clamps world metrics", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      metrics: { stability: 132, prosperity: -5, freedom: 31.4, cost: 18 },
    });
    expect(parseTimelineTurn(raw).metrics).toEqual({
      stability: 100,
      prosperity: 0,
      freedom: 31,
      cost: 18,
    });
  });

  it("rejects a narrative longer than 150 characters", () => {
    const raw = JSON.stringify({ ...turnFixture, narrative: "史".repeat(151) });
    expect(() => parseTimelineTurn(raw)).toThrow();
  });

  it("rejects choices that are not exactly A, B, and C", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      choices: [turnFixture.choices[0], turnFixture.choices[1], turnFixture.choices[1]],
    });
    expect(() => parseTimelineTurn(raw)).toThrow();
  });

  it("requires one nudge, one reform, and one rupture with complete instant echoes", () => {
    expect(parseTimelineTurn(JSON.stringify(turnFixture)).choices.map((choice) => choice.deviationClass))
      .toEqual(["nudge", "reform", "rupture"]);

    const duplicateClass = JSON.stringify({
      ...turnFixture,
      choices: [
        turnFixture.choices[0],
        { ...turnFixture.choices[1], deviationClass: "nudge" },
        turnFixture.choices[2],
      ],
    });
    expect(() => parseTimelineTurn(duplicateClass)).toThrow();

    const incompleteEcho = JSON.stringify({
      ...turnFixture,
      choices: [
        turnFixture.choices[0],
        {
          ...turnFixture.choices[1],
          instantEcho: { ...turnFixture.choices[1].instantEcho, payer: undefined },
        },
        turnFixture.choices[2],
      ],
    });
    expect(() => parseTimelineTurn(incompleteEcho)).toThrow();
  });

  it("requires a null first-turn echo and chapters from one through five", () => {
    expect(() =>
      parseTimelineTurn(
        JSON.stringify({
          ...turnFixture,
          previousEcho: turnFixture.choices[0].instantEcho,
        }),
      ),
    ).toThrow();

    expect(() =>
      parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: 6, chapterName: "裂缝" })),
    ).toThrow();
  });

  it("requires five timeline entries, three causal chains, and three ordinary-life details", () => {
    expect(parseAlternatePresent(JSON.stringify(endingFixture))).toMatchObject({
      worldName: "公议纪元",
      plausibilityScore: 78,
    });
    expect(() =>
      parseAlternatePresent(JSON.stringify({ ...endingFixture, ordinaryLife2026: ["只有一条"] })),
    ).toThrow();
    expect(() =>
      parseAlternatePresent(
        JSON.stringify({ ...endingFixture, historyTimeline: endingFixture.historyTimeline.slice(0, 4) }),
      ),
    ).toThrow();
    expect(() =>
      parseAlternatePresent(
        JSON.stringify({ ...endingFixture, causalChains: endingFixture.causalChains.slice(0, 2) }),
      ),
    ).toThrow();
  });
});
