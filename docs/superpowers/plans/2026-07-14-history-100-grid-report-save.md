# 百节点、双浏览与结局保存 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将历史入口扩为 100 张（中国 60、世界 40），增加保持当前节点的两列网格与搜索筛选，压紧并放大 2026 报告，并让两份报告在移动端进入系统保存流程、桌面端下载完整高清 PNG。

**Architecture:** 百节点仍是唯一 `HistorySeed` 目录；目录纯函数负责年代格式、主题和筛选，选择页用一个受控 `PickerContext` 驱动胶片与网格两种渲染器。报告内容、排版和导出分别由 schema/prompt、`ResultFrontPage`/CSS、两阶段图片服务负责，均不进入游戏 reducer 或 DeepSeek 续幕状态机。

**Tech Stack:** React 19、TypeScript、Vitest/Testing Library、Zod、html-to-image、Phosphor Icons、Vite、Wikipedia/Commons API、Web Share API。

## Global Constraints

- 历史入口精确为 100 张：中国 60，世界 40；保留现有 50 张并新增 30 张中国、20 张世界。
- 每张卡必须是真实、著名、争议低的历史转折点，包含精确日期、地点、角色、立即决定、截止时间、实际结果与三条史实锚点。
- 模式 A 默认保留；模式 B 每行两张、上下滚动；两模式共享当前节点，筛选不改变当前节点。
- 搜索和筛选只属于选择页，不进入 `GameState`、存档、AI prompt 或十二节点生成逻辑。
- 每个新增 id 都必须有本地 `/assets/history/<id>.webp` 与可追溯图片授权记录；运行时不得使用远程图片。
- “2026，普通人的一天”只渲染一个自然段，不裁字；新生成的三个生活细节每项以 12—18 个中文字符为目标，必须是完整短句。
- 最终报告所有可见正文不低于 11px，不使用 line clamp、ellipsis 或强制 `1fr` 行制造空白。
- 导出当前页完整 `scrollWidth × scrollHeight`，`pixelRatio: 2`；移动端用新用户手势打开系统保存/分享，桌面端直接下载 PNG。
- 纯 Web 不声称拥有不存在的相册写权限，不把“打开系统面板”表述为“已经保存到相册”。
- 保留煤黑、新闻纸、朱砂、青绿、黄色视觉体系；不恢复人格、推荐、洗牌、档案弹窗或第二条时间线。

---

### Task 1: 百节点目录、公元前年代与本地图片

**Files:**
- Modify: `src/data/historySeeds.ts`
- Modify: `src/data/historySeeds.test.ts`
- Modify: `src/data/fixedOpenings.test.ts`
- Create: `src/data/historicalYear.ts`
- Create: `src/data/historicalYear.test.ts`
- Modify: `src/data/fixedOpenings.ts`
- Modify: `src/game/engine.ts`
- Modify: `scripts/fetch-history-images.mjs`
- Modify: `public/assets/history/CREDITS.md`
- Create/Modify: `public/assets/history/*.webp`
- Create: `public/assets/history/manifest.json`

**Interfaces:**
- Produces: `formatHistoricalYear(year: number): string`，负数输出 `公元前 N 年`，正数输出 `公元 N 年`。
- Produces: `HISTORY_SEEDS` 精确 100 项，现有公开导出不改名。
- Consumes: `moment(...)` 现有构造器与 `getFixedOpening(seed)`。

- [ ] **Step 1: 写目录、年代与图片完整性的失败测试**

```ts
expect(HISTORY_SEEDS).toHaveLength(100);
expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "china")).toHaveLength(60);
expect(HISTORY_SEEDS.filter((seed) => seed.perspective === "world")).toHaveLength(40);
expect(HISTORY_SEEDS.some((seed) => seed.year < 0)).toBe(true);
expect(formatHistoricalYear(-221)).toBe("公元前 221 年");
expect(formatHistoricalYear(1911)).toBe("公元 1911 年");
for (const seed of HISTORY_SEEDS) {
  expect(existsSync(join(process.cwd(), "public/assets/history", `${seed.id}.webp`))).toBe(true);
  expect(() => getFixedOpening(seed)).not.toThrow();
}
```

- [ ] **Step 2: 运行定向测试并确认 RED**

Run: `npm test -- --run src/data/historySeeds.test.ts src/data/historicalYear.test.ts src/data/fixedOpenings.test.ts`

