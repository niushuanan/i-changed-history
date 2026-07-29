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
  it("concatenates the official raw-text SSE fragments from the platform runtime", async () => {
    const stages: DeepSeekProgressStage[] = [];
    const drafts: Array<{ headline?: string }> = [];
    const call = installRuntime((options) => {
      options.onSSE({
        eventName: "open",
        data: "",
      });
      options.onSSE({
        eventName: "message",
        data: "{\"headline\":\"新局面\",",
      });
      options.onSSE({
        eventName: "message",
        data: "\"narrative\":\"完整现场。\"}",
      });
      options.success({
        errMsg: "callAIChatCompletion:ok",
        data: "{\"duplicate\":\"流式模式不应读取 success.data\"}",
      });
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
      model: "deepseek-v4-flash-260425",
      maxTokens: 4096,
      messages: [
        { role: "system", content: "只返回 JSON" },
        { role: "user", content: "继续历史" },
      ],
    });
    expect(stages).toEqual(["connected", "writing", "validating"]);
    expect(drafts.some((draft) => draft.headline === "新局面")).toBe(true);
  });

  it("keeps compatibility with provider-shaped SSE payloads", async () => {
    const stages: DeepSeekProgressStage[] = [];
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
          choices: [{ delta: { content: "{\"headline\":\"旧版兼容\"," } }],
        }),
      });
      options.onSSE({
        eventName: "message",
        data: JSON.stringify({
          choices: [{ delta: { content: "\"narrative\":\"仍能完成。\"}" } }],
          usage: { total_tokens: 42 },
        }),
      });
      options.onSSE({ eventName: "message", data: "[DONE]" });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      {
        phase: "turn",
        reasoning: "fast",
        onProgress: ({ stage }) => stages.push(stage),
      },
    )).resolves.toBe("{\"headline\":\"旧版兼容\",\"narrative\":\"仍能完成。\"}");
    expect(call).toHaveBeenCalledTimes(1);
    expect(stages).toEqual(["connected", "reasoning", "writing", "validating"]);
  });

  it("does not surface informational platform events as player-facing failures", async () => {
    const call = installRuntime((options) => {
      options.fail({
        errMsg: "runtime token refreshed",
        errorCode: 0,
        errorType: "I",
      });
      options.onSSE({
        eventName: "message",
        data: "{\"headline\":\"继续\",\"narrative\":\"刷新后照常完成。\"}",
      });
      options.complete({ errMsg: "callAIChatCompletion:ok" });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      { phase: "turn" },
    )).resolves.toContain("刷新后照常完成");
  });

  it("falls back to the official non-stream response when a stream ends empty", async () => {
    const call = installRuntime((options) => {
      if (options.stream) {
        options.complete({ errMsg: "callAIChatCompletion:ok" });
        return;
      }
      options.success({
        errMsg: "callAIChatCompletion:ok",
        data: "{\"headline\":\"非流式接管\",\"narrative\":\"同一请求已经可靠完成。\"}",
      });
      options.complete({ errMsg: "callAIChatCompletion:ok" });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      { phase: "turn" },
    )).resolves.toContain("同一请求已经可靠完成");
    expect(call).toHaveBeenCalledTimes(2);
    expect(call.mock.calls.map(([options]) => options.stream)).toEqual([true, false]);
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
      message: expect.stringContaining("错误码 20107"),
      retryable: false,
    });
    expect(call).toHaveBeenCalledTimes(1);
  });

  it("preserves the platform developer error type and code for mobile diagnosis", async () => {
    const call = installRuntime((options) => {
      options.fail({
        errMsg: "model is not activated",
        errorCode: 40012,
        errorType: "D",
      });
      options.complete({ errMsg: "callAIChatCompletion:fail" });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      { phase: "turn" },
    )).rejects.toMatchObject({
      code: "request_failed",
      message: expect.stringContaining("类型 D · 错误码 40012"),
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
