import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { adjudicateCustomAction, generateEnding, generateNextTurn, generateOpening, StructuredGenerationError } from "../game/engine";
import { parseTimelineTurn } from "../game/schema";
import { endingFixture, turnFixture } from "../test/fixtures";
import { requestCompletion } from "./deepseek";
import { CHAPTER_NAMES, getTimelineNode, type DecisionChapter } from "../game/timelinePlan";

const messages = [{ role: "system" as const, content: "system" }, { role: "user" as const, content: "user" }];
const scenario = { seed: HISTORY_SEEDS[0] };
const firstTurn = parseTimelineTurn(JSON.stringify(turnFixture));
const playedTurn = { turn: firstTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: firstTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: firstTurn.choices[0].instantEcho };
const endingPlayedTurns = endingFixture.historyTimeline.map((item, index) => ({
  turn: parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: index + 1, chapterName: CHAPTER_NAMES[(index + 1) as DecisionChapter], protagonistAge: getTimelineNode((index + 1) as DecisionChapter, scenario.seed.year).protagonistAge, lifeStage: getTimelineNode((index + 1) as DecisionChapter, scenario.seed.year).lifeStage, previousEcho: index === 0 ? null : turnFixture.choices[0].instantEcho })),
  selectedChoiceId: "A" as const, selectedChoiceLabel: item.playerChoice, selectedDeviationClass: "nudge" as const, resolvedEcho: turnFixture.choices[0].instantEcho,
}));

function completion(content = '{"ok":true}') {
  return new Response(JSON.stringify({ id: "test", choices: [{ message: { role: "assistant", content } }] }), { status: 200, headers: { "Content-Type": "application/json" } });
}

