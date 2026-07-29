import { afterEach, describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import {
  adjudicateCustomAction,
  generateEnding,
  generateNextTurn,
  generateRerolledChoices,
  StructuredGenerationError,
} from "../game/engine";
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
const biographyFixture = {
  lifeStory: endingFixture.lifeStory,
  protagonistName: endingFixture.protagonistName,
  lifespanSummary: endingFixture.lifespanSummary,
  deathScene: endingFixture.deathScene,
};
const worldReportFixture = {
  worldName: endingFixture.worldName,
  frontPageHeadline: endingFixture.frontPageHeadline,
  ordinaryLife2026: endingFixture.ordinaryLife2026,
  posthumousChronicle: endingFixture.posthumousChronicle,
  closingPassage: endingFixture.closingPassage,
};

function completion(content = '{"ok":true}') {
  return new Response(JSON.stringify({ id: "test", choices: [{ message: { role: "assistant", content } }] }), { status: 200, headers: { "Content-Type": "application/json" } });
}

function streamedCompletion(chunks: readonly string[]) {
  const encoder = new TextEncoder();
  return new Response(new ReadableStream({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  }), { status: 200, headers: { "Content-Type": "text/event-stream" } });
}

function streamedBytes(chunks: readonly Uint8Array[]) {
  return new Response(new ReadableStream({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  }), { status: 200, headers: { "Content-Type": "text/event-stream" } });
}

function choicesWithPower(
  choices: readonly (typeof turnFixture.choices)[number][],
  powerId: "blink-self" | "stop-time" | "teleport-crowd",
) {
  return choices.map((choice, index) => index === 2
    ? {
        ...choice,
        powerId,
        actionSpec: { ...choice.actionSpec, actor: "你" },
      }
    : choice);
}

describe("DeepSeek transport and structured generation", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers(); });

  it("uses the versioned same-origin history proxy without exposing a bearer key", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion()); vi.stubGlobal("fetch", fetcher);
    await expect(requestCompletion(messages, { phase: "turn" })).resolves.toBe('{"ok":true}');
    const body = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(fetcher.mock.calls[0][0]).toBe("/api/deepseek/completions");
    expect(body).toMatchObject({
      version: 1,
      phase: "turn",
      requestKind: "turn-primary",
      reasoning: "high",
      messages,
    });
    expect(body).not.toHaveProperty("model");
    expect(body).not.toHaveProperty("max_tokens");
    expect(fetcher.mock.calls[0][1].headers).not.toHaveProperty("Authorization");
  });

  it("uses a real non-thinking fast path for playable continuation requests", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion());
    vi.stubGlobal("fetch", fetcher);

    await requestCompletion(messages, { phase: "turn", reasoning: "fast", requestKind: "turn-primary" });

    const body = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(body.reasoning).toBe("fast");
    expect(body.requestKind).toBe("turn-primary");
    expect(body).not.toHaveProperty("thinking");
  });

  it("recovers from a short 503 window with jittered backoff", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(completion());
    vi.stubGlobal("fetch", fetcher);

    const pending = requestCompletion(messages, { phase: "turn", reasoning: "fast" });
    await vi.runAllTimersAsync();

    await expect(pending).resolves.toBe('{"ok":true}');
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("honors Retry-After for a rate-limited request", async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "Retry-After": "2" } }))
      .mockResolvedValueOnce(completion());
    vi.stubGlobal("fetch", fetcher);

    const pending = requestCompletion(messages, { phase: "turn", reasoning: "fast" });
    await vi.advanceTimersByTimeAsync(2_999);
    expect(fetcher).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);

    await expect(pending).resolves.toBe('{"ok":true}');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("does not retry a non-transient client error", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 400 }));
    vi.stubGlobal("fetch", fetcher);

    await expect(requestCompletion(messages, { phase: "turn", reasoning: "fast" }))
      .rejects.toMatchObject({ code: "request_failed", status: 400 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("reassembles UTF-8 JSON from arbitrarily split SSE chunks and reports real stages once", async () => {
    const events = [
      'data: {"choices":[{"delta":{"reasoning_content":"先核对史实"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"{\\"标题\\":\\"赤"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"壁\\"}"}}]}\n\n',
      'data: {"choices":[],"usage":{"prompt_tokens":100,"prompt_cache_hit_tokens":80,"prompt_cache_miss_tokens":20,"completion_tokens":12,"total_tokens":112}}\n\n',
      'data: [DONE]\n\n',
    ].join("");
    const bytes = new TextEncoder().encode(events);
    const response = streamedBytes(Array.from(bytes, (byte) => Uint8Array.of(byte)));
    const fetcher = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetcher);
    const stages: string[] = [];
    const metrics: Array<Record<string, unknown>> = [];

    await expect(requestCompletion(messages, {
      phase: "turn",
      requestKind: "turn-primary",
      onProgress: (progress) => stages.push(progress.stage),
      onMetrics: (metric) => metrics.push(metric),
    })).resolves.toBe('{"标题":"赤壁"}');

    expect(stages).toEqual(["connected", "reasoning", "writing", "validating"]);
    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toMatchObject({
      phase: "turn",
      requestKind: "turn-primary",
      reasoning: "high",
      attempt: 1,
      usage: {
        promptTokens: 100,
        promptCacheHitTokens: 80,
        promptCacheMissTokens: 20,
        completionTokens: 12,
        totalTokens: 112,
      },
    });
    expect(metrics[0].firstReasoningTokenMs).toEqual(expect.any(Number));
    expect(metrics[0].firstContentTokenMs).toEqual(expect.any(Number));
    expect(metrics[0].totalMs).toEqual(expect.any(Number));
  });

  it("streams only closed JSON fields as an in-memory readable draft", async () => {
    const response = streamedCompletion([
      'data: {"choices":[{"delta":{"content":"{\\"headline\\":\\"盐路突然断绝\\",\\"narrative\\":\\"旧军令已经"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"抬高盐价。商帮与守军正在争夺盐引。\\",\\"immediateObjective\\":\\"封存盐仓\\""}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"}"},"finish_reason":"stop"}]}\n\n',
      'data: [DONE]\n\n',
    ]);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
    const drafts: Array<Record<string, unknown>> = [];

    await requestCompletion(messages, {
      phase: "turn",
      reasoning: "fast",
      onPartial: (draft) => drafts.push(draft),
    });

    expect(drafts.some((draft) => draft.headline === "盐路突然断绝" && draft.narrative === undefined)).toBe(true);
    expect(drafts.at(-1)).toMatchObject({
      headline: "盐路突然断绝",
      narrative: "旧军令已经抬高盐价。商帮与守军正在争夺盐引。",
      immediateObjective: "封存盐仓",
    });
    expect(drafts.map((draft) => String(draft.narrative ?? ""))).not.toContain("旧军令已经");
  });

  it("enables high effort reasoning for the final alternate present", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion()); vi.stubGlobal("fetch", fetcher);
    await requestCompletion(messages, { phase: "ending" });
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({
      phase: "ending",
      requestKind: "ending-primary",
      reasoning: "high",
    });
  });

  it("generates the requested continuation with authoritative previous echo", async () => {
    const second = {
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: turnFixture.choices[0].instantEcho,
      role: "全国粮政使",
      location: "土地与粮食分配大会",
      headline: "粮食法决定民生",
      narrative: "公开遗诏已经改变继承秩序，各地粮仓开始拒绝旧贵族调粮，长安米价在三日内翻倍。新政权的执政者、军府与商帮围住粮册争夺第一批赈济去向，城门外已有饥民聚集。你作为全国粮政使掌握仓印与驿站，必须在日落前决定先救哪一方，否则守军会为争粮发生兵变。",
      causalBridge: "公开遗诏经新政权命令进入土地与粮食分配",
      worldStateChange: "立刻放出第一批火船已成正史，曹军左翼火势提前扩散",
      divergenceProof: "真实历史没有公开的全国粮食议政，土地与粮食仍由既有军政体系分配",
      immediateObjective: "决定土地与粮食优先保障谁",
      causalLedger: [{ fact: "立刻放出第一批火船", causedByChapter: 1, mustAffect: "曹军水寨与粮道" }],
    };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(second))); vi.stubGlobal("fetch", fetcher);
    await expect(generateNextTurn(scenario, [playedTurn], 2)).resolves.toMatchObject({ chapter: 2, yearLabel: `公元 ${scenario.seed.year} 年 · 三日后 · 24岁`, protagonistName: firstTurn.protagonistName, previousEcho: turnFixture.choices[0].instantEcho, worldStateChange: expect.stringContaining("立刻放出第一批火船") });
  });

  it("accepts a valid scene without requesting an obsolete social-lens field", async () => {
    const unchanged = { ...turnFixture, chapter: 2, chapterName: "三日余波", lifeStage: "三日后", previousEcho: turnFixture.choices[0].instantEcho };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(unchanged))));
    vi.stubGlobal("fetch", fetcher);
    const result = await generateNextTurn(scenario, [playedTurn], 2);

    expect(result).toMatchObject({ generationSource: "deepseek" });
    expect(result).not.toHaveProperty("rippleLens");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("accepts only the two exact client-assigned powers for a continuation", async () => {
    const assigned = {
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: turnFixture.choices[0].instantEcho,
      choices: choicesWithPower(turnFixture.choices, "blink-self"),
      rollChoices: choicesWithPower(turnFixture.rollChoices, "stop-time"),
    };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(assigned)));
    vi.stubGlobal("fetch", fetcher);

    const result = await generateNextTurn(scenario, [playedTurn], 2, {
      assignedPowerIds: ["blink-self", "stop-time"],
    });

    expect(result.choices[2]).toMatchObject({ powerId: "blink-self", actionSpec: { actor: "你" } });
    expect(result.rollChoices[2]).toMatchObject({ powerId: "stop-time", actionSpec: { actor: "你" } });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("keeps a live Roll on the exact power assigned by the client", async () => {
    const choices = choicesWithPower(turnFixture.choices, "teleport-crowd");
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify({ choices })));
    vi.stubGlobal("fetch", fetcher);

    const result = await generateRerolledChoices(
      scenario,
      [playedTurn],
      firstTurn,
      2,
      firstTurn.rollChoices,
      { assignedPowerId: "teleport-crowd" },
    );

    expect(result[2]).toMatchObject({
      powerId: "teleport-crowd",
      actionSpec: { actor: "你" },
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("reports validation evidence and recovers once after a failed field patch", async () => {
    const second = {
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: playedTurn.resolvedEcho,
    };
    const missingHeadline = { ...second, headline: undefined };
    const responses = [
      JSON.stringify(missingHeadline),
      JSON.stringify({ headline: "" }),
      JSON.stringify(second),
    ];
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(responses.shift())));
    vi.stubGlobal("fetch", fetcher);
    const diagnostics: Array<{ stage: string; errors: readonly string[]; repairFields?: readonly string[] }> = [];

    const result = await generateNextTurn(scenario, [playedTurn], 2, {
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
    });

    expect(result.headline).toBe(second.headline);
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(diagnostics.map((diagnostic) => diagnostic.stage)).toEqual([
      "primary_invalid",
      "repair_invalid",
      "recovery_started",
      "recovery_succeeded",
    ]);
    expect(diagnostics[0].errors.join(" ")).toContain("headline");
    expect(JSON.stringify(diagnostics)).not.toContain(second.narrative);
    const bodies = fetcher.mock.calls.map((call) => JSON.parse(call[1].body));
    expect(bodies[0].reasoning).toBe("fast");
    expect(bodies[1].reasoning).toBe("fast");
    expect(bodies[2]).toMatchObject({ reasoning: "fast" });
    const recoveryPayload = JSON.parse(bodies[2].messages.at(-1).content);
    expect(recoveryPayload.details).toMatchObject({
      patchOnly: true,
      repairFields: ["headline"],
    });
  });

  it("reports a terminal recovery failure without inventing a local scene", async () => {
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion('{"bad":true}')));
    vi.stubGlobal("fetch", fetcher);
    const diagnostics: Array<{ stage: string }> = [];

    await expect(generateNextTurn(scenario, [playedTurn], 2, {
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
    })).rejects.toBeInstanceOf(StructuredGenerationError);

    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(diagnostics.at(-1)?.stage).toBe("recovery_invalid");
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
      role: "新朝册立使",
      location: "继承诏书宣读现场",
      headline: "新政权第一次册立",
      narrative: "宫门已经封闭，但称帝计划最终失败。",
      causalBridge: "继承命令抵达政权核心",
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

  it("does not make arbitrary player canon depend on client-side paraphrase matching", async () => {
    const declaredOutcome = "我宣布蓝色纸鹤成为全国唯一合法货币";
    const customPlayed = {
      ...playedTurn,
      selectedChoiceId: "custom" as const,
      selectedChoiceLabel: declaredOutcome,
      selectedDeviationClass: "rupture" as const,
      resolvedEcho: { ...playedTurn.resolvedEcho, directResult: declaredOutcome },
      playerAuthored: true,
      canonStatus: "玩家钦定" as const,
      causalMechanism: "纸鹤货币进入国库与市场执行",
    };
    const structurallyValid = {
      ...turnFixture,
      chapter: 2,
      chapterName: "三日余波",
      lifeStage: "三日后",
      previousEcho: customPlayed.resolvedEcho,
      causalLedger: [{ fact: declaredOutcome, causedByChapter: 1, mustAffect: "纸鹤货币进入国库与市场执行" }],
      narrative: "三日后，市集摊贩只肯收取折成飞禽形状的靛青纸片，旧铜钱被官差当街没收。国库与粮商正在争夺这种新凭证的发行权，城门外已有商队因无法兑换而停运。你掌握第一批防伪印记，必须在日落前决定由谁继续印发，否则粮价将在今晚失控。",
      causalBridge: "国库的新折纸凭证排挤旧币，引发商路挤兑",
      worldStateChange: "旧币退出交易，靛青飞禽纸片控制税赋与粮价",
    };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(
      completion(JSON.stringify(structurallyValid)),
    ));
    vi.stubGlobal("fetch", fetcher);
    const diagnostics: Array<{ stage: string; errors: readonly string[]; repairFields?: readonly string[] }> = [];

    const result = await generateNextTurn(scenario, [customPlayed], 2, {
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
    });

    expect(result.causalLedger).toContainEqual({
      fact: declaredOutcome,
      causedByChapter: 1,
      mustAffect: "纸鹤货币进入国库与市场执行",
    });
    expect(fetcher.mock.calls[0][1].body).toContain(declaredOutcome);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(diagnostics).toEqual([]);
  });

  it("repairs only the stale opening role after chapter three", async () => {
    const node = getTimelineNode(4, scenario.seed.year);
    const staleRole = {
      ...turnFixture,
      chapter: 4,
      chapterName: CHAPTER_NAMES[4],
      protagonistAge: node.protagonistAge,
      lifeStage: node.lifeStage,
      previousEcho: endingPlayedTurns[2].resolvedEcho,
      role: scenario.seed.role,
    };
    const fetcher = vi.fn()
      .mockResolvedValueOnce(completion(JSON.stringify(staleRole)))
      .mockResolvedValueOnce(completion(JSON.stringify({ role: "江东水运总管" })));
    vi.stubGlobal("fetch", fetcher);
    const diagnostics: Array<{ stage: string; repairFields?: readonly string[] }> = [];

    const result = await generateNextTurn(scenario, endingPlayedTurns.slice(0, 3), 4, {
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
    });

    expect(result.role).toBe("江东水运总管");
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(diagnostics[0]).toMatchObject({ stage: "primary_invalid", repairFields: ["role"] });
  });

  it("allows the opening event to remain a causal source after chapter three", async () => {
    const node = getTimelineNode(4, scenario.seed.year);
    const causalMention = {
      ...turnFixture,
      chapter: 4,
      chapterName: CHAPTER_NAMES[4],
      protagonistAge: node.protagonistAge,
      lifeStage: node.lifeStage,
      previousEcho: endingPlayedTurns[2].resolvedEcho,
      role: "江东转运使",
      headline: "漕粮新法引爆江防争夺",
      narrative: `${scenario.seed.eventName}留下的军籍与粮册已经沿长江进入地方官署，旧将和新任郡守正在争夺征粮权。你以江东转运使身份掌握仓印与船队，必须在日落前决定由谁接管三郡漕粮，否则前线守军会在今晚断供。`,
      immediateObjective: "决定三郡漕粮和江防军册由谁接管",
    };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(causalMention)));
    vi.stubGlobal("fetch", fetcher);

    const result = await generateNextTurn(scenario, endingPlayedTurns.slice(0, 3), 4);

    expect(result.narrative).toContain(scenario.seed.eventName);
    expect(result.headline).toBe("漕粮新法引爆江防争夺");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("continues after three rewrites by carrying all active mandates into the final turn", async () => {
    const threeCustom = endingPlayedTurns.slice(0, 3).map((played, index) => {
      const result = `第${index + 1}幕玩家改写已经成为正史`;
      return {
        ...played,
        selectedChoiceId: "custom" as const,
        selectedChoiceLabel: result,
        selectedDeviationClass: "rupture" as const,
        resolvedEcho: { ...played.resolvedEcho, directResult: result },
        playerAuthored: true,
        canonStatus: "玩家钦定" as const,
        causalMechanism: `第${index + 1}幕命令经驿站进入官署`,
      };
    });
    const node = getTimelineNode(4, scenario.seed.year);
    const fourth = {
      ...turnFixture,
      chapter: 4,
      chapterName: CHAPTER_NAMES[4],
      protagonistAge: node.protagonistAge,
      lifeStage: node.lifeStage,
      previousEcho: threeCustom[2].resolvedEcho,
      role: "江东新政军政总管",
      location: "建业石头城中军堂",
      headline: "江东新法进入军营",
      narrative: "第五幕颁下的军政命令已经沿长江驿站抵达建业，各郡守军开始按新法重新登记兵粮。孙权旧部与新任郡守正在石头城争夺军册和粮仓印信，堂外已有士卒拒绝旧将调遣。你以军政总管身份掌握新印与传令船，必须在日落前决定由谁接管江防，否则两套军令会在前线直接冲突。",
      causalLedger: [],
    };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(fourth))));
    vi.stubGlobal("fetch", fetcher);

    const result = await generateNextTurn(scenario, threeCustom, 4);

    expect(result.causalLedger.map((entry) => entry.causedByChapter)).toEqual([1, 2, 3]);
    expect(result.causalLedger.map((entry) => entry.fact)).toEqual(
      threeCustom.map((played) => played.selectedChoiceLabel),
    );
    expect(result.narrative).toBe(fourth.narrative);
    expect(fetcher).toHaveBeenCalledTimes(1);
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

  it("keeps all four player choices authoritative in the ending", async () => {
    const wrong = { ...endingFixture, historyTimeline: endingFixture.historyTimeline.map((item) => ({ ...item, playerChoice: "错误选择" })) };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(wrong)))); vi.stubGlobal("fetch", fetcher);
    const ending = await generateEnding(scenario, endingPlayedTurns);
    expect(ending.historyTimeline.map((item) => item.playerChoice)).toEqual(endingPlayedTurns.map((item) => item.selectedChoiceLabel));
  });

  it("keeps four long custom choices authoritative without asking the model to restate them", async () => {
    const customPlayedTurns = endingPlayedTurns.map((played, index) => {
      const result = `第${index + 1}幕我亲自颁布的新制度已经在全国生效并由各地官署执行`;
      return {
        ...played,
        selectedChoiceId: "custom" as const,
        selectedChoiceLabel: result,
        selectedDeviationClass: "rupture" as const,
        resolvedEcho: { ...played.resolvedEcho, directResult: result },
        playerAuthored: true,
        canonStatus: "玩家钦定" as const,
        causalMechanism: `第${index + 1}幕诏令进入全国官署`,
      };
    });
    const biography = biographyFixture;
    const worldReport = worldReportFixture;
    const fetcher = vi.fn().mockImplementation((_url, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      const userPayload = JSON.parse(body.messages.at(-1).content);
      return Promise.resolve(completion(JSON.stringify(
        userPayload.outputContract?.compactShape?.includes('"b"') ? biography : worldReport,
      )));
    });
    vi.stubGlobal("fetch", fetcher);

    const ending = await generateEnding(scenario, customPlayedTurns);

    expect(ending.historyTimeline.map((item) => item.playerChoice))
      .toEqual(customPlayedTurns.map((item) => item.selectedChoiceLabel));
    expect(ending.historyTimeline[0].consequence).toContain(customPlayedTurns[0].resolvedEcho.directResult);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("repairs a cut 2026 chronicle field without rewriting the valid world report", async () => {
    const biography = biographyFixture;
    const incompleteWorldReport = {
      ...worldReportFixture,
      posthumousChronicle: endingFixture.posthumousChronicle.map((item, index) => index === 0
        ? { ...item, narrative: "主角死后，旧部把仓法交给地方官府，官府随后正式" }
        : item),
    };
    const fetcher = vi.fn().mockImplementation((_url, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      const payload = JSON.parse(body.messages.at(-1).content);
      if (payload.outputContract?.compactShape?.includes('"b"')) {
        return Promise.resolve(completion(JSON.stringify(biography)));
      }
      if (payload.details?.repairFields?.includes("posthumousChronicle")) {
        return Promise.resolve(completion(JSON.stringify({
          posthumousChronicle: endingFixture.posthumousChronicle,
        })));
      }
      return Promise.resolve(completion(JSON.stringify(incompleteWorldReport)));
    });
    vi.stubGlobal("fetch", fetcher);
    const diagnostics: Array<{ target: string; stage: string; repairFields?: readonly string[] }> = [];

    const ending = await generateEnding(scenario, endingPlayedTurns, {
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
    });

    expect(ending.frontPageHeadline).toBe(endingFixture.frontPageHeadline);
    expect(ending.posthumousChronicle).toEqual(endingFixture.posthumousChronicle);
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(diagnostics).toContainEqual(expect.objectContaining({
      target: "world_report",
      stage: "primary_invalid",
      repairFields: ["posthumousChronicle"],
    }));
  });

  it("starts the biography and 2026 report requests concurrently before merging them", async () => {
    const biography = biographyFixture;
    const worldReport = worldReportFixture;
    const resolvers: Array<(response: Response) => void> = [];
    const fetcher = vi.fn().mockImplementation(() => new Promise<Response>((resolve) => resolvers.push(resolve)));
    vi.stubGlobal("fetch", fetcher);

    const pending = generateEnding(scenario, endingPlayedTurns);
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
    resolvers[0]?.(completion(JSON.stringify(biography)));
    resolvers[1]?.(completion(JSON.stringify(worldReport)));

    await expect(pending).resolves.toMatchObject({
      protagonistName: endingFixture.protagonistName,
      worldName: endingFixture.worldName,
    });
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
      lifeStory: "沈砚曾试图称帝，但称帝计划最终失败，旧君继续统治。后来他在流亡中度过余生。",
    };
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion(JSON.stringify(contradictory))));
    vi.stubGlobal("fetch", fetcher);

    await expect(generateEnding(scenario, customPlayedTurns)).rejects.toBeInstanceOf(StructuredGenerationError);
    expect(fetcher).toHaveBeenCalledTimes(4);
  });

  it("keeps an invalid ending retryable instead of fabricating a local report", async () => {
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion('{"bad":true}')));
    vi.stubGlobal("fetch", fetcher);
    await expect(generateEnding(scenario, endingPlayedTurns)).rejects.toBeInstanceOf(StructuredGenerationError);
  });
});
