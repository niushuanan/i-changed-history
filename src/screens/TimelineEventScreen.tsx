import { Clock, Sparkle } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { visualAssetForTurn } from "../data/visualAssets";
import { TimelineProgress } from "../components/TimelineProgress";
import { ChoiceList } from "../components/ChoiceList";

export function TimelineEventScreen({
  turn,
  deviation,
  lastChoiceLabel,
  abilityTitle,
  onChoose,
  onExit,
  sceneImage,
}: {
  turn: TimelineTurn;
  deviation: number;
  lastChoiceLabel?: string;
  abilityTitle: string;
  onChoose: (id: "A" | "B" | "C") => void;
  onExit: () => void;
  sceneImage?: string;
}) {
  return (
    <main className="event-screen">
      <TimelineProgress chapter={turn.chapter} deviation={deviation} onExit={onExit} />
      <figure className="event-scene">
        <img src={sceneImage ?? visualAssetForTurn(turn)} alt="" />
        <span className={`generation-source is-${turn.generationSource}`}><i />{turn.generationSource === "deepseek" ? "DeepSeek 实时生成" : "本地保底续写"}</span>
        <figcaption><span>{turn.yearLabel}</span><strong>{turn.location}</strong></figcaption>
      </figure>
      <section className="event-body">
        <article className="event-copy">
        <span className="chapter-kicker">{turn.chapterName} · {turn.role}</span>
        <h1>{turn.headline}</h1>
        <p>{turn.narrative}</p>
        <small><Clock size={12} weight="bold" /> {turn.timePressure}</small>
        </article>

      {turn.previousEcho ? (
        <section className="change-proof" aria-label="历史改变证据">
          <span className="change-proof__kicker">因果回执</span>
          <p><strong>{lastChoiceLabel ?? turn.callbackUsed ?? "上一项行动"}</strong> → {turn.previousEcho.directResult}</p>
          <small>代价：{turn.previousEcho.unexpectedCost}</small>
        </section>
      ) : (
        <section className="change-proof is-opening" aria-label="真实历史切入口">
          <span className="change-proof__kicker">真实历史</span>
          <p>{turn.baselineAnchor}</p>
          <small>你能改：{turn.immediateObjective}</small>
        </section>
      )}

      <section className="decision-zone">
        <h2><span>你要怎么做？</span><em><Sparkle size={11} weight="fill" />{abilityTitle}</em></h2>
        <ChoiceList choices={turn.choices} abilityTitle={abilityTitle} onChoose={onChoose} />
      </section>
      </section>
    </main>
  );
}
