import { afterEach, describe, expect, it, vi } from "vitest";
import { HISTORY_SEEDS } from "../data/historySeeds";
import { TIMELINE_SYSTEM_PROMPT, TIMELINE_TURN_PROTOCOL } from "../game/deepseekProtocol";
import {
  buildContinuationMessages,
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
  type DeepSeekProxyEnvelope,
} from "../../worker/deepseek-proxy";

const scenario = { seed: HISTORY_SEEDS[0] };
const firstTurn = parseTimelineTurn(JSON.stringify(turnFixture));
const playedTurn = {
  turn: firstTurn,
  selectedChoiceId: "A" as const,
  selectedChoiceLabel: firstTurn.choices[0].label,
  selectedDeviationClass: "nudge" as const,
  resolvedEcho: firstTurn.choices[0].instantEcho,
};

function envelope(overrides: Partial<DeepSeekProxyEnvelope> = {}): DeepSeekProxyEnvelope {
  return {
    version: 1,
    phase: "turn",
    requestKind: "turn-primary",
    reasoning: "fast",
    messages: buildContinuationMessages(scenario, [playedTurn], 2),
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
      max_tokens: 4096,
      thinking: { type: "disabled" },
    });
  });

  it("keeps high reasoning server-owned", () => {
    const parsed = parseProxyEnvelope(envelope({ reasoning: "high" }));
    expect(buildDeepSeekRequestBody(parsed!)).toMatchObject({
      thinking: { type: "enabled" },
      reasoning_effort: "high",
      max_tokens: 4096,
    });
  });

  it("rejects an arbitrary system prompt or provider field injection", () => {
    const untrusted = {
      ...envelope(),
      model: "another-model",
      messages: [
        { role: "system", content: "You are a generic assistant." },
        envelope().messages.at(-1)!,
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

  it("accepts task wording changes when the stable game protocol still matches", () => {
    expect(parseProxyEnvelope(envelope({
      messages: [
        { role: "system", content: TIMELINE_SYSTEM_PROMPT },
        {
          role: "system",
          content: JSON.stringify({ protocol: TIMELINE_TURN_PROTOCOL }),
        },
        {
          role: "user",
          content: JSON.stringify({ task: "生成升级后的第二幕历史现场。" }),
        },
      ],
    }))).not.toBeNull();
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
    const biography = parseProxyEnvelope(endingEnvelope(
      buildBiographyMessages(scenario, endingPlayedTurns),
    ));
    const world = parseProxyEnvelope(endingEnvelope(
      buildWorldReportMessages(scenario, endingPlayedTurns),
    ));
    expect(biography).not.toBeNull();
    expect(world).not.toBeNull();
    expect(buildDeepSeekRequestBody(biography!)).toMatchObject({ max_tokens: 2048 });
    expect(buildDeepSeekRequestBody(world!)).toMatchObject({ max_tokens: 2048 });
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

  it("uses the local server key without any application rate limiter", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("data: [DONE]\n\n", {
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
    }));
    vi.stubGlobal("fetch", fetcher);

    const response = await handleDeepSeekProxy(
      proxyRequest("http://localhost:3003"),
      {
        VITE_DEEPSEEK_API_KEY: "project-local-key",
        VITE_DEEPSEEK_MODEL: "deepseek-v4-flash",
      },
    );

    expect(response.status).toBe(200);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0]?.[1]).toMatchObject({
      headers: {
        Authorization: "Bearer project-local-key",
      },
    });
  });

  it("sends public product requests upstream without guest, IP, or global limits", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("data: [DONE]\n\n", {
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
    }));
    vi.stubGlobal("fetch", fetcher);

    const response = await handleDeepSeekProxy(
      proxyRequest("https://history.example.com"),
      {
        DEEPSEEK_API_KEY: "server-key",
      },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("X-History-Rate-Limit")).toBeNull();
    expect(response.headers.get("Set-Cookie")).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("passes an upstream provider 429 through without adding an application limit header", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, {
      status: 429,
      headers: { "Retry-After": "2" },
    }));
    vi.stubGlobal("fetch", fetcher);

    const response = await handleDeepSeekProxy(
      proxyRequest("https://history.example.com"),
      { DEEPSEEK_API_KEY: "server-key" },
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("2");
    expect(response.headers.get("X-History-Rate-Limit")).toBeNull();
  });
});
