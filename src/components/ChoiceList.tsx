import { useCallback, useEffect, useRef, useState } from "react";
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
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    closeTimerRef.current = window.setTimeout(onClose, 180);
  }, [closing, onClose]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [requestClose]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
  }, []);

  return (
    <div
      className={`choice-detail-backdrop${closing ? " is-closing" : ""}`}
      onPointerDown={requestClose}
    >
      <section
        aria-label={`${choice.displayLabel}详细信息`}
        aria-modal="true"
        className={`choice-detail choice-detail--${choice.deviationClass}`}
        role="dialog"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span className="choice-detail__art" aria-hidden="true">
          <img src={meta.icon} alt="" />
        </span>
        <header>
          <div>
            <span>{meta.name}牌 · 完整决定</span>
            <h2>{choice.displayLabel}</h2>
          </div>
          <button autoFocus type="button" aria-label="关闭卡牌详情" onClick={requestClose}>
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
  onCommitStart,
  onInspect,
  muted,
  dealIndex,
}: {
  choice: Choice;
  onChoose: (id: "A" | "B" | "C") => void;
  onCommitStart: (id: "A" | "B" | "C") => void;
  onInspect: (choice: Choice, trigger: HTMLButtonElement) => void;
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
    const trigger = event.currentTarget;
    longPressRef.current = window.setTimeout(() => {
      inspectedRef.current = true;
      setDragging(false);
      setOffsetY(0);
      onInspect(choice, trigger);
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
      onCommitStart(choice.id);
      setOffsetY(-Math.max(520, window.innerHeight * 0.86));
      playCardSound("commit", muted);
      const commitDelay = typeof window.matchMedia === "function"
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 90
        : 420;
      window.setTimeout(() => onChoose(choice.id), commitDelay);
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
        if (event.key === "Enter" || event.key === " ") onInspect(choice, event.currentTarget);
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
      <span className="choice-card__surface">
        <span className="choice-card__tier">{meta.name}</span>
        <span className="choice-card__art"><img src={meta.icon} alt="" /></span>
        <strong>{choice.displayLabel}</strong>
        <small>{meta.description}</small>
        <span className="choice-card__gesture">
          <CaretUp size={14} weight="bold" />
          {armed ? "松手打出" : "上划选择"}
        </span>
        <span className="choice-card__inspect"><Info size={11} weight="fill" /> 长按详情</span>
      </span>
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
  const [rollPhase, setRollPhase] = useState<"idle" | "collecting" | "dealing">("idle");
  const [committingId, setCommittingId] = useState<"A" | "B" | "C" | null>(null);
  const rollTimersRef = useRef<number[]>([]);
  const inspectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const rolling = rollPhase !== "idle";

  useEffect(() => {
    playCardSound("deal", muted);
  }, [choices, muted]);

  useEffect(() => () => {
    rollTimersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const roll = () => {
    if (rollUsed || rolling) return;
    setRollPhase("collecting");
    playCardSound("roll", muted);
    const reducedMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const collectDuration = reducedMotion ? 70 : 260;
    const totalDuration = reducedMotion ? 120 : 720;
    rollTimersRef.current.push(window.setTimeout(() => {
      onRoll();
      setRollPhase("dealing");
    }, collectDuration));
    rollTimersRef.current.push(window.setTimeout(() => setRollPhase("idle"), totalDuration));
  };

  const inspect = (choice: Choice, trigger: HTMLButtonElement) => {
    inspectTriggerRef.current = trigger;
    setDetailChoice(choice);
  };

  const closeDetail = () => {
    setDetailChoice(null);
    window.requestAnimationFrame(() => inspectTriggerRef.current?.focus());
  };

  return (
    <>
      <div
        className={`rogue-choice-table${rollPhase === "collecting" ? " is-collecting" : ""}${rollPhase === "dealing" ? " is-dealing" : ""}${committingId ? " is-committing" : ""}`}
        data-committing-choice={committingId ?? undefined}
      >
        <div className="choice-list" aria-label="三张历史选择卡牌">
          {choices.map((choice, index) => (
            <ChoiceCard
              choice={choice}
              dealIndex={index}
              key={`${rollUsed ? "roll" : "initial"}-${choice.id}`}
              muted={muted}
              onChoose={onChoose}
              onCommitStart={setCommittingId}
              onInspect={inspect}
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
          <span className="choice-roll__deck" aria-hidden="true">
            <img src="/assets/picker/vermilion-cloth-v2.webp" alt="" />
            <img src="/assets/picker/vermilion-cloth-v2.webp" alt="" />
            <img src="/assets/picker/vermilion-cloth-v2.webp" alt="" />
          </span>
          <span className="choice-roll__action">
            <ArrowsClockwise size={17} weight="bold" />
            <span>{rolling ? "洗牌中" : rollUsed ? "已重抽" : "ROLL"}</span>
          </span>
          <strong>{rollUsed ? "本节点不可再用" : "本节点仅一次 · 无需等待"}</strong>
        </button>
      </div>
      {detailChoice ? (
        <ChoiceDetail choice={detailChoice} onClose={closeDetail} />
      ) : null}
    </>
  );
}
