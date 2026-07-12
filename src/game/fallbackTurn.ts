import type { GameScenario } from "./reducer";
import type { PlayedTurn } from "./prompts";
import { alternatePresentSchema, timelineTurnSchema, type AlternatePresent, type TimelineTurn } from "./schema";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";

function previousEcho(playedTurns: readonly PlayedTurn[]): TimelineTurn["previousEcho"] {
  const previous = playedTurns.at(-1);
  if (!previous) return null;
  return previous.turn.choices.find((choice) => choice.id === previous.selectedChoiceId)?.instantEcho ?? null;
}

function visualTone(scenario: GameScenario, chapter: DecisionChapter): TimelineTurn["visualTone"] {
  if (chapter <= 3) return scenario.seed.visualTone;
  if (chapter <= 5) return "revolution";
  if (chapter <= 7) return "industry";
  if (chapter <= 9) return "exchange";
  return "digital";
}

const RELAY_STAGES: ReadonlyArray<{ role: string; location: string; topic: string; bridge: string }> = [
  { role: "现场善后记录员", location: "事发地的临时议事厅", topic: "消息如何被记录", bridge: "你的第一项选择改变了现场留下的证词，记录员接过这条线索" },
  { role: "跨城驿站译报员", location: "邻近交通枢纽", topic: "消息如何被传播", bridge: "一份被改写的记录沿交通线扩散，你在译报员身上接棒" },
  { role: "新一代地方账房", location: "区域商贸集市", topic: "资源开始重新流动", bridge: "一年后的贸易账目首次显出偏差，新一代账房接棒" },
  { role: "城市学堂教习", location: "远方城市学堂", topic: "观念进入下一代", bridge: "三年后制度余波进入教材，城市教习接棒" },
  { role: "工坊联合会书记", location: "新兴制造业城镇", topic: "技术与劳动重新组合", bridge: "十年后旧决定改变了订单与迁徙，工坊书记接棒" },
  { role: "水陆商路调查员", location: "区域水陆商港", topic: "影响进入日常贸易", bridge: "三十年形成的新商路改变民生日用，商港调查员接棒" },
  { role: "公共卫生统计员", location: "跨区域行政中心", topic: "普通人的寿命与城市", bridge: "百年后人口流动改变城市风险，统计员从异常数字中接棒" },
  { role: "大众广播编辑", location: "国际新闻编辑部", topic: "世界如何理解这段历史", bridge: "新的社会常识进入大众传播，广播编辑在争议稿件前接棒" },
  { role: "城市系统规划师", location: "平行世界核心城市", topic: "制度进入日常基础设施", bridge: "历代选择沉入城市规则，规划师在旧档案被重启时接棒" },
  { role: "青年历史档案员", location: "2026年前夕的公共档案馆", topic: "人类如何记住分岔", bridge: "所有余波汇入公共记忆，档案员成为抵达2026前的最后接棒者" },
];

