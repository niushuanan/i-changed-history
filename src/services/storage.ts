import { z } from "zod";
import type { GameState, RetryIntent } from "../game/reducer";
import { alternatePresentSchema, timelineTurnSchema } from "../game/schema";

export const GAME_STORAGE_KEY = "i-changed-history:session:v3";
const STORAGE_VERSION = 3;
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type StoredState = Omit<GameState, "request" | "pendingTurn" | "pendingEnding" | "echo">;

const occupation = z.enum(["student", "product", "engineering", "business", "creative", "public-service"]);
const strength = z.enum(["negotiation", "organization", "technology", "business", "writing", "strategy", "law", "medicine"]);
const risk = z.enum(["cautious", "balanced", "bold"]);
const profileSchema = z.strictObject({
  name: z.string().trim().min(2).max(12), occupation,
  strengths: z.tuple([strength, strength]).refine(([a, b]) => a !== b), riskStyle: risk,
});
const seedSchema = z.strictObject({
  id: z.string(), era: z.enum(["ancient", "medieval", "early-modern", "industrial", "modern"]), year: z.number().int(),
  dateLabel: z.string(), eventName: z.string(), location: z.string(), chinaRelated: z.boolean(), perspective: z.enum(["china", "world"]),
  role: z.string(), decision: z.string(), urgency: z.string(), historicalOutcome: z.string(),
  baselineFacts: z.tuple([z.string(), z.string(), z.string()]), prompt: z.string(), domain: z.string(),
  visualTone: z.enum(["ancient", "exchange", "print", "revolution", "industry", "war", "space", "digital"]),
  occupationTags: z.array(occupation), strengthTags: z.array(strength), riskTags: z.array(risk),
});
const scenarioSchema = z.strictObject({ profile: profileSchema, seed: seedSchema });
const deviationClass = z.enum(["nudge", "reform", "rupture"]);
const playedSchema = z.strictObject({
  turn: timelineTurnSchema, selectedChoiceId: z.enum(["A", "B", "C"]), selectedChoiceLabel: z.string(), selectedDeviationClass: deviationClass,
}).superRefine((played, context) => {
  const choice = played.turn.choices.find((candidate) => candidate.id === played.selectedChoiceId);
  if (!choice || choice.label !== played.selectedChoiceLabel || choice.deviationClass !== played.selectedDeviationClass) {
    context.addIssue({ code: "custom", message: "选择与幕次不一致" });
  }
});
const retrySchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("opening") }),
  z.strictObject({ kind: z.literal("next-turn"), targetChapter: z.number().int().min(2).max(11) }),
  z.strictObject({ kind: z.literal("ending") }),
]);
const errorSchema = z.strictObject({ code: z.string(), message: z.string(), retry: retrySchema });
const stateSchema = z.strictObject({
  phase: z.enum(["profiling", "selecting", "event", "result", "error"]),
  profile: profileSchema.nullable(), scenario: scenarioSchema.nullable(), currentTurn: timelineTurnSchema.nullable(),
  playedTurns: z.array(playedSchema).max(11), deviation: z.number().int().min(0).max(100), lastImpact: z.number().int().min(0).max(100),
  result: alternatePresentSchema.nullable(), error: errorSchema.nullable(), nextRequestId: z.number().int().positive(),
}).superRefine((state, context) => {
  if (state.phase === "profiling" && state.profile !== null) context.addIssue({ code: "custom", message: "档案阶段不应已有档案" });
  if (state.phase !== "profiling" && state.profile === null) context.addIssue({ code: "custom", message: "缺少穿越者档案" });
  if (["event", "result", "error"].includes(state.phase) && !state.scenario) context.addIssue({ code: "custom", message: "缺少历史场景" });
  if (state.scenario && JSON.stringify(state.scenario.profile) !== JSON.stringify(state.profile)) context.addIssue({ code: "custom", message: "场景档案不一致" });
  if (state.phase === "event" && !state.currentTurn) context.addIssue({ code: "custom", message: "事件缺少幕次" });
  if (state.phase === "result" && !state.result) context.addIssue({ code: "custom", message: "结局缺失" });
  if (state.phase === "error" && !state.error) context.addIssue({ code: "custom", message: "错误恢复信息缺失" });
});
const envelopeSchema = z.strictObject({ version: z.literal(STORAGE_VERSION), state: stateSchema });

function withoutId(request: NonNullable<GameState["request"]>): RetryIntent {
  return request.kind === "next-turn" ? { kind: "next-turn", targetChapter: request.targetChapter } : { kind: request.kind };
}

function base(state: GameState) {
  return { profile: state.profile, scenario: state.scenario, currentTurn: state.currentTurn, playedTurns: state.playedTurns, deviation: state.deviation, lastImpact: state.lastImpact, result: state.result, nextRequestId: state.nextRequestId };
}

function toStored(state: GameState): StoredState | null {
  if (state.pendingTurn) return { ...base(state), phase: "event", currentTurn: state.pendingTurn, error: null };
  if (state.pendingEnding) return { ...base(state), phase: "result", result: state.pendingEnding, error: null };
  if (state.request) return { ...base(state), phase: "error", error: { code: "interrupted", message: "上次推演因页面刷新中断，可以继续生成。", retry: withoutId(state.request) } };
  if (state.phase === "echo" && state.error) return { ...base(state), phase: "error", error: state.error };
  if (["profiling", "selecting", "event", "result", "error"].includes(state.phase)) return { ...base(state), phase: state.phase as StoredState["phase"], error: state.error };
  return null;
}

function remove(storage: StorageLike) { try { storage.removeItem(GAME_STORAGE_KEY); } catch { /* storage unavailable */ } }

export function saveGameSnapshot(state: GameState, storage: StorageLike = localStorage): boolean {
  const stored = toStored(state);
  if (!stored) return false;
  try { storage.setItem(GAME_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state: stored })); return true; } catch { return false; }
}

export function loadGameSnapshot(storage: StorageLike = localStorage): GameState | null {
  try {
    const raw = storage.getItem(GAME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = envelopeSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) { remove(storage); return null; }
    return { ...parsed.data.state, request: null, pendingTurn: null, pendingEnding: null, echo: null } as GameState;
  } catch { remove(storage); return null; }
}
