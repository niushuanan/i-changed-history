import { z } from "zod";
import type { GameState } from "../game/reducer";
import { alternatePresentSchema, timelineTurnSchema } from "../game/schema";
import { migrateLegacyTravelerProfile } from "../game/profile";

export const GAME_STORAGE_KEY = "i-changed-history:session:v6";
const LEGACY_GAME_STORAGE_KEYS = ["i-changed-history:session:v5", "i-changed-history:session:v4"] as const;
const STORAGE_VERSION = 6;
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type StoredState = Omit<GameState, "pendingTurn" | "pendingEnding" | "echo">;

const occupation = z.enum(["student", "product", "engineering", "business", "creative", "public-service"]);
const strength = z.enum(["negotiation", "organization", "technology", "business", "writing", "strategy", "law", "medicine"]);
const risk = z.enum(["cautious", "balanced", "bold"]);
const profileSchema = z.strictObject({
  name: z.string().trim().min(2).max(12),
  typeCode: z.string().regex(/^[IE][SN][TF][JP]$/),
  dimensions: z.strictObject({
    energy: z.enum(["I", "E"]), perception: z.enum(["S", "N"]),
    judgment: z.enum(["T", "F"]), tactics: z.enum(["J", "P"]),
  }),
  occupation,
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
const resolvedEchoSchema = z.strictObject({
  directResult: z.string(), unexpectedCost: z.string(), beneficiary: z.string(), payer: z.string(),
});
const playedSchema = z.strictObject({
  turn: timelineTurnSchema, selectedChoiceId: z.enum(["A", "B", "C", "custom"]), selectedChoiceLabel: z.string(), selectedDeviationClass: deviationClass, resolvedEcho: resolvedEchoSchema,
}).superRefine((played, context) => {
  if (played.selectedChoiceId === "custom") return;
  const choice = played.turn.choices.find((candidate) => candidate.id === played.selectedChoiceId);
  if (!choice || choice.label !== played.selectedChoiceLabel || choice.deviationClass !== played.selectedDeviationClass || JSON.stringify(choice.instantEcho) !== JSON.stringify(played.resolvedEcho)) {
    context.addIssue({ code: "custom", message: "选择与幕次不一致" });
  }
});
const retrySchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("opening") }),
  z.strictObject({ kind: z.literal("next-turn"), targetChapter: z.number().int().min(2).max(11) }),
  z.strictObject({ kind: z.literal("custom-action"), action: z.string().trim().min(2).max(56) }),
  z.strictObject({ kind: z.literal("ending") }),
]);
const requestSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("opening"), id: z.number().int().positive() }),
  z.strictObject({ kind: z.literal("next-turn"), targetChapter: z.number().int().min(2).max(11), id: z.number().int().positive() }),
  z.strictObject({ kind: z.literal("custom-action"), action: z.string().trim().min(2).max(56), id: z.number().int().positive() }),
  z.strictObject({ kind: z.literal("ending"), id: z.number().int().positive() }),
]);
const errorSchema = z.strictObject({ code: z.string(), message: z.string(), retry: retrySchema });
const stateSchema = z.strictObject({
  phase: z.enum(["profiling", "selecting", "generating", "adjudicating", "event", "ending", "result", "error"]),
  profile: profileSchema.nullable(), scenario: scenarioSchema.nullable(), currentTurn: timelineTurnSchema.nullable(),
  playedTurns: z.array(playedSchema).max(11), deviation: z.number().int().min(0).max(100), lastImpact: z.number().int().min(0).max(100), customActionsUsed: z.number().int().min(0).max(3),
  request: requestSchema.nullable(), result: alternatePresentSchema.nullable(), error: errorSchema.nullable(), nextRequestId: z.number().int().positive(),
}).superRefine((state, context) => {
  if (state.phase === "profiling" && state.profile !== null) context.addIssue({ code: "custom", message: "档案阶段不应已有档案" });
  if (state.phase !== "profiling" && state.profile === null) context.addIssue({ code: "custom", message: "缺少穿越者档案" });
  if (["generating", "adjudicating", "event", "ending", "result", "error"].includes(state.phase) && !state.scenario) context.addIssue({ code: "custom", message: "缺少历史场景" });
  if (state.scenario && JSON.stringify(state.scenario.profile) !== JSON.stringify(state.profile)) context.addIssue({ code: "custom", message: "场景档案不一致" });
  if (state.phase === "event" && !state.currentTurn) context.addIssue({ code: "custom", message: "事件缺少幕次" });
  if (state.phase === "adjudicating" && !state.currentTurn) context.addIssue({ code: "custom", message: "自由改命缺少当前幕次" });
  if (state.phase === "result" && !state.result) context.addIssue({ code: "custom", message: "结局缺失" });
  if (state.phase === "error" && !state.error) context.addIssue({ code: "custom", message: "错误恢复信息缺失" });
  if (["generating", "adjudicating", "ending"].includes(state.phase) && !state.request) context.addIssue({ code: "custom", message: "生成阶段缺少可恢复请求" });
});
const envelopeSchema = z.strictObject({ version: z.literal(STORAGE_VERSION), state: stateSchema });

