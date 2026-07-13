import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getFixedOpening } from "../data/fixedOpenings";
import { HISTORY_SEEDS } from "../data/historySeeds";
import {
  adjudicateCustomAction,
  generateEnding,
  generateNextTurn,
  type GenerationDiagnostic,
} from "../game/engine";
import { buildNarrativeContext } from "../game/narrativeContext";
import type { PlayedTurn } from "../game/prompts";
import type { GameScenario } from "../game/reducer";
import type { AlternatePresent, TimelineTurn } from "../game/schema";
import type { DecisionChapter } from "../game/timelinePlan";
import { buildSoakCustomOutcome, LONG_RUN_SOAK_CASES, type LongRunSoakCase } from "./soakCases";

type SanitizedError = Readonly<{
  name: string;
  code?: string;
  message: string;
}>;

type StepFailure = Readonly<{
  step: string;
  attempt: number;
  error: SanitizedError;
}>;

type NodeResult = Readonly<{
  chapter: number;
  yearLabel: string;
  headline: string;
  role: string;
  choice: string;
  custom: boolean;
  generationSource: TimelineTurn["generationSource"];
  activeCanonChapters: readonly number[];
  actionMs: number;
  nextTurnMs?: number;
}>;

type RunResult = {
  id: string;
  seedId: string;
  eventName: string;
  success: boolean;
  durationMs: number;
  completedChapters: number;
  customChapters: readonly number[];
  customOutcomes: string[];
  manualRetries: number;
  customFallbacks: number;
  diagnostics: GenerationDiagnostic[];
  failures: StepFailure[];
  nodes: NodeResult[];
  ending?: Pick<AlternatePresent, "worldName" | "frontPageHeadline" | "protagonistName">;
  terminalError?: SanitizedError;
};

const OUTPUT_ROOT = path.resolve("tmp", "soak");
const SOAK_LIMIT = Math.max(1, Math.min(10, Number(process.env.SOAK_LIMIT ?? 10)));
const SOAK_CONCURRENCY = Math.max(1, Math.min(3, Number(process.env.SOAK_CONCURRENCY ?? 2)));
const BATCH_ID = process.env.SOAK_BATCH?.trim() || new Date().toISOString().replace(/[:.]/g, "-");
const selectedCases = LONG_RUN_SOAK_CASES.slice(0, SOAK_LIMIT);
const usedCustomOutcomes = new Set<string>();

function sanitizedError(error: unknown): SanitizedError {
  if (error instanceof Error) {
    const code = "code" in error && typeof error.code === "string" ? error.code : undefined;
    return { name: error.name, ...(code ? { code } : {}), message: error.message };
  }
  return { name: "UnknownError", message: String(error) };
}

async function retryOnce<T>(
  step: string,
  operation: () => Promise<T>,
  run: RunResult,
): Promise<{ value: T; durationMs: number }> {
  const startedAt = Date.now();
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return { value: await operation(), durationMs: Date.now() - startedAt };
    } catch (error) {
      run.failures.push({ step, attempt, error: sanitizedError(error) });
      if (attempt === 2) throw error;
      run.manualRetries += 1;
    }
  }
  throw new Error(`unreachable retry state for ${step}`);
}

function ordinaryPlayedTurn(turn: TimelineTurn, runIndex: number): PlayedTurn {
  const choice = turn.choices[(runIndex + turn.chapter - 1) % turn.choices.length];
  return {
    turn,
    selectedChoiceId: choice.id,
    selectedChoiceLabel: choice.label,
    selectedDeviationClass: choice.deviationClass,
    resolvedEcho: choice.instantEcho,
  };
}

