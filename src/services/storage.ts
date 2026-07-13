import { z } from "zod";
import type { GameState } from "../game/reducer";
import { createInitialGameState } from "../game/reducer";
import { alternatePresentSchema, timelineTurnSchema } from "../game/schema";

export const GAME_STORAGE_KEY = "i-changed-history:session:v11";
const LEGACY_GAME_STORAGE_KEYS = [
  "i-changed-history:session:v10", "i-changed-history:session:v9", "i-changed-history:session:v8",
  "i-changed-history:session:v7", "i-changed-history:session:v6", "i-changed-history:session:v5",
  "i-changed-history:session:v4",
] as const;
const STORAGE_VERSION = 11;
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type StoredState = Omit<GameState, "pendingTurn" | "pendingEnding" | "echo">;

const occupation = z.enum(["student", "product", "engineering", "business", "creative", "public-service"]);
const strength = z.enum(["negotiation", "organization", "technology", "business", "writing", "strategy", "law", "medicine"]);
const risk = z.enum(["cautious", "balanced", "bold"]);
const seedSchema = z.strictObject({
  id: z.string(), era: z.enum(["ancient", "medieval", "early-modern", "industrial", "modern"]), year: z.number().int(),
  dateLabel: z.string(), eventName: z.string(), location: z.string(), chinaRelated: z.boolean(), perspective: z.enum(["china", "world"]),
  role: z.string(), decision: z.string(), urgency: z.string(), historicalOutcome: z.string(),
  baselineFacts: z.tuple([z.string(), z.string(), z.string()]), prompt: z.string(), domain: z.string(),
  visualTone: z.enum(["ancient", "exchange", "print", "revolution", "industry", "war", "space", "digital"]),
  occupationTags: z.array(occupation), strengthTags: z.array(strength), riskTags: z.array(risk),
});
const scenarioSchema = z.strictObject({ seed: seedSchema });
const deviationClass = z.enum(["nudge", "reform", "rupture"]);
const resolvedEchoSchema = z.strictObject({
  directResult: z.string(), unexpectedCost: z.string(), beneficiary: z.string(), payer: z.string(),
});
const playedSchema = z.strictObject({
  turn: timelineTurnSchema,
  selectedChoiceId: z.enum(["A", "B", "C", "custom"]),
  selectedChoiceLabel: z.string(),
  selectedDeviationClass: deviationClass,
  resolvedEcho: resolvedEchoSchema,
  playerAuthored: z.boolean().optional(),
  canonStatus: z.literal("玩家钦定").optional(),
  causalMechanism: z.string().optional(),
});
const retrySchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("opening") }),
  z.strictObject({ kind: z.literal("next-turn"), targetChapter: z.number().int().min(2).max(12) }),
  z.strictObject({ kind: z.literal("custom-action"), action: z.string().trim().min(2).max(80) }),
  z.strictObject({ kind: z.literal("ending") }),
]);
const requestSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("opening"), id: z.number().int().positive() }),
  z.strictObject({ kind: z.literal("next-turn"), targetChapter: z.number().int().min(2).max(12), id: z.number().int().positive() }),
  z.strictObject({ kind: z.literal("custom-action"), action: z.string().trim().min(2).max(80), id: z.number().int().positive() }),
  z.strictObject({ kind: z.literal("ending"), id: z.number().int().positive() }),
]);
const errorSchema = z.strictObject({ code: z.string(), message: z.string(), retry: retrySchema });
const stateSchema = z.strictObject({
  phase: z.enum(["selecting", "generating", "adjudicating", "event", "ending", "result", "error"]),
  scenario: scenarioSchema.nullable(),
  currentTurn: timelineTurnSchema.nullable(),
  playedTurns: z.array(playedSchema).max(12),
  deviation: z.number().int().min(0).max(100),
  lastImpact: z.number().int().min(0).max(100),
  customActionsUsed: z.number().int().min(0),
  request: requestSchema.nullable(),
  result: alternatePresentSchema.nullable(),
  error: errorSchema.nullable(),
  nextRequestId: z.number().int().positive(),
}).superRefine((state, context) => {
  if (["generating", "adjudicating", "event", "ending", "result", "error"].includes(state.phase) && !state.scenario) context.addIssue({ code: "custom", message: "缺少历史场景" });
  if (state.phase === "event" && !state.currentTurn) context.addIssue({ code: "custom", message: "事件缺少幕次" });
  if (state.phase === "adjudicating" && !state.currentTurn) context.addIssue({ code: "custom", message: "自由改命缺少当前幕次" });
  if (state.phase === "result" && !state.result) context.addIssue({ code: "custom", message: "结局缺失" });
  if (state.phase === "error" && !state.error) context.addIssue({ code: "custom", message: "错误恢复信息缺失" });
  if (["generating", "adjudicating", "ending"].includes(state.phase) && !state.request) context.addIssue({ code: "custom", message: "生成阶段缺少可恢复请求" });
});
const envelopeSchema = z.strictObject({ version: z.literal(STORAGE_VERSION), state: stateSchema });

function base(state: GameState) {
  return {
    scenario: state.scenario, currentTurn: state.currentTurn,
    playedTurns: state.playedTurns, deviation: state.deviation, lastImpact: state.lastImpact,
    customActionsUsed: state.customActionsUsed, result: state.result, nextRequestId: state.nextRequestId,
  };
}

function toStored(state: GameState): StoredState | null {
  if (state.pendingTurn) return { ...base(state), phase: "event", currentTurn: state.pendingTurn, request: null, error: null };
  if (state.pendingEnding) return { ...base(state), phase: "result", result: state.pendingEnding, request: null, error: null };
  if (state.request) return {
    ...base(state),
    phase: state.request.kind === "ending" ? "ending" : state.request.kind === "custom-action" ? "adjudicating" : "generating",
    request: state.request,
    error: null,
  };
  if (state.phase === "echo" && state.error) return { ...base(state), phase: "error", request: null, error: state.error };
  if (["selecting", "event", "result", "error"].includes(state.phase)) {
    return { ...base(state), phase: state.phase as StoredState["phase"], request: null, error: state.error };
  }
  return null;
}

function remove(storage: StorageLike, key = GAME_STORAGE_KEY) {
  try { storage.removeItem(key); } catch { /* storage unavailable */ }
}

export function saveGameSnapshot(state: GameState, storage: StorageLike = localStorage): boolean {
  const stored = toStored(state);
  if (!stored) return false;
  try {
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state: stored }));
    return true;
  } catch {
    return false;
  }
}

export function loadGameSnapshot(storage: StorageLike = localStorage): GameState | null {
  try {
    const current = storage.getItem(GAME_STORAGE_KEY);
    if (current) {
      const parsed = envelopeSchema.safeParse(JSON.parse(current));
      if (!parsed.success) { remove(storage); return null; }
      return { ...parsed.data.state, pendingTurn: null, pendingEnding: null, echo: null } as GameState;
    }

    for (const key of LEGACY_GAME_STORAGE_KEYS) {
      const legacy = storage.getItem(key);
      if (!legacy) continue;
      const raw = JSON.parse(legacy) as { state?: { nextRequestId?: unknown } };
      const nextRequestId = typeof raw.state?.nextRequestId === "number" ? raw.state.nextRequestId : 1;
      const fresh = createInitialGameState(nextRequestId);
      storage.setItem(GAME_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state: toStored(fresh) }));
      remove(storage, key);
      return fresh;
    }
    return null;
  } catch {
    remove(storage);
    return null;
  }
}
