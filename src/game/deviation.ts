import type { DeviationClass, TimelineTurn } from "./schema";

export const BASE_IMPACT = Object.freeze({
  nudge: 3,
  reform: 10,
  rupture: 22,
} as const satisfies Record<DeviationClass, number>);

export const CHAPTER_MULTIPLIER = Object.freeze([
  1,
  1.15,
  1.3,
  1.45,
  1.6,
  1.72,
  1.84,
  1.96,
  2.08,
  2.2,
  2.35,
  2.5,
] as const);

export type DeviationStage = {
  label: "变化刚刚发生" | "影响正在扩大" | "历史明显不同" | "世界正在重塑" | "已是全新世界";
  min: number;
  max: number;
};

const STAGES: readonly DeviationStage[] = [
  { label: "变化刚刚发生", min: 0, max: 9 },
  { label: "影响正在扩大", min: 10, max: 29 },
  { label: "历史明显不同", min: 30, max: 54 },
  { label: "世界正在重塑", min: 55, max: 79 },
  { label: "已是全新世界", min: 80, max: 100 },
];

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function calculateStepImpact(
  kind: DeviationClass,
  chapter: TimelineTurn["chapter"],
): number {
  return Math.round(BASE_IMPACT[kind] * CHAPTER_MULTIPLIER[chapter - 1]);
}

export function calculateDeviation(
  currentDeviation: number,
  kind: DeviationClass,
  chapter: TimelineTurn["chapter"],
): { stepImpact: number; nextDeviation: number } {
  const current = clampScore(currentDeviation);
  const stepImpact = calculateStepImpact(kind, chapter);
  const nextDeviation = Math.round(
    100 * (1 - (1 - current / 100) * (1 - stepImpact / 100)),
  );

  return { stepImpact, nextDeviation: clampScore(nextDeviation) };
}

export function getDeviationStage(value: number): DeviationStage {
  const score = clampScore(value);
  return STAGES.find((stage) => score >= stage.min && score <= stage.max) ?? STAGES[0];
}