async function customPlayedTurn(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  turn: TimelineTurn,
  outcome: string,
  run: RunResult,
): Promise<{ played: PlayedTurn; durationMs: number }> {
  const adjudication = await retryOnce(
    `custom-${turn.chapter}`,
    () => adjudicateCustomAction(scenario, playedTurns, turn, outcome, {
      onDiagnostic: (diagnostic) => run.diagnostics.push(diagnostic),
    }),
    run,
  );
  const resolution = adjudication.value;
  expect(resolution.declaredOutcome).toBe(outcome);
  expect(resolution.instantEcho.directResult).toBe(outcome);
  return {
    durationMs: adjudication.durationMs,
    played: {
      turn,
      selectedChoiceId: "custom",
      selectedChoiceLabel: outcome,
      selectedDeviationClass: resolution.deviationClass,
      resolvedEcho: resolution.instantEcho,
      playerAuthored: true,
      canonStatus: resolution.canonStatus,
      causalMechanism: resolution.causalMechanism,
    },
  };
}

function verifyNextTurn(
  nextTurn: TimelineTurn,
  playedTurns: readonly PlayedTurn[],
  expectedChapter: Exclude<DecisionChapter, 1>,
): number[] {
  expect(nextTurn.chapter).toBe(expectedChapter);
  expect(nextTurn.generationSource).toBe("deepseek");
  expect(nextTurn.protagonistName).toBe(playedTurns[0].turn.protagonistName);
  expect(nextTurn.protagonistAge).toBeGreaterThanOrEqual(playedTurns.at(-1)!.turn.protagonistAge);

  const activeCanon = buildNarrativeContext(playedTurns, expectedChapter).activePlayerCanon;
  activeCanon.forEach((canon) => {
    expect(nextTurn.causalLedger).toContainEqual(expect.objectContaining({
      causedByChapter: canon.chapter,
      fact: canon.sourceText,
    }));
  });
  return activeCanon.map((canon) => canon.chapter);
}

