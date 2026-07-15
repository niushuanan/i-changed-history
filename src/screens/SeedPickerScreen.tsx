import { FilmStrip, GearSix, SpeakerHigh, SpeakerSlash, SquaresFour } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HistorySeed } from "../game/types";
import { HistoryCard } from "../components/HistoryCard";
import { HistoryGridCard, HISTORY_THEME_LABELS } from "../components/HistoryGridCard";
import {
  EMPTY_FILTERS,
  filterHistorySeeds,
  type HistoryBrowseMode,
  type HistoryFilters,
  type HistoryPeriod,
  type HistoryRegion,
  type HistoryTheme,
} from "../data/historyCatalog";
import { browseHistorySeeds } from "../data/historySeeds";
import { formatHistoricalYear } from "../data/historicalYear";

const CARD_STEP = 312;
const HISTORY_CARDS = browseHistorySeeds();

const PERIOD_LABELS: ReadonlyArray<{ value: HistoryPeriod; label: string }> = [
  { value: "all", label: "全部时间" },
  { value: "bce", label: "公元前" },
  { value: "before-500", label: "公元 1—499 年" },
  { value: "500-1499", label: "公元 500—1499 年" },
  { value: "1500-1899", label: "公元 1500—1899 年" },
  { value: "after-1900", label: "公元 1900 年后" },
];

const REGION_LABELS: ReadonlyArray<{ value: HistoryRegion; label: string }> = [
  { value: "all", label: "全部地域" },
  { value: "china", label: "中国" },
  { value: "world", label: "世界" },
];

const THEME_LABELS: ReadonlyArray<{ value: HistoryTheme; label: string }> = [
  { value: "all", label: "全部属性" },
  ...Object.entries(HISTORY_THEME_LABELS).map(([value, label]) => ({ value: value as HistoryTheme, label })),
];

export type PickerContext = {
  mode: HistoryBrowseMode;
  activeSeedId: string;
  filters: HistoryFilters;
};

export const DEFAULT_PICKER_CONTEXT: PickerContext = {
  mode: "filmstrip",
  activeSeedId: HISTORY_CARDS[0].id,
  filters: EMPTY_FILTERS,
};

type SeedPickerScreenProps = {
  context: PickerContext;
  muted: boolean;
  onContextChange: (context: PickerContext) => void;
  onSelect: (seed: HistorySeed) => void;
  onToggleMute: () => void;
};

function moveScroller(element: HTMLElement, left: number) {
  if (typeof element.scrollTo === "function") {
    element.scrollTo({ left, behavior: "smooth" });
  } else {
    element.scrollLeft = left;
  }
}

function hasFilters(filters: HistoryFilters): boolean {
  return filters.search.trim() !== ""
    || filters.period !== "all"
    || filters.region !== "all"
    || filters.theme !== "all";
}

