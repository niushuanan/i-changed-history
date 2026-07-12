# 《哎！我改变了历史》产品与技术设计

日期：2026-07-11  
状态：取代《不存在的时代》方案，已授权自主收敛并进入实施

## 1. 产品命题

《哎！我改变了历史》是一款移动端 AI 反事实历史推演游戏。玩家从一个真实历史转折点出发，连续做出五次干预，最终看到自己的选择如何改变几十年、几百年，直至另一个版本的 2026 年。

它不是历史问答，也不是让模型续写一篇小说。游戏的核心快感是：

- “如果当时不是这样，后来会怎样”的好奇心。
- 每次选择都有直接收益、意外受益者和被隐藏的代价。
- 模型必须把五次选择串成可解释的因果链，而不是随意跳到结局。
- 结局落到另一个 2026 年的普通生活，让宏大历史变得可感知、可分享。

产品名必须是首屏最强信号。首屏直接进入历史卡牌选择，不做营销落地页。

## 2. 开局：选择历史裂缝

玩家有两种开始方式，它们最终生成同一种 `HistorySeed`，后续游戏流程完全一致。

### 2.1 随机历史卡

本地内置 50 张经过人工筛选的真实历史转折卡。每次开局发出 5 张，玩家点击其中一张开始。

发牌规则：

- 五个时代桶各抽一张：古代、跨洲交流与中世纪、近代早期、工业时代、20 世纪至数字时代。
- 同一手牌最多一张以战争胜负为核心，至少两张来自科技、制度、文化、公共卫生或探索。
- 不出现 1840 年之后与中国相关的历史事件。
- 连续点击“换一批”不会在下一手立即重复上一手卡牌。
- 卡面只展示事实锚点和反事实钩子，不提前剧透可能结局。

每张卡包含：

```ts
type HistorySeed = {
  id: string;
  source: "curated" | "custom";
  era: "ancient" | "medieval" | "early-modern" | "industrial" | "modern";
  year: number;
  dateLabel: string;
  location: string;
  title: string;
  baselineFacts: [string, string, string];
  counterfactualPrompt: string;
  domain: "war" | "science" | "society" | "exploration" | "health" | "technology";
  visualKey: "ancient" | "exchange" | "print" | "revolution" | "industry" | "war" | "space" | "digital";
};
```

卡片文案示例：

- 公元前 323 年，巴比伦：`如果亚历山大再活二十年？`
- 1258 年，巴格达：`如果智慧宫的知识网络没有被摧毁？`
- 1843 年，伦敦：`如果分析机真的获得持续资助？`
- 1914 年，萨拉热窝：`如果那次刺杀失败？`
- 1993 年，日内瓦：`如果万维网从一开始就需要付费授权？`

### 2.2 自定义历史 Prompt

卡牌下方提供明确的“自己写一条历史裂缝”入口。展开后显示一个最多 140 个汉字的输入框，提示玩家同时写清：真实历史起点，以及想改变的关键事实。

示例占位文案：`例如：如果古罗马在公元一世纪就普及蒸汽动力……`

自定义内容作为数据写进模型请求，不直接拼进系统指令。开局请求先让模型提取真实历史锚点、时间、地点和反事实变化，再生成第一幕。

输入边界：

- 空白、纯情绪或没有历史起点的内容不能开始。
- 不接受 1840 年之后与中国相关的历史改写，界面给出中性提示并保留输入内容。
- 不接受针对现实中仍在世个人的伤害、仇恨、色情、恐怖主义或对暴行的操作性描述。
- 不以“你写错了”羞辱玩家；事实不确定时，模型明确标注“历史记录存在争议”，再选择保守锚点继续。

## 3. 五幕推演

玩家不是扮演某位历史名人，而是一个看不见的“历史干预者”。这样任何时代都能使用同一套交互，不需要为角色身份补大量固定设定。

### 第一幕：裂缝

时间范围为原历史节点到五年内。模型说明真实历史基线、玩家改写后最先倒下的那张多米诺骨牌，并给出三种继续干预方式。

### 第二幕：余震

时间推进五至二十年。原本的小变化进入权力、资源或社会结构，必须回收第一幕选择。

### 第三幕：新秩序

时间推进二十至五十年。新的制度、技术扩散或联盟形成，玩家面对第一次明显的道德代价。

