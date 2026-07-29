# 剧本组解锁玩法设计

## 设计目标

给玩家一个渐进式的成长线索。100 枚种子铺开摆在玩家面前缺乏引导，通过"分组 → 锁定 → 通关解锁"的循环，让玩家每次进入游戏都有一个清晰的目标，同时保持选组的自由。

## 为什么需要这个机制

目前的痛点：100 个剧本全部开放，玩家随机选一个游玩，很容易 roll 到自己不感兴趣或不了解的历史时期（比如对中国玩家来说，文艺复兴的种子认知门槛就很高），导致缺乏引导的迷茫。

剧本组解锁机制的核心思路是让玩家先限定一个自己感兴趣的时期，再从中选剧本。起点自选、解锁方向自选——把"在 100 个里瞎选"变成"在我感兴趣的组里挑一个"，大幅降低决策成本和踩雷概率。

同时，每次打通一局获得代币、解锁新组，也给玩家一条渐进的目标链：先打通眼前这局，再拿到代币解锁下一组感兴趣的剧本。

## 核心循环

整个机制只需要两个变量：**已通关的种子清单**和**当前持有的代币数**。

新玩家进入游戏时所有组锁定，免费任选一组作为起点。选组后在组内选种子正常游玩。每完成一局（无论死活结局），就会获得 1 个"解锁代币"。消耗 1 个代币可以解锁任意一个未打开的组。已通关的种子可以重玩但不重复给币。

游戏总共 13 组，起点免费，剩下 12 组各需 1 个代币。也就是说玩家至少需要打通 12 个剧本才能解锁全部内容——对轻度玩家来说是一个合理的中期目标。

存档直接用 localStorage，不做后端。进度跨会话保留，换了浏览器就没了，这对 MVP 足够。

## 爽点在哪儿

这个机制给玩家的正向反馈有三个层次：**打通一个剧本的瞬间**获得代币（即时奖励）、**解锁一个新组**时获得的新内容（中期奖励）、**回头看一组全通"的进度感（长期积累）。三个层次叠加，让每次操作都有反馈。

## 剧本组划分

共 13 个剧本组（9 中国 + 4 世界），每组 3–10 枚种子。

### 中国史（9 组）

| # | 剧本组 | 枚数 | 种子 ID |
|---|--------|------|---------|
| 1 | 先秦 | 3 | east-zhou-770bc, shang-yang-356bc, changping-260bc |
| 2 | 秦汉 | 8 | qin-unification-221bc, daze-uprising-209bc, han-founded-202bc, zhang-qian-138bc, mobei-119bc, wang-mang-9, kunyang-25, yellow-turban-184 |
| 3 | 三国 | 8 | dong-zhuo-lu-bu-190, red-cliffs-208, guandu-wuchao-200, yiling-222, jieting-228, gaoping-tombs-249, shu-fall-263, jin-unification-280 |
| 4 | 两晋南北朝 | 3 | feishui-383, northern-wei-439, xiaowen-luoyang-494 |
| 5 | 隋唐 | 8 | grand-canal-605, sui-unification-589, tang-founded-618, xuanwu-gate-626, wu-zetian-690, an-lushan-755, mawei-756, tang-fall-907 |
| 6 | 宋辽金 | 9 | chen-bridge-960, chanyuan-1004, jin-founded-1115, wang-anshi-1069, jingkang-1127, yue-fei-1140, diaoyu-1259, xiangyang-1273, yamen-1279 |
| 7 | 元明 | 8 | yuan-name-1271, poyang-1363, ming-founded-1368, jingnan-nanjing-1402, zheng-he-1405, beijing-capital-1421, tumu-crisis-1449, longqing-trade-1567 |
| 8 | 明清之际 | 6 | tiangong-kaiwu-1637, ningyuan-1626, shanhai-pass-1644, koxinga-1661, kangxi-aobai-1669, nerchinsk-1689 |
| 9 | 近现代 | 5 | macartney-1793, humen-1839, hundred-days-1898, wuchang-1911, may-fourth-1919 |

### 世界史（4 组）

