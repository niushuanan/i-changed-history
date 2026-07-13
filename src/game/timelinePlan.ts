export const DECISION_NODE_COUNT = 12;
export const TOTAL_NODE_COUNT = 12;
export const FINAL_REPORT_YEAR = 2026;
export const LAST_PLAYABLE_YEAR = FINAL_REPORT_YEAR - 1;

export const DECISION_CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type DecisionChapter = (typeof DECISION_CHAPTERS)[number];
export type TimelineChapter = DecisionChapter;

export const CHAPTER_NAMES = {
  1: "历史现场",
  2: "三日余波",
  3: "六周震荡",
  4: "立足之年",
  5: "声名渐起",
  6: "执掌一方",
  7: "生涯转折",
  8: "盛年危局",
  9: "守成之争",
  10: "暮年抉择",
  11: "最后布局",
  12: "生命终章",
} as const;

export const JUMP_LABELS = [
  "命运当日", "三日后", "六周后", "立足之年", "声名渐起", "执掌一方",
  "生涯转折", "盛年危局", "守成之争", "暮年抉择", "最后布局", "生命终章",
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

const LIFE_PROGRESS = [0, 0, 0, 0.02, 0.05, 0.11, 0.18, 0.28, 0.41, 0.57, 0.76, 1] as const;

export function getTimelinePlan(startYear: number): readonly TimelineNode[] {
  const start = Math.min(startYear, LAST_PLAYABLE_YEAR);
  const playableYears = Math.max(0, LAST_PLAYABLE_YEAR - start);
  const lifespanYears = Math.min(46, playableYears);
  const initialAge = 70 - lifespanYears;

  return LIFE_PROGRESS.map((progress, index) => {
    const chapter = (index + 1) as TimelineChapter;
    const elapsedYears = index < 3 ? 0 : Math.round(lifespanYears * progress);
    return {
      chapter,
      chapterName: CHAPTER_NAMES[chapter],
      jumpLabel: JUMP_LABELS[index],
      lifeStage: JUMP_LABELS[index],
      targetYear: start + elapsedYears,
      protagonistAge: initialAge + elapsedYears,
      kind: "decision",
      eraShift: chapter >= 4,
    };
  });
}

export function getTimelineNode(chapter: TimelineChapter, startYear: number): TimelineNode {
  return getTimelinePlan(startYear)[chapter - 1];
}
