import { describe, expect, it } from "vitest";
import { getTravelerAbility, validateTravelerProfile } from "./profile";

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

  it("turns the profile into a named gameplay ability", () => {
    expect(getTravelerAbility({
      name: "阿开",
      occupation: "product",
      strengths: ["negotiation", "strategy"],
      riskStyle: "balanced",
    })).toEqual({
      title: "系统拆解",
      strengths: "谈判 + 战略",
      action: "每幕可预判一个专属行动的受益者与隐藏代价",
      style: "先比较收益与代价，再推动制度落地",
    });
  });
});
