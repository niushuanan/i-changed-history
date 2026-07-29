/// <reference types="vite/client" />

import type { ChatMessage } from "../game/prompts";
import { OBJ, parse as parsePartialJson } from "partial-json";
import {
  CompletionError,
  type CompletionOptions,
  type CompletionErrorCode,
  type CompletionPartialDraft,
  type CompletionProgress,
  type CompletionProgressStage,
  type CompletionReasoningEffort,
  type CompletionRequestKind,
  type CompletionRequestMetrics,
  type CompletionUsage,
} from "./completion-contract";

export { CompletionError } from "./completion-contract";
export type {
  CompletionOptions,
  CompletionErrorCode,
  CompletionPartialDraft,
  CompletionProgress,
  CompletionProgressStage,
  CompletionReasoningEffort,
  CompletionRequestKind,
  CompletionRequestMetrics,
  CompletionUsage,
} from "./completion-contract";

const SEED_MODEL_PRIORITY = [
  "doubao-seed-2-0-lite-260428",
  "doubao-seed-2-0-pro-260215",
  "doubao-seed-evolving",
] as const;
type SeedModelId = typeof SEED_MODEL_PRIORITY[number];
const SEED_REASONING_EFFORT = "minimal" as const;
const SEED_TEMPERATURE = 0.7;
const QUOTA_COOLDOWN_MS = 30 * 60 * 1_000;
const QUOTA_COOLDOWN_STORAGE_KEY = "history.seed.quota-cooldown.v1";
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
  id?: unknown;
};

type PlatformTask = {
  abort?: () => void;
};

type PlatformChatOptions = {
  type: "text";
  stream: boolean;
  model: string;
  reasoning_effort: typeof SEED_REASONING_EFFORT;
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

type ParsedStreamData =
  | { kind: "empty" }
  | { kind: "done" }
  | { kind: "provider"; payload: StreamPayload }
  | { kind: "text"; content: string };

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

function normalizeUsage(value: unknown): CompletionUsage | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  const usage = value as RawUsage;
  const normalized: CompletionUsage = {
    promptTokens: numeric(usage.prompt_tokens),
    promptCacheHitTokens: numeric(usage.prompt_cache_hit_tokens),
    promptCacheMissTokens: numeric(usage.prompt_cache_miss_tokens),
    completionTokens: numeric(usage.completion_tokens),
    reasoningTokens: numeric(usage.completion_tokens_details?.reasoning_tokens),
    totalTokens: numeric(usage.total_tokens),
  };
  return Object.values(normalized).some((item) => item !== undefined) ? normalized : undefined;
}

function readablePartial(content: string): CompletionPartialDraft | null {
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
  metrics: CompletionRequestMetrics,
): void {
  try {
    callback?.(metrics);
  } catch {
    // Telemetry must never interrupt the model request.
  }
}

function reportPartial(
  callback: CompletionOptions["onPartial"],
  draft: CompletionPartialDraft,
): void {
  try {
    callback?.(draft);
  } catch {
    // A rendering callback must never interrupt the model request.
  }
}

