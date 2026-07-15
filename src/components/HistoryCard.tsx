import { ArrowRight, ClockCountdown, MapPin, UserFocus, WarningCircle } from "@phosphor-icons/react";
import type { HistorySeed } from "../game/types";
import { historyAssetForSeed, VISUAL_ASSETS } from "../data/visualAssets";

type HistoryCardProps = {
  seed: HistorySeed;
  position: number;
  total: number;
  onSelect: () => void;
};

function visibleDateParts(seed: HistorySeed) {
  const era = seed.year < 0 ? "公元前" : "公元";
  const year = String(Math.abs(seed.year));
  const yearPrefix = seed.year < 0
    ? new RegExp(`^公元前\\s*${year}年`)
    : new RegExp(`^(?:公元)?${year}年`);
  const detail = seed.dateLabel.replace(yearPrefix, "");

  return { era, year, detail };
}

export function HistoryCard({ seed, position, total, onSelect }: HistoryCardProps) {
  const date = visibleDateParts(seed);

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
            <div className="history-card__year" data-testid="history-card-year" data-year={seed.year} aria-label={seed.dateLabel}>
              <span className="history-card__year-era" data-testid="history-card-year-era">{date.era}</span>
              <strong className="history-card__year-number" data-testid="history-card-year-number">{date.year}</strong>
              <span className="history-card__year-suffix" data-testid="history-card-year-suffix">年</span>
              {date.detail ? <small>{date.detail}</small> : null}
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
