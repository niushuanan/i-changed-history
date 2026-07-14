/// <reference types="vite/client" />

import type { ChatMessage } from "../game/prompts";
import { OBJ, parse as parsePartialJson } from "partial-json";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL?.trim() || "deepseek-v4-flash";
const REQUEST_TIMEOUT_MS = 90_000;
const RETRY_BASE_DELAYS_MS = [800, 1_800] as const;
const MAX_RETRY_DELAY_MS = 8_000;
const MAX_ATTEMPTS = RETRY_BASE_DELAYS_MS.length + 1;

type DeepSeekPhase = "turn" | "ending";
export type DeepSeekReasoning = "fast" | "high";
export type DeepSeekRequestKind =
  | "turn-primary"
  | "turn-repair"
  | "turn-recovery"
  | "ending-primary"
  | "ending-repair"
  | "ending-recovery";

export type DeepSeekPartialDraft = Readonly<Partial<{
  headline: string;
  narrative: string;
  location: string;
  role: string;
  immediateObjective: string;
  timePressure: string;
}>>;

export type DeepSeekUsage = Readonly<{
  promptTokens?: number;
  promptCacheHitTokens?: number;
  promptCacheMissTokens?: number;
  completionTokens?: number;
  reasoningTokens?: number;
  totalTokens?: number;
}>;

export type DeepSeekRequestMetrics = Readonly<{
  phase: DeepSeekPhase;
  requestKind: DeepSeekRequestKind;
  reasoning: DeepSeekReasoning;
  attempt: number;
  outcome: "success" | "error";
  responseHeadersMs?: number;
  firstReasoningTokenMs?: number;
  firstContentTokenMs?: number;
  totalMs: number;
  status?: number;
  usage?: DeepSeekUsage;
  errorCode?: DeepSeekErrorCode;
}>;

export type DeepSeekErrorCode =
  | "missing_api_key"
  | "unauthorized"
  | "forbidden"
  | "rate_limited"
  | "service_unavailable"
  | "network"
  | "timeout"
  | "aborted"
  | "invalid_response"
  | "request_failed";

export class DeepSeekError extends Error {
  readonly name = "DeepSeekError";

  constructor(
    public readonly code: DeepSeekErrorCode,
    message: string,
    public readonly status?: number,
    public readonly retryAfterMs?: number,
  ) {
    super(message);
  }
}

export type CompletionOptions = {
  phase: DeepSeekPhase;
  reasoning?: DeepSeekReasoning;
  requestKind?: DeepSeekRequestKind;
  signal?: AbortSignal;
  onProgress?: (progress: DeepSeekProgress) => void;
  onPartial?: (draft: DeepSeekPartialDraft) => void;
  onMetrics?: (metrics: DeepSeekRequestMetrics) => void;
};

export type DeepSeekProgressStage = "connected" | "reasoning" | "writing" | "validating" | "repairing";
export type DeepSeekProgress = { stage: DeepSeekProgressStage };

function apiKey(): string {
  const key = import.meta.env.VITE_DEEPSEEK_API_KEY?.trim();
  if (!key) throw new DeepSeekError("missing_api_key", "未配置 DeepSeek API 密钥。");
  return key;
}

function requestBody(messages: readonly ChatMessage[], reasoning: DeepSeekReasoning) {
  const shared = {
    model: DEEPSEEK_MODEL,
    messages,
    response_format: { type: "json_object" },
    stream: true,
    stream_options: { include_usage: true },
  } as const;

  return reasoning === "fast"
    ? { ...shared, thinking: { type: "disabled" }, max_tokens: 8192 } as const
    : {
        ...shared,
        thinking: { type: "enabled" },
        reasoning_effort: "high",
        max_tokens: 8192,
      } as const;
}

