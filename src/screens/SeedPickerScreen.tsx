import { useEffect, useRef, useState } from "react";
import { PencilSimple, Shuffle } from "@phosphor-icons/react";
import type { HistorySeed } from "../game/types";
import { HistoryCard } from "../components/HistoryCard";

const ERA_LABELS: Record<HistorySeed["era"], string> = {
  ancient: "上古",
  medieval: "中世纪",
  "early-modern": "近代早期",
  industrial: "工业时代",
  modern: "现代",
};

export function SeedPickerScreen({
  seeds,
  onShuffle,
  onSelect,
  onCustom,
}: {
  seeds: HistorySeed[];
  onShuffle: () => void;
  onSelect: (seed: HistorySeed) => void;
  onCustom: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => setActiveIndex(0), [seeds]);

  const focusEra = (index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView?.({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <main className="seed-picker">
      <header className="seed-picker__brand">
        <p>历史编辑室 · 第 01 号卷宗</p>
        <h1>哎！我改变了历史</h1>
        <span>历史由你改写</span>
      </header>

      <nav className="era-rail" aria-label="历史时代">
        {seeds.map((seed, index) => (
          <button
            key={seed.id}
            type="button"
            className={activeIndex === index ? "is-active" : ""}
            aria-current={activeIndex === index ? "step" : undefined}
            onClick={() => focusEra(index)}
          >
            <span>{index + 1}</span><small>{ERA_LABELS[seed.era]}</small>
          </button>
        ))}
      </nav>

      <div className="picker-toolbar">
        <div><span>从五个时代抽出</span><h2>选一处历史裂缝</h2></div>
        <button className="icon-button" type="button" onClick={onShuffle} title="换一批历史" aria-label="换一批历史">
          <Shuffle size={24} weight="bold" />
        </button>
      </div>

      <div className="history-carousel" aria-label="历史转折点">
        {seeds.map((seed, index) => (
          <div
            key={seed.id}
            ref={(node) => { cardRefs.current[index] = node; }}
            onFocus={() => setActiveIndex(index)}
          >
            <HistoryCard seed={seed} onSelect={() => onSelect(seed)} />
          </div>
        ))}
      </div>

      <button className="custom-seed-command" type="button" aria-label="自己写一条历史裂缝" onClick={onCustom}>
        <PencilSimple size={24} weight="bold" />
        <span><strong>自己写一条历史裂缝</strong><small>从你指定的真实历史背景开始</small></span>
      </button>
    </main>
  );
}
