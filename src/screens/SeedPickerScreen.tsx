import { useMemo, useRef, useState } from "react";
import { IdentificationCard } from "@phosphor-icons/react";
import type { HistorySeed, TravelerProfile } from "../game/types";
import { HistoryCard } from "../components/HistoryCard";
import { browseHistorySeeds } from "../data/historySeeds";

const CARD_STEP = 312;

function moveScroller(element: HTMLElement, left: number) {
  if (typeof element.scrollTo === "function") {
    element.scrollTo({ left, behavior: "smooth" });
  } else {
    element.scrollLeft = left;
  }
}

export function SeedPickerScreen({
  onSelect,
  onChangeProfile,
  profile,
}: {
  onSelect: (seed: HistorySeed) => void;
  onChangeProfile: () => void;
  profile: TravelerProfile;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cards = useMemo(() => browseHistorySeeds(), []);
  const carouselRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const timelineNodes = useRef<Array<HTMLButtonElement | null>>([]);

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

  const focusCard = (index: number) => {
    setActiveIndex(index);
    if (carouselRef.current) moveScroller(carouselRef.current, index * cardStep());
    centerTimelineNode(index);
  };

  const syncFromCards = () => {
    const index = Math.max(0, Math.min(cards.length - 1, Math.round((carouselRef.current?.scrollLeft ?? 0) / cardStep())));
    if (index === activeIndex) return;
    setActiveIndex(index);
    centerTimelineNode(index);
  };

  return (
    <main className="seed-picker">
      <header className="seed-picker__brand">
        <div>
          <span>I！我改变了历史</span>
          <strong>选择你要闯入的瞬间</strong>
        </div>
        <button type="button" onClick={onChangeProfile} aria-label="重设时间人格" title="重设时间人格">
          <IdentificationCard size={19} weight="bold" />
          <span>另一种你 · 已就绪</span>
        </button>
      </header>

      <section className="history-time" aria-label="历史时间轴">
        <div className="history-time__readout">
          <span>公元</span><strong>{cards[activeIndex].year}</strong>
          <div className="history-time__meta">
            <span className="history-time__hint">（滑动可切换不同的历史瞬间）</span>
            <small>{activeIndex + 1} / {cards.length}</small>
          </div>
        </div>
        <nav className="history-time__track" ref={timelineRef} aria-label="五十个历史年份">
          <div className="history-time__line" aria-hidden="true" />
          {cards.map((seed, index) => (
            <button
              key={seed.id}
              ref={(node) => { timelineNodes.current[index] = node; }}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              aria-current={index === activeIndex ? "step" : undefined}
              aria-label={`定位到公元 ${seed.year} 年`}
              onClick={() => focusCard(index)}
            >
              <i />
              <span>{seed.year}</span>
            </button>
          ))}
        </nav>
      </section>

      <div className="history-carousel" ref={carouselRef} onScroll={syncFromCards} aria-label="按时间排列的历史瞬间">
        {cards.map((seed, index) => (
          <div key={seed.id} className={index === activeIndex ? "is-active" : ""} onFocus={() => focusCard(index)}>
            <HistoryCard seed={seed} onSelect={() => onSelect(seed)} />
          </div>
        ))}
      </div>
    </main>
  );
}
