import {
  ENDING_SYSTEM_PROMPT,
  TIMELINE_SYSTEM_PROMPT,
  TIMELINE_TURN_PROTOCOL,
} from "../src/game/deepseekProtocol";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
const DEFAULT_MODEL = "deepseek-v4-flash";
const MAX_REQUEST_BYTES = 512 * 1024;
const MAX_MESSAGE_CHARACTERS = 240_000;
const OUTPUT_TOKEN_BUDGET = { turn: 4096, ending: 2048 } as const;

const REQUEST_KINDS = new Set([
  "turn-primary",
  "turn-repair",
  "turn-recovery",
  "roll-primary",
  "roll-repair",
  "roll-recovery",
  "ending-primary",
  "ending-repair",
  "ending-recovery",
]);

type ProxyMessage = Readonly<{ role: "system" | "user"; content: string }>;

export type WorkerExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
};

export type DeepSeekProxyEnvelope = Readonly<{
  version: 1;
  phase: "turn" | "ending";
  requestKind:
    | "turn-primary"
    | "turn-repair"
    | "turn-recovery"
    | "roll-primary"
    | "roll-repair"
    | "roll-recovery"
    | "ending-primary"
    | "ending-repair"
    | "ending-recovery";
  reasoning: "minimal" | "high";
  messages: readonly ProxyMessage[];
}>;

export type DeepSeekProxyEnv = Readonly<{
  DEEPSEEK_API_KEY?: string;
  VITE_DEEPSEEK_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
  VITE_DEEPSEEK_MODEL?: string;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isProxyMessage(value: unknown): value is ProxyMessage {
  return (
    isRecord(value)
    && (value.role === "system" || value.role === "user")
    && typeof value.content === "string"
    && value.content.length > 0
  );
}

function validUserPayload(content: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return false;
  }
  if (!isRecord(parsed)) return false;
  const task = parsed.task;
  return typeof task === "string" && task.trim().length > 0;
}

function validTimelineProtocol(content: string): boolean {
  try {
    const parsed: unknown = JSON.parse(content);
    return isRecord(parsed) && parsed.protocol === TIMELINE_TURN_PROTOCOL;
  } catch {
    return false;
  }
}

export function parseProxyEnvelope(value: unknown): DeepSeekProxyEnvelope | null {
  if (!isRecord(value)) return null;
  if (value.version !== 1) return null;
  if (value.phase !== "turn" && value.phase !== "ending") return null;
  if (value.reasoning !== "minimal" && value.reasoning !== "high") return null;
  if (typeof value.requestKind !== "string" || !REQUEST_KINDS.has(value.requestKind)) return null;
  if (
    value.phase === "turn"
    && !value.requestKind.startsWith("turn-")
    && !value.requestKind.startsWith("roll-")
  ) return null;
  if (value.phase === "ending" && !value.requestKind.startsWith("ending-")) return null;
  if (!Array.isArray(value.messages) || !value.messages.every(isProxyMessage)) return null;

  const messages = value.messages;
  if (messages.length !== 2 && messages.length !== 3) return null;
  const expectedSystem = value.phase === "ending" ? ENDING_SYSTEM_PROMPT : TIMELINE_SYSTEM_PROMPT;
  if (messages[0].role !== "system" || messages[0].content !== expectedSystem) return null;
  if (messages.at(-1)?.role !== "user" || !validUserPayload(messages.at(-1)?.content ?? "")) return null;
  if (messages.length === 3) {
    if (messages[1].role !== "system" || !validTimelineProtocol(messages[1].content)) return null;
  }
  if (messages.reduce((sum, message) => sum + message.content.length, 0) > MAX_MESSAGE_CHARACTERS) {
    return null;
  }

  return value as DeepSeekProxyEnvelope;
}

