import { useEffect, useState } from "react";
import { ArrowRight, Clock, PencilSimpleLine, Sparkle, X } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { visualAssetForTurn } from "../data/visualAssets";
import { TimelineProgress } from "../components/TimelineProgress";
import { ChoiceList } from "../components/ChoiceList";
import type { TravelerAbility } from "../game/profile";

export function TimelineEventScreen({
  turn,
  deviation,
  lastChoiceLabel,
  abilityTitle,
  abilityCode,
  abilityPreviewMode,
  abilityCustomAction,
  customActionsRemaining,
  onChoose,
  onCustomAction,
  onExit,
  sceneImage,
}: {
  turn: TimelineTurn;
  deviation: number;
  lastChoiceLabel?: string;
  abilityTitle: string;
  abilityCode: string;
  abilityPreviewMode: TravelerAbility["previewMode"];
  abilityCustomAction: string;
  customActionsRemaining: number;
  onChoose: (id: "A" | "B" | "C") => void;
  onCustomAction: (action: string) => void;
  onExit: () => void;
  sceneImage?: string;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customAction, setCustomAction] = useState("");
  const actionLength = [...customAction.trim()].length;
  const canSubmitCustom = actionLength >= 2 && actionLength <= 80 && customActionsRemaining > 0;

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
    <main className="event-screen">
      <TimelineProgress chapter={turn.chapter} deviation={deviation} onExit={onExit} />
      <figure className="event-scene">
        <img src={sceneImage ?? visualAssetForTurn(turn)} alt="" />
        <span className={`generation-source is-${turn.generationSource}`}><i />{turn.generationSource === "deepseek" ? "DeepSeek 实时生成" : "本地保底续写"}</span>
        <figcaption><span>{turn.yearLabel}</span><strong>{turn.location}</strong></figcaption>
      </figure>
      <section className="event-body">
        <article className="event-copy">
        <span className="chapter-kicker">{turn.protagonistName} · {turn.protagonistAge}岁 · {turn.role}</span>
        <h1>{turn.headline}</h1>
        <p>{turn.narrative}</p>
        <small><Clock size={12} weight="bold" /> {turn.timePressure}</small>
        </article>

      {turn.previousEcho ? (
        <section className="change-proof" aria-label="历史改变证据">
          <span className="change-proof__kicker">因果回执</span>
          <div className="change-chain">
            <span><small>你的决定</small><strong>{lastChoiceLabel ?? turn.callbackUsed ?? "上一项行动"}</strong></span>
            <span className="is-result"><small>已经改变</small><strong>{turn.worldStateChange}</strong></span>
            <span className="is-pivot"><small>重大节点</small><strong>{turn.turningPointStakes}</strong></span>
          </div>
          <p className="butterfly-turn">
            <span className="butterfly-turn__label">为何来到这里</span>
            <span className="butterfly-turn__copy">{turn.causalBridge}</span>
            <span className="butterfly-turn__proof">{turn.divergenceProof}</span>
          </p>
        </section>
      ) : (
        <section className="change-proof is-opening" aria-label="真实历史切入口">
          <span className="change-proof__kicker">真实历史</span>
          <p>{turn.baselineAnchor}</p>
          <small>你能改：{turn.immediateObjective}</small>
        </section>
      )}

      <section className="decision-zone">
        <h2><span>你要怎么做？</span><em><Sparkle size={11} weight="fill" />{abilityCode} · {abilityTitle}</em></h2>
        <ChoiceList choices={turn.choices} abilityTitle={abilityTitle} previewMode={abilityPreviewMode} onChoose={onChoose} />
        <button
          className="custom-action-command"
          type="button"
          disabled={customActionsRemaining === 0}
          aria-label={customActionsRemaining === 0 ? "改写机会已用完" : `直接改写结果，剩余 ${customActionsRemaining} 次`}
          onClick={() => setCustomOpen(true)}
        >
          <PencilSimpleLine size={16} weight="bold" />
          <span>{customActionsRemaining === 0 ? "结果改写已经用完" : "直接改写结果"}</span>
          <strong>{customActionsRemaining} 次</strong>
        </button>
      </section>
      </section>
      {customOpen && (
        <div className="custom-action-backdrop">
          <section className="custom-action-sheet" role="dialog" aria-modal="true" aria-label="钦定历史结果">
            <header>
              <div><span>玩家拥有最终解释权</span><h2>直接改写结果</h2></div>
              <button type="button" aria-label="关闭结果改写" onClick={() => setCustomOpen(false)}><X size={20} /></button>
            </header>
            <p>你写下的结果将直接成为这条时间线的既成事实。AI 不判断成败，只推演它的后果。{abilityCustomAction}</p>
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
