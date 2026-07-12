import { describe, expect, it } from "vitest";
import { visualAssetForTurn } from "./visualAssets";

describe("timeline scene selection", () => {
  it("never puts modern technology into an early-modern century jump", () => {
    expect(visualAssetForTurn({ chapter: 8, visualTone: "space", yearLabel: "1700 年" }))
      .toBe("/assets/stage-early-modern.webp");
  });

  it("uses contemporary scenes once the simulation approaches 2026", () => {
    expect(visualAssetForTurn({ chapter: 11, visualTone: "ancient", yearLabel: "2025 年" }))
      .toBe("/assets/stage-2026.webp");
  });

  it("keeps the immediate aftermath scene independent of year", () => {
    expect(visualAssetForTurn({ chapter: 2, visualTone: "digital", yearLabel: "1969 年" }))
      .toBe("/assets/stage-aftermath.webp");
  });

  it("combines theme and year for an early-modern war", () => {
    expect(visualAssetForTurn({ chapter: 1, visualTone: "war", yearLabel: "1600年" }))
      .toBe("/assets/stage-aftermath.webp");
  });

  it("parses one and two digit AD years without leaking modern art", () => {
    expect(visualAssetForTurn({ chapter: 4, visualTone: "digital", yearLabel: "公元64年" }))
      .toBe("/assets/tone-ancient.webp");
  });
});
