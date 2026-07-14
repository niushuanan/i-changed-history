import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getFixedOpening } from "../data/fixedOpenings";
import { HISTORY_SEEDS } from "../data/historySeeds";
import {
  generateEnding,
  generateNextTurn,
  type GenerationDiagnostic,
} from "../game/engine";
import { buildCanonicalCustomResolution } from "../game/customCanon";
import { buildNarrativeContext } from "../game/narrativeContext";
import type { PlayedTurn } from "../game/prompts";
import type { GameScenario } from "../game/reducer";
import type { AlternatePresent, TimelineTurn } from "../game/schema";
import type { DecisionChapter } from "../game/timelinePlan";
import type { DeepSeekPartialDraft, DeepSeekRequestMetrics } from "../services/deepseek";
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
  location: string;
  role: string;
  choice: string;
  custom: boolean;
  generationSource: TimelineTurn["generationSource"];
  activeCanonChapters: readonly number[];
  actionMs: number;
  nextTurnMs?: number;
  firstReadableMs?: number;
  narrative: string;
  worldStateChange: string;
  causalBridge: string;
  divergenceProof: string;
  choices: readonly string[];
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
  endingMs?: number;
  diagnostics: GenerationDiagnostic[];
  requestMetrics: DeepSeekRequestMetrics[];
  failures: StepFailure[];
  nodes: NodeResult[];
  ending?: AlternatePresent;
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
      await new Promise((resolve) => setTimeout(resolve, 2_000 + Math.random() * 1_000));
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

function customPlayedTurn(
  turn: TimelineTurn,
  outcome: string,
): { played: PlayedTurn; durationMs: number } {
  const startedAt = Date.now();
  const resolution = buildCanonicalCustomResolution(turn, outcome, "rupture");
  expect(resolution.declaredOutcome).toBe(outcome);
  expect(resolution.instantEcho.directResult).toBe(outcome);
  return {
    durationMs: Date.now() - startedAt,
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
    diagnostics: [],
    requestMetrics: [],
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
        const custom = customPlayedTurn(currentTurn, outcome);
        played = custom.played;
      } else {
        played = ordinaryPlayedTurn(currentTurn, runIndex);
      }

      playedTurns.push(played);
      const node: NodeResult = {
        chapter,
        yearLabel: currentTurn.yearLabel,
        headline: currentTurn.headline,
        location: currentTurn.location,
        role: currentTurn.role,
        choice: played.selectedChoiceLabel,
        custom: isCustom,
        generationSource: currentTurn.generationSource,
        activeCanonChapters: [],
        actionMs: Date.now() - actionStartedAt,
        narrative: currentTurn.narrative,
        worldStateChange: currentTurn.worldStateChange,
        causalBridge: currentTurn.causalBridge,
        divergenceProof: currentTurn.divergenceProof,
        choices: currentTurn.choices.map((choice) => choice.label),
      };
      run.completedChapters = chapter;

      if (chapter < 12) {
        const nextChapter = (chapter + 1) as Exclude<DecisionChapter, 1>;
        const requestStartedAt = Date.now();
        let firstReadableMs: number | undefined;
        const generated = await retryOnce(
          `turn-${nextChapter}`,
          () => generateNextTurn(scenario, playedTurns, nextChapter, {
            onDiagnostic: (diagnostic) => run.diagnostics.push(diagnostic),
            onMetrics: (metrics) => run.requestMetrics.push(metrics),
            onPartial: (draft: DeepSeekPartialDraft) => {
              if (firstReadableMs === undefined && draft.headline && draft.narrative) {
                firstReadableMs = Date.now() - requestStartedAt;
              }
            },
          }),
          run,
        );
        const activeCanonChapters = verifyNextTurn(generated.value, playedTurns, nextChapter);
        run.nodes.push({ ...node, activeCanonChapters, nextTurnMs: generated.durationMs, firstReadableMs: firstReadableMs ?? generated.durationMs });
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
        onMetrics: (metrics) => run.requestMetrics.push(metrics),
      }),
      run,
    );
    run.endingMs = ending.durationMs;
    expect(ending.value.historyTimeline).toHaveLength(12);
    expect(ending.value.historyTimeline.map((item) => item.playerChoice))
      .toEqual(playedTurns.map((played) => played.selectedChoiceLabel));
    run.ending = ending.value;
    run.success = true;
  } catch (error) {
    run.terminalError = sanitizedError(error);
  } finally {
    run.durationMs = Date.now() - startedAt;
  }

  return run;
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function percentile(values: readonly number[], fraction: number): number | null {
  if (values.length === 0) return null;
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.min(ordered.length - 1, Math.ceil(ordered.length * fraction) - 1)] ?? null;
}