Expected: FAIL，现有目录为 50、没有 `formatHistoricalYear`、新增图片不存在。

- [ ] **Step 3: 实现公元前年代格式并接入首幕/续幕**

```ts
export function formatHistoricalYear(year: number): string {
  return year < 0 ? `公元前 ${Math.abs(year)} 年` : `公元 ${year} 年`;
}
```

在 `fixedOpenings.ts`、`engine.ts` 以及所有客户端权威年份标签生成处使用该函数；已有带日期的 `seed.dateLabel` 保持原样。

- [ ] **Step 4: 追加精确 50 张著名事件**

中国新增 id/年份/事件：`east-zhou-770bc`(-770 周平王东迁)、`shang-yang-356bc`(-356 商鞅变法)、`changping-260bc`(-260 长平之战)、`qin-unification-221bc`(-221 秦统一六国)、`daze-uprising-209bc`(-209 大泽乡起义)、`han-founded-202bc`(-202 刘邦建立汉朝)、`zhang-qian-138bc`(-138 张骞出使西域)、`mobei-119bc`(-119 漠北之战)、`wang-mang-9`(9 王莽建新)、`kunyang-25`(25 昆阳之战)、`yellow-turban-184`(184 黄巾起义)、`shu-fall-263`(263 蜀汉灭亡)、`jin-unification-280`(280 西晋统一)、`northern-wei-439`(439 北魏统一北方)、`xiaowen-luoyang-494`(494 孝文帝迁都)、`grand-canal-605`(605 大运河开工)、`tang-founded-618`(618 李渊建唐)、`tang-fall-907`(907 唐亡)、`jin-founded-1115`(1115 阿骨打建金)、`yuan-name-1271`(1271 忽必烈定国号)、`ming-founded-1368`(1368 朱元璋建明)、`beijing-capital-1421`(1421 明迁都北京)、`longqing-trade-1567`(1567 隆庆开关)、`tiangong-kaiwu-1637`(1637《天工开物》刊行)、`nerchinsk-1689`(1689 尼布楚条约)、`hundred-days-1898`(1898 戊戌变法)、`wuchang-1911`(1911 武昌起义)、`may-fourth-1919`(1919 五四运动)、`prc-founded-1949`(1949 新中国成立)、`reform-opening-1978`(1978 改革开放决策)。

世界新增 id/年份/事件：`marathon-490bc`(-490 马拉松战役)、`alexander-gaugamela-331bc`(-331 亚历山大高加米拉)、`caesar-rubicon-49bc`(-49 凯撒渡过卢比孔河)、`edict-milan-313`(313 米兰敕令)、`charlemagne-800`(800 查理曼加冕)、`magna-carta-1215`(1215 大宪章)、`black-death-1347`(1347 黑死病抵达欧洲)、`gutenberg-bible-1455`(1455 古腾堡圣经)、`circumnavigation-1522`(1522 首次环球航行)、`watt-patent-1769`(1769 瓦特蒸汽机专利)、`declaration-1776`(1776 独立宣言)、`jenner-vaccine-1796`(1796 牛痘接种)、`meiji-1868`(1868 明治维新)、`wright-flight-1903`(1903 首次动力飞行)、`un-charter-1945`(1945 联合国宪章)、`india-independence-1947`(1947 印度独立)、`sputnik-1957`(1957 首颗人造卫星)、`oil-crisis-1973`(1973 石油危机)、`chernobyl-1986`(1986 切尔诺贝利)、`soviet-dissolution-1991`(1991 苏联解体)。

每项按现有 `moment()` 参数顺序填写具体现场；政策与制度事件必须落在一个可执行的签发、传令、刊行、开闸或表决时刻，不能只有宏观名称。

- [ ] **Step 5: 改造并运行图片抓取器**

抓取器必须支持负年份正则、按不超过 40 个标题分批查询、仅为缺失文件下载、用可跨平台 Node 图片库输出 900px WebP；从 Commons `imageinfo.extmetadata` 写入 `manifest.json` 的 `id/articleUrl/filePage/artist/license/licenseUrl/sourceUrl/fallback`，并由 manifest 生成 `CREDITS.md`。单条失败复制年代 fallback 且明确记录原因。

Run: `node scripts/fetch-history-images.mjs`

Expected: 输出 `requested: 100`，新增 50 个 id 均有本地 WebP，manifest 精确 100 项。