describe("DeepSeek transport and structured generation", () => {
  beforeEach(() => { vi.stubEnv("VITE_DEEPSEEK_API_KEY", "test-key"); vi.stubEnv("VITE_DEEPSEEK_MODEL", "deepseek-v4-flash"); });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers(); });

  it("uses DeepSeek V4 Flash JSON mode", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion()); vi.stubGlobal("fetch", fetcher);
    await expect(requestCompletion(messages, { phase: "turn" })).resolves.toBe('{"ok":true}');
    const body = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(body).toMatchObject({ model: "deepseek-v4-flash", thinking: { type: "enabled" }, reasoning_effort: "high", response_format: { type: "json_object" }, stream: false });
    expect(body.max_tokens).toBe(8192);
    expect(fetcher.mock.calls[0][1].headers.Authorization).toBe("Bearer test-key");
  });

  it("enables high effort reasoning for the final alternate present", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion()); vi.stubGlobal("fetch", fetcher);
    await requestCompletion(messages, { phase: "ending" });
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({ thinking: { type: "enabled" }, reasoning_effort: "high", max_tokens: 8192 });
  });

  it("repairs one invalid opening and validates the concrete traveler fields", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(completion('{"timelineName":"缺字段"}')).mockResolvedValueOnce(completion(JSON.stringify(turnFixture)));
    vi.stubGlobal("fetch", fetcher);
    await expect(generateOpening(scenario)).resolves.toMatchObject({ chapter: 1, role: turnFixture.role, timePressure: turnFixture.timePressure });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("regenerates once after an invalid repair", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(completion('{"bad":1}'))
      .mockResolvedValueOnce(completion('{"still":"bad"}'))
      .mockResolvedValueOnce(completion(JSON.stringify(turnFixture)));
    vi.stubGlobal("fetch", fetcher);
    await expect(generateOpening(scenario)).resolves.toMatchObject({ chapter: 1, headline: turnFixture.headline });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("surfaces a retryable structure error instead of inventing a generic local turn", async () => {
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion('{"bad":true}')));
    vi.stubGlobal("fetch", fetcher);
    await expect(generateOpening(scenario)).rejects.toBeInstanceOf(StructuredGenerationError);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("surfaces an empty model response instead of replacing history with a template", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion(""));
    vi.stubGlobal("fetch", fetcher);
    await expect(generateOpening(scenario)).rejects.toBeInstanceOf(StructuredGenerationError);
  });

  it("generates the requested continuation with authoritative previous echo", async () => {
    const second = {
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: turnFixture.choices[0].instantEcho,
      rippleLens: "livelihood",
      role: "全国粮政使",
      location: "土地与粮食分配大会",
      headline: "粮食法决定民生",
      narrative: "公开遗诏改变继承，土地与粮食法成为新政权第一次全国决断。",
      causalBridge: "公开遗诏经新政权命令进入土地与粮食分配",
      turningPointStakes: "这项土地法将决定粮食、劳动与人口的长期分配",
      worldStateChange: "立刻放出第一批火船已成正史，曹军左翼火势提前扩散",
      divergenceProof: "真实历史没有公开粮食议政，当前线由遗诏催生全国土地大会",
      immediateObjective: "决定土地与粮食优先保障谁",
      causalLedger: [{ fact: "立刻放出第一批火船", causedByChapter: 1, mustAffect: "曹军水寨与粮道" }],
    };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(second))); vi.stubGlobal("fetch", fetcher);
    await expect(generateNextTurn(scenario, [playedTurn], 2)).resolves.toMatchObject({ chapter: 2, yearLabel: `${scenario.seed.year}年 · 三日后 · 24岁`, protagonistName: firstTurn.protagonistName, previousEcho: turnFixture.choices[0].instantEcho, rippleLens: "livelihood", worldStateChange: expect.stringContaining("立刻放出第一批火船") });
  });

  it("keeps the model-selected social lens instead of routing through a client template", async () => {
    const unchanged = { ...turnFixture, chapter: 2, chapterName: "三日余波", lifeStage: "三日后", previousEcho: turnFixture.choices[0].instantEcho };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(unchanged))));
    vi.stubGlobal("fetch", fetcher);
    const result = await generateNextTurn(scenario, [playedTurn], 2);

    expect(result).toMatchObject({ generationSource: "deepseek", rippleLens: "origin" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("rejects a continuation that negates an active player-authored fact", async () => {
    const customPlayed = {
      ...playedTurn,
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: "我成为新皇帝",
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: { ...playedTurn.resolvedEcho, directResult: "我成为新皇帝" },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "登基诏书进入官署执行",
    };
    const contradictory = {
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: customPlayed.resolvedEcho,
      rippleLens: "power",
      role: "新朝册立使",
      location: "继承诏书宣读现场",
      headline: "新政权第一次册立",
      narrative: "宫门已经封闭，但称帝计划最终失败。",
      causalBridge: "继承命令抵达政权核心",
      turningPointStakes: "这次册立决定新政权是否合法",
      worldStateChange: "你并未成为皇帝，旧君仍在位",
      divergenceProof: "当前线称帝失败",
      immediateObjective: "决定继承诏书由谁宣读",
      causalLedger: [{ fact: "我成为新皇帝", causedByChapter: 1, mustAffect: "继承与政权" }],
    };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(contradictory))));
    vi.stubGlobal("fetch", fetcher);

    await expect(generateNextTurn(scenario, [customPlayed], 2)).rejects.toBeInstanceOf(StructuredGenerationError);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("returns a player-canon result without feasibility adjudication", async () => {
    const ruling = {
      declaredOutcome: "我暗杀了皇帝且成功",
      canonStatus: "玩家钦定",
      causalMechanism: "死讯通过禁军口令传入摄政会议",
      deviationClass: "rupture",
      instantEcho: turnFixture.choices[1].instantEcho,
    };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(ruling)));
    vi.stubGlobal("fetch", fetcher);
    const result = await adjudicateCustomAction(scenario, [], firstTurn, "我暗杀了皇帝且成功");
    expect(result).toMatchObject({ declaredOutcome: "我暗杀了皇帝且成功", canonStatus: "玩家钦定", deviationClass: "rupture", instantEcho: { directResult: "我暗杀了皇帝且成功" } });
    expect(JSON.stringify(result)).not.toMatch(/人格|INTP|ENFP/);
    expect(result.causalMechanism).toContain("宫门口令");
  });

  it("rejects a model attempt to negate the declared result and falls back to canon", async () => {
    const genericRuling = {
      declaredOutcome: "我试图暗杀皇帝但失败",
      canonStatus: "玩家钦定",
      causalMechanism: "消息没有传出宫门",
      deviationClass: "nudge",
      instantEcho: turnFixture.choices[1].instantEcho,
    };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(genericRuling))));
    vi.stubGlobal("fetch", fetcher);

    const result = await adjudicateCustomAction(scenario, [], firstTurn, "我暗杀了皇帝且成功");

    expect(result.declaredOutcome).toBe("我暗杀了皇帝且成功");
    expect(result.canonStatus).toBe("玩家钦定");
    expect(JSON.stringify(result)).not.toMatch(/人格|INTP|ENFP/);
    expect(JSON.stringify(result)).not.toContain("失败");
    expect(fetcher.mock.calls.length).toBeGreaterThan(1);
  });

  it("rejects a hidden contradiction in the derived cost fields", async () => {
    const contradictory = {
      declaredOutcome: "我暗杀了皇帝且成功",
      canonStatus: "玩家钦定",
      causalMechanism: "死讯通过禁军口令传入摄政会议",
      deviationClass: "rupture",
      instantEcho: {
        ...turnFixture.choices[1].instantEcho,
        unexpectedCost: "但皇帝其实未死，刺杀最终失败",
      },
    };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(contradictory))));
    vi.stubGlobal("fetch", fetcher);

    const result = await adjudicateCustomAction(scenario, [], firstTurn, "我暗杀了皇帝且成功");

    expect(result.instantEcho.directResult).toBe("我暗杀了皇帝且成功");
    expect(JSON.stringify(result)).not.toMatch(/其实未死|最终失败/);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("keeps all twelve player choices authoritative in the ending", async () => {
    const wrong = { ...endingFixture, historyTimeline: endingFixture.historyTimeline.map((item) => ({ ...item, playerChoice: "错误选择" })) };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(wrong))); vi.stubGlobal("fetch", fetcher);
    const ending = await generateEnding(scenario, endingPlayedTurns);
    expect(ending.historyTimeline.map((item) => item.playerChoice)).toEqual(endingPlayedTurns.map((item) => item.selectedChoiceLabel));
  });

  it("rejects an ending consequence that negates player-authored canon", async () => {
    const customPlayedTurns = endingPlayedTurns.map((played, index) => index === 0 ? {
      ...played,
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: "我成为新皇帝",
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: { ...played.resolvedEcho, directResult: "我成为新皇帝" },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "登基诏书进入官署执行",
    } : played);
    const contradictory = {
      ...endingFixture,
      historyTimeline: endingFixture.historyTimeline.map((item, index) => ({
        ...item,
        consequence: index === 0 ? "称帝计划最终失败，旧君继续统治" : item.consequence,
      })),
    };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(contradictory))));
    vi.stubGlobal("fetch", fetcher);

    await expect(generateEnding(scenario, customPlayedTurns)).rejects.toBeInstanceOf(StructuredGenerationError);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("keeps an invalid ending retryable instead of fabricating a local report", async () => {
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion('{"bad":true}')));
    vi.stubGlobal("fetch", fetcher);
    await expect(generateEnding(scenario, endingPlayedTurns)).rejects.toBeInstanceOf(StructuredGenerationError);
  });
});
