import { Clock, IdentificationBadge, Sparkle } from "@phosphor-icons/react";
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
}: {
  turn: TimelineTurn;
  deviation: number;
  lastChoiceLabel?: string;
  abilityTitle: string;
  onChoose: (id: "A" | "B" | "C") => void;
  onExit: () => void;
}) {
  return (
    <main className="event-screen">
      <TimelineProgress chapter={turn.chapter} deviation={deviation} onExit={onExit} />
      <figure className="event-scene">
        <img src={visualAssetForTurn(turn)} alt="" />
        <span className={`generation-source is-${turn.generationSource}`}>
          {turn.generationSource === "deepseek" ? "DeepSeek 实时生成" : "本地保底续写"}
        </span>
        <figcaption><span>{turn.yearLabel}</span><strong>{turn.location}</strong></figcaption>
      </figure>
      <article className="event-copy">
        <span className="chapter-kicker">{turn.chapterName}</span>
        <h1>{turn.headline}</h1>
        <p>{turn.narrative}</p>
        <small><Clock size={12} weight="bold" /> {turn.timePressure}</small>
      </article>

      {turn.previousEcho ? (
        <section className="change-proof" aria-label="历史改变证据">
          <span className="change-proof__kicker">你真的改变了历史</span>
          <div><small>上一幕你选择</small><strong>{lastChoiceLabel ?? turn.callbackUsed ?? "上一项行动"}</strong></div>
          <div className="is-result"><small>所以现在</small><strong>{turn.previousEcho.directResult}</strong></div>
          <p>新的代价：{turn.previousEcho.unexpectedCost}</p>
        </section>
      ) : (
        <section className="change-proof is-opening" aria-label="真实历史切入口">
          <span className="change-proof__kicker">真实历史停在这里</span>
          <div><small>原本发生</small><strong>{turn.baselineAnchor}</strong></div>
          <div className="is-result"><small>你的切入口</small><strong>{turn.immediateObjective}</strong></div>
        </section>
      )}

      <div className="identity-strip">
        <IdentificationBadge size={17} weight="bold" />
        <span><small>本代身份</small><strong>{turn.role}</strong></span>
        <em><Sparkle size={12} weight="fill" />{abilityTitle}</em>
      </div>
      <section className="decision-zone">
        <h2>下一步，改哪里？</h2>
        <ChoiceList choices={turn.choices} abilityTitle={abilityTitle} onChoose={onChoose} />
      </section>
    </main>
  );
}