function base(state: GameState) {
  return { profile: state.profile, scenario: state.scenario, currentTurn: state.currentTurn, playedTurns: state.playedTurns, deviation: state.deviation, lastImpact: state.lastImpact, customActionsUsed: state.customActionsUsed, result: state.result, nextRequestId: state.nextRequestId };
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
  if (["profiling", "selecting", "event", "result", "error"].includes(state.phase)) return { ...base(state), phase: state.phase as StoredState["phase"], request: null, error: state.error };
  return null;
}

function remove(storage: StorageLike, key = GAME_STORAGE_KEY) { try { storage.removeItem(key); } catch { /* storage unavailable */ } }

function migrateLegacy(raw: string): unknown {
  const envelope = JSON.parse(raw) as { version?: unknown; state?: Record<string, unknown> };
  if (![4, 5].includes(envelope.version as number) || !envelope.state) return envelope;
  const playedTurns = envelope.version === 4 && Array.isArray(envelope.state.playedTurns)
    ? envelope.state.playedTurns.map((value) => {
        if (typeof value !== "object" || value === null) return value;
        const played = value as Record<string, unknown>;
        if (played.resolvedEcho) return played;
        const turn = played.turn as { choices?: Array<{ id?: unknown; instantEcho?: unknown }> } | undefined;
        const resolvedEcho = turn?.choices?.find((choice) => choice.id === played.selectedChoiceId)?.instantEcho;
        return resolvedEcho ? { ...played, resolvedEcho } : played;
      })
    : envelope.state.playedTurns;
  const migrateProfile = (value: unknown) => {
    if (typeof value !== "object" || value === null) return value;
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.typeCode === "string" && candidate.dimensions) return candidate;
    return migrateLegacyTravelerProfile(candidate);
  };
  const profile = migrateProfile(envelope.state.profile);
  const scenario = typeof envelope.state.scenario === "object" && envelope.state.scenario !== null
    ? { ...(envelope.state.scenario as Record<string, unknown>), profile: migrateProfile((envelope.state.scenario as Record<string, unknown>).profile) }
    : envelope.state.scenario;
  return {
    version: STORAGE_VERSION,
    state: {
      ...envelope.state,
      profile,
      scenario,
      customActionsUsed: envelope.version === 4 ? 0 : envelope.state.customActionsUsed,
      playedTurns,
    },
  };
}

export function saveGameSnapshot(state: GameState, storage: StorageLike = localStorage): boolean {
  const stored = toStored(state);
  if (!stored) return false;
  try { storage.setItem(GAME_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state: stored })); return true; } catch { return false; }
}

export function loadGameSnapshot(storage: StorageLike = localStorage): GameState | null {
  try {
    let raw = storage.getItem(GAME_STORAGE_KEY);
    let legacyKey: string | null = null;
    if (!raw) {
      for (const key of LEGACY_GAME_STORAGE_KEYS) {
        raw = storage.getItem(key);
        if (raw) { legacyKey = key; break; }
      }
    }
    if (!raw) return null;
    const candidate = legacyKey ? migrateLegacy(raw) : JSON.parse(raw);
    const parsed = envelopeSchema.safeParse(candidate);
    if (!parsed.success) { remove(storage, legacyKey ?? GAME_STORAGE_KEY); return null; }
    if (legacyKey) {
      storage.setItem(GAME_STORAGE_KEY, JSON.stringify(parsed.data));
      remove(storage, legacyKey);
    }
    return { ...parsed.data.state, pendingTurn: null, pendingEnding: null, echo: null } as GameState;
  } catch { remove(storage); return null; }
}