function progressReporter(onProgress?: CompletionOptions["onProgress"]) {
  const emitted = new Set<CompletionProgressStage>();
  return (stage: CompletionProgressStage) => {
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

function errorIdentity(error: PlatformFailure): string {
  return [
    error.errMsg,
    error.errNo,
    error.errCode,
    error.errorCode,
    error.errorType,
  ].filter((value) => typeof value === "string" || typeof value === "number")
    .join(" ");
}

function isQuotaExhaustion(error: PlatformFailure): boolean {
  const identity = errorIdentity(error).toLowerCase();
  return [
    "quotaexceeded",
    "quota_exceeded",
    "quota exceeded",
    "exceeded your current quota",
    "quota exhausted",
    "quota has been exhausted",
    "insufficient quota",
    "insufficientquota",
    "free quota is used up",
    "free quota has been used up",
    "insufficient balance",
    "额度已用完",
    "额度用完",
    "额度耗尽",
    "额度已耗尽",
    "额度不足",
    "配额已用完",
    "配额用完",
    "配额耗尽",
    "配额已耗尽",
    "配额不足",
    "超出配额",
    "余额不足",
  ].some((marker) => identity.includes(marker));
}

function quotaCooldowns(now = Date.now()): Partial<Record<SeedModelId, number>> {
  try {
    const raw = globalThis.sessionStorage?.getItem(QUOTA_COOLDOWN_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const cooldowns: Partial<Record<SeedModelId, number>> = {};
    for (const model of SEED_MODEL_PRIORITY) {
      const expiresAt = (parsed as Record<string, unknown>)[model];
      if (typeof expiresAt === "number" && Number.isFinite(expiresAt) && expiresAt > now) {
        cooldowns[model] = expiresAt;
      }
    }
    return cooldowns;
  } catch {
    return {};
  }
}

function writeQuotaCooldowns(cooldowns: Partial<Record<SeedModelId, number>>): void {
  try {
    if (Object.keys(cooldowns).length === 0) {
      globalThis.sessionStorage?.removeItem(QUOTA_COOLDOWN_STORAGE_KEY);
      return;
    }
    globalThis.sessionStorage?.setItem(QUOTA_COOLDOWN_STORAGE_KEY, JSON.stringify(cooldowns));
  } catch {
    // Storage is an optimization only; the ordered fallback still works without it.
  }
}

function rememberQuotaExhaustion(model: SeedModelId): void {
  writeQuotaCooldowns({
    ...quotaCooldowns(),
    [model]: Date.now() + QUOTA_COOLDOWN_MS,
  });
}

function clearQuotaCooldown(model: SeedModelId): void {
  const cooldowns = quotaCooldowns();
  if (cooldowns[model] === undefined) return;
  delete cooldowns[model];
  writeQuotaCooldowns(cooldowns);
}

function responseData(result: PlatformSuccess | PlatformFailure): string | undefined {
  return "data" in result && typeof result.data === "string" ? result.data : undefined;
}

function platformError(error: PlatformFailure): CompletionError {
  const status = errorNumber(error);
  const message = typeof error.errMsg === "string" ? error.errMsg : "";
  const lowerMessage = message.toLowerCase();
  const errorType = typeof error.errorType === "string" ? error.errorType : "";
  const reference = [
    errorType ? `类型 ${errorType}` : "",
    typeof status === "number" ? `错误码 ${status}` : "",
  ].filter(Boolean).join(" · ");
  const suffix = reference ? `（${reference}）` : "";

  if (isQuotaExhaustion(error)) {
    return new CompletionError(
      "quota_exhausted",
      `当前 Seed 模型额度已用完${suffix}。`,
      status,
      undefined,
      false,
    );
  }
  if (
    status === 20107
    || lowerMessage.includes("api key")
    || message.includes("服务账号")
    || message.includes("未配置")
  ) {
    return new CompletionError(
      "missing_api_key",
      `互动空间账号的火山方舟凭据不可用${suffix}，请检查平台 AI 服务配置后重试。`,
      status,
      undefined,
      false,
    );
  }
  if (status === 401) {
    return new CompletionError(
      "unauthorized",
      `互动空间 AI 服务鉴权失败${suffix}，请重新配置火山方舟 API Key。`,
      status,
      undefined,
      false,
    );
  }
  if (status === 403) {
    return new CompletionError(
      "forbidden",
      `当前火山账号没有调用该模型的权限${suffix}，请确认模型已开通。`,
      status,
      undefined,
      false,
    );
  }
  if (status === 429 || message.includes("频繁") || lowerMessage.includes("rate limit")) {
    return new CompletionError("rate_limited", `请求过于频繁${suffix}，请稍后重新推演。`, status);
  }
  if (errorType === "U") {
    return new CompletionError("aborted", `本次推演已取消${suffix}。`, status, undefined, false);
  }
  if (
    errorType === "F"
    || errorType === "I"
    || (typeof status === "number" && status >= 500 && status <= 599)
  ) {
    return new CompletionError(
      "service_unavailable",
      message
        ? `互动空间 AI 服务暂时不可用${suffix}：${message}`
        : `互动空间 AI 服务暂时不可用${suffix}，请重新推演这一幕。`,
      status,
    );
  }
  if (errorType === "D") {
    return new CompletionError(
      "request_failed",
      message
        ? `互动空间 AI 调用失败${suffix}：${message}`
        : `互动空间 AI 调用参数无效${suffix}。`,
      status,
      undefined,
      false,
    );
  }
  return new CompletionError(
    "network",
    message
      ? `互动空间 AI 连接失败${suffix}：${message}`
      : `互动空间 AI 连接中断${suffix}，请重新推演这一幕。`,
    status,
  );
}

function isRetryable(error: unknown): error is CompletionError {
  return (
    error instanceof CompletionError
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
    return Promise.reject(new CompletionError("aborted", "本次推演已取消。", undefined, undefined, false));
  }

  return new Promise((resolve, reject) => {
    const handleAbort = () => {
      clearTimeout(timer);
      reject(new CompletionError("aborted", "本次推演已取消。", undefined, undefined, false));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, retryDelayMs(attempt, retryAfterMs));
    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

function parseStreamData(rawData: unknown): ParsedStreamData {
  if (typeof rawData !== "string") return { kind: "empty" };
  const content = rawData.replace(/^data:\s?/, "");
  const trimmed = content.trim();
  if (!trimmed) return { kind: "empty" };
  if (trimmed === "[DONE]") return { kind: "done" };
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { kind: "text", content };
    }
    const candidate = parsed as StreamPayload;
    if (Array.isArray(candidate.choices) || candidate.usage !== undefined) {
      return { kind: "provider", payload: candidate };
    }
    return { kind: "text", content };
  } catch {
    return { kind: "text", content };
  }
}

function streamFailure(rawData: unknown): PlatformFailure {
  if (typeof rawData !== "string") {
    return { errMsg: "互动空间 AI 流式连接异常", errorType: "F" };
  }
  try {
    const parsed: unknown = JSON.parse(rawData);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as PlatformFailure;
    }
  } catch {
    // The platform also permits a plain-text error event.
  }
  return { errMsg: rawData, errorType: "F" };
}

function performRequest(
  messages: readonly ChatMessage[],
  options: CompletionOptions,
  model: SeedModelId,
  attempt: number,
  stream: boolean,
): Promise<string> {
  const runtime = platformRuntime();
  const callAIChatCompletion = runtime?.callAIChatCompletion;
  if (!callAIChatCompletion) {
    return Promise.reject(new CompletionError(
      "service_unavailable",
      "当前环境没有互动空间 AI 能力，请使用抖音 39.5.0 或更高版本继续体验。",
      undefined,
      undefined,
      false,
    ));
  }
  if (options.signal?.aborted) {
    return Promise.reject(new CompletionError("aborted", "本次推演已取消。", undefined, undefined, false));
  }

  // Interactive Space always runs Seed in its fastest documented no-thinking mode.
  // The engine may request a higher recovery effort for other providers, but the
  // Doubao package deliberately clamps every request to `minimal`.
  const reasoning = SEED_REASONING_EFFORT;
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
    let usage: CompletionUsage | undefined;

    const cleanup = () => {
      clearTimeout(timeout);
      options.signal?.removeEventListener("abort", handleAbort);
    };

    const finishSuccess = () => {
      if (settled) return;
      if (!content.trim()) {
        finishError(new CompletionError(
          "invalid_response",
          "互动空间 AI 返回了空结果，请重新推演。",
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
        model,
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

    const finishError = (error: CompletionError) => {
      if (settled) return;
      settled = true;
      cleanup();
      reportMetrics(options.onMetrics, {
        phase: options.phase,
        requestKind,
        reasoning,
        model,
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

    const appendContent = (contentDelta: string) => {
      if (!contentDelta) return;
      firstContentTokenMs ??= clockNow() - startedAt;
      report("writing");
      content += contentDelta;
      const draft = readablePartial(content);
      if (!draft) return;
      const serialized = JSON.stringify(draft);
      if (serialized === lastDraft) return;
      lastDraft = serialized;
      reportPartial(options.onPartial, draft);
    };

    const handleAbort = () => {
      try {
        task?.abort?.();
      } catch {
        // The client-owned cancellation state is authoritative.
      }
      finishError(new CompletionError("aborted", "本次推演已取消。", undefined, undefined, false));
    };

    const timeout = setTimeout(() => {
      try {
        task?.abort?.();
      } catch {
        // Timeout still rejects locally when the platform task has no abort method.
      }
      finishError(new CompletionError(
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
        stream,
        model,
        reasoning_effort: SEED_REASONING_EFFORT,
        messages: messages.map(({ role, content: messageContent }) => ({
          role,
          content: messageContent,
        })),
        temperature: SEED_TEMPERATURE,
        maxTokens: OUTPUT_TOKEN_BUDGET[options.phase],
        onSSE(event) {
          if (settled) return;
          markConnected();
          const eventName = typeof event.eventName === "string"
            ? event.eventName
            : "message";
          if (eventName === "open") return;
          if (eventName === "error") {
            const failure = streamFailure(event.data);
            if (failure.errorType === "I") return;
            finishError(platformError(failure));
            return;
          }
          const streamData = parseStreamData(event.data);
          if (streamData.kind === "done") {
            finishSuccess();
            return;
          }
          if (streamData.kind === "empty") return;
          if (streamData.kind === "text") {
            appendContent(streamData.content);
            return;
          }
          const payload = streamData.payload;
          usage = normalizeUsage(payload.usage) ?? usage;
          const choice = payload.choices?.[0];
          if (choice?.finish_reason === "length") {
            finishError(new CompletionError(
              "invalid_response",
              "互动空间 AI 输出被截断，请重新推演。",
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
          if (typeof contentDelta === "string") appendContent(contentDelta);
        },
        success(result) {
          if (settled) return;
          markConnected();
          const completeData = responseData(result);
          if (!content && completeData) {
            appendContent(completeData);
          }
          finishSuccess();
        },
        fail(error = {}) {
          if (error.errorType === "I") {
            markConnected();
            return;
          }
          finishError(platformError(error));
        },
        complete(result) {
          if (settled) return;
          markConnected();
          const completeData = responseData(result);
          if (!content && completeData) {
            appendContent(completeData);
          }
          finishSuccess();
        },
      });
    } catch (error) {
      finishError(error instanceof CompletionError
        ? error
        : new CompletionError(
            "request_failed",
            error instanceof Error && error.message
              ? `互动空间 AI 能力启动失败：${error.message}`
              : "互动空间 AI 能力启动失败，请重新推演这一幕。",
            undefined,
            undefined,
            false,
          ));
    }
  });
}

async function requestWithModelRetries(
  messages: readonly ChatMessage[],
  options: CompletionOptions,
  model: SeedModelId,
): Promise<string> {
  let stream = true;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      return await performRequest(messages, options, model, attempt + 1, stream);
    } catch (error) {
      if (
        stream
        && error instanceof CompletionError
        && error.code === "invalid_response"
        && attempt < MAX_ATTEMPTS - 1
      ) {
        stream = false;
        continue;
      }
      if (attempt < MAX_ATTEMPTS - 1 && isRetryable(error)) {
        await waitBeforeRetry(attempt + 1, error.retryAfterMs, options.signal);
        continue;
      }
      throw error;
    }
  }

  throw new CompletionError(
    "request_failed",
    "推演请求失败，请重新推演这一幕。",
    undefined,
    undefined,
    false,
  );
}

export async function requestCompletion(
  messages: readonly ChatMessage[],
  options: CompletionOptions,
): Promise<string> {
  const cooldowns = quotaCooldowns();
  const availableModels = SEED_MODEL_PRIORITY.filter((model) => cooldowns[model] === undefined);
  if (availableModels.length === 0) {
    throw new CompletionError(
      "quota_exhausted",
      "三个 Seed 模型的额度暂时都已用完，请稍后重新推演。",
      undefined,
      undefined,
      false,
    );
  }

  for (const model of availableModels) {
    try {
      const content = await requestWithModelRetries(messages, options, model);
      clearQuotaCooldown(model);
      return content;
    } catch (error) {
      if (error instanceof CompletionError && error.code === "quota_exhausted") {
        rememberQuotaExhaustion(model);
        continue;
      }
      throw error;
    }
  }

  throw new CompletionError(
    "quota_exhausted",
    "三个 Seed 模型的额度都已用完，请稍后重新推演。",
    undefined,
    undefined,
    false,
  );
}
