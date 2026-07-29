export type CompletionReasoningEffort = "minimal" | "high";

export type CompletionRequestKind =
  | "turn-primary"
  | "turn-repair"
  | "turn-recovery"
  | "roll-primary"
  | "roll-repair"
  | "roll-recovery"
  | "ending-primary"
  | "ending-repair"
  | "ending-recovery";

export type CompletionPartialDraft = Readonly<Partial<{
  headline: string;
  narrative: string;
  location: string;
  role: string;
  immediateObjective: string;
  timePressure: string;
}>>;

export type CompletionUsage = Readonly<{
  promptTokens?: number;
  promptCacheHitTokens?: number;
  promptCacheMissTokens?: number;
  completionTokens?: number;
  reasoningTokens?: number;
  totalTokens?: number;
}>;

type CompletionPhase = "turn" | "ending";

export type CompletionRequestMetrics = Readonly<{
  phase: CompletionPhase;
  requestKind: CompletionRequestKind;
  reasoning: CompletionReasoningEffort;
  attempt: number;
  outcome: "success" | "error";
  responseHeadersMs?: number;
  firstReasoningTokenMs?: number;
  firstContentTokenMs?: number;
  totalMs: number;
  status?: number;
  usage?: CompletionUsage;
  errorCode?: CompletionErrorCode;
}>;

export type CompletionErrorCode =
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

export class CompletionError extends Error {
  readonly name = "CompletionError";

  constructor(
    public readonly code: CompletionErrorCode,
    message: string,
    public readonly status?: number,
    public readonly retryAfterMs?: number,
    public readonly retryable = true,
  ) {
    super(message);
  }
}

export type CompletionOptions = {
  phase: CompletionPhase;
  reasoning?: CompletionReasoningEffort;
  requestKind?: CompletionRequestKind;
  signal?: AbortSignal;
  onProgress?: (progress: CompletionProgress) => void;
  onPartial?: (draft: CompletionPartialDraft) => void;
  onMetrics?: (metrics: CompletionRequestMetrics) => void;
};

export type CompletionProgressStage =
  | "connected"
  | "reasoning"
  | "writing"
  | "validating"
  | "repairing";

export type CompletionProgress = { stage: CompletionProgressStage };
