export const DECISION_NODE_COUNT = 4;
export const TOTAL_NODE_COUNT = 4;
export const FINAL_REPORT_YEAR = 2026;
export const LAST_PLAYABLE_YEAR = FINAL_REPORT_YEAR - 1;

export const DECISION_CHAPTERS = [1, 2, 3, 4] as const;
export type DecisionChapter = (typeof DECISION_CHAPTERS)[number];
export type TimelineChapter = DecisionChapter;

export const CHAPTER_NAMES = {
  1: "历史现场",
  2: "三日余波",
  3: "人生转折",
  4: "生命终章",
} as const;

export const JUMP_LABELS = [
  "命运当日", "三日后", "人生转折", "最后抉择",
] as const;

export type LifeStage = (typeof JUMP_LABELS)[number];

export type TimelineNode = {
  chapter: TimelineChapter;
  chapterName: (typeof CHAPTER_NAMES)[TimelineChapter];
  jumpLabel: LifeStage;
  lifeStage: LifeStage;
  targetYear: number;
  protagonistAge: number;
  kind: "decision";
  eraShift: boolean;
};

const LIFE_PROGRESS = [0, 0, 0.35, 1] as const;

export function getTimelinePlan(startYear: number): readonly TimelineNode[] {
  const start = Math.min(startYear, LAST_PLAYABLE_YEAR);
  const playableYears = Math.max(0, LAST_PLAYABLE_YEAR - start);
  const lifespanYears = Math.min(46, playableYears);
  const initialAge = 70 - lifespanYears;

  return LIFE_PROGRESS.map((progress, index) => {
    const chapter = (index + 1) as TimelineChapter;
    const elapsedYears = index < 2 ? 0 : Math.round(lifespanYears * progress);
    return {
      chapter,
      chapterName: CHAPTER_NAMES[chapter],
      jumpLabel: JUMP_LABELS[index],
      lifeStage: JUMP_LABELS[index],
      targetYear: start + elapsedYears,
      protagonistAge: initialAge + elapsedYears,
      kind: "decision",
      eraShift: chapter >= 3,
    };
  });
}

export function getTimelineNode(chapter: TimelineChapter, startYear: number): TimelineNode {
  return getTimelinePlan(startYear)[chapter - 1];
}
