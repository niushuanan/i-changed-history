const ATTRIBUTION_FIELDS = [
  "articleUrl",
  "filePage",
  "artist",
  "license",
  "licenseUrl",
  "sourceUrl",
];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasCompleteImageAttribution(entry) {
  return Boolean(entry) && ATTRIBUTION_FIELDS.every((field) => isNonEmptyString(entry[field]));
}

export function shouldRefreshHistoryImage(fileExists, previousEntry) {
  return !fileExists || !previousEntry || Boolean(previousEntry.fallback) || !hasCompleteImageAttribution(previousEntry);
}

export function validateHistoryImageManifest(entries, expectedIds) {
  if (!Array.isArray(entries) || entries.length !== expectedIds.length) {
    throw new Error(`Image manifest must contain exactly ${expectedIds.length} entries`);
  }
  const expected = new Set(expectedIds);
  const ids = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry.id !== "string" || !expected.has(entry.id) || ids.has(entry.id)) {
      throw new Error(`Image manifest contains an unknown or duplicate id: ${entry?.id ?? "missing"}`);
    }
    ids.add(entry.id);
    if (!hasCompleteImageAttribution(entry)) {
      throw new Error(`Image manifest attribution is incomplete for ${entry.id}`);
    }
    if (entry.fallback) {
      if (
        !isNonEmptyString(entry.fallback.sourceAsset)
        || entry.fallback.sourceCredits !== "/assets/CREDITS.md"
        || !isNonEmptyString(entry.fallback.reason)
      ) {
        throw new Error(`Fallback attribution is incomplete for ${entry.id}`);
      }
    }
  }
  if (ids.size !== expected.size) throw new Error("Image manifest id set is incomplete");
}
