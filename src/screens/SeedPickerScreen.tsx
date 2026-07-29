import {
  ArrowLeft,
  Coins,
  GearSix,
  Megaphone,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { HistoryGridCard } from "../components/HistoryGridCard";
import { HistoryGroupCard } from "../components/HistoryGroupCard";
import {
  HISTORY_GROUPS,
  historyGroupById,
  seedsForHistoryGroup,
  type HistoryGroup,
} from "../data/historyGroups";
import { HISTORY_SEEDS } from "../data/historySeeds";
import type { HistorySeed } from "../game/types";
import { playCardSound, type CardSound } from "../services/cardAudio";

export type PickerContext = {
  mode: "groups" | "seeds";
  activeGroupId: string | null;
  activeSeedId: string;
};

export const DEFAULT_PICKER_CONTEXT: PickerContext = {
  mode: "groups",
  activeGroupId: null,
  activeSeedId: HISTORY_SEEDS[0].id,
};

type SeedPickerScreenProps = {
  context: PickerContext;
  muted: boolean;
  unlockedGroupIds: readonly string[];
  completedSeedIds: readonly string[];
  tokens: number;
  onContextChange: (context: PickerContext) => void;
  onPlaySound?: (sound: CardSound) => void;
  onSelect: (seed: HistorySeed) => void;
  onUnlockGroup: (groupId: string) => boolean;
  onShowAnnouncement: () => void;
  onToggleMute: () => void;
};

export function SeedPickerScreen({
  context,
  muted,
  unlockedGroupIds,
  completedSeedIds,
  tokens,
  onContextChange,
  onPlaySound,
  onSelect,
  onUnlockGroup,
  onShowAnnouncement,
  onToggleMute,
}: SeedPickerScreenProps) {
  const announcementName = import.meta.env.VITE_INTERACTIVE_SPACE === "true"
    ? "体验说明"
    : "游戏说明";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const settingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const unlockedSet = useMemo(() => new Set(unlockedGroupIds), [unlockedGroupIds]);
  const completedSet = useMemo(() => new Set(completedSeedIds), [completedSeedIds]);
  const activeGroup = context.activeGroupId
    ? historyGroupById(context.activeGroupId)
    : undefined;
  const canShowActiveGroup = Boolean(
    context.mode === "seeds"
    && activeGroup
    && unlockedSet.has(activeGroup.id),
  );
  const activeSeeds = activeGroup && canShowActiveGroup
    ? seedsForHistoryGroup(activeGroup)
    : [];
  const firstGroupIsFree = unlockedGroupIds.length === 0;

  const playSound = (sound: CardSound) => {
    if (onPlaySound) {
      onPlaySound(sound);
      return;
    }
    playCardSound(sound, muted);
  };

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

  const openGroup = (group: HistoryGroup) => {
    const alreadyUnlocked = unlockedSet.has(group.id);
    if (!alreadyUnlocked && !onUnlockGroup(group.id)) return;
    if (!alreadyUnlocked) {
      setRecentlyUnlocked(group.name);
      playSound("deal");
    } else {
      playSound("page-turn");
    }
    onContextChange({
      mode: "seeds",
      activeGroupId: group.id,
      activeSeedId: group.seedIds[0] ?? context.activeSeedId,
    });
  };

  const returnToGroups = () => {
    playSound("page-turn");
    onContextChange({ ...context, mode: "groups", activeGroupId: null });
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
    <main className={`seed-picker group-picker seed-picker--${canShowActiveGroup ? "group-detail" : "groups"}`}>
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
              <span className="seed-picker__settings-kicker">玩法与声音</span>
              <button type="button" role="menuitem" tabIndex={-1} onClick={openAnnouncement}>
                <Megaphone size={20} weight="bold" />
                <span><strong>{announcementName}</strong><small>选组、四次抉择与解锁</small></span>
              </button>
              <button type="button" role="menuitemcheckbox" tabIndex={-1} aria-checked={!muted} onClick={toggleAudio}>
                {muted ? <SpeakerSlash size={20} weight="bold" /> : <SpeakerHigh size={20} weight="bold" />}
                <span><strong>声音</strong><small>{muted ? "已关闭" : "正在播放"}</small></span>
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {canShowActiveGroup && activeGroup ? (
        <section className="history-group-detail" aria-label={`${activeGroup.name}剧本组`}>
          <header className="history-group-detail__header">
            <button type="button" onClick={returnToGroups}>
              <ArrowLeft size={18} weight="bold" />
              返回剧本组
            </button>
            <span>{activeGroup.region === "china" ? "中国史" : "世界史"} · {activeGroup.period}</span>
            <h2>{activeGroup.name}</h2>
            <p>{activeGroup.description}。选择一个真实转折点，进入固定第一幕。</p>
            <div>
              <strong>{activeSeeds.filter((seed) => completedSet.has(seed.id)).length} / {activeSeeds.length} 已通关</strong>
              <small><Coins size={15} weight="fill" /> 解锁代币 {tokens}</small>
            </div>
          </header>
          {recentlyUnlocked === activeGroup.name ? (
            <p className="history-group-unlocked-notice" role="status">
              《{activeGroup.name}》已经解锁，选一个现场开始。
            </p>
          ) : null}
          <div className="history-grid history-group-detail__grid">
            {activeSeeds.map((seed) => (
              <HistoryGridCard
                key={seed.id}
                seed={seed}
                isCurrent={seed.id === context.activeSeedId}
                completed={completedSet.has(seed.id)}
                onSelect={(selected) => {
                  playSound("enter-history");
                  onContextChange({ ...context, activeSeedId: selected.id });
                  onSelect(selected);
                }}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="history-group-browser" aria-label="历史剧本组">
          <header className="history-group-browser__intro">
            <span>100 个真实转折点 · 13 个剧本组</span>
            <h2>{firstGroupIsFree ? "先选一段你熟悉的历史" : "下一段历史，由你决定"}</h2>
            <p>{firstGroupIsFree
              ? "首组选定不花代币。通关任意一个剧本，就能解锁下一组。"
              : "翻开已解锁卷宗继续游玩，或用通关获得的代币打开新组。"}</p>
            <div className="history-group-browser__ledger">
              <span><small>已开剧本组</small><strong>{unlockedGroupIds.length} / {HISTORY_GROUPS.length}</strong></span>
              <span><small>{firstGroupIsFree ? "首组权益" : "解锁代币"}</small><strong>{firstGroupIsFree ? "免费" : tokens}</strong></span>
              <span><small>已通关剧本</small><strong>{completedSeedIds.length} / {HISTORY_SEEDS.length}</strong></span>
            </div>
          </header>
          {(["china", "world"] as const).map((region) => (
            <section className="history-group-browser__region" key={region}>
              <header>
                <span>{region === "china" ? "CHINA" : "WORLD"}</span>
                <h3>{region === "china" ? "中国史九组" : "世界史四组"}</h3>
              </header>
              <div className="history-group-list">
                {HISTORY_GROUPS.filter((group) => group.region === region).map((group) => {
                  const unlocked = unlockedSet.has(group.id);
                  const available = !unlocked && (firstGroupIsFree || tokens > 0);
                  const completedCount = group.seedIds.filter((seedId) => completedSet.has(seedId)).length;
                  return (
                    <HistoryGroupCard
                      key={group.id}
                      group={group}
                      unlocked={unlocked}
                      available={available}
                      firstFree={firstGroupIsFree}
                      completedCount={completedCount}
                      onOpen={openGroup}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </section>
      )}
    </main>
  );
}
