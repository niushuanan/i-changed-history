import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { adjudicateCustomAction, generateEnding, generateNextTurn, generateOpening } from "../game/engine";
import { parseTimelineTurn } from "../game/schema";
import { endingFixture, turnFixture } from "../test/fixtures";
import { requestCompletion } from "./deepseek";
import { CHAPTER_NAMES, type DecisionChapter } from "../game/timelinePlan";

const messages = [{ role: "system" as const, content: "system" }, { role: "user" as const, content: "user" }];
const scenario = { profile: { name: "林舟", occupation: "product" as const, strengths: ["negotiation", "strategy"] as const, riskStyle: "balanced" as const }, seed: HISTORY_SEEDS[0] };
const firstTurn = parseTimelineTurn(JSON.stringify(turnFixture));
const playedTurn = { turn: firstTurn, selectedChoiceId: "A" as const, selectedChoiceLabel: firstTurn.choices[0].label, selectedDeviationClass: "nudge" as const, resolvedEcho: firstTurn.choices[0].instantEcho };
const endingPlayedTurns = endingFixture.historyTimeline.map((item, index) => ({
  turn: parseTimelineTurn(JSON.stringify({ ...turnFixture, chapter: index + 1, chapterName: CHAPTER_NAMES[(index + 1) as DecisionChapter], previousEcho: index === 0 ? null : turnFixture.choices[0].instantEcho })),
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
    expect(body).toMatchObject({ model: "deepseek-v4-flash", thinking: { type: "disabled" }, response_format: { type: "json_object" }, stream: false });
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

  it("falls back to a playable local turn when all model structures are invalid", async () => {
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion('{"bad":true}')));
    vi.stubGlobal("fetch", fetcher);
    const turn = await generateOpening(scenario);
    expect(turn).toMatchObject({ chapter: 1, chapterName: "历史现场" });
    expect(turn.choices).toHaveLength(3);
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("falls back locally when DeepSeek returns an empty successful response", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion(""));
    vi.stubGlobal("fetch", fetcher);
    const turn = await generateOpening(scenario);
    expect(turn).toMatchObject({ chapter: 1, chapterName: "历史现场" });
    expect(turn.choices).toHaveLength(3);
  });

  it("generates the requested continuation with authoritative previous echo", async () => {
    const second = { ...turnFixture, chapter: 2, chapterName: "一日余波", previousEcho: turnFixture.choices[0].instantEcho };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(second))); vi.stubGlobal("fetch", fetcher);
    await expect(generateNextTurn(scenario, [playedTurn], 2)).resolves.toMatchObject({ chapter: 2, yearLabel: `${scenario.seed.year}年 · 一天后`, previousEcho: turnFixture.choices[0].instantEcho });
  });

  it("returns a structured ruling for a free action", async () => {
    const ruling = {
      normalizedAction: "先扣下军令，再请皇帝临朝",
      ruling: "受限执行",
      constraintApplied: "只能调动身边宿卫",
      deviationClass: "reform",
      instantEcho: turnFixture.choices[1].instantEcho,
    };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(ruling)));
    vi.stubGlobal("fetch", fetcher);
    await expect(adjudicateCustomAction(scenario, [], firstTurn, "调动全城军队"))
      .resolves.toMatchObject(ruling);
  });

  it("keeps the eleven player choices authoritative in the ending", async () => {
    const wrong = { ...endingFixture, historyTimeline: endingFixture.historyTimeline.map((item) => ({ ...item, playerChoice: "错误选择" })) };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(wrong))); vi.stubGlobal("fetch", fetcher);
    const ending = await generateEnding(scenario, endingPlayedTurns);
    expect(ending.historyTimeline.map((item) => item.playerChoice)).toEqual(endingPlayedTurns.map((item) => item.selectedChoiceLabel));
  });

  it("falls back to a complete 2026 summary after invalid ending structures", async () => {
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(completion('{"bad":true}')));
    vi.stubGlobal("fetch", fetcher);
    const ending = await generateEnding(scenario, endingPlayedTurns);
    expect(ending.historyTimeline).toHaveLength(11);
    expect(ending.frontPageHeadline).toContain("2026");
  });
});
