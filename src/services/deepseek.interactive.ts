/// <reference types="vite/client" />

import type { ChatMessage } from "../game/prompts";
import { OBJ, parse as parsePartialJson } from "partial-json";
import {
  DeepSeekError,
  type CompletionOptions,
  type DeepSeekErrorCode,
  type DeepSeekPartialDraft,
  type DeepSeekProgress,
  type DeepSeekProgressStage,
  type DeepSeekReasoning,
  type DeepSeekRequestKind,
  type DeepSeekRequestMetrics,
  type DeepSeekUsage,
} from "./deepseek-contract";

export { DeepSeekError } from "./deepseek-contract";
export type {
  CompletionOptions,
  DeepSeekErrorCode,
  DeepSeekPartialDraft,
  DeepSeekProgress,
  DeepSeekProgressStage,
  DeepSeekReasoning,
  DeepSeekRequestKind,
  DeepSeekRequestMetrics,
  DeepSeekUsage,
} from "./deepseek-contract";

const INTERACTIVE_SPACE_MODEL = "deepseek-v4-flash";
const REQUEST_TIMEOUT_MS = 90_000;
const RETRY_BASE_DELAYS_MS = [3_000, 10_000] as const;
const MAX_RETRY_DELAY_MS = 15_000;
const MAX_ATTEMPTS = RETRY_BASE_DELAYS_MS.length + 1;
const OUTPUT_TOKEN_BUDGET = { turn: 4096, ending: 2048 } as const;

type PlatformSuccess = {
  errMsg?: unknown;
  data?: unknown;
};

type PlatformFailure = {
  errMsg?: unknown;
  errNo?: unknown;
  errCode?: unknown;
  errorCode?: unknown;
  errorType?: unknown;
};

type PlatformSseEvent = {
  eventName?: unknown;
  data?: unknown;
};

type PlatformTask = {
  abort?: () => void;
};

type PlatformChatOptions = {
  type: "text";
  stream: true;
  model: string;
  messages: Array<{ role: "system" | "user"; content: string }>;
  temperature: number;
  maxTokens: number;
  onSSE: (event: PlatformSseEvent) => void;
  success: (result: PlatformSuccess) => void;
  fail: (error: PlatformFailure) => void;
  complete: (result: PlatformSuccess | PlatformFailure) => void;
};

type InteractiveSpaceRuntime = {
  callAIChatCompletion?: (options: PlatformChatOptions) => PlatformTask | void;
};

type RawUsage = {
  prompt_tokens?: unknown;
  prompt_cache_hit_tokens?: unknown;
  prompt_cache_miss_tokens?: unknown;
  completion_tokens?: unknown;
  total_tokens?: unknown;
  completion_tokens_details?: { reasoning_tokens?: unknown };
};

type StreamPayload = {
  choices?: Array<{
    delta?: {
      content?: unknown;
      reasoning_content?: unknown;
    };
    finish_reason?: unknown;
  }>;
  usage?: unknown;
};

function platformRuntime(): InteractiveSpaceRuntime | null {
  const candidate = (globalThis as typeof globalThis & { tt?: InteractiveSpaceRuntime }).tt;
  return candidate && typeof candidate.callAIChatCompletion === "function" ? candidate : null;
}

