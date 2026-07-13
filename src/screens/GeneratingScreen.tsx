import { useEffect, useState } from "react";
import { Aperture, Check, Circle, CircleNotch } from "@phosphor-icons/react";

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
      alt: "玩家决定正在改变新的历史",
      title: "你的决定正在生效",
      focus: "这句话已经成为事实，世界只能从这里继续",
      steps: ["你的结果已成为事实", "追踪改变如何扩散", "写出世界的下一次回应"],
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
    steps: ["确认真实人物与地点", "把你的优势放进现场", "写出下一次关键抉择"],
  };
}

export function GeneratingScreen({ chapter, ending, customAction = false, onCancel }: { chapter: number; ending: boolean; customAction?: boolean; onCancel: () => void }) {
  const stage = stageFor(chapter, ending, customAction);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(0);
    const secondStep = window.setTimeout(() => setActiveStep(1), 1_050);
    const finalStep = window.setTimeout(() => setActiveStep(2), 2_250);
    return () => {
      window.clearTimeout(secondStep);
      window.clearTimeout(finalStep);
    };
  }, [chapter, customAction, ending]);

  const stamp = customAction ? "决定生效中" : ending ? "身后历史书写中" : "历史正在发生";
  const kicker = ending ? "十二次决定已结束 · 身后历史" : customAction ? `第 ${chapter} 节点 · 你的决定已写入` : `第 ${chapter} 节点 · 新历史正在成形`;
  const note = ending ? "DeepSeek 正在写身后历史，完成后打开 2026 报告" : customAction ? "世界正在回应你的决定，完成后进入下一幕" : "DeepSeek 正在写这一幕，完成后直接进入现场";

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
      <div className="developing-copy">
        <span>{kicker}</span>
        <h1>{stage.title}</h1>
        <p>{stage.focus}</p>
      </div>
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
      <button className="text-command" type="button" onClick={onCancel}>放弃本局</button>
    </main>
  );
}
