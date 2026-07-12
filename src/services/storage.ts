import { z } from "zod";
import { alternatePresentSchema, timelineTurnSchema } from "../game/schema";
import type { GameErrorState, GameState, RetryIntent } from "../game/reducer";

export const GAME_STORAGE_KEY = "i-changed-history:session:v1";
const STORAGE_VERSION = 1;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

type StoredState = Omit<GameState, "request" | "pendingTurn" | "pendingEnding" | "echo">;

function retryWithoutId(request: NonNullable<GameState["request"]>): RetryIntent {
  if (request.kind === "next-turn") {
    return {
      kind: "next-turn",
      targetChapter: request.targetChapter,
      ...(request.intervention ? { intervention: request.intervention } : {}),
    };
  }
  return { kind: request.kind };
}

function storedBase(state: GameState): Omit<StoredState, "phase" | "error"> {
  return {
    scenario: state.scenario,
    currentTurn: state.currentTurn,
    playedTurns: state.playedTurns,
    deviation: state.deviation,
    lastImpact: state.lastImpact,
    result: state.result,
    nextRequestId: state.nextRequestId,
  };
}

function interruptedError(retry: RetryIntent): GameErrorState {
  return {
    code: "interrupted",
    message: "上次推演因页面刷新中断，可以从当前时间线继续。",
    retry,
  };
}

function toStoredState(state: GameState): StoredState | null {
  if (state.pendingTurn) {
    return {
      ...storedBase(state),
      phase: "event",
      currentTurn: state.pendingTurn,
      error: null,
    };
  }

  if (state.pendingEnding) {
    return {
      ...storedBase(state),
      phase: "result",
      result: state.pendingEnding,
      error: null,
    };
  }

  if (state.request) {
    return {
      ...storedBase(state),
      phase: "error",
      error: interruptedError(retryWithoutId(state.request)),
    };
  }

  if (state.phase === "echo" && state.error) {
    return { ...storedBase(state), phase: "error", error: state.error };
  }

  if (["selecting", "event", "result", "error"].includes(state.phase)) {
    return {
      ...storedBase(state),
      phase: state.phase,
      error: state.error,
    };
  }

  return null;
}

const deviationClassSchema = z.enum(["nudge", "reform", "rupture"]);
const interventionSchema = z.strictObject({
  text: z.string().trim().min(1).max(140),
  deviationClass: deviationClassSchema,
});
const retryIntentSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("opening") }),
  z.strictObject({
    kind: z.literal("next-turn"),
    targetChapter: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    intervention: interventionSchema.optional(),
  }),
  z.strictObject({ kind: z.literal("ending") }),
]);
const errorSchema = z.strictObject({
  code: z.string().trim().min(1),
  message: z.string().trim().min(1),
  retry: retryIntentSchema,
});
const historySeedSchema = z.strictObject({
  id: z.string().trim().min(1),
  era: z.enum(["ancient", "medieval", "early-modern", "industrial", "modern"]),
  year: z.number().int(),
  location: z.string().trim().min(1),
  chinaRelated: z.boolean(),
  baselineFacts: z.tuple([
    z.string().trim().min(1),
    z.string().trim().min(1),
    z.string().trim().min(1),
  ]),
  prompt: z.string().trim().min(1),
  domain: z.string().trim().min(1),
  visualTone: z.enum([
    "ancient",
    "exchange",
    "print",
    "revolution",
    "industry",
    "war",
    "space",
    "digital",
  ]),
});
const scenarioSchema = z.union([historySeedSchema, z.string().trim().min(4).max(140)]).nullable();
const playedTurnSchema = z
  .strictObject({
    turn: timelineTurnSchema,
    selectedChoiceId: z.enum(["A", "B", "C", "custom"]),
    selectedChoiceLabel: z.string().trim().min(1).max(140),
    selectedDeviationClass: deviationClassSchema.optional(),
    selectionSource: z.enum(["ai_choice", "custom_intervention"]).optional(),
    customIntervention: z.string().trim().min(1).max(140).optional(),
  })
  .superRefine((played, context) => {
    const custom = played.selectionSource === "custom_intervention" || played.selectedChoiceId === "custom";
    if (custom) {
      if (
        played.selectedChoiceId !== "custom" ||
        played.selectionSource !== "custom_intervention" ||
        played.customIntervention !== played.selectedChoiceLabel ||
        played.selectedDeviationClass === undefined
      ) {
        context.addIssue({ code: "custom", message: "自由干预存档不完整" });
      }
      return;
    }

    const choice = played.turn.choices.find((candidate) => candidate.id === played.selectedChoiceId);
    if (
      choice === undefined ||
      played.selectedChoiceLabel !== choice.label ||
      played.selectedDeviationClass !== choice.deviationClass
    ) {
      context.addIssue({ code: "custom", message: "AI 选择与幕次内容不一致" });
    }
  });