function clockNow(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function numeric(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeUsage(value: unknown): DeepSeekUsage | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const usage = value as RawUsage;
  const normalized: DeepSeekUsage = {
    promptTokens: numeric(usage.prompt_tokens),
    promptCacheHitTokens: numeric(usage.prompt_cache_hit_tokens),
    promptCacheMissTokens: numeric(usage.prompt_cache_miss_tokens),
    completionTokens: numeric(usage.completion_tokens),
    reasoningTokens: numeric(usage.completion_tokens_details?.reasoning_tokens),
    totalTokens: numeric(usage.total_tokens),
  };
  return Object.values(normalized).some((item) => item !== undefined) ? normalized : undefined;
}

function readablePartial(content: string): DeepSeekPartialDraft | null {
  let parsed: unknown;
  try {
    parsed = parsePartialJson(content, OBJ);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
  const record = parsed as Record<string, unknown>;
  const draft: Record<string, string> = {};
  const compactScene = Array.isArray(record.s) ? record.s : null;
  const compactFields = compactScene ? {
    headline: compactScene[0],
    narrative: compactScene[1],
    location: compactScene[2],
    role: compactScene[3],
    timePressure: compactScene[4],
  } : {};
  for (
    const field of [
      "headline",
      "narrative",
      "location",
      "role",
      "immediateObjective",
      "timePressure",
    ] as const
  ) {
    const value = record[field] ?? compactFields[field as keyof typeof compactFields];
    if (typeof value === "string" && value.trim()) {
      draft[field] = value.trim();
    }
  }
  return Object.keys(draft).length > 0 ? draft : null;
}

function reportMetrics(
  callback: CompletionOptions["onMetrics"],
  metrics: DeepSeekRequestMetrics,
): void {
  try {
    callback?.(metrics);
  } catch {
    // Telemetry must never interrupt the model request.
  }
}

function reportPartial(
  callback: CompletionOptions["onPartial"],
  draft: DeepSeekPartialDraft,
): void {
  try {
    callback?.(draft);
  } catch {
    // A rendering callback must never interrupt the model request.
  }
}

function progressReporter(onProgress?: CompletionOptions["onProgress"]) {
  const emitted = new Set<DeepSeekProgressStage>();
  return (stage: DeepSeekProgressStage) => {
    if (emitted.has(stage)) return;
    emitted.add(stage);
    try {
      onProgress?.({ stage });
    } catch {
      // UI progress must never interrupt the model request.
    }
  };
}

function errorNumber(error: PlatformFailure): number | undefined {
  for (const value of [error.errorCode, error.errNo, error.errCode]) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

function platformError(error: PlatformFailure): DeepSeekError {
  const status = errorNumber(error);
  const message = typeof error.errMsg === "string" ? error.errMsg : "";
  const lowerMessage = message.toLowerCase();
  const errorType = typeof error.errorType === "string" ? error.errorType : "";

  if (
    status === 20107
    || lowerMessage.includes("api key")
    || message.includes("服务账号")
    || message.includes("未配置")
  ) {
    return new DeepSeekError(
      "missing_api_key",
      "互动空间账号尚未配置火山方舟 API Key，请完成平台 AI 服务配置后重试。",
      status,
      undefined,
      false,
    );
  }
  if (status === 401) {
    return new DeepSeekError("unauthorized", "互动空间 AI 服务鉴权失败，请重新授权。", status, undefined, false);
  }
  if (status === 403) {
    return new DeepSeekError("forbidden", "当前账号没有调用该模型的权限。", status, undefined, false);
  }
  if (status === 429 || message.includes("频繁") || lowerMessage.includes("rate limit")) {
    return new DeepSeekError("rate_limited", "请求过于频繁，请稍后重新推演。", status);
  }
  if (errorType === "U") {
    return new DeepSeekError("aborted", "本次推演已取消。", status, undefined, false);
  }
  if (
    errorType === "F"
    || errorType === "I"
    || (typeof status === "number" && status >= 500)
  ) {
    return new DeepSeekError("service_unavailable", "互动空间 AI 服务暂时不可用，请重新推演这一幕。", status);
  }
  if (errorType === "D") {
    return new DeepSeekError(
      "request_failed",
      message ? `互动空间 AI 调用失败：${message}` : "互动空间 AI 调用参数无效。",
      status,
      undefined,
      false,
    );
  }
  return new DeepSeekError(
    "network",
    message ? `互动空间 AI 连接失败：${message}` : "互动空间 AI 连接中断，请重新推演这一幕。",
    status,
  );
}

function isRetryable(error: unknown): error is DeepSeekError {
  return (
    error instanceof DeepSeekError
    && error.retryable
    && ["rate_limited", "service_unavailable", "network"].includes(error.code)
  );
}

function retryDelayMs(attempt: number, retryAfterMs?: number): number {
  const base = RETRY_BASE_DELAYS_MS[Math.min(attempt - 1, RETRY_BASE_DELAYS_MS.length - 1)];
  const jittered = base * (0.85 + Math.random() * 0.3);
  return Math.min(MAX_RETRY_DELAY_MS, Math.max(jittered, retryAfterMs ?? 0));
}

function waitBeforeRetry(
  attempt: number,
  retryAfterMs?: number,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(new DeepSeekError("aborted", "本次推演已取消。", undefined, undefined, false));
  }

  return new Promise((resolve, reject) => {
    const handleAbort = () => {
      clearTimeout(timer);
      reject(new DeepSeekError("aborted", "本次推演已取消。", undefined, undefined, false));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, retryDelayMs(attempt, retryAfterMs));
    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

function parseStreamPayload(rawData: unknown): StreamPayload | "done" | null {
  if (typeof rawData !== "string") return null;
  const text = rawData.trim().replace(/^data:\s*/, "");
  if (!text) return null;
  if (text === "[DONE]") return "done";
  try {
    const parsed: unknown = JSON.parse(text);
    return typeof parsed === "object" && parsed !== null
      ? parsed as StreamPayload
      : null;
  } catch {
    return null;
  }
}

function performRequest(
  messages: readonly ChatMessage[],
  options: CompletionOptions,
  attempt: number,
): Promise<string> {
  const runtime = platformRuntime();
  const callAIChatCompletion = runtime?.callAIChatCompletion;
  if (!callAIChatCompletion) {
    return Promise.reject(new DeepSeekError(
      "service_unavailable",
      "当前预览环境没有互动空间 AI 能力，请在抖音互动空间中继续体验。",
      undefined,
      undefined,
      false,
    ));
  }
  if (options.signal?.aborted) {
    return Promise.reject(new DeepSeekError("aborted", "本次推演已取消。", undefined, undefined, false));
  }

  const reasoning = options.reasoning ?? "high";
  const requestKind = options.requestKind
    ?? (options.phase === "ending" ? "ending-primary" : "turn-primary");
  const startedAt = clockNow();
  const report = progressReporter(options.onProgress);

  return new Promise((resolve, reject) => {
    let task: PlatformTask | void;
    let settled = false;
    let content = "";
    let lastDraft = "";
    let firstCallbackMs: number | undefined;
    let firstReasoningTokenMs: number | undefined;
    let firstContentTokenMs: number | undefined;
    let usage: DeepSeekUsage | undefined;

    const cleanup = () => {
      clearTimeout(timeout);
      options.signal?.removeEventListener("abort", handleAbort);
    };

    const finishSuccess = () => {
      if (settled) return;
      if (!content.trim()) {
        finishError(new DeepSeekError(
          "invalid_response",
          "DeepSeek 返回了空结果，请重新推演。",
          undefined,
          undefined,
          false,
        ));
        return;
      }
      settled = true;
      cleanup();
      report("validating");
      reportMetrics(options.onMetrics, {
        phase: options.phase,
        requestKind,
        reasoning,
        attempt,
        outcome: "success",
        responseHeadersMs: firstCallbackMs,
        firstReasoningTokenMs,
        firstContentTokenMs,
        totalMs: clockNow() - startedAt,
        usage,
      });
      resolve(content);
    };

    const finishError = (error: DeepSeekError) => {
      if (settled) return;
      settled = true;
      cleanup();
      reportMetrics(options.onMetrics, {
        phase: options.phase,
        requestKind,
        reasoning,
        attempt,
        outcome: "error",
        responseHeadersMs: firstCallbackMs,
        totalMs: clockNow() - startedAt,
        status: error.status,
        errorCode: error.code,
      });
      reject(error);
    };

    const markConnected = () => {
      firstCallbackMs ??= clockNow() - startedAt;
      report("connected");
    };

    const handleAbort = () => {
      try {
        task?.abort?.();
      } catch {
        // The client-owned cancellation state is authoritative.
      }
      finishError(new DeepSeekError("aborted", "本次推演已取消。", undefined, undefined, false));
    };

    const timeout = setTimeout(() => {
      try {
        task?.abort?.();
      } catch {
        // Timeout still rejects locally when the platform task has no abort method.
      }
      finishError(new DeepSeekError(
        "timeout",
        "这次推演等待时间过长，请重新推演这一幕。",
        undefined,
        undefined,
        false,
      ));
    }, REQUEST_TIMEOUT_MS);

    options.signal?.addEventListener("abort", handleAbort, { once: true });

    try {
      task = callAIChatCompletion({
        type: "text",
        stream: true,
        model: INTERACTIVE_SPACE_MODEL,
        messages: messages.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        })),
        temperature: 0.7,
        maxTokens: OUTPUT_TOKEN_BUDGET[options.phase],
        onSSE(event) {
          if (settled) return;
          markConnected();
          const payload = parseStreamPayload(event.data);
          if (payload === "done") {
            finishSuccess();
            return;
          }
          if (!payload) return;
          usage = normalizeUsage(payload.usage) ?? usage;
          const choice = payload.choices?.[0];
          if (choice?.finish_reason === "length") {
            finishError(new DeepSeekError(
              "invalid_response",
              "DeepSeek 输出被截断，请重新推演。",
              undefined,
              undefined,
              false,
            ));
            return;
          }
          const reasoningDelta = choice?.delta?.reasoning_content;
          if (typeof reasoningDelta === "string" && reasoningDelta) {
            firstReasoningTokenMs ??= clockNow() - startedAt;
            report("reasoning");
          }
          const contentDelta = choice?.delta?.content;
          if (typeof contentDelta !== "string" || !contentDelta) return;
          firstContentTokenMs ??= clockNow() - startedAt;
          report("writing");
          content += contentDelta;
          const draft = readablePartial(content);
          if (!draft) return;
          const serialized = JSON.stringify(draft);
          if (serialized === lastDraft) return;
          lastDraft = serialized;
          reportPartial(options.onPartial, draft);
        },
        success(result) {
          if (settled) return;
          markConnected();
          if (typeof result.data === "string" && result.data.trim()) {
            content += result.data;
            firstContentTokenMs ??= clockNow() - startedAt;
            report("writing");
          }
        },
        fail(error) {
          finishError(platformError(error));
        },
        complete() {
          if (settled) return;
          markConnected();
          finishSuccess();
        },
      });
    } catch (error) {
      finishError(error instanceof DeepSeekError
        ? error
        : new DeepSeekError(
            "request_failed",
            "互动空间 AI 能力启动失败，请重新推演这一幕。",
            undefined,
            undefined,
            false,
          ));
    }
  });
}

export async function requestCompletion(
  messages: readonly ChatMessage[],
  options: CompletionOptions,
): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      return await performRequest(messages, options, attempt + 1);
    } catch (error) {
      if (attempt < MAX_ATTEMPTS - 1 && isRetryable(error)) {
        await waitBeforeRetry(attempt + 1, error.retryAfterMs, options.signal);
        continue;
      }
      throw error;
    }
  }

  throw new DeepSeekError(
    "request_failed",
    "推演请求失败，请重新推演这一幕。",
    undefined,
    undefined,
    false,
  );
}