export function buildDeepSeekRequestBody(envelope: DeepSeekProxyEnvelope, model = DEFAULT_MODEL) {
  const shared = {
    model,
    messages: envelope.messages,
    response_format: { type: "json_object" },
    stream: true,
    stream_options: { include_usage: true },
    max_tokens: OUTPUT_TOKEN_BUDGET[envelope.phase],
  } as const;

  return envelope.reasoning === "minimal"
    ? { ...shared, thinking: { type: "disabled" } } as const
    : {
        ...shared,
        thinking: { type: "enabled" },
        reasoning_effort: "high",
      } as const;
}

function jsonError(message: string, status: number, headers?: HeadersInit): Response {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...Object.fromEntries(new Headers(headers)),
      },
    },
  );
}

function isLocalRequest(request: Request): boolean {
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

function secureSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite)) return false;

  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function runtimeValue(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function proxyResponseHeaders(upstream: Response): Headers {
  const headers = new Headers({
    "Cache-Control": "no-cache, no-store, no-transform",
    "Content-Type": upstream.headers.get("Content-Type") ?? "text/event-stream; charset=utf-8",
    "X-Accel-Buffering": "no",
    "X-Content-Type-Options": "nosniff",
  });
  const retryAfter = upstream.headers.get("Retry-After");
  const requestId = upstream.headers.get("X-Request-ID");
  if (retryAfter) headers.set("Retry-After", retryAfter);
  if (requestId) headers.set("X-Request-ID", requestId);
  return headers;
}

function streamedBody(
  body: ReadableStream<Uint8Array>,
  abortController: AbortController,
  cleanup: () => void,
): ReadableStream<Uint8Array> {
  const reader = body.getReader();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const result = await reader.read();
        if (result.done) {
          cleanup();
          controller.close();
          return;
        }
        controller.enqueue(result.value);
      } catch (error) {
        cleanup();
        controller.error(error);
      }
    },
    async cancel(reason) {
      abortController.abort(reason);
      cleanup();
      await reader.cancel(reason);
    },
  });
}

export async function handleDeepSeekProxy(
  request: Request,
  env: DeepSeekProxyEnv,
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonError("Method not allowed.", 405, { Allow: "POST" });
  }
  if (!secureSameOriginRequest(request)) {
    return jsonError("Cross-site requests are not allowed.", 403);
  }

  const declaredLength = Number.parseInt(request.headers.get("Content-Length") ?? "0", 10);
  if (declaredLength > MAX_REQUEST_BYTES) {
    return jsonError("Request is too large.", 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonError("Request body could not be read.", 400);
  }
  if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
    return jsonError("Request is too large.", 413);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return jsonError("Request body must be valid JSON.", 400);
  }
  const envelope = parseProxyEnvelope(parsedBody);
  if (!envelope) {
    return jsonError("Request does not match the history simulation protocol.", 400);
  }

  const localRequest = isLocalRequest(request);
  const apiKey = localRequest
    ? runtimeValue(env.VITE_DEEPSEEK_API_KEY) ?? runtimeValue(env.DEEPSEEK_API_KEY)
    : runtimeValue(env.DEEPSEEK_API_KEY);
  if (!apiKey) {
    return jsonError("The history simulation service is not configured.", 503);
  }

  const abortController = new AbortController();
  const handleAbort = () => abortController.abort(request.signal.reason);
  request.signal.addEventListener("abort", handleAbort, { once: true });
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    request.signal.removeEventListener("abort", handleAbort);
  };

  let upstream: Response;
  try {
    upstream = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildDeepSeekRequestBody(
        envelope,
        runtimeValue(env.DEEPSEEK_MODEL) ?? runtimeValue(env.VITE_DEEPSEEK_MODEL) ?? DEFAULT_MODEL,
      )),
      signal: abortController.signal,
    });
  } catch (error) {
    cleanup();
    if (!request.signal.aborted) {
      return jsonError("The history simulation service is unavailable.", 503);
    }
    throw error;
  }

  const headers = proxyResponseHeaders(upstream);
  if (!upstream.ok || !upstream.body) {
    cleanup();
    return new Response(null, { status: upstream.status || 503, headers });
  }

  return new Response(streamedBody(upstream.body, abortController, cleanup), {
    status: upstream.status,
    headers,
  });
}
