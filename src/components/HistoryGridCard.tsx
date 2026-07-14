import type { HistorySeed } from "../game/types";
import { formatHistoricalYear } from "../data/historicalYear";
import { themeForSeed, type HistoryTheme } from "../data/historyCatalog";
import { historyAssetForSeed, VISUAL_ASSETS } from "../data/visualAssets";

export const HISTORY_THEME_LABELS: Record<Exclude<HistoryTheme, "all">, string> = {
  military: "军事战争",
  politics: "政治制度",
  economy: "经济贸易",
  technology: "科技发明",
  culture: "文化社会",
};

type HistoryGridCardProps = {
  seed: HistorySeed;
  isCurrent: boolean;
  onSelect: (seed: HistorySeed) => void;
};

export function HistoryGridCard({ seed, isCurrent, onSelect }: HistoryGridCardProps) {
  return (
    <button
      type="button"
      className="history-grid-card"
      aria-current={isCurrent ? "true" : undefined}
      onClick={() => onSelect(seed)}
    >
      <img
        src={historyAssetForSeed(seed)}
        alt={seed.eventName}
        loading="lazy"
        onError={(event) => { event.currentTarget.src = VISUAL_ASSETS[seed.visualTone]; }}
      />
      <span>{formatHistoricalYear(seed.year)}</span>
      <strong>{seed.eventName}</strong>
      <span>{seed.location}</span>
      <span>{HISTORY_THEME_LABELS[themeForSeed(seed)]}</span>
    </button>
  );
}
