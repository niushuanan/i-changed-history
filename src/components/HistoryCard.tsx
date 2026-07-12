import { ArrowRight, MapPin } from "@phosphor-icons/react";
import type { HistorySeed } from "../game/types";
import { VISUAL_ASSETS } from "../data/visualAssets";

function yearLabel(year: number) {
  return year < 0 ? `公元前 ${Math.abs(year)} 年` : `${year} 年`;
}

export function HistoryCard({ seed, onSelect }: { seed: HistorySeed; onSelect: () => void }) {
  return (
    <article className="history-card">
      <div className="history-card__stamp" aria-hidden="true">档案 {seed.id.slice(0, 6).toUpperCase()}</div>
      <div className="history-card__media">
        <img src={VISUAL_ASSETS[seed.visualTone]} alt="" />
        <div className="history-card__date">{yearLabel(seed.year)}</div>
      </div>
      <div className="history-card__body">
        <p className="history-card__location"><MapPin size={14} weight="fill" />{seed.location}</p>
        <h3>{seed.prompt}</h3>
        <div className="history-card__facts" aria-label="真实历史">
          <strong>真实历史</strong>
          <ul>
            {seed.baselineFacts.slice(0, 2).map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
        </div>
        <button
          className="history-card__action"
          type="button"
          aria-label={`改写这段历史：${seed.prompt}`}
          onClick={onSelect}
        >
          <span>改写这段历史</span><ArrowRight size={22} weight="bold" />
        </button>
      </div>
    </article>
  );
}
