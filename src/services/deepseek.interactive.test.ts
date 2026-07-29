import { afterEach, describe, expect, it, vi } from "vitest";
import {
  requestCompletion,
  type DeepSeekProgressStage,
} from "./deepseek.interactive";

type CapturedOptions = {
  type: string;
  stream: boolean;
  model: string;
  maxTokens: number;
  messages: Array<{ role: string; content: string }>;
  onSSE: (event: { eventName: string; data: string }) => void;
  success: (result: { errMsg: string; data?: string }) => void;
  fail: (error: {
    errMsg: string;
    errorCode: number;
    errorType: string;
  }) => void;
  complete: (result: { errMsg: string }) => void;
};

function installRuntime(
  implementation: (options: CapturedOptions) => void,
): ReturnType<typeof vi.fn> {
  const callAIChatCompletion = vi.fn(implementation);
  Object.defineProperty(globalThis, "tt", {
    configurable: true,
    value: { callAIChatCompletion },
  });
  return callAIChatCompletion;
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, "tt");
  vi.restoreAllMocks();
});

describe("Interactive Space DeepSeek transport", () => {
  it("streams DeepSeek V4 Flash JSON through the platform runtime", async () => {
    const stages: DeepSeekProgressStage[] = [];
    const drafts: Array<{ headline?: string }> = [];
    const call = installRuntime((options) => {
      options.onSSE({
        eventName: "message",
        data: JSON.stringify({
          choices: [{ delta: { reasoning_content: "先推演", content: "" } }],
        }),
      });
      options.onSSE({
        eventName: "message",
        data: JSON.stringify({
          choices: [{ delta: { content: "{\"headline\":\"新局面\"," } }],
        }),
      });
      options.onSSE({
        eventName: "message",
        data: JSON.stringify({
          choices: [{ delta: { content: "\"narrative\":\"完整现场。\"}" } }],
          usage: { total_tokens: 42 },
        }),
      });
      options.onSSE({ eventName: "message", data: "[DONE]" });
      options.success({ errMsg: "callAIChatCompletion:ok" });
      options.complete({ errMsg: "callAIChatCompletion:ok" });
    });

    const result = await requestCompletion(
      [
        { role: "system", content: "只返回 JSON" },
        { role: "user", content: "继续历史" },
      ],
      {
        phase: "turn",
        reasoning: "fast",
        onProgress: ({ stage }) => stages.push(stage),
        onPartial: (draft) => drafts.push(draft),
      },
    );

    expect(JSON.parse(result)).toEqual({
      headline: "新局面",
      narrative: "完整现场。",
    });
    expect(call).toHaveBeenCalledTimes(1);
    expect(call.mock.calls[0]?.[0]).toMatchObject({
      type: "text",
      stream: true,
      model: "deepseek-v4-flash",
      maxTokens: 4096,
      messages: [
        { role: "system", content: "只返回 JSON" },
        { role: "user", content: "继续历史" },
      ],
    });
    expect(stages).toEqual(["connected", "reasoning", "writing", "validating"]);
    expect(drafts.some((draft) => draft.headline === "新局面")).toBe(true);
  });

  it("surfaces the platform API-key configuration error without retrying", async () => {
    const call = installRuntime((options) => {
      options.fail({
        errMsg: "请先配置 AI API Key",
        errorCode: 20107,
        errorType: "D",
      });
      options.complete({ errMsg: "callAIChatCompletion:fail" });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      { phase: "turn" },
    )).rejects.toMatchObject({
      code: "missing_api_key",
      retryable: false,
    });
    expect(call).toHaveBeenCalledTimes(1);
  });

  it("keeps ordinary-browser preview explicit and retryable in the UI", async () => {
    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      { phase: "turn" },
    )).rejects.toMatchObject({
      code: "service_unavailable",
      retryable: false,
    });
  });
});
