import { describe, expect, it } from "vitest";
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
  parseProxyEnvelope,
  type DeepSeekProxyEnvelope,
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

describe("DeepSeek proxy contract", () => {
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
});
