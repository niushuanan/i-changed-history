import { useEffect, useRef, useState } from "react";
import { Archive, IdentificationCard, MagnifyingGlass, Shuffle, X } from "@phosphor-icons/react";
import type { HistorySeed, TravelerProfile } from "../game/types";
import { HistoryCard } from "../components/HistoryCard";
import { browseHistorySeeds } from "../data/historySeeds";

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
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveScope, setArchiveScope] = useState<"all" | "china" | "world">("all");
  const [query, setQuery] = useState("");
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const archive = browseHistorySeeds(profile).filter((seed) => {
    if (archiveScope !== "all" && seed.perspective !== archiveScope) return false;
    const normalized = query.trim().toLowerCase();
    return !normalized || `${seed.dateLabel}${seed.eventName}${seed.location}`.toLowerCase().includes(normalized);
  });

  useEffect(() => setActiveIndex(0), [seeds]);

  const focusEra = (index: number) => {
    setActiveIndex(index);
    cardRefs.current[index]?.scrollIntoView?.({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <main className="seed-picker">
      <header className="seed-picker__brand">
        <p>时空入境处 · {profile.name} 的快速入口</p>
        <h1>I！我改变了历史</h1>
        <span>画像影响每一代的优势，但全部 50 个瞬间都可选择</span>
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
            <span>{index + 1}</span><small>公元 {seed.year}</small>
          </button>
        ))}
      </nav>

      <div className="picker-toolbar">
        <div><span>你会成为当时真实的一员</span><h2>选择你的历史瞬间</h2></div>
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

      <button className="archive-command" type="button" onClick={() => setArchiveOpen(true)}>
        <Archive size={22} weight="bold" />
        <span><strong>查看全部 50 个历史瞬间</strong><small>不受职业、能力或风险偏好限制</small></span>
      </button>

      <button className="custom-seed-command" type="button" onClick={onChangeProfile}>
        <IdentificationCard size={24} weight="bold" />
        <span><strong>更换穿越者档案</strong><small>重新匹配职业、能力与风险偏好</small></span>
      </button>

      {archiveOpen && (
        <div className="sheet-backdrop archive-backdrop" role="dialog" aria-modal="true" aria-label="全部历史瞬间">
          <section className="bottom-sheet history-archive">
            <header>
              <div><span>完整历史档案 · 50</span><h2>选择任何一个瞬间</h2></div>
              <button className="icon-button" type="button" onClick={() => setArchiveOpen(false)} aria-label="关闭全部历史瞬间"><X size={22} weight="bold" /></button>
            </header>
            <label className="archive-search"><MagnifyingGlass size={18} /><input aria-label="搜索历史瞬间" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索事件、年份或地点" /></label>
            <div className="archive-scope" aria-label="历史范围">
              {([['all', '全部'], ['china', '中国史'], ['world', '世界史']] as const).map(([value, label]) => <button key={value} type="button" className={archiveScope === value ? "is-active" : ""} onClick={() => setArchiveScope(value)}>{label}</button>)}
            </div>
            <div className="archive-list">
              {archive.map((seed) => (
                <button key={seed.id} type="button" aria-label={`选择历史瞬间：${seed.eventName}`} onClick={() => onSelect(seed)}>
                  <time>{seed.dateLabel}</time><span><strong>{seed.eventName}</strong><small>{seed.location}</small></span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
