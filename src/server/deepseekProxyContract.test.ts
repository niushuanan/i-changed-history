import { afterEach, describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { TIMELINE_SYSTEM_PROMPT, TIMELINE_TURN_PROTOCOL } from "../game/deepseekProtocol";
import {
  buildBiographyMessages,
  buildRerollMessages,
  buildWorldReportMessages,
} from "../game/prompts";
import { parseTimelineTurn } from "../game/schema";
import { endingFixture, turnFixture } from "../test/fixtures";
import {
  buildDeepSeekRequestBody,
  handleDeepSeekProxy,
  parseProxyEnvelope,
  publicRateLimitPolicy,
  type D1DatabaseLike,
  type DeepSeekProxyEnvelope,
  type WorkerExecutionContext,
} from "../../worker/deepseek-proxy";

const userMessage = {
  role: "user" as const,
  content: JSON.stringify({ task: "生成第 2 节点。" }),
};

function envelope(overrides: Partial<DeepSeekProxyEnvelope> = {}): DeepSeekProxyEnvelope {
  return {
    version: 1,
    phase: "turn",
    requestKind: "turn-primary",
    reasoning: "fast",
    messages: [
      { role: "system", content: TIMELINE_SYSTEM_PROMPT },
      {
        role: "system",
        content: JSON.stringify({ protocol: TIMELINE_TURN_PROTOCOL }),
      },
      userMessage,
    ],
    ...overrides,
  };
}

const endingTurn = parseTimelineTurn(JSON.stringify(turnFixture));
const endingPlayedTurns = endingFixture.historyTimeline.map((item) => ({
  turn: endingTurn,
  selectedChoiceId: "A" as const,
  selectedChoiceLabel: item.playerChoice,
  selectedDeviationClass: "nudge" as const,
  resolvedEcho: endingTurn.choices[0].instantEcho,
}));

function endingEnvelope(messages: DeepSeekProxyEnvelope["messages"]): DeepSeekProxyEnvelope {
  return {
    version: 1,
    phase: "ending",
    requestKind: "ending-primary",
    reasoning: "high",
    messages,
  };
}

function rerollEnvelope(): DeepSeekProxyEnvelope {
  const scenario = { seed: HISTORY_SEEDS[0] };
  return {
    version: 1,
    phase: "turn",
    requestKind: "roll-primary",
    reasoning: "fast",
    messages: buildRerollMessages(
      scenario,
      endingPlayedTurns,
      endingTurn,
      2,
      endingTurn.rollChoices,
    ),
  };
}

function proxyRequest(origin: string) {
  return new Request(`${origin}/api/deepseek/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify(envelope()),
  });
}

function workerContext(): WorkerExecutionContext {
  return {
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
  };
}

describe("DeepSeek proxy contract", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("accepts the game protocol and rebuilds provider-owned fields", () => {
    const parsed = parseProxyEnvelope(envelope());
    expect(parsed).not.toBeNull();
    expect(buildDeepSeekRequestBody(parsed!, "deepseek-v4-flash")).toMatchObject({
      model: "deepseek-v4-flash",
      stream: true,
      stream_options: { include_usage: true },
      response_format: { type: "json_object" },
      max_tokens: 8192,
      thinking: { type: "disabled" },
    });
  });

  it("keeps high reasoning server-owned", () => {
    const parsed = parseProxyEnvelope(envelope({ reasoning: "high" }));
    expect(buildDeepSeekRequestBody(parsed!)).toMatchObject({
      thinking: { type: "enabled" },
      reasoning_effort: "high",
      max_tokens: 8192,
    });
  });

  it("rejects an arbitrary system prompt or provider field injection", () => {
    const untrusted = {
      ...envelope(),
      model: "another-model",
      messages: [
        { role: "system", content: "You are a generic assistant." },
        userMessage,
      ],
    };
    expect(parseProxyEnvelope(untrusted)).toBeNull();
  });

  it("rejects mismatched phase and request kind", () => {
    expect(parseProxyEnvelope(envelope({
      phase: "ending",
      requestKind: "turn-primary",
    } as Partial<DeepSeekProxyEnvelope>))).toBeNull();
  });

  it("accepts live Roll requests as turn-phase AI generation", () => {
    const parsed = parseProxyEnvelope(rerollEnvelope());
    expect(parsed).not.toBeNull();
    expect(buildDeepSeekRequestBody(parsed!, "deepseek-v4-flash")).toMatchObject({
      model: "deepseek-v4-flash",
      stream: true,
      response_format: { type: "json_object" },
      thinking: { type: "disabled" },
    });
  });

  it("accepts both four-decision ending writers and rejects the obsolete twelve-decision protocol", () => {
    const scenario = { seed: HISTORY_SEEDS[0] };
    expect(parseProxyEnvelope(endingEnvelope(
      buildBiographyMessages(scenario, endingPlayedTurns),
    ))).not.toBeNull();
    expect(parseProxyEnvelope(endingEnvelope(
      buildWorldReportMessages(scenario, endingPlayedTurns),
    ))).not.toBeNull();
    expect(parseProxyEnvelope(endingEnvelope([
      { role: "system", content: TIMELINE_SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({
          task: "十二次选择已经结束。只为同一个穿越者写一份完整人物列传。",
        }),
      },
    ]))).toBeNull();
  });

  it("sizes the public minute window for hundreds of repeat players without a daily lockout", () => {
    const database = {} as D1DatabaseLike;
    const defaults = publicRateLimitPolicy({ DB: database });
    expect(defaults).toEqual({
      guestPerMinute: 120,
      ipPerMinute: 1_800,
      globalPerMinute: 2_400,
    });
    const sixHundredPlayersFinishingTogether = 600 * 2;
    expect(defaults.guestPerMinute).toBeGreaterThan(13);
    expect(defaults.ipPerMinute).toBeGreaterThanOrEqual(sixHundredPlayersFinishingTogether);
    expect(defaults.globalPerMinute).toBeGreaterThanOrEqual(sixHundredPlayersFinishingTogether);
    expect(publicRateLimitPolicy({
      DB: database,
      DEEPSEEK_GUEST_MINUTE_LIMIT: "240",
      DEEPSEEK_IP_MINUTE_LIMIT: "3600",
      DEEPSEEK_GLOBAL_MINUTE_LIMIT: "4800",
    })).toEqual({
      guestPerMinute: 240,
      ipPerMinute: 3_600,
      globalPerMinute: 4_800,
    });
  });

  it("bypasses the public D1 limiter on localhost and still uses the local server key", async () => {
    const prepare = vi.fn(() => {
      throw new Error("local development must not touch the public rate-limit database");
    });
    const database = {
      prepare,
      batch: vi.fn(),
    } as unknown as D1DatabaseLike;
    const fetcher = vi.fn().mockResolvedValue(new Response("data: [DONE]\n\n", {
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
    }));
    vi.stubGlobal("fetch", fetcher);

    const response = await handleDeepSeekProxy(
      proxyRequest("http://localhost:3003"),
      {
        DB: database,
        VITE_DEEPSEEK_API_KEY: "project-local-key",
        VITE_DEEPSEEK_MODEL: "deepseek-v4-flash",
      },
      workerContext(),
    );

    expect(response.status).toBe(200);
    expect(prepare).not.toHaveBeenCalled();
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0]?.[1]).toMatchObject({
      headers: {
        Authorization: "Bearer project-local-key",
      },
    });
  });

  it("uses a retryable minute burst response instead of a day-long production quota", async () => {
    const statement = {
      bind: vi.fn(),
      run: vi.fn().mockResolvedValue({}),
    };
    statement.bind.mockReturnValue(statement);
    const database = {
      prepare: vi.fn(() => statement),
      batch: vi.fn()
        .mockResolvedValueOnce([
          { results: [{ request_count: 121 }] },
          { results: [{ request_count: 1 }] },
          { results: [{ request_count: 1 }] },
        ])
        .mockResolvedValueOnce([]),
    } as unknown as D1DatabaseLike;
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);

    const response = await handleDeepSeekProxy(
      proxyRequest("https://history.example.com"),
      {
        DB: database,
        DEEPSEEK_API_KEY: "server-key",
        RATE_LIMIT_SALT: "a-long-production-only-rate-limit-salt",
      },
      workerContext(),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("X-History-Rate-Limit")).toBe("burst");
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(Number(response.headers.get("Retry-After"))).toBeLessThanOrEqual(60);
    expect(fetcher).not.toHaveBeenCalled();
  });
});
