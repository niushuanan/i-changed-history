import { describe, expect, it } from "vitest";
import { endingFixture, turnFixture } from "../test/fixtures";
import { extractFirstJsonObject, parseAlternatePresent, parseBiographyReport, parseCustomActionResolution, parseTimelineTurn, parseWorldReport } from "./schema";

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

  it("trims harmless custom adjudication overflow without changing the declared result", () => {
    const declaredOutcome = "我已经建立全国公开账册制度";
    const parsed = parseCustomActionResolution(JSON.stringify({
      declaredOutcome,
      canonStatus: "玩家钦定",
      causalMechanism: "传播".repeat(40),
      deviationClass: "rupture",
      instantEcho: {
        directResult: declaredOutcome,
        unexpectedCost: "旧官僚体系需要重新核验全部账册".repeat(3),
        beneficiary: "能够查账的普通民众".repeat(3),
        payer: "失去隐匿空间的旧官员".repeat(3),
      },
    }));

    expect(parsed.declaredOutcome).toBe(declaredOutcome);
    expect(parsed.causalMechanism.length).toBeLessThanOrEqual(56);
    expect(parsed.instantEcho).toMatchObject({ directResult: declaredOutcome });
    expect(parsed.instantEcho.payer.length).toBeLessThanOrEqual(24);
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

  it("parses a valid turn while ignoring legacy world metrics", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      metrics: { stability: 132, prosperity: -5, freedom: 31.4, cost: 18 },
    });
    const parsed = parseTimelineTurn(raw);
    expect(parsed).not.toHaveProperty("metrics");
    expect(parsed.generationSource).toBe("deepseek");
  });

  it("drops legacy model fields that have no gameplay consumer", () => {
    const parsed = parseTimelineTurn(JSON.stringify(turnFixture));
    for (const field of [
      "timelineName",
      "identityBridge",
      "modernAdvantage",
      "rippleLens",
      "turningPointStakes",
      "metrics",
      "metricDeltas",
      "callbackUsed",
    ]) {
      expect(parsed).not.toHaveProperty(field);
    }
  });

  it("injects omitted client-owned turn fields without asking the model to repeat them", () => {
    const { chapter: _chapter, chapterName: _chapterName, protagonistAge: _age,
      lifeStage: _lifeStage, yearLabel: _yearLabel, previousEcho: _previousEcho,
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
    });
  });

  it("rejects omitted display prose instead of inventing local history", () => {
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      headline: undefined,
      narrative: undefined,
    }))).toThrow();
  });

  it("keeps the visible alternate-world change and divergence proof", () => {
    const parsed = parseTimelineTurn(JSON.stringify(turnFixture));

    expect(parsed.worldStateChange).toBe(turnFixture.worldStateChange);
    expect(parsed.divergenceProof).toBe(turnFixture.divergenceProof);
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

  it("compacts the causal bridge at a complete AI-authored clause while preserving the other proofs", () => {
    const causalBridge = "玩家命令先经驿站传到边军。粮仓账册又把影响带回朝堂，三地因此同时改变部署。";
    const worldStateChange = "三座城已经共同执行新法，地方官署和驻军都公开承认这项改变。";
    const divergenceProof = "正史里的边军并未收到这道命令，粮仓仍由旧官署掌管，朝堂也没有因此提前改组。";
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge,
      worldStateChange,
      divergenceProof,
    }));

    expect([...parsed.causalBridge].length).toBeLessThanOrEqual(36);
    expect(parsed.causalBridge).toMatch(/。$/);
    expect(causalBridge.startsWith(parsed.causalBridge.replace(/。$/, ""))).toBe(true);
    expect(parsed.worldStateChange).toBe(worldStateChange);
    expect(parsed.divergenceProof).toBe(divergenceProof);
  });

  it("shortens an overlong visible proof only at a complete AI-authored clause", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge: "第一层因果已经通过驿站传到前线。第二层影响也由地方官署公开确认，后面这段冗长补充不应被截成半句话，这句更长的重复说明绝不应出现在界面上",
      worldStateChange: "第一项改变已经落地。第二项改变也已被官署确认，后面这段冗长补充不应被截成半句话，这句更长的重复说明绝不应出现在界面上",
      divergenceProof: "正史中的第一次结果有明确记录。第二次结果也见于同时代档案，后面这段冗长补充不应被截成半句话而留在界面上，这句更长的重复说明绝不应出现在界面上",
    }));

    expect(parsed.causalBridge).toMatch(/。$/);
    expect(parsed.worldStateChange).toMatch(/。$/);
    expect(parsed.divergenceProof).toMatch(/。$/);
    expect(parsed.causalBridge).not.toContain("重复说明");
    expect(parsed.worldStateChange).not.toContain("重复说明");
    expect(parsed.divergenceProof).not.toContain("重复说明");
  });

  it("rejects unpunctuated visible overflow so the engine can ask the model to rewrite it", () => {
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge: "因".repeat(90),
    }))).toThrow(/causalBridge/);
  });

  it("trims an overlong history anchor without discarding the scene", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      baselineAnchor: "史".repeat(70),
    }));

    expect(parsed.baselineAnchor).toHaveLength(54);
  });

  it("truncates an overlong narrative instead of interrupting gameplay", () => {
    const raw = JSON.stringify({
      ...turnFixture,
      narrative: `${"史".repeat(52)}。${"记".repeat(52)}。${"变".repeat(53)}。${"余波".repeat(20)}`,
    });
    expect(parseTimelineTurn(raw).narrative).toHaveLength(160);
  });

  it("keeps a complete three-sentence prehistory at the new visible limit", () => {
    const narrative = `${"前".repeat(52)}。${"情".repeat(52)}。${"险".repeat(53)}。`;
    expect(parseTimelineTurn(JSON.stringify({ ...turnFixture, narrative })).narrative).toBe(narrative);
  });

  it("accepts the prompted sentence range and tolerates two extra punctuation-delimited clauses", () => {
    const twoSentences = `${"前".repeat(44)}。${"险".repeat(44)}。`;
    const fourSentences = `${"前".repeat(24)}。${"因".repeat(24)}。${"争".repeat(24)}。${"险".repeat(24)}。`;
    const fiveSentences = `${"前".repeat(18)}。${"因".repeat(18)}。${"争".repeat(18)}。${"变".repeat(18)}。${"险".repeat(18)}。`;
    const sevenClauses = `${"前".repeat(12)}。${"因".repeat(12)}。${"争".repeat(12)}。${"变".repeat(12)}。${"险".repeat(12)}。${"得".repeat(12)}。${"失".repeat(12)}。`;

    expect(parseTimelineTurn(JSON.stringify({ ...turnFixture, narrative: twoSentences })).narrative)
      .toBe(twoSentences);
    expect(parseTimelineTurn(JSON.stringify({ ...turnFixture, narrative: fourSentences })).narrative)
      .toBe(fourSentences);
    expect(parseTimelineTurn(JSON.stringify({ ...turnFixture, narrative: fiveSentences })).narrative)
      .toBe(fiveSentences);
    expect(parseTimelineTurn(JSON.stringify({ ...turnFixture, narrative: sevenClauses })).narrative)
      .toBe(sevenClauses);
  });

  it("rejects a newly generated prehistory without enough complete context", () => {
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      narrative: `${"局".repeat(100)}。`,
    }))).toThrow(/至少两句完整叙事/);
  });

  it("injects active player canon ahead of model ledger without changing scene prose", () => {
    const narrative = turnFixture.narrative;
    const activeLedger = [
      { fact: "第三幕玩家改写已发生", causedByChapter: 3, mustAffect: "当前权力结构" },
      { fact: "第四幕玩家改写已发生", causedByChapter: 4, mustAffect: "当前军政命令" },
      { fact: "第五幕玩家改写已发生", causedByChapter: 5, mustAffect: "当前社会秩序" },
    ];
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      chapter: 6,
      chapterName: "执掌一方",
      previousEcho: turnFixture.choices[0].instantEcho,
      causalLedger: [
        { fact: "模型遗留的旧账本", causedByChapter: 1, mustAffect: "无关旧事件" },
      ],
    }), {
      expectedChapter: 6,
      expectedPreviousEcho: turnFixture.choices[0].instantEcho,
      expectedCausalLedger: activeLedger,
    });

    expect(parsed.causalLedger).toEqual(activeLedger);
    expect(parsed.narrative).toBe(narrative);
  });

  it("ends a trimmed narrative at a complete sentence when possible", () => {
    const completeSentence = `${"前".repeat(35)}。${"因".repeat(35)}。${"险".repeat(35)}。`;
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

  it("keeps exactly one modern-knowledge action", () => {
    const parsed = parseTimelineTurn(JSON.stringify(turnFixture));
    expect(parsed.choices.filter((choice) => choice.usesModernKnowledge)).toHaveLength(1);

    const duplicate = {
      ...turnFixture,
      choices: turnFixture.choices.map((choice) => ({ ...choice, usesModernKnowledge: true })),
    };
    const normalized = parseTimelineTurn(JSON.stringify(duplicate));
    expect(normalized.choices.filter((choice) => choice.usesModernKnowledge)).toHaveLength(1);
    expect(normalized.choices[0].usesModernKnowledge).toBe(true);
  });

  it("normalizes positional choice authority and trims non-visible nested action copy", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice) => ({
        ...choice,
        id: "C",
        deviationClass: "rupture",
        label: choice.label,
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
    expect(parsed.choices[0].label).toBe(turnFixture.choices[0].label);
    expect(parsed.choices[0].intent.length).toBeLessThanOrEqual(24);
    expect(parsed.choices[0].actionSpec).toMatchObject({
      actor: "人".repeat(20), action: "做".repeat(28), target: "物".repeat(28), deadline: "时".repeat(20),
    });
  });

  it("keeps an oversized canonical choice while deriving a compact display label", () => {
    const oversized = "公开在救济营支持老将军普劳图斯提出的分片重建计划，并调用全部水道重新划定七个供水区";
    expect([...oversized].length).toBeGreaterThan(36);

    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => (
        index === 0 ? {
          ...choice,
          label: oversized,
          actionSpec: {
            actor: "你",
            action: "支持重建计划",
            target: "七个供水区",
            deadline: "日落前",
          },
        } : choice
      )),
    }));

    expect(parsed.choices[0].label).toBe(oversized);
    expect(parsed.choices[0].displayLabel).toBe("支持重建计划：七个供水区");
  });

  it("rejects a choice label that ends on an unfinished connector", () => {
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => (
        index === 2 ? { ...choice, label: "查封木匠铺与建材市场，切断重建开工的" } : choice
      )),
    }))).toThrow(/完整/);
  });

  it("rejects a conditional fragment before it can become player canon", () => {
    for (const label of [
      "如果守军三日内拒绝交出城门",
      "因为守军拒绝换防",
      "待援军抵达城门",
      "当守军打开城门",
      "当前线失守时",
      "当日落之前",
      "为了重建沿江粮道",
      "因为守军拒绝换防，城门军令",
    ]) {
      expect(() => parseTimelineTurn(JSON.stringify({
        ...turnFixture,
        choices: turnFixture.choices.map((choice, index) => (
          index === 0 ? { ...choice, label } : choice
        )),
      }))).toThrow(/行动/);
    }
  });

  it.each([
    "当场扣下军令并封闭城门",
    "待命守军立即换防",
    "为了重建沿江粮道，征调三县民夫",
    "推动议案最终获得通过",
    "促成两地完成合并",
  ])("accepts an executable action instead of mistaking it for a dependent fragment: %s", (label) => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => (
        index === 0 ? { ...choice, label } : choice
      )),
    }));
    expect(parsed.choices[0].label).toBe(label);
  });

  it("repairs an oversized choice when no complete compact display label can be derived", () => {
    const canonical = "召集所有仍然忠于朝廷的边军将领公开核验军令来源并要求他们重新宣誓效忠否则立即解除兵权";
    expect([...canonical].length).toBeGreaterThan(36);

    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 0 ? {
        ...choice,
        label: canonical,
        actionSpec: {
          actor: "你",
          action: "召集".repeat(14),
          target: "边军".repeat(14),
          deadline: "日落前",
        },
      } : choice),
    }))).toThrow(/displayLabel/);
  });

  it("keeps a complete AI-authored clause from an oversized choice consequence", () => {
    const unexpectedCost = "元老院书记官封存全部供水账册导致听证中断，前线居民随后失去补给并公开抗议";
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => (
        index === 1
          ? { ...choice, instantEcho: { ...choice.instantEcho, unexpectedCost } }
          : choice
      )),
    }));

    expect(parsed.choices[1].instantEcho.unexpectedCost)
      .toBe("元老院书记官封存全部供水账册导致听证中断");
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
    expect(parsed.visualTone).toBe("ancient");
  });

  it("derives the non-visible choice intent from its executable label when V4-flash omits it", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map(({ intent: _intent, ...choice }) => choice),
    }));

    expect(parsed.choices.map((choice) => choice.intent))
      .toEqual(turnFixture.choices.map((choice) => [...choice.label].slice(0, 24).join("")));
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

  it("accepts a complete specific role up to 32 characters without cutting it", () => {
    const role = "国民议会财政预算与军需联合审查委员会首席书记官";
    const parsed = parseTimelineTurn(JSON.stringify({ ...turnFixture, role }));

    expect(parsed.role).toBe(role);
  });

  it("keeps a complete 32-character consequence party instead of repairing the whole scene", () => {
    const payer = "失去全部远洋航线经营权与港口税收豁免权的旧商人联合会";
    const choices = turnFixture.choices.map((choice, index) => index === 0
      ? { ...choice, instantEcho: { ...choice.instantEcho, payer } }
      : choice);

    expect(parseTimelineTurn(JSON.stringify({ ...turnFixture, choices })).choices[0].instantEcho.payer)
      .toBe(payer);
  });

  it("rejects oversized player-facing headings, roles, locations, and canonical choices", () => {
    expect(() => parseTimelineTurn(JSON.stringify({ ...turnFixture, headline: "过".repeat(23) })))
      .toThrow();
    expect(() => parseTimelineTurn(JSON.stringify({ ...turnFixture, role: "身份".repeat(17) })))
      .toThrow();
    expect(() => parseTimelineTurn(JSON.stringify({ ...turnFixture, location: "地点".repeat(15) })))
      .toThrow();
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: [{
        ...turnFixture.choices[0],
        label: "选".repeat(161),
        actionSpec: {
          actor: "你",
          action: "行".repeat(28),
          target: "目".repeat(28),
          deadline: "日落前",
        },
      }, turnFixture.choices[1], turnFixture.choices[2]],
    }))).toThrow();
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

  it("keeps compact causal fields within the mobile layout contract", () => {
    const causalBridge = "玩家决定已经通过驿站进入各州粮食制度。守军与商帮随后被迫公开每一笔军粮去向。";
    const timePressure = "三日后第一批赈济船抵达。元老院必须在此前完成公开表决并派出执行官。城门随后关闭。";
    expect([...causalBridge].length).toBeGreaterThan(36);
    expect([...timePressure].length).toBeGreaterThan(36);

    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge,
      timePressure,
    }));

    expect([...parsed.causalBridge].length).toBeLessThanOrEqual(36);
    expect([...parsed.timePressure].length).toBeLessThanOrEqual(36);
    expect(causalBridge.startsWith(parsed.causalBridge.replace(/。$/, ""))).toBe(true);
    expect(timePressure.startsWith(parsed.timePressure.replace(/。$/, ""))).toBe(true);
  });

  it("compacts an overlong causal bridge to an independent AI-authored clause", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge: "玩家命令已通过驿站传入边军，粮仓账册随即迫使三地守军公开部署并重新确认军令来源。",
    }));

    expect(parsed.causalBridge).toBe("玩家命令已通过驿站传入边军。");
  });

  it("compacts a coordinated causal sentence without inventing a replacement", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge: "玩家命令经驿站传入各州粮仓并迫使边军公开全部账册并重新确认军粮去向并持续封锁沿江渡口。",
    }));

    expect(parsed.causalBridge).toBe("玩家命令经驿站传入各州粮仓。");
  });

  it("compacts an overlong world change to one complete authored fact", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      worldStateChange: "三座城已经共同执行新法并迫使地方官署公开承认这项改变，旧军粮体系也随之停止运转，各州守军重新登记全部粮仓。",
    }));

    expect(parsed.worldStateChange).toBe("三座城已经共同执行新法。");
    expect([...parsed.worldStateChange].length).toBeLessThanOrEqual(48);
  });

  it("removes only dispensable aspect words from a slightly overlong complete causal sentence", () => {
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge: "玩家的决定已经通过整个州县驿站正式传入边军并进一步改变当前这项三地军粮部署。",
    }));

    expect(parsed.causalBridge).toBe("玩家的决定通过州县驿站传入边军并改变三地军粮部署。");
    expect(parsed.causalBridge).toMatch(/。$/);
  });

  it("keeps the full canonical choice when using a shorter action specification for display", () => {
    const canonical = "召集所有仍然忠于朝廷的边军将领公开核验军令来源并要求他们在日落之前重新宣誓效忠";
    const parsed = parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      choices: turnFixture.choices.map((choice, index) => index === 1 ? {
        ...choice,
        label: canonical,
        actionSpec: {
          actor: "你",
          action: "公开核验军令",
          target: "边军将领",
          deadline: "日落前",
        },
      } : choice),
    }));

    expect(parsed.choices[1].label).toBe(canonical);
    expect(parsed.choices[1].displayLabel).toBe("公开核验军令：边军将领");
  });

  it("never treats the condition before a comma as a complete causal bridge", () => {
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge: "如果三日后驿站仍未送达公开军令且城门守军没有收到换防通知，前线将立即失去粮道并陷入包围。",
    }))).toThrow(/causalBridge/);
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

  it("preserves complete AI-authored era and closing prose instead of slicing visible sentences", () => {
    const closingPassage = "沈砚没有看见这个世界的清晨。".repeat(15);
    const posthumousChronicle = endingFixture.posthumousChronicle.map((item) => ({
      ...item,
      narrative: `${item.narrative}它的余波又经由新的公共制度进入普通家庭，并在下一代的日常选择里继续扩散至更远的城市。`,
      inheritedChange: `${item.inheritedChange}这条遗产仍被后人完整保留，并写入每座城市的公共章程与学校课程。`,
    }));
    const raw = JSON.stringify({
      ...endingFixture,
      rewriteLevel: 82,
      plausibilityScore: "78",
      closingPassage,
      posthumousChronicle,
    });

    const report = parseWorldReport(raw);
    posthumousChronicle.forEach((item) => {
      expect(item.narrative.length).toBeGreaterThan(54);
      expect(item.inheritedChange.length).toBeGreaterThan(42);
    });
    expect(report.rewriteLevel).toBe("82");
    expect(report.plausibilityScore).toBe(78);
    expect(report.closingPassage).toBe(closingPassage);
    expect(report.posthumousChronicle).toEqual(posthumousChronicle);
  });

  it("accepts a complete world report that modestly exceeds the prompt target", () => {
    const narrative = `${"公开仓册逐步进入地方官署与商路，".repeat(5)}普通人终于能凭票追问每一笔粮食去向。`;
    const inheritedChange = `${"公开账簿成为地方自治机构共同底线，".repeat(4)}并延续到新的税粮制度。`;
    const closingPassage = "沈砚没有看见这一年。".repeat(20);
    expect([...narrative].length).toBeGreaterThan(96);
    expect([...inheritedChange].length).toBeGreaterThan(64);
    expect([...closingPassage].length).toBeGreaterThan(180);

    const report = parseWorldReport(JSON.stringify({
      ...endingFixture,
      posthumousChronicle: endingFixture.posthumousChronicle.map((item, index) => index === 0
        ? { ...item, narrative, inheritedChange }
        : item),
      closingPassage,
    }));

    expect(report.posthumousChronicle[0]).toMatchObject({ narrative, inheritedChange });
    expect(report.closingPassage).toBe(closingPassage);
  });

  it("rejects an abruptly cut 2026 chronicle sentence so field repair can finish it", () => {
    const raw = JSON.stringify({
      ...endingFixture,
      posthumousChronicle: endingFixture.posthumousChronicle.map((item, index) => index === 0
        ? { ...item, narrative: "主角死后，旧部把仓法交给地方官府，官府随后正式" }
        : item),
    });

    expect(() => parseWorldReport(raw)).toThrow(/完整句/);
  });

  it("rejects an ordinary-life sentence without a completed ending so field repair can finish it", () => {
    const raw = JSON.stringify({
      ...endingFixture,
      ordinaryLife2026: [
        "学生每天在历史课上查阅",
        ...endingFixture.ordinaryLife2026.slice(1),
      ],
    });

    expect(() => parseWorldReport(raw)).toThrow(/生活细节.*完整句/);
  });

  it("preserves a complete legacy paragraph beyond the former local truncation limit", () => {
    const lastingLegacy = "他留下的制度仍被后世沿用。".repeat(10);
    expect([...lastingLegacy].length).toBeGreaterThan(120);
    expect([...lastingLegacy].length).toBeLessThanOrEqual(180);

    const parsed = parseBiographyReport(JSON.stringify({
      ...endingFixture,
      deathScene: { ...endingFixture.deathScene, lastingLegacy },
    }));

    expect(parsed.deathScene.lastingLegacy).toBe(lastingLegacy);
  });

  it("rejects an unfinished displayed legacy instead of slicing or showing it", () => {
    expect(() => parseBiographyReport(JSON.stringify({
      ...endingFixture,
      deathScene: {
        ...endingFixture.deathScene,
        lastingLegacy: "因为地方官府开始。",
      },
    }))).toThrow(/身后遗产.*完整句/);
  });

  it("rejects a dangling 2026 share sentence", () => {
    expect(() => parseWorldReport(JSON.stringify({
      ...endingFixture,
      shareLine: "因为地方官府开始。",
    }))).toThrow(/分享语.*完整句/);
  });

  it.each([
    "地方官府把。",
    "地方官府将。",
    "地方官府向。",
    "地方官府并。",
    "地方官府因为。",
  ])("rejects a report sentence that stops on a dangling grammar word: %s", (shareLine) => {
    expect(() => parseWorldReport(JSON.stringify({
      ...endingFixture,
      shareLine,
    }))).toThrow(/分享语.*完整句/);
  });

  it.each([
    "地方官府把账簿。",
    "地方官府将新法。",
    "因为粮价上涨，地方官府把账簿。",
    "地方官府把改革方案。",
    "因为粮价上涨，地方官府账簿。",
  ])("rejects a report sentence whose final disposal structure has no predicate: %s", (shareLine) => {
    expect(() => parseWorldReport(JSON.stringify({
      ...endingFixture,
      shareLine,
    }))).toThrow(/分享语.*完整句/);
  });

  it.each([
    "士兵点燃火把。",
    "他成为一代名将。",
    "制度改变历史走向。",
    "议案最终获得通过。",
    "两地完成合并。",
    "法案最终通过。",
    "他最终晋升上将。",
    "教育成为他的毕生志向。",
    "两派最终火并。",
    "地方官府把账簿公开。",
    "地方官府将新法推广全国。",
    "他将成为一代名将。",
    "地方官府将改革制度。",
    "后世将开放市场。",
  ])("keeps a complete report sentence whose final character also forms a real word: %s", (shareLine) => {
    expect(parseWorldReport(JSON.stringify({
      ...endingFixture,
      shareLine,
    })).shareLine).toBe(shareLine);
  });

  it("never turns an unfinished conditional clause into a complete causal field at a comma", () => {
    const unfinishedConditional = "如果三日后驿站仍未送达公开军令且城门守军没有收到换防通知，前线将立即失去粮道并陷入包围";

    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      causalBridge: unfinishedConditional,
    }))).toThrow(/causalBridge/);
    expect(() => parseTimelineTurn(JSON.stringify({
      ...turnFixture,
      timePressure: unfinishedConditional,
    }))).toThrow(/timePressure/);
  });

  it("rejects a visibly incomplete world-report sentence for field repair", () => {
    expect(() => parseWorldReport(JSON.stringify({
      ...endingFixture,
      ordinaryLife2026: ["通勤者计划等待议会准备通过", ...endingFixture.ordinaryLife2026.slice(1)],
    }))).toThrow(/完整句/);
  });

  it("accepts a complete report sentence whose final verb is followed by terminal punctuation", () => {
    const raw = JSON.stringify({
      ...endingFixture,
      ordinaryLife2026: ["城市法案经公议院正式通过。", ...endingFixture.ordinaryLife2026.slice(1)],
    });

    expect(parseWorldReport(raw).ordinaryLife2026[0]).toBe("城市法案经公议院正式通过。");
  });

  it("rejects ordinary-life details shorter than 12 or longer than 18 characters", () => {
    const shortDetail = "市民乘列车准时上班。";
    const longDetail = "学生在课堂公开质询交通年度总预算方案。";
    expect(shortDetail).toHaveLength(10);
    expect(longDetail).toHaveLength(19);

    expect(() => parseWorldReport(JSON.stringify({
      ...endingFixture,
      ordinaryLife2026: [shortDetail, ...endingFixture.ordinaryLife2026.slice(1)],
    }))).toThrow();
    expect(() => parseWorldReport(JSON.stringify({
      ...endingFixture,
      ordinaryLife2026: [longDetail, ...endingFixture.ordinaryLife2026.slice(1)],
    }))).toThrow();
  });

  it("accepts ordinary-life details at the 12 and 18 character boundaries", () => {
    const minimumDetail = "市民乘驿路列车准时上班。";
    const maximumDetail = "学生在课堂公开质询交通年度预算方案。";
    expect(minimumDetail).toHaveLength(12);
    expect(maximumDetail).toHaveLength(18);

    const report = parseWorldReport(JSON.stringify({
      ...endingFixture,
      ordinaryLife2026: [minimumDetail, maximumDetail, endingFixture.ordinaryLife2026[2]],
    }));
    expect(report.ordinaryLife2026.slice(0, 2)).toEqual([minimumDetail, maximumDetail]);
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
