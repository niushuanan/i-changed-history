import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { turnFixture } from "../test/fixtures";
import { buildTravelerProfile } from "./profile";
import type { PlayedTurn } from "./prompts";
import {
  buildPivotalBrief,
  buildWorldCanon,
  pivotalScenePreservesCanon,
  pivotalSceneMatches,
  type CanonicalPlayedTurn,
} from "./worldCanon";

const scenario = {
  profile: buildTravelerProfile({ energy: "I", perception: "N", judgment: "T", tactics: "P" }),
  seed: HISTORY_SEEDS[0],
};

function playedCustom(
  chapter: number,
  outcome: string,
  causalMechanism: string,
): CanonicalPlayedTurn {
  const turn = {
    ...turnFixture,
    chapter,
    chapterName: chapter === 1 ? "历史现场" : "一日余波",
    previousEcho: chapter === 1 ? null : turnFixture.choices[0].instantEcho,
  } as unknown as PlayedTurn["turn"];

  return {
    turn,
    selectedChoiceId: "custom",
    selectedChoiceLabel: outcome,
    selectedDeviationClass: "rupture",
    resolvedEcho: {
      directResult: outcome,
      unexpectedCost: "旧贵族失去既有权位",
      beneficiary: "支持新秩序的城市居民",
      payer: "依赖旧秩序的地方官员",
    },
    playerAuthored: true,
    canonStatus: "玩家钦定",
    causalMechanism,
  };
}