function clockNow(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
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

function parseRetryAfterMs(response: Response): number | undefined {
  const value = response.headers.get("Retry-After")?.trim();
  if (!value) return undefined;

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1_000;

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return undefined;
  return Math.max(0, timestamp - Date.now());
}

function errorForResponse(response: Response): DeepSeekError {
  const { status } = response;
  const retryAfterMs = parseRetryAfterMs(response);
  if (status === 401) {
    return new DeepSeekError("unauthorized", "DeepSeek API 密钥无效，请检查后重试。", status);
  }
  if (status === 403) {
    return new DeepSeekError("forbidden", "当前 DeepSeek API 密钥没有调用权限。", status);
  }
  if (status === 429) {
    return new DeepSeekError(
      "rate_limited",
      "请求过于频繁，请稍后重新推演。",
      status,
      retryAfterMs,
    );
  }
  if (status >= 500) {
    return new DeepSeekError(
      "service_unavailable",
      "DeepSeek 服务暂时不可用，请重新推演这一幕。",
      status,
      retryAfterMs,
    );
  }
  return new DeepSeekError("request_failed", "推演请求失败，请重新推演这一幕。", status);
}

function isRetryable(error: unknown): error is DeepSeekError {
  return (
    error instanceof DeepSeekError &&
    ["rate_limited", "service_unavailable", "network"].includes(error.code)
  );
}

function isAbortFailure(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

function retryDelayMs(attempt: number, retryAfterMs?: number): number {
  const base = RETRY_BASE_DELAYS_MS[Math.min(attempt - 1, RETRY_BASE_DELAYS_MS.length - 1)];
  const jittered = base * (0.85 + Math.random() * 0.3);
  return Math.min(MAX_RETRY_DELAY_MS, Math.max(jittered, retryAfterMs ?? 0));
}

function waitBeforeRetry(attempt: number, retryAfterMs?: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(new DeepSeekError("aborted", "本次推演已取消。"));
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, retryDelayMs(attempt, retryAfterMs));

    const handleAbort = () => {
      clearTimeout(timer);
      reject(new DeepSeekError("aborted", "本次推演已取消。"));
    };

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
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

type RawUsage = {
  prompt_tokens?: unknown;
  prompt_cache_hit_tokens?: unknown;
  prompt_cache_miss_tokens?: unknown;
  completion_tokens?: unknown;
  total_tokens?: unknown;
  completion_tokens_details?: { reasoning_tokens?: unknown };
};

type CompletionReadResult = {
  content: string;
  firstReasoningTokenMs?: number;
  firstContentTokenMs?: number;
  usage?: DeepSeekUsage;
};

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
  for (const field of ["headline", "narrative", "location", "role", "immediateObjective", "timePressure"] as const) {
    if (typeof record[field] === "string" && record[field].trim()) draft[field] = record[field].trim();
  }
  return Object.keys(draft).length > 0 ? draft : null;
}

async function readJsonCompletion(
  response: Response,
  report: (stage: DeepSeekProgressStage) => void,
  startedAt: number,
  onPartial?: CompletionOptions["onPartial"],
): Promise<CompletionReadResult> {
  const payload: unknown = await response.json();

  const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]
    ?.message?.content;
  if (typeof content !== "string" || content.trim() === "") {
    throw new DeepSeekError("invalid_response", "DeepSeek 返回了空结果，请重新推演。");
  }

  report("writing");
  const draft = readablePartial(content);
  if (draft) reportPartial(onPartial, draft);
  report("validating");
  return {
    content,
    firstContentTokenMs: clockNow() - startedAt,
    usage: normalizeUsage((payload as { usage?: unknown }).usage),
  };
}

function sseData(event: string): string | null {
  const lines = event.replace(/\r\n/g, "\n").split("\n");
  const data = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).replace(/^ /, ""));
  return data.length > 0 ? data.join("\n") : null;
}

async function readStreamedCompletion(
  response: Response,
  report: (stage: DeepSeekProgressStage) => void,
  startedAt: number,
  onPartial?: CompletionOptions["onPartial"],
): Promise<CompletionReadResult> {
  if (!response.body) {
    throw new DeepSeekError("invalid_response", "DeepSeek 返回了空结果，请重新推演。");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let finished = false;
  let firstReasoningTokenMs: number | undefined;
  let firstContentTokenMs: number | undefined;
  let usage: DeepSeekUsage | undefined;
  let lastDraft = "";

  const consume = (event: string) => {
    const data = sseData(event);
    if (!data) return;
    if (data === "[DONE]") {
      finished = true;
      return;
    }

    let chunk: {
      choices?: Array<{
        delta?: { content?: unknown; reasoning_content?: unknown };
        finish_reason?: unknown;
      }>;
      usage?: unknown;
    };
    try {
      chunk = JSON.parse(data) as typeof chunk;
    } catch {
      throw new DeepSeekError("invalid_response", "DeepSeek 流式结果无法解析，请重新推演。");
    }

    usage = normalizeUsage(chunk.usage) ?? usage;
    const choice = chunk.choices?.[0];
    if (choice?.finish_reason === "length") {
      throw new DeepSeekError("invalid_response", "DeepSeek 输出被截断，请重新推演。");
    }
    if (typeof choice?.delta?.reasoning_content === "string" && choice.delta.reasoning_content) {
      firstReasoningTokenMs ??= clockNow() - startedAt;
      report("reasoning");
    }
    if (typeof choice?.delta?.content === "string" && choice.delta.content) {
      firstContentTokenMs ??= clockNow() - startedAt;
      report("writing");
      content += choice.delta.content;
      const draft = readablePartial(content);
      if (draft) {
        const serialized = JSON.stringify(draft);
        if (serialized !== lastDraft) {
          lastDraft = serialized;
          reportPartial(onPartial, draft);
        }
      }
    }
  };

  while (!finished) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });

    let boundary = buffer.search(/\r?\n\r?\n/);
    while (boundary >= 0) {
      const event = buffer.slice(0, boundary);
      const separator = buffer.slice(boundary).match(/^\r?\n\r?\n/)?.[0] ?? "\n\n";
      buffer = buffer.slice(boundary + separator.length);
      consume(event);
      if (finished) break;
      boundary = buffer.search(/\r?\n\r?\n/);
    }

    if (done) break;
  }

  if (!finished && buffer.trim()) consume(buffer);
  if (!content.trim()) {
    throw new DeepSeekError("invalid_response", "DeepSeek 返回了空结果，请重新推演。");
  }
  report("validating");
  return { content, firstReasoningTokenMs, firstContentTokenMs, usage };
}

