/// <reference types="vite/client" />

import type { ChatMessage } from "../game/prompts";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL?.trim() || "deepseek-v4-flash";
const REQUEST_TIMEOUT_MS = 90_000;
const RETRY_DELAY_MS = 650;
const MAX_ATTEMPTS = 2;

type DeepSeekPhase = "turn" | "ending";

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
  ) {
    super(message);
  }
}

export type CompletionOptions = {
  phase: DeepSeekPhase;
  signal?: AbortSignal;
  onProgress?: (progress: DeepSeekProgress) => void;
};

export type DeepSeekProgressStage = "connected" | "reasoning" | "writing" | "validating" | "repairing";
export type DeepSeekProgress = { stage: DeepSeekProgressStage };

function apiKey(): string {
  const key = import.meta.env.VITE_DEEPSEEK_API_KEY?.trim();
  if (!key) throw new DeepSeekError("missing_api_key", "未配置 DeepSeek API 密钥。");
  return key;
}

function requestBody(messages: readonly ChatMessage[], phase: DeepSeekPhase) {
  const shared = {
    model: DEEPSEEK_MODEL,
    messages,
    response_format: { type: "json_object" },
    stream: true,
    stream_options: { include_usage: true },
  } as const;

  return {
    ...shared,
    thinking: { type: "enabled" },
    reasoning_effort: "high",
    max_tokens: 8192,
  } as const;
}

function errorForStatus(status: number): DeepSeekError {
  if (status === 401) {
    return new DeepSeekError("unauthorized", "DeepSeek API 密钥无效，请检查后重试。", status);
  }
  if (status === 403) {
    return new DeepSeekError("forbidden", "当前 DeepSeek API 密钥没有调用权限。", status);
  }
  if (status === 429) {
    return new DeepSeekError("rate_limited", "请求过于频繁，请稍后重新推演。", status);
  }
  if (status >= 500) {
    return new DeepSeekError(
      "service_unavailable",
      "DeepSeek 服务暂时不可用，请重新推演这一幕。",
      status,
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

function waitBeforeRetry(signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(new DeepSeekError("aborted", "本次推演已取消。"));
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", handleAbort);
      resolve();
    }, RETRY_DELAY_MS);

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

async function readJsonCompletion(response: Response, report: (stage: DeepSeekProgressStage) => void): Promise<string> {
  const payload: unknown = await response.json();

  const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]
    ?.message?.content;
  if (typeof content !== "string" || content.trim() === "") {
    throw new DeepSeekError("invalid_response", "DeepSeek 返回了空结果，请重新推演。");
  }

  report("writing");
  report("validating");
  return content;
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
): Promise<string> {
  if (!response.body) {
    throw new DeepSeekError("invalid_response", "DeepSeek 返回了空结果，请重新推演。");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let finished = false;

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
    };
    try {
      chunk = JSON.parse(data) as typeof chunk;
    } catch {
      throw new DeepSeekError("invalid_response", "DeepSeek 流式结果无法解析，请重新推演。");
    }

    const choice = chunk.choices?.[0];
    if (choice?.finish_reason === "length") {
      throw new DeepSeekError("invalid_response", "DeepSeek 输出被截断，请重新推演。");
    }
    if (typeof choice?.delta?.reasoning_content === "string" && choice.delta.reasoning_content) {
      report("reasoning");
    }
    if (typeof choice?.delta?.content === "string" && choice.delta.content) {
      report("writing");
      content += choice.delta.content;
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
  return content;
}

async function readCompletion(
  response: Response,
  onProgress?: CompletionOptions["onProgress"],
): Promise<string> {
  const report = progressReporter(onProgress);
  report("connected");
  return response.headers.get("Content-Type")?.includes("text/event-stream")
    ? readStreamedCompletion(response, report)
    : readJsonCompletion(response, report);
}

async function performRequest(
  messages: readonly ChatMessage[],
  phase: DeepSeekPhase,
  key: string,
  externalSignal?: AbortSignal,
  onProgress?: CompletionOptions["onProgress"],
): Promise<string> {
  if (externalSignal?.aborted) {
    throw new DeepSeekError("aborted", "本次推演已取消。");
  }

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
        body: JSON.stringify(requestBody(messages, phase)),
        signal: controller.signal,
      });
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
    if (!response.ok) throw errorForStatus(response.status);

    let content: string;
    try {
      content = await readCompletion(response, onProgress);
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
    return content;
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
      return await performRequest(messages, options.phase, key, options.signal, options.onProgress);
    } catch (error) {
      if (attempt === 0 && isRetryable(error)) {
        await waitBeforeRetry(options.signal);
        continue;
      }
      throw error;
    }
  }

  throw new DeepSeekError("request_failed", "推演请求失败，请重新推演这一幕。");
}
