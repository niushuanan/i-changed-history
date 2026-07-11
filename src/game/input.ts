import type { CustomSeedResult } from "./types";

const CHINA_REFERENCE = /中国|中华|华夏|清末|民国|中华人民共和国/;
const MODERN_CHINA_REFERENCE = /近现代|当代|现代|民国|共和国|抗日战争|改革开放/;
const YEAR = /(?<!\d)(\d{4})(?!\d)/g;
const HAN_CHARACTER = /\p{Script=Han}/gu;

function referencesModernChina(value: string) {
  if (!CHINA_REFERENCE.test(value)) return false;
  if (MODERN_CHINA_REFERENCE.test(value)) return true;

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