### 第四幕：世界线

时间推进五十年至一百年以上。影响跨越原地点，改变至少两个地区或一个全球网络。

### 第五幕：此刻

时间抵达替代世界的 2026 年。玩家做最后一次选择，决定这个世界如何处理此前累积的最大矛盾。

每幕显示：

- 年份、地点和幕次。
- 一个不超过 150 字的关键局势。
- 上次选择造成的“直接结果”和“意外代价”。
- 三个立场真正不同的 AI 选择，每个选择包含动作和动机，但不提前显示数值后果。
- 一个独立的“自己改写这一步”入口，允许玩家输入最多 140 个汉字的自由干预。
- 四项世界指标：稳定、繁荣、自由、代价。
- 历史偏离度，由客户端使用固定公式计算，模型不得直接输出总分。

自由干预面板要求玩家同时选择干预力度：`微调`、`改写` 或 `颠覆`。这不是让模型评价玩家，而是给确定性偏离度公式提供输入。自由文本继续沿用现代中国历史和内容安全边界，并以 `untrustedPlayerIntervention` 字段传给模型。

## 4. 选择后的蝴蝶效应

每个 AI 选择都在当前幕的 JSON 中预先包含自己的即时回响。玩家点击后无需再次等待模型，立刻看到一张最少展示 1.8 秒、随后可主动继续的“蝴蝶效应”回响：

- `直接结果`：玩家原本想达成的事情发生了什么。
- `意外代价`：一个合理但未被玩家明确选择的后果。
- `谁获益` 与 `谁付出代价`：各一个具体群体。
- 四项世界指标的变化。
- 一条写入因果账本、后续必须引用的历史事实。

这一步是游戏感的关键。它把模型长文本变成即时反馈，也让玩家在下一幕开始前产生“我是不是做错了”的再选择冲动。

点击 AI 选择的同一时刻，前端立即开始请求下一幕；回响动画承担等待遮罩。自由干预无法预生成具体后果，因此先立即显示“你的干预已写入时间线”和本地计算的偏离度变化，再在后台生成下一幕。

## 5. 确定性历史偏离度

历史偏离度不是好坏评分，也不是可信度评分，只表示玩家世界线与原历史主干分离了多远。模型只能为三个 AI 选项各生成一个受约束的干预类别，必须恰好包含一次 `nudge`、一次 `reform`、一次 `rupture`；它不能输出偏离度数值。

前端基础点数：

```ts
const BASE_IMPACT = { nudge: 3, reform: 10, rupture: 22 } as const;
const CHAPTER_MULTIPLIER = [1, 1.15, 1.3, 1.45, 1.6] as const;

stepImpact = round(BASE_IMPACT[kind] * CHAPTER_MULTIPLIER[chapter - 1]);
nextDeviation = round(
  100 * (1 - (1 - currentDeviation / 100) * (1 - stepImpact / 100))
);
```

自由干预由玩家自己选择对应类别：微调=`nudge`，改写=`reform`，颠覆=`rupture`。这样相同选择路径永远得到相同偏离度，不依赖模型措辞，也不会因为重试而改变。

偏离阶段：

- 0-9：原史余波
- 10-29：蝴蝶分岔
- 30-54：新世界线
- 55-79：时代重写
- 80-100：完全异史

每次回响展示本步增加值和累计值。结局同时展示偏离度与模型生成的历史可信度，两者不得合并成一个“总分”。

## 6. 结局：我的另一个 2026

第五次选择后生成一份可保存的《平行世界头版》，内容包括：

- 这个世界的名称和一句头版标题。
- 五幕历史时间线，每一幕对应玩家真实选择。
- 三条完整因果链：起点、转化、最终兑现。
- 2026 年普通人的一天：工作、交通、通信或家庭生活中的三个具体细节。
- 最大进步、隐藏代价、最意外的文化细节。
- 最大受益群体和最大受损群体。
- 历史改写级别、可信度分数及一句解释。
- 第一人称分享句：`我让____没有发生，却创造了____。`

结局不以简单的“好世界/坏世界”裁决玩家。它必须同时给出收益和代价，促使玩家重玩同一张卡或换一段历史。

## 7. 五十张卡牌内容标准

