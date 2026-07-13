import { useEffect, useState } from "react";
import { ArrowRight, Clock, PencilSimpleLine, X } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { visualAssetForTurn } from "../data/visualAssets";
import { TimelineProgress } from "../components/TimelineProgress";
import { ChoiceList } from "../components/ChoiceList";

export function TimelineEventScreen({
  turn,
  deviation,
  onChoose,
  onCustomAction,
  onExit,
  sceneImage,
}: {
  turn: TimelineTurn;
  deviation: number;
  onChoose: (id: "A" | "B" | "C") => void;
  onCustomAction: (action: string) => void;
  onExit: () => void;
  sceneImage?: string;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customAction, setCustomAction] = useState("");
  const actionLength = [...customAction.trim()].length;
  const canSubmitCustom = actionLength >= 2 && actionLength <= 80;
  const visibleCopyLength = [
    turn.headline,
    turn.narrative,
    turn.timePressure,
    ...(turn.previousEcho
      ? [turn.worldStateChange, turn.causalBridge, turn.divergenceProof]
      : [turn.baselineAnchor, turn.immediateObjective]),
    ...turn.choices.map((choice) => choice.label),
  ].reduce((total, copy) => total + [...(copy ?? "")].length, 0);
  const narrativeLength = [...turn.narrative].length;
  const density = narrativeLength > 132 || visibleCopyLength > 300
    ? "dense"
    : narrativeLength > 108 || visibleCopyLength > 260 || turn.previousEcho
      ? "compact"
      : "comfortable";

  useEffect(() => {
    setCustomOpen(false);
    setCustomAction("");
  }, [turn.chapter, turn.yearLabel]);

  const submitCustom = () => {
    if (!canSubmitCustom) return;
    onCustomAction(customAction.trim());
    setCustomOpen(false);
  };

  return (
    <main
      className="event-screen"
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
        <h2><span>你要怎么做？</span></h2>
        <ChoiceList choices={turn.choices} onChoose={onChoose} />
        <button
          className="custom-action-command"
          type="button"
          aria-label="直接改写结果，不限次数"
          onClick={() => setCustomOpen(true)}
        >
          <PencilSimpleLine size={16} weight="bold" />
          <span>直接改写结果</span>
          <strong>不限次数</strong>
        </button>
      </section>

      {turn.previousEcho ? (
        <section className="change-proof" aria-label="历史对照">
          <span className="change-proof__kicker">历史对照</span>
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
      {customOpen && (
        <div className="custom-action-backdrop">
          <section className="custom-action-sheet" role="dialog" aria-modal="true" aria-label="钦定历史结果">
            <header>
              <div><span>玩家拥有最终解释权</span><h2>直接改写结果</h2></div>
              <button type="button" aria-label="关闭结果改写" onClick={() => setCustomOpen(false)}><X size={20} /></button>
            </header>
            <p>请写下已经发生的结果。提交后，这句话不会被推翻。</p>
            <textarea
              autoFocus
              aria-label="你要写入的历史结果"
              value={customAction}
              maxLength={80}
              placeholder="例如：我暗杀了皇帝且成功，摄政会议接受了我伪造的遗诏"
              onChange={(event) => setCustomAction(event.target.value)}
            />
            <div className="custom-action-meta"><strong>{actionLength}/80</strong></div>
            <button className="custom-action-submit" type="button" disabled={!canSubmitCustom} onClick={submitCustom}>写入时间线 <ArrowRight size={18} weight="bold" /></button>
          </section>
        </div>
      )}
    </main>
  );
}
