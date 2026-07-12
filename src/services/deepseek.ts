/// <reference types="vite/client" />

import type { ChatMessage } from "../game/prompts";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-v4-flash";
const REQUEST_TIMEOUT_MS = 28_000;
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
};

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
    stream: false,
  } as const;

  if (phase === "ending") {
    return {
      ...shared,
      thinking: { type: "enabled" },
      reasoning_effort: "high",
      max_tokens: 1800,
    } as const;
  }

  return {
    ...shared,
    thinking: { type: "disabled" },
    max_tokens: 1100,
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

async function readCompletion(response: Response): Promise<string> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new DeepSeekError("invalid_response", "DeepSeek 返回了无法读取的结果，请重新推演。");
  }

  const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]
    ?.message?.content;
  if (typeof content !== "string" || content.trim() === "") {
    throw new DeepSeekError("invalid_response", "DeepSeek 返回了空结果，请重新推演。");
  }

  return content;
}

async function performRequest(
  messages: readonly ChatMessage[],
  phase: DeepSeekPhase,
  key: string,
  externalSignal?: AbortSignal,
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
        throw new DeepSeekError("timeout", "推演超过 28 秒，请重新推演这一幕。");
      }
      if (externalSignal?.aborted) {
        throw new DeepSeekError("aborted", "本次推演已取消。");
      }
      throw new DeepSeekError("network", "网络连接中断，请重新推演这一幕。");
    }

    if (timedOut) {
      throw new DeepSeekError("timeout", "推演超过 28 秒，请重新推演这一幕。");
    }
    if (!response.ok) throw errorForStatus(response.status);

    let content: string;
    try {
      content = await readCompletion(response);
    } catch (error) {
      if (timedOut) {
        throw new DeepSeekError("timeout", "推演超过 28 秒，请重新推演这一幕。");
      }
      throw error;
    }
    if (timedOut) {
      throw new DeepSeekError("timeout", "推演超过 28 秒，请重新推演这一幕。");
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
      return await performRequest(messages, options.phase, key, options.signal);
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
