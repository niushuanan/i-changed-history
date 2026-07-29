import { useEffect, useState } from "react";
import { ArrowRight, Clock, X } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { visualAssetForTurn } from "../data/visualAssets";
import { TimelineProgress } from "../components/TimelineProgress";
import { ChoiceList } from "../components/ChoiceList";

function HistoryContextDialog({
  turn,
  onClose,
}: {
  turn: TimelineTurn;
  onClose: () => void;
}) {
  const isContinuation = Boolean(turn.previousEcho);
  const title = isContinuation ? "历史对照" : "正史切入口";

  return (
    <div className="history-context-backdrop" onMouseDown={onClose}>
      <section
        className="history-context-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div><span>二级阅读</span><h2>{title}</h2></div>
          <button type="button" aria-label={`关闭${title}`} onClick={onClose}><X size={20} /></button>
        </header>
        {isContinuation ? (
          <section className="change-proof" aria-label="历史对照">
            <span className="change-proof__kicker">这一次决定改写了什么</span>
            <div className="change-proof__row is-alternate">
              <span>你的时间线</span>
              <strong>{turn.worldStateChange}</strong>
            </div>
            <div className="change-proof__row is-real">
              <span>正史原本</span>
              <p>{turn.divergenceProof}</p>
            </div>
            <div className="change-proof__cause">
              <span>为何改变</span>
              <span>{turn.causalBridge}</span>
            </div>
          </section>
        ) : (
          <section className="change-proof is-opening" aria-label="真实历史切入口">
            <span className="change-proof__kicker">真实历史</span>
            <p>{turn.baselineAnchor}</p>
            <small>你能改：{turn.immediateObjective}</small>
          </section>
        )}
      </section>
    </div>
  );
}

export function TimelineEventScreen({
  turn,
  deviation,
  rollCount = 0,
  dynamicChoices = null,
  rollLoading = false,
  rollError,
  muted,
  onChoose,
  onRoll,
  onExit,
  sceneImage,
}: {
  turn: TimelineTurn;
  deviation: number;
  rollCount?: number;
  dynamicChoices?: TimelineTurn["choices"] | null;
  rollLoading?: boolean;
  rollError?: string | null;
  muted: boolean;
  onChoose: (id: "A" | "B" | "C") => void;
  onRoll: () => void;
  onExit: () => void;
  sceneImage?: string;
}) {
  const [historyContextOpen, setHistoryContextOpen] = useState(false);
  const [cardCommitting, setCardCommitting] = useState(false);
  const visibleChoices = rollCount === 0
    ? turn.choices
    : rollCount === 1
      ? turn.rollChoices
      : dynamicChoices ?? turn.rollChoices;
  const visibleCopyLength = [
    turn.headline,
    turn.narrative,
    turn.timePressure,
    ...visibleChoices.map((choice) => choice.displayLabel),
  ].reduce((total, copy) => total + [...(copy ?? "")].length, 0);
  const narrativeLength = [...turn.narrative].length;
  const density = narrativeLength > 132 || visibleCopyLength > 300
    ? "dense"
    : narrativeLength > 108 || visibleCopyLength > 260 || turn.previousEcho
      ? "compact"
      : "comfortable";

  useEffect(() => {
    setHistoryContextOpen(false);
    setCardCommitting(false);
  }, [turn.chapter, turn.yearLabel]);

  useEffect(() => {
    if (!historyContextOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHistoryContextOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [historyContextOpen]);

  return (
    <main
      className={`event-screen${cardCommitting ? " is-card-committing" : ""}`}
      data-density={density}
      data-history-mode={turn.previousEcho ? "continuation" : "opening"}
      data-layout="image-overlay"
    >
      <TimelineProgress chapter={turn.chapter} deviation={deviation} onExit={onExit} />
      <figure className="event-scene">
        <img src={sceneImage ?? visualAssetForTurn(turn)} alt="" />
        <span className={`generation-source ${turn.generationSource === "fixed" ? "is-fixed" : "is-deepseek"}`}>
          <i />{turn.generationSource === "fixed" ? "固定历史开场" : "DeepSeek 实时生成"}
        </span>
        <figcaption className="event-scene__caption">
          <span className="event-scene__time">{turn.yearLabel}</span>
          <strong className="event-scene__location">{turn.location}</strong>
        </figcaption>
      </figure>
      <section className="event-body">
        <article className="event-copy">
          <span className="chapter-kicker">{turn.protagonistName} · {turn.protagonistAge}岁 · {turn.role}</span>
          <h1>{turn.headline}</h1>
          <p>{turn.narrative}</p>
          <small><Clock size={12} weight="bold" /> {turn.timePressure}</small>
        </article>

        <section className="decision-zone" role="group" aria-label="本幕决定">
          <h2>
            <span>抽一张，改写这一刻</span>
            <em>上划打出 · 按住读牌 · 每幕可 Roll 3 次</em>
          </h2>
          <ChoiceList
            choices={visibleChoices}
            muted={muted}
            onChoose={onChoose}
            onCommitVisualStart={() => setCardCommitting(true)}
            onRoll={onRoll}
            rollCount={rollCount}
            rollLoading={rollLoading}
            rollError={rollError}
          />
        </section>
        <button
          className="history-context-trigger"
          type="button"
          aria-label={turn.previousEcho ? "查看历史对照" : "查看正史切入口"}
          aria-haspopup="dialog"
          aria-expanded={historyContextOpen}
          onClick={() => setHistoryContextOpen(true)}
        >
          <span>{turn.previousEcho ? "历史对照" : "正史切入口"}</span>
          <strong>{turn.previousEcho ? "你的时间线 · 正史原本 · 改变原因" : "真实历史 · 可以改变的节点"}</strong>
          <ArrowRight size={16} weight="bold" />
        </button>
      </section>
      {historyContextOpen ? <HistoryContextDialog turn={turn} onClose={() => setHistoryContextOpen(false)} /> : null}
    </main>
  );
}