export function createFallbackTurn(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: DecisionChapter,
): TimelineTurn {
  const node = getTimelineNode(chapter, scenario.seed.year);
  const previous = playedTurns.at(-1)?.turn;
  const echo = previousEcho(playedTurns);
  const yearLabel = chapter <= 3
    ? `${scenario.seed.dateLabel} · ${node.jumpLabel}`
    : `${node.targetYear}年 · ${node.jumpLabel}`;
  const objective = chapter === 1
    ? scenario.seed.decision
    : `决定上一项选择形成的新秩序，下一步由谁执行、由谁承担代价`;
  const relay = RELAY_STAGES[Math.max(0, chapter - 2)];

  return timelineTurnSchema.parse({
    timelineName: `${scenario.seed.eventName}异史`,
    chapter,
    chapterName: node.chapterName,
    yearLabel,
    location: chapter === 1 ? scenario.seed.location : relay.location,
    role: chapter === 1 ? scenario.seed.role : relay.role,
    identityBridge: chapter === 1 ? "你的现代意识直接进入这一历史现场" : relay.bridge,
    profileAdvantage: `你的现代${scenario.profile.strengths.join("与")}能力，能看出本代规则中的隐藏杠杆`,
    immediateObjective: objective,
    timePressure: chapter === 1 ? scenario.seed.urgency : `下一个时间窗口将在${node.jumpLabel}结束前关闭`,
    headline: chapter === 1 ? scenario.seed.eventName : `${node.jumpLabel}：${relay.topic}`,
    narrative: chapter === 1
      ? `你已经抵达${scenario.seed.location}。${scenario.seed.urgency}，眼前的人都在等待你对“${scenario.seed.decision}”作出决定。`
      : `上一项选择已经进入现实。你面前的命令、账册与人群都证明，新秩序带来了收益，也把代价转移给了另一批人。你必须决定下一步如何落地。`,
    baselineAnchor: scenario.seed.historicalOutcome,
    previousEcho: chapter === 1 ? null : echo,
    choices: [
      { id: "A", label: "保留现有安排，只修正最紧迫的漏洞", intent: "用小范围试点降低立即损失", deviationClass: "nudge", usesTravelerStrength: false, instantEcho: { directResult: "执行者获得了短暂喘息", unexpectedCost: "根本矛盾被推迟而没有消失", beneficiary: "当前秩序中的普通参与者", payer: "被延后补偿的边缘群体" } },
      { id: "B", label: "用现代经验建立公开规则", intent: "把个人决定变成可延续的制度", deviationClass: "reform", usesTravelerStrength: true, instantEcho: { directResult: "新的协商机制开始运转", unexpectedCost: "既得利益者组织起明确反对", beneficiary: "能进入新规则的人", payer: "失去特权的旧管理者" } },
      { id: "C", label: "废除旧约束，把决定权交给新的联盟", intent: "用不可逆的断裂换取全新路径", deviationClass: "rupture", usesTravelerStrength: false, instantEcho: { directResult: "旧命令体系立即失效", unexpectedCost: "秩序真空引发争夺与恐慌", beneficiary: "长期被排除的行动者", payer: "依赖旧体系生存的人" } },
    ],
    memorySummary: `第${chapter}节点沿着“${playedTurns.at(-1)?.selectedChoiceLabel ?? scenario.seed.decision}”继续分化。`,
    metrics: previous?.metrics ?? { stability: 50, prosperity: 50, freedom: 50, cost: 50 },
    metricDeltas: { stability: 0, prosperity: 0, freedom: 0, cost: 0 },
    causalLedger: [
      ...(previous?.causalLedger.slice(-3) ?? []),
      { fact: `时间线抵达${node.jumpLabel}`, causedByChapter: chapter, mustAffect: "下一节点的权力与普通生活" },
    ],
    callbackUsed: playedTurns.at(-1)?.selectedChoiceLabel ?? null,
    visualTone: visualTone(scenario, chapter),
  });
}

export function createFallbackEnding(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): AlternatePresent {
  const chosenEcho = (played: PlayedTurn) => played.turn.choices.find((choice) => choice.id === played.selectedChoiceId)?.instantEcho;
  const first = playedTurns[0];
  const middle = playedTurns[Math.floor(playedTurns.length / 2)];
  const last = playedTurns.at(-1);
  return alternatePresentSchema.parse({
    worldName: `${scenario.seed.eventName}之后的世界`,
    frontPageHeadline: `${scenario.profile.name}改变的时间线抵达 2026`,
    historyTimeline: playedTurns.map((played) => ({ chapter: played.turn.chapter, yearLabel: played.turn.yearLabel, playerChoice: played.selectedChoiceLabel, consequence: chosenEcho(played)?.directResult ?? played.turn.memorySummary })),
    causalChains: [first, middle, last].map((played) => ({ origin: played?.selectedChoiceLabel ?? scenario.seed.decision, transformation: played?.turn.memorySummary ?? scenario.seed.historicalOutcome, payoff: played ? (chosenEcho(played)?.unexpectedCost ?? "代价进入普通生活") : "历史仍保留原有惯性" })),
    ordinaryLife2026: ["学校会把这条分岔时间线列为基础历史课", "通勤与城市规则保留了早期选择形成的制度痕迹", "家庭新闻终端每天显示历史偏离度与公共代价"],
    greatestGain: chosenEcho(last ?? first)?.beneficiary ?? "进入新规则的普通人",
    hiddenPrice: chosenEcho(last ?? first)?.unexpectedCost ?? "制度改变留下长期协调成本",
    strangestDetail: "每个人的身份证都记录其家族第一次进入新时间线的年份",
    biggestBeneficiary: chosenEcho(middle ?? first)?.beneficiary ?? "新秩序参与者",
    biggestLoser: chosenEcho(middle ?? first)?.payer ?? "旧秩序维护者",
    rewriteLevel: "跨时代改写",
    plausibilityScore: 68,
    plausibilityReason: "总结严格沿用十一项玩家选择和即时后果，没有添加新的决定性事件。",
    shareLine: `我从${scenario.seed.eventName}开始，用十一项选择抵达了另一个 2026。`,
  });
}
