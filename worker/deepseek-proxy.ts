import {
  ENDING_BIOGRAPHY_TASK_PREFIX,
  ENDING_WORLD_TASK_PREFIX,
  TIMELINE_SYSTEM_PROMPT,
  TIMELINE_TURN_PROTOCOL,
} from "../src/game/deepseekProtocol";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
const DEFAULT_MODEL = "deepseek-v4-flash";
const MAX_REQUEST_BYTES = 512 * 1024;
const MAX_MESSAGE_CHARACTERS = 240_000;
const GUEST_COOKIE = "history_guest";
const DAY_MS = 24 * 60 * 60 * 1_000;
const MINUTE_MS = 60 * 1_000;

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

export type D1PreparedStatementLike = {
  bind(...values: unknown[]): D1PreparedStatementLike;
  run(): Promise<unknown>;
};

export type D1DatabaseLike = {
  prepare(query: string): D1PreparedStatementLike;
  batch(statements: readonly D1PreparedStatementLike[]): Promise<ReadonlyArray<{ results: unknown[] }>>;
};

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
  reasoning: "fast" | "high";
  messages: readonly ProxyMessage[];
}>;

export type DeepSeekProxyEnv = Readonly<{
  DB: D1DatabaseLike;
  DEEPSEEK_API_KEY?: string;
  VITE_DEEPSEEK_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
  VITE_DEEPSEEK_MODEL?: string;
  RATE_LIMIT_SALT?: string;
  DEEPSEEK_GLOBAL_DAILY_LIMIT?: string;
}>;

type RateLimitReservation = Readonly<{
  bucket: string;
  windowStart: number;
  amount: number;
  limit: number;
  windowMs: number;
}>;

type GuestIdentity = Readonly<{
  id: string;
  setCookie?: string;
}>;

let rateLimitSchemaReady: Promise<void> | undefined;

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

function allowedUserTask(content: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return false;
  }
  if (!isRecord(parsed)) return false;
  const task = parsed.task;
  if (typeof task !== "string") return false;
  return [
    "生成第 ",
    "为当前同一历史现场发出第 ",
    "玩家正在直接写入一条新的历史结果。",
    ENDING_BIOGRAPHY_TASK_PREFIX,
    ENDING_WORLD_TASK_PREFIX,
    "修复下面的模型输出",
    "上一输出只有部分字段校验失败。",
    "上一输出校验失败。",
  ].some((prefix) => task.startsWith(prefix));
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
  if (value.reasoning !== "fast" && value.reasoning !== "high") return null;
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
  if (messages[0].role !== "system" || messages[0].content !== TIMELINE_SYSTEM_PROMPT) return null;
  if (messages.at(-1)?.role !== "user" || !allowedUserTask(messages.at(-1)?.content ?? "")) return null;
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
    max_tokens: 8192,
  } as const;

  return envelope.reasoning === "fast"
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

function cookieValues(request: Request): Map<string, string> {
  const cookies = new Map<string, string>();
  for (const item of request.headers.get("Cookie")?.split(";") ?? []) {
    const separator = item.indexOf("=");
    if (separator <= 0) continue;
    cookies.set(item.slice(0, separator).trim(), decodeURIComponent(item.slice(separator + 1).trim()));
  }
  return cookies;
}

function toHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmac(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function guestIdentity(request: Request, secret: string): Promise<GuestIdentity> {
  const stored = cookieValues(request).get(GUEST_COOKIE);
  if (stored) {
    const separator = stored.lastIndexOf(".");
    const id = stored.slice(0, separator);
    const signature = stored.slice(separator + 1);
    if (
      separator > 0
      && /^[a-f0-9-]{36}$/.test(id)
      && constantTimeEqual(signature, await hmac(`guest:${id}`, secret))
    ) {
      return { id };
    }
  }

  const id = crypto.randomUUID();
  const signature = await hmac(`guest:${id}`, secret);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return {
    id,
    setCookie: `${GUEST_COOKIE}=${encodeURIComponent(`${id}.${signature}`)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${secure}`,
  };
}

function clientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP")
    ?? request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()
    ?? "unknown"
  );
}

async function ensureRateLimitSchema(database: D1DatabaseLike): Promise<void> {
  rateLimitSchemaReady ??= database.prepare(`
    CREATE TABLE IF NOT EXISTS ai_rate_limits (
      bucket TEXT NOT NULL,
      window_start INTEGER NOT NULL,
      request_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (bucket, window_start)
    )
  `).run().then(() => undefined).catch((error) => {
    rateLimitSchemaReady = undefined;
    throw error;
  });
  return rateLimitSchemaReady;
}

function globalDailyLimit(env: DeepSeekProxyEnv): number {
  const configured = Number.parseInt(env.DEEPSEEK_GLOBAL_DAILY_LIMIT ?? "", 10);
  return Number.isFinite(configured) && configured >= 100 ? configured : 1_000;
}

