import { ArrowCounterClockwise, ArrowRight, CheckCircle } from "@phosphor-icons/react";
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
  completed?: boolean;
  onSelect: (seed: HistorySeed) => void;
};

export function HistoryGridCard({
  seed,
  isCurrent,
  completed = false,
  onSelect,
}: HistoryGridCardProps) {
  return (
    <button
      type="button"
      className={`history-grid-card${completed ? " is-completed" : ""}`}
      aria-current={isCurrent ? "true" : undefined}
      aria-label={`${completed ? "再次闯入" : "闯入"}：${seed.eventName}`}
      onClick={() => onSelect(seed)}
    >
      <img
        src={historyAssetForSeed(seed)}
        alt={seed.eventName}
        loading="lazy"
        onError={(event) => { event.currentTarget.src = VISUAL_ASSETS[seed.visualTone]; }}
      />
      <span className="history-grid-card__year">{formatHistoricalYear(seed.year)}</span>
      <strong>{seed.eventName}</strong>
      <span className="history-grid-card__location">{seed.location}</span>
      <span className="history-grid-card__theme">{HISTORY_THEME_LABELS[themeForSeed(seed)]}</span>
      <span className="history-grid-card__replay">
        {completed
          ? <><CheckCircle size={14} weight="fill" /> 已通关 · 再次闯入 <ArrowCounterClockwise size={14} weight="bold" /></>
          : <>闯入这一刻 <ArrowRight size={14} weight="bold" /></>}
      </span>
    </button>
  );
}
