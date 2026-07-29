import { CheckCircle, LockKey, SealCheck } from "@phosphor-icons/react";
import type { HistoryGroup } from "../data/historyGroups";
import { seedsForHistoryGroup } from "../data/historyGroups";
import { historyAssetForSeed, VISUAL_ASSETS } from "../data/visualAssets";

type HistoryGroupCardProps = {
  group: HistoryGroup;
  unlocked: boolean;
  available: boolean;
  firstFree: boolean;
  completedCount: number;
  onOpen: (group: HistoryGroup) => void;
};

export function HistoryGroupCard({
  group,
  unlocked,
  available,
  firstFree,
  completedCount,
  onOpen,
}: HistoryGroupCardProps) {
  const seeds = seedsForHistoryGroup(group);
  const total = seeds.length;
  const complete = completedCount === total;
  const actionLabel = unlocked
    ? `打开剧本组：${group.name}`
    : firstFree
      ? `免费解锁剧本组：${group.name}`
      : available
        ? `消耗 1 枚代币解锁剧本组：${group.name}`
        : `剧本组尚未解锁：${group.name}`;

  return (
    <button
      type="button"
      className={`history-group-card${unlocked ? " is-unlocked" : " is-locked"}${available ? " is-available" : ""}${complete ? " is-complete" : ""}`}
      aria-label={actionLabel}
      disabled={!unlocked && !available}
      onClick={() => onOpen(group)}
    >
      <span className="history-group-card__montage" aria-hidden="true">
        {seeds.slice(0, 3).map((seed) => (
          <img
            key={seed.id}
            src={historyAssetForSeed(seed)}
            alt=""
            loading="lazy"
            onError={(event) => { event.currentTarget.src = VISUAL_ASSETS[seed.visualTone]; }}
          />
        ))}
        <i className="history-group-card__state">
          {complete
            ? <SealCheck size={22} weight="fill" />
            : unlocked
              ? <CheckCircle size={22} weight="duotone" />
              : <LockKey size={21} weight="duotone" />}
        </i>
      </span>
      <span className="history-group-card__copy">
        <small>{group.region === "china" ? "中国史" : "世界史"} · {group.period}</small>
        <strong>{group.name}</strong>
        <span>{group.description}</span>
        <i className="history-group-card__progress" aria-hidden="true">
          <b style={{ width: `${total === 0 ? 0 : Math.round(completedCount / total * 100)}%` }} />
        </i>
        <em>{completedCount} / {total} 已通关</em>
      </span>
      <span className="history-group-card__action" aria-hidden="true">
        {unlocked
          ? complete ? "全组完成 · 重返档案" : "翻开这组"
          : firstFree
            ? "免费选为起点"
            : available
              ? "用 1 枚代币解锁"
              : "还需 1 枚代币"}
      </span>
    </button>
  );
}
