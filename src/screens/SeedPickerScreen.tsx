import {
  Archive,
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
import { playCardSound } from "../services/cardAudio";

const HISTORY_CARDS = browseHistorySeeds();
const DRAW_STEPS = 16;
const DRAW_DURATION_MS = 2100;

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
  onSelect,
  onShowAnnouncement,
  onToggleMute,
}: SeedPickerScreenProps) {
  const [drawState, setDrawState] = useState<"ready" | "drawing" | "revealed">("ready");
  const [previewIndex, setPreviewIndex] = useState(() => (
    Math.max(0, HISTORY_CARDS.findIndex((seed) => seed.id === context.activeSeedId))
  ));
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
    const duration = import.meta.env.MODE === "test" || reducedMotion ? 40 : DRAW_DURATION_MS;
    setDrawState("drawing");
    setDrawTick(0);
    playCardSound("roll", muted);

    const totalWeight = Array.from(
      { length: DRAW_STEPS },
      (_, index) => 40 + (index + 1) * 8,
    ).reduce((sum, weight) => sum + weight, 0);
    let elapsedWeight = 0;
    const forwardDistance = HISTORY_CARDS.length
      + ((targetIndex - startIndex + HISTORY_CARDS.length) % HISTORY_CARDS.length);

    for (let step = 1; step <= DRAW_STEPS; step += 1) {
      elapsedWeight += 40 + step * 8;
      const progress = step / DRAW_STEPS;
      const rollingIndex = step === DRAW_STEPS
        ? targetIndex
        : (startIndex + Math.round(forwardDistance * progress)) % HISTORY_CARDS.length;
      timersRef.current.push(window.setTimeout(() => {
        setPreviewIndex(rollingIndex);
        setDrawTick(step);
        if (step !== DRAW_STEPS) return;
        setDrawState("revealed");
        onContextChange({ ...context, activeSeedId: target.id, mode: "draw" });
        playCardSound("deal", muted);
      }, Math.round(duration * elapsedWeight / totalWeight)));
    }
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
                <span><strong>游戏说明</strong><small>玩法与通关目标</small></span>
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
            <span>{drawState === "ready" ? "100 个历史现场，随机抽一个开局" : drawState === "drawing" ? "历史正在你眼前掠过" : "这一次，你来到"}</span>
            <strong>{drawState === "ready" ? "???? 年" : formatHistoricalYear(previewSeed.year)}</strong>
            <small>已解锁 {unlockedCards.length} / {HISTORY_CARDS.length}</small>
          </section>

          <section className={`destiny-stage${revealed ? " is-revealed" : ""}`}>
            {revealed ? (
              <HistoryCard
                seed={previewSeed}
                position={previewIndex + 1}
                total={HISTORY_CARDS.length}
                onSelect={() => onSelect(previewSeed)}
              />
            ) : drawState === "drawing" ? (
              <div
                className="destiny-filmstrip"
                data-testid="destiny-filmstrip"
                aria-label={`正在翻过历史卡牌，当前是${previewSeed.eventName}`}
              >
                <div
                  className="destiny-filmstrip__track"
                  data-draw-tick={drawTick}
                  key={drawTick}
                  style={{ "--draw-step-ms": `${Math.min(240, 72 + drawTick * 10)}ms` } as CSSProperties}
                >
                  {([-1, 0, 1] as const).map((offset) => {
                    const index = (previewIndex + offset + HISTORY_CARDS.length) % HISTORY_CARDS.length;
                    const seed = seedAt(index);
                    return (
                      <div
                        className="destiny-filmstrip__card"
                        data-slot={offset === 0 ? "current" : offset < 0 ? "previous" : "next"}
                        aria-hidden={offset === 0 ? undefined : true}
                        key={`${drawTick}-${seed.id}-${offset}`}
                      >
                        <HistoryCard
                          seed={seed}
                          position={index + 1}
                          total={HISTORY_CARDS.length}
                        />
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
                  <small>按下抽取，完整的历史卡会沿着时间一张张滑过</small>
                </div>
              </article>
            )}
          </section>

          <div className="destiny-actions">
            <button
              className="destiny-draw-button"
              type="button"
              disabled={drawState === "drawing"}
              onClick={draw}
            >
              <DiceFive size={23} weight="fill" />
              <span>{drawState === "drawing" ? "正在抽取" : revealed ? "换一个开局" : "随机抽一个开局"}</span>
            </button>
            <small>{revealed ? "不满意可以再抽；进入后，四次选择写完这一生" : "会优先抽到你还没通关的历史"}</small>
          </div>
        </>
      ) : (
        <section className="destiny-archive" aria-label="已解锁历史档案">
          <header>
            <span>你的历史收藏</span>
            <h2>已解锁 {unlockedCards.length} 个瞬间</h2>
            <p>完整走完四次人生抉择，那个历史节点才会永久点亮。</p>
          </header>
          {unlockedCards.length > 0 ? (
            <div className="history-grid">
              {unlockedCards.map((seed) => (
                <HistoryGridCard
                  key={seed.id}
                  seed={seed}
                  isCurrent={seed.id === context.activeSeedId}
                  onSelect={(selected) => {
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
