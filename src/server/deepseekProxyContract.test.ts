import { describe, expect, it } from "vitest";
import { TIMELINE_SYSTEM_PROMPT, TIMELINE_TURN_PROTOCOL } from "../game/deepseekProtocol";
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
});
