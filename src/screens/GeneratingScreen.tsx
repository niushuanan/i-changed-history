import { Aperture, Check, Circle, CircleNotch } from "@phosphor-icons/react";
import type { DeepSeekPartialDraft, DeepSeekProgressStage } from "../services/deepseek";

type DevelopingStage = {
  image: string;
  alt: string;
  title: string;
  focus: string;
  steps: readonly [string, string, string];
};

function stageFor(chapter: number, ending: boolean, customAction: boolean): DevelopingStage {
  if (customAction) {
    return {
      image: "/assets/generating-opening.webp",
      alt: "新的历史局面正在展开",
      title: "下一幕正在展开",
      focus: "你写下的结果已经落定",
      steps: ["结果已经写入", "新的局面正在形成", "下一次抉择即将出现"],
    };
  }
  if (ending) {
    return {
      image: "/assets/generating-2026.webp",
      alt: "主角死后的历史正在延伸到 2026",
      title: "书写身后历史",
      focus: "让十二次人生决定脱离本人，继续改变后来者",
      steps: ["完成主角生命终章", "追踪遗产如何流传", "写成 2026 世界报告"],
    };
  }
  if (chapter >= 4) {
    return {
      image: "/assets/generating-relay.webp",
      alt: "同一个人的历史人生正在展开",
      title: "人生进入下一幕",
      focus: "同一个人，带着此前全部选择走进新的重大冲突",
      steps: ["接续此前全部决定", "让主角进入新的冲突", "写出下一次关键抉择"],
    };
  }
  return {
    image: "/assets/generating-opening.webp",
    alt: "新的历史现场正在形成",
    title: "历史正在发生",
    focus: "把真实人物、地点与倒计时放回现场",
    steps: ["确认真实人物与地点", "把既有决定写进现场", "写出下一次关键抉择"],
  };
}

export function GeneratingScreen({
  chapter,
  ending,
  customAction = false,
  customCanonText,
  progressStage = "connected",
  draft,
  onCancel,
}: {
  chapter: number;
  ending: boolean;
  customAction?: boolean;
  customCanonText?: string;
  progressStage?: DeepSeekProgressStage;
  draft?: DeepSeekPartialDraft;
  onCancel: () => void;
}) {
  const stage = stageFor(chapter, ending, customAction);
  const activeStep = progressStage === "connected" ? 0 : progressStage === "reasoning" ? 1 : 2;
  const readableDraft = !ending && Boolean(draft?.headline && draft?.narrative);

  const stamp = customAction ? "下一幕" : ending ? "身后历史书写中" : "历史正在发生";
  const kicker = ending ? "十二次决定已结束 · 身后历史" : customAction ? `第 ${chapter} 节点 · 结果已经写入` : `第 ${chapter} 节点 · 新历史正在成形`;
  const note = progressStage === "repairing"
    ? "正在整理这一页，已经发生的历史不会改变"
    : progressStage === "validating"
      ? "下一幕即将开始"
      : ending ? "十二次选择正在汇成最后两份历史" : customAction ? "下一幕即将开始" : "新的历史现场即将出现";
  const canonReceipt = customCanonText ? (
    <blockquote className="developing-canon">
      <strong>{customCanonText}</strong>
      <span>这条事实已经生效，后续只能推演它造成什么</span>
    </blockquote>
  ) : null;

  return (
    <main className="generating-screen" aria-live="polite">
      <img className="generating-screen__art" src={stage.image} alt={stage.alt} />
      <div className="developing-motion" data-testid="developing-motion" aria-hidden="true">
        <i className="causal-thread causal-thread--one" />
        <i className="causal-thread causal-thread--two" />
        <b className="developing-exposure" />
        {["one", "two", "three", "four"].map((position) => (
          <span key={position} className={`causal-pulse causal-pulse--${position}`} data-testid="causal-pulse" />
        ))}
      </div>
      <div className="developing-stamp"><Aperture size={18} weight="bold" /><span>{stamp}</span></div>
      {readableDraft ? (
        <section className={`developing-draft${customCanonText ? " developing-draft--with-canon" : ""}`} aria-label="正在写成的历史现场">
          {canonReceipt}
          <span>现场正在写成</span>
          <h1>{draft?.headline}</h1>
          <p>{draft?.narrative}</p>
          {(draft?.location || draft?.role) && (
            <small>{[draft.location, draft.role].filter(Boolean).join(" · ")}</small>
          )}
          <em><CircleNotch size={14} weight="bold" />场景仍在写成，完整校验后才能决定</em>
        </section>
      ) : (
        <>
          <div className="developing-copy">
            <span>{kicker}</span>
            <h1>{stage.title}</h1>
            <p>{stage.focus}</p>
          </div>
          {canonReceipt}
          <div className="developing-line" aria-hidden="true">
            {stage.steps.map((step, index) => (
              <i key={step} data-testid="developing-track-segment" className={index === activeStep ? "is-active" : index < activeStep ? "is-complete" : ""} />
            ))}
          </div>
          <ol className="developing-steps">
            {stage.steps.map((step, index) => (
              <li key={step} className={index === activeStep ? "is-active" : index < activeStep ? "is-complete" : ""}>
                {index < activeStep ? <Check size={15} weight="bold" /> : index === activeStep ? <CircleNotch size={15} weight="bold" /> : <Circle size={15} weight="regular" />}
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="developing-note">{note}</p>
        </>
      )}
      <button className="text-command" type="button" onClick={onCancel}>放弃本局</button>
    </main>
  );
}