- [ ] **Step 6: 运行 GREEN 与资产重复检查**

Run: `npm test -- --run src/data/historySeeds.test.ts src/data/historicalYear.test.ts src/data/fixedOpenings.test.ts`

Run: `find public/assets/history -name '*.webp' | wc -l`

Expected: tests PASS；WebP 数量为 100。

- [ ] **Step 7: Commit**

```bash
git add src/data src/game/engine.ts scripts/fetch-history-images.mjs public/assets/history package.json package-lock.json
git commit -m "feat: expand history catalog to one hundred moments"
```

### Task 2: 保持上下文的胶片/网格浏览与筛选

**Files:**
- Create: `src/data/historyCatalog.ts`
- Create: `src/data/historyCatalog.test.ts`
- Create: `src/components/HistoryGridCard.tsx`
- Modify: `src/screens/SeedPickerScreen.tsx`
- Modify: `src/screens/SeedPickerScreen.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.integration.test.tsx`
- Modify: `src/styles/game.css`

**Interfaces:**
- Produces: `HistoryBrowseMode = "filmstrip" | "grid"`。
- Produces: `HistoryFilters = { query; period; region; theme }` 与 `filterHistorySeeds(seeds, filters)`。
- Produces: `PickerContext = { mode; activeSeedId; filters }`，由 `App` 持有并传给 `SeedPickerScreen`。
- Consumes: Task 1 的 `formatHistoricalYear` 与 100 项 `HISTORY_SEEDS`。

- [ ] **Step 1: 写纯筛选与模式上下文失败测试**

```ts
expect(filterHistorySeeds(HISTORY_SEEDS, EMPTY_FILTERS)).toEqual(browseHistorySeeds());
expect(filterHistorySeeds(HISTORY_SEEDS, { ...EMPTY_FILTERS, query: "武昌" })[0].id).toBe("wuchang-1911");
expect(filterHistorySeeds(HISTORY_SEEDS, {
  query: "", period: "bce", region: "china", theme: "military",
}).every((seed) => seed.year < 0 && seed.perspective === "china")).toBe(true);
```

组件测试先定位第 11 张，切到网格，断言同一 id 为 `aria-current`；组合筛选后清空仍回到该 id；进入游戏再退出仍为网格模式。

- [ ] **Step 2: 运行定向测试并确认 RED**

Run: `npm test -- --run src/data/historyCatalog.test.ts src/screens/SeedPickerScreen.test.tsx src/App.integration.test.tsx`

Expected: FAIL，目录模块、网格入口和受控上下文尚不存在。

- [ ] **Step 3: 实现目录纯函数**

```ts
export const EMPTY_FILTERS: HistoryFilters = {
  query: "", period: "all", region: "all", theme: "all",
};

export function filterHistorySeeds(seeds: readonly HistorySeed[], filters: HistoryFilters) {
  const query = filters.query.trim().toLocaleLowerCase("zh-CN");
  return [...seeds].sort(compareChronology).filter((seed) =>
    matchesQuery(seed, query) && matchesPeriod(seed, filters.period)
    && matchesRegion(seed, filters.region) && matchesTheme(seed, filters.theme));
}
```

主题固定映射为 `military/politics/economy/technology/culture`，每个现有和新增 domain 必须映射成功；不同维度 AND，同维度单选。

- [ ] **Step 4: 实现受控选择器与独立网格卡**

`SeedPickerScreen` 接收 `context` 与 `onContextChange`；胶片仅在 `mode === "filmstrip"` 渲染，网格仅在 `mode === "grid"` 渲染。时间轴线宽改为内容驱动，不再写死 `2058px`；ARIA 改为“一百个历史年份”。网格卡整卡按钮展示图片、格式化年份、标题、地点和主题，失败图仍走现有本地 tone fallback。

- [ ] **Step 5: 实现两列响应式视觉**

390px 下 `.history-grid__list { grid-template-columns: repeat(2, minmax(0, 1fr)); }`；筛选条在内容区顶部保持可见；所有按钮最小高 44px；当前节点用朱砂边框和 `aria-current`；空结果显示“没有符合条件的历史瞬间”和“清除筛选”。

- [ ] **Step 6: 运行 GREEN**

Run: `npm test -- --run src/data/historyCatalog.test.ts src/screens/SeedPickerScreen.test.tsx src/App.integration.test.tsx`

