import type { CustomSeedResult } from "./types";

const MODERN_CHINA_ENTITY_LEXICON = {
  yearGated: {
    chinaNames: ["中国", "中华", "华夏", "神州"],
    provinceLevelRegions: [
      "北京", "天津", "上海", "重庆",
      "河北", "山西", "辽宁", "吉林", "黑龙江", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾",
      "内蒙古", "广西", "西藏", "宁夏", "新疆",
      "香港", "澳门",
    ],
    majorCities: ["广州", "南京", "武汉", "西安", "沈阳", "深圳", "厦门", "青岛", "大连", "杭州", "福州", "长沙", "成都", "昆明", "拉萨", "乌鲁木齐", "呼和浩特", "银川"],
    historicalTerms: ["清朝", "清代", "清廷", "清末", "晚清", "北洋", "洋务运动", "太平天国"],
  },
  modernContexts: ["近现代", "当代", "现代"],
  alwaysModern: {
    politicalEntities: ["中华人民共和国", "中华民国", "民国", "新中国", "国民政府", "北洋政府", "中共中央", "中国共产党", "国民党", "人民解放军"],
    politicalMovements: ["五四运动", "新文化运动", "抗日战争", "解放战争", "大跃进", "文化大革命", "改革开放", "一国两制"],
    politicalFigures: ["孙中山", "袁世凯", "蒋介石", "毛泽东", "周恩来", "刘少奇", "邓小平", "江泽民", "胡锦涛", "习近平", "宋庆龄", "李大钊", "陈独秀"],
  },
} as const;
const YEAR = /(?<!\d)(\d{4})(?!\d)/g;
const HAN_CHARACTER = /\p{Script=Han}/gu;

function hasLexiconEntity(value: string, groups: Readonly<Record<string, readonly string[]>>) {
  return Object.values(groups).some((entities) => entities.some((entity) => value.includes(entity)));
}

function referencesModernChina(value: string) {
  if (hasLexiconEntity(value, MODERN_CHINA_ENTITY_LEXICON.alwaysModern)) return true;
  if (!hasLexiconEntity(value, MODERN_CHINA_ENTITY_LEXICON.yearGated)) return false;
  if (MODERN_CHINA_ENTITY_LEXICON.modernContexts.some((term) => value.includes(term))) return true;

  return Array.from(value.matchAll(YEAR)).some((match) => Number(match[1]) >= 1840);
}

export function normalizeCustomSeed(input: string): CustomSeedResult {
  const value = input.replace(/\s+/g, " ").trim();

  if (value.length === 0) return { ok: false, reason: "empty", value };
  const characterCount = Array.from(value).length;
  if (characterCount < 4) return { ok: false, reason: "too_short", value };
  if (characterCount > 140) return { ok: false, reason: "too_long", value };
  if ((value.match(HAN_CHARACTER) ?? []).length < 4) return { ok: false, reason: "not_chinese", value };
  if (referencesModernChina(value)) return { ok: false, reason: "modern_china", value };

  return { ok: true, value };
}
