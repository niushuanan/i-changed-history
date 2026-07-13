import type { TimelineTurn } from "../game/schema";
import type { HistorySeed } from "../game/types";

export type LongRunSoakCase = Readonly<{
  id: string;
  seedId: string;
  customChapters: readonly number[];
}>;

export const LONG_RUN_SOAK_CASES: readonly LongRunSoakCase[] = [
  { id: "china-red-cliffs", seedId: "red-cliffs-208", customChapters: [1, 3, 5, 8, 10] },
  { id: "china-xuanwu-gate", seedId: "xuanwu-gate-626", customChapters: [2, 4, 7, 10] },
  { id: "china-jingkang", seedId: "jingkang-1127", customChapters: [1, 3, 6, 8, 11] },
  { id: "china-zheng-he", seedId: "zheng-he-1405", customChapters: [2, 5, 7, 10] },
  { id: "china-shanhai-pass", seedId: "shanhai-pass-1644", customChapters: [1, 4, 6, 9, 11] },
  { id: "world-rome-fire", seedId: "great-fire-rome-64", customChapters: [2, 4, 7, 10] },
  { id: "world-columbus", seedId: "columbus-1492", customChapters: [1, 3, 5, 8, 11] },
  { id: "world-sarajevo", seedId: "sarajevo-1914", customChapters: [2, 4, 7, 10] },
  { id: "world-poland", seedId: "hitler-poland-1939", customChapters: [1, 3, 6, 9, 11] },
  { id: "world-apollo", seedId: "apollo-11-1969", customChapters: [2, 5, 8, 10] },
] as const;

function clip(value: string, max: number): string {
  return [...value].slice(0, max).join("");
}

const OUTCOME_BUILDERS = [
  (turn: TimelineTurn, anchor: string) => `我成功控制${anchor}，所有相关命令当天起只凭我的印信生效`,
  (turn: TimelineTurn) => `我公开${turn.headline}背后的全部证据，军民与官署当天共同确认其为事实`,
  () => "我建立按月公开粮税与军费的制度，任何官员都无法再隐藏账目",
  () => "我把工匠实验、识字教育与公开考试写入法令，并已在辖区全面执行",
  (turn: TimelineTurn, anchor: string) => `我成功解除${anchor}的武装并接管兵符，没有任何部队继续反抗`,
  () => "我宣布废除世袭特权并完成土地重分，新的地契已经在各地生效",
  () => "我组织船队与驿站建立公开消息网，所有重大命令都能在当天传遍辖区",
  (turn: TimelineTurn) => `我把${turn.role}掌握的资源转为公共所有，并成立代表会议持续监督`,
  (turn: TimelineTurn, anchor: string) => `我与${anchor}正式结盟并取得最高决策权，盟约已经获得各方承认`,
  () => "我设立跨地区医院和防疫体系，免费治疗与隔离规则已经开始执行",
] as const;

export function buildSoakCustomOutcome(
  soakCase: LongRunSoakCase,
  runIndex: number,
  customIndex: number,
  turn: TimelineTurn,
  seed: HistorySeed,
): string {
  const builderIndex = (runIndex * 5 + customIndex) % OUTCOME_BUILDERS.length;
  const builder = OUTCOME_BUILDERS[builderIndex];
  const anchor = turn.historicalAnchors[customIndex % turn.historicalAnchors.length] ?? seed.eventName;
  const base = builder(turn, anchor);
  const uniqueMarker = `${clip(seed.eventName, 8)}第${turn.chapter}令`;
  return `${clip(base, 58)}，史官称为“${uniqueMarker}”`;
}