Expected: PASS，模式 A 仍有 100 张且模式 B 只渲染过滤后的网格卡。

- [ ] **Step 7: Commit**

```bash
git add src/data/historyCatalog* src/components/HistoryGridCard.tsx src/screens/SeedPickerScreen* src/App* src/styles/game.css
git commit -m "feat: add contextual grid browsing and filters"
```

### Task 3: 2026 单段生活与紧凑可读报告

**Files:**
- Modify: `src/components/ResultFrontPage.tsx`
- Create/Modify: `src/components/ResultFrontPage.test.tsx`
- Modify: `src/game/prompts.ts`
- Modify: `src/game/prompts.test.ts`
- Modify: `src/game/schema.ts`
- Modify: `src/game/schema.test.ts`
- Modify: `src/styles/game.css`
- Modify: `src/screens/AlternatePresentScreen.test.tsx`

**Interfaces:**
- Produces: `ordinaryLife2026` 仍是三个完整字符串的 tuple，渲染时用 `；` 合并为一个段落。
- Preserves: `AlternatePresent` 对外类型与两报告页签。

- [ ] **Step 1: 写单段、完整句和无截断失败测试**

```tsx
const paragraph = screen.getByRole("paragraph", { name: "2026普通人的一天" });
expect(paragraph).toHaveTextContent(result.ordinaryLife2026.join("；"));
expect(screen.queryByRole("list", { name: /普通人的一天/ })).not.toBeInTheDocument();
```

schema/prompt 测试断言提示词要求每项 12—18 字完整短句；解析不会对 `ordinaryLife2026`、时代叙事、结尾做本地字符切片。

- [ ] **Step 2: 运行定向测试并确认 RED**

Run: `npm test -- --run src/components/ResultFrontPage.test.tsx src/game/prompts.test.ts src/game/schema.test.ts src/screens/AlternatePresentScreen.test.tsx`

Expected: FAIL，当前为三列 `<ul>` 且 normalize 仍会 `trimBounded`。

- [ ] **Step 3: 实现单段语义与生成约束**

```tsx
<section className="world-report__ordinary">
  <h2>2026，普通人的一天</h2>
  <p aria-label="2026普通人的一天">{result.ordinaryLife2026.join("；")}</p>
</section>
```

prompt 改为“恰好三个互不重复、每项 12—18 字的完整生活短句”；schema 允许适度完整超限并以字段修复处理，不在 normalize 中 `slice` 或 `trimBounded` 可见文案。

- [ ] **Step 4: 收敛报告 CSS**

删除同一选择器的旧 7—9px、clamp、ellipsis、`repeat(4, 1fr)` 规则，保留一套内容驱动样式。时代列表列宽收紧为 `24px 82px minmax(0,1fr)`，正文/继承变化至少 11/12px；普通生活单段 12px、紧凑行高；结尾正文与分享句提高到 14px。两页 capture 都允许完整纵向滚动。

- [ ] **Step 5: 运行 GREEN**

Run: `npm test -- --run src/components/ResultFrontPage.test.tsx src/game/prompts.test.ts src/game/schema.test.ts src/screens/AlternatePresentScreen.test.tsx`

Expected: PASS，三项只存在于一个自然段，完整文本无本地截断。

- [ ] **Step 6: Commit**

```bash
git add src/components/ResultFrontPage* src/game/prompts* src/game/schema* src/screens/AlternatePresentScreen.test.tsx src/styles/game.css
git commit -m "feat: tighten and clarify the 2026 report"
```

### Task 4: 移动系统保存与桌面完整 PNG 下载

**Files:**
- Modify: `src/services/share.ts`
- Modify: `src/services/share.test.ts`
- Modify: `src/screens/AlternatePresentScreen.tsx`
- Modify: `src/screens/AlternatePresentScreen.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/game.css`

**Interfaces:**
- Produces: `prepareReportImage(node, content): Promise<PreparedReportImage>`。
- Produces: `sharePreparedReport(prepared): Promise<"shared" | "cancelled" | "unsupported">`。
- Produces: `downloadPreparedReport(prepared): "downloaded"` 与 `disposePreparedReport(prepared): void`。
- `PreparedReportImage` 至少含 `blob/file/objectUrl/fileName/page`。

- [ ] **Step 1: 写完整尺寸、两阶段保存与状态失败测试**

