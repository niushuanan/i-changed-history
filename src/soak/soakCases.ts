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

const ALL_CUSTOM_CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export function selectLongRunSoakCases({
  caseIds = [],
  limit = LONG_RUN_SOAK_CASES.length,
  allCustom = false,
}: {
  caseIds?: readonly string[];
  limit?: number;
  allCustom?: boolean;
} = {}): LongRunSoakCase[] {
  const candidates = caseIds.length > 0
    ? caseIds.map((id) => {
        const match = LONG_RUN_SOAK_CASES.find((item) => item.id === id);
        if (!match) throw new Error(`Unknown soak case: ${id}`);
        return match;
      })
    : [...LONG_RUN_SOAK_CASES];
  const boundedLimit = Math.max(1, Math.min(candidates.length, limit));
  return candidates.slice(0, boundedLimit).map((item) => ({
    ...item,
    ...(allCustom ? { customChapters: ALL_CUSTOM_CHAPTERS } : {}),
  }));
}

function clip(value: string, max: number): string {
  return [...value].slice(0, max).join("");
}

const OUTCOME_BUILDERS = [
  () => "我已经接管现场全部军令与印信，此后所有调动只承认我的签发",
  (turn: TimelineTurn) => `我公开${turn.headline}背后的全部证据，军民与官署当天共同确认其为事实`,
  () => "我建立按月公开粮税与军费的制度，任何官员都无法再隐藏账目",
  () => "我把工匠实验、识字教育与公开考试写入法令，并已在辖区全面执行",
  () => "我已经解除反对派的武装并接管兵符，现场没有部队继续抵抗",
  () => "我宣布废除世袭特权并完成土地重分，新的地契已经在各地生效",
  () => "我组织船队与驿站建立公开消息网，所有重大命令都能在当天传遍辖区",
  () => "我已把当前官署的税粮与军械登记为公产，并设代表共同监督",
  () => "我已促成各方签署公开盟约并取得最终裁决权，盟约当场由官署承认",
  () => "我设立跨地区医院和防疫体系，免费治疗与隔离规则已经开始执行",
] as const;

const WILD_OUTCOME_FOUNDATIONS = [
  () => "我宣布蓝色纸鹤成为唯一通行货币，旧币已由沿途粮站全部回收",
  () => "我用巨型风筝铺成跨城信号网，任何命令与求救都能在一刻钟内公开传递",
  () => "我让居民把屋瓦磨成镜面，以日光和火光向四方城镇连续广播现场消息",
  () => "我开放所有官仓为昼夜公民食堂，军粮与民粮按同一份公开名册领取",
  () => "我把车队改造成移动医院，敌我伤员都能凭伤情而非身份获得救治",
  () => "我熔掉宫门前全部礼仪兵器铸成农具，并当场废除武职世袭",
  () => "我把缴获的战马和运输权全部交给女兵营，后勤军令从此由她们公开签发",
  (turn: TimelineTurn) => `我把${clip(turn.headline, 8)}涉及的全部技术图纸开源，任何工匠都可复制改进`,
  () => "我用抽签建立跨阶层公民议会，重大军政命令必须经陌生人陪审团公开表决",
  () => "我释放辖区所有奴隶与债役者，并让他们组成拥有选举权的公民消防军",
  () => "我让每艘船和每座驿站免费递送私人书信，秘密命令已无法垄断消息",
  () => "我把水钟、星表与粮价接成公共预警网，所有人每天都能核对官府预测",
] as const;

const WILD_OUTCOME_RIPPLES = [
  "儿童巡查队同时接管账目复核，所有收支刻在城门石碑上",
  "旧债当场清零，争议统一交给由平民与士兵混合组成的公开法庭",
  "港口向流亡者开放，地图与航路被免费印发给每一支商队",
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
  const base = builder(turn);
  const uniqueMarker = `${clip(seed.eventName, 8)}第${turn.chapter}令`;
  return `${clip(base, 58)}，史官称为“${uniqueMarker}”`;
}

export function buildWildSoakCustomOutcome(
  soakCase: LongRunSoakCase,
  runIndex: number,
  customIndex: number,
  turn: TimelineTurn,
  seed: HistorySeed,
): string {
  const combinationIndex = runIndex * 12 + customIndex;
  const foundation = WILD_OUTCOME_FOUNDATIONS[combinationIndex % WILD_OUTCOME_FOUNDATIONS.length];
  const ripple = WILD_OUTCOME_RIPPLES[Math.floor(combinationIndex / WILD_OUTCOME_FOUNDATIONS.length) % WILD_OUTCOME_RIPPLES.length];
  const uniqueMarker = `${clip(seed.eventName, 7)}·${soakCase.id.slice(-6)}·第${turn.chapter}令`;
  return `${foundation(turn)}；${ripple}，史官称为“${uniqueMarker}”`;
}
