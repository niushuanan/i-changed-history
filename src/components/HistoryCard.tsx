import { ArrowRight, ClockCountdown, MapPin, UserFocus, WarningCircle } from "@phosphor-icons/react";
import type { HistorySeed } from "../game/types";
import { formatHistoricalYear } from "../data/historicalYear";
import { historyAssetForSeed, VISUAL_ASSETS } from "../data/visualAssets";

type HistoryCardProps = {
  seed: HistorySeed;
  position: number;
  total: number;
  onSelect: () => void;
};

function visibleYearParts(seed: HistorySeed) {
  const era = seed.year < 0 ? "公元前" : "公元";
  const year = String(Math.abs(seed.year));

  return {
    era: Array.from(era),
    year: Array.from(year),
  };
}

export function HistoryCard({ seed, position, total, onSelect }: HistoryCardProps) {
  const visibleYear = visibleYearParts(seed);

  return (
    <article className="history-card">
      <div className="history-card__poster-stack" data-testid="history-card-poster-stack">
        <figure className="history-card__scene" data-testid="history-card-scene">
          <img
            src={historyAssetForSeed(seed)}
            alt={seed.eventName}
            loading="lazy"
            onError={(event) => { event.currentTarget.src = VISUAL_ASSETS[seed.visualTone]; }}
          />
          <div className="history-card__year-rail" data-testid="history-card-year-rail">
            <div className="history-card__year" data-testid="history-card-year" data-year={seed.year} aria-label={formatHistoricalYear(seed.year)}>
              <span className="history-card__year-era" data-testid="history-card-year-era">
                {visibleYear.era.map((character) => <span key={character}>{character}</span>)}
              </span>
              <strong className="history-card__year-number" data-testid="history-card-year-number">
                {visibleYear.year.map((digit, index) => <span key={`${digit}-${index}`}>{digit}</span>)}
              </strong>
              <span className="history-card__year-suffix" data-testid="history-card-year-suffix">年</span>
            </div>
          </div>
          <span className="history-card__position" data-testid="history-card-position"><strong>{position}</strong> / {total}</span>
        </figure>
        <section className="history-card__dossier" data-testid="history-card-dossier" aria-label="闯入信息">
          <h2>{seed.eventName}</h2>
          <div className="history-card__facts">
            <p><MapPin size={18} weight="fill" /><span>地点</span><strong>{seed.location}</strong></p>
            <p><UserFocus size={18} weight="bold" /><span>身份</span><strong>{seed.role}</strong></p>
            <p><WarningCircle size={18} weight="bold" /><span>抉择</span><strong>{seed.decision}</strong></p>
            <p><ClockCountdown size={18} weight="bold" /><span>时限</span><strong>{seed.urgency}</strong></p>
          </div>
        </section>
      </div>
      <button className="history-card__action" data-testid="history-card-action" type="button" aria-label={`闯入这一刻：${seed.eventName}`} onClick={onSelect}>
        <span>闯入这一刻</span><ArrowRight size={24} weight="bold" />
      </button>
    </article>
  );
}