function latencySummary(values: readonly number[]) {
  return {
    count: values.length,
    minMs: values.length ? Math.min(...values) : null,
    p50Ms: percentile(values, 0.5),
    p90Ms: percentile(values, 0.9),
    maxMs: values.length ? Math.max(...values) : null,
    averageMs: values.length
      ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
      : null,
  };
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
    const plannedCustomOutcomes = selectedCases.reduce((sum, item) => sum + item.customChapters.length, 0);
    const successfulRunCustomOutcomes = results
      .filter((result) => result.success)
      .reduce((sum, result) => sum + result.customOutcomes.length, 0);
    const successfulResults = results.filter((result) => result.success);
    const turnDurations = successfulResults.flatMap((result) => result.nodes.flatMap((node) => node.nextTurnMs ?? []));
    const firstReadableDurations = successfulResults.flatMap((result) => result.nodes.flatMap((node) => node.firstReadableMs ?? []));
    const endingDurations = successfulResults.flatMap((result) => result.endingMs ?? []);
    const actionDurations = successfulResults.flatMap((result) => result.nodes.filter((node) => node.custom).map((node) => node.actionMs));
    const requestMetrics = results.flatMap((result) => result.requestMetrics);
    const successfulMetrics = requestMetrics.filter((metric) => metric.outcome === "success");
    const cacheHitTokens = successfulMetrics.reduce((sum, metric) => sum + (metric.usage?.promptCacheHitTokens ?? 0), 0);
    const cacheMissTokens = successfulMetrics.reduce((sum, metric) => sum + (metric.usage?.promptCacheMissTokens ?? 0), 0);
    const primaryInvalids = results.reduce(
      (sum, result) => sum + result.diagnostics.filter((diagnostic) => diagnostic.target === "timeline_turn" && diagnostic.stage === "primary_invalid").length,
      0,
    );
    const generatedTurns = successfulResults.reduce((sum, result) => sum + Math.max(0, result.completedChapters - 1), 0);
    const acceptance = {
      runP50TargetMs: 326_000,
      turnP50TargetMs: 22_000,
      turnP90TargetMs: 35_000,
      firstReadableP50TargetMs: 8_000,
      firstReadableP90TargetMs: 15_000,
      primaryRepairRateTarget: 0.1,
    };
    const summary = {
      batchId: BATCH_ID,
      model: import.meta.env.VITE_DEEPSEEK_MODEL || "deepseek-v4-flash",
      runs: results.length,
      successes,
      successRate: successes / results.length,
      requiredSuccesses: Math.ceil(results.length * 0.9),
      plannedCustomOutcomes,
      totalCustomOutcomes,
      successfulRunCustomOutcomes,
      uniqueCustomOutcomes: usedCustomOutcomes.size,
      totalManualRetries: results.reduce((sum, result) => sum + result.manualRetries, 0),
      latency: {
        fullRun: latencySummary(successfulResults.map((result) => result.durationMs)),
        nextTurn: latencySummary(turnDurations),
        firstReadable: latencySummary(firstReadableDurations),
        customCommit: latencySummary(actionDurations),
        ending: latencySummary(endingDurations),
      },
      generatedTurns,
      primaryInvalids,
      primaryRepairRate: generatedTurns > 0 ? primaryInvalids / generatedTurns : null,
      requestCount: requestMetrics.length,
      requestKinds: Object.fromEntries([...new Set(requestMetrics.map((metric) => metric.requestKind))].map((kind) => [kind, requestMetrics.filter((metric) => metric.requestKind === kind).length])),
      reasoningModes: Object.fromEntries([...new Set(requestMetrics.map((metric) => metric.reasoning))].map((mode) => [mode, requestMetrics.filter((metric) => metric.reasoning === mode).length])),
      promptCache: {
        hitTokens: cacheHitTokens,
        missTokens: cacheMissTokens,
        hitRate: cacheHitTokens + cacheMissTokens > 0 ? cacheHitTokens / (cacheHitTokens + cacheMissTokens) : null,
      },
      acceptance,
      diagnosticStages: results.flatMap((result) => result.diagnostics.map((diagnostic) => diagnostic.stage)),
      results: results.map((result) => ({
        id: result.id,
        success: result.success,
        completedChapters: result.completedChapters,
        customCount: result.customOutcomes.length,
        manualRetries: result.manualRetries,
        durationMs: result.durationMs,
        endingMs: result.endingMs,
        terminalError: result.terminalError,
      })),
    };
    await writeJson(path.join(outputDirectory, "summary.json"), summary);

    expect(new Set(selectedCases.map((item) => item.seedId)).size).toBe(selectedCases.length);
    selectedCases.forEach((item) => {
      expect(item.customChapters.length).toBeGreaterThanOrEqual(4);
      expect(item.customChapters.length).toBeLessThanOrEqual(5);
    });
    results.filter((result) => result.success).forEach((result) => {
      const soakCase = selectedCases.find((item) => item.id === result.id)!;
      expect(result.customOutcomes).toHaveLength(soakCase.customChapters.length);
    });
    expect(usedCustomOutcomes.size).toBe(totalCustomOutcomes);
    expect(successes).toBeGreaterThanOrEqual(summary.requiredSuccesses);
    expect(actionDurations.every((duration) => duration < 50)).toBe(true);
    expect(requestMetrics.every((metric) => !metric.requestKind.includes("custom"))).toBe(true);
    if (selectedCases.length === 10 && successes >= summary.requiredSuccesses) {
      expect(summary.latency.fullRun.p50Ms).toBeLessThanOrEqual(acceptance.runP50TargetMs);
      expect(summary.latency.nextTurn.p50Ms).toBeLessThanOrEqual(acceptance.turnP50TargetMs);
      expect(summary.latency.nextTurn.p90Ms).toBeLessThanOrEqual(acceptance.turnP90TargetMs);
      expect(summary.latency.firstReadable.p50Ms).toBeLessThanOrEqual(acceptance.firstReadableP50TargetMs);
      expect(summary.latency.firstReadable.p90Ms).toBeLessThanOrEqual(acceptance.firstReadableP90TargetMs);
      expect(summary.primaryRepairRate).toBeLessThanOrEqual(acceptance.primaryRepairRateTarget);
    }
  }, 7_200_000);
});
