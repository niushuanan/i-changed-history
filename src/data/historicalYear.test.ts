import { describe, expect, it } from "vitest";
import { formatHistoricalYear } from "./historicalYear";

describe("formatHistoricalYear", () => {
  it("formats BCE years for Chinese readers", () => {
    expect(formatHistoricalYear(-221)).toBe("公元前 221 年");
  });

  it("formats CE years for Chinese readers", () => {
    expect(formatHistoricalYear(1911)).toBe("公元 1911 年");
  });
});
