import { useEffect, useState } from "react";
import { ArrowRight, Clock, PencilSimpleLine, X } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { visualAssetForTurn } from "../data/visualAssets";
import { TimelineProgress } from "../components/TimelineProgress";
import { ChoiceList } from "../components/ChoiceList";

export function TimelineEventScreen({
  turn,
  deviation,
  lastChoiceLabel,
  onChoose,
  onCustomAction,
  onExit,
  sceneImage,
}: {
  turn: TimelineTurn;
  deviation: number;
  lastChoiceLabel?: string;
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
    lastChoiceLabel ?? turn.callbackUsed,
    turn.worldStateChange,
    turn.causalBridge,
    turn.divergenceProof,
    turn.previousEcho ? "" : turn.baselineAnchor,
    turn.previousEcho ? "" : turn.immediateObjective,
    ...turn.choices.map((choice) => choice.label),
  ].reduce((total, copy) => total + [...(copy ?? "")].length, 0);
  const density = visibleCopyLength > 400
    ? "dense"
    : visibleCopyLength > 280 || turn.previousEcho
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
    <main className="event-screen" data-density={density}>
      <TimelineProgress chapter={turn.chapter} deviation={deviation} onExit={onExit} />
      <figure className="event-scene">
        <img src={sceneImage ?? visualAssetForTurn(turn)} alt="" />
        <span className="generation-source is-deepseek"><i />DeepSeek 实时生成</span>
        <figcaption><span>{turn.yearLabel}</span><strong>{turn.location}</strong></figcaption>
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
            <span>被你改变后</span>
            <strong>{turn.worldStateChange}</strong>
          </div>
          <div className="change-proof__row is-real">
            <span>真实历史中</span>
            <p>{turn.divergenceProof}</p>
          </div>
          <p className="change-proof__cause">
            <span>变化来自</span>
            <span>你选择“{lastChoiceLabel ?? turn.callbackUsed ?? "上一项行动"}”，{turn.causalBridge}</span>
          </p>
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
            <p>本局不限次数。你写下的结果将直接成为这条时间线的既成事实。AI 不判断成败，只推演它的传播、受益者与隐藏代价。</p>
            <textarea
              autoFocus
              aria-label="你要写入的历史结果"
              value={customAction}
              maxLength={80}
              placeholder="例如：我暗杀了皇帝且成功，摄政会议接受了我伪造的遗诏"
              onChange={(event) => setCustomAction(event.target.value)}
            />
            <div className="custom-action-meta"><span>AI 只推演传播、受益者与代价</span><strong>{actionLength}/80</strong></div>
            <button className="custom-action-submit" type="button" disabled={!canSubmitCustom} onClick={submitCustom}>写入时间线 <ArrowRight size={18} weight="bold" /></button>
          </section>
        </div>
      )}
    </main>
  );
}
