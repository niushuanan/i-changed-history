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
  const canSubmitCustom = actionLength >= 2 && actionLength <= 56 && customActionsRemaining > 0;
  const debt = turn.causalLedger.at(-1)?.mustAffect ?? turn.previousEcho?.unexpectedCost;

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
        <span className="chapter-kicker">{turn.chapterName} · {turn.role}</span>
        <h1>{turn.headline}</h1>
        <p>{turn.narrative}</p>
        <small><Clock size={12} weight="bold" /> {turn.timePressure}</small>
        </article>

      {turn.previousEcho ? (
        <section className="change-proof" aria-label="历史改变证据">
          <span className="change-proof__kicker">因果回执</span>
          <div className="change-chain">
            <span><small>你的选择</small><strong>{lastChoiceLabel ?? turn.callbackUsed ?? "上一项行动"}</strong></span>
            <ArrowRight size={14} weight="bold" />
            <span><small>世界变化</small><strong>{turn.previousEcho.directResult}</strong></span>
          </div>
          <p className="history-debt">未结历史债 · {debt}</p>
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
          aria-label={customActionsRemaining === 0 ? "改命机会已用完" : `写下第四条路，剩余 ${customActionsRemaining} 次`}
          onClick={() => setCustomOpen(true)}
        >
          <PencilSimpleLine size={16} weight="bold" />
          <span>{customActionsRemaining === 0 ? "第四条路已经写尽" : "写下第四条路"}</span>
          <strong>{customActionsRemaining} 次</strong>
        </button>
      </section>
      </section>
      {customOpen && (
        <div className="custom-action-backdrop">
          <section className="custom-action-sheet" role="dialog" aria-modal="true" aria-label="自由改命">
            <header>
              <div><span>穿越者权限</span><h2>写下第四条路</h2></div>
              <button type="button" aria-label="关闭自由改命" onClick={() => setCustomOpen(false)}><X size={20} /></button>
            </header>
            <p>{abilityCustomAction}。你仍只能使用这个身份此刻真正接触得到的人、物和信息。</p>
            <textarea
              autoFocus
              aria-label="你的自由行动"
              value={customAction}
              maxLength={56}
              placeholder="例如：先扣下军令，再派两名可信宿卫请皇帝临朝"
              onChange={(event) => setCustomAction(event.target.value)}
            />
            <div className="custom-action-meta"><span>AI 将裁决可行性与隐藏代价</span><strong>{actionLength}/56</strong></div>
            <button className="custom-action-submit" type="button" disabled={!canSubmitCustom} onClick={submitCustom}>提交改命 <ArrowRight size={18} weight="bold" /></button>
          </section>
        </div>
      )}
    </main>
  );
}
