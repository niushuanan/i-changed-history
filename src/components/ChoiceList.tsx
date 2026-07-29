import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowsClockwise, CaretUp, X } from "@phosphor-icons/react";
import { createPortal } from "react-dom";
import type { TimelineTurn } from "../game/schema";
import { playCardSound, type CardSound } from "../services/cardAudio";
import { CardCommitFlight, type CardCommitOrigin } from "./CardCommitFlight";
import { ChoiceCardFace } from "./ChoiceCardFace";

type Choice = TimelineTurn["choices"][number];
type CardOrigin = {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};
type DragLiftOrigin = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const SWIPE_THRESHOLD = 48;
const LONG_PRESS_MS = 320;
const PREPARED_ROLL_RITUAL_MS = 1200;
const LIVE_ROLL_START_MS = 360;

const CARD_META = {
  nudge: {
    name: "循史",
    description: "让眼前结果照常发生",
    icon: "/assets/cards/choice-regular.png",
    frame: "/assets/cards/frame-regular-v2.webp",
    accent: "#d5b56f",
  },
  reform: {
    name: "破局",
    description: "当场扭转眼前结果",
    icon: "/assets/cards/choice-radical.png",
    frame: "/assets/cards/frame-radical-v2.webp",
    accent: "#e25a45",
  },
  rupture: {
    name: "天外",
    description: "让现实换套规则",
    icon: "/assets/cards/choice-surreal.png",
    frame: "/assets/cards/frame-surreal-v2.webp",
    accent: "#72c5be",
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

  const detail = (
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
        <div
          aria-label="完整决定与执行结果"
          className="choice-detail__scroll"
          role="region"
          tabIndex={0}
        >
          <p className="choice-detail__canon">{choice.label}</p>
          <dl>
            <div><dt>谁来做</dt><dd>{choice.actionSpec.actor}</dd></div>
            <div><dt>作用于</dt><dd>{choice.actionSpec.target}</dd></div>
            <div><dt>最后期限</dt><dd>{choice.actionSpec.deadline}</dd></div>
            <div className="is-result"><dt>直接结果</dt><dd>{choice.instantEcho.directResult}</dd></div>
            <div className="is-cost"><dt>隐藏代价</dt><dd>{choice.instantEcho.unexpectedCost}</dd></div>
          </dl>
        </div>
        <small className="choice-detail__footer">
          <CaretUp size={14} weight="bold" /> 关闭后向上划出这张牌，即写入你的时间线
        </small>
      </section>
    </div>
  );
  const eventScreen = typeof document === "undefined"
    ? null
    : document.querySelector(".event-screen");
  return eventScreen ? createPortal(detail, eventScreen) : detail;
}

function ChoiceCard({
  choice,
  onChoose,
  onCommitStart,
  onHoldChange,
  onInspect,
  onPlaySound,
  dealIndex,
  disabled,
}: {
  choice: Choice;
  onChoose: (id: "A" | "B" | "C") => void;
  onCommitStart: (id: "A" | "B" | "C") => void;
  onHoldChange: (id: "A" | "B" | "C" | null) => void;
  onInspect: (choice: Choice, trigger: HTMLButtonElement) => void;
  onPlaySound: (sound: CardSound) => void;
  dealIndex: number;
  disabled: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [armed, setArmed] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [commitOrigin, setCommitOrigin] = useState<CardCommitOrigin | null>(null);
  const [dragLiftOrigin, setDragLiftOrigin] = useState<DragLiftOrigin | null>(null);
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const dragLiftRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef(0);
  const draggingRef = useRef(false);
  const offsetYRef = useRef(0);
  const dragFrameRef = useRef<number | null>(null);
  const pendingOffsetRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const longPressRef = useRef<number | null>(null);
  const inspectedRef = useRef(false);
  const committedRef = useRef(false);
  const meta = CARD_META[choice.deviationClass];

  const setHoldActive = (active: boolean) => {
    setPressing(active);
    onHoldChange(active ? choice.id : null);
  };

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
      dragLiftRef.current?.style.setProperty("--card-y", `${pendingOffsetRef.current}px`);
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
    setDragLiftOrigin(null);
    setHoldActive(false);
    setArmed(false);
    writeCardOffset(0);
  };

  const begin = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (committing || disabled) return;
    inspectedRef.current = false;
    committedRef.current = false;
    pointerIdRef.current = event.pointerId;
    startYRef.current = event.clientY;
    const cardRect = event.currentTarget.getBoundingClientRect();
    setDragLiftOrigin({
      left: cardRect.left,
      top: cardRect.top,
      width: cardRect.width,
      height: cardRect.height,
    });
    draggingRef.current = true;
    writeCardOffset(0);
    setArmed(false);
    setDragging(false);
    setHoldActive(true);
    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const trigger = event.currentTarget;
    longPressRef.current = window.setTimeout(() => {
      inspectedRef.current = true;
      draggingRef.current = false;
      setDragging(false);
      setDragLiftOrigin(null);
      setHoldActive(false);
      setArmed(false);
      writeCardOffset(0);
      releasePointer(trigger);
      onPlaySound("inspect");
      onInspect(choice, trigger);
    }, LONG_PRESS_MS);
  };

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current || inspectedRef.current) return;
    const next = Math.min(14, event.clientY - startYRef.current);
    if (Math.abs(next) > 8) {
      clearLongPress();
      setHoldActive(false);
      setDragging(true);
    }
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
    setDragLiftOrigin(null);
    setHoldActive(false);
    if (offsetYRef.current <= -SWIPE_THRESHOLD) {
      committedRef.current = true;
      const cardRect = event.currentTarget.getBoundingClientRect();
      const eventScreen = event.currentTarget.closest<HTMLElement>(".event-screen");
      const screenRect = eventScreen?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setCommitOrigin({
        left: cardRect.left,
        top: cardRect.top,
        width: cardRect.width,
        height: cardRect.height,
        screenLeft: screenRect.left,
        screenTop: screenRect.top,
        screenWidth: screenRect.width,
        screenHeight: screenRect.height,
      });
      setCommitting(true);
      setArmed(false);
      onCommitStart(choice.id);
      onPlaySound(
        choice.deviationClass === "nudge"
          ? "swipe-regular"
          : choice.deviationClass === "reform"
            ? "swipe-radical"
            : "swipe-surreal",
      );
      return;
    }
    resetGesture();
  };

  const completeCommit = useCallback(() => {
    onChoose(choice.id);
  }, [choice.id, onChoose]);

  const prefersReducedMotion = typeof window !== "undefined"
    && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cancel = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (committedRef.current) return;
    resetGesture(event.currentTarget);
  };

  useEffect(() => () => {
    clearLongPress();
    if (dragFrameRef.current !== null) window.cancelAnimationFrame(dragFrameRef.current);
  }, []);

  return (
    <>
      <button
        aria-label={`${meta.name}牌，${choice.displayLabel}，向上划选择，长按查看详情`}
        className={`choice-card choice-card--${choice.deviationClass}${pressing ? " is-pressing" : ""}${dragging ? " is-dragging" : ""}${armed ? " is-armed" : ""}${committing ? " is-committing" : ""}`}
        data-choice-id={choice.id}
        disabled={disabled}
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
        <ChoiceCardFace
          description={meta.description}
          displayLabel={choice.displayLabel}
          frame={meta.frame}
          icon={meta.icon}
          showHoldCue
          tier={meta.name}
        />
      </button>
      {committing && commitOrigin ? (
        <CardCommitFlight
          accent={meta.accent}
          description={meta.description}
          deviationClass={choice.deviationClass}
          displayLabel={choice.displayLabel}
          frame={meta.frame}
          icon={meta.icon}
          onComplete={completeCommit}
          origin={commitOrigin}
          reducedMotion={prefersReducedMotion}
          startRotation={choice.id === "A" ? -3.4 : choice.id === "C" ? 3.4 : 0}
          tier={meta.name}
        />
      ) : null}
      {dragging && dragLiftOrigin && typeof document !== "undefined" ? createPortal(
        <div className="card-drag-layer" aria-hidden="true">
          <div
            className={`choice-card card-drag-lift choice-card--${choice.deviationClass}${armed ? " is-armed" : ""}`}
            ref={dragLiftRef}
            style={{
              "--card-y": `${offsetYRef.current}px`,
              "--card-accent": meta.accent,
              "--card-glow": `${meta.accent}55`,
              "--card-frame": `url("${meta.frame}")`,
              left: `${dragLiftOrigin.left}px`,
              top: `${dragLiftOrigin.top}px`,
              width: `${dragLiftOrigin.width}px`,
              height: `${dragLiftOrigin.height}px`,
            } as React.CSSProperties}
          >
            <ChoiceCardFace
              description={meta.description}
              displayLabel={choice.displayLabel}
              frame={meta.frame}
              icon={meta.icon}
              tier={meta.name}
            />
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}

export function ChoiceList({
  choices,
  rollCount = 0,
  rollLoading = false,
  rollError,
  onChoose,
  onRoll,
  onCommitVisualStart,
  onPlaySound,
  muted = false,
}: {
  choices: TimelineTurn["choices"];
  rollCount?: number;
  rollLoading?: boolean;
  rollError?: string | null;
  onChoose: (id: "A" | "B" | "C") => void;
  onRoll: () => void;
  onCommitVisualStart?: (id: "A" | "B" | "C") => void;
  onPlaySound?: (sound: CardSound) => void;
  muted?: boolean;
}) {
  const [detailState, setDetailState] = useState<{ choice: Choice; origin: CardOrigin } | null>(null);
  const [rollPhase, setRollPhase] = useState<"idle" | "collecting" | "waiting" | "dealing">("idle");
  const [committingId, setCommittingId] = useState<"A" | "B" | "C" | null>(null);
  const [holdingId, setHoldingId] = useState<"A" | "B" | "C" | null>(null);
  const rollTimersRef = useRef<number[]>([]);
  const previousRollCountRef = useRef(rollCount);
  const inspectTriggerRef = useRef<HTMLButtonElement | null>(null);
  const rolling = rollPhase !== "idle" || rollLoading;
  const remainingRolls = Math.max(0, 3 - rollCount);
  const playSound = useCallback((sound: CardSound) => {
    if (onPlaySound) {
      onPlaySound(sound);
      return;
    }
    playCardSound(sound, muted);
  }, [muted, onPlaySound]);

  useEffect(() => {
    playSound("deal");
  }, [choices, playSound]);

  useEffect(() => {
    const previous = previousRollCountRef.current;
    previousRollCountRef.current = rollCount;
    if (rollCount <= previous || rollPhase !== "waiting") return;
    setRollPhase("dealing");
    const reducedMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rollTimersRef.current.push(window.setTimeout(
      () => setRollPhase("idle"),
      reducedMotion ? 80 : 360,
    ));
  }, [rollCount, rollPhase]);

  useEffect(() => {
    if (!rollError || rollPhase !== "waiting") return;
    setRollPhase("idle");
  }, [rollError, rollPhase]);

  useEffect(() => () => {
    rollTimersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const roll = () => {
    if (remainingRolls === 0 || rolling) return;
    setRollPhase("collecting");
    playSound("roll");
    const reducedMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const collectDuration = reducedMotion
      ? 160
      : rollCount === 0
        ? PREPARED_ROLL_RITUAL_MS
        : LIVE_ROLL_START_MS;
    rollTimersRef.current.push(window.setTimeout(() => {
      onRoll();
      setRollPhase("waiting");
    }, collectDuration));
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
        className={`rogue-choice-table${rollPhase === "collecting" ? " is-collecting" : ""}${rollPhase === "waiting" ? " is-waiting" : ""}${rollPhase === "dealing" ? " is-dealing" : ""}${committingId ? " is-committing" : ""}${holdingId ? " is-holding" : ""}`}
        data-committing-choice={committingId ?? undefined}
        data-holding-choice={holdingId ?? undefined}
      >
        <div className="choice-list" aria-label="三张历史选择卡牌">
          {choices.map((choice, index) => (
            <ChoiceCard
              choice={choice}
              dealIndex={index}
              disabled={rolling}
              key={`${rollCount}-${choice.id}-${choice.displayLabel}`}
              onChoose={onChoose}
              onCommitStart={beginCommit}
              onHoldChange={setHoldingId}
              onInspect={inspect}
              onPlaySound={playSound}
            />
          ))}
        </div>
        <button
          aria-label={remainingRolls === 0
            ? "本节点三次重抽已经用完"
            : rolling
              ? "正在洗牌"
              : `重抽卡牌，还剩 ${remainingRolls} 次`}
          className="choice-roll"
          disabled={remainingRolls === 0 || rolling}
          onClick={roll}
          title={remainingRolls === 0 ? "本节点已用完" : `本节点还可重抽 ${remainingRolls} 次`}
          type="button"
        >
          <span className="choice-roll__label">
            <ArrowsClockwise size={17} weight="bold" />
            <span>{rolling ? "洗牌中" : remainingRolls === 0 ? "已用完" : `ROLL · ${remainingRolls}`}</span>
          </span>
        </button>
        {rolling ? <small className="choice-roll__status" role="status">正在为这一刻换一手牌…</small> : null}
        {rollError && !rolling ? <small className="choice-roll__error" role="status">{rollError}</small> : null}
      </div>
      {detailState ? (
        <ChoiceDetail choice={detailState.choice} origin={detailState.origin} onClose={closeDetail} />
      ) : null}
    </>
  );
}
