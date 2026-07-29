export type TapRecord = {
  id: string;
  kind: string;
  messages: readonly { role: "system" | "user"; content: string }[];
  response: string | null;
  timing: {
    totalMs: number;
    responseHeadersMs?: number;
    firstReasoningTokenMs?: number;
    firstContentTokenMs?: number;
    /** 请求发出时的 wall-clock 时间 (Date.now())，旧记录可能没有此字段 */
    requestedAt?: number;
  };
  usage: {
    promptTokens?: number;
    promptCacheHitTokens?: number;
    promptCacheMissTokens?: number;
    completionTokens?: number;
    reasoningTokens?: number;
    totalTokens?: number;
  } | null;
  status: number;
  error: { code: string; message: string } | null;
  timestamp: number;
};

export type TapChannelMessage =
  | { type: "request"; payload: TapRecord }
  | { type: "sync-request" }
  | { type: "sync-reply"; payload: TapRecord[] }
  | { type: "clear" };

export type TapTab = "input" | "output" | "metrics";
