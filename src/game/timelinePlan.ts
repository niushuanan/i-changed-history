export const DECISION_NODE_COUNT = 11;
export const TOTAL_NODE_COUNT = 12;
export const FINAL_YEAR = 2026;

export const DECISION_CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export type DecisionChapter = (typeof DECISION_CHAPTERS)[number];
export type TimelineChapter = DecisionChapter | 12;

export const CHAPTER_NAMES = {
  1: "历史现场",
  2: "一日余波",
  3: "月度震荡",
  4: "年轮初成",
  5: "三年变局",
  6: "十年改写",
  7: "三十年秩序",
  8: "百年分野",
  9: "跨时代",
  10: "新世界",
  11: "终局前夜",
  12: "平行 2026",
} as const;

export const JUMP_LABELS = [
  "历史现场", "一天后", "一个月后", "一年后", "三年后", "十年后",
  "三十年后", "一百年后", "跨时代", "新世界", "2026 前夕", "2026",
] as const;

export type TimelineNode = {
  chapter: TimelineChapter;
  chapterName: (typeof CHAPTER_NAMES)[TimelineChapter];
  jumpLabel: (typeof JUMP_LABELS)[number];
  targetYear: number;
  kind: "decision" | "summary";
  eraShift: boolean;
};

function yearBetween(from: number, ratio: number): number {
  return Math.min(FINAL_YEAR - 1, Math.max(from, Math.round(from + (FINAL_YEAR - from) * ratio)));
}

export function getTimelinePlan(startYear: number): readonly TimelineNode[] {
  const start = Math.min(startYear, FINAL_YEAR - 1);
  const hundredYear = Math.min(
    FINAL_YEAR - 1,
    Math.max(start + 30, Math.min(start + 100, yearBetween(start, 0.4))),
  );
  const remaining = FINAL_YEAR - hundredYear;
  const targetYears = [
    start,
    start,
    start,
    Math.min(start + 1, FINAL_YEAR - 1),
    Math.min(start + 3, FINAL_YEAR - 1),
    Math.min(start + 10, FINAL_YEAR - 1),
    Math.min(start + 30, FINAL_YEAR - 1),
    hundredYear,
    Math.min(FINAL_YEAR - 1, Math.round(hundredYear + remaining * 0.25)),
    Math.min(FINAL_YEAR - 1, Math.round(hundredYear + remaining * 0.5)),
    Math.min(FINAL_YEAR - 1, Math.round(hundredYear + remaining * 0.8)),
    FINAL_YEAR,
  ];

  return targetYears.map((targetYear, index) => {
    const chapter = (index + 1) as TimelineChapter;
    return {
      chapter,
      chapterName: CHAPTER_NAMES[chapter],
      jumpLabel: JUMP_LABELS[index],
      targetYear,
      kind: chapter === 12 ? "summary" : "decision",
      eraShift: chapter >= 8,
    };
  });
}

export function getTimelineNode(chapter: TimelineChapter, startYear: number): TimelineNode {
  return getTimelinePlan(startYear)[chapter - 1];
}