async function runGame(
  soakCase: LongRunSoakCase,
  runIndex: number,
): Promise<RunResult> {
  const seed = HISTORY_SEEDS.find((candidate) => candidate.id === soakCase.seedId);
  if (!seed) throw new Error(`Unknown soak seed: ${soakCase.seedId}`);
  const scenario: GameScenario = { seed };
  const startedAt = Date.now();
  const run: RunResult = {
    id: soakCase.id,
    seedId: seed.id,
    eventName: seed.eventName,
    success: false,
    durationMs: 0,
    completedChapters: 0,
    customChapters: soakCase.customChapters,
    customOutcomes: [],
    manualRetries: 0,
    customFallbacks: 0,
    diagnostics: [],
    failures: [],
    nodes: [],
  };

  try {
    let currentTurn = getFixedOpening(seed);
    const playedTurns: PlayedTurn[] = [];

    for (let chapter = 1; chapter <= 12; chapter += 1) {
      expect(currentTurn.chapter).toBe(chapter);
      const isCustom = soakCase.customChapters.includes(chapter);
      const actionStartedAt = Date.now();
      let played: PlayedTurn;

      if (isCustom) {
        const customIndex = soakCase.customChapters.indexOf(chapter);
        const outcome = buildSoakCustomOutcome(soakCase, runIndex, customIndex, currentTurn, seed);
        expect([...outcome].length).toBeLessThanOrEqual(80);
        expect(usedCustomOutcomes.has(outcome)).toBe(false);
        usedCustomOutcomes.add(outcome);
        run.customOutcomes.push(outcome);
        const custom = await customPlayedTurn(scenario, playedTurns, currentTurn, outcome, run);
        played = custom.played;
      } else {
        played = ordinaryPlayedTurn(currentTurn, runIndex);
      }

      playedTurns.push(played);
      const node: NodeResult = {
        chapter,
        yearLabel: currentTurn.yearLabel,
        headline: currentTurn.headline,
        role: currentTurn.role,
        choice: played.selectedChoiceLabel,
        custom: isCustom,
        generationSource: currentTurn.generationSource,
        activeCanonChapters: [],
        actionMs: Date.now() - actionStartedAt,
      };
      run.completedChapters = chapter;

      if (chapter < 12) {
        const nextChapter = (chapter + 1) as Exclude<DecisionChapter, 1>;
        const generated = await retryOnce(
          `turn-${nextChapter}`,
          () => generateNextTurn(scenario, playedTurns, nextChapter, {
            onDiagnostic: (diagnostic) => run.diagnostics.push(diagnostic),
          }),
          run,
        );
        const activeCanonChapters = verifyNextTurn(generated.value, playedTurns, nextChapter);
        run.nodes.push({ ...node, activeCanonChapters, nextTurnMs: generated.durationMs });
        currentTurn = generated.value;
      } else {
        run.nodes.push(node);
      }
    }

    expect(playedTurns).toHaveLength(12);
    expect(run.customOutcomes).toHaveLength(soakCase.customChapters.length);
    expect(new Set(run.customOutcomes).size).toBe(run.customOutcomes.length);
    const ending = await retryOnce(
      "ending",
      () => generateEnding(scenario, playedTurns, {
        onDiagnostic: (diagnostic) => run.diagnostics.push(diagnostic),
      }),
      run,
    );
    expect(ending.value.historyTimeline).toHaveLength(12);
    expect(ending.value.historyTimeline.map((item) => item.playerChoice))
      .toEqual(playedTurns.map((played) => played.selectedChoiceLabel));
    run.ending = {
      worldName: ending.value.worldName,
      frontPageHeadline: ending.value.frontPageHeadline,
      protagonistName: ending.value.protagonistName,
    };
    run.customFallbacks = run.diagnostics.filter((diagnostic) => diagnostic.stage === "custom_fallback").length;
    run.success = true;
  } catch (error) {
    run.terminalError = sanitizedError(error);
    run.customFallbacks = run.diagnostics.filter((diagnostic) => diagnostic.stage === "custom_fallback").length;
  } finally {
    run.durationMs = Date.now() - startedAt;
  }

  return run;
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

describe("real DeepSeek twelve-node long-run stability", () => {
  it("completes at least ninety percent of rewrite-heavy games", async () => {
    const outputDirectory = path.join(OUTPUT_ROOT, BATCH_ID);
    await mkdir(outputDirectory, { recursive: true });
    const results = new Array<RunResult>(selectedCases.length);
    let cursor = 0;

    const worker = async () => {
      while (true) {
        const index = cursor;
        cursor += 1;
        const soakCase = selectedCases[index];
        if (!soakCase) return;
        const result = await runGame(soakCase, index);
        results[index] = result;
        await writeJson(path.join(outputDirectory, `${String(index + 1).padStart(2, "0")}-${soakCase.id}.json`), result);
        console.log(`[soak ${index + 1}/${selectedCases.length}] ${soakCase.id}: ${result.success ? "PASS" : "FAIL"} chapters=${result.completedChapters} retries=${result.manualRetries} repairs=${result.diagnostics.length}`);
      }
    };

    await Promise.all(Array.from({ length: Math.min(SOAK_CONCURRENCY, selectedCases.length) }, () => worker()));
    const successes = results.filter((result) => result.success).length;
    const totalCustomOutcomes = results.reduce((sum, result) => sum + result.customOutcomes.length, 0);
    const summary = {
      batchId: BATCH_ID,
      model: import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-v4-flash",
      runs: results.length,
      successes,
      successRate: successes / results.length,
      requiredSuccesses: Math.ceil(results.length * 0.9),
      totalCustomOutcomes,
      uniqueCustomOutcomes: usedCustomOutcomes.size,
      totalManualRetries: results.reduce((sum, result) => sum + result.manualRetries, 0),
      totalCustomFallbacks: results.reduce((sum, result) => sum + result.customFallbacks, 0),
      diagnosticStages: results.flatMap((result) => result.diagnostics.map((diagnostic) => diagnostic.stage)),
      results: results.map((result) => ({
        id: result.id,
        success: result.success,
        completedChapters: result.completedChapters,
        customCount: result.customOutcomes.length,
        manualRetries: result.manualRetries,
        customFallbacks: result.customFallbacks,
        durationMs: result.durationMs,
        terminalError: result.terminalError,
      })),
    };
    await writeJson(path.join(outputDirectory, "summary.json"), summary);

    expect(totalCustomOutcomes).toBe(selectedCases.reduce((sum, item) => sum + item.customChapters.length, 0));
    expect(usedCustomOutcomes.size).toBe(totalCustomOutcomes);
    expect(successes).toBeGreaterThanOrEqual(summary.requiredSuccesses);
  }, 7_200_000);
});

