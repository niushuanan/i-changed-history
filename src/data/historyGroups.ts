import type { HistorySeed } from "../game/types";
import { HISTORY_SEEDS } from "./historySeeds";

export type HistoryGroupRegion = "china" | "world";

export type HistoryGroup = {
  id: string;
  name: string;
  region: HistoryGroupRegion;
  period: string;
  description: string;
  seedIds: readonly string[];
};

export const HISTORY_GROUPS: readonly HistoryGroup[] = [
  {
    id: "pre-qin",
    name: "先秦",
    region: "china",
    period: "公元前 770—260",
    description: "诸侯、变法与统一前夜",
    seedIds: ["east-zhou-770bc", "shang-yang-356bc", "changping-260bc"],
  },
  {
    id: "qin-han",
    name: "秦汉",
    region: "china",
    period: "公元前 221—公元 184",
    description: "帝国诞生、远征与崩解",
    seedIds: [
      "qin-unification-221bc", "daze-uprising-209bc", "han-founded-202bc",
      "zhang-qian-138bc", "mobei-119bc", "wang-mang-9", "kunyang-25",
      "yellow-turban-184",
    ],
  },
  {
    id: "three-kingdoms",
    name: "三国",
    region: "china",
    period: "公元 190—280",
    description: "群雄、火攻与天下归一",
    seedIds: [
      "dong-zhuo-lu-bu-190", "guandu-wuchao-200", "red-cliffs-208", "yiling-222",
      "jieting-228", "gaoping-tombs-249", "shu-fall-263", "jin-unification-280",
    ],
  },
  {
    id: "northern-southern",
    name: "两晋南北朝",
    region: "china",
    period: "公元 383—494",
    description: "南北对峙与制度重塑",
    seedIds: ["feishui-383", "northern-wei-439", "xiaowen-luoyang-494"],
  },
  {
    id: "sui-tang",
    name: "隋唐",
    region: "china",
    period: "公元 589—907",
    description: "运河、盛世与帝国裂变",
    seedIds: [
      "sui-unification-589", "grand-canal-605", "tang-founded-618", "xuanwu-gate-626",
      "wu-zetian-690", "an-lushan-755", "mawei-756", "tang-fall-907",
    ],
  },
  {
    id: "song-liao-jin",
    name: "宋辽金",
    region: "china",
    period: "公元 960—1279",
    description: "盟约、变法与山河决战",
    seedIds: [
      "chen-bridge-960", "chanyuan-1004", "wang-anshi-1069", "jin-founded-1115",
      "jingkang-1127", "yue-fei-1140", "diaoyu-1259", "xiangyang-1273", "yamen-1279",
    ],
  },
  {
    id: "yuan-ming",
    name: "元明",
    region: "china",
    period: "公元 1271—1567",
    description: "改朝换代、远航与边关",
    seedIds: [
      "yuan-name-1271", "poyang-1363", "ming-founded-1368", "jingnan-nanjing-1402",
      "zheng-he-1405", "beijing-capital-1421", "tumu-crisis-1449", "longqing-trade-1567",
    ],
  },
  {
    id: "ming-qing-transition",
    name: "明清之际",
    region: "china",
    period: "公元 1626—1689",
    description: "火器、海疆与王朝交替",
    seedIds: [
      "ningyuan-1626", "tiangong-kaiwu-1637", "shanhai-pass-1644",
      "koxinga-1661", "kangxi-aobai-1669", "nerchinsk-1689",
    ],
  },
  {
    id: "modern-china",
    name: "近现代",
    region: "china",
    period: "公元 1793—1919",
    description: "海禁裂缝、维新与共和",
    seedIds: ["macartney-1793", "humen-1839", "hundred-days-1898", "wuchang-1911", "may-fourth-1919"],
  },
  {
    id: "ancient-world",
    name: "古代世界",
    region: "world",
    period: "公元前 490—公元 1453",
    description: "城邦、帝国与旧世界终章",
    seedIds: [
      "marathon-490bc", "alexander-gaugamela-331bc", "caesar-rubicon-49bc",
      "great-fire-rome-64", "edict-milan-313", "fall-rome-476", "charlemagne-800",
      "magna-carta-1215", "black-death-1347", "constantinople-1453",
    ],
  },
  {
    id: "exploration-enlightenment",
    name: "大航海与启蒙",
    region: "world",
    period: "公元 1455—1859",
    description: "印刷、远航与科学革命",
    seedIds: [
      "gutenberg-bible-1455", "columbus-1492", "luther-1517", "circumnavigation-1522",
      "galileo-1610", "newton-principia-1687", "watt-patent-1769", "declaration-1776",
      "jenner-vaccine-1796", "origin-species-1859",
    ],
  },
  {
    id: "modern-revolutions",
    name: "近代变革",
    region: "world",
    period: "公元 1789—1941",
    description: "革命、工业与世界大战",
    seedIds: [
      "bastille-1789", "waterloo-1815", "lincoln-emancipation-1862", "meiji-1868",
      "wright-flight-1903", "sarajevo-1914", "october-revolution-1917",
      "roosevelt-bank-holiday-1933", "hitler-poland-1939", "stalin-moscow-1941",
    ],
  },
  {
    id: "cold-war-contemporary",
    name: "冷战与当代",
    region: "world",
    period: "公元 1944—1993",
    description: "秩序重建、太空竞赛与联网时代",
    seedIds: [
      "normandy-1944", "un-charter-1945", "india-independence-1947",
      "suez-nationalization-1956", "sputnik-1957", "cuban-missile-1962",
      "apollo-11-1969", "oil-crisis-1973", "chernobyl-1986", "berlin-wall-1989",
      "soviet-dissolution-1991", "web-public-domain-1993",
    ],
  },
];

const GROUP_BY_ID = new Map(HISTORY_GROUPS.map((group) => [group.id, group]));
const GROUP_BY_SEED_ID = new Map(
  HISTORY_GROUPS.flatMap((group) => group.seedIds.map((seedId) => [seedId, group] as const)),
);
const SEED_BY_ID = new Map(HISTORY_SEEDS.map((seed) => [seed.id, seed]));

export function historyGroupById(groupId: string): HistoryGroup | undefined {
  return GROUP_BY_ID.get(groupId);
}

export function historyGroupForSeed(seedId: string): HistoryGroup | undefined {
  return GROUP_BY_SEED_ID.get(seedId);
}

export function seedsForHistoryGroup(group: HistoryGroup): HistorySeed[] {
  return group.seedIds.flatMap((seedId) => {
    const seed = SEED_BY_ID.get(seedId);
    return seed ? [seed] : [];
  });
}
