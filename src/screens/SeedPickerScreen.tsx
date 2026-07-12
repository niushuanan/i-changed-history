import { useEffect, useMemo, useRef, useState } from "react";
import { Archive, IdentificationCard, Shuffle } from "@phosphor-icons/react";
import type { HistorySeed, TravelerProfile } from "../game/types";
import { HistoryCard } from "../components/HistoryCard";
import { browseHistorySeeds } from "../data/historySeeds";
import { getTravelerAbility } from "../game/profile";

export function SeedPickerScreen({
  seeds,
  onShuffle,
  onSelect,
  onChangeProfile,
  profile,
}: {
  seeds: HistorySeed[];
  onShuffle: () => void;
  onSelect: (seed: HistorySeed) => void;
  onChangeProfile: () => void;
  profile: TravelerProfile;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const allSeeds = useMemo(() => browseHistorySeeds(profile), [profile]);
  const displaySeeds = showAll ? allSeeds : seeds;
  const ability = getTravelerAbility(profile);

  useEffect(() => {
    setActiveIndex(0);
    cardRefs.current[0]?.scrollIntoView?.({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [displaySeeds]);

  const focusCard = (index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView?.({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <main className="seed-picker">
      <header className="seed-picker__brand">
        <p>{profile.name} · 画像能力「{ability.title}」</p>
        <h1>I！我改变了历史</h1>
        <span>{ability.action}</span>
      </header>

      {!showAll ? (
        <nav className="era-rail" aria-label="精选历史瞬间">
          {displaySeeds.map((seed, index) => (
            <button key={seed.id} type="button" className={activeIndex === index ? "is-active" : ""} aria-current={activeIndex === index ? "step" : undefined} onClick={() => focusCard(index)}>
              <span>{index + 1}</span><small>公元 {seed.year}</small>
            </button>
          ))}
        </nav>
      ) : (
        <div className="archive-inline-bar"><span>完整档案 · 50</span><strong>左右滑动，选择任何历史瞬间</strong></div>
      )}

      <div className="picker-toolbar">
        <div><span>{showAll ? `第 ${activeIndex + 1} / 50 张` : "为你的画像精选"}</span><h2>{showAll ? "全部历史瞬间" : "选择你的历史瞬间"}</h2></div>
        {!showAll && <button className="icon-button" type="button" onClick={onShuffle} title="换一批历史" aria-label="换一批历史"><Shuffle size={24} weight="bold" /></button>}
      </div>

      <div className="history-carousel" aria-label="历史转折点">
        {displaySeeds.map((seed, index) => (
          <div key={seed.id} ref={(node) => { cardRefs.current[index] = node; }} onFocus={() => setActiveIndex(index)}>
            <HistoryCard seed={seed} onSelect={() => onSelect(seed)} />
          </div>
        ))}
      </div>

      <button className="archive-command" type="button" onClick={() => setShowAll((current) => !current)}>
        <Archive size={22} weight="bold" />
        <span><strong>{showAll ? "收回精选五张" : "展开全部 50 个历史瞬间"}</strong><small>保持同一套左右滑动档案卡</small></span>
      </button>

      <button className="custom-seed-command" type="button" onClick={onChangeProfile}>
        <IdentificationCard size={24} weight="bold" />
        <span><strong>重设画像能力</strong><small>改变专属预判方式与推荐入口</small></span>
      </button>
    </main>
  );
}
