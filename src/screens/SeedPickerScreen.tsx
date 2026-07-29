import {
  Archive,
  DiceFive,
  GearSix,
  Megaphone,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HistorySeed } from "../game/types";
import { HistoryCard } from "../components/HistoryCard";
import { HistoryGridCard } from "../components/HistoryGridCard";
import { browseHistorySeeds } from "../data/historySeeds";
import { formatHistoricalYear } from "../data/historicalYear";
import { playCardSound } from "../services/cardAudio";

const HISTORY_CARDS = browseHistorySeeds();
const DRAW_STEPS = 18;
const DRAW_DURATION_MS = 1880;

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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const timelineRef = useRef<HTMLElement | null>(null);
  const timelineNodesRef = useRef<Array<HTMLSpanElement | null>>([]);
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
    const timeline = timelineRef.current;
    const node = timelineNodesRef.current[previewIndex];
    if (!timeline || !node || drawState === "ready") return;
    const left = node.offsetLeft - timeline.clientWidth / 2 + node.clientWidth / 2;
    if (typeof timeline.scrollTo === "function") {
      timeline.scrollTo({
        left,
        behavior: drawState === "drawing" ? "smooth" : "auto",
      });
    } else {
      timeline.scrollLeft = left;
    }
  }, [drawState, previewIndex]);

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
    playCardSound("roll", muted);

    for (let step = 1; step <= DRAW_STEPS; step += 1) {
      const progress = step / DRAW_STEPS;
      const eased = 1 - Math.pow(1 - progress, 2.4);
      const travel = Math.max(HISTORY_CARDS.length + 11, Math.abs(targetIndex - startIndex) + 42);
      const rollingIndex = step === DRAW_STEPS
        ? targetIndex
        : (startIndex + Math.round(travel * eased)) % HISTORY_CARDS.length;
      timersRef.current.push(window.setTimeout(() => {
        setPreviewIndex(rollingIndex);
        if (step !== DRAW_STEPS) return;
        setDrawState("revealed");
        onContextChange({ ...context, activeSeedId: target.id, mode: "draw" });
        playCardSound("deal", muted);
      }, Math.round(duration * progress)));
    }
  };

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
                <span><strong>玩法公告</strong><small>重新查看规则</small></span>
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
            <span>{drawState === "ready" ? "命运尚未显影" : drawState === "drawing" ? "时间正在寻找你" : "你的命运停在"}</span>
            <strong>{drawState === "ready" ? "???? 年" : formatHistoricalYear(previewSeed.year)}</strong>
            <small>已解锁 {unlockedCards.length} / {HISTORY_CARDS.length}</small>
          </section>

          <section className="destiny-timeline" aria-label="命运时间轴">
            <span className="destiny-timeline__axis" aria-hidden="true" />
            <nav ref={timelineRef} aria-label={`随机滚动时间线，共 ${HISTORY_CARDS.length} 个节点`}>
              {HISTORY_CARDS.map((seed, index) => (
                <span
                  key={seed.id}
                  ref={(node) => { timelineNodesRef.current[index] = node; }}
                  className={drawState !== "ready" && index === previewIndex ? "is-active" : ""}
                  aria-current={drawState !== "ready" && index === previewIndex ? "step" : undefined}
                  aria-label={drawState === "revealed" && index === previewIndex
                    ? formatHistoricalYear(seed.year)
                    : "未揭晓历史节点"}
                >
                  <i />
                </span>
              ))}
            </nav>
          </section>

          <section className={`destiny-stage${revealed ? " is-revealed" : ""}`}>
            {revealed ? (
              <HistoryCard
                seed={previewSeed}
                position={previewIndex + 1}
                total={HISTORY_CARDS.length}
                onSelect={() => onSelect(previewSeed)}
              />
            ) : (
              <article className="destiny-card-back" aria-label={drawState === "drawing" ? "命运卡牌正在显影" : "尚未揭晓的命运卡牌"}>
                <div className="destiny-card-back__frame">
                  <img src="/assets/cards/frame-regular-v2.webp" alt="" />
                  <span className="destiny-card-back__seal"><DiceFive size={42} weight="duotone" /></span>
                  <strong>{drawState === "drawing" ? "正在穿过时间" : "命运待定"}</strong>
                  <small>{drawState === "drawing" ? "别眨眼，它就要停下了" : "一百个真实瞬间，只会命中一个"}</small>
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
              <span>{drawState === "drawing" ? "时间疾驰中" : revealed ? "再抽一次命运" : "抽取我的命运"}</span>
            </button>
            <small>{revealed ? "不满意可以重抽；一旦闯入，四次抉择将写完这一生" : "优先抽到尚未解锁的历史"}</small>
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
