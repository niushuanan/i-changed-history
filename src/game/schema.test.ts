import { describe, expect, it } from "vitest";
import { endingFixture, turnFixture } from "../test/fixtures";
import { extractFirstJsonObject, parseAlternatePresent, parseCustomActionResolution, parseTimelineTurn } from "./schema";

describe("structured timeline parsing", () => {
  it("keeps the same protagonist while enforcing the authoritative age", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 6,
      chapterName: "执掌一方",
      protagonistName: "模型擅自换成另一个人",
      protagonistAge: 99,
      lifeStage: "执掌一方",
      previousEcho: turnFixture.choices[0].instantEcho,
    }), {
      expectedChapter: 6,
      expectedProtagonistName: "沈砚",
      expectedProtagonistAge: 29,
      expectedLifeStage: "执掌一方",
    });

    expect(parsed).toMatchObject({ protagonistName: "沈砚", protagonistAge: 29, lifeStage: "执掌一方" });
  });

  it("parses a player-authored result as canonical history", () => {
    const resolution = parseCustomActionResolution(JSON.stringify({
      declaredOutcome: "我暗杀了皇帝且成功",
      canonStatus: "玩家钦定",
      causalMechanism: "死讯通过禁军口令传入摄政会议",
      deviationClass: "rupture",
      instantEcho: {
        directResult: "皇位继承程序立即中断",
        unexpectedCost: "禁军开始争夺遗诏真伪",
        beneficiary: "掌握宫门的摄政派",
        payer: "未获消息的地方军",
      },
    }));

    expect(resolution).toMatchObject({ declaredOutcome: "我暗杀了皇帝且成功", canonStatus: "玩家钦定", deviationClass: "rupture" });
    expect(() => parseCustomActionResolution(JSON.stringify({
      ...resolution,
      declaredOutcome: "改".repeat(81),
    }))).toThrow();
  });

  it("carries an eighty-character canonical result into the next turn", () => {
    const declaredOutcome = "我已经成功完成改写".repeat(8).slice(0, 80);
    const next = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: { ...turnFixture.choices[0].instantEcho, directResult: declaredOutcome },
    }));
    expect(next.previousEcho?.directResult).toBe(declaredOutcome);
  });

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
    expect(parseTimelineTurn(raw).generationSource).toBe("deepseek");
  });

  it("injects omitted client-owned turn fields without asking the model to repeat them", () => {
    const { chapter: _chapter, chapterName: _chapterName, protagonistAge: _age,
      lifeStage: _lifeStage, yearLabel: _yearLabel, previousEcho: _previousEcho,
      metrics: _metrics, metricDeltas: _metricDeltas, callbackUsed: _callbackUsed,
      ...modelOwned } = turnFixture;
    const parsed = parseTimelineTurn(JSON.stringify(modelOwned), {
      expectedChapter: 1,
      expectedYearLabel: "208 年冬 · 24岁",
      expectedProtagonistAge: 24,
      expectedLifeStage: "命运当日",
    });

    expect(parsed).toMatchObject({
      chapter: 1,
      chapterName: "历史现场",
      protagonistAge: 24,
      yearLabel: "208 年冬 · 24岁",
      previousEcho: null,
      callbackUsed: null,
      metrics: { stability: 50, prosperity: 50, freedom: 50, cost: 50 },
    });
  });

  it("rejects omitted display prose instead of inventing local history", () => {
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      headline: undefined,
      narrative: undefined,
    }))).toThrow();
  });

  it("keeps the decisive turning point and visible divergence proof", () => {
    const parsed = parseTimelineTurn(JSON.stringify(turnFixture));

    expect(parsed.turningPointStakes).toBe(turnFixture.turningPointStakes);
    expect(parsed.worldStateChange).toBe(turnFixture.worldStateChange);
    expect(parsed.divergenceProof).toBe(turnFixture.divergenceProof);
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      turningPointStakes: undefined,
    }))).toThrow();
  });

  it("removes a repeated real-history label from the comparison copy", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      divergenceProof: "真实历史中，孙刘联军借东风火攻曹操水军，曹军由乌林败退。",
    }));

    expect(parsed.divergenceProof).toBe("孙刘联军借东风火攻曹操水军，曹军由乌林败退。");
  });

  it("rejects a real-history baseline that mixes the alternate timeline back in", () => {
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      divergenceProof: "真实历史中吕布仍受董卓信任；本线吕布已经开始独立调查王允。",
    }))).toThrow(/真实历史/);
  });

  it("trims overlong pivotal proof fields instead of discarding an otherwise valid turn", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      turningPointStakes: "重".repeat(80),
      worldStateChange: "变".repeat(90),
      divergenceProof: "史".repeat(90),
    }));

    expect(parsed.turningPointStakes.length).toBeLessThanOrEqual(44);
    expect(parsed.worldStateChange.length).toBeLessThanOrEqual(36);
    expect(parsed.divergenceProof.length).toBeLessThanOrEqual(48);
  });

  it("trims an overlong causal bridge instead of discarding a strong generated scene", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge: "因".repeat(70),
    }));

    expect(parsed.causalBridge.length).toBeLessThanOrEqual(36);
  });

  it("trims overlong relay metadata and history anchors without discarding the scene", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      identityBridge: "代".repeat(70),
      modernAdvantage: "能".repeat(70),
      baselineAnchor: "史".repeat(70),
    }));

    expect(parsed.identityBridge).toHaveLength(54);
    expect(parsed.modernAdvantage).toHaveLength(54);
    expect(parsed.baselineAnchor).toHaveLength(54);
  });

  it("keeps the client-selected ripple carrier authoritative", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      rippleLens: "power",
      causalBridge: "玩家公开遗诏，消息经驿站进入城市粮价",
    });
    const parsed = parseTimelineTurn(raw, { expectedRippleLens: "livelihood" });
    expect(parsed.rippleLens).toBe("livelihood");
    expect(parsed.causalBridge).toContain("驿站");
  });

  it("truncates an overlong narrative instead of interrupting gameplay", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      narrative: `${"史".repeat(43)}。${"记".repeat(43)}。${"余波".repeat(20)}`,
    });
    expect(parseTimelineTurn(raw).narrative).toHaveLength(88);
  });

  it("keeps a complete two-sentence prehistory at the new visible limit", () => {
    const narrative = `${"前".repeat(43)}。${"情".repeat(43)}。`;
    expect(parseTimelineTurn(JSON.stringify({ ...turnFixture, narrative })).narrative).toBe(narrative);
  });

  it("rejects a scene prehistory that collapses into one sentence", () => {
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      narrative: "你站在宣阳门城楼箭垛后，俯视着押送百官的吕布。",
    }))).toThrow(/两句/);
  });

  it("ends a trimmed narrative at a complete sentence when possible", () => {
    const completeSentence = "战情室里所有人都看向你。你必须在两封来信之间作出判断。";
    const raw = JSON.stringify({
      ...turnFixture,
      narrative: `${completeSentence}${"下一句尚未讲完".repeat(12)}`,
    });

    expect(parseTimelineTurn(raw).narrative).toBe(completeSentence);
  });

  it("strips harmless extra model fields", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      modelComment: "extra",
      choices: turnFixture.choices.map((choice) => ({ ...choice, forecast: "extra" })),
    });
    expect(parseTimelineTurn(raw)).not.toHaveProperty("modelComment");
  });

  it("restores choices to the authoritative A, B, and C positions", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      choices: [turnFixture.choices[0], turnFixture.choices[1], turnFixture.choices[1]],
    });
    expect(parseTimelineTurn(raw).choices.map((choice) => choice.id)).toEqual(["A", "B", "C"]);
  });

  it("keeps a complete concrete action label up to thirty-two characters", () => {
    const label = "趁董卓车队入城前调弓弩手封锁宣阳门并扣住吕布亲兵";
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 0 ? { ...choice, label } : choice),
    }));

    expect(parsed.choices[0].label).toBe(label);
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
    expect(parseTimelineTurn(duplicateClass).choices.map((choice) => choice.deviationClass))
      .toEqual(["nudge", "reform", "rupture"]);

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

  it("normalizes protagonist continuity metadata and marks one modern-knowledge action", () => {
    const parsed = parseTimelineTurn(JSON.stringify(turnFixture));
    expect(parsed.identityBridge).toBeTruthy();
    expect(parsed.modernAdvantage).toBeTruthy();
    expect(parsed.choices.filter((choice) => choice.usesModernKnowledge)).toHaveLength(1);

    const duplicate = {
      ...turnFixture,
      choices: turnFixture.choices.map((choice) => ({ ...choice, usesModernKnowledge: true })),
    };
    const normalized = parseTimelineTurn(JSON.stringify(duplicate));
    expect(normalized.choices.filter((choice) => choice.usesModernKnowledge)).toHaveLength(1);
    expect(normalized.choices[0].usesModernKnowledge).toBe(true);
  });

  it("normalizes positional choice authority and trims nested action copy", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice) => ({
        ...choice,
        id: "C",
        deviationClass: "rupture",
        label: "行".repeat(40),
        intent: "因".repeat(50),
        actionSpec: {
          actor: "人".repeat(30),
          action: "做".repeat(40),
          target: "物".repeat(40),
          deadline: "时".repeat(30),
        },
      })),
    }));

    expect(parsed.choices.map((choice) => [choice.id, choice.deviationClass])).toEqual([
      ["A", "nudge"], ["B", "reform"], ["C", "rupture"],
    ]);
    expect(parsed.choices[0].label.length).toBeLessThanOrEqual(32);
    expect(parsed.choices[0].intent.length).toBeLessThanOrEqual(24);
    expect(parsed.choices[0].actionSpec).toMatchObject({
      actor: "人".repeat(20), action: "做".repeat(28), target: "物".repeat(28), deadline: "时".repeat(20),
    });
  });

  it("requires a null first-turn echo and accepts all twelve decision chapters", () => {
    expect(() =>
      parseTimelineTurn(
        JSON.stringify({
          ...turnFixture,
          previousEcho: turnFixture.choices[0].instantEcho,
        }),
      ),
    ).toThrow();

    expect(() =>
      parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: 12, chapterName: "生命终章", lifeStage: "生命终章", protagonistAge: 70, previousEcho: turnFixture.choices[0].instantEcho })),
    ).not.toThrow();

    expect(() =>
      parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: 13, chapterName: "平行 2026" })),
    ).toThrow();
  });

  it("normalizes the stable V4-flash formatting drift seen in real opening turns", () => {
    const drifted = {
      ...turnFixture,
      baselineAnchor: [turnFixture.baselineAnchor, "继业者尚未分割帝国。"],
      choices: turnFixture.choices.map((choice, index) => ({
        label: `${["A", "B", "C"][index]}. ${choice.label}`,
        intent: choice.deviationClass,
        usesModernKnowledge: choice.usesModernKnowledge,
        actionSpec: choice.actionSpec,
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

  it("removes internal deviation labels from player-facing choice copy", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice) => ({
        ...choice,
        intent: `${choice.intent}（${choice.deviationClass}）`,
      })),
    });

    expect(parseTimelineTurn(raw).choices.map((choice) => choice.intent))
      .toEqual(turnFixture.choices.map((choice) => choice.intent));
  });

  it("trims copy to the fixed iPhone event budgets", () => {
    expect(parseTimelineTurn(JSON.stringify({ ...turnFixture, headline: "过".repeat(23) })).headline)
      .toHaveLength(22);
    expect(parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: [{ ...turnFixture.choices[0], label: "选".repeat(37) }, turnFixture.choices[1], turnFixture.choices[2]],
    })).choices[0].label).toHaveLength(32);
  });

  it("uses the selected choice echo as the authoritative continuation callback", () => {
    const expectedEcho = turnFixture.choices[1].instantEcho;
    const raw = JSON.stringify({
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: {
        directResult: "模型改写了直接结果",
        unexpectedCost: "模型遗漏了受益者和承担者",
      },
    });

    expect(parseTimelineTurn(raw, { expectedPreviousEcho: expectedEcho }).previousEcho).toEqual(
      expectedEcho,
    );
  });

  it("uses the client timeline node as authoritative when the model returns an old chapter label", () => {
    const raw = JSON.stringify({ ...turnFixture, chapter: 2, chapterName: "三日余波", previousEcho: turnFixture.choices[0].instantEcho });
    const parsed = parseTimelineTurn(raw, { expectedChapter: 8, expectedPreviousEcho: turnFixture.choices[0].instantEcho });
    expect(parsed).toMatchObject({ chapter: 8, chapterName: "盛年危局" });
  });

  it("uses the client target date when the model repeats an old year", () => {
    const raw = JSON.stringify({ ...turnFixture, yearLabel: "错误的旧年份" });
    expect(parseTimelineTurn(raw, { expectedYearLabel: "1700年" }).yearLabel).toBe("1700年");
  });

  it("rejects modern generic room names in pre-1900 scenes", () => {
    const raw = JSON.stringify({ ...turnFixture, location: "吴郡太守府议事厅" });
    expect(() => parseTimelineTurn(raw, { expectedYearLabel: "195年" })).toThrow(/时代不符/);
  });

  it("requires twelve decisions, a death scene, four posthumous chapters, and three ordinary-life details", () => {
    expect(parseAlternatePresent(JSON.stringify(endingFixture))).toMatchObject({
      worldName: "公议纪元",
      plausibilityScore: 78,
    });
    expect(() =>
      parseAlternatePresent(JSON.stringify({ ...endingFixture, ordinaryLife2026: ["只有一条"] })),
    ).toThrow();
    expect(() =>
      parseAlternatePresent(
        JSON.stringify({ ...endingFixture, historyTimeline: endingFixture.historyTimeline.slice(0, 11) }),
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
