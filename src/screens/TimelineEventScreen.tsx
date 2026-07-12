import { HourglassHigh, IdentificationBadge } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { visualAssetForTurn } from "../data/visualAssets";
import { JUMP_LABELS } from "../game/timelinePlan";
import { TimelineProgress } from "../components/TimelineProgress";
import { WorldMetrics } from "../components/WorldMetrics";
import { ChoiceList } from "../components/ChoiceList";

export function TimelineEventScreen({
  turn,
  deviation,
  onChoose,
}: {
  turn: TimelineTurn;
  deviation: number;
  onChoose: (id: "A" | "B" | "C") => void;
}) {
  return (
    <main className="event-screen">
      <TimelineProgress chapter={turn.chapter} deviation={deviation} />
      <figure className="event-scene">
        <img src={visualAssetForTurn(turn)} alt="" />
        {turn.chapter >= 8 && <span className="era-shift-badge">时代跃迁 · {JUMP_LABELS[turn.chapter - 1]}</span>}
        <figcaption><span>{turn.yearLabel}</span><strong>{turn.location}</strong></figcaption>
      </figure>
      <article className="event-copy">
        <span className="chapter-kicker">第 {turn.chapter} 节点 · {turn.chapterName}</span>
        <h1>{turn.headline}</h1>
        <p>{turn.narrative}</p>
        <small>历史锚点：{turn.baselineAnchor}</small>
      </article>
      <aside className="mission-brief">
        <div><IdentificationBadge size={19} weight="bold" /><span><small>你现在是</small><strong>{turn.role}</strong></span></div>
        <div><HourglassHigh size={19} weight="bold" /><span><small>必须完成</small><strong>{turn.immediateObjective}</strong><em>{turn.timePressure}</em></span></div>
      </aside>
      {turn.previousEcho && (
        <aside className="previous-echo">
          <span>上一选择的余波</span>
          <p>{turn.previousEcho.directResult}；但{turn.previousEcho.unexpectedCost}</p>
        </aside>
      )}
      <WorldMetrics metrics={turn.metrics} />
      <section className="decision-zone">
        <h2>这一刻，你决定</h2>
        <ChoiceList choices={turn.choices} onChoose={onChoose} />
      </section>
    </main>
  );
}