```ts
Object.defineProperties(node, {
  scrollWidth: { value: 390 }, scrollHeight: { value: 1800 },
});
await prepareReportImage(node, content, deps);
expect(renderToBlob).toHaveBeenCalledWith(node, expect.objectContaining({
  width: 390, height: 1800, pixelRatio: 2,
}));
```

屏幕测试断言：移动端第一次点击后出现“图片已准备好”“打开系统保存”“下载 PNG”；第二次点击才调用分享；取消仍保留 prepared；桌面端第一次点击后直接显示“PNG 已下载”；切换页签会 dispose 旧图片。

- [ ] **Step 2: 运行定向测试并确认 RED**

Run: `npm test -- --run src/services/share.test.ts src/screens/AlternatePresentScreen.test.tsx`

Expected: FAIL，当前单函数没有完整滚动尺寸或 prepared 状态。

- [ ] **Step 3: 实现完整高清图片准备**

```ts
const width = node.scrollWidth;
const height = node.scrollHeight;
const blob = await renderToBlob(node, {
  backgroundColor: "#efede6", cacheBust: true, pixelRatio: 2, width, height,
  style: { overflow: "visible", height: `${height}px`, maxHeight: "none" },
});
```

文件名必须包含当前页名；所有 object URL 在切页、重试、重开游戏和卸载时回收。

- [ ] **Step 4: 实现平台分流与友好文案**

通过 pointer/coarse 与 user agent client hint 的可测试封装识别移动 Web。桌面自动 `downloadPreparedReport`。移动端生成后显示：“图片已准备好。点击后请在系统面板选择‘存储图像/保存到相册’；若没有该选项，可下载 PNG。”分享调用只发生在第二次点击处理器内；`AbortError` 显示“已取消，图片仍可保存”。

- [ ] **Step 5: 运行 GREEN**

Run: `npm test -- --run src/services/share.test.ts src/screens/AlternatePresentScreen.test.tsx src/App.integration.test.tsx`

Expected: PASS，列传与 2026 当前页均能保存，状态语义准确。

- [ ] **Step 6: Commit**

```bash
git add src/services/share* src/screens/AlternatePresentScreen* src/App* src/styles/game.css
git commit -m "feat: save complete reports across mobile and desktop"
```

### Task 5: 持久产品决策、项目上下文与浏览器验收

**Files:**
- Modify: `AGENTS.md`
- Modify: `PROJECT_CONTEXT.md`
- Modify: `README.md`
- Modify: `design-qa.md`

**Interfaces:**
- Documents: 100/60/40、胶片/网格双模式、筛选、移动系统面板与桌面下载的真实边界。

- [ ] **Step 1: 更新持久决策**

删除“只能有一个浏览布局、禁止筛选”的旧规则，替换为：100 张卡全部存在于同一目录，模式 A 横向胶片与模式 B 两列网格共享同一当前节点；模式 B 提供搜索、年代、地域、主题筛选。同步把所有 50/30/20 文案更新为 100/60/40。

- [ ] **Step 2: 更新项目上下文**

重新核对 `PROJECT_CONTEXT.md` 的项目说明、结构和关键入口；以当前本地分钟新增“本次任务 / 改了哪些文件 / 改了什么 / 为什么这样改 / 影响模块 / 验证”完整条目。

- [ ] **Step 3: 运行完整自动化验证**

Run: `npm test -- --run`

Run: `npm run typecheck`

Run: `npm run build`

Run: `npm run check:portability`

Run: `git diff --check 5b6acf7..HEAD`

Expected: 全部 exit 0，无失败、类型错误、构建错误、开发者绝对路径或空白错误。

- [ ] **Step 4: 运行真实浏览器验收**

启动本 worktree Vite 服务并打开预览。在 390×844 验证：模式 A 下一卡预览、100 年份、A→B→A 同节点、两列网格、搜索和组合筛选、空结果清除、选卡固定首幕、退出恢复网格；注入完成结局后验证 2026 单自然段、四时代紧凑可读、两页可滚至末句、移动保存准备态。桌面宽度验证网格两列仍协调、普通生活约两行、保存直接触发完整 PNG 下载。记录截图到 `design/` 或 `output/playwright/`，不要提交临时浏览器日志。

- [ ] **Step 5: Final commit**

```bash
git add AGENTS.md PROJECT_CONTEXT.md README.md design-qa.md
git commit -m "docs: record the hundred-moment release"
```
