import { POWER_CATALOGUE } from "./powers";

const INTERNAL_TERM_REPLACEMENTS = [
  [/\bresverse[\s_-]*cause\b/gi, "取消一件事"],
  [/\bactualHistory\b/gi, "真实历史"],
  [/\bactionsHistory\b/gi, "真实历史"],
  [/\bactionSpec\b/gi, "具体行动"],
  [/\bdeadline\b/gi, "期限"],
  [/\bunexpectedCost\b/gi, "代价"],
  [/\bdirectResult\b/gi, "直接结果"],
  [/\bdeviationClass\b/gi, "行动类型"],
  [/\bcausedByChapter\b/gi, "起因幕次"],
  [/\bmustAffect\b/gi, "后续影响"],
  [/\bpowerId\b/gi, "超能力名称"],
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const POWER_ID_REPLACEMENTS = POWER_CATALOGUE
  .map((power) => ({
    name: power.name,
    pattern: new RegExp(
      `\\b${power.id.split("-").map(escapeRegExp).join("[\\s_-]+")}\\b`,
      "gi",
    ),
  }))
  .sort((left, right) => right.pattern.source.length - left.pattern.source.length);

/**
 * Converts machine-only schema labels and power IDs when migrating an older
 * save. New model responses must pass validation without needing this repair.
 */
export function localizeInternalPlayerCopy(value: string): string {
  let localized = value;
  for (const [pattern, replacement] of INTERNAL_TERM_REPLACEMENTS) {
    localized = localized.replace(pattern, replacement);
  }
  for (const { pattern, name } of POWER_ID_REPLACEMENTS) {
    localized = localized.replace(pattern, name);
  }
  return localized;
}

export function containsInternalPlayerCopy(value: string): boolean {
  return localizeInternalPlayerCopy(value) !== value;
}
