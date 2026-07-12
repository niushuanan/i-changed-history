import { describe, expect, it } from "vitest";
import { normalizeCustomSeed } from "./input";

describe("custom historical premise", () => {
  it("rejects blank input without discarding it", () => {
    expect(normalizeCustomSeed("   ")).toEqual({ ok: false, reason: "empty", value: "" });
  });

  it("rejects input longer than 140 characters", () => {
    const value = "历".repeat(141);
    expect(normalizeCustomSeed(value)).toEqual({ ok: false, reason: "too_long", value });
  });

  it("rejects a premise shorter than four characters", () => {
    expect(normalizeCustomSeed("如果秦")).toEqual({ ok: false, reason: "too_short", value: "如果秦" });
  });

  it("blocks modern China counterfactuals while retaining the premise", () => {
    const value = "如果1966年的中国发生另一种变化";
    expect(normalizeCustomSeed(value)).toEqual({ ok: false, reason: "modern_china", value });
  });

  it("blocks modern Chinese premises that use place or dynasty references", () => {
    for (const value of [
      "如果1840年北京发生另一种变化",
      "如果1919年上海发生另一种变化",
      "如果1949年清朝发生另一种变化",
      "如果1911年清末发生另一种变化",
    ]) {
      expect(normalizeCustomSeed(value)).toEqual({ ok: false, reason: "modern_china", value });
    }
  });

  it("allows pre-modern China and globally framed premises", () => {
    expect(normalizeCustomSeed("如果郑和船队在1433年后继续远航")).toEqual({
      ok: true,
      value: "如果郑和船队在1433年后继续远航",
    });
    expect(normalizeCustomSeed("如果1433年北京继续支持远航")).toEqual({
      ok: true,
      value: "如果1433年北京继续支持远航",
    });
    expect(normalizeCustomSeed("如果古罗马在公元一世纪普及蒸汽动力").ok).toBe(true);
  });

  it("normalizes internal whitespace before returning a valid premise", () => {
    expect(normalizeCustomSeed("  如果  古罗马\n在公元一世纪普及蒸汽动力  ")).toEqual({
      ok: true,
      value: "如果 古罗马 在公元一世纪普及蒸汽动力",
    });
  });
});
