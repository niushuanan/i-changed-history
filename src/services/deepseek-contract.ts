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

type DeepSeekPhase = "turn" | "ending";

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
    public readonly retryable = true,
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

export type DeepSeekProgressStage =
  | "connected"
  | "reasoning"
  | "writing"
  | "validating"
  | "repairing";

export type DeepSeekProgress = { stage: DeepSeekProgressStage };
