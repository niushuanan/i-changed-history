import { afterEach, describe, expect, it, vi } from "vitest";
import {
  requestCompletion,
  type CompletionProgressStage,
} from "./seed.interactive";

type CapturedOptions = {
  type: string;
  stream: boolean;
  model: string;
  reasoning_effort: "high";
  service_tier: "auto";
  maxTokens: number;
  messages: Array<{ role: string; content: string }>;
  onSSE: (event: { eventName: string; data: string }) => void;
  success: (result: { errMsg: string; data?: string }) => void;
  fail: (error: {
    errMsg: string;
    errorCode: number | string;
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
  globalThis.sessionStorage?.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Interactive Space Ark transport", () => {
  it("concatenates the official raw-text SSE fragments from the platform runtime", async () => {
    const stages: CompletionProgressStage[] = [];
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
        reasoning: "minimal",
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
      model: "doubao-seed-2-0-lite-260428",
      reasoning_effort: "high",
      service_tier: "auto",
      maxTokens: 4096,
      messages: [
        { role: "system", content: "只返回 JSON" },
        { role: "user", content: "继续历史" },
      ],
    });
    expect(stages).toEqual(["connected", "writing", "validating"]);
    expect(drafts.some((draft) => draft.headline === "新局面")).toBe(true);
  });

  it("forces every Seed request to the highest reasoning mode", async () => {
    const metrics: Array<{ reasoning: string }> = [];
    const call = installRuntime((options) => {
      options.success({
        errMsg: "callAIChatCompletion:ok",
        data: "{\"headline\":\"深度推演\",\"narrative\":\"完整生成正文。\"}",
      });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      {
        phase: "turn",
        reasoning: "high",
        onMetrics: (item) => metrics.push(item),
      },
    )).resolves.toContain("完整生成正文");

    expect(call.mock.calls[0]?.[0]).toMatchObject({
      model: "doubao-seed-2-0-lite-260428",
      reasoning_effort: "high",
      service_tier: "auto",
    });
    expect(call.mock.calls[0]?.[0]).not.toHaveProperty("thinking");
    expect(metrics).toEqual([expect.objectContaining({ reasoning: "high" })]);
  });

  it("keeps compatibility with provider-shaped SSE payloads", async () => {
    const stages: CompletionProgressStage[] = [];
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
        reasoning: "minimal",
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
    expect(call.mock.calls.map(([options]) => options.reasoning_effort)).toEqual([
      "high",
      "high",
    ]);
    expect(call.mock.calls.map(([options]) => options.model)).toEqual([
      "doubao-seed-2-0-lite-260428",
      "doubao-seed-2-0-lite-260428",
    ]);
  });

  it("falls through from Lite to Pro only when Lite explicitly exhausts its quota", async () => {
    const metrics: Array<{ model?: string; outcome: string }> = [];
    const call = installRuntime((options) => {
      if (options.model === "doubao-seed-2-0-lite-260428") {
        options.fail({
          errMsg: "The free quota has been used up",
          errorCode: "QuotaExceeded",
          errorType: "D",
        });
        return;
      }
      options.success({
        errMsg: "callAIChatCompletion:ok",
        data: "{\"headline\":\"Pro 接管\",\"narrative\":\"额度接力成功。\"}",
      });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      {
        phase: "turn",
        reasoning: "high",
        onMetrics: (item) => metrics.push(item),
      },
    )).resolves.toContain("额度接力成功");

    expect(call.mock.calls.map(([options]) => options.model)).toEqual([
      "doubao-seed-2-0-lite-260428",
      "doubao-seed-2-0-pro-260215",
    ]);
    expect(call.mock.calls.every(([options]) => (
      options.reasoning_effort === "high"
      && options.service_tier === "auto"
      && !("thinking" in options)
    ))).toBe(true);
    expect(metrics).toEqual([
      expect.objectContaining({
        model: "doubao-seed-2-0-lite-260428",
        outcome: "error",
      }),
      expect.objectContaining({
        model: "doubao-seed-2-0-pro-260215",
        outcome: "success",
      }),
    ]);
  });

  it("falls through Lite and Pro to Evolving in the exact configured order", async () => {
    const call = installRuntime((options) => {
      if (options.model !== "doubao-seed-evolving") {
        options.fail({
          errMsg: "免费额度已用完",
          errorCode: "QuotaExceeded",
          errorType: "D",
        });
        return;
      }
      options.success({
        errMsg: "callAIChatCompletion:ok",
        data: "{\"headline\":\"Evolving 接管\",\"narrative\":\"三级接力成功。\"}",
      });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      { phase: "turn" },
    )).resolves.toContain("三级接力成功");

    expect(call.mock.calls.map(([options]) => options.model)).toEqual([
      "doubao-seed-2-0-lite-260428",
      "doubao-seed-2-0-pro-260215",
      "doubao-seed-evolving",
    ]);
    expect(call.mock.calls.map(([options]) => options.reasoning_effort)).toEqual([
      "high",
      "high",
      "high",
    ]);
    expect(call.mock.calls.map(([options]) => options.service_tier)).toEqual([
      "auto",
      "auto",
      "auto",
    ]);
  });

  it("reports one clear error after all three Seed quotas are exhausted", async () => {
    const call = installRuntime((options) => {
      options.fail({
        errMsg: "quota_exhausted",
        errorCode: "QuotaExceeded",
        errorType: "D",
      });
    });

    await expect(requestCompletion(
      [{ role: "user", content: "继续历史" }],
      { phase: "turn" },
    )).rejects.toMatchObject({
      code: "quota_exhausted",
      message: expect.stringContaining("三个 Seed 模型"),
      retryable: false,
    });
    expect(call.mock.calls.map(([options]) => options.model)).toEqual([
      "doubao-seed-2-0-lite-260428",
      "doubao-seed-2-0-pro-260215",
      "doubao-seed-evolving",
    ]);
  });

  it("remembers an exhausted model for this session and skips it on the next request", async () => {
    let liteCalls = 0;
    const call = installRuntime((options) => {
      if (options.model === "doubao-seed-2-0-lite-260428") {
        liteCalls += 1;
        options.fail({
          errMsg: "额度耗尽",
          errorCode: "QuotaExceeded",
          errorType: "D",
        });
        return;
      }
      options.success({
        errMsg: "callAIChatCompletion:ok",
        data: "{\"headline\":\"接管\",\"narrative\":\"继续。\"}",
      });
    });

    await requestCompletion([{ role: "user", content: "第一次" }], { phase: "turn" });
    await requestCompletion([{ role: "user", content: "第二次" }], { phase: "turn" });

    expect(liteCalls).toBe(1);
    expect(call.mock.calls.map(([options]) => options.model)).toEqual([
      "doubao-seed-2-0-lite-260428",
      "doubao-seed-2-0-pro-260215",
      "doubao-seed-2-0-pro-260215",
    ]);
  });

  it("retries an ordinary rate limit on Lite without switching models", async () => {
    vi.useFakeTimers();
    let calls = 0;
    const call = installRuntime((options) => {
      calls += 1;
      if (calls < 3) {
        options.fail({
          errMsg: "rate limit",
          errorCode: 429,
          errorType: "F",
        });
        return;
      }
      options.success({
        errMsg: "callAIChatCompletion:ok",
        data: "{\"headline\":\"Lite 恢复\",\"narrative\":\"没有误切模型。\"}",
      });
    });

    const completion = requestCompletion(
      [{ role: "user", content: "继续历史" }],
      { phase: "turn" },
    );
    await vi.runAllTimersAsync();
    await expect(completion).resolves.toContain("没有误切模型");
    expect(call).toHaveBeenCalledTimes(3);
    expect(call.mock.calls.map(([options]) => options.model)).toEqual([
      "doubao-seed-2-0-lite-260428",
      "doubao-seed-2-0-lite-260428",
      "doubao-seed-2-0-lite-260428",
    ]);
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
