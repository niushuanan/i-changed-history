# 加入"随缘抽选已解锁剧本"功能

## 目标

在分组浏览器模式下，提供一个按钮，从所有已解锁剧本组中随机抽选一个未通关剧本，触发旧版的轮盘抽卡动画后直接进入游戏。

## 改动文件

| 文件 | 改动 |
|------|------|
| `src/screens/SeedPickerScreen.tsx` | 添加抽选按钮 + 随机器 + 轮盘动画 |
| `src/components/HistoryWheelDraw.tsx` | 新建：轮盘抽卡动画组件 |
| `src/services/historyPick.ts` | 新建：从已解锁组中随机选未通关剧本 |

## 逻辑

```
触发抽选
  → pickRandomUnfinished(progress, HISTORY_SEEDS)
    → 收集所有 unclockedGroups 中的种子
    → 过滤掉 completedSeeds
    → 从剩余中用 Math.random 随机选一个
  → 播放轮盘动画（复用旧版 9 帧轮转 + 落定）
  → 动画结束 → 调用 onSelect(seed) 进入游戏
```

## 核心函数

```typescript
// src/services/historyPick.ts
import type { HistorySeed } from "../game/types";
import { seedsForHistoryGroup } from "../data/historyGroups";
import { HISTORY_SEEDS } from "../data/historySeeds";

export function pickRandomUnfinished(
  unlockedGroupIds: readonly string[],
  completedSeedIds: readonly string[],
  random: () => number = Math.random,
): HistorySeed | null {
  const pool = HISTORY_SEEDS.filter((seed) => {
    const inUnlockedGroup = unlockedGroupIds.some((gid) => {
      const group = historyGroupById(gid);
      return group && group.seedIds.includes(seed.id);
    });
    const isCompleted = completedSeedIds.includes(seed.id);
    return inUnlockedGroup && !isCompleted;
  });
  if (pool.length === 0) return null;
  const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
  return pool[index];
}
```

## UI 方案

在分组浏览器 header 的 ledger 下方添加一个按钮：

```tsx
<button className="destiny-pick-button" type="button" onClick={startRandomPick}>
  <DiceFive size={20} weight="fill" />
  随缘抽选
</button>
```

点击后：

1. 调用 `pickRandomUnfinished()`，若无可用剧本则提示并返回
2. 进入 `"picking"` 状态，覆盖分组列表，展示轮盘动画（复用旧的轮盘实现）
3. 动画结束后调用 `onSelect(seed)` 进入游戏

## 边界情况

| 情况 | 行为 |
|------|------|
| 所有已解锁剧本都已通关 | 禁用按钮，提示"所有已解锁剧本均已通关" |
| 没有已解锁的组 | 隐藏按钮（仅首次玩家） |
| 仅剩 1 个未通关剧本 | 直接选中，缩短动画帧数到 3 帧 |
| 动画播放中再点按钮 | 忽略，防重复触发 |

## 动画复用

旧版 `SeedPickerScreen.tsx`（main 分支的 draw 函数）的轮盘逻辑可直接提取：

- `DRAW_STEP_COUNT = 9` 帧轮转
- 每帧 `DRAW_STEP_MS = 180ms`
- 落定缓停 `DRAW_SETTLE_MS = 240ms`
- 用 `setTimeout` 链驱动 `previewIndex` 变化

提取到 `HistoryWheelDraw.tsx`，接收 `targetSeedId` 和 `onDone` 回调，返回状态 `{ picking, seed }`。
