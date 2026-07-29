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
  | { type: "sync-reply"; payload: TapRecord[] };

export type TapTab = "input" | "output" | "metrics";