数据集分为五组，每组十张：

1. 古代文明与知识：帝国继承、文字、工程、哲学和早期制度。
2. 跨洲交流与中世纪：贸易网络、瘟疫、大学、远航和知识保存。
3. 近代早期：印刷、宗教改革、科学革命、殖民接触和海权。
4. 工业时代：革命、公共卫生、计算、通信、能源和制度变迁。
5. 20 世纪至数字时代：世界大战的触发点、国际组织、太空、核风险、互联网和开放标准。

每张卡必须有三个简短、可核查的基线事实。卡片本身不宣称单一原因决定全部历史，反事实钩子使用“如果……”而不是“证明……一定会……”。

涉及战争、殖民、疾病和宗教时，卡片重点放在结构变化与人的代价，不以猎奇方式复刻伤亡。中国古代和前现代的科技、文化或交流节点可以出现；1840 年之后的中国历史全部排除。

## 8. AI 生成协议

模型：`deepseek-v4-flash`，JSON object，非流式。第一至第五幕使用非思考模式和短响应；只有最终总结开启 thinking enabled 与 reasoning effort high。

一局六次主要请求：第一幕一次、第二至第五幕各一次、结局一次。每次请求包含 `HistorySeed`、所有历史幕、所有选择、四项世界指标和因果账本。

系统只约束：

- 输出结构。
- 五幕时间范围与功能。
- 历史基线不能被静默改写。
- 新后果必须能从至少一个已有事实推导。
- 每幕必须明确收益和代价。
- 内容安全边界。

模型自由决定具体事件、人物群体、制度、技术、文化和结局。

### 8.1 每幕输出

```ts
type TimelineTurn = {
  timelineName: string;
  chapter: 1 | 2 | 3 | 4 | 5;
  chapterName: "裂缝" | "余震" | "新秩序" | "世界线" | "此刻";
  yearLabel: string;
  location: string;
  headline: string;
  narrative: string;
  baselineAnchor: string;
  previousEcho: null | {
    directResult: string;
    unexpectedCost: string;
    beneficiary: string;
    payer: string;
  };
  choices: [
    {
      id: "A";
      label: string;
      intent: string;
      deviationClass: "nudge" | "reform" | "rupture";
      instantEcho: { directResult: string; unexpectedCost: string; beneficiary: string; payer: string };
    },
    {
      id: "B";
      label: string;
      intent: string;
      deviationClass: "nudge" | "reform" | "rupture";
      instantEcho: { directResult: string; unexpectedCost: string; beneficiary: string; payer: string };
    },
    {
      id: "C";
      label: string;
      intent: string;
      deviationClass: "nudge" | "reform" | "rupture";
      instantEcho: { directResult: string; unexpectedCost: string; beneficiary: string; payer: string };
    }
  ];
  memorySummary: string;
  metrics: {
    stability: number;
    prosperity: number;
    freedom: number;
    cost: number;
  };
  metricDeltas: {
    stability: number;
    prosperity: number;
    freedom: number;
    cost: number;
  };
  causalLedger: Array<{
    fact: string;
    causedByChapter: number;
    mustAffect: string;
  }>;
  callbackUsed: string | null;
  visualTone: "ancient" | "exchange" | "print" | "revolution" | "industry" | "war" | "space" | "digital";
};
```

第一幕 `previousEcho` 为空。第二幕起必须填写它，并引用上一次实际选择。三个选择必须恰好覆盖三种 `deviationClass`。客户端限制指标到 0 至 100，并拒绝选项数量、ID 或干预类别不合法的响应。

### 8.2 结局输出

```ts
type AlternatePresent = {
  worldName: string;
  frontPageHeadline: string;
  historyTimeline: Array<{
    chapter: number;
    yearLabel: string;
    playerChoice: string;
    consequence: string;
  }>;
  causalChains: [
    { origin: string; transformation: string; payoff: string },
    { origin: string; transformation: string; payoff: string },
    { origin: string; transformation: string; payoff: string }
  ];
  ordinaryLife2026: [string, string, string];
  greatestGain: string;
  hiddenPrice: string;
  strangestDetail: string;
  biggestBeneficiary: string;
  biggestLoser: string;
  rewriteLevel: string;
  plausibilityScore: number;
  plausibilityReason: string;
  shareLine: string;
};
```

