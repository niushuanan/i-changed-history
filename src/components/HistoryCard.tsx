import { ArrowRight, MapPin } from "@phosphor-icons/react";
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
        <figcaption>
          <time data-testid="history-card-year" data-year={seed.year}>{seed.dateLabel}</time>
          <span><MapPin size={13} weight="fill" />{seed.location}</span>
        </figcaption>
      </figure>
      <div className="history-card__body">
        <h2>{seed.eventName}</h2>
        <p className="history-card__role"><span>你的身份</span>{seed.role}</p>
        <div className="history-card__decision">
          <span>此刻，你必须决定</span>
          <p>{seed.decision}</p>
        </div>
        <button className="history-card__action" type="button" aria-label={`闯入这一刻：${seed.eventName}`} onClick={onSelect}>
          <span>闯入这一刻</span><ArrowRight size={20} weight="bold" />
        </button>
      </div>
    </article>
  );
}
