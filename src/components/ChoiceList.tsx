import { useEffect, useRef, useState } from "react";
import { ArrowsClockwise, CaretUp, Info, X } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { playCardSound } from "../services/cardAudio";

type Choice = TimelineTurn["choices"][number];

const SWIPE_THRESHOLD = 54;
const LONG_PRESS_MS = 430;

const CARD_META = {
  nudge: {
    name: "循史",
    description: "顺着既有历史",
    icon: "/assets/cards/choice-regular.png",
  },
  reform: {
    name: "破局",
    description: "激进改写局势",
    icon: "/assets/cards/choice-radical.png",
  },
  rupture: {
    name: "天外",
    description: "让不可能降临",
    icon: "/assets/cards/choice-surreal.png",
  },
} as const;

function ChoiceDetail({
  choice,
  onClose,
}: {
  choice: Choice;
  onClose: () => void;
}) {
  const meta = CARD_META[choice.deviationClass];

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="choice-detail-backdrop" onPointerDown={onClose}>
      <section
        aria-label={`${choice.displayLabel}详细信息`}
        aria-modal="true"
        className={`choice-detail choice-detail--${choice.deviationClass}`}
        role="dialog"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>{meta.name}牌 · 完整决定</span>
            <h2>{choice.displayLabel}</h2>
          </div>
          <button type="button" aria-label="关闭卡牌详情" onClick={onClose}>
            <X size={20} weight="bold" />
          </button>
        </header>
        <p className="choice-detail__canon">{choice.label}</p>
        <dl>
          <div><dt>谁来做</dt><dd>{choice.actionSpec.actor}</dd></div>
          <div><dt>怎么做</dt><dd>{choice.actionSpec.action}</dd></div>
          <div><dt>作用于</dt><dd>{choice.actionSpec.target}</dd></div>
          <div><dt>最后期限</dt><dd>{choice.actionSpec.deadline}</dd></div>
          <div className="is-result"><dt>直接结果</dt><dd>{choice.instantEcho.directResult}</dd></div>
          <div className="is-cost"><dt>隐藏代价</dt><dd>{choice.instantEcho.unexpectedCost}</dd></div>
        </dl>
        <small><CaretUp size={14} weight="bold" /> 关闭后向上划出这张牌，即写入你的时间线</small>
      </section>
    </div>
  );
}

function ChoiceCard({
  choice,
  onChoose,
  onInspect,
  muted,
  dealIndex,
}: {
  choice: Choice;
  onChoose: (id: "A" | "B" | "C") => void;
  onInspect: (choice: Choice) => void;
  muted: boolean;
  dealIndex: number;
}) {
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [committing, setCommitting] = useState(false);
  const startYRef = useRef(0);
  const longPressRef = useRef<number | null>(null);
  const inspectedRef = useRef(false);
  const meta = CARD_META[choice.deviationClass];
  const armed = offsetY <= -SWIPE_THRESHOLD;

  const clearLongPress = () => {
    if (longPressRef.current !== null) {
      window.clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const begin = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (committing) return;
    inspectedRef.current = false;
    startYRef.current = event.clientY;
    setDragging(true);
    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    longPressRef.current = window.setTimeout(() => {
      inspectedRef.current = true;
      setDragging(false);
      setOffsetY(0);
      onInspect(choice);
    }, LONG_PRESS_MS);
  };

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging || inspectedRef.current) return;
    const next = Math.min(14, event.clientY - startYRef.current);
    if (Math.abs(next) > 8) clearLongPress();
    setOffsetY(next < 0 ? next : next * 0.3);
  };

  const finish = () => {
    clearLongPress();
    if (inspectedRef.current) return;
    setDragging(false);
    if (armed) {
      setCommitting(true);
      setOffsetY(-260);
      playCardSound("commit", muted);
      window.setTimeout(() => onChoose(choice.id), 210);
      return;
    }
    setOffsetY(0);
  };

  useEffect(() => () => clearLongPress(), []);

  return (
    <button
      aria-label={`${meta.name}牌，${choice.displayLabel}，向上划选择，长按查看详情`}
      className={`choice-card choice-card--${choice.deviationClass}${dragging ? " is-dragging" : ""}${armed ? " is-armed" : ""}${committing ? " is-committing" : ""}`}
      data-choice-id={choice.id}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onInspect(choice);
      }}
      onPointerCancel={finish}
      onPointerDown={begin}
      onPointerMove={move}
      onPointerUp={finish}
      style={{
        "--card-y": `${offsetY}px`,
        "--deal-index": dealIndex,
      } as React.CSSProperties}
      type="button"
    >
      <span className="choice-card__tier">{meta.name}</span>
      <span className="choice-card__art"><img src={meta.icon} alt="" /></span>
      <strong>{choice.displayLabel}</strong>
      <small>{meta.description}</small>
      <span className="choice-card__gesture">
        <CaretUp size={14} weight="bold" />
        {armed ? "松手打出" : "上划选择"}
      </span>
      <span className="choice-card__inspect"><Info size={11} weight="fill" /> 长按详情</span>
    </button>
  );
}

export function ChoiceList({
  choices,
  rollUsed,
  onChoose,
  onRoll,
  muted = false,
}: {
  choices: TimelineTurn["choices"];
  rollUsed: boolean;
  onChoose: (id: "A" | "B" | "C") => void;
  onRoll: () => void;
  muted?: boolean;
}) {
  const [detailChoice, setDetailChoice] = useState<Choice | null>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    playCardSound("deal", muted);
  }, [choices, muted]);

  const roll = () => {
    if (rollUsed || rolling) return;
    setRolling(true);
    playCardSound("roll", muted);
    window.setTimeout(() => onRoll(), 180);
    window.setTimeout(() => setRolling(false), 230);
  };

  return (
    <>
      <div className={`rogue-choice-table${rolling ? " is-rolling" : ""}`}>
        <div className="choice-list" aria-label="三张历史选择卡牌">
          {choices.map((choice, index) => (
            <ChoiceCard
              choice={choice}
              dealIndex={index}
              key={`${rollUsed ? "roll" : "initial"}-${choice.id}`}
              muted={muted}
              onChoose={onChoose}
              onInspect={setDetailChoice}
            />
          ))}
        </div>
        <button
          aria-label={rollUsed ? "本节点已经重抽过一次" : "立即重抽三张预生成卡牌"}
          className="choice-roll"
          disabled={rollUsed || rolling}
          onClick={roll}
          type="button"
        >
          <ArrowsClockwise size={17} weight="bold" />
          <span>{rollUsed ? "已重抽" : "ROLL"}</span>
          <strong>{rollUsed ? "本节点不可再用" : "本节点仅一次 · 无需等待"}</strong>
        </button>
      </div>
      {detailChoice ? (
        <ChoiceDetail choice={detailChoice} onClose={() => setDetailChoice(null)} />
      ) : null}
    </>
  );
}
