import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import type { PlayedTurn } from "./prompts";
import { RIPPLE_LENSES, rippleFallbackScene, rippleSceneMatches, selectRippleDirective } from "./rippleRouter";

const scenario = {
  seed: HISTORY_SEEDS[0],
};

function playedWithLens(lens: string, chapter: number): PlayedTurn {
  return {
    turn: { ...turnFixture, chapter, rippleLens: lens, causalBridge: "玩家选择通过一份记录进入新的社会场景" } as unknown as PlayedTurn["turn"],
    selectedChoiceId: "A",
    selectedChoiceLabel: `第${chapter}幕选择`,
    selectedDeviationClass: "nudge",
    resolvedEcho: turnFixture.choices[0].instantEcho,
  };
}

describe("deterministic butterfly ripple routing", () => {
  it("routes every continuation into a known social carrier", () => {
    const directive = selectRippleDirective(scenario, [], 2);
    expect(RIPPLE_LENSES).toContain(directive.lens);
    expect(directive.label).not.toBe("");
    expect(directive.instruction).toContain("社会载体");
  });

  it("never repeats either of the previous two carriers", () => {
    const played: PlayedTurn[] = [];
    for (let chapter = 2; chapter <= 11; chapter += 1) {
      const directive = selectRippleDirective(scenario, played, chapter as 2);
      const recent = played.slice(-2).map((item) => item.turn.rippleLens);
      expect(recent).not.toContain(directive.lens);
      played.push(playedWithLens(directive.lens, chapter));
    }
  });

  it("returns the same route for the same history", () => {
    const played = [playedWithLens("power", 1), playedWithLens("knowledge", 2)];
    expect(selectRippleDirective(scenario, played, 3)).toEqual(selectRippleDirective(scenario, played, 3));
  });

  it("requires narrative evidence for the client-selected social carrier", () => {
    expect(rippleSceneMatches("migration", {
      role: "高卢城市安置官",
      location: "难民登记处",
      headline: "退伍者迁入新城",
      narrative: "居民正在争夺住房。",
      causalBridge: "军团撤退推动人口迁徙。",
      immediateObjective: "决定新居民如何落户",
    })).toBe(true);
    expect(rippleSceneMatches("migration", {
      role: "宫廷侍卫",
      location: "皇宫",
      headline: "继承之争",
      narrative: "大臣围绕遗诏争夺权力。",
      causalBridge: "皇帝遇刺改变继承顺序。",
      immediateObjective: "决定由谁继位",
    })).toBe(false);
    expect(rippleSceneMatches("migration", {
      role: "宫廷侍卫",
      location: "皇宫",
      headline: "继承之争",
      narrative: "大臣围绕遗诏争夺权力。",
      causalBridge: "皇帝遇刺改变继承顺序。",
      immediateObjective: "决定由谁继位",
      baselineAnchor: "历史上人口迁徙改变了许多城市",
    } as never)).toBe(false);
  });

  it("provides a semantically matching local fallback scene for every carrier", () => {
    for (const lens of RIPPLE_LENSES) {
      const scene = rippleFallbackScene(lens);
      expect(rippleSceneMatches(lens, {
        role: scene.role,
        location: scene.location,
        headline: scene.topic,
        narrative: `上一选择进入${scene.location}，${scene.topic}。`,
        causalBridge: `历史结果转入${scene.topic}`,
        immediateObjective: `决定${scene.topic}由谁承担代价`,
      })).toBe(true);
    }
  });
});
