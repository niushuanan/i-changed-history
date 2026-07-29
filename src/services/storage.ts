import { z } from "zod";
import { HISTORY_SEEDS } from "../data/historySeeds";
import type { GameState } from "../game/reducer";
import { createInitialGameState } from "../game/reducer";
import {
  alternatePresentSchema,
  storedAlternatePresentSchema,
  storedChoiceSetSchema,
  storedTimelineTurnSchema,
} from "../game/schema";
import { isPowerId, type PowerId } from "../game/powers";

export const GAME_STORAGE_KEY = "i-changed-history:session:v16";
export const UNLOCKED_HISTORY_STORAGE_KEY = "i-changed-history:unlocked:v1";
const LEGACY_GAME_STORAGE_KEYS = [
  "i-changed-history:session:v15", "i-changed-history:session:v14", "i-changed-history:session:v13", "i-changed-history:session:v12", "i-changed-history:session:v11", "i-changed-history:session:v10", "i-changed-history:session:v9", "i-changed-history:session:v8",
  "i-changed-history:session:v7", "i-changed-history:session:v6", "i-changed-history:session:v5",
  "i-changed-history:session:v4",
] as const;
const STORAGE_VERSION = 16;
const ACTIVE_HISTORY_SEED_IDS = new Set(HISTORY_SEEDS.map((seed) => seed.id));
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type StoredState = Omit<GameState, "pendingEnding" | "echo">;
const unlockedSeedIdsSchema = z.array(z.string()).max(100);

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
const powerIdSchema = z.custom<PowerId>(isPowerId, "未知超能力");
const resolvedEchoSchema = z.strictObject({
  directResult: z.string(), unexpectedCost: z.string(), beneficiary: z.string(), payer: z.string(),
});
const playedSchema = z.strictObject({
  turn: storedTimelineTurnSchema,
  selectedChoiceId: z.enum(["A", "B", "C", "custom"]),
  selectedChoiceLabel: z.string(),
  selectedDeviationClass: deviationClass,
  selectedPowerId: powerIdSchema.optional(),
  resolvedEcho: resolvedEchoSchema,
  playerAuthored: z.boolean().optional(),
  canonStatus: z.literal("玩家钦定").optional(),
  causalMechanism: z.string().optional(),
});
const retrySchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("next-turn"),
    targetChapter: z.number().int().min(2).max(4),
    powerIds: z.tuple([powerIdSchema, powerIdSchema]),
  }),
  z.strictObject({ kind: z.literal("ending") }),
]);
const requestSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("next-turn"),
    targetChapter: z.number().int().min(2).max(4),
    powerIds: z.tuple([powerIdSchema, powerIdSchema]),
    id: z.number().int().positive(),
  }),
  z.strictObject({ kind: z.literal("ending"), id: z.number().int().positive() }),
  z.strictObject({
    kind: z.literal("roll-choices"),
    rollNumber: z.union([z.literal(2), z.literal(3)]),
    powerId: powerIdSchema,
    id: z.number().int().positive(),
  }),
]);
const errorSchema = z.strictObject({ code: z.string(), message: z.string(), retry: retrySchema });
const stateSchema = z.strictObject({
  phase: z.enum(["selecting", "generating", "event", "ending", "result", "error"]),
  scenario: scenarioSchema.nullable(),
  currentTurn: storedTimelineTurnSchema.nullable(),
  playedTurns: z.array(playedSchema).max(4),
  deviation: z.number().int().min(0).max(100),
  lastImpact: z.number().int().min(0).max(100),
  customActionsUsed: z.number().int().min(0),
  rollCount: z.number().int().min(0).max(3).default(0),
  dynamicChoices: storedChoiceSetSchema.nullable().default(null),
  rollLoading: z.boolean().default(false),
  rollError: z.string().nullable().default(null),
  remainingPowerIds: z.array(powerIdSchema).max(50),
  usedPowerIds: z.array(powerIdSchema).max(50),
  pendingRollPowerId: powerIdSchema.nullable(),
  unlockedSeedIds: z.array(z.string()).max(100).default([]),
  request: requestSchema.nullable(),
  pendingTurn: storedTimelineTurnSchema.nullable().default(null),
  result: storedAlternatePresentSchema.nullable(),
  error: errorSchema.nullable(),
  nextRequestId: z.number().int().positive(),
}).superRefine((state, context) => {
  if (["generating", "event", "ending", "result", "error"].includes(state.phase) && !state.scenario) context.addIssue({ code: "custom", message: "缺少历史场景" });
  if (state.phase === "event" && !state.currentTurn) context.addIssue({ code: "custom", message: "事件缺少幕次" });
  if (state.rollLoading && state.request?.kind !== "roll-choices") context.addIssue({ code: "custom", message: "现场发牌缺少可恢复请求" });
  if (state.phase === "result" && !state.result) context.addIssue({ code: "custom", message: "结局缺失" });
  if (state.phase === "error" && !state.error) context.addIssue({ code: "custom", message: "错误恢复信息缺失" });
  if (state.phase === "generating" && !state.request && !state.pendingTurn) context.addIssue({ code: "custom", message: "生成阶段缺少请求或待揭晓场景" });
  if (state.phase === "ending" && !state.request) context.addIssue({ code: "custom", message: "结局生成阶段缺少可恢复请求" });
  if (state.pendingTurn && state.phase !== "generating") context.addIssue({ code: "custom", message: "待揭晓场景只能停留在生成页" });
  if (new Set([...state.remainingPowerIds, ...state.usedPowerIds]).size !== state.remainingPowerIds.length + state.usedPowerIds.length) {
    context.addIssue({ code: "custom", message: "超能力抽取记录发生重复" });
  }
});
const envelopeSchema = z.strictObject({ version: z.literal(STORAGE_VERSION), state: stateSchema });