结局不得引入此前从未出现、却决定世界走向的新发明、战争或人物。

## 9. 响应速度与稳定性

- 幕间请求使用 `thinking: disabled`、`max_tokens: 1100`，目标是短 JSON 和快速首个完整响应。
- 结局请求才使用 `thinking: enabled`、`reasoning_effort: high`、`max_tokens: 1800`。
- 点击三个 AI 选择后立即用当前 JSON 的 `instantEcho` 呈现结果，同时发起下一幕请求。
- 发送给模型的历史只保留 `memorySummary`、玩家选择、因果账本和当前指标，不重复传输所有长正文。
- 请求期间显示具体历史处理短句，不使用空白转圈；完成后自动启用“继续时间线”。
- 单次请求 28 秒超时；429、5xx 和网络中断只重试一次，避免玩家在同一页等待过久。
- 若回响结束而下一幕仍未完成，保留偏离度和已选内容，显示可取消的生成态。

## 10. 稳定性与本地边界

- 当前版本按用户要求纯前端直连 DeepSeek。
- API Key 只写入被 Git 忽略的 `.env.local`；本地自用仍可在浏览器中查看它，不视为公开部署安全方案。
- Zod 校验全部模型输出；格式错误自动请求一次 JSON 修复。
- 429、5xx 和网络中断最多重试一次；28 秒超时。
- 选择后立即锁定按钮，使用请求 ID 丢弃旧响应。
- 每幕完成后写入版本化 `localStorage`，刷新可继续。
- 自定义 Prompt 作为 JSON 字段传递，并由系统提示词声明为不可信数据。
- API 失败时保留当前历史和选择，显示“重新推演这一幕”，不使用人工剧情冒充模型结果。

## 11. 配乐

- 使用一条本地许可清晰的史诗氛围循环音轨，目标压缩后不超过 2MB。
- 浏览器禁止自动播放，因此在玩家第一次选择历史卡或提交自定义背景时淡入播放。
- 默认音量 32%，循环播放；右上角始终提供 Phosphor 扬声器图标切换静音，并保存设置。
- 五幕逐步提高音量和低频存在感，但不得突然跳变；结局降低音量，为总结文案留空间。
- 音频加载失败不阻塞游戏，界面保持静音状态且不弹错误模态框。

## 12. 视觉与交互方向

视觉概念从“失落文明档案”升级为“时间线编辑室”：真实史料切片、档案红批、时间轴和反事实裂缝共同构成界面，但不能做成传统厚重羊皮卷或通用暗色科幻仪表盘。

首屏重点是五张历史卡牌和自定义入口：

- 品牌名《哎！我改变了历史》位于首屏上方，但不挤占卡牌浏览空间。
- 卡牌必须让年份、地点和“如果……”成为三秒内可扫描的信息。
- 五张牌允许横向滑动，当前牌完整露出并提示相邻内容。
- “换一批”使用图标按钮；“自己写一条历史裂缝”是次级文字命令。
- 卡片圆角不超过 8px，不做卡片套卡片。

事件页重点是“过去怎样被我推向另一个 2026”：

- 顶部稳定显示五幕时间轴和当前年份。
- 场景图占上部约 35%，正文和三个 AI 选择在下部。
- 四项世界指标紧凑显示，不能抢过事件标题。
- 第四个“自己改写这一步”是带铅笔图标的独立命令，不伪装成第四张 AI 选项卡。
- 历史偏离度固定在时间轴附近，每次回响后平滑增长，布局不能随数字变化跳动。
- 蝴蝶效应使用全屏短暂回响，不另开复杂页面。

结局页像一张被编辑过的 2026 年报纸头版，可导出 1080 x 1440 图片。

配色使用煤黑、新闻纸白、编辑朱红、氧化铜绿和信号黄。禁止渐变、装饰光球、紫蓝主调、嵌套卡片、emoji 和手绘 SVG。

实施前生成三张独立的 390 x 844 卡牌选择页视觉方案，自主选定一个；再以选定稿为参考生成事件页和结局页目标图。所有可见场景与时代缩略图使用 ImageGen 原创位图，图标使用 Phosphor Icons。

## 13. 前端架构

