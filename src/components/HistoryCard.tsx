import { ArrowRight, ClockCountdown, MapPin, UserFocus, WarningCircle } from "@phosphor-icons/react";
import type { HistorySeed } from "../game/types";
import { historyAssetForSeed, VISUAL_ASSETS } from "../data/visualAssets";

export function HistoryCard({ seed, onSelect }: { seed: HistorySeed; onSelect: () => void }) {
  return (
    <article className="history-card">
      <figure className="history-card__media">
        <img
          src={historyAssetForSeed(seed)}
          alt={seed.eventName}
          loading="lazy"
          onError={(event) => { event.currentTarget.src = VISUAL_ASSETS[seed.visualTone]; }}
        />
        <div className="history-card__year-rail" data-testid="history-card-year-rail">
          <time data-testid="history-card-year" data-year={seed.year}>{seed.dateLabel}</time>
        </div>
      </figure>
      <section className="history-card__brief" aria-label="闯入信息">
        <h2>{seed.eventName}</h2>
        <div className="history-card__facts">
          <p><MapPin size={18} weight="fill" /><span>地点</span><strong>{seed.location}</strong></p>
          <p><UserFocus size={18} weight="bold" /><span>身份</span><strong>{seed.role}</strong></p>
          <p><WarningCircle size={18} weight="bold" /><span>抉择</span><strong>{seed.decision}</strong></p>
          <p><ClockCountdown size={18} weight="bold" /><span>时限</span><strong>{seed.urgency}</strong></p>
        </div>
        <button className="history-card__action" type="button" aria-label={`闯入这一刻：${seed.eventName}`} onClick={onSelect}>
          <span>闯入这一刻</span><ArrowRight size={20} weight="bold" />
        </button>
      </section>
    </article>
  );
}
