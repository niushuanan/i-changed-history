export const INTERACTIVE_REVIEW_HISTORY_IDS = Object.freeze([
  "gutenberg-bible-1455",
  "galileo-1610",
  "apollo-11-1969",
]);

if (new Set(INTERACTIVE_REVIEW_HISTORY_IDS).size !== 3) {
  throw new Error("Interactive Space review catalogue must contain exactly three unique scripts.");
}
