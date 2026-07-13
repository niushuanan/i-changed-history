import { describe, expect, it } from "vitest";
import { buildTravelerProfile, getTravelerAbility, PERSONALITY_QUESTIONS } from "./profile";

describe("time traveler personality calibration", () => {
  it("uses four historical dilemmas to build a stable four-letter profile", () => {
    expect(PERSONALITY_QUESTIONS).toHaveLength(4);
    for (const question of PERSONALITY_QUESTIONS) {
      expect(question.options).toHaveLength(4);
      expect(question.options.map((option) => option.code)).toEqual(["A", "B", "C", "D"]);
    }

    const profile = buildTravelerProfile({
      energy: "I",
      perception: "N",
      judgment: "T",
      tactics: "P",
    });

    expect(profile).toMatchObject({
      name: "因果侦探",
      typeCode: "INTP",
      dimensions: { energy: "I", perception: "N", judgment: "T", tactics: "P" },
    });
    expect(profile.strengths[0]).not.toBe(profile.strengths[1]);
  });

  it("turns the personality into three visible gameplay rules", () => {
    const ability = getTravelerAbility(buildTravelerProfile({
      energy: "I",
      perception: "N",
      judgment: "T",
      tactics: "P",
    }));

    expect(ability).toMatchObject({
      typeCode: "INTP",
      title: "因果侦探",
      action: "每幕三个行动中，有一个只按 INTP 的本能生成",
      preview: "预判时优先看见长期连锁与制度代价",
    });
    expect(ability.customAction).toContain("三次直接改写");
    expect(ability.customAction).toContain("结果立即成为正史");
    expect(ability.promptDirective).toContain("INTP");
  });
});
