import { PencilSimple } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { VISUAL_ASSETS } from "../data/visualAssets";
import { TimelineProgress } from "../components/TimelineProgress";
import { WorldMetrics } from "../components/WorldMetrics";
import { ChoiceList } from "../components/ChoiceList";

export function TimelineEventScreen({
  turn,
  deviation,
  onChoose,
  onCustom,
}: {
  turn: TimelineTurn;
  deviation: number;
  onChoose: (id: "A" | "B" | "C") => void;
  onCustom: () => void;
}) {
  return (
    <main className="event-screen">
      <TimelineProgress chapter={turn.chapter} deviation={deviation} />
      <figure className="event-scene">
        <img src={VISUAL_ASSETS[turn.visualTone]} alt="" />
        <figcaption><span>{turn.yearLabel}</span><strong>{turn.location}</strong></figcaption>
      </figure>
      <article className="event-copy">
        <span className="chapter-kicker">第 {turn.chapter} 幕 · {turn.chapterName}</span>
        <h1>{turn.headline}</h1>
        <p>{turn.narrative}</p>
        <small>历史锚点：{turn.baselineAnchor}</small>
      </article>
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
        <button className="intervention-command" type="button" onClick={onCustom}>
          <PencilSimple size={20} weight="bold" />自己改写这一步
        </button>
      </section>
    </main>
  );
}