async function reservationsFor(
  request: Request,
  env: DeepSeekProxyEnv,
  guest: GuestIdentity,
  salt: string,
  reasoning: DeepSeekProxyEnvelope["reasoning"],
): Promise<readonly RateLimitReservation[]> {
  const now = Date.now();
  const amount = reasoning === "high" ? 3 : 1;
  const ipHash = await hmac(`ip:${clientIp(request)}`, salt);
  const guestHash = await hmac(`guest-bucket:${guest.id}`, salt);
  const dailyWindow = Math.floor(now / DAY_MS) * DAY_MS;
  const minuteWindow = Math.floor(now / MINUTE_MS) * MINUTE_MS;

  return [
    { bucket: `burst:${ipHash}`, windowStart: minuteWindow, amount, limit: 12, windowMs: MINUTE_MS },
    { bucket: `guest:${guestHash}`, windowStart: dailyWindow, amount, limit: 80, windowMs: DAY_MS },
    { bucket: `ip:${ipHash}`, windowStart: dailyWindow, amount, limit: 240, windowMs: DAY_MS },
    { bucket: "global", windowStart: dailyWindow, amount, limit: globalDailyLimit(env), windowMs: DAY_MS },
  ];
}

async function updateReservations(
  database: D1DatabaseLike,
  reservations: readonly RateLimitReservation[],
): Promise<readonly number[]> {
  const now = Date.now();
  const statements = reservations.map((reservation) => database.prepare(`
    INSERT INTO ai_rate_limits (bucket, window_start, request_count, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(bucket, window_start) DO UPDATE SET
      request_count = request_count + excluded.request_count,
      updated_at = excluded.updated_at
    RETURNING request_count
  `).bind(reservation.bucket, reservation.windowStart, reservation.amount, now));
  const results = await database.batch(statements);
  return results.map((result) => Number((result.results[0] as { request_count?: unknown } | undefined)?.request_count ?? 0));
}

async function refundReservations(
  database: D1DatabaseLike,
  reservations: readonly RateLimitReservation[],
): Promise<void> {
  await database.batch(reservations.map((reservation) => database.prepare(`
    UPDATE ai_rate_limits
    SET request_count = MAX(0, request_count - ?), updated_at = ?
    WHERE bucket = ? AND window_start = ?
  `).bind(reservation.amount, Date.now(), reservation.bucket, reservation.windowStart)));
}

async function reserveRateLimit(
  request: Request,
  env: DeepSeekProxyEnv,
  guest: GuestIdentity,
  salt: string,
  reasoning: DeepSeekProxyEnvelope["reasoning"],
): Promise<
  | { allowed: true; reservations: readonly RateLimitReservation[] }
  | { allowed: false; retryAfterSeconds: number }
> {
  await ensureRateLimitSchema(env.DB);
  const reservations = await reservationsFor(request, env, guest, salt, reasoning);
  const counts = await updateReservations(env.DB, reservations);
  const denied = reservations
    .map((reservation, index) => ({ reservation, count: counts[index] }))
    .find(({ reservation, count }) => count > reservation.limit);

  if (!denied) return { allowed: true, reservations };
  await refundReservations(env.DB, reservations);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((denied.reservation.windowStart + denied.reservation.windowMs - Date.now()) / 1_000),
  );
  return { allowed: false, retryAfterSeconds };
}

function proxyResponseHeaders(upstream: Response, setCookie?: string): Headers {
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
  if (setCookie) headers.append("Set-Cookie", setCookie);
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
  context: WorkerExecutionContext,
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

  const apiKey = isLocalRequest(request)
    ? runtimeValue(env.VITE_DEEPSEEK_API_KEY) ?? runtimeValue(env.DEEPSEEK_API_KEY)
    : runtimeValue(env.DEEPSEEK_API_KEY);
  if (!apiKey) {
    return jsonError("The history simulation service is not configured.", 503);
  }
  const salt = runtimeValue(env.RATE_LIMIT_SALT) ?? (
    isLocalRequest(request) ? "local-history-rate-limit" : undefined
  );
  if (!salt) {
    return jsonError("The history simulation limit is not configured.", 503);
  }

  const guest = await guestIdentity(request, salt);
  let reserved: Awaited<ReturnType<typeof reserveRateLimit>>;
  try {
    reserved = await reserveRateLimit(request, env, guest, salt, envelope.reasoning);
  } catch {
    return jsonError("The history simulation limit is temporarily unavailable.", 503);
  }
  if (!reserved.allowed) {
    return jsonError(
      "Too many history simulation requests.",
      429,
      {
        "Retry-After": String(reserved.retryAfterSeconds),
        "X-History-Rate-Limit": "quota",
        ...(guest.setCookie ? { "Set-Cookie": guest.setCookie } : {}),
      },
    );
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
      context.waitUntil(refundReservations(env.DB, reserved.reservations));
      return jsonError("The history simulation service is unavailable.", 503);
    }
    throw error;
  }

  const headers = proxyResponseHeaders(upstream, guest.setCookie);
  if (!upstream.ok || !upstream.body) {
    cleanup();
    context.waitUntil(refundReservations(env.DB, reserved.reservations));
    return new Response(null, { status: upstream.status || 503, headers });
  }

  return new Response(streamedBody(upstream.body, abortController, cleanup), {
    status: upstream.status,
    headers,
  });
}
