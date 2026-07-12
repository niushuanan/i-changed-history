import { ArrowRight, MapPin } from "@phosphor-icons/react";
import type { HistorySeed } from "../game/types";
import { historyAssetForSeed, VISUAL_ASSETS } from "../data/visualAssets";

export function HistoryCard({ seed, onSelect }: { seed: HistorySeed; onSelect: () => void }) {
  return (
    <article className="history-card">
      <div className="history-card__stamp" aria-hidden="true">档案 {seed.id.slice(0, 6).toUpperCase()}</div>
      <div className="history-card__media">
        <img
          src={historyAssetForSeed(seed)}
          alt=""
          loading="lazy"
          onError={(event) => { event.currentTarget.src = VISUAL_ASSETS[seed.visualTone]; }}
        />
        <div className="history-card__date">{seed.dateLabel}</div>
      </div>
      <div className="history-card__body">
        <p className="history-card__location"><MapPin size={14} weight="fill" />{seed.location}</p>
        <h3>{seed.eventName}</h3>
        <p className="history-card__role"><strong>你将成为</strong>{seed.role}</p>
        <div className="history-card__facts" aria-label="真实历史">
          <strong>这一分钟，你必须决定</strong>
          <p>{seed.decision}</p>
          <small>真实结果：{seed.historicalOutcome}</small>
        </div>
        <button
          className="history-card__action"
          type="button"
          aria-label={`穿越到这一分钟：${seed.eventName}`}
          onClick={onSelect}
        >
          <span>穿越到这一分钟</span><ArrowRight size={22} weight="bold" />
        </button>
      </div>
    </article>
  );
}
