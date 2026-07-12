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

  it("truncates an overlong narrative instead of interrupting gameplay", () => {
    const raw = JSON.stringify({ ...turnFixture, narrative: "史".repeat(151) });
    expect(parseTimelineTurn(raw).narrative).toHaveLength(150);
  });

  it("strips harmless extra model fields", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      modelComment: "extra",
      choices: turnFixture.choices.map((choice) => ({ ...choice, forecast: "extra" })),
    });
    expect(parseTimelineTurn(raw)).not.toHaveProperty("modelComment");
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

  it("requires a null first-turn echo and accepts decision chapters one through eleven", () => {
    expect(() =>
      parseTimelineTurn(
        JSON.stringify({
          ...turnFixture,
          previousEcho: turnFixture.choices[0].instantEcho,
        }),
      ),
    ).toThrow();

    expect(() =>
      parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: 11, chapterName: "终局前夜", previousEcho: turnFixture.choices[0].instantEcho })),
    ).not.toThrow();

    expect(() =>
      parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: 12, chapterName: "平行 2026" })),
    ).toThrow();
  });

  it("normalizes the stable V4-flash formatting drift seen in real opening turns", () => {
    const drifted = {
      ...turnFixture,
      baselineAnchor: [turnFixture.baselineAnchor, "继业者尚未分割帝国。"],
      choices: turnFixture.choices.map((choice, index) => ({
        label: `${["A", "B", "C"][index]}. ${choice.label}`,
        intent: choice.deviationClass,
        instantEcho: choice.instantEcho,
      })),
      memorySummary: [turnFixture.memorySummary],
      causalLedger: [
        { fact: "巴比伦的继承危机", causedByChapter: 0, mustAffect: "帝国合法性" },
      ],
      callbackUsed: false,
      visualTone: ["ancient", "exchange"],
    };

    const parsed = parseTimelineTurn(JSON.stringify(drifted));
    expect(parsed.baselineAnchor).toContain("继业者");
    expect(parsed.choices).toMatchObject([
      { id: "A", label: turnFixture.choices[0].label, deviationClass: "nudge" },
      { id: "B", label: turnFixture.choices[1].label, deviationClass: "reform" },
      { id: "C", label: turnFixture.choices[2].label, deviationClass: "rupture" },
    ]);
    expect(parsed.causalLedger[0].causedByChapter).toBe(0);
    expect(parsed.callbackUsed).toBeNull();
    expect(parsed.visualTone).toBe("ancient");
  });

  it("uses the selected choice echo as the authoritative continuation callback", () => {
    const expectedEcho = turnFixture.choices[1].instantEcho;
    const raw = JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "一日余波",
      previousEcho: {
        directResult: "模型改写了直接结果",
        unexpectedCost: "模型遗漏了受益者和承担者",
      },
    });

    expect(parseTimelineTurn(raw, { expectedPreviousEcho: expectedEcho }).previousEcho).toEqual(
      expectedEcho,
    );
  });

  it("requires eleven decision entries, three causal chains, and three ordinary-life details", () => {
    expect(parseAlternatePresent(JSON.stringify(endingFixture))).toMatchObject({
      worldName: "公议纪元",
      plausibilityScore: 78,
    });
    expect(() =>
      parseAlternatePresent(JSON.stringify({ ...endingFixture, ordinaryLife2026: ["只有一条"] })),
    ).toThrow();
    expect(() =>
      parseAlternatePresent(
        JSON.stringify({ ...endingFixture, historyTimeline: endingFixture.historyTimeline.slice(0, 10) }),
      ),
    ).toThrow();
    expect(() =>
      parseAlternatePresent(
        JSON.stringify({ ...endingFixture, causalChains: endingFixture.causalChains.slice(0, 2) }),
      ),
    ).toThrow();
  });

  it("rebuilds string-only ending timeline entries from authoritative played turns", () => {
    const expectedHistoryTimeline = endingFixture.historyTimeline.map((item) => ({
      yearLabel: item.yearLabel,
      playerChoice: item.playerChoice,
    }));
    const raw = JSON.stringify({
      ...endingFixture,
      historyTimeline: endingFixture.historyTimeline.map((item) => item.consequence),
    });

    expect(parseAlternatePresent(raw, { expectedHistoryTimeline }).historyTimeline).toEqual(
      endingFixture.historyTimeline,
    );
  });
});
