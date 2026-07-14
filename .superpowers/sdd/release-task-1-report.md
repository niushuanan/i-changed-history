# Release Task 1 Report：百节点目录、公元前年代与本地图片

## Status

完成。历史目录从 50 项扩展为精确 100 项，其中中国 60、世界 40；新增 11 个公元前入口。100 个入口均有 schema-valid 固定第一幕与同名本地 WebP。年代格式统一支持公元前/公元，续幕权威年份不再暴露负数。

## RED evidence

先修改/新增测试，再写生产实现：

```text
npm test -- --run src/data/historySeeds.test.ts src/data/historicalYear.test.ts src/data/fixedOpenings.test.ts
Test Files 3 failed
Tests 6 failed | 3 passed
```

失败原因与需求一致：`historicalYear.ts` 不存在、目录仍为 50、BCE 节点不存在、固定开场仍为 50、缺少新增 50 张本地图片。

## GREEN evidence

实现后的定向测试：

```text
npm test -- --run src/data/historySeeds.test.ts src/data/historicalYear.test.ts src/data/fixedOpenings.test.ts
Test Files 3 passed
Tests 11 passed
```

年代接线相关回归：

```text
npm test -- --run src/services/deepseek.test.ts src/game/timelinePlan.test.ts src/game/prompts.test.ts
Test Files 3 passed
Tests 38 passed
```

100 项目录触发的旧 50 条 UI/资产测试先准确失败（189/194 通过），经协调批准只同步测试断言和罗马大火精确选卡，不改 picker/App 生产代码；定向回归 11/11 通过。

最终新鲜验证：

```text
npm test                       27 files / 194 tests passed
npm run typecheck              passed
npm run build                  passed (4694 modules transformed)
npm run check:portability      passed (75 runtime files scanned)
git diff --check               passed
```

资产核验：100 seeds、100 unique ids、11 BCE seeds、100 WebP、100 manifest rows，且每条 manifest 都包含 `id/articleUrl/filePage/artist/license/licenseUrl/sourceUrl/fallback`。

## Files changed

- 数据与年代：`src/data/historySeeds.ts`、`src/data/historicalYear.ts`、`src/data/fixedOpenings.ts`、`src/game/engine.ts`
- 核心测试：`src/data/historySeeds.test.ts`、`src/data/historicalYear.test.ts`、`src/data/fixedOpenings.test.ts`
- 必要旧契约同步：`src/services/deepseek.test.ts`、`src/data/visualAssets.test.ts`、`src/screens/SeedPickerScreen.test.tsx`、`src/App.integration.test.tsx`
- 图片管线：`scripts/fetch-history-images.mjs`、`package.json`、`package-lock.json`
- 资产与授权：新增 50 个 `public/assets/history/*.webp`，新增 `manifest.json`，由 manifest 重建 `CREDITS.md`，移除被 manifest 取代的 `fallbacks.json`

## Implementation notes

- 新增 30 个中国、20 个世界著名历史节点；制度类节点均落在签发、传令、刊行、开闸或表决的可执行时刻。
- `formatHistoricalYear(-221)` 输出 `公元前 221 年`，`formatHistoricalYear(1911)` 输出 `公元 1911 年`；固定开场保留正数卡片原有精确日期，BCE 与所有续幕权威年份使用统一格式。
- 图片脚本正则支持负年份；Wikipedia 与 Commons 查询按最多 40 个标题分批；Commons `imageinfo.extmetadata` 写入 manifest；只下载缺失图片；用 `sharp` 生成 900px WebP；单条失败使用年代 fallback 并记录原因；重复运行保留既有 fallback/metadata。

## Self-review

- 修正了图片脚本重复运行时可能丢失既有 fallback 记录的问题。
- 修正了离线元数据缺失时 CREDITS 可能出现空 source link 的问题。
- 确认未暂存其他 release task 的 `.superpowers/sdd/progress.md`。
- 按协调要求未修改 `AGENTS.md`、`PROJECT_CONTEXT.md`、README 或 design 文档；这些由 Release Task 5 统一收口。

## Concerns

当前执行环境连接 Wikipedia/Commons 超时，因此新增 50 张图按需求使用年代本地 fallback，manifest 的 `fallback.reason` 均明确记录 `article lookup failed: fetch failed`；现有 50 张缓存图保留。脚本在联网环境会补齐 Commons 艺术家/许可证/源文件元数据，但遵守“只下载缺失文件”，不会无故覆盖稳定资产。此次离线产物中，无法实时取得的 Commons 元数据字段为空，CREDITS 明确标记 `license metadata unavailable`，没有伪造授权信息。

## Reviewer follow-up：图片刷新、史实与 picker 修复

本节覆盖上方旧的离线图片结论。根因复现显示 Node `fetch` 在当前环境失败而 `curl` 可用；旧脚本又在检查 `previous.fallback` 之前把已存在文件当作永久缓存，导致 50 张年代占位图无法自行刷新。修复后 API 与图片抓取使用带超时和重试的 `curl`，所有 fallback、缺失归因和缺失文件都会重抓；Wikimedia 直连遭遇 429 时通过图片代理读取同一个 Commons `sourceUrl`。下载并发限制为 2（不超过 4），每张图经临时文件转码后原子替换。

最终资产核验为 100 manifest rows、100 WebP、100 unique SHA-256 hashes、0 fallback、0 incomplete attribution。每条记录均有 `articleUrl/filePage/artist/license/licenseUrl/sourceUrl`，`CREDITS.md` 由清单重新生成。新增测试覆盖 fallback 不得成为永久缓存、空归因拒绝、fallback 数量与重复哈希回归。

同时修正了 356 BCE 商鞅第一次变法、1347 墨西拿黑死病入港、1973 OAPEC 减产与随后禁运的史实表述；把开国大典广播接线、环球航行日志、联合国多语校对、卫星入轨确认改为会立即改变结果的决策杠杆。picker 的读数、刻度和 aria 均统一使用 `formatHistoricalYear`，导航标签更新为“一百个历史年份”。

本轮新鲜验证：

```text
npm test                       28 files / 199 tests passed
npm run typecheck              passed
npm run build                  passed (4694 modules transformed)
npm run check:portability      passed (77 runtime files scanned)
focused reviewer regressions   5 files / 17 tests passed
asset audit                    100 files / 100 unique hashes / 0 fallback / 0 incomplete
```

根据用户新增约束，本任务没有运行十局真实 DeepSeek soak；这里只执行自动化、类型、构建和 portability 验证。
