import { useEffect, useState } from "react";
import { Aperture, Check, CircleNotch } from "@phosphor-icons/react";

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
      alt: "玩家钦定结果正在写入新正史",
      title: "写入新正史",
      focus: "锁定你的结果，只推演它如何改变世界",
      steps: ["锁定玩家钦定结果", "寻找因果传播媒介", "计算受益者与隐藏代价"],
    };
  }
  if (ending) {
    return {
      image: "/assets/generating-2026.webp",
      alt: "平行世界正在汇入 2026",
      title: "汇入 2026",
      focus: "把十一次选择落到普通人的今天",
      steps: ["核对十一项选择", "折算长期收益与代价", "印刷平行世界头版"],
    };
  }
  if (chapter >= 4) {
    return {
      image: "/assets/generating-relay.webp",
      alt: "历史因果正在接力",
      title: "寻找意外落点",
      focus: "换一批人，换一个问题，保留同一条因果",
      steps: ["回收未兑现的余波", "寻找熟悉的历史锚点", "检验新身份与代价"],
    };
  }
  return {
    image: "/assets/generating-opening.webp",
    alt: "历史现场正在显影",
    title: "历史显影室",
    focus: "把真实人物、地点与倒计时放回现场",
    steps: ["核对历史事实", "匹配你的现代优势", "生成三个可执行行动"],
  };
}

export function GeneratingScreen({ chapter, ending, customAction = false, onCancel }: { chapter: number; ending: boolean; customAction?: boolean; onCancel: () => void }) {
  const stage = stageFor(chapter, ending, customAction);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveStep((current) => (current + 1) % stage.steps.length), 1_450);
    return () => window.clearInterval(timer);
  }, [stage.steps]);

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
      <div className="developing-stamp"><Aperture size={18} weight="bold" /><span>{customAction ? "玩家正史写入" : "历史显影室"}</span></div>
      <div className="developing-copy">
        <span>{ending ? "第 12 节点 · 平行 2026" : customAction ? `第 ${chapter} 节点 · 玩家钦定` : `第 ${chapter} 节点 · 因果推演中`}</span>
        <h1>{stage.title}</h1>
        <p>{stage.focus}</p>
      </div>
      <div className="developing-line" aria-hidden="true"><i /></div>
      <ol className="developing-steps">
        {stage.steps.map((step, index) => (
          <li key={step} className={index === activeStep ? "is-active" : index < activeStep ? "is-complete" : ""}>
            {index < activeStep ? <Check size={15} weight="bold" /> : <CircleNotch size={15} weight="bold" />}
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="developing-note">模型正在推理，完成后会自动翻页</p>
      <button className="text-command" type="button" onClick={onCancel}>放弃本局</button>
    </main>
  );
}
