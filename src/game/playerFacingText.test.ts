import { describe, expect, it } from "vitest";
import {
  containsInternalPlayerCopy,
  localizeInternalPlayerCopy,
} from "./playerFacingText";

describe("player-facing text localization", () => {
  it("maps machine-only power IDs and schema labels to natural Chinese", () => {
    expect(localizeInternalPlayerCopy(
      "在deadline前发动 reverse-cause，并把 unexpectedCost 写进 actionSpec",
    )).toBe("在最后期限前发动 颠倒一次因果，并把 隐藏代价 写进 具体行动");
    expect(localizeInternalPlayerCopy("resverse cause")).toBe("颠倒一次因果");
    expect(localizeInternalPlayerCopy("让actualHistory按时发生")).toBe("让真实历史按时发生");
  });

  it("keeps meaningful historical names and acronyms unchanged", () => {
    const copy = "NASA 要求阿波罗 11 号在 U-2 航线以外着陆，CERN 继续开放网络";
    expect(localizeInternalPlayerCopy(copy)).toBe(copy);
    expect(containsInternalPlayerCopy(copy)).toBe(false);
  });
});