async function readCompletion(
  response: Response,
  options: CompletionOptions,
  startedAt: number,
): Promise<CompletionReadResult> {
  const report = progressReporter(options.onProgress);
  report("connected");
  return response.headers.get("Content-Type")?.includes("text/event-stream")
    ? readStreamedCompletion(response, report, startedAt, options.onPartial)
    : readJsonCompletion(response, report, startedAt, options.onPartial);
}

async function performRequest(
  messages: readonly ChatMessage[],
  key: string,
  options: CompletionOptions,
  attempt: number,
): Promise<string> {
  const externalSignal = options.signal;
  if (externalSignal?.aborted) {
    throw new DeepSeekError("aborted", "本次推演已取消。");
  }

  const reasoning = options.reasoning ?? "high";
  const requestKind = options.requestKind
    ?? (options.phase === "ending" ? "ending-primary" : "turn-primary");
  const startedAt = clockNow();
  let responseHeadersMs: number | undefined;
  let responseStatus: number | undefined;
  const controller = new AbortController();
  let timedOut = false;
  const handleExternalAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", handleExternalAbort, { once: true });
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(DEEPSEEK_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody(messages, reasoning)),
        signal: controller.signal,
      });
      responseHeadersMs = clockNow() - startedAt;
      responseStatus = response.status;
    } catch (error) {
      if (timedOut) {
        throw new DeepSeekError("timeout", "这次深度推演时间过长，请重新推演这一幕。");
      }
      if (externalSignal?.aborted) {
        throw new DeepSeekError("aborted", "本次推演已取消。");
      }
      throw new DeepSeekError("network", "网络连接中断，请重新推演这一幕。");
    }

    if (timedOut) {
      throw new DeepSeekError("timeout", "这次深度推演时间过长，请重新推演这一幕。");
    }
    if (!response.ok) throw errorForResponse(response);

    let result: CompletionReadResult;
    try {
      result = await readCompletion(response, options, startedAt);
    } catch (error) {
      if (timedOut) {
        throw new DeepSeekError("timeout", "这次深度推演时间过长，请重新推演这一幕。");
      }
      if (externalSignal?.aborted) {
        throw new DeepSeekError("aborted", "本次推演已取消。");
      }
      if (error instanceof TypeError || isAbortFailure(error)) {
        throw new DeepSeekError("network", "网络连接中断，请重新推演这一幕。");
      }
      if (!(error instanceof DeepSeekError)) {
        throw new DeepSeekError(
          "invalid_response",
          "DeepSeek 返回了无法读取的结果，请重新推演。",
        );
      }
      throw error;
    }
    if (timedOut) {
      throw new DeepSeekError("timeout", "这次深度推演时间过长，请重新推演这一幕。");
    }
    reportMetrics(options.onMetrics, {
      phase: options.phase,
      requestKind,
      reasoning,
      attempt,
      outcome: "success",
      responseHeadersMs,
      firstReasoningTokenMs: result.firstReasoningTokenMs,
      firstContentTokenMs: result.firstContentTokenMs,
      totalMs: clockNow() - startedAt,
      status: responseStatus,
      usage: result.usage,
    });
    return result.content;
  } catch (error) {
    const normalized = error instanceof DeepSeekError
      ? error
      : new DeepSeekError("request_failed", "推演请求失败，请重新推演这一幕。");
    reportMetrics(options.onMetrics, {
      phase: options.phase,
      requestKind,
      reasoning,
      attempt,
      outcome: "error",
      responseHeadersMs,
      totalMs: clockNow() - startedAt,
      status: responseStatus ?? normalized.status,
      errorCode: normalized.code,
    });
    throw error;
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", handleExternalAbort);
  }
}

export async function requestCompletion(
  messages: readonly ChatMessage[],
  options: CompletionOptions,
): Promise<string> {
  const key = apiKey();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      return await performRequest(messages, key, options, attempt + 1);
    } catch (error) {
      if (attempt < MAX_ATTEMPTS - 1 && isRetryable(error)) {
        await waitBeforeRetry(attempt + 1, error.retryAfterMs, options.signal);
        continue;
      }
      throw error;
    }
  }

  throw new DeepSeekError("request_failed", "推演请求失败，请重新推演这一幕。");
}
