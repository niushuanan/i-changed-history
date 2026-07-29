import {
  Archive,
  ArrowsClockwise,
  DiceFive,
  GearSix,
  Megaphone,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { HistorySeed } from "../game/types";
import { HistoryCard } from "../components/HistoryCard";
import { HistoryGridCard } from "../components/HistoryGridCard";
import { browseHistorySeeds } from "../data/historySeeds";
import { formatHistoricalYear } from "../data/historicalYear";
import { historyAssetForSeed } from "../data/visualAssets";
import { playCardSound, type CardSound } from "../services/cardAudio";

const HISTORY_CARDS = browseHistorySeeds();
const DRAW_STEP_COUNT = 9;
const DRAW_STEP_MS = 180;
const DRAW_SETTLE_MS = 240;

export type PickerContext = {
  mode: "draw" | "archive";
  activeSeedId: string;
};

export const DEFAULT_PICKER_CONTEXT: PickerContext = {
  mode: "draw",
  activeSeedId: HISTORY_CARDS[0].id,
};

type SeedPickerScreenProps = {
  context: PickerContext;
  muted: boolean;
  unlockedSeedIds: readonly string[];
  onContextChange: (context: PickerContext) => void;
  onPlaySound?: (sound: CardSound) => void;
  onSelect: (seed: HistorySeed) => void;
  onShowAnnouncement: () => void;
  onToggleMute: () => void;
};

export function chooseDestinySeed(
  cards: readonly HistorySeed[],
  unlockedSeedIds: readonly string[],
  currentSeedId: string,
  random: () => number = Math.random,
): HistorySeed {
  const unlocked = new Set(unlockedSeedIds);
  const lockedPool = cards.filter((seed) => !unlocked.has(seed.id));
  const primaryPool = lockedPool.length > 0 ? lockedPool : cards;
  const pool = primaryPool.length > 1
    ? primaryPool.filter((seed) => seed.id !== currentSeedId)
    : primaryPool;
  const safePool = pool.length > 0 ? pool : primaryPool;
  const index = Math.min(
    safePool.length - 1,
    Math.max(0, Math.floor(random() * safePool.length)),
  );
  return safePool[index] ?? cards[0];
}

export function SeedPickerScreen({
  context,
  muted,
  unlockedSeedIds,
  onContextChange,
  onPlaySound,
  onSelect,
  onShowAnnouncement,
  onToggleMute,
}: SeedPickerScreenProps) {
  const announcementName = import.meta.env.VITE_INTERACTIVE_SPACE === "true"
    ? "体验说明"
    : "游戏说明";
  const [drawState, setDrawState] = useState<"ready" | "drawing" | "revealed">("ready");
  const [previewIndex, setPreviewIndex] = useState(() => (
    Math.max(0, HISTORY_CARDS.findIndex((seed) => seed.id === context.activeSeedId))
  ));
  const [previousPreviewIndex, setPreviousPreviewIndex] = useState(previewIndex);
  const [nextPreviewIndex, setNextPreviewIndex] = useState(
    (previewIndex + 1) % HISTORY_CARDS.length,
  );
  const [drawTick, setDrawTick] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const settingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const unlockedSet = useMemo(() => new Set(unlockedSeedIds), [unlockedSeedIds]);
  const unlockedCards = useMemo(
    () => HISTORY_CARDS.filter((seed) => unlockedSet.has(seed.id)),
    [unlockedSet],
  );
  const previewSeed = HISTORY_CARDS[previewIndex] ?? HISTORY_CARDS[0];
  const revealed = drawState === "revealed";
  const playSound = (sound: CardSound) => {
    if (onPlaySound) {
      onPlaySound(sound);
      return;
    }
    playCardSound(sound, muted);
  };

  const clearDrawTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => clearDrawTimers, []);

  useEffect(() => {
    if (!settingsOpen) return undefined;
    settingsRef.current?.querySelector<HTMLButtonElement>('[role^="menuitem"]')?.focus();
    const closeOnOutside = (event: PointerEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) setSettingsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSettingsOpen(false);
      settingsTriggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [settingsOpen]);

  const switchMode = (mode: PickerContext["mode"]) => {
    onContextChange({ ...context, mode });
    setSettingsOpen(false);
    settingsTriggerRef.current?.focus();
  };

  const draw = () => {
    if (drawState === "drawing") return;
    clearDrawTimers();
    const target = chooseDestinySeed(
      HISTORY_CARDS,
      unlockedSeedIds,
      revealed ? previewSeed.id : context.activeSeedId,
    );
    const targetIndex = HISTORY_CARDS.findIndex((seed) => seed.id === target.id);
    const startIndex = previewIndex;
    const reducedMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const motionScale = import.meta.env.MODE === "test" || reducedMotion ? 0.01 : 1;
    setDrawState("drawing");
    setPreviousPreviewIndex(startIndex);
    setNextPreviewIndex((startIndex + 1) % HISTORY_CARDS.length);
    setDrawTick(0);
    playSound("page-turn");

    const forwardDistance = HISTORY_CARDS.length
      + ((targetIndex - startIndex + HISTORY_CARDS.length) % HISTORY_CARDS.length);
    const rollingIndices = Array.from({ length: DRAW_STEP_COUNT }, (_, index) => {
      const step = index + 1;
      return step === DRAW_STEP_COUNT
        ? targetIndex
        : (startIndex + Math.round(forwardDistance * step / DRAW_STEP_COUNT))
          % HISTORY_CARDS.length;
    });

    if (typeof window.Image === "function") {
      const preloadIndices = new Set<number>([startIndex, ...rollingIndices]);
      preloadIndices.forEach((index) => {
        const image = new window.Image();
        image.decoding = "async";
        image.src = historyAssetForSeed(seedAt(index));
      });
    }

    let elapsed = 0;
    rollingIndices.forEach((rollingIndex, index) => {
      const step = index + 1;
      const stepDuration = Math.max(1, Math.round(DRAW_STEP_MS * motionScale));
      elapsed += stepDuration;
      timersRef.current.push(window.setTimeout(() => {
        setPreviousPreviewIndex(index === 0 ? startIndex : rollingIndices[index - 1]);
        setPreviewIndex(rollingIndex);
        setNextPreviewIndex(
          rollingIndices[index + 1] ?? ((rollingIndex + 1) % HISTORY_CARDS.length),
        );
        setDrawTick(step);
      }, elapsed));
    });

    timersRef.current.push(window.setTimeout(() => {
        setDrawState("revealed");
        onContextChange({ ...context, activeSeedId: target.id, mode: "draw" });
        playSound("deal");
    }, elapsed + Math.max(8, Math.round(DRAW_SETTLE_MS * motionScale))));
  };

  const seedAt = (index: number) => (
    HISTORY_CARDS[(index + HISTORY_CARDS.length) % HISTORY_CARDS.length] ?? HISTORY_CARDS[0]
  );

  const toggleAudio = () => {
    onToggleMute();
    setSettingsOpen(false);
    settingsTriggerRef.current?.focus();
  };

  const openAnnouncement = () => {
    setSettingsOpen(false);
    onShowAnnouncement();
  };

  return (
    <main className={`seed-picker seed-picker--${context.mode} destiny-picker`} data-draw-state={drawState}>
      <header className="seed-picker__brand">
        <h1 className="seed-picker__wordmark">
          <img src="/assets/brand/history-wordmark.png" alt="哎！我改变了历史？" />
        </h1>
        <small
          className="seed-picker__ai-mark"
          aria-label="本作品包含人工智能生成内容"
        >
          <span aria-hidden="true">AI</span>
          <span aria-hidden="true">生成</span>
        </small>
        <div className="seed-picker__settings" ref={settingsRef}>
          <button
            ref={settingsTriggerRef}
            className="seed-picker__settings-trigger picker-tool"
            type="button"
            aria-label="首页设置"
            aria-haspopup="menu"
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <GearSix size={22} weight="bold" />
          </button>
          {settingsOpen ? (
            <div
              className="seed-picker__settings-menu"
              role="menu"
              aria-label="首页设置菜单"
            >
              <span className="seed-picker__settings-kicker">命运与档案</span>
              <button type="button" role="menuitemradio" tabIndex={-1} aria-checked={context.mode === "draw"} onClick={() => switchMode("draw")}>
                <DiceFive size={20} weight="bold" />
                <span><strong>抽命运</strong><small>随机坠入历史</small></span>
              </button>
              <button type="button" role="menuitemradio" tabIndex={-1} aria-checked={context.mode === "archive"} onClick={() => switchMode("archive")}>
                <Archive size={20} weight="bold" />
                <span><strong>已解锁档案</strong><small>{unlockedCards.length} / {HISTORY_CARDS.length}</small></span>
              </button>
              <button type="button" role="menuitem" tabIndex={-1} onClick={openAnnouncement}>
                <Megaphone size={20} weight="bold" />
                <span><strong>{announcementName}</strong><small>玩法与通关目标</small></span>
              </button>
              <button type="button" role="menuitemcheckbox" tabIndex={-1} aria-checked={!muted} onClick={toggleAudio}>
                {muted ? <SpeakerSlash size={20} weight="bold" /> : <SpeakerHigh size={20} weight="bold" />}
                <span><strong>声音</strong><small>{muted ? "已关闭" : "正在播放"}</small></span>
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {context.mode === "draw" ? (
        <>
          <section className="destiny-readout" aria-live="polite">
            <span>{drawState === "ready" ? `${HISTORY_CARDS.length} 个历史现场，随机抽一个开局` : drawState === "drawing" ? "历史正在你眼前掠过" : "这一次，你来到"}</span>
            <strong>{drawState === "ready" ? "???? 年" : formatHistoricalYear(previewSeed.year)}</strong>
            <small>已解锁 {unlockedCards.length} / {HISTORY_CARDS.length}</small>
          </section>

          <section className={`destiny-stage${revealed ? " is-revealed" : ""}`}>
            {revealed ? (
              <div className="destiny-revealed">
                <HistoryCard
                  seed={previewSeed}
                  position={previewIndex + 1}
                  total={HISTORY_CARDS.length}
                  eager
                  onSelect={() => {
                    playSound("enter-history");
                    onSelect(previewSeed);
                  }}
                />
                <button
                  className="destiny-draw-button destiny-draw-button--secondary"
                  type="button"
                  onClick={draw}
                >
                  <ArrowsClockwise size={19} weight="bold" />
                  <span>换一个开局</span>
                </button>
              </div>
            ) : drawState === "drawing" ? (
              <div
                className="destiny-carousel"
                data-testid="destiny-carousel"
                aria-label={`历史卡牌正在环绕旋转，当前是${previewSeed.eventName}`}
              >
                <div
                  className="destiny-carousel__ring"
                  data-draw-tick={drawTick}
                  data-tick-parity={drawTick % 2}
                  style={{ "--carousel-step-ms": `${DRAW_STEP_MS}ms` } as CSSProperties}
                >
                  {[
                    {
                      slot: drawTick > 0 ? "outgoing" : "previous",
                      index: drawTick > 0
                        ? previousPreviewIndex
                        : (previewIndex - 1 + HISTORY_CARDS.length) % HISTORY_CARDS.length,
                    },
                    { slot: "current", index: previewIndex },
                    { slot: "next", index: nextPreviewIndex },
                  ].map(({ slot, index }) => {
                    const seed = seedAt(index);
                    return (
                      <div
                        className="destiny-carousel__card"
                        data-slot={slot}
                        aria-hidden={slot === "current" ? undefined : true}
                        key={`carousel-${slot}`}
                      >
                        <div className="destiny-carousel__face">
                          <HistoryCard
                            seed={seed}
                            position={index + 1}
                            total={HISTORY_CARDS.length}
                            eager
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <article className="destiny-card-back" aria-label="尚未揭晓的命运卡牌">
                <div className="destiny-card-back__frame">
                  <img src="/assets/cards/frame-regular-v2.webp" alt="" />
                  <span className="destiny-card-back__seal"><DiceFive size={42} weight="duotone" /></span>
                  <strong>历史还没翻开</strong>
                  <small>按下抽取，完整的历史卡会沿着时间一张张旋过</small>
                </div>
              </article>
            )}
          </section>

          {!revealed ? <div className={`destiny-actions destiny-actions--${drawState}`}>
            {drawState === "drawing" ? (
              <span className="destiny-actions__motion" role="status">命运匀速掠过，即将揭晓</span>
            ) : (
              <button
                className="destiny-draw-button destiny-draw-button--primary"
                type="button"
                aria-label="随机抽一个开局"
                onClick={draw}
              >
                <span className="destiny-draw-button__seal" aria-hidden="true">
                  <DiceFive size={24} weight="fill" />
                </span>
                <span className="destiny-draw-button__copy">
                  <small>让命运替你选择</small>
                  <strong>随机抽一个开局</strong>
                </span>
                <span className="destiny-draw-button__chevron" aria-hidden="true" />
              </button>
            )}
            {drawState === "ready" ? <small>会优先抽到你还没通关的历史</small> : null}
          </div> : null}
        </>
      ) : (
        <section className="destiny-archive" aria-label="已解锁历史档案">
          <header>
            <span>你的历史收藏</span>
            <h2>已解锁 {unlockedCards.length} 个瞬间</h2>
            <p>完成四次人生抉择便会永久点亮；点击任意档案，可从第一幕重新游玩。</p>
          </header>
          {unlockedCards.length > 0 ? (
            <div className="history-grid">
              {unlockedCards.map((seed) => (
                <HistoryGridCard
                  key={seed.id}
                  seed={seed}
                  isCurrent={seed.id === context.activeSeedId}
                  onSelect={(selected) => {
                    playSound("enter-history");
                    onContextChange({ ...context, activeSeedId: selected.id });
                    onSelect(selected);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="destiny-archive__empty">
              <Archive size={42} weight="duotone" />
              <strong>档案还没有被点亮</strong>
              <p>先抽一次命运，完整活完那段人生。</p>
              <button type="button" onClick={() => switchMode("draw")}>去抽命运</button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
