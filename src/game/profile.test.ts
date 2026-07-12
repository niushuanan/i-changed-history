import { describe, expect, it } from "vitest";
import { validateTravelerProfile } from "./profile";

describe("traveler profile validation", () => {
  it("accepts a complete structured traveler profile", () => {
    expect(validateTravelerProfile({
      name: " 阿开 ",
      occupation: "product",
      strengths: ["negotiation", "organization"],
      riskStyle: "balanced",
    })).toEqual({
      ok: true,
      value: {
        name: "阿开",
        occupation: "product",
        strengths: ["negotiation", "organization"],
        riskStyle: "balanced",
      },
    });
  });

  it("requires a 2-12 character name and exactly two distinct strengths", () => {
    expect(validateTravelerProfile({
      name: "我",
      occupation: "product",
      strengths: ["negotiation", "negotiation"],
      riskStyle: "balanced",
    })).toMatchObject({
      ok: false,
      errors: {
        name: "称呼需要 2–12 个字符",
        strengths: "请选择两项不同的现代优势",
      },
    });
  });

  it("rejects missing structured selections", () => {
    expect(validateTravelerProfile({ name: "阿开", strengths: [] })).toMatchObject({
      ok: false,
      errors: {
        occupation: "请选择现代身份",
        strengths: "请选择两项不同的现代优势",
        riskStyle: "请选择决策本能",
      },
    });
  });
});
