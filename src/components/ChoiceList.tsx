import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowsClockwise, CaretUp, Info, X } from "@phosphor-icons/react";
import type { TimelineTurn } from "../game/schema";
import { playCardSound } from "../services/cardAudio";

type Choice = TimelineTurn["choices"][number];
type CardOrigin = {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

const SWIPE_THRESHOLD = 48;
const LONG_PRESS_MS = 320;
const COMMIT_DURATION_MS = 480;

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
  origin,
  onClose,
}: {
  choice: Choice;
  origin: CardOrigin;
  onClose: () => void;
}) {
  const meta = CARD_META[choice.deviationClass];
  const detailRef = useRef<HTMLElement | null>(null);
  const readyFrameRef = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    const reducedMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimerRef.current = window.setTimeout(onClose, reducedMotion ? 20 : 230);
  }, [closing, onClose]);

  useLayoutEffect(() => {
    const detail = detailRef.current;
    if (!detail) return undefined;
    const rect = detail.getBoundingClientRect();
    const scale = Math.max(.28, Math.min(.62, origin.width / rect.width, origin.height / rect.height));
    detail.style.setProperty("--detail-from-x", `${origin.centerX - (rect.left + rect.width / 2)}px`);
    detail.style.setProperty("--detail-from-y", `${origin.centerY - (rect.top + rect.height / 2)}px`);
    detail.style.setProperty("--detail-from-scale", `${scale}`);
    readyFrameRef.current = window.requestAnimationFrame(() => setMotionReady(true));
    return () => {
      if (readyFrameRef.current !== null) window.cancelAnimationFrame(readyFrameRef.current);
    };
  }, [origin]);

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
      className={`choice-detail-backdrop${motionReady ? " is-ready" : ""}${closing ? " is-closing" : ""}`}
      onPointerDown={requestClose}
    >
      <section
        aria-label={`${choice.displayLabel}详细信息`}
        aria-modal="true"
        className={`choice-detail choice-detail--${choice.deviationClass}`}
        ref={detailRef}
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
          <button
            autoFocus
            className="choice-detail__close"
            type="button"
            aria-label="关闭卡牌详情"
            onClick={requestClose}
          >
            <X size={17} weight="bold" />
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
  const [dragging, setDragging] = useState(false);
  const [armed, setArmed] = useState(false);
  const [committing, setCommitting] = useState(false);
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);
  const offsetYRef = useRef(0);
  const dragFrameRef = useRef<number | null>(null);
  const pendingOffsetRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const longPressRef = useRef<number | null>(null);
  const commitTimerRef = useRef<number | null>(null);
  const inspectedRef = useRef(false);
  const committedRef = useRef(false);
  const meta = CARD_META[choice.deviationClass];

  const clearLongPress = () => {
    if (longPressRef.current !== null) {
      window.clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };

  const writeCardOffset = (nextOffset: number) => {
    offsetYRef.current = nextOffset;
    pendingOffsetRef.current = nextOffset;
    if (dragFrameRef.current !== null) return;
    dragFrameRef.current = window.requestAnimationFrame(() => {
      dragFrameRef.current = null;
      cardRef.current?.style.setProperty("--card-y", `${pendingOffsetRef.current}px`);
    });
  };

  const releasePointer = (target: HTMLButtonElement) => {
    const pointerId = pointerIdRef.current;
    if (
      pointerId !== null
      && typeof target.hasPointerCapture === "function"
      && target.hasPointerCapture(pointerId)
      && typeof target.releasePointerCapture === "function"
    ) {
      target.releasePointerCapture(pointerId);
    }
    pointerIdRef.current = null;
  };

  const resetGesture = (target?: HTMLButtonElement) => {
    clearLongPress();
    if (target) releasePointer(target);
    inspectedRef.current = false;
    draggingRef.current = false;
    setDragging(false);
    setArmed(false);
    writeCardOffset(0);
  };

  const begin = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (committing) return;
    inspectedRef.current = false;
    committedRef.current = false;
    pointerIdRef.current = event.pointerId;
    startYRef.current = event.clientY;
    draggingRef.current = true;
    writeCardOffset(0);
    setArmed(false);
    setDragging(true);
    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const trigger = event.currentTarget;
    longPressRef.current = window.setTimeout(() => {
      inspectedRef.current = true;
      draggingRef.current = false;
      setDragging(false);
      setArmed(false);
      writeCardOffset(0);
      releasePointer(trigger);
      onInspect(choice, trigger);
    }, LONG_PRESS_MS);
  };

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current || inspectedRef.current) return;
    const next = Math.min(14, event.clientY - startYRef.current);
    if (Math.abs(next) > 8) clearLongPress();
    const resistedOffset = next < 0 ? next : next * 0.3;
    writeCardOffset(resistedOffset);
    const nextArmed = resistedOffset <= -SWIPE_THRESHOLD;
    setArmed((current) => current === nextArmed ? current : nextArmed);
  };

  const finish = (event: React.PointerEvent<HTMLButtonElement>) => {
    clearLongPress();
    releasePointer(event.currentTarget);
    if (inspectedRef.current || committedRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (offsetYRef.current <= -SWIPE_THRESHOLD) {
      committedRef.current = true;
      setCommitting(true);
      setArmed(false);
      onCommitStart(choice.id);
      playCardSound("commit", muted);
      window.requestAnimationFrame(() => {
        writeCardOffset(-Math.max(560, window.innerHeight * 1.02));
      });
      const reducedMotion = typeof window.matchMedia === "function"
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      commitTimerRef.current = window.setTimeout(
        () => onChoose(choice.id),
        reducedMotion ? 100 : COMMIT_DURATION_MS,
      );
      return;
    }
    resetGesture();
  };

  const cancel = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (committedRef.current) return;
    resetGesture(event.currentTarget);
  };

  useEffect(() => () => {
    clearLongPress();
    if (dragFrameRef.current !== null) window.cancelAnimationFrame(dragFrameRef.current);
    if (commitTimerRef.current !== null) window.clearTimeout(commitTimerRef.current);
  }, []);

  return (
    <button
      aria-label={`${meta.name}牌，${choice.displayLabel}，向上划选择，长按查看详情`}
      className={`choice-card choice-card--${choice.deviationClass}${dragging ? " is-dragging" : ""}${armed ? " is-armed" : ""}${committing ? " is-committing" : ""}`}
      data-choice-id={choice.id}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onInspect(choice, event.currentTarget);
        }
      }}
      onPointerCancel={cancel}
      onPointerDown={begin}
      onPointerMove={move}
      onPointerUp={finish}
      ref={cardRef}
      style={{
        "--card-y": "0px",
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
  onCommitVisualStart,
  muted = false,
}: {
  choices: TimelineTurn["choices"];
  rollUsed: boolean;
  onChoose: (id: "A" | "B" | "C") => void;
  onRoll: () => void;
  onCommitVisualStart?: (id: "A" | "B" | "C") => void;
  muted?: boolean;
}) {
  const [detailState, setDetailState] = useState<{ choice: Choice; origin: CardOrigin } | null>(null);
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
    const collectDuration = reducedMotion ? 60 : 180;
    const totalDuration = reducedMotion ? 110 : 460;
    rollTimersRef.current.push(window.setTimeout(() => {
      onRoll();
      setRollPhase("dealing");
    }, collectDuration));
    rollTimersRef.current.push(window.setTimeout(() => setRollPhase("idle"), totalDuration));
  };

  const inspect = (choice: Choice, trigger: HTMLButtonElement) => {
    inspectTriggerRef.current = trigger;
    const rect = trigger.getBoundingClientRect();
    setDetailState({
      choice,
      origin: {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      },
    });
  };

  const closeDetail = () => {
    setDetailState(null);
    window.requestAnimationFrame(() => inspectTriggerRef.current?.focus());
  };

  const beginCommit = (id: "A" | "B" | "C") => {
    if (committingId) return;
    setCommittingId(id);
    onCommitVisualStart?.(id);
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
              onCommitStart={beginCommit}
              onInspect={inspect}
            />
          ))}
        </div>
        <button
          aria-label={rollUsed ? "本节点已经重抽过一次" : "立即重抽三张预生成卡牌"}
          className="choice-roll"
          disabled={rollUsed || rolling}
          onClick={roll}
          title={rollUsed ? "本节点已使用" : "本节点仅一次，无需等待"}
          type="button"
        >
          <span className="choice-roll__label">
            <ArrowsClockwise size={17} weight="bold" />
            <span>{rolling ? "洗牌" : rollUsed ? "已用" : "ROLL"}</span>
          </span>
        </button>
      </div>
      {detailState ? (
        <ChoiceDetail choice={detailState.choice} origin={detailState.origin} onClose={closeDetail} />
      ) : null}
    </>
  );
}