describe("deterministic world canon", () => {
  it("keeps a player-authored emperor declaration immutable and mandates power consequences for three following chapters", () => {
    const played = [playedCustom(1, "我成为新皇帝", "结果经由宫门口令与继承命令进入社会")];
    const canon = buildWorldCanon(played);

    expect(canon.immutableFacts).toContainEqual(expect.objectContaining({
      chapter: 1,
      text: "我成为新皇帝",
      playerAuthored: true,
      canonStatus: "玩家钦定",
    }));
    expect(canon.activeMandates).toContainEqual(expect.objectContaining({
      kind: "power",
      sourceChapter: 1,
      sourceText: "我成为新皇帝",
      activeThroughChapter: 4,
    }));

    for (const chapter of [2, 3, 4] as const) {
      const brief = buildPivotalBrief(scenario, played, chapter);
      expect(brief.mustPreserve).toContain("我成为新皇帝");
      expect(brief.continuityMandate).toContain("权力");
      expect(brief.pivotKind).toBe("power");
      expect(brief.requiredEvidence).toEqual(expect.arrayContaining(["继承", "政权"]));
    }

    expect(buildPivotalBrief(scenario, played, 5).continuityMandate).toBeNull();
  });

  it("turns technology declarations into an institutional and production mandate for exactly three following chapters", () => {
    const played = [playedCustom(2, "我大力发展科技", "结果经由国家工坊、学校与工匠网络进入社会")];
    const canon = buildWorldCanon(played);

    expect(canon.recentCustomCanon).toMatchObject({
      text: "我大力发展科技",
      causalMechanism: "结果经由国家工坊、学校与工匠网络进入社会",
    });
    expect(canon.activeMandates).toContainEqual(expect.objectContaining({
      kind: "technology",
      sourceChapter: 2,
      activeThroughChapter: 5,
    }));

    for (const chapter of [3, 4, 5] as const) {
      const brief = buildPivotalBrief(scenario, played, chapter);
      expect(brief.pivotKind).toBe("technology");
      expect(brief.continuityMandate).toContain("科技");
      expect(brief.significanceRequirement).toMatch(/机构|生产|工艺|人才/);
      expect(brief.mustPayOffNow).toContain("我大力发展科技");
    }

    expect(buildPivotalBrief(scenario, played, 6).continuityMandate).toBeNull();
  });

  it("keeps multiple long-term mandates when one declaration changes both sovereignty and technology", () => {
    const played = [playedCustom(
      1,
      "我成为新皇帝，并设立国家科学院大力发展科技",
      "登基诏书和科学院预算进入官署执行",
    )];
    const canon = buildWorldCanon(played);
    const brief = buildPivotalBrief(scenario, played, 2);

    expect(canon.activeMandates.filter((mandate) => mandate.sourceChapter === 1).map((mandate) => mandate.kind))
      .toEqual(expect.arrayContaining(["power", "technology"]));
    expect(brief.activeMandates.map((mandate) => mandate.label))
      .toEqual(expect.arrayContaining(["权力与继承", "技术与生产"]));
    expect(brief.continuityMandate).toContain("权力与继承");
    expect(brief.continuityMandate).toContain("技术与生产");
  });

  it("uses the player's own abolition wording as institutional evidence", () => {
    const played = [playedCustom(
      4,
      "我废除六部，并让国家科学院掌握全国财政、技术与教育",
      "法令、预算与学校公文进入社会",
    )];
    const brief = buildPivotalBrief(scenario, played, 5);

    expect(brief.activeCustomCanon[0].claimGroups).toEqual(expect.arrayContaining([
      expect.arrayContaining(["废除"]),
    ]));
    expect(pivotalScenePreservesCanon(brief, {
      role: "国家科学院财政司司长",
      location: "长安含元殿",
      headline: "工票换粮",
      narrative: "科学院工坊用技术生产换取粮税。",
      causalBridge: "协和令废除六部后，地方财政与教育公文改送科学院",
      immediateObjective: "决定新财政规则",
      turningPointStakes: "决定科学院能否掌握财政、技术与教育",
      worldStateChange: "六部撤销，国家科学院接管全国财政",
      divergenceProof: "真实历史六部仍在；当前线科学院已经掌权",
    }, [{
      fact: "我废除六部，并让国家科学院掌握全国财政、技术与教育",
      causedByChapter: 4,
      mustAffect: "全国制度",
    }])).toBe(true);
  });

  it("uses deterministic chapter scale progression and pivot evidence words", () => {
    const played = [playedCustom(1, "我废除了旧税制", "结果经由法令与地方执行记录进入社会")];

    expect(buildPivotalBrief(scenario, played, 2)).toMatchObject({
      scale: "scene",
      pivotKind: "trade",
    });
    expect(buildPivotalBrief(scenario, played, 4).scale).toBe("regime");
    expect(buildPivotalBrief(scenario, played, 6).scale).toBe("nation");
    expect(buildPivotalBrief(scenario, played, 8).scale).toBe("civilization");
    expect(buildPivotalBrief(scenario, played, 10).scale).toBe("world");
    expect(buildPivotalBrief(scenario, played, 2).requiredEvidence).toEqual(
      expect.arrayContaining(["税", "贸易"]),
    );
  });

  it("routes an academy-branded paper-currency alliance by its action instead of its institution name", () => {
    const played = [playedCustom(
      7,
      "我让科学院发行全球通用纸币，并与阿拉伯商人建立跨洲贸易联盟",
      "纸币和商约进入跨洲市场",
    )];

    expect(buildPivotalBrief(scenario, played, 8).pivotKind).toBe("trade");
  });

  it("treats founding an academy itself as a technology mandate", () => {
    const played = [playedCustom(1, "我建立国家科学院", "建院诏书进入官署")];

    expect(buildPivotalBrief(scenario, played, 2).pivotKind).toBe("technology");
  });

  it("preserves every completed player choice while reserving the canon tag for direct rewrites", () => {
    const ordinaryChoice: CanonicalPlayedTurn = {
      ...playedCustom(1, "公开完整遗诏", "结果经由公告与抄本进入社会"),
      selectedChoiceId: "A",
      playerAuthored: false,
      canonStatus: undefined,
    };
    const canon = buildWorldCanon([ordinaryChoice]);

    expect(canon.immutableFacts).toContainEqual(expect.objectContaining({
      text: "公开完整遗诏",
      playerAuthored: false,
    }));
    expect(canon.recentCustomCanon).toBeNull();
    expect(buildPivotalBrief(scenario, [ordinaryChoice], 2).mustPreserve).toContain("公开完整遗诏");
  });

  it("requires the latest decision and still-active custom canon in the next causal ledger", () => {
    const custom = playedCustom(1, "我成为新皇帝", "登基诏书进入官署执行");
    const ordinary: CanonicalPlayedTurn = {
      ...playedCustom(2, "设立全国工匠考试", "考试名册进入地方学校"),
      selectedChoiceId: "B",
      playerAuthored: false,
      canonStatus: undefined,
    };

    expect(buildPivotalBrief(scenario, [custom, ordinary], 3).requiredCausalChapters)
      .toEqual([1, 2]);
  });

  it("keeps active player canon as the pivotal conflict after an ordinary choice", () => {
    const custom = playedCustom(1, "我大力发展科技", "国家工坊与学校开始执行");
    const ordinary: CanonicalPlayedTurn = {
      ...playedCustom(2, "先核对地方粮册", "账册送入地方官署"),
      selectedChoiceId: "A",
      selectedDeviationClass: "nudge",
      playerAuthored: false,
      canonStatus: undefined,
    };

    const brief = buildPivotalBrief(scenario, [custom, ordinary], 3);

    expect(brief.pivotKind).toBe("technology");
    expect(brief.mustPayOffNow).toContain("先核对地方粮册");
    expect(brief.activeCustomCanon).toContainEqual(expect.objectContaining({
      sourceChapter: 1,
      sourceText: "我大力发展科技",
    }));
  });

  it("rejects generic scenes that do not enact the assigned pivotal conflict", () => {
    const brief = buildPivotalBrief(scenario, [playedCustom(1, "我成为新皇帝", "登基诏书进入官署执行")], 2);
    const generic = {
      role: "普通记录员",
      location: "一间办公室",
      headline: "日常记录",
      narrative: "你整理了一份普通报告。",
      causalBridge: "上一决定传到了这里",
      immediateObjective: "整理文件",
      turningPointStakes: "完成今天的工作",
      worldStateChange: "一份报告写完了",
      divergenceProof: "今天和昨天不同",
    };

    expect(pivotalSceneMatches(brief, generic)).toBe(false);
    expect(pivotalSceneMatches(brief, {
      ...generic,
      role: "新朝册立使",
      location: "继承诏书宣读现场",
      headline: "新政权第一次册立",
      turningPointStakes: "这次册立决定新政权是否合法",
    })).toBe(true);
  });

  it("recognizes concrete authority transfers as institutional turning points", () => {
    const ordinary: CanonicalPlayedTurn = {
      ...playedCustom(3, "重写全国规则", "新规则进入朝廷"),
      selectedChoiceId: "B",
      selectedDeviationClass: "reform",
      playerAuthored: false,
      canonStatus: undefined,
    };
    const brief = buildPivotalBrief(scenario, [ordinary], 4);

    expect(brief.pivotKind).toBe("institution");
    expect(pivotalSceneMatches(brief, {
      role: "国家科学院财政副使",
      location: "长安宣政殿",
      headline: "铸币权归谁",
      narrative: "地方私铸泛滥，朝廷要求你拿出决定。",
      causalBridge: "旧规则失效后，地方获得铸币授权",
      immediateObjective: "裁决是否收回地方铸币权",
      turningPointStakes: "决定中央与地方谁掌控全国财政",
      worldStateChange: "地方铸币权已经扩大",
      divergenceProof: "真实历史由户部管理；当前线由科学院重新授权",
    })).toBe(true);
  });

  it("rejects a scene that names the right conflict but negates player-authored canon", () => {
    const brief = buildPivotalBrief(
      scenario,
      [playedCustom(1, "我成为新皇帝", "登基诏书进入官署执行")],
      2,
    );
    const contradictory = {
      role: "新朝册立使",
      location: "继承诏书宣读现场",
      headline: "新政权第一次册立",
      narrative: "宫门已经封闭，但你成为皇帝的计划最终失败。",
      causalBridge: "继承命令抵达政权核心",
      immediateObjective: "决定继承诏书由谁宣读",
      turningPointStakes: "这次册立决定新政权是否合法",
      worldStateChange: "你并未成为皇帝，旧君仍然在位",
      divergenceProof: "当前线称帝失败",
    };

    expect(pivotalSceneMatches(brief, contradictory)).toBe(true);
    expect(pivotalScenePreservesCanon(brief, contradictory, [{
      fact: "我成为新皇帝",
      causedByChapter: 1,
      mustAffect: "继承与政权",
    }])).toBe(false);
    expect(pivotalScenePreservesCanon(brief, {
      ...contradictory,
      narrative: "你已经以新皇帝身份进入大殿。",
      worldStateChange: "新皇帝已经登基，旧继承秩序终结",
      divergenceProof: "真实历史没有这位新皇帝；当前线新政权已经册立",
    }, [{
      fact: "我成为新皇帝",
      causedByChapter: 1,
      mustAffect: "继承与政权",
    }])).toBe(true);
  });

  it("rejects a successful assassination that later claims the target actually survived", () => {
    const brief = buildPivotalBrief(
      scenario,
      [playedCustom(1, "我刺杀皇帝且成功", "死讯经宫门口令进入朝廷")],
      2,
    );
    const scene = {
      role: "禁军统领",
      location: "宫门继承会议",
      headline: "政权继承",
      narrative: "刺杀已经执行，但皇帝其实未死。",
      causalBridge: "刺杀消息进入军队与政权核心",
      immediateObjective: "决定继承诏书",
      turningPointStakes: "决定新政权与军队归属",
      worldStateChange: "皇帝仍然在世，刺杀只是一场误会",
      divergenceProof: "当前线皇帝幸存",
    };

    expect(pivotalScenePreservesCanon(brief, scene, [{
      fact: "我刺杀皇帝且成功",
      causedByChapter: 1,
      mustAffect: "政权继承",
    }])).toBe(false);
  });

  it("routes unknown declarations deterministically instead of choosing a random topic", () => {
    const played = [playedCustom(1, "我让所有人照我说的做", "命令通过现场口令进入社会")];

    expect(buildPivotalBrief(scenario, played, 2)).toEqual(buildPivotalBrief(scenario, played, 2));
    expect(buildPivotalBrief(scenario, played, 2).pivotKind).toBe("war");
  });
});