技术栈：React、TypeScript、Vite、Zod、Phosphor Icons、html-to-image、Vitest、Testing Library、Playwright。

模块：

- `src/data/historySeeds.ts`：50 张历史卡牌及抽牌算法。
- `src/game/types.ts`：`HistorySeed`、`TimelineTurn`、`AlternatePresent` 和局内状态。
- `src/game/schema.ts`：结构化响应解析与校验。
- `src/game/prompts.ts`：开局、续幕、结局和修复提示词。
- `src/game/deviation.ts`：确定性偏离度公式与阶段标签。
- `src/game/reducer.ts`：`selecting -> generating -> event -> echo -> ending -> result` 状态机。
- `src/services/deepseek.ts`：唯一模型 API 边界。
- `src/services/storage.ts`：恢复本局。
- `src/services/share.ts`：导出与系统分享。
- `src/services/audio.ts`：配乐启动、淡入、章节强度与静音持久化。
- `src/screens/*`：选卡、自定义 Prompt、事件、回响和结局。

应用以 390 x 844 为基准，移动端全屏；宽屏保持居中，不拉伸内容。所有核心按钮使用稳定尺寸，动态文本不推动整体布局发生跳变。

## 14. 测试与验收

单元测试：

- 数据集恰好 50 张、五时代各十张、没有 1840 年后中国事件。
- 每次发牌五时代各一张，上一手不立即重复。
- 自定义 Prompt 长度、空白与现代中国历史边界。
- JSON 提取、Zod 校验、指标限制和修复请求。
- 历史账本和玩家选择完整进入下一次 Prompt。
- 三种干预类别的偏离度公式、章节倍率、累计复合和阶段边界。
- 每幕三个 AI 选择恰好覆盖 `nudge/reform/rupture`，每项都含即时回响。
- 自由干预在任意幕可用，输入和力度都进入下一次 Prompt。
- 配乐只在用户手势后播放，静音状态可恢复，加载失败不阻塞。
- 五幕状态机、重复点击保护、刷新恢复和重开。

端到端测试：

- 选卡开始并完成五幕。
- 自定义 Prompt 开始并完成五幕，且至少在局中使用一次自由干预。
- 换一批、错误重试、刷新恢复和结局分享。
- 390 x 844 无横向滚动、遮挡、截断或离屏主操作。

真实 API 至少完成三局，其中一局使用自定义 Prompt。验收要求：

- 三局历史起点和结果明显不同。
- 第二幕起每幕引用至少一项此前选择或因果事实。
- 每幕同时出现收益和代价。
- 点击 AI 选择后即时显示回响，不能等待下一次模型响应才反馈。
- 三幕普通响应的中位等待时间目标低于 6 秒；任何一次超过 28 秒必须进入可重试错误态。
- 结局三条因果链能追溯到真实选择。
- 替代 2026 至少有三个普通生活细节，而不是只讲国家与战争。

选定 ImageGen 目标稿和同视口产品截图必须并排比较。`design-qa.md` 修复全部 P0、P1、P2 后，以 `final result: passed` 结束。

## 15. 本期不做

- 历史百科、答题评分或知识竞赛。
- 多人协作改写同一条时间线。
- 登录、云存档、排行榜和后台。
- 运行时图片生成。
- 对玩家的政治立场、道德或历史知识进行评价。
- 把前端内置 API Key 当作可公开上线的安全方案。

## 16. 决策记录

- 产品名最终确定为《哎！我改变了历史》。
- 开局由完全随机架空世界改为 50 张真实历史转折卡或玩家自定义 Prompt。
- 叙事对象由“一个人的一生”改为“一条世界时间线”，更直接发挥模型的因果推演能力。
- 结局统一抵达替代世界的 2026 年，增强现实对照和分享记忆点。
- 排除 1840 年之后的中国相关历史，其他时代保持全球视野。
- 每幕允许玩家跳出 AI 三选一，自由输入下一次历史干预。
- 历史偏离度采用前端固定公式；模型只生成受约束的干预类别和叙事内容。
- 普通回合关闭深度思考并预生成选项回响，以交互遮罩掩盖下一幕延迟；结局才开启深度推理。
- 游戏加入本地史诗氛围配乐，首个用户手势后播放。
- 用户继续授权设计与实施节点自主判断，不再逐项咨询。