export function SeedPickerScreen({
  context,
  muted,
  onContextChange,
  onSelect,
  onToggleMute,
}: SeedPickerScreenProps) {
  const cards = HISTORY_CARDS;
  const activeIndex = Math.max(0, cards.findIndex((seed) => seed.id === context.activeSeedId));
  const activeSeed = cards[activeIndex];
  const filteredCards = useMemo(
    () => filterHistorySeeds(cards, context.filters),
    [cards, context.filters],
  );
  const isActiveSeedVisible = filteredCards.some((seed) => seed.id === activeSeed.id);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const timelineNodes = useRef<Array<HTMLButtonElement | null>>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const programmaticCardIndex = useRef<number | null>(null);
  const gestureSyncedIndex = useRef<number | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const cardStep = () => {
    const first = carouselRef.current?.children[0] as HTMLElement | undefined;
    const second = carouselRef.current?.children[1] as HTMLElement | undefined;
    const measured = first && second ? second.offsetLeft - first.offsetLeft : 0;
    return measured > 0 ? measured : CARD_STEP;
  };

  const centerTimelineNode = (index: number) => {
    const timeline = timelineRef.current;
    const node = timelineNodes.current[index];
    if (!timeline || !node) return;
    moveScroller(timeline, node.offsetLeft - timeline.clientWidth / 2 + node.clientWidth / 2);
  };

  const setActiveSeed = (seed: HistorySeed) => {
    if (seed.id === context.activeSeedId) return;
    onContextChange({ ...context, activeSeedId: seed.id });
  };

  const scrollCardsTo = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const targetLeft = index * cardStep();
    if (Math.abs(carousel.scrollLeft - targetLeft) <= 1) {
      programmaticCardIndex.current = null;
      return;
    }
    programmaticCardIndex.current = index;
    moveScroller(carousel, targetLeft);
  };

  const focusCard = (index: number) => {
    const seed = cards[index];
    if (!seed) return;
    scrollCardsTo(index);
    setActiveSeed(seed);
    centerTimelineNode(index);
  };

  const syncFromCards = () => {
    const index = Math.max(0, Math.min(cards.length - 1, Math.round((carouselRef.current?.scrollLeft ?? 0) / cardStep())));
    const targetIndex = programmaticCardIndex.current;
    if (targetIndex !== null) {
      if (index === targetIndex) programmaticCardIndex.current = null;
      return;
    }
    const seed = cards[index];
    if (!seed || seed.id === activeSeed.id) return;
    gestureSyncedIndex.current = index;
    setActiveSeed(seed);
    centerTimelineNode(index);
  };

  const beginCardGesture = () => {
    programmaticCardIndex.current = null;
  };

  const setMode = (mode: HistoryBrowseMode) => {
    if (mode !== context.mode) onContextChange({ ...context, mode });
    settingsTriggerRef.current?.focus();
    setSettingsOpen(false);
  };

  const setFilters = (patch: Partial<HistoryFilters>) => {
    onContextChange({ ...context, filters: { ...context.filters, ...patch } });
  };

  useEffect(() => {
    if (context.mode === "filmstrip") {
      if (gestureSyncedIndex.current === activeIndex) {
        gestureSyncedIndex.current = null;
      } else {
        scrollCardsTo(activeIndex);
      }
      centerTimelineNode(activeIndex);
      return;
    }

    const currentCard = gridRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    if (typeof currentCard?.scrollIntoView === "function") {
      currentCard.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, context.mode, isActiveSeedVisible]);

  useEffect(() => {
    if (!settingsOpen) return undefined;

    settingsRef.current?.querySelector<HTMLButtonElement>('[role^="menuitem"]')?.focus();

    const closeOnPointerDown = (event: PointerEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) setSettingsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      settingsTriggerRef.current?.focus();
      setSettingsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [settingsOpen]);

  const toggleAudio = () => {
    onToggleMute();
    settingsTriggerRef.current?.focus();
    setSettingsOpen(false);
  };

  const moveSettingsFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      window.setTimeout(() => setSettingsOpen(false), 0);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role^="menuitem"]'));
    if (items.length === 0) return;
    event.preventDefault();
    const currentIndex = Math.max(0, items.indexOf(document.activeElement as HTMLButtonElement));
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? items.length - 1
        : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[nextIndex].focus();
  };

  const closeSettingsWhenFocusLeaves = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
    setSettingsOpen(false);
  };

  return (
    <main className={`seed-picker seed-picker--${context.mode}`}>
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
            aria-controls="picker-settings-menu"
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <GearSix size={22} weight="bold" />
          </button>
          {settingsOpen ? (
            <div
              id="picker-settings-menu"
              className="seed-picker__settings-menu"
              role="menu"
              aria-label="首页设置菜单"
              onBlur={closeSettingsWhenFocusLeaves}
              onKeyDown={moveSettingsFocus}
            >
              <span className="seed-picker__settings-kicker">浏览与声音</span>
              <button type="button" role="menuitemradio" tabIndex={-1} aria-checked={context.mode === "filmstrip"} onClick={() => setMode("filmstrip")}>
                <FilmStrip size={20} weight="bold" />
                <span><strong>胶片</strong><small>左右滑动历史</small></span>
              </button>
              <button type="button" role="menuitemradio" tabIndex={-1} aria-checked={context.mode === "grid"} onClick={() => setMode("grid")}>
                <SquaresFour size={20} weight="bold" />
                <span><strong>表格</strong><small>上下浏览全部</small></span>
              </button>
              <button type="button" role="menuitemcheckbox" tabIndex={-1} aria-checked={!muted} onClick={toggleAudio}>
                {muted ? <SpeakerSlash size={20} weight="bold" /> : <SpeakerHigh size={20} weight="bold" />}
                <span><strong>声音</strong><small>{muted ? "已关闭" : "正在播放"}</small></span>
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {context.mode === "filmstrip" ? (
        <>
          <section className="history-time" aria-label="历史时间轴">
            <div className="history-time__readout">
              <strong>{formatHistoricalYear(activeSeed.year)}</strong>
              <div className="history-time__meta">
                <span className="history-time__hint">（滑动可切换不同的历史瞬间）</span>
                <small>{activeIndex + 1} / {cards.length}</small>
              </div>
            </div>
            <span className="history-time__axis" data-testid="history-time-axis" aria-hidden="true" />
            <nav className="history-time__track" ref={timelineRef} aria-label="一百个历史年份">
              {cards.map((seed, index) => (
                <button
                  key={seed.id}
                  ref={(node) => { timelineNodes.current[index] = node; }}
                  type="button"
                  className={index === activeIndex ? "is-active" : ""}
                  aria-current={index === activeIndex ? "step" : undefined}
                  aria-label={`定位到${formatHistoricalYear(seed.year)}`}
                  onClick={() => focusCard(index)}
                >
                  <i />
                  <span>{formatHistoricalYear(seed.year)}</span>
                </button>
              ))}
            </nav>
          </section>

          <div
            className="history-carousel"
            ref={carouselRef}
            onPointerDown={beginCardGesture}
            onTouchStart={beginCardGesture}
            onWheel={beginCardGesture}
            onScroll={syncFromCards}
            aria-label="按时间排列的历史瞬间"
          >
            {cards.map((seed, index) => (
              <div key={seed.id} className={index === activeIndex ? "is-active" : ""} onFocus={() => focusCard(index)}>
                <HistoryCard
                  seed={seed}
                  position={index + 1}
                  total={cards.length}
                  onSelect={() => {
                    onContextChange({ ...context, activeSeedId: seed.id });
                    onSelect(seed);
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <section className="history-grid-browser" aria-label="历史网格浏览">
          <div className="history-grid-browser__controls">
            <input
              type="search"
              aria-label="搜索历史瞬间"
              placeholder="搜索事件、地点或角色"
              value={context.filters.search}
              onChange={(event) => setFilters({ search: event.target.value })}
            />
            <div className="history-grid-browser__filters">
              <label>
                <span>时间</span>
                <select aria-label="时间" value={context.filters.period} onChange={(event) => setFilters({ period: event.target.value as HistoryPeriod })}>
                  {PERIOD_LABELS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label>
                <span>地域</span>
                <select aria-label="地域" value={context.filters.region} onChange={(event) => setFilters({ region: event.target.value as HistoryRegion })}>
                  {REGION_LABELS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label>
                <span>属性</span>
                <select aria-label="属性" value={context.filters.theme} onChange={(event) => setFilters({ theme: event.target.value as HistoryTheme })}>
                  {THEME_LABELS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
            </div>
            <div className="history-grid-browser__summary">
              <strong>{filteredCards.length} 个结果</strong>
              {hasFilters(context.filters) && filteredCards.length > 0 ? (
                <button type="button" onClick={() => onContextChange({ ...context, filters: EMPTY_FILTERS })}>清除筛选</button>
              ) : null}
            </div>
          </div>

          {filteredCards.length > 0 ? (
            <div className="history-grid" ref={gridRef}>
              {filteredCards.map((seed) => (
                <HistoryGridCard
                  key={seed.id}
                  seed={seed}
                  isCurrent={seed.id === context.activeSeedId}
                  onSelect={(selectedSeed) => {
                    onContextChange({ ...context, activeSeedId: selectedSeed.id });
                    onSelect(selectedSeed);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="history-grid-empty">
              <strong>没有符合条件的历史瞬间</strong>
              <button type="button" onClick={() => onContextChange({ ...context, filters: EMPTY_FILTERS })}>清除筛选</button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