| # | 剧本组 | 枚数 | 种子 ID |
|---|--------|------|---------|
| 10 | 古代世界 | 10 | marathon-490bc, alexander-gaugamela-331bc, great-fire-rome-64, caesar-rubicon-49bc, edict-milan-313, fall-rome-476, charlemagne-800, magna-carta-1215, black-death-1347, constantinople-1453 |
| 11 | 大航海与启蒙 | 10 | gutenberg-bible-1455, columbus-1492, circumnavigation-1522, luther-1517, galileo-1610, newton-principia-1687, watt-patent-1769, jenner-vaccine-1796, origin-species-1859, declaration-1776 |
| 12 | 近代变革 | 10 | bastille-1789, waterloo-1815, lincoln-emancipation-1862, meiji-1868, wright-flight-1903, sarajevo-1914, october-revolution-1917, roosevelt-bank-holiday-1933, hitler-poland-1939, stalin-moscow-1941 |
| 13 | 冷战与当代 | 10 | normandy-1944, un-charter-1945, india-independence-1947, suez-nationalization-1956, cuban-missile-1962, berlin-wall-1989, apollo-11-1969, oil-crisis-1973, chernobyl-1986, soviet-dissolution-1991 |

> **余量种子**：sputnik-1957, web-public-domain-1993 当前未分配到组，可在后续扩充中纳入冷战与当代组或新增数码时代组。现有的 100 枚种子中 98 枚已分配。

## 数据模型

客户端用 localStorage 存储一份 JSON：

```typescript
type UnlockProgress = {
  unlockedGroups: string[];   // 已解锁的组 ID，如 ["three-kingdoms"]
  completedSeeds: string[];   // 已通关的种子 ID，如 ["red-cliffs-208"]
  tokens: number;             // 当前可用解锁代币数
};
```

**首次游戏**：`unlockedGroups` 为空 → 系统赠予 1 个代币等价物，玩家用它解锁第一个剧本组（选组界面）。此后该组内的种子可访问。

**加载游戏**：读取 `localStorage` 中的 `unlockProgress`，若无数据则视为新玩家走首次流程。

## 解锁循环

```
[首页] → 玩家选已解锁组 → 选组内种子 → 游玩 → 通关 ↓
                                        ↑            ↓
                                        │  代币 +1，回到首页
                                        │            ↓
                                        └── 若有未解锁组且 tokens > 0 → 提示解锁
```

### 流程拆解

1. **选起点**：新玩家见全部 13 组锁定，任选一组免费解锁，立即进入该组种子列表。
2. **游玩**：在已解锁组内随意选种子。不分死活结局，只要有结局报告即视为"通关"。
3. **获得代币**：通关时，若该种子尚未在 `completedSeeds` 中，`tokens += 1`，`completedSeeds` 追加该种子 ID。
4. **解锁新组**：玩家回到组选界面时若 `tokens > 0`，可选择消耗 1 个代币解锁任一未解锁组。
5. **重玩**：已通关种子可重玩，但不重复获得代币。

### 边界情况

| 场景 | 行为 |
|------|------|
| 新玩家、空存档 | 直接进入选起点界面 |
| 中途退出游戏 | 不算通关，无代币 |
| 所有组全解锁 | 不再提示解锁，代币溢出累积 |
| 同组内重复通关不同种子 | 每枚首次通关各获得 1 个代币 |
| 通关最后 1 枚可用种子 | 正常获代币，若已无可解锁组则不再解锁 |

## 前端改动范围（MVP）

- **新增 `useUnlockProgress`**：读取/写入 localStorage 的 hook，提供 `unlockGroup, completeSeed, canUnlock, remainingTokens` 等接口
- **组选界面**：替代当前首页的"全部种子直接浏览"模式，改为"组浏览 → 选组 → 选种子"两层结构
- **组卡片**：锁定组显示模糊预览 + 进度（如 2/8）→ 可解锁组额外显示解锁徽标

> MVP 不做任何新页面路由。组选界面可设计为覆盖现有胶片浏览的首页顶层层，组内种子列表复现现有胶片滚动 UI。

## 非 MVP 范围（记录但不实现）

- 服务器端存档同步
- 全通组徽章视觉特效
- 种子通关率/热力统计
- 组间剧情关联彩蛋