const storedStateSchema = z
  .strictObject({
    phase: z.enum(["selecting", "event", "result", "error"]),
    scenario: scenarioSchema,
    currentTurn: timelineTurnSchema.nullable(),
    playedTurns: z.array(playedTurnSchema).max(5),
    deviation: z.number().int().min(0).max(100),
    lastImpact: z.number().int().min(0).max(100),
    result: alternatePresentSchema.nullable(),
    error: errorSchema.nullable(),
    nextRequestId: z.number().int().positive(),
  })
  .superRefine((state, context) => {
    state.playedTurns.forEach((played, index) => {
      if (played.turn.chapter !== index + 1) {
        context.addIssue({
          code: "custom",
          path: ["playedTurns", index, "turn", "chapter"],
          message: "已完成幕次顺序无效",
        });
      }
    });

    if (state.phase === "selecting") {
      if (state.scenario !== null || state.currentTurn !== null || state.playedTurns.length > 0) {
        context.addIssue({ code: "custom", message: "选卡阶段不应包含局内进度" });
      }
      return;
    }

    if (state.scenario === null) {
      context.addIssue({ code: "custom", path: ["scenario"], message: "局内存档缺少历史背景" });
    }

    if (state.phase === "event") {
      if (
        state.currentTurn === null ||
        state.currentTurn.chapter !== state.playedTurns.length + 1 ||
        state.error !== null ||
        state.result !== null
      ) {
        context.addIssue({ code: "custom", message: "事件阶段存档不一致" });
      }
    }

    if (state.phase === "result") {
      if (state.result === null || state.playedTurns.length !== 5 || state.error !== null) {
        context.addIssue({ code: "custom", message: "结局阶段存档不完整" });
      }
    }

    if (state.phase === "error") {
      if (state.error === null || state.result !== null) {
        context.addIssue({ code: "custom", message: "错误恢复信息不完整" });
      } else if (state.error.retry.kind === "opening") {
        if (state.currentTurn !== null || state.playedTurns.length !== 0) {
          context.addIssue({ code: "custom", message: "开局重试存档包含额外进度" });
        }
      } else if (state.error.retry.kind === "next-turn") {
        if (
          state.currentTurn?.chapter !== state.error.retry.targetChapter - 1 ||
          state.playedTurns.length !== state.error.retry.targetChapter - 1
        ) {
          context.addIssue({ code: "custom", message: "续幕重试存档与目标幕次不一致" });
        }
      } else if (state.currentTurn?.chapter !== 5 || state.playedTurns.length !== 5) {
        context.addIssue({ code: "custom", message: "结局重试存档缺少第五幕选择" });
      }
    }
  });

function safelyRemove(storage: StorageLike): void {
  try {
    storage.removeItem(GAME_STORAGE_KEY);
  } catch {
    // Storage can be disabled by browser privacy settings.
  }
}

export function saveGameSnapshot(
  state: GameState,
  storage: StorageLike = localStorage,
): boolean {
  const stable = toStoredState(state);
  if (!stable) return false;

  try {
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, state: stable }));
    return true;
  } catch {
    return false;
  }
}

export function loadGameSnapshot(storage: StorageLike = localStorage): GameState | null {
  let raw: string | null;
  try {
    raw = storage.getItem(GAME_STORAGE_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || !("version" in parsed) || !("state" in parsed)) {
      throw new Error("invalid snapshot");
    }
    if (parsed.version !== STORAGE_VERSION) throw new Error("unsupported snapshot");
    const stable = storedStateSchema.parse(parsed.state) as StoredState;

    return {
      ...stable,
      request: null,
      pendingTurn: null,
      pendingEnding: null,
      echo: null,
    };
  } catch {
    safelyRemove(storage);
    return null;
  }
}