function base(state: GameState) {
  return {
    scenario: state.scenario, currentTurn: state.currentTurn,
    playedTurns: state.playedTurns, deviation: state.deviation, lastImpact: state.lastImpact,
    customActionsUsed: state.customActionsUsed,
    rollCount: state.rollCount,
    dynamicChoices: state.dynamicChoices,
    rollLoading: state.rollLoading,
    rollError: state.rollError,
    remainingPowerIds: state.remainingPowerIds,
    usedPowerIds: state.usedPowerIds,
    pendingRollPowerId: state.pendingRollPowerId,
    unlockedSeedIds: state.unlockedSeedIds,
    pendingTurn: state.pendingTurn,
    result: state.result, nextRequestId: state.nextRequestId,
  };
}

function toStored(state: GameState): StoredState | null {
  if (state.pendingTurn) return { ...base(state), phase: "generating", request: null, error: null };
  if (state.pendingEnding) return { ...base(state), phase: "result", result: state.pendingEnding, request: null, error: null };
  if (state.request?.kind === "roll-choices") {
    return {
      ...base(state),
      phase: "event",
      request: state.request,
      error: null,
    };
  }
  if (state.request) return {
    ...base(state),
    phase: state.request.kind === "ending" ? "ending" : "generating",
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

function sanitizeUnlockedSeedIds(ids: readonly unknown[]): string[] {
  return [...new Set(ids.filter(
    (id): id is string => typeof id === "string" && ACTIVE_HISTORY_SEED_IDS.has(id),
  ))].slice(0, 100);
}

function readUnlockedSeedIds(storage: StorageLike): string[] {
  try {
    const raw = storage.getItem(UNLOCKED_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = unlockedSeedIdsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? sanitizeUnlockedSeedIds(parsed.data) : [];
  } catch {
    return [];
  }
}

function persistUnlockedSeedIds(storage: StorageLike, ids: readonly string[]) {
  try {
    storage.setItem(UNLOCKED_HISTORY_STORAGE_KEY, JSON.stringify(sanitizeUnlockedSeedIds(ids)));
  } catch { /* storage unavailable */ }
}

function withUnlockedArchive(state: GameState, archiveIds: readonly string[]): GameState {
  return {
    ...state,
    unlockedSeedIds: sanitizeUnlockedSeedIds([...archiveIds, ...state.unlockedSeedIds]),
  };
}

export function saveGameSnapshot(state: GameState, storage: StorageLike = localStorage): boolean {
  persistUnlockedSeedIds(storage, state.unlockedSeedIds);
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
  const archiveIds = readUnlockedSeedIds(storage);
  try {
    const current = storage.getItem(GAME_STORAGE_KEY);
    if (current) {
      const parsed = envelopeSchema.safeParse(JSON.parse(current));
      if (!parsed.success) {
        remove(storage);
        return archiveIds.length > 0
          ? withUnlockedArchive(createInitialGameState(), archiveIds)
          : null;
      }
      const savedSeedId = parsed.data.state.scenario?.seed.id;
      if (savedSeedId && !ACTIVE_HISTORY_SEED_IDS.has(savedSeedId)) {
        remove(storage);
        return withUnlockedArchive(
          createInitialGameState(parsed.data.state.nextRequestId),
          archiveIds,
        );
      }
      const loaded = withUnlockedArchive({
        ...parsed.data.state,
        unlockedSeedIds: sanitizeUnlockedSeedIds(parsed.data.state.unlockedSeedIds),
        pendingEnding: null,
        echo: null,
      } as GameState, archiveIds);
      persistUnlockedSeedIds(storage, loaded.unlockedSeedIds);
      if (loaded.phase === "result" && loaded.result) {
        const completeResult = alternatePresentSchema.safeParse(loaded.result);
        if (completeResult.success) return { ...loaded, result: completeResult.data };
        if (loaded.playedTurns.length !== 4) { remove(storage); return null; }
        const requestId = loaded.nextRequestId;
        return {
          ...loaded,
          phase: "ending",
          request: { kind: "ending", id: requestId },
          result: null,
          nextRequestId: requestId + 1,
        };
      }
      return loaded;
    }

    for (const key of LEGACY_GAME_STORAGE_KEYS) {
      const legacy = storage.getItem(key);
      if (!legacy) continue;
      const raw = JSON.parse(legacy) as {
        state?: { nextRequestId?: unknown; unlockedSeedIds?: unknown };
      };
      const nextRequestId = typeof raw.state?.nextRequestId === "number" ? raw.state.nextRequestId : 1;
      const legacyUnlocked = Array.isArray(raw.state?.unlockedSeedIds)
        ? raw.state.unlockedSeedIds
        : [];
      const fresh = withUnlockedArchive(
        createInitialGameState(nextRequestId),
        sanitizeUnlockedSeedIds([...archiveIds, ...legacyUnlocked]),
      );
      storage.setItem(GAME_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state: toStored(fresh) }));
      persistUnlockedSeedIds(storage, fresh.unlockedSeedIds);
      remove(storage, key);
      return fresh;
    }
    return archiveIds.length > 0
      ? withUnlockedArchive(createInitialGameState(), archiveIds)
      : null;
  } catch {
    remove(storage);
    return archiveIds.length > 0
      ? withUnlockedArchive(createInitialGameState(), archiveIds)
      : null;
  }
}
